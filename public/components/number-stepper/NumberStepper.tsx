/**
 * NumberStepper: number input with increase / decrease buttons
 * ============================================================
 *
 * A short number field with two stacked arrow buttons inside its right edge. Used for counts and
 * amounts people usually nudge by one: peer reviewer count, due-date days, weightage %.
 *
 *   ┌──────────┬──┐
 *   │ 3        │▲ │   ← buttons: 26px wide, inset 4px, 2px apart, #F2F4F7, 4px radius
 *   │          │▼ │     shown on hover / focus only
 *   └──────────┴──┘
 *    72px wide (88px "fluid"), same height as InputField
 *
 * This file is the spec and a typed React reference. In the prototype it is
 * `.number-stepper` > `input.input.input--number` + `.number-stepper__buttons`
 * (src/styles/16-reviewers-setup.css). If you change a value here, change it in the CSS too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .number-stepper                       position: relative; 72px (or 88px with --fluid)
 *   ├ input.input.input--number           type="number" with the native spinner hidden,
 *   │                                      36px right padding so digits clear the buttons
 *   ├ .input__suffix (optional)           unit such as "%", placed before the buttons
 *   └ .number-stepper__buttons            absolute: top / right / bottom 4px, 26px wide,
 *     │                                    flex column, 2px gap
 *     ├ button (increase)                 12px chevron pointing up
 *     └ button (decrease)                 12px chevron pointing down
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZES
 * ─────────────────────────────────────────────────────────────────────────────
 *   Size   Height  Each button  Text      Width
 *   ─────  ──────  ───────────  ────────  ──────────────────────────────
 *   sm     36px    26 × 13px    14 / 400  72px  (reviewer table cells)
 *   md     40px    26 × 15px    15 / 400  80px
 *   lg     44px    26 × 17px    16 / 400  88px  (page forms, default)
 *
 *   Button height = (field height − 8px inset − 2px gap) ÷ 2. Widen the field for values with
 *   more than 3 digits or a suffix.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   Field: same as InputField (#D0D5DD border, #98A2B3 hover, #DC2626 error, #F9FAFB / #98A2B3
 *   disabled), except focus:
 *
 *   Focus source         Border    Ring
 *   ───────────────────  ────────  ──────────────────────────────────────────────────────
 *   Click / tap          #2970FF   none
 *   Keyboard (Tab)       #2970FF   0 0 0 4px rgba(41,112,255,.16)
 *   Error, click / tap   #DC2626   none
 *   Error, keyboard      #DC2626   0 0 0 4px rgba(220,38,38,.16)
 *
 *   Same rule as every field (FOCUS in ../input-field/InputField.tsx). Clicking a stepper
 *   button keeps focus in the input without adding the ring. Applies to every stepper:
 *   .number-stepper and the weightage .percent-input.
 *
 *   Buttons
 *   State           Background  Icon      Notes
 *   ──────────────  ──────────  ────────  ──────────────────────────────────────────────
 *   Hidden          —           —         Field not hovered or focused (keeps tables calm)
 *   Default         #F2F4F7     #667085   Field hovered or focus-within: fade in over 120ms
 *   Hover           #EAECF0     #344054
 *   Pressed         #D0D5DD     #344054
 *   At the limit    #F2F4F7     #D0D5DD   Increase at max / decrease at min: disabled
 *   Field disabled  —           —         Buttons stay hidden
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - Click a button: value ± step, clamped to min / max. Holding it repeats after 400ms,
 *     then every 80ms.
 *   - Keyboard (in the input): ↑ / ↓ ± step, Page Up / Page Down ± 10 × step,
 *     Home / End jump to min / max.
 *   - Typing is allowed; on blur, clamp to min / max and round to the step. Empty → min
 *     (or keep empty if the field is optional).
 *   - Buttons have tabindex="-1" (the input already handles the keys) but keep aria-labels
 *     ("Increase", "Decrease") for pointer and touch users.
 *   - The input has role="spinbutton" semantics from type="number"; set min, max and step.
 *   - Label it like any field (FormField). In a table, aria-label = column + row name.
 */

import * as React from "react";
import { FormField, type InputSize } from "../input-field/InputField";

/* ───────────── Tokens (keep in sync with the CSS) ───────────── */

export const NUMBER_STEPPER_TOKENS = {
  width: { sm: 72, md: 80, lg: 88 },
  height: { sm: 36, md: 40, lg: 44 },
  fontSize: { sm: 14, md: 15, lg: 16 },
  inputPaddingRight: 36,
  buttons: {
    inset: 4,
    width: 26,
    gap: 2,
    radius: 4,
    iconSize: 12,
    fadeMs: 120,
    state: {
      default:  { bg: "#F2F4F7", icon: "#667085" },
      hover:    { bg: "#EAECF0", icon: "#344054" },
      pressed:  { bg: "#D0D5DD", icon: "#344054" },
      disabled: { bg: "#F2F4F7", icon: "#D0D5DD" },
    },
  },
  repeat: { delayMs: 400, intervalMs: 80 },
} as const;

