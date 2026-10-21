# Relay implementation proposal

Status: approved on 21 October 2026; implemented with the no-spend scope update below. Read PRODUCT.md as the durable product brief. This document proposes implementation rather than recording completed work.

## Page structure

| Route | Primary task |
| --- | --- |
| `/` | Dashboard: assess recurring issues, affected partners, unreviewed findings, and decisions/actions needing attention; drill into filtered evidence |
| `/feedback` | Search/filter sources and findings; open original text and review AI suggestions |
| `/feedback/import` | Paste or CSV → validate/preview → analyse → review and accept |
| `/issues/[id]` | Inspect canonical problem, partner breadth, source evidence, grouping corrections, and linked opportunities |
| `/partners` and `/partners/[id]` | Compare the five fictional accounts and inspect each account's feedback and follow-through |
| `/opportunities` and `/opportunities/[id]` | Prioritise opportunities; record decisions, rationale, owners, actions, and partner-update drafts |
| `/demo` | Explain synthetic data, session retention, CSV format, live AI quota, and reset |

Issues are accessible from the dashboard and feedback rather than adding a redundant top-level destination. Product-area and date filters use shareable query parameters within the current visitor's workspace. On narrow screens, navigation collapses and evidence panels become full-width views.

## Technical architecture

Browser → Next.js App Router on Vercel → server-only domain services → managed PostgreSQL and AI provider.

- TypeScript throughout; Tailwind tokens and reusable accessible React primitives.
- Server-render initial pages; client components for filters, import preview, review, and form interactions. Server is authoritative for data and aggregate calculations.
- Database migrations and deterministic synthetic fixtures. Keep source ingestion, AI extraction, issue grouping, analytics, and decision state transitions in separate domain modules.
- Validate form data, CSV rows, model outputs, and API payloads with shared schemas. Use transactions for reviewed findings and decision/action mutations.
- Store analysis job status and idempotency keys before provider calls. Process small batches with bounded concurrency, persist each result, and expose partial success/retry. Do not assume work survives after an HTTP response. Keep each request within the configured Vercel runtime budget; add a durable queue only if measured execution requires it.
- AI adapter enables provider selection without coupling UI to a model SDK. Pin model/prompt configuration and record provenance per job.
- Use environment variables for server secrets; provide `.env.example`, local setup, migrations/seed instructions, deployment steps, and quota controls in README.
- GitHub stores application code, fixtures, documentation, and checks. Vercel hosts the Next.js application; no alternative hosting is proposed.

## Evidence and analytics rules

The source is immutable; findings point to exact quotes. Proposed classifications remain visibly unreviewed. Only accepted findings contribute to default issue analytics. One message containing three problems can yield three findings but contributes at most one source to an issue. A partner contributes at most one affected-partner count per issue in the selected time window. Display sample sizes, sorting rules, and synthetic-data labels beside charts and rankings.

Seed fixtures contain authored, precomputed synthetic analysis with explicit provenance. A live API call is necessary for newly submitted feedback; unavailable AI produces a visible retry state. Human severity and priority decisions preserve rationale rather than hiding judgment in an invented score.

## Demo session and public endpoint design

Create a cryptographically random anonymous session and seed an owned workspace. Resolve workspace membership from the server session on every operation. Use database-backed sessions or opaque signed tokens with expiry; do not put source data into cookies. Enforce ownership in domain services and database access, and test attempted cross-session record access.

Persist accepted imports, reviews, decisions, and actions within that session. Rate limits and global spend caps must be durable across Vercel instances. Reset creates a clean workspace for this visitor and revokes access to the old one. Scheduled cleanup removes expired workspaces and content; operational logs exclude raw feedback. Do not expose provider keys or unrestricted model endpoints.

## Impeccable workflow

Impeccable context and its `init` reference were loaded for this empty project. PRODUCT.md records confirmed requirements and explicitly marked proposals. The installed workflow implements `/impeccable init` through its skill instructions; no application CLI initialization or UI build is implied.

After approval, establish an Operate-mode design direction and record the approved visual system in DESIGN.md and Impeccable's design metadata. Proposed direction: calm operations workspace, clear page titles and filters, a compact metric strip, one dominant issue table/chart, and direct access to source evidence. Use restrained ink/slate tones and one functional accent, semantic status colours with text labels, consistent type and spacing scales, aligned numeric columns, and low-decoration charts with visible denominators. Exact tokens are chosen during design, not claimed as established here.

Apply Impeccable's craft guidance during UI implementation. Build reusable navigation, buttons, fields, tables, evidence panels, status labels, and chart patterns. Review dashboard hierarchy and the full intake-to-decision workflow at desktop and mobile sizes. Check keyboard use, focus, contrast, table overflow, long content, and loading/empty/error states.

Before deployment, run Impeccable critique/audit and the available mechanical detector, then a finish review with rendered evidence. Fix material usability/accessibility findings and document the final system. Keep review effort focused on the working workflow and deadline; no decorative assets or image-generation phase is needed for these app screens.

## Verification and handoff

Use targeted unit checks for parsing, evidence validation, deduplication, distinct-count analytics, quotas, and state transitions. Use integration checks for workspace isolation and live provider failure behaviour, plus an end-to-end test for the core workflow. Run type checks and production build; inspect the deployed demo with real configuration.

README covers setup, fictional data, AI behaviour, limits, architecture, reset, deployment, and troubleshooting. The case study covers the problem, evidence-to-decision mechanism, design choices, observed checks, limitations, and roadmap. Future work includes authenticated teams, permissioned real-data intake, integrations, richer commercial context, and evaluation against responsibly sourced real feedback.

## Approval boundary

Approve or amend PRODUCT.md and this proposal before scaffolding, installing application dependencies, implementing features, creating external resources, or deploying. Provider credentials and account access are integration prerequisites, not reasons to begin those steps before approval.


## No-spend scope update — 21 October 2026

The user requires no payment card and no spending. Live AI is disabled in code and Vercel configuration. New imports are saved without automatic extraction; seeded findings remain explicitly labelled precomputed synthetic analysis. The real-provider adapter is retained for reference only and cannot be enabled through environment settings alone. No paid upgrades, credit purchases, or billable model calls are authorised. The approved demo uses free hosting/database tiers and the synthetic review-to-decision workflow.
