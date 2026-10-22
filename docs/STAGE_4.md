# Stage 4 checkpoint — design and usability refinement

Implemented locally; awaiting approval before Stage 5. No push, deployment, paid service, AI call or cloud database change.

## Review locally

Use http://127.0.0.1:3000 in a fresh private browser session if an existing workspace contains older saved edits.

1. **Overview / Partners:** inspect the unchanged rates, six-month trends and horizontally scrolling tables. Tab into a performance table to see its focus outline. Try the partner/product/month controls at 390, 1024 and 1440 px.
2. **Issue `/issues/i1` and opportunity `/opportunities/o2`:** source evidence and decision recording now appear higher. **Performance and source context** is collapsed by default; open it to reach all Stage 3 metric, source and opportunity links. Overview and metric-filtered Feedback keep that context expanded for discovery.
3. **Feedback:** source quotations are larger on mobile. Try All sources / Needs review using Arrow Left/Right and Home/End. Visit `/feedback?source=missing` to see an empty state and **Show all feedback** recovery.
4. **Opportunity:** use the keyboard to switch Decision, Actions and Partner follow-up. Record/save behaviour, owners, exact quotations and metrics remain unchanged.
5. **Mobile navigation:** open the drawer, move through it with Tab/Shift+Tab, press Escape, and check focus returns to the menu button. Touch the Partners link to navigate. The drawer makes background content inert, prevents background scrolling and closes when resized to desktop.
6. **Loading/error states:** automated checks delay and fail a synthetic workspace response, verify a labelled loading status, then retry successfully. These failures are test fixtures, not live outages. Reduced-motion mode keeps loading text/status while making spinners and chart transitions static.

## Changes

- `src/components/evidence.tsx`, `partners.tsx`, `opportunities.tsx`: progressive disclosure for repeated metric context so the main evidence/decision task is prominent.
- `src/components/shell.tsx`: labelled mobile modal navigation, contained focus, Escape, opener focus restoration, inert background, scroll restoration and desktop-resize recovery.
- `src/components/ui.tsx`, `feedback.tsx`, `opportunities.tsx`: keyboard tab navigation with a single selected tab stop; feedback empty-state recovery link.
- `src/components/app.tsx`: loading state exposes status text to assistive technology.
- `src/app/globals.css`: mobile 44px controls, more readable source text, visible table focus, long-text wrapping and targeted reduced-motion states. Retains forest/sage palette, Newsreader/Inter, fine borders and flat surfaces.
- `DESIGN.md` and `.impeccable/design.json`: record these interaction and mobile refinements. `tests/stage4.spec.ts` supplies rendered/state/keyboard/touch checks.

No unfinished feature placeholders or lorem/TODO/FIXME copy were found in `src`. Helpful form-input placeholders remain. No factual claims, source quotations, metric values, priorities or persisted decisions were altered in this stage.

## Impeccable review

Implementation integrity: the extension preserves the existing product-specific system. The session's prior detector advisories (including intentional Inter use and incomplete metadata descriptions) were considered; a redundant detector pass was not added or represented as a clean new scan. Rendered checks and interaction evidence determine the findings below.

| Dimension | Scoped result | Practical limit |
| --- | --- | --- |
| Accessibility | 3/4: labelled loading, keyboard tabs/drawer, focus and recovery improved; rendered AA checks performed | No complete assistive-technology or browser certification |
| Performance | 3/4: native disclosures, bounded content and no added dependency or decorative animation | No new field or bundle-performance benchmark |
| Theming | 3/4: incumbent palette/type/flat surfaces retained | Some incumbent component colors remain local; dark mode is not supported |
| Responsive layout | 3/4: 21 desktop/tablet/mobile captures bounded; mobile controls/readability improved | Emulated Chrome and synthesized touch, not physical devices |
| Implementation integrity | 3/4: main task foregrounded and evidence claims preserved | Existing density compromises remain |
| Total | **15/20 — Good, scoped review** | Scores are qualitative review judgments, not a conformance certificate |

Priority findings addressed:

- **P1 / keyboard:** the mobile drawer allowed background focus and lacked Escape/return focus. Added modal focus behaviour at the shared shell.
- **P1 / keyboard:** tab groups lacked expected arrow-key navigation. Added shared keyboard handling and roving tab stops.
- **P2 / hierarchy:** repeated metric context pushed original evidence and decision recording down the page. Used native disclosure on detail pages; links remain available.
- **P2 / responsive readability:** compact mobile controls and small source text hindered use. Increased control targets and source reading size without changing desktop density.
- **P2 / states:** improved loading semantics, empty recovery, long-text containment and reduced-motion handling.

Impeccable's independent finish reviewer inspected all 21 captures. It found no material visual defects and requested documenting the new interaction patterns. That documentation fix was implemented and explicitly accepted. No redesign or new visual world was introduced.

## Remaining improvements and boundary

A physical-device test, screen-reader walkthrough, cross-browser review and broader density work could improve confidence. Repeated source/context information remains available on demand; this is intentional evidence access. This stage does not claim all accessibility issues are absent merely because automated checks pass.

Stage 5 still owns final numerical/security/regression QA, lint/build and deployment preparation. Publishing requires separate explicit approval.

## Verification results

- `npm test`: **38 passed**; `npm run typecheck`: passed.
- `npm run test:e2e -- tests/stage4.spec.ts`: **4 passed**: 21 rendered/axe page-viewport checks; loading/failure/retry/empty/tab/reduced-motion states; synthesized mobile touch and focus containment; enlarged long-text wrapping.
- Stage 3 scenarios: **3 passed**; existing workflow regression checks: **2 passed** in the preceding combined run.
- No serious or critical axe violations in the 21 final captures. Evidence is Chrome viewport emulation and synthesized touch, not physical-device testing.

An initial retry fixture returned an error for only the first request; React development effects issued another request that succeeded before Retry was clicked. The fixture now holds all requests in the error state until the test explicitly enables recovery. No production request behaviour was changed to satisfy this test.

The documentation review confirmed system preservation and requested only narrow updates to the changed motion/button/navigation descriptions; those updates were applied. Unrelated metadata approximations were left intact.
