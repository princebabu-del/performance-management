/**
 * ActionMenu: the list of actions behind a kebab (⋮), "More" or split button
 * ==========================================================================
 *
 * Row and card actions such as Move Up / Move Down / Duplicate / Delete, Edit / Archive, Close cycle.
 * It uses the same container and option metrics as the select dropdown (MENU block in
 * ../single-select/SingleSelect.tsx), so action menus and select menus look alike.
 *
 *                                          ⋮   ← trigger (icon button, data-tip="More Options")
 *   ┌──────────────────────────────────────┐
 *   │ ┌──────────────────────────────────┐ │   ← container: 4px padding
 *   │ │ ↓  Move Down                     │ │   ← item: 8px 12px padding, 8px radius
 *   │ │ ⧉  Duplicate                     │ │
 *   │ │ 🗑  Delete                        │ │   ← danger item: red text + icon
 *   │ └──────────────────────────────────┘ │
 *   └──────────────────────────────────────┘
 *
 * This file is the spec and a typed React reference. It is never loaded by the prototype: the prototype
 * is plain JS and builds the same markup by hand, styled by ./action-menu.css.
 * If you change a value here, change it in ./action-menu.css in the same edit (and the reverse).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VARIATIONS
 * ─────────────────────────────────────────────────────────────────────────────
 *   Item        Icon + label (default), or label only. Never icon only, never a secondary line.
 *   Tone        Default, or danger (Delete, Cancel cycle, Remove …).
 *   Dividers    None. Danger items simply come last.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SPECS
 * ─────────────────────────────────────────────────────────────────────────────
 *   Part            Value
 *   ──────────────  ─────────────────────────────────────────────────────────────
 *   Container       #FFF · 1px #EAECF0 · 8px radius · 4px padding
 *                   shadow 0 12px 16px -4px rgba(16,24,40,.08), 0 4px 6px -2px rgba(16,24,40,.03)
 *                   min-width 200px, otherwise as wide as the longest label (labels never wrap)
 *   Item            hugs content (36px) · 8px 12px padding · 8px radius · no gap between items
 *   Label           Inter 14/20 medium · #101828 (text-primary)
 *   Icon            20 × 20 · #344054 · 1.5px stroke · 8px before the label
 *   Danger          label + icon #D92D20
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ITEM STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State          Background   Notes
 *   ─────────────  ───────────  ─────────────────────────────────────────────
 *   Default        none
 *   Hover          #F9FAFB
 *   Focus (kbd)    #F9FAFB      + 2px inset ring rgba(41,112,255,.4)
 *   Danger hover   #FEF3F2      text + icon stay #D92D20
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEMENT
 * ─────────────────────────────────────────────────────────────────────────────
 *   Default: under the trigger, right edges aligned (top 34px, right 0). The context sets the rest:
 *   - inside a table scroller (.tw) or the cycle-detail table the open menu is position:fixed and placed
 *     under its button by JS, flipping above it near the bottom of the window (layers 17 and 22);
 *   - question cards (.question-menu) open 40px down; the bulk bar (.cd-bulk-menu) opens under "More".
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - The trigger has aria-haspopup="menu" and aria-expanded; the menu is role="menu", items role="menuitem".
 *   - One menu is open at a time (S.menu holds its id; toggleMenu(id, event) opens / closes it).
 *   - Picking an item closes the menu and runs the action. An outside click or Escape closes it;
 *     Escape returns focus to the trigger.
 *   - Hide an item that doesn't apply (e.g. no Move Up on the first question) rather than disabling it.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .kebab                                       wrapper, position: relative
 *   ├ button                                     the trigger
 *   └ div.action-menu                            role="menu", only while open
 *     └ button.action-menu__item                 role="menuitem"; + .action-menu__item--danger
 *       ├ svg.action-menu__icon                  optional; or span.action-menu__icon.action-menu__icon--mask
 *       │                                        with style="--icon:url(/assets/icons/…svg)"
 *       └ label text
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE (prototype, plain JS)
 * ─────────────────────────────────────────────────────────────────────────────
 *   `<div class="action-menu" role="menu">
 *      <button type="button" role="menuitem" class="action-menu__item" onclick="S.menu=null;dup()">
 *        ${ic("copy","action-menu__icon")}Duplicate</button>
 *      <button type="button" role="menuitem" class="action-menu__item action-menu__item--danger" onclick="S.menu=null;del()">
 *        ${ic("trash","action-menu__icon")}Delete</button>
 *    </div>`
 *   ic("edit" | "copy" | "archive" | "trash", …) icons are swapped for the Untitled UI files by action-menu.css.
 *
 *   Used by: cycle and questionnaire row menus (app.js cycleMenu / template menu), cycle header ⋮,
 *   cycle-detail row menus (cdKebab) and bulk "More" (layer 17), New Review Cycle split button (layer 6),
 *   question cards (layer 33).
 */

import * as React from "react";

