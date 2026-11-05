/**
 * Tabs: page-level underline tabs with count badges
 * ==================================================
 *
 * Used directly under a page header (Review Cycles, Review Templates, My Reviews, Users)
 * to switch between filtered views of the same list.
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │  Active (3)   Scheduled (0)   Drafts (1)   Closed (1)        │
 *   │  ━━━━━━━━━━                                                  │  ← 3px blue underline
 *   └──────────────────────────────────────────────────────────────┘  ← 1px #E5E7EB page-head border
 *
 * This file is the spec and a typed React reference. The prototype itself is plain JS:
 * `tabBar()` in ./tabs.js renders the same markup and class names, styled by ./tabs.css.
 * If you change a value here, change it in tabs.css too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .lb-tabs            role="tablist"  flex row, 18px gap, scrolls sideways, no scrollbar
 *   └ .lb-tab           role="tab"      12px × 4px padding, 3px bottom border, 6px gap to badge
 *     ├ .lb-tab__label                  Inter 16/24. Reserves its 600-weight width so the row
 *     │                                 doesn't shift when a tab becomes selected
 *     └ .lb-tab__badge                  optional count pill
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TAB STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State      Text      Weight  Underline (3px)    Cursor        Notes
 *   ─────────  ────────  ──────  ─────────────────  ────────────  ─────────────────────────────
 *   Default    #4B5563   500     transparent        pointer
 *   Hover      #111827   500     #D1D5DB            pointer       Not applied to selected or disabled
 *   Selected   #111827   600     #2F6FDE (blue)     default       aria-selected="true", tabindex 0
 *   Focus      unchanged unch.   unchanged          —             2px #2F6FDE outline, -2px offset,
 *                                                                  4px top radius (keyboard only)
 *   Disabled   #9CA3AF   500     transparent        not-allowed   Badge at 60% opacity, no click
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BADGE
 * ─────────────────────────────────────────────────────────────────────────────
 *   20px tall, min-width 24px, 0 × 8px padding, full pill radius, 12/20 Inter, tabular figures.
 *
 *   Tone      Background  Text      Weight  Use for
 *   ────────  ──────────  ────────  ──────  ──────────────────────────────────────────
 *   neutral   #F3F4F6     #6B7280   500     Item counts (default). Same on selected tabs.
 *   info      #EFF4FF     #2F6FDE   500     New or unread items worth noticing
 *   danger    #FEE2E2     #DC2626   600     Items that need action (Issues, Overdue)
 *
 *   Rules
 *   - `count` left out → no badge. `0` → badge shows "0" (an empty view is still useful info).
 *   - Counts above `max` (default 99) show as "99+".
 *   - The badge is the count for that tab, not for the current filter/search.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - Exactly one tab is selected. Clicking a selected tab does nothing.
 *   - Roving tabindex: only the selected tab is in the Tab order.
 *   - ← / → move focus (wraps), Home / End jump to the ends, Enter / Space select
 *     (manual activation, since selecting re-renders the view).
 *   - Disabled tabs are skipped by arrow keys.
 *   - Give the tab list an aria-label when the page has more than one tab list.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE (prototype, plain JS)
 * ─────────────────────────────────────────────────────────────────────────────
 *   tabBar(
 *     [{ id: "Active", label: "Active", count: 3 },
 *      { id: "Scheduled", label: "Scheduled", count: 0 },
 *      { id: "Drafts", label: "Drafts", count: 1 },
 *      { id: "Closed", label: "Closed", count: 1 }],
 *     { active: S.cycTab, label: "Review cycle status",
 *       onSelect: id => `nav('cycles',{cycTab:'${id}'})` });
 */

import * as React from "react";

/* ───────────── Tokens (keep in sync with tabs.css) ───────────── */

export const TAB_TOKENS = {
  gap: 18,
  paddingY: 12,
  paddingX: 4,
  labelBadgeGap: 6,
  underline: 3,
  font: { family: "Inter", size: 16, lineHeight: 24 },
  state: {
    default:  { color: "#4B5563", weight: 500, underline: "transparent" },
    hover:    { color: "#111827", weight: 500, underline: "#D1D5DB" },
    selected: { color: "#111827", weight: 600, underline: "#2F6FDE" },
    focus:    { outline: "2px solid #2F6FDE", outlineOffset: -2 },
    disabled: { color: "#9CA3AF", weight: 500, underline: "transparent", badgeOpacity: 0.6 },
  },
} as const;

export const BADGE_TOKENS = {
  height: 20,
  minWidth: 24,
  paddingX: 8,
  fontSize: 12,
  tone: {
    neutral: { bg: "#F3F4F6", color: "#6B7280", weight: 500 },
    info:    { bg: "#EFF4FF", color: "#2F6FDE", weight: 500 },
    danger:  { bg: "#FEE2E2", color: "#DC2626", weight: 600 },
  },
} as const;

