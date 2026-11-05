/* ===== Payroll admin: view-only access to review cycles — cycle status and results, nothing else.
   Nav: Review Cycles only. List: no create / select / row actions, no Drafts tab, adds a Results column.
   Detail: Overview + Employees tabs only, no header actions or Edit buttons; the Employees tab is a flat
   read-only table (employee · status · result) with an Export button. Edit controls the shared markup still
   renders are hidden with body.ro-payroll (see 20-payroll-viewer.css). ===== */
ROLE_NAV.payroll=[["cycles","Review Cycles"]];
ROLE_HOME.payroll="cycles";
ROLE_OK.payroll=["cycles","cycle"];
const PR=()=>S&&S.role==="payroll";
const PR_TABS=["overview","people"];

/* final result for one review: the (calibrated) rating once the review is approved or later */
const prFinal=p=>DONE.includes(p.st)||["Disputed","Recalled"].includes(p.st);
const prRating=p=>prFinal(p)?(p.adj||p.rating):null;
function prResult(p){const r=prRating(p);
 if(!r)return `<span class="dim">${prFinal(p)?"No rating":"Pending"}</span>`;
 return `<span class="pr-res"><b class="tab-num">${r}</b> ${esc(D.settings.levels[r-1]||"")}${p.adj&&p.adj!==p.rating?`<span class="pr-cal" title="Calibrated from ${p.rating}">Calibrated</span>`:""}</span>`}
const prLive=c=>D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed");

/* role switch: same as setRole, plus the payroll toast */
const _setRolePR=setRole;
setRole=function(r){if(r!=="payroll")return _setRolePR(r);
 S.role=r;S.pmOpen=false;closeLayer();if(S.newCo)init(false);nav(ROLE_HOME[r]);toast("Viewing as Priya Shah, payroll admin (view only).")};

/* Review Cycles list (view only) */
const _vCyclesPR=V.cycles;
V.cycles=()=>{if(!PR())return _vCyclesPR();
 const tabs=[["Active",c=>["Active","Paused"].includes(c.status)],["Scheduled",c=>c.status==="Scheduled"],["Closed",c=>c.status==="Closed"]];
 if(!tabs.some(t=>t[0]===S.cycTab))S.cycTab="Active";
 const list=D.cycles.filter(tabs.find(t=>t[0]===S.cycTab)[1]).filter(c=>!S.q||c.name.toLowerCase().includes(S.q.toLowerCase())),cols=clColsOn();
 D.cycles.forEach(clStamp);
 const res=c=>{const ps=prLive(c),f=ps.filter(prFinal).length;return ps.length?`<span class="tab-num">${f} of ${ps.length}</span>${f===ps.length?' <span class="dim sm">final</span>':""}`:'<span class="dim">—</span>'};
 return `<div class="ph"><div><h1>Review Cycles</h1><div class="sub">View only · cycle status and results</div></div></div>
 ${tabBar(tabs.map(t=>({id:t[0],label:t[0],count:D.cycles.filter(t[1]).length})),{active:S.cycTab,label:"Review cycle status",onSelect:id=>`nav('cycles',{cycTab:'${id}'})`})}
 <div class="card">${toolbar(`<div class="cl-tools-l"><label class="srch">${ic("search")}<input id="cq" placeholder="Search review cycles" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#cq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label></div>`)}
 ${list.length?`<div class="tw"><table class="tbl cyctbl pr-tbl"><thead><tr>${cols.map(x=>`<th${x.num?' class="num"':""}>${x.l}</th>`).join("")}<th>Results</th></tr></thead><tbody>${pgRows(list,"pr-cycles-"+S.cycTab).map(c=>{const n=prLive(c).length;
  return `<tr class="click" tabindex="0" onclick="nav('cycle',{cid:'${c.id}',tab:'overview'})" onkeydown="if(event.key==='Enter')this.click()">${cols.map(x=>x.td(c,n,false)).join("")}<td>${res(c)}</td></tr>`}).join("")}</tbody></table></div>${pgFoot(list.length,"pr-cycles-"+S.cycTab)}`:clEmpty()}</div>`};

/* cycle detail: only the Overview and Employees tabs */
const _tabBarPR=tabBar;
tabBar=function(items,opts={}){if(PR()&&opts.cls==="cd-tabs")items=items.filter(t=>PR_TABS.includes(t.id));return _tabBarPR(items,opts)};
const _vCyclePR=V.cycle;
V.cycle=()=>{if(PR()){const c=C(S.cid);if(!c||c.status==="Draft"){S.view="cycles";return V.cycles()}if(!PR_TABS.includes(CD_TAB_ALIAS[S.tab]||S.tab))S.tab="overview"}return _vCyclePR()};

/* Employees tab (view only): employee · status · result */
const _cycPeoplePR=cycPeople;
cycPeople=function(c,ps,attn){if(!PR())return _cycPeoplePR(c,ps,attn);
 const live=ps.filter(p=>p.exc!=="Removed"),Q=[["All",()=>true],["Results final",prFinal],["In progress",p=>!prFinal(p)]];
 if(!Q.some(q=>q[0]===S.quick))S.quick="All";
 const q=(S.q||"").toLowerCase(),f=Q.find(x=>x[0]===S.quick)[1];
 const rows=live.filter(f).filter(p=>!q||E(p.eid).name.toLowerCase().includes(q)).sort((a,b)=>E(a.eid).name.localeCompare(E(b.eid).name)),pk="pr-emp-"+c.id+"-"+S.quick;
 return `<div class="cd-card">
  <div class="cd-tools"><div class="cd-tools-l">${btnGroup(Q.map(([id])=>({id,label:id,count:live.filter(Q.find(x=>x[0]===id)[1]).length})),{active:S.quick,label:"Show employees",size:"lg",onSelect:id=>`S.quick='${id}';render()`})}</div>
   <div class="cd-tools-r"><label class="cd-srch">${ic("search")}<input id="rq" placeholder="Search employees" aria-label="Search employees" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#rq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label>
   <button type="button" class="cd-btn" onclick="toast('Results exported for ${esc(c.name).replace(/'/g,"\\'")}.')">${ic("down","s")} Export results</button></div></div>
  ${rows.length?`<div class="tw"><table class="tbl cd-tbl pr-emp"><thead><tr><th>Employee</th><th>Status</th><th>Result</th></tr></thead><tbody>
  ${pgRows(rows,pk).map(p=>{const e=E(p.eid);return `<tr><td><div class="cd-who">${cdAv(e.name)}<div style="min-width:0"><div class="cd-n">${esc(e.name)}</div><div class="cd-s">${esc([e.title,crewName(e.crew)].filter(x=>x&&x!=="—").join(" · "))}</div></div></div></td>
   <td>${cdPill(empStatus(p))}</td><td>${prResult(p)}</td></tr>`}).join("")}
  </tbody></table></div>${pgFoot(rows.length,pk)}`:`<div class="empty"><b>No employees here</b><button class="link" onclick="S.quick='All';S.q='';render()">Show all employees</button></div>`}
 </div>`};

/* flag the page so shared markup can hide its edit controls */
const _renderPR=render;
render=function(...a){document.body.classList.toggle("ro-payroll",PR());return _renderPR(...a)};
render();
