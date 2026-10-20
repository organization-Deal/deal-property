## Custom ownership calculator — 11 October 2026

Supersedes earlier removal of percentage presets: at the owner’s explicit request, offer 10/20/30/50% presets and custom 10–100% input (up to two decimals). Calculate against 1,712,000 THB including tax; 13% = 222,560 THB. Carry the share and computed price to the enquiry record. This calculator does not assert current availability of each fraction. No database schema change.

## Customer handoff pass — October 11, 2026
Current implementation supersedes earlier illustrative share selector: only co-owner starting price and whole-house mode remain; no 20/30/50 controls or implied inventory. New project summary, compact decision copy, no repeated standalone gallery or repeated care section on detail page. Request form extracted; shared ownership preference, optional additional fields, client/server validation, international phones, copyable reference, retry idempotency via content+request UUID SHA-256 reference and existing primary-key conflict handling. No schema migration. Portfolio status update date is editorial date, not photo capture date. HANDOFF.md records unresolved business terms, missing contact endpoint/notification destination, private audience, and QA boundaries. No public access changes and no outbound notifications.

## Mobile interaction hierarchy — October 11, 2026
Reduced mobile header to58px, logo84px; contact remains in menu and compact bottom dock. Section navigation uses underlined links instead of pill CTAs. Ownership selection shared through Shell context: dock price and enquiry defaults follow selected share/whole mode. Inline enquiry buttons/contact form suppress floating dock via IntersectionObserver; modal also hides it. Ownership controls grouped, price follows selection. Removed repeated starting-price tile and compacted decision summary. Ownership nav anchor wraps decision details so active section remains meaningful. Preserved horizontal portfolio and all terms.

## Ownership decision details — October 11, 2026
Source: user-provided Human Allowed บ้านพักปล่อยเช่า 4th (ริมแม่น้ำปิง) PDF, 18 pages. Added compact summary and expandable terms to open project page. Prices include tax (p11). Management 30% gross, separate cleaning/utilities/rent (p13,p17). Costs: rent 3800, electricity estimated3900, water estimated350, internet650 monthly; cleaning estimated250/visit (200–300 range). Sum8700 is source-line sum, NOT per-owner liability; expense unit is unconfirmed. Rights are building/revenue on leased land, not individual land title. Revenue allocation follows floor and contractual share, not automatically percentage of total project. Payment cadence conflicts monthly/quarterly; date1–10 shown but contract confirmation required. Free rent1year banner is conditional pending scope/start confirmation. No yields fabricated; p16 historic statement from Pratu Chiang Mai not attributed to current project. No source PDF published (confidential marking and separate historical statement). No new legal promises, lease length, completion date, or exit terms invented. Existing price selector explicitly illustrative. Preserved portfolio and UI.

# DEAL! website content notes

- Reference: user-supplied screenshots of Sansiri; structure is reinterpreted for DEAL!.
- Main visual: supplied 7B086F04-7522-41A1-B730-283C611F4A92.jpeg, exported as optimized house.webp without visual alteration. It is labeled an architectural visualization, not a completed property photograph.
- Map: supplied IMG_2644.jpeg. Nearby distances are reproduced from this map and labeled approximate. Google Maps opens an address search, not an unverified exact parcel coordinate.
- Project price: 1,712,000 THB whole / 171,200 THB 10% share, visible at 5.8 seconds in the uploaded human_allowed_full_journey_9x16.mp4. This supplied video is the source used for this version.
- Land tenure: rented land, as stated in that video. No land ownership, lease duration, guaranteed revenue or yield is invented.
- House: two storeys, two bedrooms and two bathrooms from the project context. Floor-area and final floor plans are not supplied; the site offers a request for them.
- One real house project is shown. Other projects, launch status, remaining units, testimonials and construction percentages are not fabricated.
- Services are derived from the two user-supplied videos and project context. No loans or mortgage calculators.
- Colour: warm off-white, charcoal, subtle sage/stone tones; red used sparingly. IBM Plex Sans Thai fonts bundled locally.

# Implemented behavior

- Separate homepage, project collection, project detail and form data-use pages.
- Responsive navigation, project search/filter, device-local saved-project preference, sharing, image lightboxes, supplied videos, information tabs, nearby-location filters, ownership share examples and FAQs.
- Enquiries are stored in the Site's D1 enquiries table by POST /api/enquiries. There is no public enquiry-list route and no external messaging or CRM integration.
- Registration is not a booking/payment and proposed visit dates require later confirmation.
- To review enquiry records as site owner, use the native Site database tools. No customer administration page is exposed.

