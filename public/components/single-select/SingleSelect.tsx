/**
 * SingleSelect: dropdown that picks one option
 * ============================================
 *
 * New Review Cycle › Review type, Repeats, "Who is going to be reviewed?", the peer-count mode,
 * the reviewer table's "counted from" field and the Questionnaire picker (with search).
 *
 *   ┌──────────────────────────────────────┐
 *   │ Worker                          ×  ⌄ │   ← field: 44px, 1px #D0D5DD, 8px radius
 *   └──────────────────────────────────────┘
 *     6px gap (4px when the list opens above)
 *   ┌──────────────────────────────────────┐
 *   │ ┌──────────────────────────────────┐ │   ← menu: 1px #EAECF0, 12px radius, 4px padding
 *   │ │ Foreman                          │ │   ← option: 8px 12px padding
 *   │ │▒Worker                         ✓▒│ │   ← selected: #F2F4F7 fill + 20px #2970FF check
 *   │ │ Project Manager                  │ │
 *   │ └──────────────────────────────────┘ │
 *   └──────────────────────────────────────┘
 *
 * Search bar and secondary text are both optional, in any combination (see VARIANTS).
 *
 * This file is the spec and a typed React reference. The prototype itself is plain JS:
 * `fcSel()` in public/js/layers/30-single-select.js renders the same markup and class names,
 * styled by src/styles/25-single-select.css + 28-dropdown-menu.css (overlay scrollbar: public/js/layers/32-dropdown-scroll.js) (plus .input / .input--select / .dropdown__menu / .dropdown__option).
 * If you change a value here, change it in the CSS too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VARIANTS (search and secondary text are independent, so there are four)
 * ─────────────────────────────────────────────────────────────────────────────
 *                         No secondary text             With secondary text (`description`)
 *   ────────────────────  ────────────────────────────  ─────────────────────────────────────
 *   No search             options in the 4px menu,      options in the 4px menu,
 *                         40px rows, max 7 → 300px      56px rows, max 7 → 412px
 *   Search                search block (8px 8px 4px)    search block (8px 8px 4px)
 *   (`searchPlaceholder`) + 4px list, 40px rows         + 4px list, 56px rows
 *   A list uses 56px rows as soon as any option has a description; an option without one keeps a single line.
 *   Search matches the primary and the secondary text.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MENU SPECS (container, search, list, option text, scrollbar)
 * ─────────────────────────────────────────────────────────────────────────────
 *   Part            Value
 *   ──────────────  ─────────────────────────────────────────────────────────────
 *   Container       4px padding (0 when it holds a search block + list; the list then has the 4px)
 *   Search block    8px top · 8px sides · 4px bottom, sits above the list, doesn't scroll
 *   Search clear    16px x-close in text-tertiary #667085, 8px after the text, shown once there is text; empties the search
 *   Option          min 40px · 8px 12px padding · 8px radius
 *   Primary text    Inter 14/20 medium · #101828 (text-primary)
 *   Secondary text  Inter 12/18 medium · #667085 (text-tertiary) · 2px under the primary line
 *   Link in it      Inter 12/18 semibold · #2970FF, e.g. "Preview" (opens the item without picking it)
 *   Option gap      2px
 *   Height          7 options, then vertical scroll.
 *                   max-height = 7 × row + 6 × 2px + 8px → 300px for one-line rows (40px),
 *                   412px for two-line rows (56px = 8 + 20 + 2 + 18 + 8)
 *   Scrollbar       native bar hidden. Thumb: 6px wide, 3px radius, 2px from the right border, 4px from top/bottom,
 *                   min 24px tall, #D0D5DD (#98A2B3 on hover / drag), z-index above the options, so it overlaps
 *                   their right edge. Shown only while the pointer is over the menu (or while dragging).
 *   Empty search    "No matches": 14px #667085, centered, 16px 12px padding
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MENU BEHAVIOUR
 * ─────────────────────────────────────────────────────────────────────────────
 *   - Search filters on primary + secondary text, case-insensitive, as you type.
 *   - ↓ in the search moves to the first visible option; ↑ on the first option goes back to the search.
 *   - The list scrolls with wheel / trackpad / keyboard focus; the thumb can be dragged.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .dropdown                            wrapper, position: relative
 *   ├ button.select__trigger             the field (aria-haspopup="listbox")
 *   │ └ span.select__value               value or placeholder, one line, ellipsed
 *   ├ button.clearable__button           optional clear (×), only when a value is chosen
 *   └ div.dropdown__menu.select__menu    the menu, only while open
 *     ├ div.dropdown__search             optional search block
 *     └ div.dropdown__list               role="listbox"
 *       └ button.select__option          role="option", one per option
 *         ├ span / span.dropdown__text   label, or label + secondary line
 *         └ img.select__check            check on the chosen option
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FIELD STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State        Border     Text      Notes
 *   ───────────  ─────────  ────────  ──────────────────────────────────────────
 *   Empty        #D0D5DD    #98A2B3   Placeholder ("Select an option")
 *   Filled       #D0D5DD    #101828   Inter 16/400
 *   Open         #2970FF    —
 *   Focus (kbd)  #2970FF    —         + 4px ring rgba(41,112,255,.16)
 *   Error        #DC2626    —         Message under the field, not part of this component
 *   Clearable    —          —         16px solid x-circle at right 40px, shown on hover / focus-within.
 *                                     Icon #98A2B3, #667085 on hover (no background). Tooltip "Remove" after 300ms.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * OPTION STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State        Background  Notes
 *   ───────────  ──────────  ─────────────────────────────────────────────────
 *   Default      none        40px min height (56px with a secondary line), 8px 12px padding, 8px radius
 *                            Primary Inter 14/20 medium #101828 · secondary 12/18 #667085, 2px gap
 *   Hover        #F9FAFB
 *   Selected     #F2F4F7     Same on hover and focus. 20px #2970FF check, 12px left margin
 *   Focus (kbd)  #F9FAFB     + inset 2px ring rgba(41,112,255,.4)
 *   Disabled     none        Text #98A2B3, not-allowed cursor, no hover
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEMENT & SIZE
 * ─────────────────────────────────────────────────────────────────────────────
 *   "bottom" (default): menu 6px below the field.
 *   "top": menu 4px above the field. Use when there's no room below, e.g.
 *          "Who is going to be reviewed?" before a role is picked (last field on the page).
 *   Width: at least the field's, grows to its content, max min(400px, 100vw − 32px).
 *          With search: at least 280px.
 *   Height: 7 options, then the list scrolls (overlay scrollbar on hover, see MENU SPECS).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - Click the field to open. Without search, focus moves to the chosen option (or the first);
 *     with search, focus goes to the search input and the query starts empty.
 *   - ↑ / ↓ / Home / End move between visible options; Enter / Space picks.
 *     ↓ in the search moves to the first match; ↑ on the first option returns to the search.
 *   - Picking closes the menu and returns focus to the field.
 *   - Escape closes and returns focus to the field; Tab or an outside click closes.
 *   - The field is labelled by the question (`labelledBy`) plus its own value.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE (prototype, plain JS)
 * ─────────────────────────────────────────────────────────────────────────────
 *   fcSel({ id: "rxWho", value: x.reviewee || "", ph: "Select a role", pick: "fcWhoPick",
 *           options: [{ v: "Worker", t: "Worker" }, { v: "Foreman", t: "Foreman" }],
 *           cls: x.reviewee ? "" : "select--up" });   // select--up = placement "top"
 *   fcSel({ ..., search: "Search questionnaires",            // adds the search block
 *           options: [{ v: "t1", t: "Detailed Review", s: "Office · 12 questions" }] });  // s = secondary line
 */

