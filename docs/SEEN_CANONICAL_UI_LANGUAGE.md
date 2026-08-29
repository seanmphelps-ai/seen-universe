# SEEN Canonical UI Language

This document is the visual source of truth for every SEEN PWA surface.

## Approved Reference

Approved reference image: `docs/assets/SEEN_APPROVED_UI_REFERENCE.jpg`

The reference governs palette, typography, spacing, component geometry, borders, shadows, glow, icon treatment, visual hierarchy, and mobile composition.

Repository product canon governs language, labels, calls to action, route names, feature names, screen progression, runtime behavior, and product positioning.

## Runtime Registration

The executable visual system lives in:

```text
app/styles/tokens.css
app/styles/splash.css
app/styles/flow.css
app/styles/responsive.css
```

`app/globals.css` imports those files for every route. Every current and future user-facing surface consumes the same design tokens and shared visual primitives.

## Palette

```css
:root {
  --seen-bg: #171512;
  --seen-surface: #211e1a;
  --seen-surface-raised: #2a251f;
  --seen-text-primary: #f4efe5;
  --seen-text-secondary: #cfc8bb;
  --seen-gold: #fbea83;
  --seen-gold-deep: #d8c56a;
  --seen-border: rgba(251, 234, 131, 0.28);
  --seen-border-strong: rgba(251, 234, 131, 0.58);
  --seen-glow: rgba(251, 234, 131, 0.32);
  --seen-shadow: rgba(0, 0, 0, 0.58);
}
```

## Typography

- Display and editorial headings: `Cormorant Garamond`, serif.
- Functional UI copy: `Inter`, sans-serif.
- Display XL: `clamp(3rem, 9vw, 5.75rem)`, line-height `0.94`, weight `500`.
- Display L: `clamp(2.25rem, 7vw, 4rem)`, line-height `1`.
- Heading M: `clamp(1.75rem, 5vw, 2.5rem)`, line-height `1.08`.
- Body: `1rem`, line-height `1.65`.
- Label: `0.72rem`, line-height `1`, weight `600`, letter-spacing `0.18em`, uppercase.
- Button: `0.82rem`, weight `700`, letter-spacing `0.16em`, uppercase.

## Spacing

```css
:root {
  --seen-space-1: 4px;
  --seen-space-2: 8px;
  --seen-space-3: 12px;
  --seen-space-4: 16px;
  --seen-space-5: 20px;
  --seen-space-6: 24px;
  --seen-space-8: 32px;
  --seen-space-10: 40px;
  --seen-space-12: 48px;
  --seen-space-16: 64px;
}
```

Mobile screens use `20px` horizontal padding, `24px` section rhythm, and `32px` major-section rhythm. Controls maintain a minimum `52px` touch height.

## Page Composition

- Full-height deep espresso background.
- Content width: `min(100% - 40px, 520px)` for intake and focused Oracle screens.
- Primary heading, concise supporting sentence, thin luminous divider, then the active interaction surface.
- One luminous primary action anchors each screen.
- Content density supports calm reading and one-handed mobile use.

## Panels

```css
.seenPanel {
  background:
    radial-gradient(circle at 50% 0%, rgba(251, 234, 131, 0.055), transparent 44%),
    linear-gradient(180deg, #211e1a 0%, #191613 100%);
  border: 1px solid var(--seen-border);
  border-radius: 24px;
  box-shadow:
    0 24px 70px var(--seen-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.035);
}
```

Panel padding: `24px` mobile, `32px` tablet and desktop.

## Inputs

```css
.seenInput {
  width: 100%;
  min-height: 56px;
  padding: 15px 16px;
  color: var(--seen-text-primary);
  background: rgba(255, 255, 255, 0.018);
  border: 1px solid var(--seen-border);
  border-radius: 12px;
  outline: 0;
  transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.seenInput:focus {
  background: rgba(251, 234, 131, 0.025);
  border-color: var(--seen-border-strong);
  box-shadow: 0 0 0 3px rgba(251, 234, 131, 0.08);
}
```

- Input labels use the UI sans font.
- Field icons use the gold accent.
- Supporting copy uses `--seen-text-secondary` at `0.82rem`.
- Multi-location rows use the same field geometry with a gold circular add control aligned right.

## Primary Button

```css
.seenButtonPrimary {
  min-height: 54px;
  padding: 0 24px;
  color: #171512;
  background: linear-gradient(90deg, #d8c56a 0%, #fbea83 52%, #d8c56a 100%);
  border: 1px solid rgba(255, 245, 177, 0.78);
  border-radius: 999px;
  box-shadow:
    0 0 28px var(--seen-glow),
    0 10px 28px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.46);
  font-family: Inter, sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
```

## Secondary and Chip Buttons

```css
.seenButtonSecondary,
.seenChip {
  min-height: 50px;
  padding: 0 22px;
  color: var(--seen-text-primary);
  background: rgba(23, 21, 18, 0.72);
  border: 1px solid var(--seen-border-strong);
  border-radius: 999px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025);
}
```

The chip CTA uses small gold star marks on both sides of the canonical product label.

## Dividers and Glow

```css
.seenDivider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--seen-gold-deep), var(--seen-gold), var(--seen-gold-deep), transparent);
  box-shadow: 0 0 12px var(--seen-glow);
}
```

Glow concentrates around primary actions, line centers, and selected controls. Large surfaces remain matte and dark.

## Icons

- Stroke icons use `1.5px` lines.
- Icon color: `--seen-gold-deep` or `--seen-gold`.
- Standard icon size: `20px`; feature icon size: `24px`.
- Location, calendar, clock, plus, sparkle, and directional arrow icons follow the approved reference.

## Foundation Intake Composition

1. Compact progress state.
2. Canonical screen heading.
3. Canonical supporting context.
4. Birth-location control.
5. Repeatable lived-location controls.
6. Current-location control.
7. Birth-date control.
8. Optional birth-time control with canonical clarification copy.
9. Canonical full-width primary action.
10. Centered luminous completion divider.

Product strings resolve from the governing intake and product-language canon.

## Responsive Behavior

- Primary target: `390px` to `430px` mobile width.
- Intake remains single-column through tablet.
- Desktop centers the mobile composition within a wider editorial frame.
- Controls retain their mobile geometry and touch targets at every width.
- Display type scales through `clamp()` while panels remain readable and restrained.

## Motion

- Field focus: `180ms ease`.
- Button press: `120ms ease` with `transform: translateY(1px)`.
- Panel entrance: `500ms cubic-bezier(0.22, 1, 0.36, 1)`.
- Section fade: `420ms ease`.
- Glow pulse: `2400ms ease-in-out`, low amplitude.

## Build Application

Every user-facing SEEN route consumes these tokens and component rules before phase-specific styling. Splash, Foundation Intake, Oracle, Recognition, Portal Cards, Closure & Composure, Cadence, and Share Cards use this same visual language.

## Visual Acceptance

Each user-facing route:

- consumes global SEEN tokens;
- uses Cormorant Garamond for editorial hierarchy;
- uses Inter for functional interface language;
- uses warm ivory text and espresso layered surfaces;
- uses controlled champagne-gold emphasis;
- uses canonical spacing and touch dimensions;
- presents one visually dominant action;
- preserves canonical SEEN product language;
- renders correctly at `390px`, `430px`, and centered desktop widths.
