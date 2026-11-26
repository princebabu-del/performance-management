/**
 * Button: primary, secondary, tertiary and link buttons (gray and blue)
 * =====================================================================
 *
 * The text buttons used across the app. Icon-only versions live in ./IconButton.tsx and share
 * the same hierarchy, colours and sizes.
 *
 *   ┌──────────────────┐ ┌──────────────────┐   Tertiary    Link gray    Link blue
 *   │ ＋ Create cycle  │ │  Save as draft   │   (no box)    (no box,     (no box,
 *   └──────────────────┘ └──────────────────┘               no padding)  no padding)
 *     primary #2970FF      secondary white, 1px #D0D5DD
 *
 *   Secondary, tertiary and link each come in gray (default) and blue:
 *     secondary / secondary-blue · tertiary / tertiary-blue · link-gray / link-blue
 *
 * This file is the spec and a typed React reference. The prototype is plain JS: today the same
 * looks are written per screen (.editor__action / .is-primary in 23-cycle-header.css, .cd-btn in
 * 18-cycle-detail-layout.css, .link-button in 16-reviewers-setup.css). New screens should use the
 * `.lb-btn` class names below. If you change a value here, change it in the CSS too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HIERARCHY: WHICH ONE TO USE
 * ─────────────────────────────────────────────────────────────────────────────
 *   Variant      Use for                                                       Per view
 *   ───────────  ────────────────────────────────────────────────────────────  ─────────────
 *   primary      The main action of the page, panel or dialog (Publish, Save)   One at most
 *   secondary    Other actions next to it (Save as draft, Cancel, Filters)       Any
 *   secondary-   A second action that should stand out more than gray but less  Any
 *     blue       than primary (Preview, Assign, Add reviewers)
 *   tertiary     Low-emphasis actions inside content (Add section, Show more)   Any
 *   tertiary-    Low-emphasis actions that move the work forward: row actions   Any
 *     blue       in tables (Continue setup, Reopen, Enable)
 *   link-gray    Inline text actions next to other text (Clear all, Undo)       Any
 *   link-blue    Inline actions that should stand out or navigate (Preview,     Any
 *                Split evenly, View all)
 *
 *   - Put primary on the right of a button row, secondary to its left, 12px apart.
 *   - Gray is the default. Use blue only when the action needs to stand out from gray neighbours;
 *     don't mix gray and blue of the same level in one button row.
 *   - A destructive action is a secondary/primary button with the danger tone (not covered here).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .lb-btn                         <button type="button">  inline-flex, centred, 8px gap, no wrap
 *   │  .lb-btn--primary | --secondary | --secondary-blue | --tertiary | --tertiary-blue
 *   │    | --link-gray | --link-blue
 *   │  .lb-btn--sm                   (36px; 44px is the default and isn't written out)
 *   ├ .lb-btn__icon  (optional)     20px icon before the label (iconLeading)
 *   ├ .lb-btn__label                the text; Inter, weight 600, line height normal
 *   └ .lb-btn__icon  (optional)     20px icon after the label (iconTrailing), e.g. a chevron
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SIZES (primary, secondary, tertiary: gray and blue)
 * ─────────────────────────────────────────────────────────────────────────────
 *   Size   Height  Padding (sides)  Text      Icon   Gap   Radius  Use for
 *   ─────  ──────  ───────────────  ────────  ─────  ────  ──────  ───────────────────────────────
 *   sm     36px    14px (12px with  14 / 600  20px   8px   8px     Table rows, cards, panels, dialogs,
 *                  an icon + label)                                dense toolbars
 *   lg     44px    16px             16 / 600  20px   8px   8px     Page headers, editor header,
 *                                                                  toolbars next to 44px fields (default)
 *
 *   There are only two sizes: 36px and 44px. Don't add a 40px button.
 *   Heights include the 1px border (box-sizing: border-box). Tertiary keeps the same box (with a
 *   transparent border) so it lines up with primary / secondary in a row.
 *   Link buttons have no box: no height, no padding, no border. Text 14/600 (sm) or 16/600 (lg).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STATES
 * ─────────────────────────────────────────────────────────────────────────────
 *   Primary
 *   State      Background  Border    Text / icon  Shadow / outline
 *   ─────────  ──────────  ────────  ───────────  ──────────────────────────────────────────────
 *   Default    #2970FF     #2970FF   #FFFFFF      0 1px 2px rgba(16,24,40,.05)
 *   Hover      #155EEF     #155EEF   #FFFFFF      same
 *   Focus      #2970FF     #2970FF   #FFFFFF      xs shadow + 0 0 0 4px rgba(41,112,255,.16) (keyboard only)
 *   Disabled   #F2F4F7     #EAECF0   #98A2B3      xs shadow, cursor not-allowed
 *
 *   Secondary
 *   Default    #FFFFFF     #D0D5DD   #344054      0 1px 2px rgba(16,24,40,.05)
 *   Hover      #F9FAFB     #D0D5DD   #101828      same
 *   Focus      #FFFFFF     #D0D5DD   #344054      xs shadow + 0 0 0 4px rgba(152,162,179,.14) (keyboard only)
 *   Disabled   #FFFFFF     #EAECF0   #D0D5DD      xs shadow, cursor not-allowed
 *
 *   Secondary blue
 *   Default    #FFFFFF     #B2CCFF   #2970FF      0 1px 2px rgba(16,24,40,.05)
 *   Hover      #F5F8FF     #84ADFF   #155EEF      same
 *   Focus      #FFFFFF     #B2CCFF   #2970FF      xs shadow + 0 0 0 4px rgba(41,112,255,.16) (keyboard only)
 *   Disabled   #FFFFFF     #EAECF0   #D0D5DD      xs shadow, cursor not-allowed (same as gray)
 *
 *   Tertiary (gray)
 *   Default    transparent transparent #475467     none
 *   Hover      #F2F4F7     transparent #344054     none
 *   Focus      transparent transparent #475467     2px #2970FF outline, 2px offset (keyboard only)
 *   Disabled   transparent transparent #D0D5DD     cursor not-allowed
 *
 *   Tertiary blue (prototype today: .cd-tert in 18-cycle-detail-layout.css)
 *   Default    transparent transparent #2970FF     none
 *   Hover      #EFF4FF     transparent #155EEF     none
 *   Focus      transparent transparent #2970FF     2px #2970FF outline, 2px offset (keyboard only)
 *   Disabled   transparent transparent #D0D5DD     cursor not-allowed
 *
 *   Link gray
 *   Default    none        none      #475467      none
 *   Hover      none        none      #344054      underline (text only, 2px offset)
 *   Focus      none        none      #475467      2px #2970FF outline, 2px offset, 4px radius
 *   Disabled   none        none      #98A2B3      no underline, cursor not-allowed
 *
 *   Link blue
 *   Default    none        none      #2970FF      none
 *   Hover      none        none      #155EEF      underline (text only, 2px offset)
 *   Focus      none        none      #2970FF      2px #2970FF outline, 2px offset, 4px radius
 *   Disabled   none        none      #98A2B3      no underline, cursor not-allowed
 *
 *   Icons always use currentColor, so they follow the text colour in every state.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LOADING
 * ─────────────────────────────────────────────────────────────────────────────
 *   `loading` swaps the leading icon for a 20px spinner, keeps the label, sets aria-busy="true"
 *   and blocks clicks. The width doesn't change. Use it when an action takes more than ~300ms.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR & ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - Always a real <button type="button"> (type="submit" only inside a form). If it navigates
 *     to another page, render an <a href> with the same classes instead.
 *   - Use `disabled` for actions that can't run yet. If the reason isn't obvious, add a tooltip
 *     (data-tip, ../tooltip) on a wrapper, since disabled buttons don't get pointer events.
 *   - A read-only "done" state (e.g. "Saved") uses aria-disabled="true" so it stays focusable.
 *   - Labels are verbs or verb phrases in sentence case: "Save as draft", not "Draft" or "SAVE".
 *   - Focus ring shows for keyboard focus only (:focus-visible), never on mouse click.
 *   - Minimum hit area for link buttons is the text line; give them 4px vertical padding when
 *     they stand alone so the target is at least 24px tall.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE (prototype, plain HTML)
 * ─────────────────────────────────────────────────────────────────────────────
 *   <button type="button" class="lb-btn lb-btn--primary">${ic("plus")}<span class="lb-btn__label">Create cycle</span></button>
 *   <button type="button" class="lb-btn lb-btn--secondary lb-btn--sm">Cancel</button>
 *   <button type="button" class="lb-btn lb-btn--secondary-blue">Preview</button>
 *   <button type="button" class="lb-btn lb-btn--tertiary lb-btn--sm">Add section</button>
 *   <button type="button" class="lb-btn lb-btn--tertiary-blue lb-btn--sm">Continue setup</button>
 *   <button type="button" class="lb-btn lb-btn--link-blue">Split evenly</button>
 */

