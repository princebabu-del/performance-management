# Action menu

The list of actions behind a kebab (⋮), "More" or split button: Move Up, Move Down, Duplicate, Delete, Edit, Archive, Close cycle and so on. It uses the same container and item metrics as the select dropdown (`28-dropdown-menu.css`), so action menus and select menus look alike.

## Files

| File | What it is |
| --- | --- |
| `ActionMenu.tsx` | **The spec.** Variations, specs, states, placement, accessibility, tokens, plus a typed React `ActionMenu` and an `ActionMenuStates` gallery |
| `action-menu.css` | Styles. Keep in sync with `ACTION_MENU_TOKENS` in `ActionMenu.tsx` |

`action-menu.css` is linked from `index.html`.

## Specs

| Part | Value |
| --- | --- |
| Container | #FFF · 1px #EAECF0 · 8px radius · **4px padding** · lg shadow · min 200px, as wide as the longest label |
| Item | 36px · **8px 12px padding** · 8px radius · no gap between items |
| Label | Inter 14/20 medium #101828 |
| Icon | 20px #344054, 1.5px stroke, 8px before the label |
| Hover / focus | #F9FAFB (focus adds a 2px inset blue ring) |
| Danger | #D92D20 label + icon, #FEF3F2 hover |

Items are **icon + label** or **label only**. There are no dividers, and danger items come last.

## Usage

```js
`<div class="kebab">
  <button class="icon-button" aria-label="Question actions" aria-haspopup="menu" aria-expanded="${open}"
          data-tip="More Options" onclick="toggleMenu('${id}',event)">…</button>
  ${open ? `<div class="action-menu" role="menu">
    <button type="button" role="menuitem" class="action-menu__item" onclick="S.menu=null;dup()">${ic("copy","action-menu__icon")}Duplicate</button>
    <button type="button" role="menuitem" class="action-menu__item">Label only</button>
    <button type="button" role="menuitem" class="action-menu__item action-menu__item--danger" onclick="S.menu=null;del()">${ic("trash","action-menu__icon")}Delete</button>
  </div>` : ""}
</div>`
```

| Class | What it is |
| --- | --- |
| `.action-menu` | The popup. By default it sits under the trigger, right-aligned. Add a context class for other placements (`.cd-kb-menu`, `.cd-bulk-menu`, `.question-menu`, `.split-menu`) |
| `.action-menu__item` | One action (`role="menuitem"`) |
| `.action-menu__item--danger` | Destructive action |
| `.action-menu__icon` | 20px icon: an `ic()` svg, or a `span.action-menu__icon--mask` with `style="--icon:url(/assets/icons/….svg)"` |

The `ic()` icons `edit`, `copy`, `archive` and `trash` are drawn from the Untitled UI files (`edit-05`, `copy-03`, `box`, `trash-01`), so they look the same in every menu.

Open and close go through the shared `S.menu` / `toggleMenu(id, event)`. A click outside or Escape closes the menu (`app.js`). Table menus are set to `position: fixed` and placed by JS so the scroller can't clip them (layers 17 and 22).