/* ═════════════ Tokens (keep in sync with action-menu.css) ═════════════ */
export const ACTION_MENU_TOKENS = {
  container: {
    background: "#FFFFFF",
    border: "1px solid #EAECF0",
    radius: 8,
    padding: 4,
    minWidth: 200,
    shadow: "0 12px 16px -4px rgba(16,24,40,.08), 0 4px 6px -2px rgba(16,24,40,.03)",
  },
  item: {
    height: 36,
    padding: "8px 12px",
    radius: 8,
    gap: 8,
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
    color: "#101828",
    hover: "#F9FAFB",
    focusRing: "inset 0 0 0 2px rgba(41,112,255,.4)",
  },
  icon: { size: 20, color: "#344054", strokeWidth: 1.5 },
  danger: { color: "#D92D20", hover: "#FEF3F2" },
} as const;

const T = ACTION_MENU_TOKENS;

/* ═════════════ Types ═════════════ */
export interface ActionMenuItem {
  /** Label, one line */
  label: string;
  /** Optional 20px icon (inline svg or <img>); leave out for a label-only item */
  icon?: React.ReactNode;
  /** Destructive action: red label + icon */
  danger?: boolean;
  /** Hidden items are not rendered (don't disable, hide) */
  hidden?: boolean;
  onSelect: () => void;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  /** Called after an item is picked, or on Escape / outside click */
  onClose: () => void;
  /** Accessible name, e.g. "Question actions" */
  label?: string;
  style?: React.CSSProperties;
}

/* ═════════════ Item ═════════════ */
function ActionMenuRow({ item, onClose }: { item: ActionMenuItem; onClose: () => void }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const color = item.danger ? T.danger.color : T.item.color;
  const bg = hover || focus ? (item.danger ? T.danger.hover : T.item.hover) : "transparent";
  return (
    <button
      type="button"
      role="menuitem"
      className={"action-menu__item" + (item.danger ? " action-menu__item--danger" : "")}
      onClick={() => { item.onSelect(); onClose(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={e => setFocus(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocus(false)}
      style={{
        display: "flex", alignItems: "center", gap: T.item.gap, width: "100%", minHeight: T.item.height,
        padding: T.item.padding, border: 0, borderRadius: T.item.radius, background: bg,
        boxShadow: focus ? T.item.focusRing : "none", outline: "none",
        fontFamily: T.item.fontFamily, fontSize: T.item.fontSize, lineHeight: T.item.lineHeight,
        fontWeight: T.item.fontWeight, color, textAlign: "left", whiteSpace: "nowrap", cursor: "pointer",
      }}
    >
      {item.icon && (
        <span className="action-menu__icon" aria-hidden="true"
          style={{ display: "grid", placeItems: "center", flex: "none", width: T.icon.size, height: T.icon.size,
            color: item.danger ? T.danger.color : T.icon.color }}>
          {item.icon}
        </span>
      )}
      {item.label}
    </button>
  );
}

/* ═════════════ Menu ═════════════ */
export function ActionMenu({ items, onClose, label, style }: ActionMenuProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const visible = items.filter(i => !i.hidden);

  React.useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>("[role=menuitem]")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
      const btns = [...(ref.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]") ?? [])];
      const i = btns.indexOf(document.activeElement as HTMLButtonElement);
      const n = e.key === "Home" ? 0 : e.key === "End" ? btns.length - 1
        : (i + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length;
      e.preventDefault();
      btns[n]?.focus();
    };
    const click = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("keydown", key);
    document.addEventListener("mousedown", click);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("mousedown", click); };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="action-menu"
      role="menu"
      aria-label={label}
      style={{
        position: "absolute", top: 34, right: 0, zIndex: 25,
        display: "flex", flexDirection: "column", gap: 0,
        minWidth: T.container.minWidth, width: "max-content", padding: T.container.padding,
        background: T.container.background, border: T.container.border, borderRadius: T.container.radius,
        boxShadow: T.container.shadow, ...style,
      }}
    >
      {visible.map(item => <ActionMenuRow key={item.label} item={item} onClose={onClose} />)}
    </div>
  );
}

/* ═════════════ Gallery: both item variations + danger ═════════════ */
const Icon = ({ d }: { d: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={T.icon.strokeWidth}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

export function ActionMenuStates() {
  const noop = () => {};
  const box: React.CSSProperties = { position: "relative", width: 240, height: 180 };
  return (
    <div style={{ display: "flex", gap: 32, padding: 24, fontFamily: T.item.fontFamily }}>
      <div style={box}>
        <ActionMenu label="Icon + label" onClose={noop} style={{ top: 0, left: 0, right: "auto" }} items={[
          { label: "Move Up", icon: <Icon d="M10 15.8V4.2M4.2 10L10 4.2l5.8 5.8" />, onSelect: noop },
          { label: "Move Down", icon: <Icon d="M10 4.2v11.6M15.8 10L10 15.8 4.2 10" />, onSelect: noop },
          { label: "Duplicate", icon: <img src="/assets/icons/copy-03.svg" width={20} height={20} alt="" />, onSelect: noop },
          { label: "Delete", icon: <img src="/assets/icons/trash-01.svg" width={20} height={20} alt="" />, danger: true, onSelect: noop },
        ]} />
      </div>
      <div style={box}>
        <ActionMenu label="Label only" onClose={noop} style={{ top: 0, left: 0, right: "auto" }} items={[
          { label: "Edit", onSelect: noop },
          { label: "Archive", onSelect: noop },
          { label: "Delete", danger: true, onSelect: noop },
        ]} />
      </div>
    </div>
  );
}

export default ActionMenu;