/* ───────────── Types ───────────── */

/** Visual state of a single tab. Hover and focus come from the browser; the rest from props. */
export type TabState = "default" | "hover" | "selected" | "focus" | "disabled";

export type BadgeTone = keyof typeof BADGE_TOKENS.tone;

export interface TabItem<Id extends string = string> {
  /** Stable key, passed to `onSelect`. */
  id: Id;
  /** Visible text. Keep it to one or two words. */
  label: string;
  /** Count shown in the badge. Leave it out for no badge; `0` still shows. */
  count?: number | string;
  /** Badge colour. Default "neutral". */
  tone?: BadgeTone;
  /** Shown but can't be selected. */
  disabled?: boolean;
}

export interface TabsProps<Id extends string = string> {
  items: TabItem<Id>[];
  /** id of the selected tab. */
  active: Id;
  onSelect: (id: Id) => void;
  /** aria-label for the tab list. */
  label?: string;
  /** Counts above this render as "max+". Default 99. */
  max?: number;
  className?: string;
}

/* ───────────── Badge ───────────── */

export function TabBadge({
  count,
  tone = "neutral",
  max = 99,
}: {
  count: number | string;
  tone?: BadgeTone;
  max?: number;
}) {
  const text = typeof count === "number" && count > max ? `${max}+` : String(count);
  return (
    <span className={`lb-tab__badge${tone === "neutral" ? "" : ` lb-tab__badge--${tone}`}`}>
      {text}
    </span>
  );
}

/* ───────────── Tabs ───────────── */

export function Tabs<Id extends string>({
  items,
  active,
  onSelect,
  label,
  max = 99,
  className,
}: TabsProps<Id>) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const hasActive = items.some((t) => t.id === active);
  const firstEnabled = items.findIndex((t) => !t.disabled);

  // ← → Home End move focus between enabled tabs; Enter / Space select.
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabled = items.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
    const pos = enabled.indexOf(index);
    const next = { ArrowRight: pos + 1, ArrowLeft: pos - 1, Home: 0, End: enabled.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    refs.current[enabled[(next + enabled.length) % enabled.length]]?.focus();
  };

  return (
    <div className={`lb-tabs${className ? ` ${className}` : ""}`} role="tablist" aria-label={label}>
      {items.map((t, i) => {
        const selected = t.id === active;
        const inTabOrder = selected || (!hasActive && i === firstEnabled);
        return (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            className={`lb-tab${selected ? " is-selected" : ""}`}
            aria-selected={selected}
            tabIndex={inTabOrder ? 0 : -1}
            disabled={t.disabled}
            onClick={() => !selected && onSelect(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className="lb-tab__label" data-label={t.label}>{t.label}</span>
            {t.count != null && <TabBadge count={t.count} tone={t.tone} max={max} />}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────── State gallery (one example per documented state / badge) ───────────── */

/** Every tab state and badge tone side by side, for review and visual QA. */
export function TabsStates() {
  const [cycle, setCycle] = React.useState<"Active" | "Scheduled" | "Drafts" | "Closed">("Active");
  return (
    <div style={{ display: "grid", gap: 32, fontFamily: "Inter, sans-serif" }}>
      <section>
        <h4>1 · Review Cycles (reference screen)</h4>
        <Tabs
          label="Review cycle status"
          active={cycle}
          onSelect={setCycle}
          items={[
            { id: "Active", label: "Active", count: 3 },
            { id: "Scheduled", label: "Scheduled", count: 0 },
            { id: "Drafts", label: "Drafts", count: 1 },
            { id: "Closed", label: "Closed", count: 1 },
          ]}
        />
      </section>

      <section>
        <h4>2 · States: selected · default · disabled (hover / focus: interact)</h4>
        <Tabs
          active="selected"
          onSelect={() => {}}
          items={[
            { id: "selected", label: "Selected", count: 12 },
            { id: "default", label: "Default", count: 4 },
            { id: "disabled", label: "Disabled", count: 2, disabled: true },
          ]}
        />
      </section>

      <section>
        <h4>3 · Badges: none · zero · neutral · info · danger · overflow</h4>
        <Tabs
          active="none"
          onSelect={() => {}}
          items={[
            { id: "none", label: "No badge" },
            { id: "zero", label: "Zero", count: 0 },
            { id: "neutral", label: "Neutral", count: 8 },
            { id: "info", label: "New", count: 2, tone: "info" },
            { id: "danger", label: "Issues", count: 3, tone: "danger" },
            { id: "overflow", label: "Overflow", count: 140 },
          ]}
        />
      </section>
    </div>
  );
}

export default Tabs;
