/**
 * Radio: pick one option from a short list, with or without labels
 * ================================================================
 *
 * For 2–5 mutually exclusive options that people should see at once (Review schedule:
 * One-time / Recurring). More than 5 options → ../select-field/SelectField.tsx.
 * A single on / off choice → ../checkbox or ../toggle, never one radio.
 *
 *   Review schedule                               ← group label (FormField label / legend)
 *   ◉ One-time                                    ← 16px circle, 8px gap, 16/500 #101828
 *   ○ Recurring
 *     Repeats every quarter.                      ← optional description 14/400 #667085
 *
 * This file is the spec and a typed React reference. In the prototype it is `input.radio` inside
 * `label.choice-item`, grouped by `.choice-list` (src/styles/16-reviewers-setup.css).
 * If you change a value here, change it in the CSS too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   fieldset.choice-group / role="radiogroup"   aria-labelledby the question
 *   ├ legend.field__label                       the question (14/600 #101828), 8px above the list
 *   └ .choice-list                              flex column (or row with --inline), 12px gap
 *     └ label.choice-item                       inline-flex, 8px gap, align top
 *       ├ input.radio[type=radio]               the circle; the dot is a thick border
 *       └ span.choice-item__body
 *         ├ span.choice-item__text              option label
 *         └ span.choice-item__description       optional supporting text, 2px below
 *
 *   Without labels (e.g. picking a row in a table, or a rating scale with column headers):
 *   the radio stands alone and needs aria-label ("Select Annual template").
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZES
 * ─────────────────────────────────────────────────────────────────────────────
 *   Size   Circle  Border off  Border on (dot)   Label     Description  Use for
 *   ─────  ──────  ──────────  ────────────────  ────────  ───────────  ───────────────────────
 *   sm     16px    1px         5px → 6px dot     14 / 500  12 / 400     Dense lists, tables
 *   md     20px    1px         6px → 8px dot     16 / 500  14 / 400     Forms and settings (default)
 *
 *   The prototype's current `input.radio` is the 16px circle with 16px labels; new screens
 *   should pair sizes as above. Label colour #101828, description #667085, line height 1.4.
 *   Horizontal groups (--inline) use 24px between options.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State                 Fill      Border / dot   Notes
 *   ────────────────────  ────────  ─────────────  ────────────────────────────────────────
 *   Unselected            #FFFFFF   #D0D5DD
 *   Unselected hover      #FFFFFF   #98A2B3        Hovering the label counts too
 *   Selected              #FFFFFF   #2970FF        White centre = the dot
 *   Selected hover        #FFFFFF   #155EEF
 *   Focus (keyboard)      —         —              2px #2970FF outline, 2px offset
 *   Disabled unselected   #F2F4F7   #D0D5DD        Label #98A2B3
 *   Disabled selected     #F2F4F7   #D0D5DD        Thick #D0D5DD border keeps the dot visible
 *   Error                 #FFFFFF   #DC2626        Nothing picked on submit; message under the group
 *   Border / colour transition 120ms.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - Native <input type="radio"> with a shared `name`. Tab moves into the group (to the selected
 *     option, or the first); ↑ / ↓ / ← / → move and select; Space selects.
 *   - Always pre-select the recommended / most common option unless choosing nothing is valid.
 *   - Options that reveal more settings show them indented under the option
 *     (.sub-settings: 2px #EAECF0 left rule, 15px in).
 *   - Don't disable a whole group to explain a rule; show why with a tooltip on the label.
 */

import * as React from "react";

/* ───────────── Tokens (keep in sync with the CSS) ───────────── */

export const RADIO_TOKENS = {
  gap: 8,
  bodyGap: 2,
  listGap: 12,
  inlineGap: 24,
  size: {
    sm: { circle: 16, border: 1, borderOn: 5, label: 14, description: 12 },
    md: { circle: 20, border: 1, borderOn: 6, label: 16, description: 14 },
  },
  label: { weight: 500, lineHeight: 1.4, color: "#101828", disabledColor: "#98A2B3" },
  description: { weight: 400, lineHeight: 1.4, color: "#667085" },
  state: {
    unselected:      { bg: "#FFFFFF", border: "#D0D5DD" },
    unselectedHover: { bg: "#FFFFFF", border: "#98A2B3" },
    selected:        { bg: "#FFFFFF", border: "#2970FF" },
    selectedHover:   { bg: "#FFFFFF", border: "#155EEF" },
    disabled:        { bg: "#F2F4F7", border: "#D0D5DD" },
    error:           { bg: "#FFFFFF", border: "#DC2626" },
    focus:           { outline: "2px solid #2970FF", outlineOffset: 2 },
  },
  transitionMs: 120,
} as const;

