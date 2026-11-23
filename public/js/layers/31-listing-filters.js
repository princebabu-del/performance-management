/* ===== Filters for the listing tables (Review Cycles, Questionnaires).
   Same two-pane Filters drawer as elsewhere (categories left, options right), with listing-specific categories:
     checkbox lists   value is an array of picked options
     date ranges      value is {from, to} (ISO dates, either may be empty) — picked in the Figma date range
                      selector (Employee-Onboarding 4631:14697): From / To fields over an always-open month calendar
   Each category has its own Reset (top of the options pane); the footer Reset clears them all.
   S.flt[view] holds the applied filters, S.fDraft the drawer's working copy, S.fCal the calendar's month + active field. */

const lfUniq=a=>[...new Set(a.filter(v=>v&&v!=="—"))];
const lfSorted=a=>lfUniq(a).sort((x,y)=>x.localeCompare(y));
const lfMdyISO=s=>{const m=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s||"").trim());if(!m)return"";
 const d=new Date(+m[3],+m[1]-1,+m[2]);return d.getMonth()===+m[1]-1&&d.getDate()===+m[2]?ldpISO(+m[3],+m[1]-1,+m[2]):""};
const lfActive=v=>Array.isArray(v)?v.length>0:!!(v&&(v.from||v.to));
const lfCount=v=>Array.isArray(v)?v.length:lfActive(v)?1:0;

/* categories per view. opts() = checkbox options, val(row) = the row's value (or match(row, picked) for multi-valued),
   date + day(row) = one ISO date, date + range(row) = [startISO, endISO] (kept when it overlaps the picked range) */
const LF_CATS={
 cycles:{
  "Cycle Type":{opts:()=>["General Review","New Hire Review","Project Completion Review"],val:c=>clType(c)},
  "Cycle Period":{date:true,range:c=>clType(c)==="General Review"?cycDates(c):["",""]},   // new hire / project cycles have no fixed dates
  "Repeats":{opts:()=>lfUniq(["One-time","Every month","Every 3 months","Every 6 months","Every year",...D.cycles.map(c=>clSortVal(c,"repeats"))]),val:c=>clSortVal(c,"repeats")},
  "Reviewee":{opts:()=>RX_ROLES,val:c=>clReviewee(c)},
  "Rating System":{opts:()=>["Numbers (1–5)","Stars (1–5)","No rating"],val:c=>clRating(c)},
  "Created By":{opts:()=>lfSorted(D.cycles.map(c=>clStamp(c).createdBy)),val:c=>clStamp(c).createdBy},
  "Created Date":{date:true,day:c=>clStamp(c).createdISO}},
 templates:{
  "Used in Review Cycles":{opts:()=>lfSorted(D.templates.flatMap(t=>t.used.map(C).filter(Boolean).map(c=>c.name))),
   match:(t,picked)=>t.used.map(C).filter(Boolean).some(c=>picked.includes(c.name))},
  "Created By":{opts:()=>lfSorted(D.templates.map(tplBy)),val:t=>tplBy(t)},
  "Created Date":{date:true,day:t=>lfMdyISO(tplCreated(t))}}};

/* rows that pass every applied filter (called by V.cycles / V.templates before sorting) */
function lsFilterRows(view,rows){const cats=LF_CATS[view],f=(S.flt||{})[view]||{};if(!cats)return rows;
 return rows.filter(r=>Object.entries(f).every(([k,v])=>{const c=cats[k];if(!c||!lfActive(v))return true;
  if(c.date){if(c.range){const[s,e]=c.range(r);return !!(s&&e)&&(!v.to||s<=v.to)&&(!v.from||e>=v.from)}
   const d=c.day(r);return !!d&&(!v.from||d>=v.from)&&(!v.to||d<=v.to)}
  return c.match?c.match(r,v):v.includes(c.val(r))}))}

/* Filters button count: one per checked option, one per date range */
fCount=function(){const f=(S.flt||{})[S.view]||{},cats=LF_CATS[S.view];
 return Object.entries(f).reduce((a,[k,v])=>a+(cats&&!cats[k]?0:lfCount(v)),0)};