/* ───────────── NumberStepper ───────────── */

export interface NumberStepperProps {
  id: string;
  value: number | "";
  onChange: (value: number | "") => void;
  min?: number;
  max?: number;
  step?: number;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  size?: InputSize;
  /** Unit after the number, e.g. "%". */
  suffix?: string;
  /** Used when there's no visible label. */
  "aria-label"?: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function NumberStepper({
  id,
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  label,
  hint,
  error,
  required,
  disabled,
  size = "lg",
  suffix,
  "aria-label": ariaLabel,
}: NumberStepperProps) {
  const current = value === "" ? min : value;
  const nudge = (dir: 1 | -1) => onChange(clamp(current + dir * step, min, max));

  // press-and-hold repeat
  const timer = React.useRef<number>();
  const stop = () => window.clearTimeout(timer.current);
  const hold = (dir: 1 | -1) => {
    nudge(dir);
    const tick = (delay: number) => {
      timer.current = window.setTimeout(() => {
        nudge(dir);
        tick(NUMBER_STEPPER_TOKENS.repeat.intervalMs);
      }, delay);
    };
    tick(NUMBER_STEPPER_TOKENS.repeat.delayMs);
  };
  React.useEffect(() => stop, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "PageUp") { e.preventDefault(); onChange(clamp(current + 10 * step, min, max)); }
    if (e.key === "PageDown") { e.preventDefault(); onChange(clamp(current - 10 * step, min, max)); }
    if (e.key === "Home") { e.preventDefault(); onChange(min); }
    if (e.key === "End" && max !== Number.MAX_SAFE_INTEGER) { e.preventDefault(); onChange(max); }
  };
  const onBlur = () => {
    if (value === "") return;
    onChange(clamp(Math.round(value / step) * step, min, max));
  };

  return (
    <FormField id={id} label={label} hint={hint} error={error} required={required}>
      {(describedBy) => (
        <div className={`number-stepper number-stepper--${size}`}>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            className={`input input--number${size !== "lg" ? ` input--${size}` : ""}${error ? " is-invalid" : ""}`}
            value={value}
            min={min}
            max={max === Number.MAX_SAFE_INTEGER ? undefined : max}
            step={step}
            disabled={disabled}
            required={required}
            aria-label={ariaLabel}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
          />
          {suffix && <span className="input__suffix">{suffix}</span>}
          <div className="number-stepper__buttons">
            <button
              type="button"
              tabIndex={-1}
              aria-label="Increase"
              disabled={disabled || current >= max}
              onPointerDown={() => hold(1)}
              onPointerUp={stop}
              onPointerLeave={stop}
            >
              <img className="up" src="/assets/chevron-down.svg" alt="" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Decrease"
              disabled={disabled || current <= min}
              onPointerDown={() => hold(-1)}
              onPointerUp={stop}
              onPointerLeave={stop}
            >
              <img src="/assets/chevron-down.svg" alt="" />
            </button>
          </div>
        </div>
      )}
    </FormField>
  );
}

/* ───────────── State gallery ───────────── */

/** Every size and state, for review and visual QA. Hover a field to see its buttons. */
export function NumberStepperStates() {
  const [a, setA] = React.useState<number | "">(3);
  const [b, setB] = React.useState<number | "">(25);
  const [c, setC] = React.useState<number | "">(10);
  return (
    <div style={{ display: "grid", gap: 24, fontFamily: "Inter, sans-serif" }}>
      <NumberStepper id="ns-lg" label="Number of peer reviewers" value={a} onChange={setA} min={1} max={10} hint="1 to 10." />
      <NumberStepper id="ns-pct" label="Weightage (suffix)" value={b} onChange={setB} min={0} max={100} step={5} suffix="%" />
      <NumberStepper id="ns-sm" aria-label="Due in days (table cell, sm)" size="sm" value={c} onChange={setC} min={1} />
      <NumberStepper id="ns-max" label="At max (increase disabled)" value={10} onChange={() => {}} max={10} />
      <NumberStepper id="ns-err" label="Error" value={0} onChange={() => {}} error="Add at least 1 reviewer." />
      <NumberStepper id="ns-dis" label="Disabled" value={2} onChange={() => {}} disabled />
    </div>
  );
}

export default NumberStepper;
