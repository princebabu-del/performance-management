/**
 * MultiSelect: dropdown that picks any number of options
 * ======================================================
 *
 * New Review Cycle › Reviewers, Projects, "Who can reopen it?", Auto-assign group values and
 * "Exclude employees" (with search).
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ [Foreman ×] [Worker ×] [+2]                ⌄ │   ← field: 46px, 1px #D0D5DD, 8px radius, chips on one line
 *   └──────────────────────────────────────────────┘
 *     6px gap
 *   ┌──────────────────────────────────────────────┐
 *   │  ┌────────────────────────────────────────┐  │   ← search block (optional): 8px 8px 4px
 *   │  │ 🔍 Search                              │  │
 *   │  └────────────────────────────────────────┘  │
 *   │ ┌──────────────────────────────────────────┐ │   ← list: 4px padding, 2px gap
 *   │ │ ☐ Select all                             │ │   ← optional, divider under it
 *   │ │──────────────────────────────────────────│ │
 *   │ │ ☑ Ana Lopez                              │ │   ← option: 8px 12px padding, checkbox + 8px gap
 *   │ │   Foreman                                │ │   ← secondary line, 12px #667085, 2px gap
 *   │ │ ☐ Worker                       Same role │ │   ← trailing meta, 12px medium #667085
 *   │ └──────────────────────────────────────────┘ │
 *   └──────────────────────────────────────────────┘
 *
 * Search bar and secondary text are both optional, in any combination (see VARIANTS).
 *
 * This file is the spec and a typed React reference. The prototype is plain JS:
 * rxRevsField / rxProjField / aaMulti / rxReopenField in public/js/layers/14-reviewee-reviewers.js render the same markup
 * and class names, styled by src/styles/16-reviewers-setup.css + 28-dropdown-menu.css (overlay scrollbar: public/js/layers/32-dropdown-scroll.js); rxFitChips() does the "+N" overflow.
 * If you change a value here, change it in the CSS too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VARIANTS (search and secondary text are independent, so there are four)
 * ─────────────────────────────────────────────────────────────────────────────
 *                         No secondary text             With secondary text (`description`)
 *   ────────────────────  ────────────────────────────  ─────────────────────────────────────
 *   No search             options in the 4px menu,      options in the 4px menu,
 *                         36px rows, max 7 → 260px      56px rows, max 7 → 400px
 *   Search                search block (8px 8px 4px)    search block (8px 8px 4px)
 *   (`searchPlaceholder`) + 4px list, 36px rows         + 4px list, 56px rows
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
 *   Option          hugs content (36px) · 8px 12px padding · 8px radius
 *   Primary text    Inter 14/20 medium · #101828 (text-primary)
 *   Secondary text  Inter 12/18 medium · #667085 (text-tertiary) · 2px under the primary line
 *   Link in it      Inter 12/18 semibold · #2970FF, e.g. "Preview" (opens the item without picking it)
 *   Option gap      2px
 *   Height          7 options, then vertical scroll.
 *                   max-height = 7 × row + 8px → 260px for one-line rows (36px),
 *                   400px for two-line rows (56px = 8 + 20 + 2 + 18 + 8)
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
 *   .dropdown                                            wrapper, position: relative
 *   ├ div.input.multiselect                              the field: chips + placeholder, click opens
 *   │ ├ span.chip                                        chip per selected option
 *   │ │ └ button.chip__remove                            × removes it (doesn't open the menu)
 *   │ ├ span.chip--more                                  "+N" for chips that don't fit on the line
 *   │ ├ span.multiselect__placeholder                    placeholder when nothing is selected
 *   │ └ button.multiselect__toggle                       full-size transparent button: focus target, aria-expanded, chevron
 *   └ div.dropdown__menu                                 the menu (role="group"), only while open
 *     ├ div.dropdown__search                             optional search block
 *     └ div.dropdown__list
 *       ├ label.dropdown__option.dropdown__option--all   optional "Select all"
 *       └ label.dropdown__option                         checkbox + text (+ span.dropdown__meta meta)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FIELD STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State        Border     Background  Notes
 *   ───────────  ─────────  ──────────  ─────────────────────────────────────────
 *   Empty        #D0D5DD    #FFF        Placeholder #98A2B3, Inter 16
 *   Filled       #D0D5DD    #FFF        Chips: 30px, 0 4px 0 10px padding, 1px #EAECF0, 6px radius, #F9FAFB,
 *                                       Inter 14/500 #344054; × 22px, #98A2B3, hover #EAECF0 / #344054
 *   Overflow     —          —           Chips stay on one line; the ones that don't fit hide behind "+N"
 *                                       (30px, 0 8px padding, 6px radius, #F2F4F7, 14/500 #344054)
 *   Open         #2970FF    —
 *   Focus (kbd)  —          —           2px #2970FF outline, 2px offset (on the chevron button)
 *   Error        #DC2626    —
 *   Disabled     #D0D5DD    #F9FAFB     not-allowed cursor, placeholder #98A2B3
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * OPTION STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State        Background  Checkbox                     Notes
 *   ───────────  ──────────  ───────────────────────────  ───────────────────────────────
 *   Default      none        20px, 6px radius, 1.5px #D0D5DD  36px (56px two-line), 8px 12px padding, 8px radius
 *   Hover        #F9FAFB     border #98A2B3
 *   Checked      none        #2970FF fill, white 14px check   No row fill: the checkbox carries the state
 *   Focus (kbd)  —           2px #2970FF outline, 2px offset
 *   Disabled     none        #F2F4F7 fill, #D0D5DD border     default cursor; a checked + disabled one shows a gray check
 *   Select all   —           checked when every enabled option is   divider 1px #EAECF0 under it, 2px gap
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - Click the field to open; focus goes to the search (if any), else the first checked option (or the first).
 *   - Space toggles the focused checkbox; the menu stays open so several can be picked.
 *   - Tab / Shift+Tab move between checkboxes; ↓ in the search moves to the first one.
 *   - Escape closes and returns focus to the field; an outside click closes.
 *   - A chip's × removes that option without opening the menu.
 *   - Select all / clear applies to the options currently visible in the search.
 *   - The chevron button reads "<label>, N selected".
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
  list: { padding: 4, gap: 0, maxVisible: 7 },
  option: {
    minHeight: 36, twoLineHeight: 56, paddingY: 8, paddingX: 12, radius: 8, lineGap: 2,
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

/* ───────────── Tokens (keep in sync with 16-reviewers-setup.css / 22-section-rows.css / 28-dropdown-menu.css) ───────────── */

