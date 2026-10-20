# Validation

Completed in the creation environment:

- Vite production build and deployment-folder packaging.
- Server-side rendering checks for nine React routes, including login, signup, protected account/admin routes, public pages and contact details.
- Direct render of the administrator property form.
- PHP 8.3 syntax parsing of all five PHP source files with the php-parser package.

Not completed here:

- Native PHP execution and end-to-end MySQL tests. PHP/MySQL could not be installed in this environment, so authentication/database operations have not been exercised against a live database.
- Browser-based visual and interaction testing.
- Live deployment to PHP-capable hosting.

Before using this on a live domain, follow README.md in XAMPP: create a separate database, create an admin, add/edit/delete a draft and an available listing, sign up as a customer, check that customer accounts cannot enter the admin page or call admin endpoints, submit an enquiry, and verify that it appears in both customer history and the admin enquiry list. Confirm logout and login persistence after refreshing. Use HTTPS and secure cookies for production.
