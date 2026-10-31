# DEAL House Admin + Leads (31 October 2026)

## What changed
The existing /admin now includes leads received by /api/enquiries. Search by name, phone or email; filter status; add an assignee and follow-up notes; export up to 10,000 filtered rows to CSV. Lead IDs, project IDs, prices and enquiry consent rules are unchanged. Original messages are preserved. Existing contact details, share percentages and budget appear in the request details.

Missing tables are created idempotently on first form submission or admin authentication. Existing enquiries are not deleted or altered. The included additive SQL files can also be run manually if the database rejects automatic schema creation. The DB binding and Database ID have not changed.

## One-time activation
1. Let the existing GitHub -> Cloudflare build finish.
2. Set the Worker secret ADMIN_PASSWORD yourself (at least 16 characters, recommended random 32); do not commit it to GitHub. If it is already configured, keep the existing value.
3. Open the website's /admin path over HTTPS and log in. The session lasts 8 hours. This version has one administrator password, not separate staff roles.
4. Open the public site, submit a clearly marked TEST enquiry with consent, and confirm the reference appears in /admin -> ผู้สนใจโครงการ. Also confirm the same ID directly in D1 enquiries. We have not run this production test or accessed production credentials from this task.
5. For visitor analytics, allow usage statistics on a test visit; then navigate/click/scroll/start a form/submit it and inspect the dashboard. Statistics apply only to consenting visitors and are not unique-person counts. The persisted lead total counts all accepted forms regardless of analytics consent. Do not interpret the two metrics as the same denominator.

## Data and behavior
- Statuses: new, contacted, following, won, lost. Old leads without a workflow row appear as new.
- Assignee is a free text label, not a staff account or access control setting.
- Follow-up saves use revisions: conflicting edits return 409 instead of silently overwriting.
- A form succeeds only after an insert and a read-back of its reference. Retry with the same request ID/data does not duplicate records.
- Existing content draft/publish/history and image editing remain available. No new page-builder capability is claimed.
- Form_start/form_success analytics do not include form text or contact information. They are browser measurements; lead totals come from the enquiries table.
- Customer data is served only through authenticated admin endpoints; no customer records or secrets are included in source code.

## Validation
Passed TypeScript, production build and tests/admin-integration.cjs. Tests execute the actual handlers against an in-memory SQLite D1 adapter: empty database bootstrap; submit -> persisted row -> authenticated admin read; duplicate retries; invalid consent; workflow revision conflicts; search/status filtering/CSV; authentication/origin checks; draft/publish; analytics and image upload/read.
Not verified in this task: production D1 records, Cloudflare deployment success, browser visual QA and HTTPS cookie flow on the live domain. GitHub code upload is not evidence of a completed Cloudflare deployment.

Run locally with existing dependencies:
    pnpm exec tsc --noEmit
    node tests/admin-integration.cjs
    pnpm run build
