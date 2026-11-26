/**
 * SearchBar: filter a list as you type
 * ====================================
 *
 * The search field in listing toolbars (Review Cycles, Templates, Users, cycle detail › Employees).
 * Filters the list below it; it is not a global search.
 *
 *   ┌────────────────────────────────────────┐
 *   │ 🔍  Search by name or email          × │   ← 44px × 320px, 1px #D0D5DD, 8px radius
 *   └────────────────────────────────────────┘     20px icon #667085, 8px gap, × once there's text
 *
 * This file is the spec and a typed React reference. In the prototype it is `.srch` (listing pages,
 * src/styles/25-listing-pages.css + 30-listing-v2.css) and `.cd-srch` (cycle detail,
 * 18-cycle-detail-layout.css). If you change a value here, change it in the CSS too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .srch                       role="search", flex row, 8px gap, 12px side padding
 *   ├ svg.srch__icon            20px search-md icon, #667085, aria-hidden
 *   ├ input.srch__input         type="search", no border / outline, fills the row
 *   └ button.srch__clear        20px x-close (x-close-20-tertiary.svg), only when there's text
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZES
 * ─────────────────────────────────────────────────────────────────────────────
 *   Size   Height  Padding  Text      Icon   Default width  Use for
 *   ─────  ──────  ───────  ────────  ─────  ─────────────  ───────────────────────────────
 *   sm     36px    12px     14 / 400  16px   240px          Inside cards, side panels
 *   md     40px    12px     14 / 400  20px   280px          Dialogs, filter menus
 *   lg     44px    12px     16 / 400  20px   320px          Listing toolbars (default)
 *
 *   Under 900px the toolbar search goes full width (100%).
 *   Search inside a dropdown menu is specified in ../single-select/SingleSelect.tsx.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State        Border    Text / placeholder    Notes
 *   ───────────  ────────  ────────────────────  ─────────────────────────────────────────────
 *   Empty        #D0D5DD   placeholder #7D89B0   "Search by name or email": say what it matches
 *   Hover        #667085   —                     Not while focused
 *   Focus        #2970FF   —                     Focus wins over hover. No extra ring
 *   Filled       #D0D5DD   #101828               × appears at the right end
 *   Disabled     #EAECF0   #98A2B3               #F9FAFB fill, icon #D0D5DD
 *   Clear ×      —         —                     20px, 4px radius, 2px #2970FF focus outline,
 *                                                tooltip "Clear search"
 *   Border transition 120ms.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - Filters as you type (debounce 150ms for long lists). No submit button.
 *   - Matching ignores case and leading / trailing spaces.
 *   - × and Escape clear the text, reset the list and keep focus in the input.
 *   - No matches: the list shows an empty state with a "Clear search" link button, not the bar.
 *   - The search keeps its text when switching tabs / segmented filters on the same page.
 *   - Give the input an aria-label ("Search review cycles") since there's no visible label.
 *   - The native WebKit cancel button is hidden; ours is the only ×.
 */

import * as React from "react";

/* ───────────── Tokens (keep in sync with the CSS) ───────────── */

export const SEARCH_BAR_TOKENS = {
  radius: 8,
  gap: 8,
  size: {
    sm: { height: 36, paddingX: 12, fontSize: 14, icon: 16, width: 240 },
    md: { height: 40, paddingX: 12, fontSize: 14, icon: 20, width: 280 },
    lg: { height: 44, paddingX: 12, fontSize: 16, icon: 20, width: 320 },
  },
  font: { family: "Inter", weight: 400 },   // regular
  iconColor: "#667085",
  clear: { size: 20, radius: 4, focus: "2px solid #2970FF" },
  state: {
    default:  { bg: "#FFFFFF", border: "#D0D5DD", color: "#101828", placeholder: "#7D89B0" },
    hover:    { border: "#667085" },
    focus:    { border: "#2970FF" },
    disabled: { bg: "#F9FAFB", border: "#EAECF0", color: "#98A2B3", icon: "#D0D5DD" },
  },
  transitionMs: 120,
  debounceMs: 150,
  fullWidthBelow: 900,
} as const;

/* ───────────── SearchBar ───────────── */

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  /** Says what it matches: "Search by name or email". */
  placeholder?: string;
  /** Required: there's no visible label. */
  label: string;
  size?: keyof typeof SEARCH_BAR_TOKENS.size;
  disabled?: boolean;
  /** Override the default width (px or CSS value). */
  width?: number | string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  label,
  size = "lg",
  disabled,
  width,
  className,
}: SearchBarProps) {
  const input = React.useRef<HTMLInputElement>(null);
  const clear = () => {
    onChange("");
    input.current?.focus();
  };
  return (
    <div
      role="search"
      className={["srch", size !== "lg" && `srch--${size}`, disabled && "is-disabled", className].filter(Boolean).join(" ")}
      style={width != null ? { width } : undefined}
    >
      <svg className="srch__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m17.5 17.5-2.917-2.917m2.084-5a7.083 7.083 0 1 1-14.167 0 7.083 7.083 0 0 1 14.167 0Z" />
      </svg>
      <input
        ref={input}
        type="search"
        className="srch__input"
        value={value}
        placeholder={placeholder}
        aria-label={label}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Escape" && value) { e.preventDefault(); clear(); } }}
      />
      {value && !disabled && (
        <button type="button" className="srch__clear" aria-label="Clear search" data-tip="Clear search" onClick={clear}>
          <img src="/assets/x-close-20-tertiary.svg" width={20} height={20} alt="" />
        </button>
      )}
    </div>
  );
}

/* ───────────── State gallery ───────────── */

/** Every size and state, for review and visual QA. Hover and focus are live. */
export function SearchBarStates() {
  const [q, setQ] = React.useState("");
  const [q2, setQ2] = React.useState("Jordan");
  return (
    <div style={{ display: "grid", gap: 16, fontFamily: "Inter, sans-serif" }}>
      <SearchBar label="Search review cycles" placeholder="Search by cycle name" value={q} onChange={setQ} />
      <SearchBar label="Search employees" placeholder="Search by name or email" value={q2} onChange={setQ2} />
      <SearchBar label="Search (md)" size="md" placeholder="Search" value="" onChange={() => {}} />
      <SearchBar label="Search (sm)" size="sm" placeholder="Search" value="" onChange={() => {}} />
      <SearchBar label="Search (disabled)" placeholder="Search" value="" onChange={() => {}} disabled />
    </div>
  );
}

export default SearchBar;