import * as React from "react";

/* ───────────── Tokens (keep in sync with the CSS) ───────────── */

const SHADOW_XS = "0 1px 2px rgba(16,24,40,.05)";

export const BUTTON_TOKENS = {
  font: { family: "Inter", weight: 600, lineHeight: "normal" },
  radius: 8,
  gap: 8,
  iconSize: 20,
  size: {
    /** paddingXWithIcon: icon + label (leading or trailing icon, or the loading spinner). */
    sm: { height: 36, paddingX: 14, paddingXWithIcon: 12, fontSize: 14 },
    lg: { height: 44, paddingX: 16, fontSize: 16 },
  },
  /** Link buttons: no box, only the text size changes. */
  linkFontSize: { sm: 14, lg: 16 },
  variant: {
    primary: {
      default:  { bg: "#2970FF", border: "#2970FF", color: "#FFFFFF", shadow: SHADOW_XS },
      hover:    { bg: "#155EEF", border: "#155EEF", color: "#FFFFFF", shadow: SHADOW_XS },
      focus:    { shadow: `${SHADOW_XS}, 0 0 0 4px rgba(41,112,255,.16)` },
      disabled: { bg: "#F2F4F7", border: "#EAECF0", color: "#98A2B3", shadow: SHADOW_XS },
    },
    secondary: {
      default:  { bg: "#FFFFFF", border: "#D0D5DD", color: "#344054", shadow: SHADOW_XS },
      hover:    { bg: "#F9FAFB", border: "#D0D5DD", color: "#101828", shadow: SHADOW_XS },
      focus:    { shadow: `${SHADOW_XS}, 0 0 0 4px rgba(152,162,179,.14)` },
      disabled: { bg: "#FFFFFF", border: "#EAECF0", color: "#D0D5DD", shadow: SHADOW_XS },
    },
    "secondary-blue": {
      default:  { bg: "#FFFFFF", border: "#B2CCFF", color: "#2970FF", shadow: SHADOW_XS },
      hover:    { bg: "#F5F8FF", border: "#84ADFF", color: "#155EEF", shadow: SHADOW_XS },
      focus:    { shadow: `${SHADOW_XS}, 0 0 0 4px rgba(41,112,255,.16)` },
      disabled: { bg: "#FFFFFF", border: "#EAECF0", color: "#D0D5DD", shadow: SHADOW_XS },
    },
    tertiary: {
      default:  { bg: "transparent", border: "transparent", color: "#475467" },
      hover:    { bg: "#F2F4F7", border: "transparent", color: "#344054" },
      focus:    { outline: "2px solid #2970FF", outlineOffset: 2 },
      disabled: { bg: "transparent", border: "transparent", color: "#D0D5DD" },
    },
    "tertiary-blue": {
      default:  { bg: "transparent", border: "transparent", color: "#2970FF" },
      hover:    { bg: "#EFF4FF", border: "transparent", color: "#155EEF" },
      focus:    { outline: "2px solid #2970FF", outlineOffset: 2 },
      disabled: { bg: "transparent", border: "transparent", color: "#D0D5DD" },
    },
    "link-gray": {
      default:  { color: "#475467" },
      hover:    { color: "#344054", textDecoration: "underline", underlineOffset: 2 },
      focus:    { outline: "2px solid #2970FF", outlineOffset: 2, radius: 4 },
      disabled: { color: "#98A2B3" },
    },
    "link-blue": {
      default:  { color: "#2970FF" },
      hover:    { color: "#155EEF", textDecoration: "underline", underlineOffset: 2 },
      focus:    { outline: "2px solid #2970FF", outlineOffset: 2, radius: 4 },
      disabled: { color: "#98A2B3" },
    },
  },
} as const;

