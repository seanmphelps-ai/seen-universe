# SEEN UI CARD IMPLEMENTATION RULES

**Status:** current implementation authority for SEEN card/page composition.

## Core rule

Artwork supplies atmosphere. The interface supplies language and behavior.

### Artwork layer

- Background artwork may contain atmosphere, texture, glow, illustration, motion, framing, ornament, geography, and visual symbolism.
- Do **not** bake product copy, labels, field text, button text, or instructions into generated artwork.
- Generated artwork must remain reusable when wording changes.

### Live interface layer

All visible product language and controls are live HTML/React UI:

- headings
- labels
- descriptions
- inputs
- autocomplete results
- add/remove controls
- buttons
- validation/error states

This keeps text sharp and responsive, prevents duplicate text, keeps controls functional, allows accessibility tools to read the interface, and permits permanent wording changes without regenerating artwork.

## Typography direction

SEEN uses editorial contrast:

- very large signature display typography
- very small restrained utility/support typography
- strong negative space
- minimal copy
- no generic AI-luxury typography treatment

The display face should be distinctive enough to function as part of SEEN's identity rather than looking like a common app/template font.

Do not add or distribute licensed font software without the appropriate license and project-owned font files.

### Current type candidate — not yet licensed/locked

Commercial Type's **Frame** collection is under review:

- `Frame Head` — potential display face
- `Frame Text` — potential editorial/text companion

Do not implement these font files until an appropriate web/app license and project-owned assets are available. Until then, keep typography tokens replaceable rather than scattering font-family declarations throughout components.

## Forge location card/page

User-facing language should be minimal.

Current hierarchy:

- `01` — optional small index
- `THE FORGE` — primary title
- `What were you exposed to?` — supporting question
- `Birth Location`
- `Locations Lived 6+ Months`
- `Current Location`
- `+ Add another location`
- `Continue`

Do not introduce `PLACE`, `Where were you formed?`, `Where was this system molded?`, or similar formation/identity claims.

Location is an exposure/incubator field. It collects the conditions a human lived inside. FORGED conclusions emerge later from evidence convergence; the UI must not imply that a location predetermined or completed a person.

## Change discipline

- Do not rewrite approved copy as part of styling work.
- Do not add explanatory prose just because visual space exists.
- Do not regenerate artwork to change wording.
- Do not move functional text back into image assets.
- Prefer subtraction over decorative labels or extra terminology.
