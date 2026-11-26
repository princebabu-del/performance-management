/**
 * SelectField: the closed dropdown field (label + trigger + hint / error)
 * =======================================================================
 *
 * The field people click to open a dropdown. This file covers the field only: label, trigger,
 * value, placeholder, chevron, clear button, sizes and states. The menu that opens (options,
 * search, secondary text, scrolling, keyboard) is specified in:
 *   - ../single-select/SingleSelect.tsx   one value
 *   - ../multi-select/MultiSelect.tsx     several values (chips in the field)
 *
 *   Review type *                                ← label 14/600 #101828 (FormField)
 *   ┌──────────────────────────────────────────┐
 *   │ Annual review                        × ⌄ │ ← 44px, 1px #D0D5DD, 8px radius
 *   └──────────────────────────────────────────┘
 *   Decides which questionnaire is used.         ← hint 14/400 #667085
 *
 * This file is the spec and a typed React reference. In the prototype the trigger is
 * `button.select__trigger.input.input--select` rendered by `fcSel()` (public/js/layers/30-single-select.js),
 * styled by src/styles/15-focused-editor.css + 25-single-select.css. Keep the values in sync.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .field                                 FormField from ../input-field/InputField.tsx
 *   ├ label.field__label
 *   ├ .select                              position: relative
 *   │ ├ button.select__trigger             aria-haspopup="listbox", aria-expanded
 *   │ │ ├ .select__icon                    optional 20px leading icon / avatar, 8px gap
 *   │ │ └ span.select__value               value or placeholder, one line, ellipsed
 *   │ ├ button.clearable__button           optional ×, 16px x-circle, 40px from the right
 *   │ └ (chevron)                          20px chevron-down.svg (chevron-up.svg while open), 12px from the right, #667085
 *   └ p.field__hint / p.field__error
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZES (same box as InputField)
 * ─────────────────────────────────────────────────────────────────────────────
 *   Size   Height  Padding left / right   Text      Chevron position
 *   ─────  ──────  ─────────────────────  ────────  ────────────────
 *   sm     36px    12px / 40px            14 / 400  right 12px
 *   md     40px    12px / 40px            14 / 400  right 12px
 *   lg     44px    12px / 40px            16 / 400  right 12px (default)
 *
 *   Right padding keeps the value clear of the chevron; add 24px more when clearable.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State        Background  Border    Text      Notes
 *   ───────────  ──────────  ────────  ────────  ──────────────────────────────────────────
 *   Empty        #FFFFFF     #D0D5DD   #98A2B3   Placeholder "Select" (always just "Select", see PLACEHOLDER)
 *   Filled       #FFFFFF     #D0D5DD   #101828
 *   Hover        #FFFFFF     #98A2B3   —
 *   Open         #FFFFFF     #2970FF   —         aria-expanded="true", chevron flips up (chevron-up.svg). No ring when
 *                                                opened by click; + 4px ring when opened from the keyboard
 *   Focus        #FFFFFF     #2970FF   —         Click: border only. Keyboard: + 0 0 0 4px rgba(41,112,255,.16)
 *                                                (see FOCUS in ../input-field/InputField.tsx)
 *   Error        #FFFFFF     #DC2626   —         aria-invalid="true", message in .field__error
 *   Disabled     #F9FAFB     #D0D5DD   #98A2B3   chevron #D0D5DD, not-allowed, no clear button
 *   Clearable    —           —         —         × shown on hover / focus-within once there's a
 *                                                value. #98A2B3 → #667085 on hover, tooltip "Remove"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER
 * ─────────────────────────────────────────────────────────────────────────────
 *   Every empty select field, single or multi, shows just "Select". Nothing after it.
 *
 *     Do:     "Select"
 *     Don't:  "Select an option", "Select a role", "Select one or more reviewers", "Choose…"
 *
 *   - The label already says what to pick, so the placeholder doesn't repeat it.
 *   - Disabled because it depends on another field? Still "Select". Say why in the hint.
 *   - The search box inside the menu is separate: it keeps "Search" (or "Search <things>").
 *   - Prototype: pass `ph:"Select"` to fcSel(); multi-selects render
 *     <span class="multiselect__placeholder">Select</span>.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - The trigger is a <button>, never a native <select> (the menu needs custom rows).
 *   - Label it with the question (aria-labelledby = label id + value id) so screen readers read
 *     "Review type, Annual review".
 *   - Enter / Space / ↓ open the menu; see SingleSelect for keys inside the menu.
 *   - Clearing returns the field to the placeholder and keeps focus on the trigger.
 */

