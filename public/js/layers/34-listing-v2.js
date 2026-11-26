/* ===== Performance page, version 2: Overview (view "home"), Review Cycles (view "cycles") and Questionnaires (view "templates").
   One switch for the whole Performance page: Scenarios › Performance page (V1 = the current pages, unchanged).
   V2 changes live only here, in src/styles/30-listing-v2.css (scoped to body.listpage-v2 / body.perf-head) and in
   topnav.js (V2: Performance moves out of the top bar into the HR menu, as a plain link — no dropdown, the page has tabs).
   V2: one "Performance" header with Overview · Review Cycles · Questionnaires tabs. Each listing tab has a toolbar above
   the table card: segmented status control on the left; Search · Filters · Columns · Add on the right.
   The choice is kept in localStorage so a refresh stays on the same version. HR admin only (payroll keeps V1). */
window.PAGE_VER=window.PAGE_VER||(()=>{try{return JSON.parse(localStorage.getItem("pmPageVer"))||{}}catch(e){return {}}})();
/* cycles and templates always share one version (older saved choices could differ: either on V2 → both V2) */
(()=>{const v=PAGE_VER.cycles==="v2"||PAGE_VER.templates==="v2"?"v2":"v1";PAGE_VER.cycles=PAGE_VER.templates=v})();
function setPageVer(v){PAGE_VER.cycles=PAGE_VER.templates=v;try{localStorage.setItem("pmPageVer",JSON.stringify(PAGE_VER))}catch(e){}render()}
const perfAdmin=()=>(S.role||"admin")==="admin";
/* Performance page on V2 (HR admin): the Overview gets the V2 header and the top bar lists Performance under HR */
const perfV2=()=>perfAdmin()&&PAGE_VER.cycles==="v2";
const listpageV2=()=>perfAdmin()&&["cycles","templates"].includes(S.view)&&PAGE_VER[S.view]==="v2";

/* ---------- Header: "Performance" + page tabs ---------- */
const PERF_TABS=[["home","Overview"],["cycles","Review Cycles"],["templates","Questionnaires"]];
const perfTabs=()=>tabBar(PERF_TABS.map(([id,label])=>({id,label})),{active:S.view,label:"Performance",cls:"perf-tabs",onSelect:id=>`nav('${id}')`});
const perfHead=()=>`<div class="ph"><div><h1>Performance</h1></div></div>${perfTabs()}`;

/* ---------- Toolbar: [segmented status control][bulk bar] ……… [Search][Filters][Columns][Add] ---------- */
const lsV2Js=s=>s.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,"&quot;");
function lsV2Tools({seg,bulk="",id,label,add}){const n=fCount();
 return `<div class="tools listing-toolbar"><div class="listing-toolbar__start">${seg}${bulk}</div>
 <div class="row listing-toolbar__end"><div class="srch" role="search"><svg class="srch__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m17.5 17.5-2.917-2.917m2.084-5a7.083 7.083 0 1 1-14.167 0 7.083 7.083 0 0 1 14.167 0Z"/></svg><input id="${id}" type="search" class="srch__input" placeholder="Search" aria-label="${label}" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#${id}');i.focus();i.setSelectionRange(i.value.length,i.value.length)" onkeydown="if(event.key==='Escape'&&this.value){event.preventDefault();lfdClearSearch()}">${S.q?`<button type="button" class="srch__clear" aria-label="Clear search" data-tip="Clear search" onclick="lfdClearSearch()"><img src="/assets/x-close-20-tertiary.svg" width="20" height="20" alt=""></button>`:""}</div>
  <button type="button" class="lb-btn lb-btn--secondary" aria-label="Filters${n?`, ${n} applied`:""}" onclick="openFilters()"><img src="/assets/icons/filter-funnel-02.svg" width="20" height="20" alt=""><span class="lb-btn__label">Filters</span>${n?`<span class="listing-toolbar__count">${n}</span>`:""}</button>
  <button type="button" class="lb-btn lb-btn--secondary" onclick="colMenu(event)">${ic("cols")}<span class="lb-btn__label">Columns</span></button>
  ${add}</div></div>`}
