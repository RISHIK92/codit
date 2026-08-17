# Codit — Design system

Two ideas drive everything. Everything else follows from them.

## 1. Reading is the product

Prose, criteria, grader feedback, explanations and code *are* what people come
here to do. The previous system had **219 text nodes at 11px or smaller and only
seven at 14px or above** — a decorative scale, not a reading one — plus 135
`uppercase tracking-widest` labels at 9–10px in a faint grey.

The type scale now has a floor and a purpose for every step:

| Token | Size | For |
|---|---|---|
| `text-xs` | 12px | Badges, metadata, timestamps. **The floor — nothing goes below.** |
| `text-sm` | 13px | Dense UI, secondary controls |
| `text-base` | 15px | Default UI text |
| `text-md` | 16px | Prose read at length — descriptions, feedback, explanations |
| `text-lg` → `text-4xl` | 18–48px | Headings and display |

Line heights are bound to sizes in `@theme`, so nobody can pair 15px text with a
1.2 leading by accident. Long prose gets `.prose-measure` (68ch) because past
~80 characters the eye loses its place on the return sweep.

The 135 hand-rolled micro-labels collapse into one `.label` class: 12px, 0.07em
tracking, readable colour. Uppercase is fine at 12px; at 9px with 0.2em tracking
it is decoration pretending to be information.

## 2. The palette carries the product's own argument

From the spec: *what you build stands on the ground, what you understand is
written in the sky.* So the colours split along the same line the growth layer
enforces in data:

| Token | Colour | Meaning |
|---|---|---|
| `earth` | `#d0a05e` brass | **Build** — what exists because of you |
| `sky` | `#8fabdd` | **Understand** — what you can explain |
| `sage` | `#93ad84` | **Explore** — how far you've looked |
| `clay` | `#cd8f6d` | **Show** — warmth turned outward |

**The accent is the sky blue**, because what this product is about is the
understanding, not the shipping.

`success` and `accent` are now different colours. They were previously both
`#7fffd4`, which meant "this passed" and "this is clickable" were visually
identical.

### Ground: warm ink, not cold neon

The base moved from `#07080a` (blue-black) to `#14130f` (warm near-black). Pure
black against near-white text is a ~19:1 crush that makes long reading feel like
staring at a lightbulb, and a blue-black ground turns earth tones muddy. Borders
went from `rgba(255,255,255,0.06)` to `0.10` — below that, cards didn't read as
cards and the UI looked like text floating on a gradient.

The tone this aims at is an observatory logbook rather than a spaceship console:
warm, patient, quiet enough to read at length.

## Motion

Every ambient loop is gone — shimmer on text, drifting mesh, pulsing glows.
Motion that never resolves competes with reading and carries no information.
What's left reports state changes: entrances, toasts, and the assistant's typing
indicator (which loops, but encodes live state — that's the distinction).

## Also fixed

- **Four typefaces → three.** Bebas Neue earned nothing but load time.
- **A focus ring.** There wasn't one. That's a real accessibility gap in a
  product with this much keyboard-driven work.
- **One card treatment** (`.card`, `.card-inset`, `.card-interactive`). Cards
  were previously defined ad hoc with different radii, borders and padding,
  which is why nothing felt like one system.
- **The landing page.** It was template boilerplate ("The Future of Your
  Workflow Starts Here", "polished volcanic glass") advertising 124K+ active
  users, 99.9% uptime and a 4.9★ rating — all invented. Fabricated social proof
  on the front door of a product whose argument is that credentials should be
  earned is the worst possible first impression, so it's gone rather than
  restyled.

## Working on this

`/preview` renders the type scale and every major surface with sample data and
no auth, so the visual system can be reviewed without a login or a database.

**Tailwind v4 note:** `@theme` needs *literal* values. `--color-earth:
var(--earth)` silently produces no utility at all — the whole block is ignored
and every `text-*`/`bg-*` token disappears. Values live as literals in `@theme`;
hand-written CSS consumes them via `var(--color-*)`.