/* ---------- drawer ---------- */
/* Every Filters drawer slides in from the right when it opens. It's redrawn on each click inside it, so the
   slide only plays when no Filters drawer was open before. */
const _openFiltersLF=openFilters;
openFilters=function(cat){const fresh=!document.querySelector("#layer .dbg .fpane");
 if(LF_CATS[S.view])lfOpenDrawer(cat);else _openFiltersLF(cat);
 const bg=fresh&&document.querySelector("#layer .dbg");if(bg)bg.classList.add("lf-enter")};
function lfOpenDrawer(cat){const cats=LF_CATS[S.view];
 S.flt=S.flt||{};const keys=Object.keys(cats);
 if(!S.fDraft)S.fDraft=JSON.parse(JSON.stringify(S.flt[S.view]||{}));
 S.fCat=cat||(S.fCatView===S.view&&keys.includes(S.fCat)?S.fCat:keys[0]);S.fCatView=S.view;   // last category is remembered per page
 const d=S.fDraft,k=S.fCat,c=cats[k],n=lfCount(d[k]);
 const pane=c.date?lfRange(k,d[k]):`<div class="lf-opts">${c.opts().map(v=>`<label class="opt lf-opt"><input type="checkbox" value="${esc(v)}" ${(d[k]||[]).includes(v)?"checked":""} onchange="fTog('${k}',this.value,this.checked)"> ${esc(v)}</label>`).join("")}</div>`;
 const keep=S.fDraft;
 openDrawer({title:"Filters",w:640,bodyCls:"nopad",
  body:`<div class="fpane"><div class="fcat">${keys.map(x=>`<button class="${x===k?"on":""}" onclick="openFilters('${x}')">${x}${lfCount(d[x])?`<span class="cntpill n">${lfCount(d[x])}</span>`:""}</button>`).join("")}</div>
   <div class="fopt lf-pane"><div class="lf-head">${c.date?"":`<span class="lf-n" aria-live="polite">${n} selected</span>`}<button type="button" class="lf-reset" aria-label="Reset ${k}" ${n?"":"disabled"} onclick="lfResetCat('${k}')">Reset</button></div>${pane}</div></div>`,
  foot:`<button class="btn" onclick="S.fDraft={};S.fCal=null;openFilters()">Reset All</button><button class="btn p" onclick="lfApply()">Apply</button>`});
 S.fDraft=keep}
function lfResetCat(k){delete S.fDraft[k];if(S.fCal&&S.fCal.k===k)S.fCal=null;openFilters(k)}
function lfApply(){const d=S.fDraft||{};Object.keys(d).forEach(k=>{if(!lfActive(d[k]))delete d[k]});
 S.flt[S.view]=d;S.fDraft=null;S.fCal=null;
 Object.keys(S.pg||{}).filter(key=>key.startsWith(S.view)||key.startsWith("pr-"+S.view)).forEach(key=>S.pg[key].p=1);   // back to page 1
 closeLayer();render();toast("Filters applied.")}

/* ---------- date range selector (Figma 4631:14697) ----------
   Click a field to make it active (blue border), then pick a day; picking From moves on to To. Days can also be typed
   as MM/DD/YYYY (applied on Enter / leaving the field). Monday-first, 6 rows; today is gray, From / To are blue,
   days between them sit on a light-blue band. Days outside the shown month are gray and still pickable. */
