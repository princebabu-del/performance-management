/**
 * Checkbox: on / off / mixed, with or without a label
 * ===================================================
 *
 * For picking any number of items from a list, agreeing to something, or turning on an option
 * that takes effect when the form is saved. For a setting that applies right away, use
 * ../toggle/Toggle.tsx. For one choice out of several, use ../radio/Radio.tsx.
 *
 *   ☐ Allow self-evaluation                        ← with label: 20px box, 8px gap, 16/500 #101828
 *   ☑ Anonymous peer feedback
 *     Reviewees won't see who wrote it.            ← optional description 14/400 #667085
 *   ☐                                              ← without label (table rows, select-all):
 *                                                    aria-label required
 *
 * This file is the spec and a typed React reference. In the prototype it is `input.checkbox`
 * (+ `.checkbox.sm`) inside `label.choice-item` (src/styles/16-reviewers-setup.css,
 * 22-section-rows.css). If you change a value here, change it in the CSS too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   Without label
 *   input.checkbox[type=checkbox]            appearance none, the box itself, aria-label required
 *
 *   With label
 *   label.choice-item                        inline-flex, 8px gap, align top, pointer
 *   ├ input.checkbox                         1px top margin so the box centres on the first line
 *   └ span.choice-item__body                 flex column, 2px gap
 *     ├ span.choice-item__text               the label
 *     └ span.choice-item__description        optional supporting text
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZES
 * ─────────────────────────────────────────────────────────────────────────────
 *   Size   Box    Border  Radius  Check icon  Label     Description  Use for
 *   ─────  ─────  ──────  ──────  ──────────  ────────  ───────────  ──────────────────────────
 *   sm     16px   1px     4px     12px        14 / 500  12 / 400     Tables, dropdown options, dense lists
 *   md     20px   1.5px   6px     14px        16 / 500  14 / 400     Forms and settings (default)
 *
 *   Label line height 1.4, colour #101828. Description colour #667085.
 *   Lists of checkboxes stack with 12px between items (.choice-list).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   State                   Fill      Border    Mark            Notes
 *   ──────────────────────  ────────  ────────  ──────────────  ─────────────────────────────────
 *   Unchecked               #FFFFFF   #D0D5DD   —
 *   Unchecked hover         #FFFFFF   #98A2B3   —               Hovering the label counts too
 *   Checked                 #2970FF   #2970FF   white check
 *   Checked hover           #155EEF   #155EEF   white check
 *   Indeterminate           #2970FF   #2970FF   white dash      Select-all when some rows are picked.
 *                                                               aria-checked="mixed"; click → all on
 *   Focus (keyboard)        —         —         —               2px #2970FF outline, 2px offset
 *   Disabled unchecked      #F2F4F7   #D0D5DD   —               Not faded; label #98A2B3
 *   Disabled checked        #F2F4F7   #D0D5DD   #D0D5DD check   Label #98A2B3
 *   Error                   #FFFFFF   #DC2626   —               Required consent not ticked; message under it
 *   Fill / border transition 120ms. Check: 2px stroke, round caps.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - A real <input type="checkbox">; Space toggles it. The whole label is the click target.
 *   - Without a visible label, `aria-label` is required ("Select Jordan Lee", "Select all rows").
 *   - Indeterminate is set from code (`el.indeterminate = true`), never by a click.
 *   - A group of checkboxes under a question: wrap in <fieldset> with the question as <legend>
 *     (or role="group" + aria-labelledby).
 *   - Label in sentence case, written as the positive ("Send reminders", not "Don't send reminders").
 *   - If a disabled checkbox needs a reason, put a tooltip (data-tip) on the label.
 */

import * as React from "react";

/* ───────────── Tokens (keep in sync with the CSS) ───────────── */