/* ───────────── Types ───────────── */

export type ButtonVariant = keyof typeof BUTTON_TOKENS.variant;
export type ButtonSize = keyof typeof BUTTON_TOKENS.size;

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Visible text. Sentence case, starts with a verb. */
  children: React.ReactNode;
  /** Default "secondary". */
  variant?: ButtonVariant;
  /** Default "lg" (44px). */
  size?: ButtonSize;
  /** 20px icon before the label. */
  iconLeading?: React.ReactNode;
  /** 20px icon after the label (chevrons, external-link). */
  iconTrailing?: React.ReactNode;
  /** Shows a spinner in place of the leading icon and blocks clicks. */
  loading?: boolean;
  /** Stretch to the container width (mobile footers, dialogs). */
  fullWidth?: boolean;
}

/* ───────────── Helpers ───────────── */

export function buttonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  extra?: { fullWidth?: boolean; className?: string },
) {
  return [
    "lb-btn",
    `lb-btn--${variant}`,
    size !== "lg" && `lb-btn--${size}`,
    extra?.fullWidth && "lb-btn--full",
    extra?.className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** 20px spinner, inherits the text colour. */
export function ButtonSpinner() {
  return (
    <svg className="lb-btn__icon lb-btn__spinner" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="2.5" />
      <path d="M18 10a8 8 0 0 0-8-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ───────────── Button ───────────── */

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "secondary",
    size = "lg",
    iconLeading,
    iconTrailing,
    loading = false,
    fullWidth = false,
    className,
    type = "button",
    disabled,
    onClick,
    ...rest
  },
  ref,
) {
  const leading = loading ? <ButtonSpinner /> : iconLeading;
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClassName(variant, size, { fullWidth, className })}
      disabled={disabled}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
      {...rest}
    >
      {leading && <span className="lb-btn__icon" aria-hidden="true">{leading}</span>}
      <span className="lb-btn__label">{children}</span>
      {iconTrailing && <span className="lb-btn__icon" aria-hidden="true">{iconTrailing}</span>}
    </button>
  );
});

