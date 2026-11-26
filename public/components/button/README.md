# Button

Text buttons (primary; secondary, tertiary and link in gray and blue) and their icon-only versions. One hierarchy, one set of colours and sizes for every screen.

## Files

| File | What it is |
| --- | --- |
| `Button.tsx` | **The spec for text buttons.** Hierarchy, anatomy, sizes, every state, loading, accessibility, tokens, plus a typed React `Button`, wrappers (`PrimaryButton`, `SecondaryButton`, `SecondaryBlueButton`, `TertiaryButton`, `TertiaryBlueButton`, `LinkGrayButton`, `LinkBlueButton`) and a `ButtonStates` gallery |
| `IconButton.tsx` | **The spec for icon-only buttons.** Same variants and sizes as square buttons, tooltip and aria rules, plus a typed `IconButton`, wrappers and an `IconButtonStates` gallery |
| `button.css` | Runtime styles for `.lb-btn` and `.lb-icon-btn` (every variant and size). Linked from `index.html` |

The New Review Cycle editor uses these classes (header, date picker, reviewer table, auto-assign, exit dialog). Older screens still write the looks per screen (`.editor__action`, `.cd-btn`, `.cd-iconbtn`, `.icon-button`, `.link-button`); move them to `.lb-btn` / `.lb-icon-btn` when you touch them.

```html
<button type="button" class="lb-btn lb-btn--primary">Create Cycle</button>
<button type="button" class="lb-btn lb-btn--tertiary-blue lb-btn--sm"><span class="lb-btn__icon lb-btn__icon--plus" aria-hidden="true"></span><span class="lb-btn__label">Add category</span></button>
<button type="button" class="lb-icon-btn lb-icon-btn--tertiary lb-icon-btn--sm" aria-label="Remove Manager" data-tip="Remove"><span class="lb-icon-btn__icon lb-icon-btn__icon--close" aria-hidden="true"></span></button>
```

## Variants

| Variant | Look | Use for |
| --- | --- | --- |
| `primary` | `#2970FF` fill, white text | The one main action in a view |
| `secondary` | White, 1px `#D0D5DD` border, `#344054` text | Other actions next to it |
| `secondary-blue` | White, 1px `#B2CCFF` border, `#2970FF` text, `#F5F8FF` on hover | A second action that should stand out more than gray |
| `tertiary` | No fill or border, `#475467` text, `#F2F4F7` on hover | Low-emphasis actions in content, row actions |
| `tertiary-blue` | No fill or border, `#2970FF` text, `#EFF4FF` on hover | Row actions that move work forward (Continue setup, Reopen) |
| `link-gray` | `#475467` text, underline on hover | Inline text actions |
| `link-blue` | `#2970FF` text, underline on hover | Inline actions that stand out or navigate |

## Sizes

| Size | Height / icon box | Side padding | Text |
| --- | --- | --- | --- |
| `sm` | 36px | 14px; 12px with an icon + label (icon-only: 8px) | 14 / 600 |
| `lg` (default) | 44px | 16px (icon: 12px) | 16 / 600 |

Icons are 20px in every size. All buttons have 8px corners.