export const MULTI_SELECT_TOKENS = {
  font: MENU_TOKENS.font,
  field: { height: 46, radius: 8, padding: "6px 44px 6px 8px", gap: 6, fontSize: 16 },
  chip: { height: 30, padding: "0 4px 0 10px", radius: 6, border: "#EAECF0", background: "#F9FAFB", fontSize: 14, fontWeight: 500, color: "#344054", gap: 2 },
  chipX: { size: 22, radius: 4, color: "#98A2B3", hoverBg: "#EAECF0", hoverColor: "#344054" },
  more: { height: 30, padding: "0 8px", radius: 6, background: "#F2F4F7" },
  menu: { offset: 6, minWidth: 280 },
  option: { ...MENU_TOKENS.option, checkboxGap: 8 },
  meta: { fontSize: 12, fontWeight: 500, color: "#667085" },
  checkbox: { size: 20, radius: 6, borderWidth: 1.5, border: "#D0D5DD", hoverBorder: "#98A2B3", on: "#2970FF", disabledBg: "#F2F4F7" },
  color: { border: "#D0D5DD", placeholder: "#98A2B3", icon: "#667085", blue: "#2970FF", error: "#DC2626", disabledBg: "#F9FAFB", divider: "#EAECF0" },
} as const;

const T = MULTI_SELECT_TOKENS;