/* search "x" / Escape: clear the text and keep the cursor in the search (SearchBar spec: public/components/search-bar/SearchBar.tsx) */
function lfdClearSearch(){S.q="";render();const i=document.querySelector("#main .listing-toolbar .srch input");if(i)i.focus()}
const lsV2Seg=(tabs,active,label,go)=>btnGroup(tabs.map(t=>({id:t.id,label:t.label,count:t.n})),{active,label,variant:"segmented",onSelect:go});
const lsV2Empty=(what,tab,base)=>S.q?emptyState(`No ${what} match your search`,`Nothing in ${esc(tab)} matches “${esc(S.q)}”. Try a different name or check the other tabs.`)
 :fltOn(S.view)?emptyState(`No ${what} match your filters`,`Nothing in ${esc(tab)} matches the selected filters. Try clearing a filter or check the other tabs.`)
 :emptyState(...base);

/* ---------- Review Cycles ---------- */
const CYC_V2_TABS=[
 {id:"Active",label:"Active",f:c=>["Active","Paused"].includes(c.status)},
 {id:"Scheduled",label:"Scheduled",f:c=>c.status==="Scheduled"},
 {id:"Drafts",label:"Drafts",f:c=>c.status==="Draft"},
 {id:"Closed",label:"Closed",f:c=>c.status==="Closed"}];
const _vCyclesV2=V.cycles;
V.cycles=()=>{if(!listpageV2())return _vCyclesV2();
 if(!CYC_V2_TABS.some(t=>t.id===S.cycTab))S.cycTab="Active";
 const tab=CYC_V2_TABS.find(t=>t.id===S.cycTab);
 D.cycles.forEach(clStamp);
 let rows=D.cycles.filter(tab.f).filter(c=>!S.q||c.name.toLowerCase().includes(S.q.toLowerCase()));
 if(typeof lsFilterRows==="function")rows=lsFilterRows("cycles",rows);
 const list=lsSorted("cycles",rows,clSortVal),cols=clColsOn();
 const sel=[...S.sel].filter(id=>list.some(c=>c.id===id)),all=list.length&&sel.length===list.length,some=sel.length&&!all;
 const seg=lsV2Seg(CYC_V2_TABS.map(t=>({...t,n:D.cycles.filter(t.f).length})),S.cycTab,"Review cycle status",id=>`nav('cycles',{cycTab:'${id}'})`);
 const pk="cycles-"+S.cycTab;
 return `${perfHead()}
 ${lsV2Tools({seg,bulk:sel.length?bulkBar(sel.length,clBulkActs(S.cycTab,sel)):"",id:"cq",label:"Search review cycles",add:`<button type="button" class="lb-btn lb-btn--primary" onclick="startCycle()"><span class="lb-btn__icon lb-btn__icon--plus" aria-hidden="true"></span><span class="lb-btn__label">Add Cycle</span></button>`})}
 <div class="card">${list.length?`<div class="tw"><table class="tbl cyctbl"><thead><tr><th class="cbx"><input type="checkbox" aria-label="Select all cycles" ${all?"checked":""} ${some?'data-indet="1" aria-checked="mixed"':""} onchange="S.sel=new Set(this.checked&&!this.hasAttribute('data-indet')?[${list.map(c=>`'${c.id}'`)}]:[]);S.menu=null;render()"></th>${cols.map(x=>lsTh("cycles",x.k,x.l,x.num?"num":"")).join("")}<th class="act"></th></tr></thead><tbody>${pgRows(list,pk).map(c=>{const n=D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed").length,draft=c.status==="Draft";
  const main=draft?`<button type="button" class="cd-tert" onclick="editDraft('${c.id}')">Continue setup</button>`
   :c.status==="Closed"?(cycCanReopen(c)?`<button type="button" class="cd-tert" onclick="cycReopen('${c.id}')">Reopen</button>`:"")
   :`<button class="btn ghost s" aria-label="Assign review cycle" data-tip="Assign Review Cycle" onclick="assignCycle('${c.id}')">${ic("userplus")}</button>`;
  const on=S.sel.has(c.id);
  return `<tr class="click ${S.hl===c.id?"hl":""} ${on?"sel":""}" onclick="${draft?`editDraft('${c.id}')`:`nav('cycle',{cid:'${c.id}',tab:'overview'})`}"><td class="cbx" onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select ${esc(c.name)}" ${on?"checked":""} onchange="this.checked?S.sel.add('${c.id}'):S.sel.delete('${c.id}');S.menu=null;render()"></td>${cols.map(x=>x.td(c,n,draft)).join("")}
  <td class="act" onclick="event.stopPropagation()"><div class="cyc-act">${main}${cycleMenu(c,false,true)}</div></td></tr>`}).join("")}</tbody>${clSizer(cols)}</table></div>${pgFoot(list.length,pk)}`
  :lsV2Empty("cycles",tab.label,CL_EMPTY[S.cycTab]||CL_EMPTY.Active)}</div>`};

