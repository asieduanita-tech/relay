# Relay

Live demo: https://relay-olive-six.vercel.app

Repository: https://github.com/asieduanita-tech/relay

An evidence-to-decision workspace for Product Operations teams at B2B fintechs. Ingest fictional partner feedback, review AI-extracted problems, compare recurring issues, and record decisions with accountable follow-through.

**All partner accounts, complaints, metrics, people, and operational records are synthetic.** Account profiles are inspired by Monzo, Morgan Stanley, Capitec, Nubank, and UniCredit; there is no affiliation and no claim about those companies' performance.

## Run locally

Use Node.js 24 and npm (Node 22.13+ is also supported by the lint tooling).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://127.0.0.1:3000`. Development uses ignored `.data/` files if `DATABASE_URL` is absent. This fallback is deliberately disabled in production. The complete seeded review/decision workflow works without an AI key. New feedback is saved without analysis in this no-spend release; there is no canned fallback.

To use PostgreSQL, set `DATABASE_URL` and run `npm run db:migrate`. Use a pooled PostgreSQL connection with TLS enabled; Vercel's Neon integration is supported. Migrations create `relay_workspaces` and `relay_usage` and do not drop existing data.

## Analysis in this no-spend release

Live model calls are disabled in code and in all Vercel environments. Changing `AI_ENABLED` alone cannot enable them. No payment card, credit purchase, paid upgrade, or billable AI call is authorised.

Seed findings demonstrate extraction and classification and are explicitly labelled **precomputed synthetic analysis**. Newly imported text is stored without automatic extraction. Review, classification corrections, grouping corrections, analytics, decisions, actions and partner-update drafts remain functional.

The retained provider adapter shows how a future explicitly authorised AI version could use schema validation, exact quote checks, and human review. It is not active or a claim that this release performs live extraction.

## Demo controls and persistence

Each visitor receives an anonymous 24-hour workspace, bound to an HTTP-only signed cookie. Production requires a random `SESSION_SECRET` of at least 32 characters. Every operation resolves its workspace from the verified server session, never from a client-provided tenant ID. Mutations are transactional; PostgreSQL locks the workspace row while updating its document. Shared seed fixtures remain unchanged. Reset replaces only the current visitor's data and preserves daily usage counters.

Domain entities are typed records in a workspace JSONB document, with a separate shared quota table. This deliberate MVP compromise makes whole-workspace resets, isolation, and consistent metrics simple. It is not a proposed long-term database structure for a multi-team production product; normalise records and add indexed queries, membership, audit identity and row policies before that use.

Limits: 100 KB CSV, 25 rows/import, 5,000 characters/source, 150 sources/workspace, 10 live analyses/session/day and 20/IP/day. `AI_DAILY_GLOBAL_LIMIT` defaults to 100 attempts/day. Durable quota reservations are transactional across server instances. The no-spend release additionally hard-disables calls in server code. These limits cap request volume, not a guaranteed currency amount; configure provider spending controls as well. IP-derived quota keys use a one-way digest; raw source text is not included in application error logs.

A daily authenticated Vercel cron removes expired workspace content and usage records older than two days. Set a random `CRON_SECRET`. Workspace access ends at expiry; physical deletion occurs at the next successful cleanup. Local `.data/` files are development-only and have no scheduled cleanup.

## Read the numbers correctly

- Accepted findings power analytics. Suggestions and dismissed findings are excluded.
- Sources and partners use distinct IDs. Multiple findings in one source do not multiply source counts for an issue.
- Duplicate text is normalised and checked within a fictional partner.
- Date filters use feedback dates. Filter controls are represented in URL query parameters.
- Default issue/opportunity ordering: unique partners, then distinct sources. Human priority is separate and requires rationale.
- Severity is a reviewed judgment, not model confidence or a revenue estimate. No commercial-value score is invented.
- Seed analysis is labelled **precomputed synthetic analysis**; live results include model and prompt provenance.
- Draft partner updates are never marked sent. Recording external communication requires an explicit confirmation and does not send email or Slack.

