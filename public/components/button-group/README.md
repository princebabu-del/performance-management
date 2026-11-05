# Button group (segmented control)

A bordered row of toggle buttons with count badges, used inside cards and toolbars to switch between filtered views of a list (Overview › Cycles "Active / Closed", Cycle detail › Employees "All / Needs attention / …"). For page-level tabs under a header, use [`../tabs`](../tabs/README.md).

## Files

| File | What it is |
| --- | --- |
| `ButtonGroup.tsx` | **The spec.** Anatomy, every state and badge tone, tokens, accessibility, plus a typed React reference and a `ButtonGroupStates` gallery |
| `buttonGroup.js` | `btnGroup(items, opts)`: returns the group's HTML string |
| `button-group.css` | Styles. Keep in sync with the tokens in `ButtonGroup.tsx` |

Both runtime files are linked from `index.html`.

## Usage

```js
btnGroup(
  [{ id: "All", label: "All", count: 23 },
   { id: "Needs attention", label: "Needs attention", count: 7, tone: "warning" },
   { id: "Done", label: "Done", count: 0 }],
  { active: S.quick, label: "Show employees", size: "lg", onSelect: id => `S.quick='${id}';render()` });
```

| Item field | What it does |
| --- | --- |
| `id` | Key passed to `onSelect` and compared with `opts.active` |
| `label` | Visible text (escaped for you) |
| `count` | Badge text. Leave it out for no badge; `0` still shows |
| `tone` | `neutral` (default), `info`, `warning` (needs attention) or `danger` |
| `disabled` | Shown but can't be selected |
| `onclick` | JS for this button only; overrides `onSelect` |

| Option | What it does |
| --- | --- |
| `active` | id of the selected button |
| `onSelect` | `id => "js string"` run on click |
| `label` | `aria-label` for the group |
| `size` | `md` (40px, default) or `lg` (44px, to line up with 44px search fields and buttons) |
| `max` | Counts above this show as `max+` (default 99) |
| `cls`, `id` | Extra class names / element id |

States, colours and accessibility are documented in `ButtonGroup.tsx`.
