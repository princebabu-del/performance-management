# Page tabs

Underline tabs with count badges, shown under a page header (Review Cycles, Review Templates, My Reviews, Users). The selected tab has a 3px blue (`#2F6FDE`) underline.

## Files

| File | What it is |
| --- | --- |
| `Tabs.tsx` | **The spec.** Anatomy, every state and badge tone, tokens, accessibility, plus a typed React reference and a `TabsStates` gallery |
| `tabs.js` | `tabBar(items, opts)`: returns the tab list's HTML string. Also adds arrow-key navigation |
| `tabs.css` | Styles. Keep in sync with the tokens in `Tabs.tsx` |

Both runtime files are linked from `index.html`.

## Usage

```js
tabBar(
  [{ id: "Active", label: "Active", count: 3 },
   { id: "Scheduled", label: "Scheduled", count: 0 },
   { id: "Issues", label: "Issues", count: 3, tone: "danger" }],
  { active: S.cycTab, label: "Review cycle status", onSelect: id => `nav('cycles',{cycTab:'${id}'})` });
```

| Item field | What it does |
| --- | --- |
| `id` | Key passed to `onSelect` and compared with `opts.active` |
| `label` | Visible text (escaped for you) |
| `count` | Badge text. Leave it out for no badge; `0` still shows |
| `tone` | `neutral` (default), `info` or `danger` |
| `disabled` | Shown but can't be selected |
| `onclick` | JS for this tab only; overrides `onSelect` |

| Option | What it does |
| --- | --- |
| `active` | id of the selected tab |
| `onSelect` | `id => "js string"` run on click |
| `label` | `aria-label` for the tab list |
| `max` | Counts above this show as `max+` (default 99) |
| `cls`, `id` | Extra class names / element id |

States, colours and keyboard behaviour are documented in `Tabs.tsx`.