/* ───────────── Types ───────────── */

export interface MultiSelectOption<V extends string = string> {
  value: V;
  label: string;
  /** secondary line under the label (12px tertiary, 2px gap), e.g. an employee's job title */
  description?: string;
  /** short trailing text at the right end of the row, e.g. "Same role" or a count */
  meta?: string;
  disabled?: boolean;
  /** tooltip, e.g. why a disabled option can't be changed */
  title?: string;
}

export interface MultiSelectProps<V extends string = string> {
  options: MultiSelectOption<V>[];
  value: V[];
  onChange: (value: V[]) => void;
  /** accessible name of the field and the menu, e.g. "Reviewer roles" */
  label: string;
  placeholder?: string;
  /** shows the search block above the list; the text is its placeholder and aria-label */
  searchPlaceholder?: string;
  /** shown when the search matches nothing (or there are no options) */
  emptyText?: string;
  /** adds a "Select all" row (divider under it) */
  selectAll?: boolean | string;
  invalid?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/* ───────────── Icons ───────────── */

const Chevron = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 7.5L10 12.5L15 7.5" stroke={T.color.icon} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Tick = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M11.7 3.5 5.5 9.8 2.3 6.6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ───────────── Checkbox (visual; the real <input> is visually hidden inside the row's <label>) ───────────── */

function CheckboxBox({ checked, disabled, hover, focus }: { checked: boolean; disabled?: boolean; hover?: boolean; focus?: boolean }) {
  const C = T.checkbox;
  const bg = disabled ? C.disabledBg : checked ? C.on : "#fff";
  const border = disabled ? C.border : checked ? C.on : hover ? C.hoverBorder : C.border;
  return (
    <span
      aria-hidden="true"
      style={{
        flex: "none", width: C.size, height: C.size, boxSizing: "border-box", display: "grid", placeContent: "center",
        borderRadius: C.radius, border: `${C.borderWidth}px solid ${border}`, background: bg,
        outline: focus ? `2px solid ${T.color.blue}` : undefined, outlineOffset: 2, transition: "background .12s, border-color .12s",
      }}
    >
      {checked && <Tick color={disabled ? C.border : "#fff"} />}
    </span>
  );
}

const srOnly: React.CSSProperties = {
  position: "absolute", width: 1, height: 1, margin: -1, padding: 0, border: 0,
  overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap",
};

/* ───────────── Option row ───────────── */

function OptionRow({
  label, description, meta, checked, disabled, title, onToggle, inputRef, divider,
}: {
  label: string; description?: string; meta?: string; checked: boolean; disabled?: boolean; title?: string;
  onToggle: (on: boolean) => void; inputRef?: (el: HTMLInputElement | null) => void; divider?: boolean;
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const O = T.option;
  return (
    <label
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: O.checkboxGap, flexShrink: 0, boxSizing: "border-box",
        minHeight: O.minHeight, padding: `${O.paddingY}px ${O.paddingX}px`,
        borderRadius: divider ? `${O.radius}px ${O.radius}px 0 0` : O.radius,
        borderBottom: divider ? `1px solid ${T.color.divider}` : undefined, marginBottom: divider ? 2 : undefined,
        background: hover && !disabled ? O.hover : "transparent", cursor: disabled ? "default" : "pointer",
      }}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onToggle(e.target.checked)}
        onFocus={(e) => setFocus(e.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocus(false)}
        style={srOnly}
      />
      <CheckboxBox checked={checked} disabled={disabled} hover={hover} focus={focus} />
      <OptionText label={label} description={description} />
      {meta && (
        <span style={{ marginLeft: "auto", flex: "none", fontSize: T.meta.fontSize, fontWeight: T.meta.fontWeight, color: T.meta.color, whiteSpace: "nowrap" }}>
          {meta}
        </span>
      )}
    </label>
  );
}

