/**
 * ButtonGroup: segmented control with count badges
 * ================================================
 *
 * Switches between filtered views of the same list, inside a card or toolbar
 * (Overview › Cycles "Active / Closed", Cycle detail › Employees "All / Needs attention / …").
 * Use page Tabs (../tabs) for page-level navigation under a header; use this inside content.
 *
 *   ┌────────────┬──────────────────────┬────────────────┐
 *   │ All  (23)  │ Needs attention  (7) │ In progress (16)│   ← 1px #D1D5DB border, 8px radius
 *   └────────────┴──────────────────────┴────────────────┘     1px dividers between buttons
 *     selected: #EFF4FF fill, #2563EB text
 *
 * This file is the spec and a typed React reference. The prototype itself is plain JS:
 * `btnGroup()` in ./buttonGroup.js renders the same markup and class names, styled by ./button-group.css.
 * If you change a value here, change it in button-group.css too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .lb-bgrp              role="group"   inline-flex, 1px border, 8px radius, clips children
 *   └ .lb-bgrp__btn       <button>       40px tall (44px with size "lg"), 0 × 16px padding, 8px gap to badge
 *     ├ .lb-bgrp__label                  Inter 14/20, weight 500
 *     └ .lb-bgrp__badge                  optional count pill
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BUTTON STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State      Background  Text      Cursor        Notes
 *   ─────────  ──────────  ────────  ────────────  ─────────────────────────────────────
 *   Default    #FFFFFF     #374151   pointer
 *   Hover      #F9FAFB     #111827   pointer       Not applied to selected or disabled
 *   Selected   #EFF4FF     #2563EB   default       aria-pressed="true"
 *   Focus      unchanged   unchanged —             2px #2563EB outline, -2px offset (keyboard only)
 *   Disabled   #FFFFFF     #9CA3AF   not-allowed   Badge at 60% opacity
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BADGE
 * ─────────────────────────────────────────────────────────────────────────────
 *   20px tall, min-width 24px, 0 × 8px padding, full pill radius, 12/20 Inter, tabular figures.
 *
 *   Tone      Background  Text      Weight  Use for
 *   ────────  ──────────  ────────  ──────  ──────────────────────────────────────────
 *   neutral   #F2F4F7     #344054   500     Item counts (default). #FFFFFF / #2563EB when selected.
 *   info      #EFF4FF     #2563EB   500     New or unread items worth noticing
 *   warning   #FEF0C7     #B54708   600     Needs attention: items someone should look at
 *   danger    #FEE4E2     #B42318   600     Errors / blocked items
 *
 *   Rules
 *   - `count` left out → no badge. `0` → badge shows "0".
 *   - Counts above `max` (default 99) show as "99+".
 *   - Tone stays the same when the button is selected (except neutral, see above).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - Exactly one button is selected (aria-pressed="true"). Clicking it again does nothing.
 *   - Every button is in the Tab order (it's a group of toggle buttons, not a tablist).
 *   - Give the group an aria-label ("Show cycles", "Show employees").
 *   - Scrolls sideways instead of wrapping when it doesn't fit.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE (prototype, plain JS)
 * ─────────────────────────────────────────────────────────────────────────────
 *   btnGroup(
 *     [{ id: "All", label: "All", count: 23 },
 *      { id: "Needs attention", label: "Needs attention", count: 7, tone: "warning" },
 *      { id: "Done", label: "Done", count: 0 }],
 *     { active: S.quick, label: "Show employees",
 *       onSelect: id => `S.quick='${id}';render()` });
 */

import * as React from "react";

/* ───────────── Tokens (keep in sync with button-group.css) ───────────── */

export const BUTTON_GROUP_TOKENS = {
  height: { md: 40, lg: 44 },
  paddingX: 16,
  labelBadgeGap: 8,
  radius: 8,
  border: "#D1D5DB",
  font: { family: "Inter", size: 14, lineHeight: 20, weight: 500 },
  state: {
    default:  { bg: "#FFFFFF", color: "#374151" },
    hover:    { bg: "#F9FAFB", color: "#111827" },
    selected: { bg: "#EFF4FF", color: "#2563EB" },
    focus:    { outline: "2px solid #2563EB", outlineOffset: -2 },
    disabled: { bg: "#FFFFFF", color: "#9CA3AF", badgeOpacity: 0.6 },
  },
} as const;

export const BUTTON_GROUP_BADGE_TOKENS = {
  height: 20,
  minWidth: 24,
  paddingX: 8,
  fontSize: 12,
  tone: {
    neutral: { bg: "#F2F4F7", color: "#344054", weight: 500, selected: { bg: "#FFFFFF", color: "#2563EB" } },
    info:    { bg: "#EFF4FF", color: "#2563EB", weight: 500 },
    warning: { bg: "#FEF0C7", color: "#B54708", weight: 600 },
    danger:  { bg: "#FEE4E2", color: "#B42318", weight: 600 },
  },
} as const;

