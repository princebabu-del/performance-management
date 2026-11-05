/* ===== Page tabs (spec: Tabs.tsx · usage: README.md)
   tabBar(items, opts) → HTML string
     items[]           { id, label, count?, tone?, disabled?, onclick? }
       count           number or string; leave it out for no badge. 0 still shows a badge.
       tone            "neutral" (default) | "info" | "danger"
       onclick         JS for this tab only; overrides opts.onSelect
     opts.active       id of the selected tab
     opts.onSelect     id => JS string run on click, e.g. id=>`nav('cycles',{cycTab:'${id}'})`
     opts.label        aria-label for the tab list
     opts.max          counts above this show as "max+" (default 99)
     opts.cls, opts.id extra class names / element id
   ===== */
const TAB_TONES=["neutral","info","danger"];
function tabBar(items,opts={}){
 const max=opts.max??99,e=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
 const btn=t=>{
  const on=t.id===opts.active,tone=TAB_TONES.includes(t.tone)?t.tone:"neutral";
  const js=t.onclick??(opts.onSelect?opts.onSelect(t.id):"");
  const n=t.count==null?"":typeof t.count==="number"&&t.count>max?`${max}+`:t.count;
  return `<button type="button" role="tab" class="lb-tab${on?" is-selected":""}" aria-selected="${on}" tabindex="${on?0:-1}"`+
   `${t.disabled?" disabled":""}${js&&!t.disabled&&!on?` onclick="${e(js)}"`:""}>`+
   `<span class="lb-tab__label" data-label="${e(t.label)}">${e(t.label)}</span>`+
   `${n===""?"":`<span class="lb-tab__badge${tone==="neutral"?"":" lb-tab__badge--"+tone}">${e(n)}</span>`}</button>`};
 // If nothing is selected, keep the first enabled tab reachable with Tab
 let html=items.map(btn).join("");
 if(!items.some(t=>t.id===opts.active))html=html.replace('tabindex="-1"','tabindex="0"');
 return `<div class="lb-tabs${opts.cls?" "+opts.cls:""}"${opts.id?` id="${opts.id}"`:""} role="tablist"${opts.label?` aria-label="${e(opts.label)}"`:""}>${html}</div>`}

/* Arrow keys / Home / End move focus between tabs; Enter or Space selects (manual activation). */
document.addEventListener("keydown",ev=>{
 const cur=ev.target.closest&&ev.target.closest(".lb-tab");if(!cur)return;
 const list=[...cur.parentElement.querySelectorAll(".lb-tab:not(:disabled)")],i=list.indexOf(cur);
 const k={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:list.length-1}[ev.key];if(k==null)return;
 ev.preventDefault();list[(k+list.length)%list.length].focus()});
