# Build stage: PHP + Composer + Node for assets
FROM php:8.2-bookworm AS builder

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libpq-dev \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    pdo_mysql \
    mbstring \
    zip \
    intl \
    opcache \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install Node 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy application ( .dockerignore excludes node_modules, vendor, .env )
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Install Node deps and build assets
RUN npm ci && npm run build

# Production stage
FROM php:8.2-bookworm

RUN apt-get update && apt-get install -y \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libpq-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    pdo_mysql \
    mbstring \
    zip \
    intl \
    opcache \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy application code (no node_modules or vendor from context - in .dockerignore)
COPY . .

# Copy vendor and built assets from builder
COPY --from=builder /app/vendor ./vendor
COPY --from=builder /app/public/build ./public/build

# Ensure storage is writable
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Render sets PORT at runtime
ENV PORT=10000
EXPOSE 10000

# PORT is set by Render at runtime; defaults to 10000 if unset. Migrations run on every start (Release Command not available on free tier).
CMD ["sh", "-c", "php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]
