/**
 * Tooltip: short dark label on hover / keyboard focus
 * ===================================================
 *
 * Names an icon-only button or explains a disabled control in a few words ("Remove", "Edit",
 * "Only available when the reviewee can view this review"). Not for anything the user must read
 * to finish a task: put that on the page.
 *
 *                 ┌──────────┐
 *                 │  Remove  │   ← bubble: #101828, 8px radius, 8px 12px padding
 *                 └────▼─────┘   ← pointer 16×8.5, bottom center (default)
 *                      ⓧ         ← element, 4px below the pointer tip
 *
 * This file is the spec and a typed React reference. The prototype itself is plain JS:
 * ./tooltip.js gives any element with `data-tip="…"` this tooltip, styled by ./tooltip.css.
 * If you change a value here, change it in tooltip.css / tooltip.js too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ANATOMY
 * ─────────────────────────────────────────────────────────────────────────────
 *   .lb-tip                 role="tooltip", id="lbTip", position:fixed on <body>, lg drop shadow
 *   ├ .lb-tip__bubble       the text: Inter 12/18 (1.5), weight 500, +0.12px, #FFFFFF, one line, max 320px
 *   └ .lb-tip__arrow        16×8.5 pointer (/assets/icons/tooltip-pointer.svg), overlaps the bubble by 2.5px
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POINTER VARIATIONS  (placement = where the bubble sits; the pointer is on the opposite side)
 * ─────────────────────────────────────────────────────────────────────────────
 *   placement      pointer          data-tip-pos     Use for
 *   ─────────────  ───────────────  ───────────────  ─────────────────────────────────────────────
 *   top            bottom center    (default)        Almost everything: icon buttons, table cells
 *   top-start      bottom left      top-start        Element near the left edge of a card/table
 *   top-end        bottom right     top-end          Element near the right edge (e.g. a last column)
 *   bottom         top center       bottom           Element at the top of the viewport / under a sticky header
 *   bottom-start   top left         bottom-start
 *   bottom-end     top right        bottom-end
 *   left           right center     left             Element on the right edge with no room above
 *   right          left center      right            Items in a vertical nav / left rail
 *   (any)          none             data-tip-arrow="none"   Tooltip that isn't tied to one small target
 *
 *   start / end: the pointer tip sits 20px in from the bubble's edge (12px inset + half the pointer),
 *   and the bubble is shifted so that tip still points at the element's centre.
 *   top ↔ bottom flip automatically when there's no room; every placement is kept 8px inside the viewport.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TIMING & BEHAVIOUR
 * ─────────────────────────────────────────────────────────────────────────────
 *   Show     on hover, at once — or after `delay` ms (data-tip-delay="300" on field clear buttons)
 *            on keyboard focus (:focus-visible), always at once
 *   Hide     as soon as the pointer leaves the element (or the window); on mousedown, scroll,
 *            window blur, Escape, focus leaving, or the element being re-rendered away
 *   Never    on touch long-press; never interactive (pointer-events: none); never more than one at a time
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ACCESSIBILITY
 * ─────────────────────────────────────────────────────────────────────────────
 *   - The element gets aria-describedby="lbTip" while the tooltip shows.
 *   - Icon-only buttons still need their own aria-label (the tooltip describes, it doesn't name).
 *     The label can differ from the tooltip: aria-label="Clear repeats", data-tip="Remove".
 *   - Escape hides it without moving focus.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE (prototype, plain HTML attributes — no JS call needed)
 * ─────────────────────────────────────────────────────────────────────────────
 *   <button aria-label="Edit cycle" data-tip="Edit">…</button>                       top, pointer bottom center
 *   <button aria-label="Clear repeats" data-tip="Remove" data-tip-delay="300">…</button>
 *   <th data-tip="Share of the overall score" data-tip-pos="bottom">Weightage</th>  pointer top center
 *   <a class="rl" data-tip="Review Cycles" data-tip-pos="right">…</a>                pointer left
 *   <span data-tip="Saved 2 min ago" data-tip-arrow="none">…</span>                  no pointer
 */