import * as React from "react";

/* ═════════════ MENU: the popup (container, search, scroll list, overlay scrollbar, option text) ═════════════
   The same block lives in SingleSelect.tsx and MultiSelect.tsx; keep both in sync with 28-dropdown-menu.css. */

/* ───────────── Menu tokens ───────────── */

const MENU_TOKENS = {
  font: "Inter, -apple-system, 'Segoe UI', Roboto, sans-serif",
  container: {
    radius: 12, padding: 4, border: "#EAECF0", background: "#FFFFFF", zIndex: 45,
    shadow: "0 12px 16px -4px rgba(16,24,40,.08), 0 4px 6px -2px rgba(16,24,40,.03)",
  },
  search: {
    paddingTop: 8, paddingX: 8, paddingBottom: 4,
    height: 36, radius: 8, paddingLeft: 34, paddingRight: 12, iconLeft: 11, iconSize: 16, fontSize: 14,
    border: "#D0D5DD", focusBorder: "#2970FF", placeholder: "#98A2B3", icon: "#667085",
    clear: { size: 16, hit: 20, right: 10, gap: 8, color: "#667085" },   // × once there is text, text-tertiary
  },
  list: { padding: 4, gap: 2, maxVisible: 7 },
  option: {
    minHeight: 40, twoLineHeight: 56, paddingY: 8, paddingX: 12, radius: 8, lineGap: 2,
    primary: { fontSize: 14, lineHeight: 20, fontWeight: 500, color: "#101828" },
    secondary: { fontSize: 12, lineHeight: 18, fontWeight: 500, color: "#667085" },
    link: { fontSize: 12, lineHeight: 18, fontWeight: 600, color: "#2970FF" },   // e.g. "Preview" in the secondary line
    hover: "#F9FAFB", selected: "#F2F4F7", disabledText: "#98A2B3", focusRing: "rgba(41,112,255,.4)",
  },
  scrollbar: { width: 6, radius: 3, right: 2, inset: 4, minThumb: 24, color: "#D0D5DD", active: "#98A2B3" },
  empty: { padding: "16px 12px", fontSize: 14, color: "#667085" },
} as const;