import * as React from "react";
import { FormField, type InputSize } from "../input-field/InputField";

/* ───────────── Tokens (keep in sync with the CSS) ───────────── */

export const SELECT_FIELD_TOKENS = {
  radius: 8,
  size: {
    sm: { height: 36, paddingLeft: 12, paddingRight: 40, fontSize: 14, chevronRight: 12 },
    md: { height: 40, paddingLeft: 12, paddingRight: 40, fontSize: 14, chevronRight: 12 },
    lg: { height: 44, paddingLeft: 12, paddingRight: 40, fontSize: 16, chevronRight: 12 },
  },
  chevron: { size: 20, color: "#667085", disabledColor: "#D0D5DD" },
  clear: { size: 16, hit: 20, right: 40, color: "#98A2B3", hoverColor: "#667085", extraPadding: 24 },
  state: {
    empty:    { bg: "#FFFFFF", border: "#D0D5DD", color: "#98A2B3" },
    filled:   { bg: "#FFFFFF", border: "#D0D5DD", color: "#101828" },
    hover:    { border: "#98A2B3" },
    open:     { border: "#2970FF" },
    focus:    { border: "#2970FF", ring: "0 0 0 4px rgba(41,112,255,.16)" },
    error:    { border: "#DC2626", ring: "0 0 0 4px rgba(220,38,38,.16)" },
    disabled: { bg: "#F9FAFB", border: "#D0D5DD", color: "#98A2B3" },
  },
} as const;

/* ───────────── SelectField ───────────── */

export interface SelectFieldProps {
  id: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  /** Text of the chosen option. Empty → placeholder. */
  value?: string;
  placeholder?: string;
  size?: InputSize;
  iconLeading?: React.ReactNode;
  open?: boolean;
  disabled?: boolean;
  /** Shows the × once there's a value. */
  clearable?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClear?: () => void;
  /** The menu (SingleSelect / MultiSelect menu), rendered while open. */
  children?: React.ReactNode;
}

export function SelectField({
  id,
  label,
  hint,
  error,
  required,
  value,
  placeholder = "Select",
  size = "lg",
  iconLeading,
  open = false,
  disabled,
  clearable,
  onOpenChange,
  onClear,
  children,
}: SelectFieldProps) {
  const empty = !value;
  const showClear = clearable && !empty && !disabled;
  return (
    <FormField id={id} label={label} hint={hint} error={error} required={required}>
      {(describedBy) => (
        <div className={`select${showClear ? " clearable" : ""}`}>
          <button
            id={id}
            type="button"
            className={[
              "select__trigger input input--select",
              size !== "lg" && `input--${size}`,
              empty && "empty",
              error && "is-invalid",
            ].filter(Boolean).join(" ")}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            onClick={() => onOpenChange?.(!open)}
          >
            {iconLeading && <span className="select__icon" aria-hidden="true">{iconLeading}</span>}
            <span className="select__value">{empty ? placeholder : value}</span>
          </button>
          {showClear && (
            <button type="button" className="clearable__button" aria-label="Remove" data-tip="Remove" data-tip-delay="300" onClick={onClear}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="7" fill="currentColor" />
                <path d="m10 6-4 4m0-4 4 4" stroke="#fff" strokeWidth="1.33" strokeLinecap="round" />
              </svg>
            </button>
          )}
          {open && children}
        </div>
      )}
    </FormField>
  );
}

/* ───────────── State gallery ───────────── */

/** Every size and state of the closed field, for review and visual QA. */
export function SelectFieldStates() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 480, fontFamily: "Inter, sans-serif" }}>
      <SelectField id="sf-empty" label="Empty" />
      <SelectField id="sf-filled" label="Filled, required, with hint" required value="Annual review" hint="Decides which questionnaire is used." />
      <SelectField id="sf-clear" label="Clearable (hover to see ×)" value="Worker" clearable />
      <SelectField id="sf-open" label="Open" value="Worker" open />
      <SelectField id="sf-error" label="Error" error="Pick who is going to be reviewed." />
      <SelectField id="sf-disabled" label="Disabled" value="Quarterly" disabled />
      <SelectField id="sf-md" label="Size md (40px)" size="md" />
      <SelectField id="sf-sm" label="Size sm (36px)" size="sm" value="Start date" />
    </div>
  );
}

export default SelectField;
