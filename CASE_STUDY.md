# Relay: connecting partner feedback to product decisions

## The problem

In a B2B fintech, a banking partner's operational problems can arrive through email, Slack, or meeting notes. A request can be duplicated across channels, stripped of its original context, or passed to a product team without a decision coming back. Product Operations needs an evidence trail and a way to close the loop, not merely another inbox.

This MVP explores that problem with fictional partners and synthetic feedback. No customer research, real-bank performance data, commercial outcomes, or time savings have been established.

## The solution

Relay connects six steps: import a source, extract a supported problem, review its interpretation, recognise recurrence across partners, record a decision, and track the next action and partner follow-up.

The overview prioritises partner breadth and distinct source counts. An issue opens exact quotations and original source records. Accepted findings can inform an opportunity; an accountable owner records the decision and rationale, assigns actions, and prepares an update. A saved draft remains a draft until someone explicitly records external communication.

## Product Operations judgment

**Separate evidence from interpretation.** A model-generated problem statement is a suggestion. Its source quotation must be literal, its category valid, and its issue match reviewable. Accepted findings alone enter default analytics. A no-problem result is allowed.

**Measure recurrence without inflating it.** One source can contain several problems; that does not make it several sources. Five messages from one partner do not become five affected partners. Duplicate text is checked within a partner. Every chart exposes its denominator and every ranking links to evidence.

**Make prioritisation inspectable.** Relay does not invent revenue, commercial value, engineering effort, or a weighted score. Default sorting uses partner breadth and source count. Human priority and severity are separate judgments with rationale. A declined or deferred opportunity is still a valid decision, with an owner and review date.

**Treat follow-through as part of the product.** Decisions are append-only history entries. Actions require owners and due dates. Outstanding actions prevent a delivered status. Relay never implies it sent a message; external communication is manually confirmed.

## Design decisions

Impeccable guided a restrained operations interface. A forest navigation rail anchors the workspace; a warm light surface supports dense reading. Inter handles tables and controls, and Newsreader distinguishes page titles. Semantic labels support colour, charts have table alternatives, and source evidence stays close to the decision it supports.

The dashboard leads with five distinct synthetic performance rates, six-month trends and raw-count calculation details, followed by reviewed feedback and the issue table. Partner avatars support recognition but do not replace counts or account names. Mobile keeps the same information hierarchy and contains wide tables in a dedicated scroll region.

Browser testing exposed a mobile overflow caused by a visually hidden table label outside its scroll container. The containing block was corrected. Automated accessibility checks also exposed low-contrast supporting labels and an incorrect interactive chart role; those were corrected before release review.

## Technical decisions

Next.js App Router, React, TypeScript, and Tailwind provide the application. Server-side services validate imports, model output, reviews, and decisions. PostgreSQL stores an isolated JSONB workspace document per visitor plus shared quota counters. Row locks keep workspace updates atomic; signed cookies determine workspace ownership.

The document storage model is a pragmatic demo boundary. A production multi-team product would need normalised entities, indexed analytics, authenticated membership, stronger audit identity, and database row policies. Local file persistence is available only in development and is explicitly disabled in production.

The inactive extraction adapter targets the OpenAI Responses API, directly or through Vercel AI Gateway. Live extraction is hard-disabled in this no-spend release. Relay validates structured results, verifies exact source quotations and allowed issue IDs, and preserves provenance. Failed calls stay failed; precomputed synthetic fixtures are never passed off as live results. Session/IP/global quotas and bounded outputs limit public model usage.

## Observed verification

- Thirty-eight unit/domain checks pass for distinct counts, filters, deduplication, source evidence, grouping corrections, decision rules, communication state, and CSV validation.
- Browser tests pass for the seeded evidence-to-decision workflow, action completion, import, origin rejection, independent visitor state, and reset isolation using development storage.
- Desktop and mobile route checks pass without document-level horizontal overflow.
- The production build and TypeScript checks pass.
- PostgreSQL provisioning and schema migration completed successfully. Persistent workflow checks and rendered accessibility checks passed; final release evidence and the disabled-AI limitation are recorded in VALIDATION.md.

These checks demonstrate software behaviour on synthetic inputs. They do not establish general extraction accuracy, production security, user value, or business impact.

## Limitations and roadmap

The public demo accepts fictional data only. It has one anonymous demo role, a 24-hour session, no cross-device recovery, no direct inbox integrations, and no outbound communications. Original AI suggestions remain subjective even when quotations are verified. Grouping uses a bounded issue catalogue rather than a scalable retrieval system. There is no autonomous prioritisation or delivery promise.

Next, validate the workflow with Product Operations practitioners; establish intake-to-review and decision-to-follow-up baselines; evaluate extraction and grouping on responsibly sourced, hand-labelled feedback; introduce authenticated teams and role controls; add permissioned channel ingestion; and integrate delivery tooling with an explicit partner communication workflow. Commercial context should enter prioritisation only when it is real and reviewable.


## No-spend scope update — 21 October 2026

The user requires no payment card and no spending. Live AI is disabled in code and Vercel configuration. New imports are saved without automatic extraction; seeded findings remain explicitly labelled precomputed synthetic analysis. The real-provider adapter is retained for reference only and cannot be enabled through environment settings alone. No paid upgrades, credit purchases, or billable model calls are authorised. The approved demo uses free hosting/database tiers and the synthetic review-to-decision workflow.

## Staged revision and product judgment

The current local revision connects performance signals to source evidence and accountable decisions without combining unlike rates into a health score. Successful payments and reversals use different cohorts; they are not complements. Successful disputes count final outcomes, not evidence submissions. A risk flag is a reason to investigate, not confirmed misuse. Improvements in rates do not invalidate remaining partner concerns.

The five current product problems cover closed beneficiary accounts, account-detail mismatches, broad dispute evidence guidelines, delayed card OTPs and suspected friends-and-family receipts to business multicurrency accounts. Opportunity proposals address those specific mechanisms, with human priority and rationale recorded separately from partner breadth. Source dates and reporting months stay visible so September metrics are not represented as causally explained by October feedback.

Impeccable review preserved the forest rail, editorial titles and flat evidence surfaces. Detail-page metric context is progressively disclosed to foreground source investigation and decision recording; mobile controls, keyboard navigation, retry/empty states and reduced-motion behaviour were refined. Staged work passed local review before publication; current results and limitations are recorded in docs/STAGE_5.md. Deployment-specific verification is reported separately.
