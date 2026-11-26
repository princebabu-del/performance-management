/**
 * Toggle: on / off switch, with or without a label
 * ================================================
 *
 * For settings that take effect immediately (Send reminders, Show scores to reviewees). If the
 * change only applies after pressing Save, use ../checkbox instead.
 *
 *   (●○)  Send reminders                         ← with label: 36×20 track, 8px gap, 14/500 #101828
 *         Emails reviewers 3 days before due.    ← optional description 14/400 #667085
 *   (○●)                                         ← without label (table rows, card headers):
 *                                                  aria-label required
 *
 * This file is the spec and a typed React reference. The prototype has no shared toggle CSS yet;
 * new screens should use the `.toggle` class names below.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   Without label
 *   button.toggle[role=switch]               the track, aria-checked, aria-label required
 *   └ span.toggle__thumb                     white circle, slides left → right
 *
 *   With label
 *   label.toggle-item                        inline-flex, 8px gap (12px for md), align top, pointer
 *   ├ button.toggle[role=switch]             aria-labelledby the text
 *   └ span.toggle-item__body                 flex column, 2px gap
 *     ├ span.toggle-item__text               the setting name
 *     └ span.toggle-item__description        optional supporting text
 *   Label after the switch by default; `labelPosition="start"` puts it before (settings rows,
 *   with the switch pushed to the right edge).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZES
 * ─────────────────────────────────────────────────────────────────────────────
 *   Size   Track     Thumb  Padding  Travel  Gap   Label     Description  Use for
 *   ─────  ────────  ─────  ───────  ──────  ────  ────────  ───────────  ──────────────────────
 *   sm     36 × 20   16px   2px      16px    8px   14 / 500  14 / 400     Tables, cards, panels (default)
 *   md     44 × 24   20px   2px      20px    12px  16 / 500  16 / 400     Settings pages
 *
 *   Track radius 12px (full pill). Thumb shadow 0 1px 3px rgba(16,24,40,.1), 0 1px 2px rgba(16,24,40,.06).
 *   Label line height 1.4, colour #101828; description #667085.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State             Track     Thumb     Notes
 *   ────────────────  ────────  ────────  ────────────────────────────────────────────────
 *   Off               #F2F4F7   #FFFFFF   Thumb on the left
 *   Off hover         #EAECF0   #FFFFFF   Hovering the label counts too
 *   On                #2970FF   #FFFFFF   Thumb on the right
 *   On hover          #155EEF   #FFFFFF
 *   Focus (keyboard)  —         —         2px #2970FF outline, 2px offset, pill shape
 *   Disabled off      #F2F4F7   #F9FAFB   No thumb shadow; label #98A2B3; not-allowed
 *   Disabled on       #EAECF0   #F9FAFB   No thumb shadow; label #98A2B3
 *   Saving            as on/off  —        While a save is in flight: aria-busy, clicks ignored
 *   Thumb slides and track colour changes over 150ms ease-out (none with reduced motion).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - A <button role="switch" aria-checked>. Space and Enter flip it; clicking the label does too.
 *   - Without a visible label, `aria-label` is required ("Send reminders for Q4 cycle").
 *   - The label names the setting, not the state: "Send reminders", never "On" / "Off" or
 *     "Enable reminders" (the switch already says on / off).
 *   - It saves right away. If the save fails, flip it back and show a toast with the reason.
 *   - Never ask "Are you sure?" for a toggle; if the change is risky, use a checkbox + Save or a
 *     button with a confirm dialog.
 */

import * as React from "react";

/* ───────────── Tokens (keep in sync with the CSS) ───────────── */

export const TOGGLE_TOKENS = {
  radius: 12,
  padding: 2,
  bodyGap: 2,
  size: {
    sm: { width: 36, height: 20, thumb: 16, travel: 16, gap: 8, label: 14, description: 14 },
    md: { width: 44, height: 24, thumb: 20, travel: 20, gap: 12, label: 16, description: 16 },
  },
  thumbShadow: "0 1px 3px rgba(16,24,40,.1), 0 1px 2px rgba(16,24,40,.06)",
  label: { weight: 500, lineHeight: 1.4, color: "#101828", disabledColor: "#98A2B3" },
  description: { weight: 400, lineHeight: 1.4, color: "#667085" },
  state: {
    off:         { track: "#F2F4F7", thumb: "#FFFFFF" },
    offHover:    { track: "#EAECF0", thumb: "#FFFFFF" },
    on:          { track: "#2970FF", thumb: "#FFFFFF" },
    onHover:     { track: "#155EEF", thumb: "#FFFFFF" },
    disabledOff: { track: "#F2F4F7", thumb: "#F9FAFB" },
    disabledOn:  { track: "#EAECF0", thumb: "#F9FAFB" },
    focus:       { outline: "2px solid #2970FF", outlineOffset: 2 },
  },
  transition: "150ms ease-out",
} as const;

