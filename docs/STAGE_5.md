# Stage 5 — final QA and release preparation

22 October 2026. **Local release candidate only.** GitHub and the public demo still contain the earlier release. Commit, push and deployment each require explicit approval.

## Reconciled synthetic data

Run `node --import tsx scripts/verify-release.ts`. Saved output: [release-reconciliation.json](release-reconciliation.json). It validates fixture relationships and exact quotations, sums partner counts independently and checks Overview rates.

| Metric | September | Monthly change |
| --- | --- | --- |
| Successful payments | 99.70% | +1.50 pp |
| Reversed payments | 0.16% | −1.35 pp |
| Successful disputes | 43.52% | +1.87 pp |
| Timed out card attempts | 1.50% | −7.31 pp |
| Flagged inbound payments | 1.43% | −10.49 pp |

The fixture has 5 fictional partners, 9 definitions, 6 complete months, 270 observations, 54 historical notes, 21 current sources, 18 accepted findings, 3 suggestions, 5 issues and 5 opportunities. All source records and observations are explicitly synthetic. Source offsets and issue/product references reconcile. Partner views sum to Overview counts; rates use weighted raw counts. No real-bank performance or commercial value is claimed.

## QA changes

- Added zero-warning ESLint and matching Next configuration; CI now includes lint. Removed unused imports and captured the navigation opener before effect cleanup.
- Initial workspace requests now cancel on unmount. Retry behaviour is retained and tested.
- Kept TypeScript 7 as `tsc`, while an alias supplies the TypeScript 6 API required by lint. This follows [Microsoft's side-by-side guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/). No framework upgrade.
- Added public-endpoint security checks and the numerical reconciliation artifact. Updated README, case study and validation records to distinguish local changes from the earlier live release.

## Security and no spending

AI is hard-disabled before quota reservation, provider construction or model calls. Credentials/environment settings alone cannot enable it. Seed analysis is labelled precomputed; new imports remain unanalysed.

Endpoint checks cover unsigned/tampered sessions, foreign workspace objects, cross-origin requests, non-JSON and oversized input, unchanged data after blocked analysis, independent visitor state and protected cleanup. Cookies are HTTP-only and SameSite Strict; the production Secure flag is checked in source. Workspace GET uses no-store. Production requires a long secret and PostgreSQL and forbids local-file fallback. Database updates use row locks and parameterised queries. No production database was queried or changed in this stage.

Dependency audit: **0 production vulnerabilities**. Full audit: **5 high-severity entries in one development-only chain**: Next ESLint config/plugin → fast-glob → micromatch → braces. The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists no patch. This path handles repository globs, not partner input. No force-fix or framework downgrade was applied. Revisit when supported tooling fixes exist. Install emits older plugin peer-range warnings with ESLint 10; the installed Next docs support it and actual lint execution is checked.

## GitHub instructions — not executed

This workspace has no `.git` directory. Preserve remote history using a fresh clone; do not initialise over the working copy or force-push. After approval, run in your own terminal:

```sh
cd /Users/anitaasiedu/Desktop
git clone https://github.com/asieduanita-tech/relay.git relay-release-review
cd relay-release-review
git switch -c release/relay-demo-review
rsync -av --exclude='.git/' --exclude='node_modules/' --exclude='.next/' --include='.env.example' --exclude='.env*' --exclude='.vercel/' --exclude='.data/' --exclude='.agents/' --exclude='.impeccable/review/' --exclude='test-results/' --exclude='playwright-report/' --exclude='*.tsbuildinfo' /Users/anitaasiedu/Desktop/PartnerSignal/ ./
git status --short
git diff --check
git diff --stat
```

Review every staged file, excluding secrets, local data and traces. Only with explicit commit/push approval:

```sh
git add --all
git diff --cached --stat
git commit -m "Connect Relay synthetic performance, evidence and product decisions"
git push -u origin release/relay-demo-review
```

Review/merge separately. An automatic Vercel integration could deploy a pushed branch; check its settings before an approved push. Automatic linking was not established in the earlier setup. No history deletion or force-push is needed.

## Vercel instructions — separate approval required

Use the existing **relay** project linked through ignored `.vercel/project.json`. No new project, card or paid upgrade. Preserve `DATABASE_URL`, `SESSION_SECRET`, `CRON_SECRET`; keep `AI_ENABLED=false`. Do not rotate secrets or rerun the one-time configuration script. SQL schema is unchanged; no database migration is needed.

After explicit deployment approval:

```sh
npx --yes vercel --prod --yes
```

Authenticate if the CLI session expired; do not paste secrets into chat or command arguments. The upload ignore file excludes environment files, local workspace data and traces. A build alone does not prove the current alias https://relay-olive-six.vercel.app has changed.

After deployment, check the public alias in two new browser sessions: latest rates, source drill-downs, decisions/actions, draft-only follow-up, disabled AI, independent state and reset. Older modified sessions preserve operator work; use a new session for revised samples. Roll back to the previous successful Vercel deployment if smoke checks fail.

## Limits

No new deployment, production database exercise, physical-device certification, cross-browser or full screen-reader review is claimed. Existing CSP retains inline/eval allowances; this is not an enterprise security certification. Live AI extraction/accuracy evaluation remains excluded by the no-spend requirement.

## Final observed results

- `npm run lint`: passed, **0 warnings**.
- `npm test`: **38 passed**.
- `npm run typecheck`: passed.
- `npm run test:e2e`: **17 passed** in the complete final run (2.8 minutes).
- `npm ci --dry-run --ignore-scripts`: passed; install peer-range warnings noted above.
- `DATABASE_URL= SESSION_SECRET= CRON_SECRET= AI_ENABLED=false npm run build`: passed.
- `node scripts/verify-production.mjs`: both production guards passed. Temporary localhost pages return 200, while a presented session with no configured secret and a fresh session with no database return 503. Header checks for DENY framing and nosniff also pass. These processes were stopped by the script.
- `node --import tsx scripts/verify-release.ts`: passed; saved artifact above.
- Targeted credential-pattern check: 71 eligible source/documentation/config files, no matches. This is not a comprehensive secret-detection guarantee; ignored secret/data directories were excluded rather than printed.

The initial production-guard test expected the secret error for a fresh anonymous request, but database creation is checked before signing a new cookie. The verification now presents an invalid cookie to exercise the secret guard explicitly, then separately checks the fresh-session database guard. Application behaviour was unchanged.

Review locally at http://127.0.0.1:3000. Complete check summaries are also in [VALIDATION.md](../VALIDATION.md). No publishing action has been executed; approval remains the final release step.
