# Feedback banners

Inline notes for info, warnings, errors and neutral hints.

Design source: Figma · Prince's Cauldron · **Feedkack Banners**
https://www.figma.com/design/jprp52qS9GFx1A1ZqUdEYe/Prince-s-Cauldron?node-id=7722-20392

## Files

| File | What it is |
| --- | --- |
| `banner.js` | `banner(type, content, opts)` — returns the banner's HTML string |
| `banner.css` | Styles for all variants |
| `icons/` | 16×16 icons exported from Figma, one per variant |

Both files are linked from `index.html` (CSS in `<head>`, JS before the feature layers), so any view or layer can call `banner()`.

## Variants

| Type | Use it for | Background | Border | Icon |
| --- | --- | --- | --- | --- |
| `info` | Rules and explanations the user should know | `#F5F8FF` | `#D1E0FF` | `icons/info-blue.svg` |
| `warning` | Something that needs attention but doesn't block | `#FFFAEB` | `#FEDF89` | `icons/alert-warning.svg` |
| `error` | Something that blocks saving or launching | `#FEF3F2` | `#FECDCA` | `icons/alert-error.svg` |
| `gray` | Neutral hints and secondary notes | `#F9FAFB` | `#EAECF0` | `icons/info-gray.svg` |

All variants share the same layout:

- 12px padding, 8px gap between icon and text, 8px radius, 1px border
- Text is Inter Medium, 14px, 1.4 line height, −0.28px letter spacing, `#30374F`
- The text takes the full width and wraps, and the icon stays at the top

## Usage

```js
banner("info", "If a reviewer isn't found, their weightage is split evenly across the other reviewers.");

banner("warning", `<b>3 people</b> have no phone or email.`);

banner("error", "Weightage must add up to 100%.", { live: true, id: "weightErr" });

banner("gray", "You can change this later.", { cls: "my-extra-class" });
```

### Options

| Option | Default | What it does |
| --- | --- | --- |
| `cls` | — | Extra class names on the banner |
| `id` | — | Element id |
| `live` | `false` | Use `role="alert"` for warning and error banners, so screen readers announce them when they appear. Leave it off for banners that show on every render. |

`content` is inserted as HTML. Escape any user-supplied data with `esc()` first.