/* ───────────── Component ───────────── */

export function MultiSelect<V extends string = string>({
  options, value, onChange, label, placeholder = "Select one or more", searchPlaceholder, emptyText = "No matches",
  selectAll, invalid, disabled, style,
}: MultiSelectProps<V>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [hidden, setHidden] = React.useState(0); // chips folded into "+N"

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const chevRef = React.useRef<HTMLButtonElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const boxRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const searchable = !!searchPlaceholder;
  const selected = options.filter((o) => value.includes(o.value));
  const visible = options.filter((o) => matchesQuery(query, o.label, o.description));
  const togglable = visible.filter((o) => !o.disabled);
  const allOn = togglable.length > 0 && togglable.every((o) => value.includes(o.value));

  const toggle = (v: V, on: boolean) => onChange(on ? [...value.filter((x) => x !== v), v] : value.filter((x) => x !== v));
  const toggleAll = (on: boolean) => {
    const ids = togglable.map((o) => o.value);
    onChange(on ? [...value.filter((x) => !ids.includes(x)), ...ids] : value.filter((x) => !ids.includes(x)));
  };

  /* open: search first, else the first checked option (or the first) */
  React.useEffect(() => {
    if (!open) return;
    if (searchable) return searchRef.current?.focus({ preventScroll: true });
    const i = options.findIndex((o) => value.includes(o.value) && !o.disabled);
    boxRefs.current[i >= 0 ? i : options.findIndex((o) => !o.disabled)]?.focus({ preventScroll: true });
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

  /* keep chips on one line: fold the ones that don't fit into "+N" (same rule as rxFitChips) */
  React.useLayoutEffect(() => {
    const f = fieldRef.current;
    if (!f) return;
    const fit = () => {
      const chips = [...f.querySelectorAll<HTMLElement>("[data-chip]")];
      chips.forEach((c) => (c.style.display = ""));
      const edge = f.getBoundingClientRect().right - parseFloat(getComputedStyle(f).paddingRight) + 0.5;
      const over = (el: Element) => el.getBoundingClientRect().right > edge;
      if (chips.length < 2 || !over(chips[chips.length - 1])) return setHidden(0);
      const reserve = 48; // room for the "+N" badge
      let n = 0;
      for (let i = chips.length - 1; i > 0; i--) {
        chips[i].style.display = "none";
        n++;
        if (chips[i - 1].getBoundingClientRect().right + T.field.gap + reserve <= edge) break;
      }
      setHidden(n);
    };
    fit();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(fit);
    ro.observe(f);
    return () => ro.disconnect();
  }, [value.join("|")]);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) chevRef.current?.focus({ preventScroll: true });
  };
  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); close(true); }
  };
  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown") return;
    const first = options.findIndex((o) => !o.disabled && matchesQuery(query, o.label, o.description));
    if (first >= 0) { e.preventDefault(); boxRefs.current[first]?.focus(); }
  };

  const fieldStyle: React.CSSProperties = {
    position: "relative", height: T.field.height, boxSizing: "border-box", overflow: "hidden",
    display: "flex", flexWrap: "nowrap", alignItems: "center", gap: T.field.gap, padding: T.field.padding,
    border: `1px solid ${invalid ? T.color.error : open ? T.color.blue : T.color.border}`, borderRadius: T.field.radius,
    background: disabled ? T.color.disabledBg : "#fff", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: T.font, fontSize: T.field.fontSize,
  };
  const chipStyle: React.CSSProperties = {
    position: "relative", zIndex: 1, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: T.chip.gap,
    height: T.chip.height, boxSizing: "border-box", padding: T.chip.padding, border: `1px solid ${T.chip.border}`,
    borderRadius: T.chip.radius, background: T.chip.background, fontSize: T.chip.fontSize, fontWeight: T.chip.fontWeight,
    color: T.chip.color, whiteSpace: "nowrap",
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", minWidth: 0, ...style }}>
      <div ref={fieldRef} style={fieldStyle} onClick={() => !disabled && (setQuery(""), setOpen((o) => !o))}>
        {selected.length === 0 && <span style={{ padding: "0 6px", color: T.color.placeholder }}>{placeholder}</span>}
        {selected.map((o) => (
          <span key={o.value} data-chip="" style={chipStyle}>
            {o.label}
            {!disabled && !o.disabled && (
              <button
                type="button"
                aria-label={`Remove ${o.label}`}
                onClick={(e) => { e.stopPropagation(); toggle(o.value, false); }}
                style={{
                  width: T.chipX.size, height: T.chipX.size, padding: 0, border: 0, borderRadius: T.chipX.radius,
                  background: "none", color: T.chipX.color, fontSize: 16, lineHeight: 1, cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = T.chipX.hoverBg; e.currentTarget.style.color = T.chipX.hoverColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = T.chipX.color; }}
              >
                ×
              </button>
            )}
          </span>
        ))}
        {hidden > 0 && (
          <span style={{ ...chipStyle, padding: T.more.padding, border: 0, borderRadius: T.more.radius, background: T.more.background }}>
            +{hidden}
          </span>
        )}
        <button
          ref={chevRef}
          type="button"
          disabled={disabled}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={`${label}${value.length ? `, ${value.length} selected` : ""}`}
          style={{
            position: "absolute", inset: 0, width: "100%", border: 0, borderRadius: T.field.radius, background: "none",
            cursor: "inherit", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 13,
          }}
        >
          <Chevron />
        </button>
      </div>

      {open && (
        <MenuContainer sectioned onKeyDown={onMenuKey} offset={T.menu.offset} style={{ width: `max(100%, ${T.menu.minWidth}px)`, maxWidth: "calc(100vw - 32px)" }}>
          {searchable && (
            <MenuSearch value={query} onChange={setQuery} placeholder={searchPlaceholder} inputRef={searchRef} onKeyDown={onSearchKey} />
          )}
          <MenuList role="group" aria-label={label} rowHeight={rowHeightFor(options)}>
            {selectAll && togglable.length > 0 && (
              <OptionRow label={typeof selectAll === "string" ? selectAll : "Select all"} checked={allOn} onToggle={toggleAll} divider />
            )}
            {options.map((o, i) =>
              visible.includes(o) ? (
                <OptionRow
                  key={o.value}
                  label={o.label}
                  description={o.description}
                  meta={o.meta}
                  title={o.title}
                  checked={value.includes(o.value)}
                  disabled={o.disabled}
                  onToggle={(on) => toggle(o.value, on)}
                  inputRef={(el) => { boxRefs.current[i] = el; }}
                />
              ) : null,
            )}
            {visible.length === 0 && <MenuEmpty>{emptyText}</MenuEmpty>}
          </MenuList>
        </MenuContainer>
      )}
    </div>
  );
}