/* Cycle Period cell (V2): a secondary line when a date is close (prototype today = TODAY, app.js):
   Scheduled → "Starts in N days" when the start is within the next 15 days; Active / Paused → "Ends in N days" when the end is.
   0 days reads "Starts today" / "Ends today"; 1 reads "1 day". Only cycles with a calendar period (General Review). */
const CL_SOON_DAYS=15;
const clDaysTo=iso=>Math.round((Date.parse(iso)-Date.parse(toISO(TODAY)))/864e5);
function clSoon(c){const [s,e]=cycDates(c);
 const one=(verb,iso)=>{if(!iso)return"";const n=clDaysTo(iso);if(isNaN(n)||n<0||n>CL_SOON_DAYS)return"";return n?`${verb} in ${n} day${n===1?"":"s"}`:`${verb} today`};
 return c.status==="Scheduled"?one("Starts",s):["Active","Paused"].includes(c.status)?one("Ends",e):""}
(()=>{const col=CL_COLS.find(x=>x.k==="period"),td1=col.td;
 col.td=(c,...a)=>{if(!listpageV2()||clType(c)!=="General Review")return td1(c,...a);const soon=clSoon(c);if(!soon)return td1(c,...a);
  const t=esc(clPeriod(c));return `<td><span class="cl-t" title="${t}">${t}</span><span class="cl-sub">${esc(soon)}</span></td>`}})();

/* ---------- Questionnaires ---------- */
const TPL_V2_MAP={Active:"Active",Starter:"Starter",Drafts:"Draft",Archive:"Archived"};
const tplV2Tabs=()=>[S.newCo?"Starter":"Active","Favorites","Drafts","Archive"].map(id=>({id,label:id==="Favorites"?"Favourites":id,
 f:id==="Favorites"?t=>t.fav&&t.status!=="Draft":t=>t.status===TPL_V2_MAP[id]}));
