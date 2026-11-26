/**
 * InputField: single-line text input with label, hint and error
 * ==============================================================
 *
 * The standard text field (cycle name, section title, email, numbers without a stepper).
 * Also exports `FormField`, the label / hint / error wrapper reused by SelectField,
 * NumberStepper and any other control that sits under a question.
 *
 *   Cycle name *                                 ← label 14/600 #101828, 8px above the control
 *   ┌──────────────────────────────────────────┐
 *   │ Q4 2026 performance review               │ ← 44px, 1px #D0D5DD, 8px radius, 12px sides
 *   └──────────────────────────────────────────┘
 *   Shown to reviewers in emails.                ← hint 14/400 #667085, 6px below
 *
 * This file is the spec and a typed React reference. The prototype is plain JS: the field is
 * `.field` > `.field__label` + `.input` (src/styles/15-focused-editor.css, 16-reviewers-setup.css,
 * 22-section-rows.css). If you change a value here, change it in the CSS too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .field                      flex column, 8px gap, full width
 *   ├ label.field__label        Inter 14/600, line height 1.4, -0.28px tracking, #101828
 *   │ └ .required-mark          "*" 2px after the text, same colour (required fields only)
 *   ├ .input-wrap               the control box (only needed with a leading / trailing icon)
 *   │ ├ .input__icon            optional 20px icon, #667085, 12px in, 8px before the text
 *   │ ├ input.input             the text
 *   │ └ .input__suffix          optional unit ("%", "days"), 16/400 #667085, 12px in
 *   ├ p.field__hint             optional help text: Inter 14/400, line height 1.4, #667085
 *   └ p.field__error            error text (replaces the hint): Inter 14/400, #DC2626, role="alert"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZES
 * ─────────────────────────────────────────────────────────────────────────────
 *   Size   Height  Padding (sides)  Text      Use for
 *   ─────  ──────  ───────────────  ────────  ─────────────────────────────────────────────
 *   sm     36px    12px             14 / 400  Table cells (reviewer table, inline edits)
 *   md     40px    12px             14 / 400  Panels, dialogs, filters
 *   lg     44px    12px             16 / 400  Page forms, editor fields (default)
 *
 *   Heights include the 1px border. Radius 8px in every size. Width fills the container unless
 *   the value is short (numbers, dates): then size it to the content (80–160px).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State        Background  Border    Text      Notes
 *   ───────────  ──────────  ────────  ────────  ──────────────────────────────────────────
 *   Empty        #FFFFFF     #D0D5DD   #98A2B3   Placeholder "e.g. <example>" (see PLACEHOLDER TEXT)
 *   Filled       #FFFFFF     #D0D5DD   #101828
 *   Hover        #FFFFFF     #98A2B3   —         Not applied while focused or disabled
 *   Focus        #FFFFFF     #2970FF   —         Clicked / tapped: border only. From the keyboard:
 *                                                + 0 0 0 4px rgba(41,112,255,.16) ring. No outline (see FOCUS)
 *   Error        #FFFFFF     #DC2626   —         Keyboard focus ring turns 0 0 0 4px rgba(220,38,38,.16).
 *                                                aria-invalid="true", message in .field__error
 *   Disabled     #F9FAFB     #D0D5DD   #98A2B3   cursor not-allowed, no hover
 *   Read-only    #F9FAFB     #EAECF0   #344054   Selectable text, no focus ring
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FOCUS (every field: input, textarea, select, multi-select, date range, stepper)
 * ─────────────────────────────────────────────────────────────────────────────
 *   How focus arrived    Border    Ring
 *   ───────────────────  ────────  ──────────────────────────────────────────────────────
 *   Click / tap / open   #2970FF   none
 *   Keyboard (Tab)       #2970FF   0 0 0 4px rgba(41,112,255,.16)
 *   Error, click / tap   #DC2626   none
 *   Error, keyboard      #DC2626   0 0 0 4px rgba(220,38,38,.16)
 *
 *   - The ring tells keyboard users where they are. Mouse and touch users already know, so
 *     they get the blue border only.
 *   - A clicked text input always matches :focus-visible, so CSS alone can't tell click from
 *     Tab. The prototype tracks it on the page: Tab adds `html.is-keyboard`, any pointer press
 *     removes it, and every ring rule needs that class.
 *   - Search bars are the exception: blue border only, never a ring (../search-bar).
 *   - Prototype: src/styles/22-section-rows.css ("Focus, every field"), the listener in
 *     public/js/layers/14-reviewee-reviewers.js. Older .inp / .finp fields: src/styles/01-base.css.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER TEXT
 * ─────────────────────────────────────────────────────────────────────────────
 *   A normal input field's placeholder is a realistic example value, written as "e.g. <example>".
 *   Lowercase "e.g." with both dots, one space, then the example in sentence case, no full stop.
 *
 *     Do:     placeholder="e.g. Q4 2026 performance review"
 *     Do:     placeholder="e.g. Quarterly field crew check-in"
 *     Don't:  placeholder="Enter cycle name"     ← repeats the label, tells the user nothing new
 *     Don't:  placeholder="Cycle name"           ← the label again
 *     Don't:  placeholder="Eg: Q4 review."       ← wrong form of "e.g.", stray colon and full stop
 *
 *   - The placeholder is never the only label: it disappears on typing. Keep the <label>.
 *   - Never put instructions or rules in the placeholder ("Max 100 characters"). Use the hint.
 *   - Exceptions (no "e.g."):
 *       · Search fields use "Search <things>" (see ../search-bar).
 *       · Formatted values whose shape is the point show the format itself: "name@company.com",
 *         "(555) 555-0142".
 *       · Textareas may use a short prompt ("Shown under the question").
 *       · Select fields (single and multi) use just "Select" (see ../select-field).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - Every input has a visible label (<label for>). Without one (table cells), pass
 *     `aria-label`, e.g. the column name + row name.
 *   - Hint and error are linked with aria-describedby. Only one shows at a time; error wins.
 *   - Validate on blur or on submit, not on every keystroke. Clear the error once the value is valid.
 *   - Required: show "*" after the label and set `required`. Don't mark optional fields.
 *   - Dates are never <input type="date">: use the datepicker (../datepicker) and MM/DD/YYYY.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE (prototype, plain HTML)
 * ─────────────────────────────────────────────────────────────────────────────
 *   <div class="field">
 *     <label class="field__label" for="cyc-name">Cycle name<span class="required-mark">*</span></label>
 *     <input id="cyc-name" class="input" placeholder="e.g. Q4 2026 performance review" aria-describedby="cyc-name-hint">
 *     <p class="field__hint" id="cyc-name-hint">Shown to reviewers in emails.</p>
 *   </div>
 */