import * as React from "react";

/* ───────────── Tokens (keep in sync with tooltip.css / tooltip.js) ───────────── */

export const TOOLTIP_TOKENS = {
  font: "Inter, -apple-system, 'Segoe UI', Roboto, sans-serif",
  bubble: {
    background: "#101828",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: ".12px",
    paddingY: 8,
    paddingX: 12,
    radius: 8,
    maxWidth: 320,
  },
  arrow: { width: 16, height: 8.5, overlap: 2.5, inset: 12 },
  gap: 4, // element edge → pointer tip
  viewportEdge: 8,
  shadow: "drop-shadow(0 12px 8px rgba(16,24,40,.08)) drop-shadow(0 4px 3px rgba(16,24,40,.03))",
  zIndex: 1500,
} as const;

const T = TOOLTIP_TOKENS;

/* ───────────── Types ───────────── */

export type TooltipPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "right";

export interface TooltipProps {
  /** the tooltip text: a few words, one line */
  content: string;
  /** where the bubble sits; the pointer is on the opposite side. Default "top" (pointer bottom center) */
  placement?: TooltipPlacement;
  /** false = no pointer */
  arrow?: boolean;
  /** ms to wait on hover before showing (keyboard focus shows at once). Default 0 */
  delay?: number;
  /** flip top ↔ bottom when there's no room. Default true */
  flip?: boolean;
  /** exactly one focusable child (button, link, input…) */
  children: React.ReactElement;
}

/* ───────────── Pointer (same path as /assets/icons/tooltip-pointer.svg, pointing down) ───────────── */

const ROTATE: Record<"top" | "bottom" | "left" | "right", number> = { top: 0, bottom: 180, left: -90, right: 90 };