const TPL_V2_EMPTY={...TPL_EMPTY,Favorites:["No favourites yet","Star a questionnaire to keep it here for quick access."]};
const _vTemplatesV2=V.templates;
V.templates=()=>{if(!listpageV2())return _vTemplatesV2();
 const tabs=tplV2Tabs();if(!tabs.some(t=>t.id===S.tplTab))S.tplTab=tabs[0].id;
 const tab=tabs.find(t=>t.id===S.tplTab);
 let list=D.templates.filter(tab.f);
 if(typeof lsFilterRows==="function")list=lsFilterRows("templates",list);
 if(S.q)list=list.filter(t=>t.name.toLowerCase().includes(S.q.toLowerCase()));
 list=lsSorted("templates",list,tplSortVal);
 const seg=lsV2Seg(tabs.map(t=>({...t,n:D.templates.filter(t.f).length})),S.tplTab,"Questionnaire status",id=>`S.tplTab='${id}';render()`);
 return `${perfHead()}
 ${lsV2Tools({seg,id:"tq",label:"Search questionnaires",add:`<button type="button" class="lb-btn lb-btn--primary" onclick="newTemplate()"><span class="lb-btn__icon lb-btn__icon--plus" aria-hidden="true"></span><span class="lb-btn__label">Add Questionnaire</span></button>`})}
 ${S.newCo&&S.tplTab==="Starter"?`<div class="note">Starter questionnaires are built for construction crews and offices, in English and Spanish. Preview one and save it to finish step 3 of setup.</div>`:""}
 <div class="card">${list.length?`<div class="tw"><table class="tbl tpltbl"><thead><tr><th class="cbx"><input type="checkbox" aria-label="Select all"></th>${tplColsOn().map(x=>lsTh("templates",x.k,x.l,x.num?"num":"")).join("")}<th class="act"></th></tr></thead><tbody>${list.map(t=>
  `<tr class="click" onclick="openBuilder('${t.id}')"><td class="cbx" onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select ${esc(t.name)}"></td>${tplColsOn().map(x=>x.td(t)).join("")}
  <td class="act" onclick="event.stopPropagation()"><div class="tpl-act">${t.status==="Draft"?`<button type="button" class="cd-tert" onclick="openBuilder('${t.id}')">Continue setup</button>`:t.status==="Archived"?`<button type="button" class="cd-tert" onclick="tplEnable('${t.id}')">Enable</button>`:`<button class="btn ghost s ${t.fav?"fav":""}" aria-label="${t.fav?"Remove from favourites":"Add to favourites"}" data-tip="${t.fav?"Remove from Favourites":"Add to Favourites"}" aria-pressed="${!!t.fav}" onclick="T('${t.id}').fav=!T('${t.id}').fav;render()">${ic("star")}</button>`}${tplMenu(t)}</div></td></tr>`).join("")}</tbody>${tplSizer(tplColsOn())}</table></div>${pgFoot(list.length)}`
  :lsV2Empty("questionnaires",tab.label,TPL_V2_EMPTY[S.tplTab]||TPL_V2_EMPTY.Active)}</div>`};

/* ---------- body classes + the Overview header tabs ---------- */
const _renderListpageV2=render;
render=function(...a){
 /* set the V2 class before the page renders: earlier layers measure the table during render (e.g. clPinSync measures the
    checkbox column for the pinned name column). Set after, the first render from another page measured V1's 68px
    checkbox column, so the pinned name column sat 16px too far right and left a gap. */
 document.body.classList.toggle("listpage-v2",listpageV2());
 _renderListpageV2(...a);
 document.body.classList.toggle("listpage-v2",listpageV2());
 const home=S.view==="home"&&perfAdmin()&&perfV2();document.body.classList.toggle("perf-head",home);
 /* Overview on V2: same header as the other tabs — title + tabs only (no New Review Cycle split button) */
 if(home){const h=document.querySelector("#main>.pagehead");if(h){const k=h.querySelector(".ph>.kebab");if(k)k.remove();
  if(!h.querySelector(".perf-tabs"))h.insertAdjacentHTML("beforeend",perfTabs())}
  /* Cycles card Active / Closed toggle: the segmented control (Figma 9768:54864), like the listing tabs */
  document.querySelectorAll("#main .lb-bgrp:not(.lb-bgrp--segmented)").forEach(g=>g.classList.add("lb-bgrp--segmented"))}
 if(listpageV2())colSync()};

/* V2 display names for filter categories (the S.flt keys stay the same, so V1 and V2 share applied filters) */
const LFD_LBL={"Rating System":"Rating"};
const lfdLbl=k=>LFD_LBL[k]||k;
/* Filters drawer on a V2 page: show the V2 category names (left list + the category's Reset label) */
const _openFiltersV2=openFilters;
openFilters=function(...a){_openFiltersV2(...a);if(!listpageV2())return;
 document.querySelectorAll("#layer .fpane .fcat button").forEach(b=>{const t=b.firstChild;if(t&&t.nodeType===3&&LFD_LBL[t.nodeValue])t.nodeValue=LFD_LBL[t.nodeValue]});
 const r=document.querySelector("#layer .lf-reset");if(r)r.setAttribute("aria-label","Reset "+lfdLbl(S.fCat))};