/* ───────────── State gallery (one example per documented state) ───────────── */

const REVIEWER_ROLES: MultiSelectOption[] = [
  { value: "Project Manager", label: "Project Manager" },
  { value: "Foreman", label: "Foreman" },
  { value: "Worker", label: "Worker", meta: "Same role" },
];
const REOPEN_BY: MultiSelectOption[] = [
  { value: "Admin", label: "Admin", disabled: true, title: "Admins can always reopen a cycle" },
  { value: "HR", label: "HR" },
  { value: "Manager", label: "Manager" },
];
const EMPLOYEES: MultiSelectOption[] = [
  ["Ana Lopez", "Foreman"], ["Ben Carter", "Worker"], ["Chen Wei", "Project Manager"], ["Dana Ortiz", "Worker"],
  ["Eli Grant", "Safety Lead"], ["Fatima Khan", "Worker"], ["Gus Moreno", "Foreman"], ["Hana Sato", "Worker"],
  ["Ivan Petrov", "Estimator"], ["Jade Kim", "Worker"],
].map(([label, description], i) => ({ value: `e${i + 1}`, label, description }));
const PROJECTS: MultiSelectOption[] = ["Harbor Point Tower", "Maple St. Renovation", "Riverside Clinic", "North Yard Warehouse"].map((v) => ({ value: v, label: v }));