/* Convenience wrappers so call sites read clearly. */
export const PrimaryButton = (p: Omit<ButtonProps, "variant">) => <Button {...p} variant="primary" />;
export const SecondaryButton = (p: Omit<ButtonProps, "variant">) => <Button {...p} variant="secondary" />;
export const SecondaryBlueButton = (p: Omit<ButtonProps, "variant">) => <Button {...p} variant="secondary-blue" />;
export const TertiaryButton = (p: Omit<ButtonProps, "variant">) => <Button {...p} variant="tertiary" />;
export const TertiaryBlueButton = (p: Omit<ButtonProps, "variant">) => <Button {...p} variant="tertiary-blue" />;
export const LinkGrayButton = (p: Omit<ButtonProps, "variant">) => <Button {...p} variant="link-gray" />;
export const LinkBlueButton = (p: Omit<ButtonProps, "variant">) => <Button {...p} variant="link-blue" />;

/* ───────────── State gallery (every variant × size × state) ───────────── */

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round">
    <path d="M10 4.167v11.666M4.167 10h11.666" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 7.5 5 5 5-5" />
  </svg>
);

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "secondary-blue", "tertiary", "tertiary-blue", "link-gray", "link-blue"];
const SIZES: ButtonSize[] = ["sm", "lg"];

/** Every variant, size and state side by side, for review and visual QA. Hover and focus are live. */
export function ButtonStates() {
  return (
    <div style={{ display: "grid", gap: 32, fontFamily: "Inter, sans-serif" }}>
      {VARIANTS.map((v) => (
        <section key={v}>
          <h4 style={{ margin: "0 0 12px" }}>{v}</h4>
          <div style={{ display: "grid", gap: 12 }}>
            {SIZES.map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <code style={{ width: 32 }}>{s}</code>
                <Button variant={v} size={s}>Button</Button>
                <Button variant={v} size={s} iconLeading={<PlusIcon />}>Leading icon</Button>
                <Button variant={v} size={s} iconTrailing={<ChevronDownIcon />}>Trailing icon</Button>
                <Button variant={v} size={s} loading>Saving</Button>
                <Button variant={v} size={s} disabled>Disabled</Button>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h4 style={{ margin: "0 0 12px" }}>In context · editor header (secondary + primary, 12px apart)</h4>
        <div style={{ display: "flex", gap: 12 }}>
          <SecondaryButton>Save as draft</SecondaryButton>
          <PrimaryButton>Publish</PrimaryButton>
        </div>
      </section>
    </div>
  );
}

export default Button;
