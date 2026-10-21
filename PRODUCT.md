# Relay

<!-- impeccable:product-schema 1 -->

Status: scope approved; implementation and release verification in progress. No-spend scope update at the end supersedes live-AI requirements.
Deadline: Friday, 23 October 2026.

## Platform

web

## Stack

Confirmed: Next.js, React, TypeScript, Tailwind CSS, a real AI model API, Vercel deployment, and GitHub version control and documentation.

Proposed: Next.js App Router with server-side model calls; Zod validation; managed PostgreSQL for isolated demo workspaces, analysis jobs, and shared rate limits. Exact provider and model remain open, subject to credentials, availability, and cost. No credentials belong in source control or browser code.

## Problem and Product Purpose

Banking partner feedback is fragmented across email, Slack messages, and meeting notes. Product Operations teams must aggregate it, distinguish recurring product problems from isolated requests, and ensure product teams make and communicate decisions.

Relay turns fictional feedback into evidence-linked product intelligence and a visible decision workflow. Its primary deliverable is a polished, functional live demo, supported by a documented GitHub repository and concise product case study.

## Users

Primary: Product Operations teams at B2B fintechs.
Proposed supporting users: product managers reviewing opportunities and named owners responsible for follow-through. The MVP uses a single demo role rather than implementing separate permissions.

## Positioning and Product Principles

- Evidence before prioritisation: every AI-extracted problem links back to exact source text.
- Partner breadth and feedback volume are different signals; repeated messages must not inflate affected-partner counts.
- AI suggests findings; people review classifications, links, and decisions.
- Decisions require rationale and visible follow-through, including deferred and declined work.
- Synthetic data and measured demo behaviour must never imply real company performance or proven business impact.

## Operating Context and Workflows

1. Paste fictional feedback or upload CSV; choose partner, source type, and feedback date, then preview validation results.
2. Submit for real AI analysis; inspect extracted problems, product areas, supporting quotations, and uncertainty. Correct or dismiss suggestions before accepting them.
3. Explore accepted findings by partner, product area, issue, and date; drill from analytics to underlying evidence.
4. Review recurring issues and associated opportunities; inspect affected partners, frequency, severity rationale, and evidence limitations.
5. Record an opportunity decision, rationale, owner, and next review date; track actions and record a partner-update draft or a manually confirmed communication.

No email or Slack message is sent by the MVP. Recording a draft does not mark a partner as informed.

## MVP Scope

- Pasted text and CSV ingestion with preview, row-level errors, file/text limits, and duplicate detection.
- Five product areas: Cross-border payments; Multi-currency accounts; Cards, including disputes; End-user KYC; Risk & Compliance.
- Five fictional accounts inspired by Monzo, Morgan Stanley, Capitec, Nubank, and UniCredit. Proposed names: Moss Bank, Meridian Institutional, CapeBridge Bank, Nuvia Bank, and Union Continental. Account descriptions state their inspiration and explicitly disclaim affiliation; use no real-company logos.
- Clearly labelled synthetic source records, findings, charts, metrics, opportunities, and decisions.
- Real model extraction and classification with schema validation, evidence verification, and human review.
- Recurring issue grouping across partners; reviewable matches and merge/split corrections. AI suggestions never silently become accepted evidence.
- Filtered analytics, source drill-down, opportunity decisions, named demo owners, actions, and decision history.
- Per-visitor demo persistence and reset; accessible responsive layouts; useful loading, empty, and error states.

Proposed prioritisation: show unique affected partners, distinct source count, source dates, reviewed severity with rationale, and evidence strength separately. Sort opportunities by partner breadth and then source count by default; show the sorting rule. Do not fabricate revenue, commercial value, engineering effort, or a precision-looking composite score. Allow a human priority and rationale independent of those signals.

## Exclusions

Live email/Slack integrations; real customer data; enterprise SSO and role administration; production multi-tenancy guarantees; automatic external communications; Jira integration; roadmaps with delivery promises; financial recommendations; multilingual guarantees; fine-tuning; and a general-purpose chat assistant.

## Proposed Data Model

Every mutable record carries a workspace ID, stable ID, and timestamps. Server queries enforce workspace ownership.

| Entity | Purpose and essential fields |
| --- | --- |
| Workspace | Anonymous session ownership, seed version, expiry, quota usage |
| Partner | Fictional name, inspiration disclosure, synthetic flag |
| Source | Partner, channel, original text, date, import ID, content hash, synthetic flag |
| Import | Paste/CSV metadata, validation results, accepted and rejected row counts |
| AnalysisJob | Source IDs, queued/running/succeeded/failed status, attempts, model/prompt version, validated output, error |
| Finding | Source ID, problem statement, product area, exact quote and offsets, severity rationale, uncertainty, review status |
| Issue | Canonical problem, product area, reviewed finding links, grouping history |
| Opportunity | Issue links, proposed outcome, human priority and rationale, decision status, owner, next review date |
| Decision | Opportunity, decision, rationale, actor, timestamp; append-only history |
| Action | Opportunity, owner, due date, status, completion note |
| PartnerUpdate | Opportunity, partner, draft text, draft/recorded-as-communicated status, manual confirmation date |

