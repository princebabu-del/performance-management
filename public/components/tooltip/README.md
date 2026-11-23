# Tooltip

A short dark label shown on hover or keyboard focus: names icon-only buttons ("Remove", "Edit") or explains a disabled control in a few words. The default has the pointer at the **bottom center** (bubble above the element).

## Files

| File | What it is |
| --- | --- |
| `Tooltip.tsx` | **The spec.** Anatomy, all pointer variations, timing, accessibility, tokens, plus a typed React `Tooltip`, a static `TooltipBubble` and a `TooltipStates` gallery |
| `tooltip.js` | Runtime: any element with `data-tip` gets the tooltip. No function call needed |
| `tooltip.css` | Styles. Keep in sync with `TOOLTIP_TOKENS` in `Tooltip.tsx` |

Both runtime files are linked from `index.html`.

## Usage

```html
<button aria-label="Edit cycle" data-tip="Edit">…</button>
<button aria-label="Clear repeats" data-tip="Remove" data-tip-delay="300">…</button>
<th data-tip="Share of the overall score" data-tip-pos="bottom">Weightage</th>
<span data-tip="Saved 2 min ago" data-tip-arrow="none">…</span>
```

| Attribute | What it does |
| --- | --- |
| `data-tip` | The text. Required |
| `data-tip-pos` | Where the bubble sits. The pointer is on the opposite side. `top` (default, pointer bottom center), `top-start` (bottom left), `top-end` (bottom right), `bottom` (pointer top center), `bottom-start` (top left), `bottom-end` (top right), `left` (pointer right), `right` (pointer left) |
| `data-tip-arrow="none"` | No pointer |
| `data-tip-delay` | Milliseconds to wait on hover before showing. Keyboard focus shows it at once |

The tooltip hides as soon as the pointer leaves the element. It also hides on mousedown, scroll, Escape, window blur, or when the element is re-rendered away. `top` and `bottom` flip when there's no room. Icon-only buttons still need an `aria-label`.
