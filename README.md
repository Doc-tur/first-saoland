# First Saoland — React + PHP + MySQL

A complete website package for First Saoland Homes and Investment Limited, based at 16, Oshikomaya Street, Ketu Ikosi CMD Road, Ketu, Lagos.

## Included

- React/Vite frontend with separate pages, responsive navigation and saved favourites.
- Customer signup/login/logout using PHP sessions; passwords are hashed, never stored as plain text.
- Admin-only property creation, editing and deletion; draft, available, sold and rented statuses.
- Property fields: title, description, NGN price/period, type, purpose, category, location, image URL, bedrooms, bathrooms, area, features and featured/example flags.
- Public search, filters, sort and pagination from MySQL (no hardcoded listing fallback).
- Enquiries saved to MySQL, customer enquiry history and admin status management.
- Phone/email links updated to the supplied company details, with a single WhatsApp number.
- SQL schema, administrator setup command and optional illustrative sample listings.

## Requirements

PHP 8.1+ with `pdo_mysql`, MySQL 8+ or MariaDB 10.4+, and Node.js 20.19+ or 22.12+. XAMPP with PHP 8.1/8.2 is suitable for local use. No Composer dependencies are required. The PHP server and frontend must share one origin; development uses Vite's API proxy.

## Easiest setup: XAMPP (Windows)

1. Extract the ZIP and open the `first-saoland-php-mysql` folder in VS Code.
2. Start **Apache** and **MySQL** in XAMPP.
3. Open `http://localhost/phpmyadmin`, choose **Import**, and import `backend/database/schema.sql`. It creates a separate **first_saoland_php** database. This is a fresh schema; do not import it over an older Express/MySQL database expecting an automatic migration.
4. Copy `backend/server/config.example.php` to `backend/server/config.php`. XAMPP's defaults are usually host `127.0.0.1`, user `root`, blank password and port `3306`. Adjust to your installation.
5. In the VS Code terminal, run:

   ```powershell
   npm install
   npm run build:deploy
   ```

6. Copy the entire generated `deploy` folder into `C:\xampp\htdocs\first-saoland`. Its structure must be:

   ```text
   first-saoland/
     public/     (index.html, assets, api/index.php)
     server/     (PHP code and database configuration)
     database/   (schema)
   ```

7. In `C:\xampp\htdocs\first-saoland\server`, copy `config.example.php` to `config.php` and set the same database details. `build:deploy` deliberately excludes private config files.
8. Create your administrator in a private terminal:

   ```powershell
   C:\xampp\php\php.exe C:\xampp\htdocs\first-saoland\server\create-admin.php
   ```

   Enter a name, an email and a password of 10–72 bytes at the prompts. There is no hardcoded/default admin password. The password is visible while typing in this simple CLI, so use a private terminal. If the email already belongs to a customer, use a different admin email; public signup never promotes accounts to admin.
9. Open **http://localhost/first-saoland/public/**. Use **Log in** with your admin account; you are taken to **Admin dashboard**. You can also visit `/#/admin` after the public folder URL.
10. Add a property. New entries default to **draft**. Set **available** to publish it in the public catalogue. Ordinary signups create customer accounts and cannot edit properties.

Optional example listings, after creating the administrator:

```powershell
C:\xampp\php\php.exe C:\xampp\htdocs\first-saoland\server\seed-demo.php
```

Examples are labelled and have no claimed market price. Skip this on a live site unless you want illustrative content.

## Develop with Vite

Import the SQL and configure `backend/server/config.php` as above. Open two terminals at the project root:

```powershell
# Terminal 1 (XAMPP PHP; keep MySQL running)
C:\xampp\php\php.exe -S 127.0.0.1:8080 -t backend/public

# Terminal 2
npm install
npm run dev
```

Open the URL Vite prints, typically `http://localhost:5173`. Vite proxies `/api` to PHP on port 8080, so cookies and CSRF checks work without CORS changes. On Linux/macOS with PHP on PATH, replace the XAMPP executable with `php`.

Create the local development admin using `php backend/server/create-admin.php`. If a signup or login reports server unavailable, check PHP output, database credentials and that the SQL was imported.

## Production hosting

Run `npm run build:deploy`. Upload `deploy/public` and `deploy/server` to PHP-capable hosting, preserving their sibling relationship. Set the domain document root to the **public** directory so server files remain outside web access. Copy the config example to config.php, use a dedicated MySQL database user and set `secure_cookies` to **true** behind HTTPS. Import the schema, then create the administrator using the hosting terminal.

The packaged `server/.htaccess` denies direct access under Apache as an additional guard, but do not rely on this with non-Apache hosting. Production must use `public` as the document root. Configure PHP error logging outside the public folder and keep display_errors off. Back up the database and use HTTPS.

The PHP/MySQL backend does **not** run on ordinary Vercel static hosting or the static Sites preview. To keep the frontend on a separate provider you would need a deliberate cross-origin cookie/CORS design; the supplied package uses simpler same-origin PHP hosting. The existing hosted frontend preview has not been changed to pretend this backend is live.

## Structure

- `src/pages`: public pages, AuthPage, Account, Admin.
- `src/context/Auth.jsx`: current session and login/signup/logout.
- `src/lib/api.js`: same-origin API client and CSRF header handling.
- `backend/public/api/index.php`: JSON API entrypoint, no rewrite rules needed.
- `backend/server/bootstrap.php`: PDO, session helpers, validation, CSRF, throttling and property mapping.
- `backend/server/config.example.php`: database settings template.
- `backend/database/schema.sql`: fresh schema.
- `scripts/package-deploy.mjs`: makes `deploy/public`, `deploy/server` and `deploy/database`.
- `public/assets`: bundled illustrative photography.

All frontend routes use HashRouter, so refreshes work in XAMPP subfolders. For example `http://localhost/first-saoland/public/#/signup`. The API is `api/index.php?route=session`, `...route=properties`, etc.

## Main API endpoints

All paths below are the value of the `route` query parameter:

| Method | Route | Access |
| --- | --- | --- |
| GET | session | Public; returns session user and CSRF token |
| POST | auth/signup, auth/login, auth/logout | CSRF required |
| GET | properties, properties/:id | Public; drafts excluded |
| GET | admin/properties | Admin |
| POST | admin/properties | Admin + CSRF |
| PUT, DELETE | admin/properties/:id | Admin + CSRF |
| POST | inquiries | Logged in + CSRF |
| GET | inquiries | Current user's enquiries only |
| GET | admin/inquiries | Admin |
| PATCH | admin/inquiries/:id | Admin + CSRF |

Public lists accept q, type, purpose, sort (az/za/default), page, limit (max 100) and saved IDs. Enquiry lists use 20 rows per page. Server-side role checks are authoritative; browser route guards only control navigation.

## Boundaries

Images use URLs or bundled `/assets/...` paths; image file uploads are not included. Saved favourites remain in the visitor's local browser, while users, properties and enquiries are stored in MySQL. Enquiries are stored for administrator follow-up, not sent as email. Password resets, email verification and email delivery are not included. Deleting a property removes the listing permanently while preserving enquiry text. There is no automatic migration from the Express starter; use the separate database above.

Requests use prepared SQL statements, HttpOnly SameSite session cookies, a rotating session ID on login/signup, CSRF tokens for writes, explicit admin checks, request-size limits and database-backed attempt throttling. The public signup endpoint ignores any requested role. Account and database credentials are excluded from the distributable and Git ignore rules.

See VALIDATION.md for the checks completed and the live PHP/MySQL verification still needed.