const M = MENU_TOKENS;

/** max-height of a list that shows `rows` options before scrolling */
const menuListMaxHeight = (rowHeight: number = M.option.minHeight, rows: number = M.list.maxVisible) =>
  rows * rowHeight + (rows - 1) * M.list.gap + M.list.padding * 2;

/* ───────────── Container ───────────── */

export interface MenuContainerProps {
  placement?: "bottom" | "top";
  /** px between field and menu: 6 below, 4 above */
  offset?: number;
  /** true when the container holds a search block / scroll list (they carry their own padding) */
  sectioned?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onKeyDown?: React.KeyboardEventHandler;
}

function MenuContainer({ placement = "bottom", offset, sectioned, style, children, onKeyDown }: MenuContainerProps) {
  const gap = offset ?? (placement === "top" ? 4 : 6);
  return (
    <div
      onKeyDown={onKeyDown}
      style={{
        position: "absolute", left: 0, zIndex: M.container.zIndex, boxSizing: "border-box",
        ...(placement === "top" ? { bottom: `calc(100% + ${gap}px)` } : { top: `calc(100% + ${gap}px)` }),
        display: "flex", flexDirection: "column", padding: sectioned ? 0 : M.container.padding,
        background: M.container.background, border: `1px solid ${M.container.border}`,
        borderRadius: M.container.radius, boxShadow: M.container.shadow, fontFamily: M.font,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ───────────── Search block ───────────── */

export interface MenuSearchProps {
  value: string;
  onChange: (q: string) => void;
  placeholder?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

function MenuSearch({ value, onChange, placeholder = "Search", inputRef, onKeyDown }: MenuSearchProps) {
  const [focus, setFocus] = React.useState(false);
  const S = M.search;
  return (
    <div style={{ flex: "none", padding: `${S.paddingTop}px ${S.paddingX}px ${S.paddingBottom}px` }}>
      <div style={{ position: "relative" }}>
        <svg width={S.iconSize} height={S.iconSize} viewBox="0 0 20 20" fill="none" aria-hidden="true"
          style={{ position: "absolute", left: S.iconLeft, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <path d="m17.5 17.5-3.6-3.6m2.1-5a7.1 7.1 0 1 1-14.2 0 7.1 7.1 0 0 1 14.2 0Z" stroke={S.icon} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={value}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          data-dd-search=""
          style={{
            width: "100%", height: S.height, boxSizing: "border-box", margin: 0,
            padding: `0 ${value ? S.clear.right + S.clear.hit + S.clear.gap : S.paddingRight}px 0 ${S.paddingLeft}px`,
            border: `1px solid ${focus ? S.focusBorder : S.border}`, borderRadius: S.radius, outline: "none",
            fontFamily: M.font, fontSize: S.fontSize, color: M.option.primary.color, background: "#fff",
          }}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            title="Clear"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChange("")}
            style={{
              position: "absolute", right: S.clear.right, top: "50%", transform: "translateY(-50%)",
              width: S.clear.hit, height: S.clear.hit, padding: 0, border: 0, background: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width={S.clear.size} height={S.clear.size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M15 5L10 10M10 10L5 15M10 10L5 5M10 10L15 15" stroke={S.clear.color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/* ───────────── Scroll list with overlay scrollbar ───────────── */

const HIDE_BAR_CSS = "[data-dd-list]{scrollbar-width:none}[data-dd-list]::-webkit-scrollbar{display:none}" +
  "[data-dd-search]::-webkit-search-cancel-button{-webkit-appearance:none;appearance:none;display:none}";
function useHideNativeBar() {
  React.useEffect(() => {
    if (document.getElementById("dd-list-css")) return;
    const s = document.createElement("style");
    s.id = "dd-list-css";
    s.textContent = HIDE_BAR_CSS;
    document.head.appendChild(s);
  }, []);
}

export interface MenuListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  /** one option's height: 40 (one line) or 56 (with a secondary line) */
  rowHeight?: number;
  maxVisible?: number;
  listRef?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}

/**
 * The list: 4px padding, 2px gap, `maxVisible` rows tall, then scrolls.
 * The native scrollbar is hidden; a thumb is drawn over the rows' right edge while the pointer is over the list.
 */
function MenuList({ rowHeight = M.option.minHeight, maxVisible = M.list.maxVisible, listRef, children, ...rest }: MenuListProps) {
  useHideNativeBar();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = React.useState(false);
  const [drag, setDrag] = React.useState(false);
  const [thumb, setThumb] = React.useState<{ top: number; height: number } | null>(null);
  const SB = M.scrollbar;

  const measure = React.useCallback(() => {
    const l = ref.current;
    if (!l) return;
    const { scrollHeight: sh, clientHeight: ch, scrollTop: st } = l;
    if (sh <= ch + 1) return setThumb(null);
    const track = ch - SB.inset * 2;
    const height = Math.max(SB.minThumb, (track * ch) / sh);
    setThumb({ height, top: SB.inset + ((track - height) * st) / (sh - ch) });
  }, [SB.inset, SB.minThumb]);

  React.useLayoutEffect(measure);
  React.useEffect(() => {
    const l = ref.current;
    if (!l || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(l);
    return () => ro.disconnect();
  }, [measure]);

  const onThumbDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const l = ref.current;
    if (!l || !thumb) return;
    e.preventDefault();
    const y0 = e.clientY, s0 = l.scrollTop;
    const k = (l.scrollHeight - l.clientHeight) / Math.max(1, l.clientHeight - SB.inset * 2 - thumb.height);
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    setDrag(true);
    const move = (ev: PointerEvent) => { l.scrollTop = s0 + (ev.clientY - y0) * k; };
    const up = () => {
      setDrag(false);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };

  const show = !!thumb && (hover || drag);
  return (
    <div style={{ position: "relative", minHeight: 0 }} onMouseEnter={() => { setHover(true); measure(); }} onMouseLeave={() => setHover(false)}>
      <div
        {...rest}
        data-dd-list=""
        ref={(el) => {
          ref.current = el;
          if (typeof listRef === "function") listRef(el);
          else if (listRef) (listRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        onScroll={measure}
        style={{
          display: "flex", flexDirection: "column", gap: M.list.gap, padding: M.list.padding,
          maxHeight: menuListMaxHeight(rowHeight, maxVisible), overflowY: "auto", overscrollBehavior: "contain", boxSizing: "border-box",
        }}
      >
        {children}
      </div>
      {thumb && (
        <div
          aria-hidden="true"
          onPointerDown={onThumbDown}
          style={{
            position: "absolute", zIndex: 3, right: SB.right, top: thumb.top, height: thumb.height, width: SB.width,
            borderRadius: SB.radius, background: drag ? SB.active : SB.color, touchAction: "none",
            opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none", transition: "opacity .15s, background-color .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = SB.active)}
          onMouseLeave={(e) => { if (!drag) e.currentTarget.style.background = SB.color; }}
        />
      )}
    </div>
  );
}

/* ───────────── Option text (one or two lines) ───────────── */

function OptionText({ label, description, disabled }: { label: string; description?: string; disabled?: boolean }) {
  const P = M.option.primary, S = M.option.secondary;
  const line: React.CSSProperties = { display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
  return (
    <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: M.option.lineGap, textAlign: "left" }}>
      <span style={{ ...line, fontSize: P.fontSize, lineHeight: `${P.lineHeight}px`, fontWeight: P.fontWeight, color: disabled ? M.option.disabledText : P.color }}>
        {label}
      </span>
      {description && (
        <span style={{ ...line, fontSize: S.fontSize, lineHeight: `${S.lineHeight}px`, fontWeight: S.fontWeight, color: disabled ? M.option.disabledText : S.color }}>
          {description}
        </span>
      )}
    </span>
  );
}

/* ───────────── Empty search result ───────────── */

function MenuEmpty({ children = "No matches" }: { children?: React.ReactNode }) {
  return <div style={{ padding: M.empty.padding, textAlign: "center", fontSize: M.empty.fontSize, color: M.empty.color }}>{children}</div>;
}

/* ───────────── Helpers ───────────── */

/** case-insensitive match on label + description */
const matchesQuery = (q: string, label: string, description?: string) =>
  !q.trim() || `${label} ${description ?? ""}`.toLowerCase().includes(q.trim().toLowerCase());

/** row height for a list: 56 when any option has a secondary line */
const rowHeightFor = (opts: { description?: string }[]) =>
  opts.some((o) => o.description) ? M.option.twoLineHeight : M.option.minHeight;

/* ═════════════ end of MENU ═════════════ */

/* ───────────── Tokens (keep in sync with 25-single-select.css / 15-focused-editor.css / 28-dropdown-menu.css) ───────────── */

export const SINGLE_SELECT_TOKENS = {
  font: MENU_TOKENS.font,
  field: { height: 44, radius: 8, paddingLeft: 14, paddingRight: 44, clearPaddingRight: 72, fontSize: 16, fontWeight: 400 },
  menu: { offsetBelow: 6, offsetAbove: 4, maxWidth: 400, searchMinWidth: 280 },
  option: { ...MENU_TOKENS.option, checkGap: 12 },
  color: {
    border: "#D0D5DD",
    text: "#101828",
    placeholder: "#98A2B3",
    icon: "#667085",
    blue: "#2970FF",
    error: "#DC2626",
    focusRing: "rgba(41,112,255,.16)",
  },
} as const;

const T = SINGLE_SELECT_TOKENS;

/* ───────────── Types ───────────── */

export interface SingleSelectOption<V extends string = string> {
  value: V;
  label: string;
  /** secondary line under the label (12px tertiary, 2px gap) */
  description?: string;
  disabled?: boolean;
  /** tooltip, e.g. why a disabled option can't be picked */
  title?: string;
}

export interface SingleSelectProps<V extends string = string> {
  options: SingleSelectOption<V>[];
  /** "" (or undefined) = nothing chosen */
  value: V | "" | undefined;
  onChange: (value: V | "") => void;
  placeholder?: string;
  /** shows the search block above the list; the text is its placeholder and aria-label */
  searchPlaceholder?: string;
  /** shown when the search matches nothing */
  emptyText?: string;
  /** id of the visible question; the field reads as "<question> <value>" */
  labelledBy?: string;
  /** visually hidden label, for fields without a question on screen */
  label?: string;
  /** show an × that resets to "" once something is chosen; the text is its aria-label */
  clearLabel?: string;
  /** "top" opens the menu 4px above the field */
  placement?: "bottom" | "top";
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/* ───────────── Icons (same paths as /assets/chevron-down.svg, check-blue-20.svg, x-circle-16.svg) ───────────── */

const Chevron = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 7.5L10 12.5L15 7.5" stroke={T.color.icon} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Check = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flex: "none", marginLeft: T.option.checkGap }}>
    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke={T.color.blue} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
/* clear: solid x-circle, 16px, #98A2B3 (Figma Exploration – Lumber Web App 800:34496) */
const Close = ({ color = "#98A2B3" }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path transform="translate(0.6667 0.6667)" fillRule="evenodd" clipRule="evenodd" fill={color} d="M7.33333 0C3.28325 0 0 3.28325 0 7.33333C0 11.3834 3.28325 14.6667 7.33333 14.6667C11.3834 14.6667 14.6667 11.3834 14.6667 7.33333C14.6667 3.28325 11.3834 0 7.33333 0ZM9.80474 4.86193C10.0651 5.12228 10.0651 5.54439 9.80474 5.80474L8.27614 7.33333L9.80474 8.86193C10.0651 9.12228 10.0651 9.54439 9.80474 9.80474C9.54439 10.0651 9.12228 10.0651 8.86193 9.80474L7.33333 8.27614L5.80474 9.80474C5.54439 10.0651 5.12228 10.0651 4.86193 9.80474C4.60158 9.54439 4.60158 9.12228 4.86193 8.86193L6.39052 7.33333L4.86193 5.80474C4.60158 5.54439 4.60158 5.12228 4.86193 4.86193C5.12228 4.60158 5.54439 4.60158 5.80474 4.86193L7.33333 6.39052L8.86193 4.86193C9.12228 4.60158 9.54439 4.60158 9.80474 4.86193Z" />
  </svg>
);

const srOnly: React.CSSProperties = {
  position: "absolute", width: 1, height: 1, margin: -1, padding: 0, border: 0,
  overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap",
};

/* ───────────── Component ───────────── */

export function SingleSelect<V extends string = string>({
  options, value, onChange, placeholder = "Select an option", searchPlaceholder, emptyText = "No matches",
  labelledBy, label, clearLabel, placement = "bottom", invalid, disabled, id, style,
}: SingleSelectProps<V>) {
  const autoId = React.useId();
  const baseId = id ?? `ss${autoId.replace(/:/g, "")}`;
  const qId = labelledBy ?? `${baseId}Q`;
  const vId = `${baseId}V`;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [hover, setHover] = React.useState<number | null>(null);
  const [focusIx, setFocusIx] = React.useState<number | null>(null);
  const [fieldFocus, setFieldFocus] = React.useState(false);
  const [wrapHover, setWrapHover] = React.useState(false);
  const [clrHover, setClrHover] = React.useState(false);
  const [clrTip, setClrTip] = React.useState(false);
  const clrTimer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(clrTimer.current), []);

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLButtonElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const optRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const searchable = !!searchPlaceholder;
  const current = options.find((o) => o.value === value);
  const visible = options.map((o, i) => (matchesQuery(query, o.label, o.description) ? i : -1)).filter((i) => i >= 0);
  const enabled = visible.filter((i) => !options[i].disabled);

  /* open: search first, else the chosen option (or the first) */
  React.useEffect(() => {
    if (!open) return;
    if (searchable) return searchRef.current?.focus({ preventScroll: true });
    const i = options.findIndex((o) => o.value === value && !o.disabled);
    const el = optRefs.current[i >= 0 ? i : enabled[0]];
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* outside click closes */
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const toggle = () => { setQuery(""); setOpen((o) => !o); };
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) fieldRef.current?.focus({ preventScroll: true });
  };
  const pick = (v: V | "") => {
    onChange(v);
    close(true);
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); close(true); }
    else if (e.key === "Tab") setOpen(false);
  };
  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && enabled.length) { e.preventDefault(); optRefs.current[enabled[0]]?.focus(); }
  };
  const onOptionKey = (e: React.KeyboardEvent, i: number) => {
    const pos = enabled.indexOf(i);
    if (e.key === "ArrowUp" && pos === 0 && searchable) { e.preventDefault(); searchRef.current?.focus(); return; }
    const next =
      e.key === "ArrowDown" ? enabled[Math.min(pos + 1, enabled.length - 1)]
      : e.key === "ArrowUp" ? enabled[Math.max(pos - 1, 0)]
      : e.key === "Home" ? enabled[0]
      : e.key === "End" ? enabled[enabled.length - 1]
      : undefined;
    if (next !== undefined) { e.preventDefault(); optRefs.current[next]?.focus(); }
  };

  const showClear = !!clearLabel && !!current && !disabled;

  const fieldStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", width: "100%", minWidth: 0, margin: 0, boxSizing: "border-box",
    height: T.field.height,
    padding: `0 ${showClear ? T.field.clearPaddingRight : T.field.paddingRight}px 0 ${T.field.paddingLeft}px`,
    border: `1px solid ${invalid ? T.color.error : open || fieldFocus ? T.color.blue : T.color.border}`,
    borderRadius: T.field.radius, background: "#fff",
    boxShadow: fieldFocus && !open ? `0 0 0 4px ${T.color.focusRing}` : undefined,
    outline: "none", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
    fontFamily: T.font, fontSize: T.field.fontSize, fontWeight: T.field.fontWeight, textAlign: "left",
    color: current ? T.color.text : T.color.placeholder,
  };

  const optionStyle = (i: number, on: boolean, dis?: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", margin: 0, boxSizing: "border-box",
    flexShrink: 0, minHeight: T.option.minHeight, padding: `${T.option.paddingY}px ${T.option.paddingX}px`,
    border: 0, borderRadius: T.option.radius, textAlign: "left", outline: "none", fontFamily: T.font,
    cursor: dis ? "not-allowed" : "pointer",
    background: on ? T.option.selected : !dis && (hover === i || focusIx === i) ? T.option.hover : "transparent",
    boxShadow: focusIx === i ? `inset 0 0 0 2px ${T.option.focusRing}` : undefined,
  });

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative", ...style }}
      onMouseEnter={() => setWrapHover(true)}
      onMouseLeave={() => setWrapHover(false)}
    >
      {label && !labelledBy && <span id={qId} style={srOnly}>{label}</span>}

      <button
        ref={fieldRef}
        type="button"
        id={baseId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${qId} ${vId}`}
        aria-invalid={invalid || undefined}
        onClick={toggle}
        onFocus={(e) => setFieldFocus(e.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFieldFocus(false)}
        style={fieldStyle}
      >
        <span id={vId} style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {current ? current.label : placeholder}
        </span>
        <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
          <Chevron />
        </span>
      </button>

      {showClear && (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => { window.clearTimeout(clrTimer.current); setClrTip(false); pick(""); }}
          style={{
            position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)",
            width: 24, height: 24, padding: 0, border: 0, borderRadius: 6, cursor: "pointer",
            display: wrapHover || fieldFocus ? "flex" : "none", alignItems: "center", justifyContent: "center",
            background: "none",
          }}
          onMouseEnter={() => { setClrHover(true); clrTimer.current = window.setTimeout(() => setClrTip(true), 300); }}
          onMouseLeave={() => { setClrHover(false); window.clearTimeout(clrTimer.current); setClrTip(false); }}
        >
          <Close color={clrHover ? "#667085" : "#98A2B3"} />
          {clrTip && (
            /* tooltip: dark bubble 4px above the icon (the prototype uses the shared data-tip tooltip) */
            <span role="tooltip" style={{
              position: "absolute", bottom: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)",
              padding: "8px 12px", borderRadius: 8, background: "#101828", color: "#fff", letterSpacing: ".12px",
              fontFamily: T.font, fontSize: 12, fontWeight: 500, lineHeight: 1.5, whiteSpace: "nowrap", pointerEvents: "none",
            }}>Remove</span>
          )}
        </button>
      )}

      {open && (
        <MenuContainer
          placement={placement}
          sectioned
          onKeyDown={onMenuKey}
          style={{
            minWidth: searchable ? `max(100%, ${T.menu.searchMinWidth}px)` : "100%",
            width: "max-content", maxWidth: `min(${T.menu.maxWidth}px, calc(100vw - 32px))`,
          }}
        >
          {searchable && (
            <MenuSearch value={query} onChange={setQuery} placeholder={searchPlaceholder} inputRef={searchRef} onKeyDown={onSearchKey} />
          )}
          <MenuList role="listbox" aria-labelledby={qId} rowHeight={rowHeightFor(options)}>
            {visible.map((i) => {
              const o = options[i];
              const on = o.value === value;
              return (
                <button
                  key={o.value}
                  ref={(el) => { optRefs.current[i] = el; }}
                  type="button"
                  role="option"
                  aria-selected={on}
                  disabled={o.disabled}
                  title={o.title}
                  onClick={() => pick(o.value)}
                  onKeyDown={(e) => onOptionKey(e, i)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={(e) => setFocusIx(e.currentTarget.matches(":focus-visible") ? i : null)}
                  onBlur={() => setFocusIx(null)}
                  style={optionStyle(i, on, o.disabled)}
                >
                  <OptionText label={o.label} description={o.description} disabled={o.disabled} />
                  {on && <Check />}
                </button>
              );
            })}
            {visible.length === 0 && <MenuEmpty>{emptyText}</MenuEmpty>}
          </MenuList>
        </MenuContainer>
      )}
    </div>
  );
}

/* ───────────── State gallery (one example per documented state) ───────────── */

const ROLES: SingleSelectOption[] = [
  { value: "Project Manager", label: "Project Manager" },
  { value: "Foreman", label: "Foreman" },
  { value: "Worker", label: "Worker" },
];
const REPEATS: SingleSelectOption[] = ["Every month", "Every 3 months", "Every 6 months", "Every year"].map((v) => ({ value: v, label: v }));
const QUESTIONNAIRES: SingleSelectOption[] = [
  ["Detailed Review (office, 90 days)", "Office · 14 questions"],
  ["Quick Check-in", "Field · 5 questions"],
  ["Foreman Evaluation", "Field · 10 questions"],
  ["Safety Practices", "Field · 8 questions"],
  ["Project Completion", "Project · 9 questions"],
  ["New Hire 30-day", "Onboarding · 6 questions"],
  ["New Hire 90-day", "Onboarding · 11 questions"],
  ["Annual Performance", "Office · 18 questions"],
  ["Peer Feedback", "Peer · 7 questions"],
].map(([label, description], i) => ({ value: `t${i + 1}`, label, description }));

const TITLES: SingleSelectOption[] = ["Carpenter", "Electrician", "Estimator", "Foreman", "Laborer", "Operator", "Plumber", "Project Manager", "Safety Lead", "Superintendent"].map((v) => ({ value: v, label: v }));

/** Every state side by side, for review and visual QA. */
export function SingleSelectStates() {
  const [type, setType] = React.useState("General Review");
  const [repeat, setRepeat] = React.useState("Every 3 months");
  const [who, setWho] = React.useState("");
  const [bad, setBad] = React.useState("");
  const [tpl, setTpl] = React.useState("t1");
  const [scale, setScale] = React.useState("stars");
  const [title, setTitle] = React.useState("");
  const row: React.CSSProperties = { display: "grid", gap: 8, width: 360 };
  const q: React.CSSProperties = { fontSize: 14, fontWeight: 500, color: "#344054" };
  return (
    <div style={{ display: "grid", gap: 32, fontFamily: T.font, paddingTop: 200, paddingBottom: 440 }}>
      <section style={row}>
        <span id="ssTypeQ" style={q}>1 · Filled (Review type)</span>
        <SingleSelect
          labelledBy="ssTypeQ"
          value={type}
          onChange={(v) => v && setType(v)}
          options={["General Review", "New Hire Review", "Project Completion Review"].map((v) => ({ value: v, label: v }))}
        />
      </section>

      <section style={row}>
        <span id="ssRepQ" style={q}>2 · Clearable (Repeats)</span>
        <SingleSelect labelledBy="ssRepQ" value={repeat} onChange={setRepeat} options={REPEATS} clearLabel="Clear repeats" />
      </section>

      <section style={row}>
        <span id="ssWhoQ" style={q}>3 · Empty, opens above (Who is going to be reviewed?)</span>
        <SingleSelect labelledBy="ssWhoQ" value={who} onChange={setWho} options={ROLES} placeholder="Select a role" placement={who ? "bottom" : "top"} />
      </section>

      <section style={row}>
        <span id="ssBadQ" style={q}>4 · Error</span>
        <SingleSelect labelledBy="ssBadQ" value={bad} onChange={setBad} options={ROLES} placeholder="Select a role" invalid={!bad} />
      </section>

      <section style={row}>
        <span id="ssDisQ" style={q}>5 · Disabled</span>
        <SingleSelect labelledBy="ssDisQ" value="Worker" onChange={() => {}} options={ROLES} disabled />
      </section>

      <section style={row}>
        <span id="ssTplQ" style={q}>6 · With search, two-line options, scrolls after 7 (Questionnaire)</span>
        <SingleSelect
          labelledBy="ssTplQ"
          value={tpl}
          onChange={(v) => v && setTpl(v)}
          options={QUESTIONNAIRES}
          searchPlaceholder="Search questionnaires"
          emptyText="No questionnaires match your search"
        />
      </section>

      <section style={row}>
        <span id="ssScaleQ" style={q}>7 · No search, two-line options (Rating format)</span>
        <SingleSelect
          labelledBy="ssScaleQ"
          value={scale}
          onChange={(v) => v && setScale(v)}
          options={[
            { value: "stars", label: "Stars (1–5)", description: "Reviewers pick 1 to 5 stars" },
            { value: "numbers", label: "Numbers (1–5)", description: "Reviewers pick a number from 1 to 5" },
            { value: "none", label: "No rating", description: "Written answers only" },
          ]}
        />
      </section>

      <section style={row}>
        <span id="ssRoleQ" style={q}>8 · With search, one-line options (Job title)</span>
        <SingleSelect labelledBy="ssRoleQ" value={title} onChange={setTitle} options={TITLES} searchPlaceholder="Search job titles" placeholder="Select a job title" />
      </section>
    </div>
  );
}

export default SingleSelect;
