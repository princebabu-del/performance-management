/* ===== Button group / segmented control (spec: ButtonGroup.tsx · usage: README.md)
   btnGroup(items, opts) → HTML string
     items[]           { id, label, count?, tone?, disabled?, onclick? }
       count           number or string; leave it out for no badge. 0 still shows a badge.
       tone            "neutral" (default) | "info" | "warning" | "danger"
       onclick         JS for this button only; overrides opts.onSelect
     opts.active       id of the selected button
     opts.onSelect     id => JS string run on click, e.g. id=>`S.quick='${id}';render()`
     opts.label        aria-label for the group
     opts.size         "md" (40px, default) | "lg" (44px)
     opts.max          counts above this show as "max+" (default 99)
     opts.cls, opts.id extra class names / element id
   ===== */
const BGRP_TONES=["neutral","info","warning","danger"];
function btnGroup(items,opts={}){
 const max=opts.max??99,e=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
 const btn=t=>{
  const on=t.id===opts.active,tone=BGRP_TONES.includes(t.tone)?t.tone:"neutral";
  const js=t.onclick??(opts.onSelect?opts.onSelect(t.id):"");
  const n=t.count==null?"":typeof t.count==="number"&&t.count>max?`${max}+`:t.count;
  return `<button type="button" class="lb-bgrp__btn${on?" is-selected":""}" aria-pressed="${on}"`+
   `${t.disabled?" disabled":""}${js&&!t.disabled&&!on?` onclick="${e(js)}"`:""}>`+
   `<span class="lb-bgrp__label">${e(t.label)}</span>`+
   `${n===""?"":`<span class="lb-bgrp__badge${tone==="neutral"?"":" lb-bgrp__badge--"+tone}">${e(n)}</span>`}</button>`};
 return `<div class="lb-bgrp${opts.size==="lg"?" lb-bgrp--lg":""}${opts.cls?" "+opts.cls:""}"${opts.id?` id="${opts.id}"`:""} role="group"${opts.label?` aria-label="${e(opts.label)}"`:""}>${items.map(btn).join("")}</div>`}