# Verification

- TypeScript check passed.
- Vinext production build passed.
- All four views rendered with React server renderer, checked for main heading and local asset presence.
- Enquiry request handler checked with a mock database for success, consent, normalized phone, malformed email/phone, past/invalid visit dates, honeypot, cross-origin rejection and storage failure.
- Generated D1 migration applied successfully to an in-memory SQLite database.
- Browser visual/interaction QA could not be run because control-browser was unavailable. Production D1 integration still requires a live form submission in the owner preview.

# Interaction styling revision

- Rounded capsule CTAs with centered labels; small chevrons reserved for navigation.
- Repositioned video play glyphs after labels; replaced dense mobile menu glyph with two thin lines.
- Mobile registration is a floating frosted capsule with safe-area spacing.
- Softer media buttons, segmented selectors, form fields and modal corners.
- No changes to project facts, lead schema, API behavior or access policy.
- TypeScript and production build verified; browser QA remains unavailable in this environment.

# Video placement cleanup

- Kept one DEAL introduction video entry point in the homepage hero.
- Removed the duplicated video button in About and the complete Human Allowed video story section.
- Removed both video cards from the project gallery; it now contains the expandable house image only.
- Updated the project navigation label to image gallery.
# Human Allowed (2) construction addition

- User confirmed this is a separate project, closed for ownership and currently under construction.
- Home and project catalog now show a separate construction portfolio section, without an application or purchase CTA for this project.
- Seven supplied IMG_2448–2456 photographs are presented without changing their content, converted to WebP for delivery. Name, Mueang Chiang Mai location and Day 37/45 are taken from the captions. Day count is a record label, not a completion percentage, live date, or promised handover.
- The existing open project and its enquiry flow are unchanged. No unconfirmed price, availability, address, completion date or financial claims added to the closed project.

# Click affordance revision

- Project cards now have a visible container and a full-width, dark “ดูรายละเอียดโครงการ” action. Removed the redundant title-row arrow.
- Secondary actions, icon buttons, tabs, filters and FAQ disclosures have visible borders and clear selected states. Construction photo controls now include “ขยายภาพ”. Static construction status labels are plain text, avoiding false button affordance.
- Preserved IBM font, restrained red, responsive layout, existing routes and form behavior. Typecheck/build validation only; browser QA unavailable in this environment.

# Compact portfolio revision

- Renamed the construction section “ผลงานที่ผ่านมา” per user request, keeping “ปิดรับการเป็นเจ้าของแล้ว · อยู่ระหว่างก่อสร้าง” to avoid implying completion.
- Replaced stacked portrait previews on home and catalog with one compact card. Mobile cover is 190px tall; all seven full images remain available in the existing gallery dialog.

# First completed house

- Added a separate first-house portfolio card before Human Allowed (2), on home and catalog. User confirms construction is complete and revenue-generating operations have begun.
- Uses six supplied IMG_2672–2677 photos, compressed to WebP, with a separate gallery. No revenue amount, yield, occupancy, sales availability, exact address, or unconfirmed project name added. Display name: บ้านพักหลังแรก.
- Preserves compact cards and the existing construction project. No changes to the open project or enquiry backend.

# Horizontal portfolio and supplied project name

- User requested the exact name Human Around (1); updated the first project's card and derived gallery title. Human Allowed (2) retains its own name.
- Portfolio is now a single horizontal row: two side-by-side desktop cards, swipeable 88%-width mobile cards with a visible next-card edge, scroll snapping and labeled previous/next controls. Full image galleries unchanged.

# Supplied red logo

- Replaced the header/footer text wordmark and tagline with the supplied red DEAL! design, processed through built-in image editing for transparent output. The selected output is stored at public/assets/deal-logo-red.png.
- Prompt: clean corporate DEAL! cutout, preserve supplied letterforms and spacing, red only, transparent background and counters, no tagline or decorations. Image tool output was prepared for web sizing with alpha preserved.

# Portfolio heading alignment

- Fixed the inherited mobile column direction that centered the portfolio heading when combined with align-items:center. The portfolio title now stays left aligned, with arrow controls on the right, in the same container alignment as other sections.

