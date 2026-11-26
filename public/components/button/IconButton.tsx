/**
 * IconButton: icon-only primary, secondary, tertiary and link buttons (gray and blue)
 * ==================================================================================
 *
 * The square, icon-only versions of ./Button.tsx. Same hierarchy, colours, borders, shadows and
 * focus rings; only the box is square and the label is moved to aria-label + tooltip.
 *
 *   ┌────┐  ┌────┐  ┌────┐    ✎        ✎
 *   │ ＋ │  │ ⋯  │  │ ✎  │   link     link
 *   └────┘  └────┘  └────┘   gray     blue
 *   primary secondary tertiary
 *
 * This file is the spec and a typed React reference. In the prototype today the same looks are
 * written per screen (.cd-iconbtn in 18-cycle-detail-layout.css = secondary lg, .icon-button in
 * 29-questionnaire-editor.css = tertiary sm, the row kebab in 25-listing-pages.css = 40px today, should be tertiary sm).
 * New screens should use the `.lb-icon-btn` class names below. If you change a value here, change
 * it in the CSS too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHEN TO USE
 * ─────────────────────────────────────────────────────────────────────────────
 *   Variant      Use for
 *   ───────────  ──────────────────────────────────────────────────────────────────────────
 *   primary      Rare. A main action in a tight space where the icon is unambiguous (Add)
 *   secondary    Toolbar actions next to secondary buttons / 44px fields (Filters, Columns)
 *   secondary-   Toolbar actions that should stand out from gray neighbours (Assign)
 *     blue
 *   tertiary     Row and card actions: kebab menu, edit, delete, close panel, collapse
 *   tertiary-    Row actions that move the work forward (Assign review cycle in a table row)
 *     blue
 *   link-gray    Inline icons inside text or chips (remove ✕ on a chip, info ⓘ next to a label)
 *   link-blue    Inline icons that act like a link (copy link, open in new tab)
 *
 *   If people might not recognise the icon, use a text button instead.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .lb-icon-btn                    <button type="button" aria-label="…" data-tip="…">
 *   │  .lb-icon-btn--primary | --secondary | --secondary-blue | --tertiary | --tertiary-blue
 *   │    | --link-gray | --link-blue
 *   │  .lb-icon-btn--sm                 (36px; 44px is the default and isn't written out)
 *   └ svg (20px, currentColor, aria-hidden)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZES
 * ─────────────────────────────────────────────────────────────────────────────
 *   Size   Box (primary / secondary / tertiary)   Padding   Icon   Radius   Matches text button
 *   ─────  ─────────────────────────────────────  ────────  ─────  ───────  ───────────────────
 *   sm     36 × 36                                 8px      20px   8px      sm (36px)
 *   lg     44 × 44                                12px      20px   8px      lg (44px, default)
 *
 *   Sizes include the 1px border. Use the same size as the text buttons and fields in the row.
 *   Link icon buttons have no box: the button is exactly the icon (16px for sm, 20px for lg),
 *   with 4px radius for the focus ring.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   Same values as ./Button.tsx (BUTTON_TOKENS.variant), applied to the icon:
 *
 *   Variant     Default (bg / border / icon)         Hover                     Disabled
 *   ──────────  ───────────────────────────────────  ────────────────────────  ─────────────────────────────
 *   primary     #2970FF / #2970FF / #FFFFFF, xs sh.   #155EEF fill + border     #F2F4F7 / #EAECF0 / #98A2B3
 *   secondary   #FFFFFF / #D0D5DD / #344054, xs sh.   #F9FAFB fill, #101828     #FFFFFF / #EAECF0 / #D0D5DD
 *   secondary-  #FFFFFF / #B2CCFF / #2970FF, xs sh.   #F5F8FF fill, #84ADFF     #FFFFFF / #EAECF0 / #D0D5DD
 *     blue                                            border, #155EEF
 *   tertiary    none / none / #475467                  #F2F4F7 fill, #344054     icon #D0D5DD
 *   tertiary-   none / none / #2970FF                  #EFF4FF fill, #155EEF     icon #D0D5DD
 *     blue
 *   link-gray   icon #475467                           icon #344054              icon #98A2B3
 *   link-blue   icon #2970FF                           icon #155EEF              icon #98A2B3
 *
 *   Pressed / open: when the button opens a menu or panel (kebab, filters), keep the hover
 *   background while it's open (aria-expanded="true"). Tertiary open = #EAECF0, tertiary blue
 *   open = #D1E0FF, secondary blue open = #F5F8FF.
 *   Focus: primary / secondary use the 4px ring from Button; tertiary and links use a 2px
 *   #2970FF outline, 2px offset (keyboard only).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - `label` is required. It becomes aria-label and the tooltip text (shared data-tip
 *     tooltip, ../tooltip, pointer at the bottom centre by default).
 *   - Label names the action, not the icon: "Delete question", not "Trash".
 *   - Menus: add aria-haspopup="menu" and aria-expanded.
 *   - Toggles (bookmark, favourite): use aria-pressed and swap to the filled icon when pressed.
 *   - Link icon buttons are small targets; only use them inside text or chips, never on their own
 *     in a toolbar.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE (prototype, plain HTML)
 * ─────────────────────────────────────────────────────────────────────────────
 *   <button type="button" class="lb-icon-btn lb-icon-btn--secondary" aria-label="Filters" data-tip="Filters">${ic("filter")}</button>
 *   <button type="button" class="lb-icon-btn lb-icon-btn--tertiary lb-icon-btn--sm" aria-label="Delete question" data-tip="Delete">${ic("trash")}</button>
 */