/* Columns dropdown on V2: Columns sits near the right end of the toolbar, so the menu lines up with the button's
   right edge (V1 lines up with its left edge). */
const _colSyncV2=colSync;
colSync=function(...a){_colSyncV2(...a);if(!listpageV2())return;const p=document.getElementById("colPop"),b=colBtn();if(!p||!b)return;
 const r=b.getBoundingClientRect();p.style.left=Math.max(8,Math.min(r.right-p.offsetWidth,innerWidth-p.offsetWidth-8))+"px"};


/* ---------- Review Details page (view "cycle") on V2 ----------
   Header: 16px from the title row to the tabs (V1 is 24px) — body.cd-v2.
   Employees tab — body.cd-people-v2, same body as the Review Cycles tab: white page, toolbar above the table card
   (segmented control + bulk bar left; Search · Filters right), "Search" placeholder with a clear "x", Filters with the
   funnel icon + count badge, 12px card, 16px cell padding, 36px row actions. The toolbar is built inside the card by
   cycPeople (layer 17), so it's moved out after render. */
const cdV2=()=>S.view==="cycle"&&perfV2();
const cdPeopleV2=()=>cdV2()&&(CD_TAB_ALIAS[S.tab]||S.tab)==="people";
function cdClearSearch(){S.q="";render();const i=document.getElementById("rq");if(i)i.focus()}
const _renderCdV2=render;
render=function(...a){
 // classes go on before the page renders, so the table / bulk bar are measured with the V2 sizes
 const cls=()=>{document.body.classList.toggle("cd-v2",cdV2());document.body.classList.toggle("cd-people-v2",cdPeopleV2())};
 cls();_renderCdV2(...a);cls();
 if(!cdPeopleV2())return;
 const card=document.querySelector("#main .cd-body>.cd-card"),tools=card&&card.querySelector(":scope>.cd-tools");if(!tools)return;
 card.before(tools);
 const srch=tools.querySelector(".cd-srch"),inp=srch&&srch.querySelector("input");
 if(inp){inp.placeholder="Search";if(S.q)srch.insertAdjacentHTML("beforeend",`<button type="button" class="srch__clear" aria-label="Clear search" onclick="cdClearSearch()"><img src="/assets/x-close-panel-20.svg" width="20" height="20" alt=""></button>`)}
 const f=tools.querySelector('.cd-tools-r button[onclick^="openFilters"]');
 if(f){const n=fCount();f.setAttribute("aria-label",`Filters${n?`, ${n} applied`:""}`);
  f.innerHTML=`<img src="/assets/icons/filter-funnel-02.svg" width="20" height="20" alt=""> Filters${n?`<span class="listing-toolbar__count">${n}</span>`:""}`}
 // the toolbar and table changed size: re-run what measured them inside the card
 if(typeof cdBulkFit==="function")cdBulkFit();
 if(typeof actColFit==="function")actColFit();
 if(typeof cdKbPlace==="function")cdKbPlace();
 cdRzAdd()};

/* Employees table: resizable columns, like the Review Cycles table (.ls-rz handle on the right edge of each sortable header).
   The table is fixed-layout with a <colgroup>, so widths go on the <col>s. The first drag freezes every data column at its
   current width; only the dragged one changes after that (min 80px). If the columns don't fill the card, the last data
   column (Status) takes the spare room. Checkbox / chevron / actions keep their widths. Kept per session in S.colW.emp. */
const CD_RZ_COL={Employee:"c-emp",Reviewer:"c-rev",Questionnaire:"c-tpl",Due:"c-due",Status:"c-st"};
const cdRzTable=()=>document.querySelector("#main .cd-card .cd-tbl-fixed");
function cdRzAdd(){const t=cdRzTable();if(!t)return;
 t.querySelectorAll("thead th.ls-th").forEach(th=>{const k=th.querySelector(".ls-sort")?.dataset.k;if(!k||!CD_RZ_COL[k]||th.querySelector(".ls-rz"))return;
  th.insertAdjacentHTML("beforeend",`<span class="ls-rz" role="separator" aria-orientation="vertical" aria-label="Resize ${esc(th.textContent.trim())} column" onmousedown="cdRzStart(event,'${k}')"></span>`)});
 cdColApply()}