## Verification

```sh
npm run lint
npm test
npm run typecheck
npm run build
# In another terminal, while npm run dev is running:
npm run test:e2e
```

Browser checks use installed Google Chrome through Playwright (`channel: chrome`). If Chrome is unavailable, install it or change the Playwright channel to an installed browser. Accessibility checks use axe across 1440px, 1024px and 390px layouts. Automated checks support manual review; they are not accessibility certification.

`next build --webpack` is intentional: the local restricted environment prevented Turbopack's compiler worker from binding its IPC port. The Next.js application uses standard App Router conventions.

## Deploy to Vercel

1. After explicit publishing approval, use the existing Vercel project `relay`; do not create another project. See [Stage 5 release instructions](docs/STAGE_5.md).
2. Preserve the existing free PostgreSQL connection and secrets. These staged changes do not change the SQL schema; no new database or migration is needed.
3. Verify `DATABASE_URL`, `SESSION_SECRET` and `CRON_SECRET` remain configured. Keep `AI_ENABLED=false`. No AI credential, card or paid upgrade is needed. Keep secrets out of repository files and command arguments.
4. Use `npm run build` as the build command, then deploy. `vercel.json` defines the daily cleanup schedule.
5. Verify a fresh visitor can import, confirm live analysis is disabled, review seeded evidence, record a decision, and complete an action. Check a second browser session remains independent.

The one-time `scripts/configure-vercel.mjs` generates session/cleanup secrets in memory and adds project settings through stdin. Do not rerun it blindly; rotating the session secret invalidates existing sessions. `.vercel/`, `.env.local`, raw workspace content and browser traces are ignored.

## Documentation

- [Product brief](PRODUCT.md): problem, users, scope, data model, safeguards, success criteria.
- [Implementation proposal](IMPLEMENTATION_PLAN.md): approved route structure and architecture.
- [Design system](DESIGN.md): final interface tokens and patterns, documented after review.
- [Product case study](CASE_STUDY.md): mechanism, decisions, limitations, roadmap and observed verification.

Official implementation references: [Next.js App Router](https://nextjs.org/docs/app), [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [Vercel Responses API](https://vercel.com/docs/ai-gateway/sdks-and-apis/responses), [Vercel OIDC](https://vercel.com/docs/ai-gateway/authentication-and-byok/oidc).


## No-spend scope update — 21 October 2026

The user requires no payment card and no spending. Live AI is disabled in code and Vercel configuration. New imports are saved without automatic extraction; seeded findings remain explicitly labelled precomputed synthetic analysis. The real-provider adapter is retained for reference only and cannot be enabled through environment settings alone. No paid upgrades, credit purchases, or billable model calls are authorised. The approved demo uses free hosting/database tiers and the synthetic review-to-decision workflow.

## Reviewed revision — 22 October 2026

Stages 1–5 passed local review and QA before publication. Deployment-specific verification is reported separately in the release handover. The latest synthetic Overview rates are 99.70% successful payments, 0.16% reversals, 43.52% successful disputes, 1.50% timed-out card attempts and 1.43% flagged inbound receipts. Month-over-month changes use percentage points.

Nine metric definitions, 270 observations and 54 historical notes span April–September 2026. Explicit contextual associations connect the five current product problems to exact accepted source quotations and human-owned opportunities. October source feedback is distinct from the metric reporting period; no causal proof is implied. KYC and Risk review metrics are retained under their product filters.

See [metric dictionary](docs/METRICS.md), [release reconciliation](docs/release-reconciliation.json), and [Stage 5](docs/STAGE_5.md) for current verification and release boundaries. Older modified visitor workspaces preserve operator work; use a new session to inspect revised sample content.

Lint uses ESLint 10 and Next's matching config. TypeScript 7 remains the `tsc` executable; the `typescript` package alias supplies the TypeScript 6 API required by lint tools, following Microsoft's side-by-side guidance. `npm run lint` permits no warnings; CI runs lint, unit tests, typecheck and build. Browser tests require a separately running local server and installed Chrome.
