## General

1. Always follow Laravel Boost conventions.
2. Keep controllers slim; put all business logic in Service classes.
3. Use strict typing in PHP and TypeScript.
4. Use Form Requests for validation; never validate manually in controllers.
5. Use Enums instead of hardcoded strings wherever possible.
6. Use Carbon for date calculations; respect Israeli week (Sunday-Saturday) for filtering.
7. Generate code incrementally, avoid large monolithic outputs.

## PHP

1. Prefer `match` over `switch`.
2. Place Enums in `app/Enums` and cast columns to Enums in models.
3. Use Enum values as defaults in migrations.
4. Avoid unnecessary temporary variables.

## Laravel

1. Inject Services per method if used once; inject in constructor if used multiple times.
2. Use Laravel helpers instead of manually importing classes (`auth()`, `redirect()`, `str()`, etc.).
3. Observers: register via PHP Attributes in Models, not in AppServiceProvider.
4. Blade: use `@selected()`, `@checked()`, and `@session()` directives.
5. Use `Route::view()` for single-method views instead of creating a controller.

## Testing

1. Write Pest tests for all new features.
2. Test realistic states; check defaults, nullable fields, relationships.

## UI (Shadcn)

2. In Shadcn components, keep forms, tables, dialogs clean and reusable.
