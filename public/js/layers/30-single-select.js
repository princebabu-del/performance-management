/* ===== New Review Cycle: single-select dropdown — the shared dropdown menu (.rx-pop › .rx-pop-list, 28-dropdown-menu.css)
   without checkboxes; the chosen option carries a blue check at its right end. Used for Review Type, Repeats and
   "Who is going to be reviewed?". Opening/closing reuses the multi-select's RXP state: rxOpen / rxClose, outside click,
   Escape (14-reviewee-reviewers.js). Styles: src/styles/25-single-select.css + 28-dropdown-menu.css
   Spec: public/components/single-select/SingleSelect.tsx
   fcSel({id, value, options:[{v,t,s,dis,title}], ph, pick, bad, clear, cls, label, search}) — pick: name of a global function called with (value, id);
   s: optional secondary line under the option (12px tertiary, 2px gap);
   search: placeholder of a search bar shown above the list (leave out for no search);
   clear: aria-label of an × that resets to "" (shown once something is chosen); cls: extra classes on the wrapper (e.g. width); label: a visually hidden question for fields without one on screen (table cells). Otherwise the question's id is `${id}Q` (fcQ). ===== */
function fcSel(o){const open=RXP.id===o.id,cur=o.options.find(x=>x.v===o.value),js=v=>v.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),two=o.options.some(x=>x.s);
 return `<div class="rx-dd ${o.clear?"fc-clr":""} ${o.clear&&cur?"has":""} ${o.cls||""}" id="${o.id}Wrap">${o.label?`<span class="fc-sr" id="${o.id}Q">${esc(o.label)}</span>`:""}
  <button type="button" class="fc-inp fc-sel fc-ss-btn rx-ddbtn ${cur?"":"empty"} ${o.bad?"bad":""} ${open?"open":""}" id="${o.id}" data-for="${o.id}"
   aria-haspopup="listbox" aria-expanded="${open}" aria-labelledby="${o.id}Q ${o.id}V" onclick="fcSelOpen('${o.id}',event)"><span class="fc-ss-v" id="${o.id}V">${cur?esc(cur.t):esc(o.ph)}</span></button>
  ${o.clear&&cur?`<button type="button" class="fc-clr-x" aria-label="${o.clear}" data-tip="Remove" data-tip-delay="300" onclick="fcSelPick('${o.id}','${o.pick}','')"><span class="fc-clr-i" aria-hidden="true"></span></button>`:""}
  ${open?`<div class="rx-pop fc-ss-pop ${two?"dd-2l":""}" data-for="${o.id}">${o.search?`<div class="rx-srch"><input class="rx-search" type="search" placeholder="${esc(o.search)}" aria-label="${esc(o.search)}" autocomplete="off" oninput="ddFilter(this)"></div>`:""}
   <div class="rx-pop-list" role="listbox" aria-labelledby="${o.id}Q">${o.options.map(x=>{const on=x.v===o.value;
   return `<button type="button" role="option" class="rx-mo fc-ss-o ${on?"on":""}" aria-selected="${on}" data-n="${esc((x.t+" "+(x.s||"")).toLowerCase())}" ${x.dis?`disabled aria-disabled="true"${x.title?` title="${esc(x.title)}"`:""}`:""} onclick="fcSelPick('${o.id}','${o.pick}','${js(x.v)}')">${x.s?`<span class="dd-txt"><span class="dd-t1">${esc(x.t)}</span><span class="dd-t2">${esc(x.s)}</span></span>`:`<span>${esc(x.t)}</span>`}${on?`<img class="fc-ss-ck" src="/assets/check-blue-20.svg" width="20" height="20" alt="">`:""}</button>`}).join("")}
   ${o.search?`<div class="rx-none" hidden>No matches</div>`:""}</div></div>`:""}
 </div>`}
/* open on the chosen option (or the first); with a search bar, focus stays in the search */
function fcSelOpen(id,e){rxOpen(id,e);const p=$(`.rx-pop[data-for="${id}"]`);if(!p||p.querySelector(".rx-search"))return;const f=p.querySelector(".fc-ss-o.on")||p.querySelector(".fc-ss-o:not(:disabled)");
 if(f){f.focus({preventScroll:true});f.scrollIntoView({block:"nearest"})}}
/* pick → close, apply, focus back on the field */
function fcSelPick(id,fn,v){RXP.id=null;window[fn](v,id);const b=document.getElementById(id);if(b)b.focus({preventScroll:true})}
/* ↑ / ↓ / Home / End move between options (search-hidden ones skipped; ↑ from the first goes back to the search); Tab closes */
document.addEventListener("keydown",e=>{const o=e.target.closest&&e.target.closest(".fc-ss-o");if(!o)return;
 const L=[...o.parentNode.querySelectorAll(".fc-ss-o:not(:disabled)")].filter(x=>!x.hidden),i=L.indexOf(o);
 if(e.key==="ArrowUp"&&i===0){const s=o.closest(".rx-pop").querySelector(".rx-search");if(s){e.preventDefault();s.focus();return}}
 const j=e.key==="ArrowDown"?Math.min(i+1,L.length-1):e.key==="ArrowUp"?Math.max(i-1,0):e.key==="Home"?0:e.key==="End"?L.length-1:-1;
 if(j>=0){e.preventDefault();L[j].focus()}else if(e.key==="Tab")rxClose()});
/* the three fields' picks */
function fcTypePick(v){if(v)fcType(v)}
/* Repeats: picking an option shows the empty Occurrences field and puts the cursor in it (after fcSelPick's own focus) */
function fcRepeatPick(v){const w=W(),was=w.recur;w.recur=v;if(!v){w.recurN="";if(w.errs)delete w.errs.recurN}render();
 if(v&&!was)setTimeout(()=>{const n=$("#fcRecurN");if(n)n.focus()},0)}
function fcWhoPick(v){if(v)rxSetReviewee(v)}
/* Auto-assign › group category (id aaCat<i>) */
function aaCatPick(v,id){if(v)aaSetCat(+id.slice(5),v)}
render();