const LF_DAYS=["Mo","Tu","We","Th","Fr","Sa","Su"];
function lfRange(k,v){v=v&&!Array.isArray(v)?v:{from:"",to:""};
 if(!S.fCal||S.fCal.k!==k){const base=v.from||v.to,t=new Date(),[y,m]=base?[+base.slice(0,4),+base.slice(5,7)-1]:[t.getFullYear(),t.getMonth()];
  S.fCal={k,y,m,active:v.from&&!v.to?"to":"from",mode:"days"}}
 const cal=S.fCal,first=new Date(cal.y,cal.m,1),start=new Date(cal.y,cal.m,1-((first.getDay()+6)%7)),t=new Date(),today=ldpISO(t.getFullYear(),t.getMonth(),t.getDate());
 const field=(w,ph)=>`<label class="lf-dr-f ${cal.active===w?"on":""}" data-w="${w}"><input type="text" inputmode="numeric" placeholder="${ph}" value="${ldpMDY(v[w])}" aria-label="${ph} date, MM/DD/YYYY"
   onfocus="lfDrFocus('${w}')" onchange="lfDrType('${k}','${w}',this.value)" onkeydown="if(event.key==='Enter')this.blur()"><img src="/assets/icons/calendar.svg" width="20" height="20" alt=""></label>`;
 let cells="";
 for(let i=0;i<42;i++){const d=new Date(start.getFullYear(),start.getMonth(),start.getDate()+i),iso=ldpISO(d.getFullYear(),d.getMonth(),d.getDate());
  const out=d.getMonth()!==cal.m,sel=iso===v.from||iso===v.to,band=v.from&&v.to&&iso>=v.from&&iso<=v.to&&v.from!==v.to;
  const cls=["lf-cal-c",out&&"out",band&&"band",band&&iso===v.from&&"b-start",band&&iso===v.to&&"b-end"].filter(Boolean).join(" ");
  cells+=`<div class="${cls}"><button type="button" class="lf-cal-d${sel?" sel":""}${iso===today&&!sel?" today":""}" aria-label="${ldpMDY(iso)}" aria-pressed="${sel}" onclick="lfCalPick('${k}','${iso}')">${d.getDate()}</button></div>`}
 /* month and year in the header are buttons: month → pick from the 12 months, year → pick from a page of 12 years */
 const mode=cal.mode||"days",y0=cal.y-(cal.y%12),unit={days:"month",months:"year",years:"12 years"}[mode];
 const head=`<span class="lf-cal-t">${mode==="years"?"":`<button type="button" class="lf-cal-lbl${mode==="months"?" on":""}" aria-label="Choose month, ${LDP_MONTHS[cal.m]}" onclick="lfCalMode('months')">${LDP_MONTHS[cal.m]}</button>`}
   <button type="button" class="lf-cal-lbl${mode==="years"?" on":""}" aria-label="Choose year, ${cal.y}" onclick="lfCalMode('years')">${mode==="years"?`${y0} – ${y0+11}`:cal.y}</button></span>`;
 const body=mode==="months"?`<div class="lf-cal-mg">${LDP_MONTHS.map((n,i)=>`<button type="button" class="lf-cal-pk${i===cal.m?" sel":""}" onclick="lfCalSet('m',${i})">${n.slice(0,3)}</button>`).join("")}</div>`
  :mode==="years"?`<div class="lf-cal-mg">${Array.from({length:12},(_,i)=>y0+i).map(y=>`<button type="button" class="lf-cal-pk${y===cal.y?" sel":""}" onclick="lfCalSet('y',${y})">${y}</button>`).join("")}</div>`
  :`<div class="lf-cal-g">${LF_DAYS.map(x=>`<div class="lf-cal-h">${x}</div>`).join("")}${cells}</div>`;
 return `<div class="lf-dr"><div class="lf-dr-in">${field("from","From")}${field("to","To")}</div>
  <div class="lf-cal"><div class="lf-cal-m"><button type="button" class="lf-cal-nav" aria-label="Previous ${unit}" onclick="lfCalNav(-1)"><img src="/assets/icons/chevron-left.svg" width="20" height="20" alt=""></button>
   ${head}<button type="button" class="lf-cal-nav" aria-label="Next ${unit}" onclick="lfCalNav(1)"><img src="/assets/icons/chevron-right.svg" width="20" height="20" alt=""></button></div>
   ${body}</div></div>`}
