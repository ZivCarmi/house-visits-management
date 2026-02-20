# Home Visits Management System -- AI & Laravel Boost Optimized Specification

## 1. Project Overview

This is a Home Visit Management System for a dietitian.

The system tracks patients and determines when follow-up visits are due
based on a defined follow-up frequency.

This project is built with AI collaboration in mind (Cursor) and follows
Laravel best practices using Laravel Boost conventions.

---

## 2. Current Project State

The Laravel project has already been created using:

composer create-project laravel/laravel house-visits-management

Laravel Boost has already been installed.

By default, Laravel is currently configured to use SQLite (this is
normal in new Laravel installations).

---

## 3. Required Stack Setup

### Backend

- Laravel (latest stable)
- Laravel Boost (installed)
- SQLite (default DB for development)

### Frontend

- Inertia.js
- React (with TypeScript)
- TailwindCSS v4
- Shadcn UI

---

## 4. Required Installation Steps (Frontend)

Install Inertia + React:

php artisan inertia:install react

Install dependencies:

npm install

Ensure TypeScript is enabled.

Install Shadcn UI according to official documentation after Tailwind is
configured.

---

## 5. Database Configuration

Laravel default .env likely contains:

DB_CONNECTION=sqlite

Ensure database file exists:

database/database.sqlite

If not:

touch database/database.sqlite

Run migrations:

php artisan migrate

SQLite is sufficient for this internal tool.

---

## 6. Database Schema

### Patients Table

Column Type Rules

---

id bigint Primary
full_name string Required
id_number string Required
address string Required
phone string Required
feeding_type enum Default = PO
last_visit_date date Required
followup_frequency enum Required
next_visit_date date Auto-calculated
notes text Optional
created_at timestamp  
 updated_at timestamp

---

## 7. Enums

### Feeding Type

- PO (DEFAULT)
- PEG
- PEJ
- PZ
- TPN

If feeding_type is null → default to PO.

### Follow-up Frequency

Value Interval

---

weekly 7 days
biweekly 14 days
monthly 1 month
bimonthly 2 months
quarterly 3 months
semiannual 6 months

---

## 8. Business Logic

### Next Visit Calculation

next_visit_date = last_visit_date + interval_based_on_frequency

Recalculate when: - Creating patient - Updating patient - Changing
last_visit_date - Changing followup_frequency

Use Carbon.

Business logic must live inside:

app/Services/VisitCalculationService.php

Never inside controllers.

---

## 9. Filtering Logic (Israel Calendar Week)

Week definition: - Week starts Sunday - Week ends Saturday

Use: startOfWeek(Carbon::SUNDAY) endOfWeek(Carbon::SATURDAY)

Filter options:

Label Logic

---

Weekly (This Week) next_visit_date within current week
Monthly next_visit_date within current calendar month
Overdue next_visit_date \< today
All No filtering

Filtering must be dynamic based on current date.

---

## 10. Backend Structure (Boost-Friendly)

app/ ├── Enums/ │ ├── FeedingType.php │ └── FollowUpFrequency.php ├──
Models/ │ └── Patient.php ├── Http/ │ ├── Controllers/ │ │ └──
PatientController.php │ ├── Requests/ │ │ └── PatientRequest.php ├──
Services/ │ └── VisitCalculationService.php

Routes:

Route::resource('patients', PatientController::class);

---

## 11. Frontend Structure

resources/js/ ├── components/ │ ├── ui/ │ ├── patients/ │ │ ├──
PatientTable.tsx │ │ ├── PatientForm.tsx │ │ ├── PatientDialog.tsx │ │
├── PatientFilters.tsx │ │ └── columns.ts ├── pages/ │ └── Patients/ │
└── Index.tsx ├── hooks/ │ └── usePatientFilters.ts ├── types/ │ └──
patient.ts ├── utils/ │ └── dateHelpers.ts └── layouts/ └──
AppLayout.tsx

---

## 12. Goal

Build a clean, maintainable, AI-friendly Laravel + React system that
follows Boost conventions and Laravel best practices.
