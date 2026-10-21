# Relay

An evidence-to-decision workspace for Product Operations teams at B2B fintechs. Ingest fictional partner feedback, review AI-extracted problems, compare recurring issues, and record decisions with accountable follow-through.

**All partner accounts, complaints, metrics, people, and operational records are synthetic.** Account profiles are inspired by Monzo, Morgan Stanley, Capitec, Nubank, and UniCredit; there is no affiliation and no claim about those companies' performance.

## Run locally

Requires Node.js 22 or 24 and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://127.0.0.1:3000`. Development uses ignored `.data/` files if `DATABASE_URL` is absent. This fallback is deliberately disabled in production. The complete seeded review/decision workflow works without an AI key; newly submitted feedback requires a real configured provider and is never analysed with a canned fallback.

To use PostgreSQL, set `DATABASE_URL` and run `npm run db:migrate`. Use a pooled PostgreSQL connection with TLS enabled; Vercel's Neon integration is supported. Migrations create `relay_workspaces` and `relay_usage` and do not drop existing data.

## Real AI

Relay uses OpenAI's Responses API with a structured Zod schema. Choose one configuration:

- Vercel AI Gateway: `AI_PROVIDER=vercel`, `AI_ENABLED=true`, and project OIDC authentication or `AI_GATEWAY_API_KEY`. Default model: `openai/gpt-4.1-mini`. `vercel env pull` refreshes local project OIDC tokens.
- Direct OpenAI: `AI_PROVIDER=openai`, `OPENAI_API_KEY`, `AI_ENABLED=true`. Default model: `gpt-4.1-mini`.

`OPENAI_MODEL` overrides the default. A model must support structured outputs. No model request is made until the visitor explicitly chooses analysis. Source text and a bounded catalogue of issue titles are sent; the model has no tools or credentials. Relay disables response storage, validates the returned shape and product area, verifies literal source quotations and issue IDs, and stores suggestions for human review. This does not guarantee the interpretation is correct. Provider/gateway retention policies still apply; use fictional text only.

Each request analyses one source, has a 42-second provider timeout, and allows no automatic provider retry. Failed requests retain source text and can be retried explicitly. Attempts count against quotas, including failed provider calls, to bound spending. Analysis state is persisted before the model call; duplicate concurrent requests are rejected. A stale analysis lease can be retried after two minutes. There is no fire-and-forget background job.

## Demo controls and persistence

Each visitor receives an anonymous 24-hour workspace, bound to an HTTP-only signed cookie. Production requires a random `SESSION_SECRET` of at least 32 characters. Every operation resolves its workspace from the verified server session, never from a client-provided tenant ID. Mutations are transactional; PostgreSQL locks the workspace row while updating its document. Shared seed fixtures remain unchanged. Reset replaces only the current visitor's data and preserves daily usage counters.

Domain entities are typed records in a workspace JSONB document, with a separate shared quota table. This deliberate MVP compromise makes whole-workspace resets, isolation, and consistent metrics simple. It is not a proposed long-term database structure for a multi-team production product; normalise records and add indexed queries, membership, audit identity and row policies before that use.

Limits: 100 KB CSV, 25 rows/import, 5,000 characters/source, 150 sources/workspace, 10 live analyses/session/day and 20/IP/day. `AI_DAILY_GLOBAL_LIMIT` defaults to 100 attempts/day. Durable quota reservations are transactional across server instances. Set `AI_ENABLED=false` and redeploy to disable model calls. These limits cap request volume, not a guaranteed currency amount; configure provider spending controls as well. IP-derived quota keys use a one-way digest; raw source text is not included in application error logs.

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
npm test
npm run typecheck
npm run build
# In another terminal, while npm run dev is running:
npm run test:e2e
```

Browser checks use installed Google Chrome through Playwright (`channel: chrome`). If Chrome is unavailable, install it or change the Playwright channel to an installed browser. Accessibility checks use axe across 1440px, 1024px and 390px layouts. Automated checks support manual review; they are not accessibility certification.

`next build --webpack` is intentional: the local restricted environment prevented Turbopack's compiler worker from binding its IPC port. The Next.js application uses standard App Router conventions.

## Deploy to Vercel

1. Import `asieduanita-tech/relay` into a new Vercel project named `relay`, or link the existing configured project with the CLI.
2. Connect the free Neon PostgreSQL integration and run `npm run db:migrate` against its database.
3. Configure `DATABASE_URL`, `SESSION_SECRET`, `CRON_SECRET`, the chosen AI authentication, `AI_PROVIDER`, `AI_ENABLED`, and `AI_DAILY_GLOBAL_LIMIT` in Vercel. Keep secrets out of repository files and command arguments.
4. Use `npm run build` as the build command, then deploy. `vercel.json` defines the daily cleanup schedule.
5. Verify a fresh visitor can import, run live analysis, review evidence, record a decision, and complete an action. Check a second browser session remains independent.

The one-time `scripts/configure-vercel.mjs` generates session/cleanup secrets in memory and adds project settings through stdin. Do not rerun it blindly; rotating the session secret invalidates existing sessions. `.vercel/`, `.env.local`, raw workspace content and browser traces are ignored.

## Documentation

- [Product brief](PRODUCT.md): problem, users, scope, data model, safeguards, success criteria.
- [Implementation proposal](IMPLEMENTATION_PLAN.md): approved route structure and architecture.
- [Design system](DESIGN.md): final interface tokens and patterns, documented after review.
- [Product case study](CASE_STUDY.md): mechanism, decisions, limitations, roadmap and observed verification.

Official implementation references: [Next.js App Router](https://nextjs.org/docs/app), [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [Vercel Responses API](https://vercel.com/docs/ai-gateway/sdks-and-apis/responses), [Vercel OIDC](https://vercel.com/docs/ai-gateway/authentication-and-byok/oidc).


## No-spend scope update — 21 October 2026

The user requires no payment card and no spending. Live AI is disabled in code and Vercel configuration. New imports are saved without automatic extraction; seeded findings remain explicitly labelled precomputed synthetic analysis. The real-provider adapter is retained for reference only and cannot be enabled through environment settings alone. No paid upgrades, credit purchases, or billable model calls are authorised. The approved demo uses free hosting/database tiers and the synthetic review-to-decision workflow.