export type ToggleSize = keyof typeof TOGGLE_TOKENS.size;

/* ───────────── Types ───────────── */

interface ToggleBase extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Default "sm" (36 × 20). */
  size?: ToggleSize;
  /** A save is in flight: ignore clicks. */
  busy?: boolean;
}
interface ToggleWithLabel extends ToggleBase {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** "end" (default): switch then text. "start": text then switch, pushed apart. */
  labelPosition?: "start" | "end";
}
interface ToggleWithoutLabel extends ToggleBase {
  label?: undefined;
  description?: undefined;
  labelPosition?: undefined;
  "aria-label": string;
}
export type ToggleProps = ToggleWithLabel | ToggleWithoutLabel;

/* ───────────── Toggle ───────────── */

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { checked, onChange, size = "sm", busy, label, description, labelPosition = "end", disabled, className, id, ...rest },
  ref,
) {
  const autoId = React.useId();
  const baseId = id ?? `toggle-${autoId}`;
  const flip = () => { if (!disabled && !busy) onChange(!checked); };

  const track = (
    <button
      ref={ref}
      id={baseId}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={busy || undefined}
      aria-labelledby={label ? `${baseId}-label` : undefined}
      aria-describedby={description ? `${baseId}-desc` : undefined}
      disabled={disabled}
      className={["toggle", size === "md" && "toggle--md", checked && "is-on", !label && className].filter(Boolean).join(" ")}
      onClick={flip}
      {...rest}
    >
      <span className="toggle__thumb" aria-hidden="true" />
    </button>
  );
  if (!label) return track;

  const body = (
    <span className="toggle-item__body">
      <span className="toggle-item__text" id={`${baseId}-label`}>{label}</span>
      {description && <span className="toggle-item__description" id={`${baseId}-desc`}>{description}</span>}
    </span>
  );
  return (
    <label
      className={[
        "toggle-item",
        size === "md" && "toggle-item--md",
        labelPosition === "start" && "toggle-item--start",
        disabled && "is-disabled",
        className,
      ].filter(Boolean).join(" ")}
      // a <label> forwards clicks on its text to the <button> inside, so the text flips it too
    >
      {labelPosition === "start" ? <>{body}{track}</> : <>{track}{body}</>}
    </label>
  );
});

/* ───────────── State gallery ───────────── */

/** Both sizes, with and without label, every state. Hover and focus are live. */
export function ToggleStates() {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  const noop = () => {};
  const rows: { name: string; checked: boolean; disabled?: boolean }[] = [
    { name: "Off", checked: false },
    { name: "On", checked: true },
    { name: "Disabled off", checked: false, disabled: true },
    { name: "Disabled on", checked: true, disabled: true },
  ];
  return (
    <div style={{ display: "grid", gap: 32, fontFamily: "Inter, sans-serif" }}>
      {(["sm", "md"] as const).map((s) => (
        <section key={s}>
          <h4 style={{ margin: "0 0 12px" }}>size {s}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px 32px", alignItems: "start" }}>
            {rows.map((r) => (
              <React.Fragment key={r.name}>
                <Toggle size={s} checked={r.checked} disabled={r.disabled} onChange={noop} aria-label={`${r.name} (no label)`} />
                <Toggle size={s} checked={r.checked} disabled={r.disabled} onChange={noop} label={r.name} />
              </React.Fragment>
            ))}
          </div>
        </section>
      ))}
      <section style={{ display: "grid", gap: 16, maxWidth: 420 }}>
        <h4 style={{ margin: 0 }}>Interactive</h4>
        <Toggle checked={a} onChange={setA} label="Send reminders" description="Emails reviewers 3 days before the due date." />
        <Toggle size="md" checked={b} onChange={setB} labelPosition="start" label="Show scores to reviewees" />
      </section>
    </div>
  );
}

export default Toggle;