/* ───────────── Types ───────────── */

export type ButtonGroupBadgeTone = keyof typeof BUTTON_GROUP_BADGE_TOKENS.tone;

export interface ButtonGroupItem<Id extends string = string> {
  /** Stable key, passed to `onSelect`. */
  id: Id;
  /** Visible text. Keep it to one or two words. */
  label: string;
  /** Count shown in the badge. Leave it out for no badge; `0` still shows. */
  count?: number | string;
  /** Badge colour. Default "neutral". */
  tone?: ButtonGroupBadgeTone;
  /** Shown but can't be selected. */
  disabled?: boolean;
}

export interface ButtonGroupProps<Id extends string = string> {
  items: ButtonGroupItem<Id>[];
  /** id of the selected button. */
  active: Id;
  onSelect: (id: Id) => void;
  /** aria-label for the group. */
  label: string;
  /** "md" = 40px (default), "lg" = 44px to line up with 44px search fields / buttons. */
  size?: "md" | "lg";
  /** Counts above this render as "max+". Default 99. */
  max?: number;
  className?: string;
}

/* ───────────── Badge ───────────── */

export function ButtonGroupBadge({
  count,
  tone = "neutral",
  max = 99,
}: {
  count: number | string;
  tone?: ButtonGroupBadgeTone;
  max?: number;
}) {
  const text = typeof count === "number" && count > max ? `${max}+` : String(count);
  return (
    <span className={`lb-bgrp__badge${tone === "neutral" ? "" : ` lb-bgrp__badge--${tone}`}`}>{text}</span>
  );
}

/* ───────────── ButtonGroup ───────────── */

export function ButtonGroup<Id extends string>({
  items,
  active,
  onSelect,
  label,
  size = "md",
  max = 99,
  className,
}: ButtonGroupProps<Id>) {
  return (
    <div
      className={`lb-bgrp${size === "lg" ? " lb-bgrp--lg" : ""}${className ? ` ${className}` : ""}`}
      role="group"
      aria-label={label}
    >
      {items.map((t) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            className={`lb-bgrp__btn${selected ? " is-selected" : ""}`}
            aria-pressed={selected}
            disabled={t.disabled}
            onClick={() => !selected && onSelect(t.id)}
          >
            <span className="lb-bgrp__label">{t.label}</span>
            {t.count != null && <ButtonGroupBadge count={t.count} tone={t.tone} max={max} />}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────── State gallery (one example per documented state / badge) ───────────── */

/** Every state and badge tone side by side, for review and visual QA. */
export function ButtonGroupStates() {
  const [cyc, setCyc] = React.useState<"Active" | "Closed">("Active");
  const [quick, setQuick] = React.useState("All");
  return (
    <div style={{ display: "grid", gap: 32, fontFamily: "Inter, sans-serif" }}>
      <section>
        <h4>1 · Overview › Cycles</h4>
        <ButtonGroup
          label="Show cycles"
          active={cyc}
          onSelect={setCyc}
          items={[
            { id: "Active", label: "Active", count: 3 },
            { id: "Closed", label: "Closed", count: 1 },
          ]}
        />
      </section>

      <section>
        <h4>2 · Cycle detail › Employees (size lg, warning badge)</h4>
        <ButtonGroup
          label="Show employees"
          size="lg"
          active={quick}
          onSelect={setQuick}
          items={[
            { id: "All", label: "All", count: 23 },
            { id: "Needs attention", label: "Needs attention", count: 7, tone: "warning" },
            { id: "In progress", label: "In progress", count: 16 },
            { id: "Done", label: "Done", count: 0 },
            { id: "Removed", label: "Removed", count: 1 },
          ]}
        />
      </section>

      <section>
        <h4>3 · Badges: none · neutral · info · warning · danger · overflow · disabled</h4>
        <ButtonGroup
          label="Badge tones"
          active="none"
          onSelect={() => {}}
          items={[
            { id: "none", label: "No badge" },
            { id: "neutral", label: "Neutral", count: 8 },
            { id: "info", label: "New", count: 2, tone: "info" },
            { id: "warning", label: "Attention", count: 7, tone: "warning" },
            { id: "danger", label: "Errors", count: 3, tone: "danger" },
            { id: "overflow", label: "Overflow", count: 140 },
            { id: "disabled", label: "Disabled", count: 2, disabled: true },
          ]}
        />
      </section>
    </div>
  );
}

export default ButtonGroup;
