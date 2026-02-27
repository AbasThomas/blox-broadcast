# Resend Broadcast Toolkit (Node.js + TypeScript)

Production-ready CLI app for:

- Importing contacts from CSV into Resend
- Assigning contacts to a segment
- Sending personalized broadcasts to that segment
- Sending test emails before live broadcast
- Optional scheduling (immediate or future send)

## Features

- TypeScript-first project structure
- Resend SDK integration (`contacts`, `segments`, `broadcasts`, `emails`)
- CSV import with validation, batching delay, and summary logs
- Flexible template system (built-in templates or file-based templates)
- Personalization placeholders supported in templates:
  - `{{{FIRST_NAME|there}}}`
  - `{{{RESEND_UNSUBSCRIBE_URL}}}`
- Plain-text fallback support
- CLI flags for subject, template, schedule, test mode, and dry-run

## Folder Structure

```text
.
├─ src/
│  ├─ lib/
│  │  ├─ contact-row.ts
│  │  ├─ csv.ts
│  │  ├─ env.ts
│  │  ├─ resend-client.ts
│  │  ├─ schedule.ts
│  │  ├─ sleep.ts
│  │  ├─ template-loader.ts
│  │  ├─ text.ts
│  │  └─ validators.ts
│  ├─ emails/
│  │  ├─ index.ts
│  │  ├─ product-announcement.ts
│  │  ├─ types.ts
│  │  └─ waitlist-update.ts
│  └─ scripts/
│     ├─ import-csv.ts
│     └─ send-broadcast.ts
├─ .env
├─ .env.example
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Install

```bash
npm install
```

## Environment Variables

Set values in `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Your Team <hello@yourdomain.com>
SEGMENT_ID=seg_xxxxxxxxxxxxxxxxxxxxx
TEST_EMAIL=you@example.com
```

Notes:

- `RESEND_API_KEY`: from Resend Dashboard -> API Keys
- `RESEND_FROM_EMAIL`: verified sender/domain in Resend
- `SEGMENT_ID`: Resend Dashboard -> Contacts -> Segments -> open segment -> copy ID
- `TEST_EMAIL`: default recipient for `--test` mode

## Build / Typecheck

```bash
npm run typecheck
npm run build
```

## CSV Import

Expected CSV columns include:

- `email` (required)
- `first_name` (optional)
- `last_name` (optional)
- any extra columns become contact custom properties (for example `signup_date`, `plan`, `score`)

Example command:

```bash
npm run import:csv -- --file=users.sample.csv
```

Common options:

```bash
npm run import:csv -- --file=users.csv --segment-id=seg_123 --delay-ms=800
npm run import:csv -- --file=users.csv --dry-run
```

Behavior:

- Invalid rows are skipped (for example missing/invalid email)
- Success/failure per row is logged
- Delay is applied between API calls to reduce rate-limit risk

## Send Broadcast

Send to your segment using a built-in template:

```bash
npm run send:broadcast -- --template=waitlist-update --subject="New Update!"
```

Schedule a send:

```bash
npm run send:broadcast -- --template=waitlist-update --subject="Weekly Digest" --schedule="tomorrow at 9am WAT"
```

Send a test email instead of broadcasting:

```bash
npm run send:broadcast -- --template=waitlist-update --subject="Preview" --test=me@example.com
```

Use default `TEST_EMAIL` from env:

```bash
npm run send:broadcast -- --template=waitlist-update --subject="Preview" --test
```

Dry-run payload preview:

```bash
npm run send:broadcast -- --template=waitlist-update --subject="Preview" --dry-run
```

Useful options:

- `--template`: built-in template id or path to `.html/.ts/.js` template file
- `--subject`: subject override (required unless template has a default subject)
- `--from`: override sender (otherwise `RESEND_FROM_EMAIL`)
- `--reply-to`: single email or comma-separated emails
- `--segment-id`: override `SEGMENT_ID` env var
- `--schedule`: ISO datetime or natural language schedule
- `--name`: custom broadcast name
- `--preview-text`: custom inbox preview text
- `--test`: send one-off test email instead of segment broadcast

## Templates

Built-in templates live in `src/emails/` and export a `BroadcastTemplate` object with:

- `id`
- `subject` (optional default)
- `previewText` (optional)
- `html`
- `text`

You can add more templates by creating files in `src/emails/` and adding them to `src/emails/index.ts`.

## Production Notes

- Do not hardcode secrets in source code
- Keep `.env` out of version control (`.gitignore` already includes it)
- Use `--dry-run` for safe payload validation before live sends
- For large imports, tune `--delay-ms` based on your Resend limits

## Extending for Multiple Segments

Simple extension options:

- Add `--segments seg_1,seg_2` and loop broadcasts by segment
- Add segment lookup by name (using `resend.segments.list`)
- Add campaign metadata storage (DB/table) for audit history
- Add retries and dead-letter logs for import failures