import * as React from "react";

/* ───────────── Tokens (keep in sync with the CSS) ───────────── */

export const FIELD_TOKENS = {
  gap: 8,
  messageGap: 6,
  label: { size: 14, weight: 600, lineHeight: 1.4, letterSpacing: -0.28, color: "#101828" },
  hint: { size: 14, weight: 400, lineHeight: 1.4, color: "#667085" },
  error: { size: 14, weight: 400, lineHeight: 1.4, color: "#DC2626" },
} as const;

export const INPUT_TOKENS = {
  radius: 8,
  iconSize: 20,
  iconGap: 8,
  size: {
    sm: { height: 36, paddingX: 12, fontSize: 14 },
    md: { height: 40, paddingX: 12, fontSize: 14 },
    lg: { height: 44, paddingX: 12, fontSize: 16 },
  },
  font: { family: "Inter", weight: 400 },
  state: {
    default:  { bg: "#FFFFFF", border: "#D0D5DD", color: "#101828", placeholder: "#98A2B3", icon: "#667085" },
    hover:    { border: "#98A2B3" },
    focus:    { border: "#2970FF", ring: "0 0 0 4px rgba(41,112,255,.16)" },
    error:    { border: "#DC2626", ring: "0 0 0 4px rgba(220,38,38,.16)" },
    disabled: { bg: "#F9FAFB", border: "#D0D5DD", color: "#98A2B3" },
    readOnly: { bg: "#F9FAFB", border: "#EAECF0", color: "#344054" },
  },
} as const;