One source can contain multiple findings. One finding has one primary product area and at most one canonical issue; use separate findings for distinct problems. Opportunities can address multiple issues. All counts use explicit distinct IDs to avoid join duplication.

## AI, Evidence, and Data Accuracy

Proposed pipeline: validated import → bounded model request → structured schema validation → literal quote/offset verification → suggested issue match → review → accepted findings and analytics. Retain original source text. Reject unsupported quotations and invalid categories rather than fabricating replacements. Require an explicit no-problem result when appropriate.

Treat source text as untrusted data, never instructions. The model has no tools, credentials, or ability to perform actions. Send only bounded fictional source content and required classification context. Explain that submitted text is processed by an external model provider before submission.

Match against a bounded catalogue of current issues; verify returned issue IDs and area consistency. Human review can create a new issue or correct grouping. Store model and prompt versions for traceability. Label uncertainty as a review cue, not a calibrated probability.

Accepted findings power default analytics. Display excluded/unreviewed counts. Count unique partners and sources separately; exclude duplicate sources. Date filters use feedback dates and charts expose denominators. Seed analysis is clearly labelled precomputed synthetic analysis; newly submitted analysis makes a real API request. On API failure, show failure/retry and retain the source; never substitute canned output while claiming a live result.

## Demo Isolation and Safe Public Access

Proposed: seed a fresh database workspace for each visitor and bind it to a signed, secure, HTTP-only session cookie. Validate ownership on every server read/write; never trust a client-supplied workspace ID. Shared seed fixtures are immutable. Reset affects only the current workspace. Expire demo workspaces after 24 hours, with scheduled cleanup. Clearly disclose persistence duration and that there is no cross-device account recovery.

Public demo accepts fictional text only, with a visible synthetic-data notice and confirmation at import. This is a demo constraint, not a claim that automated PII detection is reliable. Apply upload, row, character, response-token, concurrency, and request limits. Proposed starting limits: 100 KB CSV, 25 rows per import, 5,000 characters per source, and 10 live source analyses per session per day. Tune before deployment based on measured latency and budget.

Use a durable shared rate-limit store, session and IP throttling, origin checks on mutations, bounded provider timeouts/retries, and a global daily usage cap with an administrator kill switch. Avoid logging raw submitted text. Keep model and database secrets server-side. The demo remains usable with seed data when live AI quota is exhausted, with an explicit explanation. Exact retention and provider handling will be documented after provider selection.

## Accessibility and Brand Commitments

Credible B2B fintech software: clear hierarchy, readable dense information, restrained decoration, responsive layouts, and deliberate error/loading/empty states. Target WCAG 2.2 AA interaction and contrast requirements; keyboard access, visible focus, labelled forms, announced async results, and chart data available as tables. This is a target pending verification, not a certification.

## Evidence on Hand

The user-provided product brief is the only product evidence. There is no existing application, brand system, customer research, real feedback dataset, or validated impact measurement. All demo complaints and operational metrics will be synthetic. Case-study outcomes must distinguish demonstrated functionality from untested hypotheses.

## Success Metrics and Acceptance Criteria

These are proposed release checks and future evaluation measures, not achieved results.

- Complete paste → real analysis → review → evidence drill-down → opportunity decision → owned action workflow on the deployed demo.
- CSV preview identifies invalid rows; accepted rows import without silent drops; duplicate uploads do not inflate metrics.
- Every accepted AI finding has a verified source quotation; all displayed aggregate counts reconcile to filtered accepted records.
- Evaluate extraction, area classification, missed problems, and grouping on a small hand-labelled synthetic fixture set spanning all five areas, multi-problem inputs, ambiguity, duplicates, no-problem text, and instruction injection. Publish observed results and sample size; do not claim general accuracy.
- Verify session isolation with two independent sessions, reset isolation, expired sessions, quota enforcement, and server-side ownership checks.
- Verify decision history, required rationale, owner assignment, action completion, and honest communication state.
- Verify desktop and mobile layouts, keyboard workflow, empty/loading/error states, and successful Vercel production build.
- Future product metrics: time from intake to reviewed evidence, review correction rate, time to explicit decision, overdue-action rate, and proportion of decisions with recorded partner follow-up. Establish baselines before claiming improvement.

## Delivery Plan and Open Decisions

21 October: approve scope, architecture, and design direction; establish schema, fixtures, and application shell after approval.
22 October: finish ingestion, real AI review, analytics, opportunities, and isolated persistence as one complete workflow.
23 October: integration checks, Impeccable design/usability review and material fixes, Vercel deployment, README and concise case study. Prioritise the complete core workflow if time tightens.

The proposal was approved on 21 October 2026, including isolated anonymous demo workspaces and fictional aliases. Relay is implemented with Neon PostgreSQL, GitHub repository asieduanita-tech/relay, and Vercel project relay. The no-spend scope below supersedes live extraction.


## No-spend scope update — 21 October 2026

The user requires no payment card and no spending. Live AI is disabled in code and Vercel configuration. New imports are saved without automatic extraction; seeded findings remain explicitly labelled precomputed synthetic analysis. The real-provider adapter is retained for reference only and cannot be enabled through environment settings alone. No paid upgrades, credit purchases, or billable model calls are authorised. The approved demo uses free hosting/database tiers and the synthetic review-to-decision workflow.