export function TooltipArrow({ side }: { side: "top" | "bottom" | "left" | "right" }) {
  const vertical = side === "top" || side === "bottom";
  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative", display: "block", flex: "none",
        width: vertical ? T.arrow.width : T.arrow.height,
        height: vertical ? T.arrow.height : T.arrow.width,
      }}
    >
      <svg
        width={T.arrow.width}
        height={T.arrow.height}
        viewBox="0 0 16 8.51471"
        fill="none"
        style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) rotate(${ROTATE[side]}deg)` }}
      >
        <path
          d="M14.0711 6.9831e-08C14.962 6.9831e-08 15.4081 1.07714 14.7782 1.70711L8.70711 7.77818C8.31658 8.16871 7.68342 8.16871 7.29289 7.77818L1.22183 1.70711C0.591867 1.07714 1.03803 4.913e-07 1.92894 4.913e-07L14.0711 6.9831e-08Z"
          fill={T.bubble.background}
        />
      </svg>
    </span>
  );
}

/* ───────────── Static bubble (no positioning): used by the floating Tooltip and the gallery ───────────── */

export function TooltipBubble({
  content, placement = "top", arrow = true, arrowOffset, style, id,
}: {
  content: string;
  placement?: TooltipPlacement;
  arrow?: boolean;
  /** px from the bubble's start edge to the pointer's start edge; default centre / 12px inset */
  arrowOffset?: number;
  style?: React.CSSProperties;
  id?: string;
}) {
  const [side, align = "center"] = placement.split("-") as ["top" | "bottom" | "left" | "right", string?];
  const vertical = side === "top" || side === "bottom";
  const dir: React.CSSProperties["flexDirection"] =
    side === "top" ? "column" : side === "bottom" ? "column-reverse" : side === "left" ? "row" : "row-reverse";
  const arrowMargin =
    side === "top" ? { marginTop: -T.arrow.overlap } : side === "bottom" ? { marginBottom: -T.arrow.overlap }
    : side === "left" ? { marginLeft: -T.arrow.overlap } : { marginRight: -T.arrow.overlap };
  const alignSelf: React.CSSProperties["alignSelf"] =
    arrowOffset !== undefined ? "flex-start" : align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";
  const insetStyle: React.CSSProperties =
    arrowOffset !== undefined ? (vertical ? { marginLeft: arrowOffset } : { marginTop: arrowOffset })
    : align === "start" ? (vertical ? { marginLeft: T.arrow.inset } : { marginTop: T.arrow.inset })
    : align === "end" ? (vertical ? { marginRight: T.arrow.inset } : { marginBottom: T.arrow.inset })
    : {};

  return (
    <div
      role="tooltip"
      id={id}
      style={{ display: "inline-flex", flexDirection: dir, alignItems: "stretch", filter: T.shadow, pointerEvents: "none", ...style }}
    >
      <div
        style={{
          maxWidth: T.bubble.maxWidth, background: T.bubble.background, color: T.bubble.color,
          padding: `${T.bubble.paddingY}px ${T.bubble.paddingX}px`, borderRadius: T.bubble.radius,
          fontFamily: T.font, fontSize: T.bubble.fontSize, fontWeight: T.bubble.fontWeight,
          lineHeight: T.bubble.lineHeight, letterSpacing: T.bubble.letterSpacing, whiteSpace: "nowrap", textAlign: "center",
        }}
      >
        {content}
      </div>
      {arrow && (
        <span style={{ display: "flex", alignSelf, ...arrowMargin, ...insetStyle }}>
          <TooltipArrow side={side} />
        </span>
      )}
    </div>
  );
}

/* ───────────── Floating Tooltip: wraps one child, shows on hover / focus ───────────── */

export function Tooltip({ content, placement = "top", arrow = true, delay = 0, flip = true, children }: TooltipProps) {
  const id = `tip${React.useId().replace(/:/g, "")}`;
  const anchor = React.useRef<HTMLElement | null>(null);
  const tip = React.useRef<HTMLDivElement | null>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ x: number; y: number; placement: TooltipPlacement; arrowOffset?: number } | null>(null);

  const show = (now: boolean) => {
    window.clearTimeout(timer.current);
    if (now || !delay) setOpen(true);
    else timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
    setPos(null);
  };
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  /* place after the bubble has rendered (so its size is known); flip top ↔ bottom when there's no room */
  React.useLayoutEffect(() => {
    if (!open || !anchor.current || !tip.current) return;
    const r = anchor.current.getBoundingClientRect();
    const W = tip.current.offsetWidth, H = tip.current.offsetHeight, E = T.viewportEdge, G = T.gap;
    let p = placement;
    let [side, align = "center"] = p.split("-");
    if (flip && side === "top" && r.top - H - G < E) p = p.replace("top", "bottom") as TooltipPlacement;
    else if (flip && side === "bottom" && r.bottom + H + G > window.innerHeight - E) p = p.replace("bottom", "top") as TooltipPlacement;
    [side, align = "center"] = p.split("-");
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const clampX = (x: number) => Math.max(E, Math.min(x, window.innerWidth - W - E));
    const clampY = (y: number) => Math.max(E, Math.min(y, window.innerHeight - H - E));
    if (side === "top" || side === "bottom") {
      const off = T.arrow.inset + T.arrow.width / 2;
      const x = clampX(align === "start" ? cx - off : align === "end" ? cx - W + off : cx - W / 2);
      const y = side === "top" ? r.top - H - G : r.bottom + G;
      setPos({ x, y, placement: p, arrowOffset: Math.max(E, Math.min(cx - x - T.arrow.width / 2, W - T.arrow.width - E)) });
    } else {
      const y = clampY(cy - H / 2);
      const x = side === "left" ? r.left - W - G : r.right + G;
      setPos({ x, y, placement: p, arrowOffset: Math.max(E, Math.min(cy - y - T.arrow.width / 2, H - T.arrow.width - E)) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* hide on scroll, window blur and Escape */
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") hide(); };
    window.addEventListener("scroll", hide, true);
    window.addEventListener("blur", hide);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("blur", hide);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  type ChildProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
  const child = React.Children.only(children) as React.ReactElement<ChildProps>;
  const cp = child.props;
  const trigger = React.cloneElement(child, {
    ref: (el: HTMLElement | null) => { anchor.current = el; },
    "aria-describedby": open ? [cp["aria-describedby"], id].filter(Boolean).join(" ") : cp["aria-describedby"],
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { cp.onMouseEnter?.(e); show(false); },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { cp.onMouseLeave?.(e); hide(); },
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => { cp.onMouseDown?.(e); hide(); },
    onFocus: (e: React.FocusEvent<HTMLElement>) => { cp.onFocus?.(e); if (e.currentTarget.matches(":focus-visible")) show(true); },
    onBlur: (e: React.FocusEvent<HTMLElement>) => { cp.onBlur?.(e); hide(); },
  });

  return (
    <>
      {trigger}
      {open && (
        <div
          ref={tip}
          style={{
            position: "fixed", left: pos?.x ?? 0, top: pos?.y ?? 0, zIndex: T.zIndex,
            visibility: pos ? "visible" : "hidden", pointerEvents: "none",
          }}
        >
          <TooltipBubble id={id} content={content} placement={pos?.placement ?? placement} arrow={arrow} arrowOffset={pos?.arrowOffset} />
        </div>
      )}
    </>
  );
}

/* ───────────── Gallery: every pointer variation, static, for review and visual QA ───────────── */

const ALL: { placement: TooltipPlacement; label: string }[] = [
  { placement: "top", label: "Pointer bottom center (default)" },
  { placement: "top-start", label: "Pointer bottom left" },
  { placement: "top-end", label: "Pointer bottom right" },
  { placement: "bottom", label: "Pointer top center" },
  { placement: "bottom-start", label: "Pointer top left" },
  { placement: "bottom-end", label: "Pointer top right" },
  { placement: "left", label: "Pointer right" },
  { placement: "right", label: "Pointer left" },
];

export function TooltipStates() {
  const cap: React.CSSProperties = { fontFamily: T.font, fontSize: 12, color: "#667085" };
  const btn: React.CSSProperties = {
    width: 40, height: 40, borderRadius: 8, border: "1px solid #D0D5DD", background: "#fff",
    display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontFamily: T.font,
  };
  return (
    <div style={{ display: "grid", gap: 40, padding: 40, fontFamily: T.font }}>
      <section>
        <h4 style={{ margin: "0 0 16px" }}>1 · Pointer variations (static)</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, max-content)", gap: "32px 48px", alignItems: "center" }}>
          {ALL.map((v) => (
            <div key={v.placement} style={{ display: "grid", gap: 8, justifyItems: "start" }}>
              <TooltipBubble content="Remove" placement={v.placement} />
              <span style={cap}>{v.label} · placement="{v.placement}"</span>
            </div>
          ))}
          <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
            <TooltipBubble content="Remove" arrow={false} />
            <span style={cap}>No pointer · arrow={"{false}"}</span>
          </div>
        </div>
      </section>

      <section>
        <h4 style={{ margin: "0 0 16px" }}>2 · Live: hover or Tab to each button</h4>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingTop: 48, paddingBottom: 48 }}>
          {ALL.map((v) => (
            <Tooltip key={v.placement} content="Remove" placement={v.placement}>
              <button type="button" aria-label={`Example ${v.placement}`} style={btn}>ⓧ</button>
            </Tooltip>
          ))}
          <Tooltip content="Remove" delay={300}>
            <button type="button" aria-label="Clear repeats" style={btn}>300</button>
          </Tooltip>
          <Tooltip content="Saved 2 min ago" arrow={false}>
            <button type="button" aria-label="No pointer example" style={btn}>–</button>
          </Tooltip>
        </div>
      </section>
    </div>
  );
}

export default Tooltip;