export type RadioSize = keyof typeof RADIO_TOKENS.size;

/* ───────────── Radio (single option) ───────────── */

interface RadioBase extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  size?: RadioSize;
  invalid?: boolean;
}
interface RadioWithLabel extends RadioBase {
  label: React.ReactNode;
  description?: React.ReactNode;
}
interface RadioWithoutLabel extends RadioBase {
  label?: undefined;
  description?: undefined;
  "aria-label": string;
}
export type RadioProps = RadioWithLabel | RadioWithoutLabel;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { size = "md", invalid, label, description, className, disabled, ...rest },
  ref,
) {
  const circle = (
    <input
      ref={ref}
      type="radio"
      className={["radio", size === "md" && "radio--md", invalid && "is-invalid", !label && className].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
  if (!label) return circle;
  return (
    <label className={["choice-item", size === "sm" && "choice-item--sm", disabled && "is-disabled", className].filter(Boolean).join(" ")}>
      {circle}
      <span className="choice-item__body">
        <span className="choice-item__text">{label}</span>
        {description && <span className="choice-item__description">{description}</span>}
      </span>
    </label>
  );
});

/* ───────────── RadioGroup ───────────── */

export interface RadioOption<V extends string = string> {
  value: V;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps<V extends string = string> {
  name: string;
  /** The question. Rendered as the legend. Leave out only if labelled elsewhere (then pass aria-label). */
  label?: React.ReactNode;
  "aria-label"?: string;
  options: RadioOption<V>[];
  value: V | null;
  onChange: (value: V) => void;
  size?: RadioSize;
  /** Options in a row instead of a column. */
  inline?: boolean;
  error?: React.ReactNode;
  disabled?: boolean;
}

export function RadioGroup<V extends string>({
  name,
  label,
  "aria-label": ariaLabel,
  options,
  value,
  onChange,
  size = "md",
  inline,
  error,
  disabled,
}: RadioGroupProps<V>) {
  const errId = error ? `${name}-error` : undefined;
  return (
    <fieldset className="choice-group" role="radiogroup" aria-label={label ? undefined : ariaLabel} aria-describedby={errId} disabled={disabled}>
      {label && <legend className="field__label">{label}</legend>}
      <div className={`choice-list${inline ? " choice-list--inline" : ""}`}>
        {options.map((o) => (
          <Radio
            key={o.value}
            name={name}
            value={o.value}
            size={size}
            label={o.label}
            description={o.description}
            disabled={o.disabled}
            invalid={!!error}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
        ))}
      </div>
      {error && <p className="field__error" id={errId} role="alert">{error}</p>}
    </fieldset>
  );
}

/* ───────────── State gallery ───────────── */

/** Both sizes, with and without labels, every state. Hover and focus are live. */
export function RadioStates() {
  const [schedule, setSchedule] = React.useState<"one" | "rec">("one");
  const [pick, setPick] = React.useState<"a" | "b" | null>(null);
  return (
    <div style={{ display: "grid", gap: 32, fontFamily: "Inter, sans-serif" }}>
      {(["md", "sm"] as const).map((s) => (
        <section key={s}>
          <h4 style={{ margin: "0 0 12px" }}>size {s}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px 32px", alignItems: "start" }}>
            <Radio size={s} name={`u-${s}`} aria-label="Unselected (no label)" />
            <Radio size={s} name={`u2-${s}`} label="Unselected" />
            <Radio size={s} name={`c-${s}`} aria-label="Selected (no label)" defaultChecked />
            <Radio size={s} name={`c2-${s}`} label="Selected" defaultChecked />
            <Radio size={s} name={`d-${s}`} aria-label="Disabled (no label)" disabled />
            <Radio size={s} name={`d2-${s}`} label="Disabled" disabled />
            <Radio size={s} name={`dc-${s}`} aria-label="Disabled selected (no label)" disabled defaultChecked />
            <Radio size={s} name={`dc2-${s}`} label="Disabled selected" disabled defaultChecked />
            <Radio size={s} name={`e-${s}`} aria-label="Error (no label)" invalid />
            <Radio size={s} name={`e2-${s}`} label="Error" invalid />
          </div>
        </section>
      ))}
      <RadioGroup
        name="schedule"
        label="Review schedule"
        value={schedule}
        onChange={setSchedule}
        options={[
          { value: "one", label: "One-time" },
          { value: "rec", label: "Recurring", description: "Repeats every quarter." },
        ]}
      />
      <RadioGroup
        name="inline-pick"
        label="Inline group with error"
        inline
        value={pick}
        onChange={setPick}
        error="Pick one."
        options={[
          { value: "a", label: "Manager" },
          { value: "b", label: "Peer" },
        ]}
      />
    </div>
  );
}

export default Radio;