export const CHECKBOX_TOKENS = {
  gap: 8,
  bodyGap: 2,
  listGap: 12,
  size: {
    sm: { box: 16, border: 1, radius: 4, check: 12, label: 14, description: 12 },
    md: { box: 20, border: 1.5, radius: 6, check: 14, label: 16, description: 14 },
  },
  label: { weight: 500, lineHeight: 1.4, color: "#101828", disabledColor: "#98A2B3" },
  description: { weight: 400, lineHeight: 1.4, color: "#667085" },
  state: {
    unchecked:        { bg: "#FFFFFF", border: "#D0D5DD" },
    uncheckedHover:   { bg: "#FFFFFF", border: "#98A2B3" },
    checked:          { bg: "#2970FF", border: "#2970FF", mark: "#FFFFFF" },
    checkedHover:     { bg: "#155EEF", border: "#155EEF", mark: "#FFFFFF" },
    disabled:         { bg: "#F2F4F7", border: "#D0D5DD", mark: "#D0D5DD" },
    error:            { bg: "#FFFFFF", border: "#DC2626" },
    focus:            { outline: "2px solid #2970FF", outlineOffset: 2 },
  },
  transitionMs: 120,
} as const;

/* ───────────── Types ───────────── */

interface CheckboxBase extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Default "md" (20px). */
  size?: keyof typeof CHECKBOX_TOKENS.size;
  /** Some but not all children are checked (select-all). */
  indeterminate?: boolean;
  invalid?: boolean;
}

/** With a visible label: `label` required, description optional. */
interface CheckboxWithLabel extends CheckboxBase {
  label: React.ReactNode;
  description?: React.ReactNode;
}

/** Without a visible label: `aria-label` required. */
interface CheckboxWithoutLabel extends CheckboxBase {
  label?: undefined;
  description?: undefined;
  "aria-label": string;
}

export type CheckboxProps = CheckboxWithLabel | CheckboxWithoutLabel;

/* ───────────── Checkbox ───────────── */

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size = "md", indeterminate = false, invalid, label, description, className, disabled, ...rest },
  forwardedRef,
) {
  const inner = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(forwardedRef, () => inner.current as HTMLInputElement);
  React.useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const box = (
    <input
      ref={inner}
      type="checkbox"
      className={["checkbox", size === "sm" && "sm", invalid && "is-invalid", !label && className].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-checked={indeterminate ? "mixed" : undefined}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
  if (!label) return box;

  return (
    <label className={["choice-item", size === "sm" && "choice-item--sm", disabled && "is-disabled", className].filter(Boolean).join(" ")}>
      {box}
      <span className="choice-item__body">
        <span className="choice-item__text">{label}</span>
        {description && <span className="choice-item__description">{description}</span>}
      </span>
    </label>
  );
});

/* ───────────── State gallery ───────────── */

/** Both sizes, with and without label, every state. Hover and focus are live. */
export function CheckboxStates() {
  const [on, setOn] = React.useState(true);
  const rows = ["Unchecked", "Checked", "Indeterminate", "Disabled", "Disabled checked", "Error"] as const;
  const props = (r: (typeof rows)[number]) => ({
    defaultChecked: r === "Checked" || r === "Disabled checked",
    indeterminate: r === "Indeterminate",
    disabled: r.startsWith("Disabled"),
    invalid: r === "Error",
  });
  return (
    <div style={{ display: "grid", gap: 32, fontFamily: "Inter, sans-serif" }}>
      {(["md", "sm"] as const).map((s) => (
        <section key={s}>
          <h4 style={{ margin: "0 0 12px" }}>size {s}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px 32px", alignItems: "start" }}>
            {rows.map((r) => (
              <React.Fragment key={r}>
                <Checkbox size={s} aria-label={`${r} (no label)`} {...props(r)} />
                <Checkbox size={s} label={r} {...props(r)} />
              </React.Fragment>
            ))}
          </div>
        </section>
      ))}
      <section>
        <h4 style={{ margin: "0 0 12px" }}>With description (controlled)</h4>
        <Checkbox
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
          label="Anonymous peer feedback"
          description="Reviewees won't see who wrote it."
        />
      </section>
    </div>
  );
}

export default Checkbox;
