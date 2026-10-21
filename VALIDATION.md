# Relay validation — 21 October 2026

## Scope

No-spend release: live model calls are hard-disabled in server code and AI_ENABLED=false in production, preview, and development on Vercel. Seed extraction is explicitly precomputed and synthetic. New sources save without automatic analysis. No card or paid upgrade is authorised.

## Observed checks

- 11 domain tests passed: distinct source/partner counts, date/area/partner filters, deduplication, exact quotation offsets and rejection of unsupported evidence, grouping corrections, decision history and delivery guard, manual communication state, CSV multiline input and validation limits.
- TypeScript passed.
- Production webpack build passed before final release build; the final build is recorded by deployment output.
- 3 Playwright tests passed against the real Neon PostgreSQL workspace store: complete review/decision/action/import/communication flow and reset isolation; desktop/mobile core routes without page-level overflow; accessibility scans.
- Axe WCAG 2 A/AA, 2.1 AA and 2.2 AA tags on 6 routes × 3 viewport widths (1440, 1024, 390) found no serious/critical violations. Manual keyboard and physical-device checks are not complete; this is not accessibility certification.
- Independent Impeccable finish review returned fix, then scored all 3 requested material changes resolved and returned ship: truthful no-spend import wording, inline search layout, and removal of an unnecessary aside eyebrow. Its final verdict covers those scored fixes; pending-source wording was checked in code rather than an imported-state capture.
- Impeccable detector ran once. Its only warning was Inter being overused. Inter was retained for readable operation text alongside Newsreader page titles.
- Vercel project relay and free Neon database relay-db in London were created; schema migration succeeded. Server session and cleanup secrets were generated through stdin without source files or logs containing their values.
- Live AI authentication was attempted once before the no-spend instruction and rejected by Vercel with HTTP 403 for missing payment-card verification. No successful model extraction or AI accuracy measurement is claimed. Further model calls are blocked.

## Release limitations

- Production deployment smoke checks are recorded after deployment; a successful local check alone does not prove production configuration.
- Automatic GitHub-to-Vercel linking was rejected because the Vercel account needs a GitHub Login Connection. CLI deployment remains available; connecting GitHub later is optional account setup.
- No real user research, business-impact metrics, representative AI evaluation, enterprise authentication, production multi-team security certification, or external message delivery is claimed.