const TRADES: MultiSelectOption[] = ["Carpentry", "Concrete", "Drywall", "Electrical", "HVAC", "Masonry", "Painting", "Plumbing", "Roofing", "Steel"].map((v) => ({ value: v, label: v }));

/** Every state side by side, for review and visual QA. */
export function MultiSelectStates() {
  const [revs, setRevs] = React.useState<string[]>(["Foreman"]);
  const [many, setMany] = React.useState<string[]>(PROJECTS.map((p) => p.value));
  const [reopen, setReopen] = React.useState<string[]>(["Admin"]);
  const [excl, setExcl] = React.useState<string[]>(["e2"]);
  const [bad, setBad] = React.useState<string[]>([]);
  const [revs2, setRevs2] = React.useState<string[]>([]);
  const [trades, setTrades] = React.useState<string[]>([]);
  const row: React.CSSProperties = { display: "grid", gap: 8, width: 400 };
  const q: React.CSSProperties = { fontSize: 14, fontWeight: 500, color: "#344054" };
  return (
    <div style={{ display: "grid", gap: 32, fontFamily: T.font, paddingBottom: 440 }}>
      <section style={row}>
        <span style={q}>1 · Filled, trailing meta (Reviewers)</span>
        <MultiSelect label="Reviewer roles" value={revs} onChange={setRevs} options={REVIEWER_ROLES} placeholder="Select one or more reviewers" />
      </section>

      <section style={row}>
        <span style={q}>2 · Overflow "+N", Select all (Projects)</span>
        <MultiSelect label="Projects" value={many} onChange={setMany} options={PROJECTS} selectAll placeholder="Select projects" />
      </section>

      <section style={row}>
        <span style={q}>3 · Disabled option (Who can reopen it?)</span>
        <MultiSelect label="Who can reopen the cycle" value={reopen} onChange={setReopen} options={REOPEN_BY} />
      </section>

      <section style={row}>
        <span style={q}>4 · With search, two-line options, scrolls after 7 (Exclude employees)</span>
        <MultiSelect
          label="Excluded employees"
          value={excl}
          onChange={setExcl}
          options={EMPLOYEES}
          searchPlaceholder="Search"
          emptyText="No employees match"
          placeholder="Select employees to exclude"
        />
      </section>

      <section style={row}>
        <span style={q}>4b · No search, two-line options (Reviewer roles with a description)</span>
        <MultiSelect
          label="Reviewer roles"
          value={revs2}
          onChange={setRevs2}
          options={[
            { value: "Project Manager", label: "Project Manager", description: "Reviews everyone on their projects" },
            { value: "Foreman", label: "Foreman", description: "Reviews their crew" },
            { value: "Peer", label: "Peer", description: "Co-workers with the same role" },
          ]}
        />
      </section>

      <section style={row}>
        <span style={q}>4c · With search, one-line options (Group values: Trade)</span>
        <MultiSelect label="Trades" value={trades} onChange={setTrades} options={TRADES} searchPlaceholder="Search" placeholder="Select trades" />
      </section>

      <section style={row}>
        <span style={q}>5 · Error</span>
        <MultiSelect label="Reviewer roles" value={bad} onChange={setBad} options={REVIEWER_ROLES} invalid={!bad.length} placeholder="Select one or more reviewers" />
      </section>

      <section style={row}>
        <span style={q}>6 · Disabled field (Select a category first)</span>
        <MultiSelect label="Group values" value={[]} onChange={() => {}} options={[]} disabled placeholder="Select a category first" />
      </section>
    </div>
  );
}

export default MultiSelect;