import * as React from "react";
import { BUTTON_TOKENS, ButtonSpinner, type ButtonSize, type ButtonVariant } from "./Button";

/* ───────────── Tokens (keep in sync with the CSS) ───────────── */

export const ICON_BUTTON_TOKENS = {
  radius: 8,
  linkFocusRadius: 4,
  iconSize: 20,
  size: {
    sm: { box: 36, padding: 8, linkIcon: 16 },
    lg: { box: 44, padding: 12, linkIcon: 20 },
  },
  /** Colours, borders, shadows and focus rings are shared with Button. */
  variant: BUTTON_TOKENS.variant,
  /** Background while a menu / panel it opened is showing (aria-expanded="true"). */
  open: {
    primary: "#155EEF",
    secondary: "#F9FAFB",
    "secondary-blue": "#F5F8FF",
    tertiary: "#EAECF0",
    "tertiary-blue": "#D1E0FF",
  },
} as const;

/* ───────────── Types ───────────── */

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  /** The 20px icon (svg using currentColor). */
  icon: React.ReactNode;
  /** Required. Used for aria-label and the tooltip. */
  label: string;
  /** Default "tertiary". */
  variant?: ButtonVariant;
  /** Default "lg" (44px). */
  size?: ButtonSize;
  /** Show the tooltip. Default true; turn off only when the label is visible nearby. */
  tooltip?: boolean;
  /** Shows a spinner in place of the icon and blocks clicks. */
  loading?: boolean;
}

/* ───────────── IconButton ───────────── */

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    icon,
    label,
    variant = "tertiary",
    size = "lg",
    tooltip = true,
    loading = false,
    className,
    type = "button",
    onClick,
    ...rest
  },
  ref,
) {
  const cls = [
    "lb-icon-btn",
    `lb-icon-btn--${variant}`,
    size !== "lg" && `lb-icon-btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      ref={ref}
      type={type}
      className={cls}
      aria-label={label}
      data-tip={tooltip ? label : undefined}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
      {...rest}
    >
      {loading ? <ButtonSpinner /> : <span className="lb-icon-btn__icon" aria-hidden="true">{icon}</span>}
    </button>
  );
});

/* Convenience wrappers so call sites read clearly. */
export const PrimaryIconButton = (p: Omit<IconButtonProps, "variant">) => <IconButton {...p} variant="primary" />;
export const SecondaryIconButton = (p: Omit<IconButtonProps, "variant">) => <IconButton {...p} variant="secondary" />;
export const SecondaryBlueIconButton = (p: Omit<IconButtonProps, "variant">) => <IconButton {...p} variant="secondary-blue" />;
export const TertiaryIconButton = (p: Omit<IconButtonProps, "variant">) => <IconButton {...p} variant="tertiary" />;
export const TertiaryBlueIconButton = (p: Omit<IconButtonProps, "variant">) => <IconButton {...p} variant="tertiary-blue" />;
export const LinkGrayIconButton = (p: Omit<IconButtonProps, "variant">) => <IconButton {...p} variant="link-gray" />;
export const LinkBlueIconButton = (p: Omit<IconButtonProps, "variant">) => <IconButton {...p} variant="link-blue" />;

/* ───────────── State gallery (every variant × size × state) ───────────── */

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round">
    <path d="M10 4.167v11.666M4.167 10h11.666" />
  </svg>
);
const DotsVerticalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <circle cx="10" cy="4.5" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="10" cy="15.5" r="1.5" />
  </svg>
);

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "secondary-blue", "tertiary", "tertiary-blue", "link-gray", "link-blue"];
const SIZES: ButtonSize[] = ["sm", "lg"];

/** Every variant, size and state side by side, for review and visual QA. Hover and focus are live. */
export function IconButtonStates() {
  return (
    <div style={{ display: "grid", gap: 24, fontFamily: "Inter, sans-serif" }}>
      {VARIANTS.map((v) => (
        <section key={v}>
          <h4 style={{ margin: "0 0 12px" }}>{v}</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {SIZES.map((s) => (
              <React.Fragment key={s}>
                <code>{s}</code>
                <IconButton variant={v} size={s} icon={<PlusIcon />} label="Add" />
                <IconButton variant={v} size={s} icon={<DotsVerticalIcon />} label="More actions" aria-haspopup="menu" aria-expanded />
                <IconButton variant={v} size={s} icon={<PlusIcon />} label="Saving" loading />
                <IconButton variant={v} size={s} icon={<PlusIcon />} label="Add (disabled)" disabled />
              </React.Fragment>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default IconButton;