/* focus a field: just restyle (a re-render would drop the caret) */
function lfDrFocus(w){if(!S.fCal)return;S.fCal.active=w;document.querySelectorAll(".lf-dr-f").forEach(f=>f.classList.toggle("on",f.dataset.w===w))}
function lfDrSet(k,v){if(v.from&&v.to&&v.from>v.to)[v.from,v.to]=[v.to,v.from];S.fDraft[k]=v;openFilters(k)}
function lfCalPick(k,iso){const cur=S.fDraft[k],v=cur&&!Array.isArray(cur)?{...cur}:{from:"",to:""},cal=S.fCal;
 if(cal.active==="from"){v.from=iso;if(v.to&&v.to<iso)v.to="";cal.active="to"}
 else if(v.from&&iso<v.from){v.from=iso;v.to=""}   // a To before From starts the range over from that day
 else v.to=iso;
 cal.y=+iso.slice(0,4);cal.m=+iso.slice(5,7)-1;lfDrSet(k,v)}
function lfDrType(k,w,text){const cur=S.fDraft[k],v=cur&&!Array.isArray(cur)?{...cur}:{from:"",to:""},iso=lfMdyISO(text);
 if(String(text).trim()&&!iso){openFilters(k);return}   // not a valid MM/DD/YYYY: put the field back
 v[w]=iso;if(iso){S.fCal.y=+iso.slice(0,4);S.fCal.m=+iso.slice(5,7)-1;if(w==="from")S.fCal.active="to"}lfDrSet(k,v)}   // typed From: next pick sets To
/* arrows step by month (days), year (months) or 12 years (years) */
function lfCalNav(dir){const c=S.fCal,mode=c.mode||"days";
 if(mode==="months")c.y+=dir;else if(mode==="years")c.y+=12*dir;else{c.m+=dir;if(c.m<0){c.m=11;c.y--}if(c.m>11){c.m=0;c.y++}}
 openFilters(S.fCat)}
function lfCalMode(m){const c=S.fCal;c.mode=c.mode===m?"days":m;openFilters(S.fCat)}   // clicking the open one again goes back to days
function lfCalSet(part,n){const c=S.fCal;if(part==="m")c.m=n;else c.y=n;c.mode="days";openFilters(S.fCat)}

/* ===== Delete confirmation (Figma Confirmation Dialog 1342:27783), used by Review Cycles and Questionnaires.
   Same dialog shell as the editor's exit dialog (.fc-dlg: pattern, close X, full-width actions) with the red trash icon
   and a red Delete button. desc (the question) and note (what happens, its own paragraph) are HTML, names already escaped; onOk runs on Delete. Cancel / X / Escape / backdrop close it. */
/* confirmDialog: the shared shell. icon = Figma icon file in /assets/icons, tone "danger" (red icon + red button, Delete)
   or "primary" (gray icon + blue button, Archive — Figma 2641:33910). deleteDialog = the delete preset. */
function deleteDialog(o){confirmDialog({icon:"trash-01",tone:"danger",confirm:"Delete",...o})}
function confirmDialog({title,desc,note="",confirm="Confirm",icon="",tone="primary",onOk}){
 window._delOk=onOk;
 $("#layer").insertAdjacentHTML("beforeend",`<div class="mbg" onclick="if(event.target===this)closeModal()"><div class="fc-dlg" role="alertdialog" aria-modal="true" aria-labelledby="delDlgT" aria-describedby="delDlgD">
  <div class="fc-dlg-bg" aria-hidden="true"><img src="/assets/dlg-pattern.svg" width="336" height="336" alt=""></div>
  <button type="button" class="fc-dlg-x" aria-label="Close" onclick="closeModal()"><img src="/assets/x-close-24-gray.svg" width="24" height="24" alt=""></button>
  <div class="fc-dlg-h"><span class="fc-dlg-ic${tone==="danger"?" del":""}" aria-hidden="true"><img src="/assets/icons/${icon}.svg" width="24" height="24" alt=""></span>
   <div class="fc-dlg-t"><h2 id="delDlgT">${title}</h2><div class="del-dlg-d" id="delDlgD"><p>${desc}</p>${note?`<p>${note}</p>`:""}</div></div></div>
  <div class="fc-dlg-a"><button type="button" class="fc-btn" onclick="closeModal()">Cancel</button><button type="button" class="fc-btn ${tone==="danger"?"danger":"p"}" onclick="window._delOk&&window._delOk()">${confirm}</button></div></div></div>`);
 const c=$("#layer .fc-dlg .fc-btn");if(c)c.focus()}

