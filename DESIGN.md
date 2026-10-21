---
name: Relay
description: Partner intelligence, connected to action.
colors:
  canvas: "#f7f8f5"
  surface: "#fff"
  ink: "#202c28"
  muted: "#5d6b62"
  line: "#e1e6df"
  green: "#276146"
  green-dark: "#193c30"
  green-pale: "#edf4ec"
  amber: "#866018"
  amber-pale: "#f9f1df"
  red: "#a34536"
  red-pale: "#fbede8"
  rail: "#18392e"
typography:
  display:
    fontFamily: "Newsreader Variable, serif"
    fontSize: "38px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "13px"
    lineHeight: 1.55
  label:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "11px"
    fontWeight: 500
rounded:
  badge: "4px"
  control: "6px"
  finding: "8px"
  table: "9px"
  panel: "10px"
spacing:
  compact: "8px"
  small: "12px"
  medium: "18px"
  section: "25px"
  wide: "36px"
components:
  button-primary:
    backgroundColor: "{colors.green-dark}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "10px 15px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 15px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "10px 15px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 11px"
  finding:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.finding}"
    padding: "17px"
---

# Design System: Relay

## Overview

**Creative North Star: "The Partner Research Brief"**

Relay presents partner intelligence as a contemporary editorial research brief inside a working operations tool. A deep forest rail anchors a warm near-white workspace; restrained containers and aligned tables keep evidence readable.

Inter carries the work and Newsreader provides editorial page titles. Density serves repeated scanning, while exact quotations, explicit status labels and visible provenance support careful review. Synthetic examples and unavailable live analysis remain clearly disclosed.

**Key Characteristics:**

- Forest navigation with a quiet, near-white workspace.
- Editorial titles and practical, compact work typography.
- Flat surfaces, fine borders and restrained semantic color.
- Evidence, provenance and human review remain visible.

## Colors

Forest and sage support a restrained neutral workspace. The frontmatter records the canonical source tokens; component-specific semantic badge colors are preserved in the sidecar snippets.

### Primary

- **Forest Action** (`green-dark`): primary actions and strong interaction emphasis.
- **Working Green** (`green`): links, selection accents and form caret.
- **Forest Rail** (`rail`): persistent navigation background.
- **Pale Sage** (`green-pale`): supporting positive context.

### Secondary

- **Review Amber** (`amber`, `amber-pale`): caution and pending-review context.
- **Error Clay** (`red`, `red-pale`): failure, destructive action and error feedback.

### Neutral

- **Warm Canvas** (`canvas`): page background.
- **White Surface** (`surface`): inputs and bounded working containers.
- **Forest Ink** (`ink`): primary reading text.
- **Muted Moss** (`muted`): secondary explanations.
- **Quiet Line** (`line`): tables, separators and container edges.

## Typography

**Display Font:** Newsreader Variable, serif fallback.  
**Body Font:** Inter Variable, sans-serif fallback.

**Character:** Editorial page titles introduce practical working text. Serif type also appears in opportunity titles and contextual headings; it is not a replacement for table or form typography.

### Hierarchy

- **Display:** page title role from the frontmatter; mobile titles reduce to (31px), with line height (1.17).
- **Headline:** section headings from the frontmatter.
- **Title:** finding and component headings from the frontmatter.
- **Body:** default reading role from the frontmatter; paragraphs have a maximum width of (75ch). Supporting paragraphs commonly use (11–12px) with generous line spacing.
- **Label:** forms and compact metadata. Tables use (12px); mobile table titles use (11px). Metadata below this scale is an incumbent density compromise, not a default for new body copy.

**The Evidence Rule.** Keep quotations, source context and review status legible beside the decisions they support.

## Layout

A fixed rail (224px) sits beside a flexible main column. Desktop content padding is (36px 36px 28px). Detailed workflows use a flexible content column plus a context column (260px), separated by (36px). Overview metrics form four aligned columns; counts distinguish partners, sources and issues.

At (1250px) and below, the rail reduces to (200px) and content padding to (30px 25px). At (1050px), detailed workflows and the overview chart stack. At (760px), the rail becomes a dismissible drawer, main content spans the viewport with (20px) horizontal padding, forms stack and metrics form two columns. Dense tables scroll within their own bounded region. At (1600px) and above, main content caps at (1460px). Preserve minimum-width containment on the main column and table regions.

## Elevation & Depth

The workspace is flat. White working surfaces, pale contextual regions and fine borders establish depth without shadows. Overlays are limited to mobile navigation and its translucent backdrop.

**The Flat Surface Rule.** Separate content with tone, spacing and fine borders; the implemented interface uses no elevation shadows.

## Shapes

Controls have gently curved corners; findings, tables and larger panels step through the frontmatter radius roles. Badges are compact rounded rectangles rather than pills. Partner avatars and circular status marks provide the few round silhouettes. Use fine single-pixel borders for working containers and row separators.

## Components

### Buttons

Restrained, compact actions. Primary uses Forest Action with white text; secondary uses white with a muted border; ghost uses transparent fill and muted text. Standard controls have a minimum height of (40px). Background changes transition over (150ms ease). Primary hover uses (#285943), secondary hover (#eef3eb). Disabled buttons reduce opacity to (.52). Keyboard focus has a green outline (2px) offset by (3px).

### Chips

Written status labels carry meaning alongside color. Neutral uses gray sage; accepted/planned/delivered states use green; review/deferred uses amber; failures/high severity use clay. Padding is (3px 7px). The final desktop badge text is (10px), mobile (9px).

### Cards / Containers

Working containers are white with fine borders and no shadow. Findings use the finding radius and padding tokens. Import and chart panels use the panel radius; contextual asides use a pale sage fill with (23px) padding. Most list content uses dividers rather than individual cards.

### Inputs / Fields

White fill, a quiet border (#cbd3c9), control radius and minimum height (40px). Textareas allow vertical resizing and use generous line spacing. Explicit labels sit above fields. Keyboard focus uses the shared outline; errors include written messages in a pale clay region. Upload regions use dashed borders and visible focus-within treatment.

### Navigation

Forest rail navigation uses Inter (12px) with inline SVG icons. Default links are muted light sage; hover deepens the local fill, and the current destination receives a persistent lighter forest background plus `aria-current`. Mobile navigation opens from the left and includes a dismissible backdrop and close control.

### Evidence and review

Findings preserve exact quotations, source metadata, explicit review state and correction fields. Quote highlights use pale sage; original source text remains reachable. Evidence is supporting content, never a decorative testimonial. New imports remain unanalysed while live AI is hard disabled; review examples explicitly identify precomputed synthetic analysis.

## Do's and Don'ts

### Do:

- Do use Inter for working text and Newsreader for editorial titles.
- Do pair semantic colors with written status labels.
- Do preserve visible focus, explicit form labels and scrollable dense tables.
- Do disclose precomputed synthetic examples and that new imports are saved without live AI analysis.

### Don't:

- Don't imply synthetic findings are live model results.
- Don't replace source quotations or provenance with decorative summaries.
- Don't introduce decorative elevation or imagery into the restrained operations workspace.
