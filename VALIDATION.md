# Relay validation — 22 October 2026

## Current local release candidate

Stages 1–5 completed local review and QA before publication. This document records the reviewed candidate checks; deployment-specific verification is reported separately in the release handover.

Observed checks:

- **38 unit/domain tests passed**: synthetic coverage, weighted rates, cohort comparisons, invalid/missing data, additive upgrades, exact quotations, accepted-only evidence, partner scope, filtering, deduplication, review/decision/action/communication rules and CSV limits.
- **17 browser tests passed** in a complete `npm run test:e2e` run after the final workspace-loading fix. Covers the original workflow, both detailed scenarios, metric/filter reconciliation and reloads, isolation/reset, security, loading/error/retry/empty states, keyboard tabs/navigation, synthesized mobile touch, reduced motion and long text.
- **ESLint passed with zero warnings**, using matching Next rules. CI includes lint; a clean lockfile install dry run passed.
- **TypeScript and route generation passed**. Production webpack build passed with database/session/cleanup values explicitly blank for the build process.
- **Numerical reconciliation passed**: all five requested September rates and all partner totals reconcile; artifact in `docs/release-reconciliation.json`.
- Rendered axe checks across the original core paths and Stage 2/4 surfaces found no serious/critical violations. Stage 4 covers seven affected pages at 390, 1024 and 1440 px. No full accessibility certification is implied.
- A targeted credential-pattern scan checked 71 eligible source/documentation/config files and found no matches. Ignored secrets and local data were excluded; this is not an exhaustive secret-detection guarantee.
- Production dependency audit: **0 vulnerabilities**. Full audit: **5 high entries in one development-only braces dependency chain**, no supported upstream patch reported. Details and advisory in `docs/STAGE_5.md`. No forced downgrade was used.

## Security evidence

Endpoint tests verify unsigned/tampered sessions and foreign objects are rejected; origin and content-type checks apply; oversized requests are refused; blocked analysis returns 503 without modifying workspace data; separate browser workspaces remain independent; cleanup requires authentication. Signed cookie flags are HTTP-only/SameSite Strict locally and Secure in production code. PostgreSQL updates use row locks and parameterised queries.

Live AI is hard-disabled before quota reservation or provider calls. Changing environment configuration cannot enable it. New imports remain unanalysed; examples are explicitly precomputed and synthetic. No model request, new database resource, paid upgrade or card is required.

No production database was queried or modified during staged QA. Both fail-closed production guards passed using temporary localhost processes with blank database settings: a presented session requires SESSION_SECRET, and a fresh session requires DATABASE_URL. Pages returned 200 while workspace access returned 503; framing/nosniff headers were verified. The temporary processes were stopped. It must not be mistaken for a working production PostgreSQL persistence test.

## Design review

Impeccable preserved the forest rail, Newsreader/Inter hierarchy, flat surfaces and evidence disclosures. Independent Stage 4 review accepted the rendered refinement, then accepted the documentation correction. Mobile controls, keyboard interaction, collapsed detail context and state recovery are documented in DESIGN.md. Broader sidecar approximations were not rewritten.

## Earlier public release

The older demo is at https://relay-olive-six.vercel.app and repository at https://github.com/asieduanita-tech/relay. Earlier release notes recorded a successful Vercel deployment, free Neon provisioning and production workflow/isolation smoke tests. Those historical results do not validate the current unpublished candidate. Automatic GitHub linking was not established in the earlier setup; CLI publishing remains a separate approval step.

## Remaining limits

Physical-device, cross-browser and full screen-reader coverage are incomplete. There is no live AI accuracy evaluation, real user research, measured business impact, enterprise membership/roles or external message delivery. Anonymous 24-hour demo sessions and existing CSP allowances remain deliberate MVP limits. Final production smoke checks must follow an explicitly approved deployment.

See `docs/STAGE_5.md` for exact GitHub/Vercel preparation and remaining dependency caveat.