export type InputSize = keyof typeof INPUT_TOKENS.size;

/* ───────────── FormField (label + control + hint / error) ───────────── */

export interface FormFieldProps {
  /** id of the control, so the label can point at it. */
  id: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Replaces the hint and marks the field invalid. */
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  /** Receives the ids to put on the control's aria-describedby. */
  children: (describedBy: string | undefined) => React.ReactNode;
}

export function FormField({ id, label, hint, error, required, className, children }: FormFieldProps) {
  const msgId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={`field${className ? ` ${className}` : ""}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
      )}
      {children(msgId)}
      {error ? (
        <p className="field__error" id={msgId} role="alert">{error}</p>
      ) : hint ? (
        <p className="field__hint" id={msgId}>{hint}</p>
      ) : null}
    </div>
  );
}

/* ───────────── InputField ───────────── */

export interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  id: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** Default "lg" (44px). */
  size?: InputSize;
  /** 20px icon before the text (mail, link, user). */
  iconLeading?: React.ReactNode;
  /** Unit after the text ("%", "days"). */
  suffix?: React.ReactNode;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { id, label, hint, error, size = "lg", iconLeading, suffix, required, className, type = "text", ...rest },
  ref,
) {
  return (
    <FormField id={id} label={label} hint={hint} error={error} required={required} className={className}>
      {(describedBy) => {
        const input = (
          <input
            ref={ref}
            id={id}
            type={type}
            className={`input${size !== "lg" ? ` input--${size}` : ""}${error ? " is-invalid" : ""}`}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...rest}
          />
        );
        if (!iconLeading && !suffix) return input;
        return (
          <div className={`input-wrap${size !== "lg" ? ` input-wrap--${size}` : ""}`}>
            {iconLeading && <span className="input__icon" aria-hidden="true">{iconLeading}</span>}
            {input}
            {suffix && <span className="input__suffix">{suffix}</span>}
          </div>
        );
      }}
    </FormField>
  );
});

/* ───────────── State gallery ───────────── */

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.667 5.833 8.47 10.6c.55.385.826.578 1.126.652.265.066.542.066.807 0 .3-.074.575-.267 1.126-.652l6.804-4.767M5.667 16.667h8.666c1.4 0 2.1 0 2.635-.273a2.5 2.5 0 0 0 1.093-1.092c.272-.535.272-1.235.272-2.635V7.333c0-1.4 0-2.1-.272-2.635a2.5 2.5 0 0 0-1.093-1.092c-.535-.273-1.235-.273-2.635-.273H5.667c-1.4 0-2.1 0-2.635.273a2.5 2.5 0 0 0-1.093 1.092c-.272.535-.272 1.235-.272 2.635v5.334c0 1.4 0 2.1.272 2.635a2.5 2.5 0 0 0 1.093 1.092c.535.273 1.235.273 2.635.273Z" />
  </svg>
);

/** Every size and state, for review and visual QA. Hover and focus are live. */
export function InputFieldStates() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 480, fontFamily: "Inter, sans-serif" }}>
      <InputField id="s-empty" label="Empty" placeholder="e.g. Q4 2026 performance review" />
      <InputField id="s-filled" label="Filled, required, with hint" required defaultValue="Q4 2026 performance review" hint="Shown to reviewers in emails." />
      <InputField id="s-icon" label="Leading icon" iconLeading={<MailIcon />} placeholder="name@company.com" />
      <InputField id="s-suffix" label="Suffix" defaultValue="30" suffix="days" />
      <InputField id="s-error" label="Error" defaultValue="Q4" error="Use at least 3 characters." />
      <InputField id="s-disabled" label="Disabled" defaultValue="Locked after publishing" disabled />
      <InputField id="s-readonly" label="Read-only" defaultValue="CYC-2026-04" readOnly />
      <InputField id="s-md" label="Size md (40px)" size="md" placeholder="Panel field" />
      <InputField id="s-sm" aria-label="Size sm (36px), no visible label" size="sm" placeholder="Table cell" />
    </div>
  );
}

export default InputField;