function cdColApply(){const t=cdRzTable(),W=(S.colW||{}).emp;if(!t||!W)return;
 const ks=Object.keys(CD_RZ_COL),col=k=>t.querySelector("col."+CD_RZ_COL[k]);
 ks.forEach(k=>{const c=col(k);if(c&&W[k])c.style.width=W[k]+"px"});
 const fixed=[...t.querySelectorAll("thead th")].filter(th=>!th.classList.contains("ls-th")).reduce((a,th)=>a+th.getBoundingClientRect().width,0);
 const sum=fixed+ks.reduce((a,k)=>a+(W[k]||0),0),avail=t.parentElement.clientWidth;
 const last=col(ks[ks.length-1]);if(last&&sum<avail)last.style.width=(W[ks[ks.length-1]]+avail-sum)+"px";
 t.style.minWidth="0";t.style.width=Math.max(sum,avail)+"px"}
function cdRzStart(e,k){e.preventDefault();e.stopPropagation();
 const t=cdRzTable();if(!t)return;const rz=e.currentTarget,th=rz.closest("th"),L=S.colW||(S.colW={});
 if(!L.emp){L.emp={};t.querySelectorAll("thead th.ls-th").forEach(h=>{const hk=h.querySelector(".ls-sort")?.dataset.k;if(CD_RZ_COL[hk])L.emp[hk]=Math.round(h.getBoundingClientRect().width)})}
 cdColApply();
 const x0=e.clientX,w0=L.emp[k];
 rz.classList.add("is-drag");document.body.classList.add("ls-resizing");
 const move=ev=>{L.emp[k]=Math.max(LS_COL_MIN,Math.round(w0+ev.clientX-x0));cdColApply()};
 const up=()=>{removeEventListener("mousemove",move);removeEventListener("mouseup",up);rz.classList.remove("is-drag");document.body.classList.remove("ls-resizing");
  if(typeof cdBulkFit==="function")cdBulkFit()};
 addEventListener("mousemove",move);addEventListener("mouseup",up)}
addEventListener("resize",()=>{if(cdPeopleV2())cdColApply()});

/* ---- Peer nominations (V2): seed a few nominations still waiting for approval in 2026 Annual Review — Office (c3),
   so the Employees tab shows Approve / Reject. Only read in V2 (cdPeerPending in 17-cycle-detail-layout.js). ---- */
function peerNomSeed(){if(S.newCo)return;
 D.packets.filter(p=>p.cid==="c3").forEach((p,i)=>{const r=(p.peers||[]).find(x=>x.by==="Peer reviewer 3");if(r&&i%3===0&&r.st==="Not started")r.ap="pending"})}
const _initPN=init;init=function(...a){_initPN(...a);peerNomSeed()};
peerNomSeed();

/* ---------- Created By (Review Cycles + Questionnaires) on V2: 32px avatar before the name ---------- */
function lsPerson(n){return `<span class="person-cell">${av(n,32)}<span class="person-cell__name" title="${esc(n)}">${esc(n)}</span></span>`}
(function(){
 const cyc=CL_COLS.find(x=>x.k==="createdBy"),tpl=TPL_COLS.find(x=>x.k==="by");
 /* Rating System column is just "Rating" on V2 (header, Columns dropdown; the Filters drawer uses LFD_LBL) */
 const rt=CL_COLS.find(x=>x.k==="rating");if(rt){const l=rt.l;Object.defineProperty(rt,"l",{get:()=>perfV2()?"Rating":l,configurable:true})}
 if(cyc){const td=cyc.td;cyc.td=(c,...r)=>perfV2()?`<td>${lsPerson(clStamp(c).createdBy)}</td>`:td(c,...r)}
 if(tpl){const td=tpl.td;tpl.td=(t,...r)=>perfV2()?`<td>${lsPerson(tplBy(t))}</td>`:td(t,...r)}
})();
