# ---------------------------------------------------------------------------
# Stage 1: Build environment – PHP extensions, Composer, Node, and assets
# Based on: https://docs.docker.com/guides/frameworks/laravel/production-setup/
# ---------------------------------------------------------------------------
FROM php:8.2-bookworm AS builder

# System deps and PHP extensions for Laravel (MySQL/PostgreSQL). No standalone "pdo" – PDO comes with pdo_*.
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    git \
    libpq-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    pdo_pgsql \
    mbstring \
    intl \
    zip \
    opcache \
    bcmath \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Node 20 for Vite build
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy full app before composer (scripts may need artisan, etc.)
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist \
    && npm ci && npm run build

# ---------------------------------------------------------------------------
# Stage 2: Production – runtime only; copy extensions from builder
# ---------------------------------------------------------------------------
FROM php:8.2-bookworm AS production

# Runtime libs required for the copied PHP extensions to load (guide keeps -dev for ABI compatibility)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    libicu-dev \
    libzip-dev \
    libonig-dev \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy compiled PHP extensions and config from builder (no re-install in production)
COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/
COPY --from=builder /usr/local/bin/docker-php-ext-* /usr/local/bin/

# Production PHP config
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

WORKDIR /app

# App code from context ( .dockerignore excludes node_modules, vendor, .env )
COPY . .

# Vendor and built assets from builder
COPY --from=builder /app/vendor ./vendor
COPY --from=builder /app/public/build ./public/build

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

USER www-data

ENV PORT=10000
EXPOSE 10000

CMD ["sh", "-c", "php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]