/* Review Cycles: delete a draft (row menu). There's no archive for review cycles — a deleted draft is gone for good
   (the toast's Undo puts it back while it's showing). */
const clRemove=cs=>{const at=cs.map(c=>D.cycles.indexOf(c));cs.forEach(c=>{const i=D.cycles.indexOf(c);if(i>=0)D.cycles.splice(i,1)});
 return ()=>{cs.map((c,j)=>[c,at[j]]).sort((a,b)=>a[1]-b[1]).forEach(([c,i])=>D.cycles.splice(Math.min(i,D.cycles.length),0,c));render()}};
const _cycCancelDel=cycCancel;
cycCancel=function(cid){const c=C(cid);if(!c||c.status!=="Draft")return _cycCancelDel(cid);
 deleteDialog({title:"Delete draft",desc:`Are you sure you want to delete the review cycle draft <b>${esc(c.name)}</b>?`,note:"Note that it will be permanently deleted.",
  onOk:()=>{const undo=clRemove([c]);closeModal();render();toast("Draft deleted.",undo)}})};
/* Review Cycles: delete selected drafts (bulk bar on the Drafts tab) */
clBulkDelete=function(ids){const cs=ids.map(C).filter(Boolean),one=cs.length===1;
 deleteDialog({title:one?"Delete draft":`Delete ${cs.length} drafts`,
  desc:one?`Are you sure you want to delete the review cycle draft <b>${esc(cs[0].name)}</b>?`:`Are you sure you want to delete these <b>${cs.length} review cycle drafts</b>?`,
  note:one?"Note that it will be permanently deleted.":"Note that they will be permanently deleted.",
  onOk:()=>{const undo=clRemove(cs);closeModal();clDone();toast(`${one?"Draft":cs.length+" drafts"} deleted.`,undo)}})};
/* Questionnaires: delete a draft questionnaire — drafts were never used in a cycle, so it's removed (undo in the toast) */
tplDelete=function(id){const t=T(id);if(!t)return;
 deleteDialog({title:"Delete questionnaire",desc:`Are you sure you want to delete the questionnaire draft <b>${esc(t.name)}</b>?`,note:"Note that it will be permanently deleted.",
  onOk:()=>{const i=D.templates.indexOf(t);D.templates.splice(i,1);closeModal();render();toast("Questionnaire deleted.",()=>{D.templates.splice(i,0,t);render()})}})};

/* Questionnaires: Archive (row menu) — Figma Archive dialog 2641:33910 */
tplArchive=function(id){const t=T(id);if(!t)return;
 const live=t.used.map(C).filter(c=>c&&["Active","Paused","Scheduled"].includes(c.status)),n=live.length;
 confirmDialog({icon:"archive",tone:"primary",title:"Are you sure you want to archive?",
  desc:`Once archived, the template can't be used in new review cycles.${n?" Cycles already using it aren't affected.":""}`,
  note:`You can still view it in the <b>Archive</b> tab of <b>Questionnaires</b> and enable it again at any time.`,
  confirm:"Archive",onOk:()=>{closeModal();t_set(id,"Archived")}})};

/* Review Cycles: saving a draft records who last modified it and when (Drafts tab: Last Modified By / Date) */
const _wzSaveMod=wzSave;wzSave=function(...a){_wzSaveMod(...a);const w=W(),c=w&&w.id&&C(w.id);if(!c)return;
 const n=new Date();c.modISO=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;c.modBy="Rachel Kim"};

/* Questionnaires, Archive tab: Enable makes the questionnaire active again and opens it in the editor */
function tplEnable(id){const t=T(id);if(!t)return;t.status="Active";S.tplTab="Active";openBuilder(id);toast(`${t.name} enabled.`)}
