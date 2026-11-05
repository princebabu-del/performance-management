/* ===== Foreman and Manager (superintendent) overviews on the HR Admin layout:
   summary stat cards (12) · My Tasks (7) | Cycles + a people card stacked (5), same .ov type scale and list rows.
   Data stays scoped to the role's own people; actions are the same ones the previous field dashboards used. ===== */
const fpad=n=>String(n).padStart(2,"0");
/* stat card, same markup as adminStats(); go = click handler, none → static */
function fStat(l,v,d,go,tone){
 const chev=`<svg class="stat-chev" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 return `<${go?`button type="button" onclick="${go}"`:"div"} class="stat${go?"":" static"}${tone?" "+tone:""}"><span class="stat-l"><span class="stat-lt">${l}</span>${go?chev:""}</span><span class="stat-v tab-num">${v}${d?`<span class="stat-d">${d}</span>`:""}</span></${go?"button":"div"}>`}
/* My Tasks card: "Needs attention" rows (severity dot) then "Reviews to give" rows (avatar · pill · button) */
function fTasksCard(att,revs,extra){
 const attItems=att.map(a=>`<div class="att task"><span class="sev ${a[0]}"></span><div class="grow"><div class="t">${a[1]}</div><div class="d">${sepd(esc(a[2]))}</div></div>${a[3]?`<button class="btn s" onclick="${a[4]}">${a[3]}</button>`:""}</div>`);
 const revItems=revs.map(x=>`<div class="att task">${av(x.e.name,30)}<div class="grow"><div class="t">Review ${esc(x.e.name)}</div><div class="d">${[x.e.title,x.type,x.cyc].filter(Boolean).map(esc).join(SEP)}${x.due?`${SEP}Due ${x.due}`:""}</div></div>${rvPill(x.st)}${x.btn}</div>`);
 const grp=(l,items)=>items.length?`<div class="task-grp">${l}<span class="dim">${items.length}</span></div><div>${items.join("")}</div>`:"";
 const n=attItems.length+revItems.length;
 return `<div class="card"><div class="hd"><div class="row" style="gap:8px;flex-wrap:nowrap"><h3>My Tasks</h3><span class="cntpill ${n?"r":"g"}">${n}</span></div>${extra||""}</div>
  ${n?grp("Needs attention",attItems)+grp("Reviews to give",revItems):emptyState("You're all caught up","Reviews you owe and issues that need you will show up here.")}</div>`}
const fBar=(v,l)=>`<div class="row" style="flex-wrap:nowrap;gap:8px" title="${l}"><div class="bar b" style="width:64px"><span style="width:${v}%"></span></div><span class="sm tab-num">${v}%</span></div>`;
/* Cycles card: Active / Closed toggle (shared S.homeCyc), rows scoped to the role's people */
function fCyclesCard(scope,open,fallback){
 const live=dashScoped(["Active","Paused"],scope),done=dashScoped(["Closed"],scope),cv=S.homeCyc==="Closed"?"Closed":"Active";
 const meta=c=>{const rr=clReviewee(c);return [clType(c),clPeriod(c)!=="—"?clPeriod(c):/^Rolling/i.test(c.period||"")?"Rolling":"",rr!=="—"?rr:""].filter(x=>x&&x!=="—").map(esc).join(SEP)};
 const row=(c,right)=>`<button type="button" class="hrow" onclick="${open(c)||fallback}">${cdTypeTile(c).replace('class="cd-tile ','class="cd-tile sm ')}<div class="grow"><div class="hrow-t">${esc(c.name)}${c.status==="Paused"?' <span class="pill a">Paused</span>':""}</div><div class="dim sm hrow-m">${meta(c)}</div></div><div class="hrow-r">${right}${CHEV}</div></button>`;
 const liveL=live.length?`<div class="hlist">${live.map(({c,ps})=>row(c,fBar(pct(ps.filter(p=>p.mgr.st==="Submitted").length,ps.length),"Reviews sent"))).join("")}</div>`
  :emptyState("No active cycles for your people","You'll see them here when HR launches one.");
 const doneL=done.length?`<div class="hlist">${done.map(({c,ps})=>row(c,fBar(pct(ps.filter(p=>/Acknowledged|Closed/.test(p.st)).length,ps.length),"Acknowledged"))).join("")}</div>`
  :emptyState("No closed cycles yet","Results appear here after a cycle closes.");
 return `<div class="card"><div class="hd"><div class="row" style="gap:24px;flex-wrap:nowrap"><h3>Cycles</h3>
  ${btnGroup([{id:"Active",label:"Active",count:live.length},{id:"Closed",label:"Closed",count:done.length}],{active:cv,label:"Show cycles",onSelect:k=>`S.homeCyc='${k}';render()`})}</div></div>
  ${cv==="Active"?liveL:doneL}</div>`}
const fLayout=(stats,tasks,side)=>`<div class="ph"><div><h1>Performance</h1></div></div>
 <div class="dgrid ov"><div class="g12 statrow">${stats.join("")}</div><div class="dcol g7">${tasks}</div><div class="dcol g5">${side.join("")}</div></div>`;

/* --- Foreman --- */
V.fhome=()=>{
 const crewIds=new Set(D.emps.filter(e=>e.mgr===ME||crewRows().some(r=>r.eid===e.id)).map(e=>e.id));
 const scope=p=>p.mgr.by===ME||p.contrib.some(x=>x.by===ME)||crewIds.has(p.eid);
 const c1=C("c1"),mDue=phaseEnd("c1",/manager/i);
 const open=crewRows().filter(r=>r.st!=="Submitted"),other=myTodos().filter(i=>i.p.cid!=="c1");
 const revs=[...open.map(r=>{const e=E(r.eid),ready=rowDone(r);return{e,type:r.kind==="c"?`Borrowed · ${r.hrs} hrs with you`:r.kind==="auto"?r.auto.kind:"Crew review",cyc:r.kind==="auto"?"Automatic review":c1.name,due:r.kind==="auto"?cdMDY(r.auto.due,c1):mDue,st:ready?"Ready to send":r.st,btn:`<button class="btn s" onclick="nav('crew')">${ready?"Review":"Rate"}</button>`}}),
  ...other.map(i=>{const c=cycOf(i.p);return{e:E(i.p.eid),type:i.label,cyc:c.name,due:phaseEnd(c.id,/manager/i),st:i.st,btn:`<button class="btn s" onclick="openWrite(${i.p.id},'${i.kind}')">${i.st==="In progress"?"Continue":"Start review"}</button>`}})];
 const crewPs=D.packets.filter(p=>p.cid==="c1"&&p.exc!=="Removed"&&p.mgr.by===ME),att=[];
 const od=crewPs.filter(p=>p.exc==="Overdue");if(od.length)att.push(["a",`${od.length} self check-in${od.length>1?"s are":" is"} overdue in your crew`,od.map(p=>E(p.eid).name).join(", "),"Remind",`actRemind([${od.map(p=>p.id)}])`]);
 const ex=[...crewIds].map(E).filter(e=>e&&e.certs.some(c=>c.s==="expired"));if(ex.length)att.unshift(["r",`${ex.length} crew member${ex.length>1?"s have":" has"} an expired certification`,ex.map(e=>e.name+" · "+e.certs.find(c=>c.s==="expired").n).join(", "),"View",`openProfile(${ex[0].id},'Performance & Skills')`]);
 (D.reopenReqs||[]).filter(r=>r.by===ME).forEach(r=>{const p=PK(r.pid);if(p)att.push(["b",`Your reopen request for ${E(p.eid).name} is with HR`,"You'll get a text when HR decides","",""])});
 /* stats */
 const live=dashScoped(["Active","Paused"],scope),sent=crewPs.filter(p=>p.mgr.st==="Submitted").length,selfOn=crewPs.filter(p=>p.self.st!=="Off"),selfD=selfOn.filter(p=>p.self.st==="Submitted").length;
 const stats=[
  fStat("Reviews to Give",fpad(revs.length),"",open.length?"nav('crew')":""),
  fStat("Crew Members",fpad(crewIds.size),"","nav('crew')"),
  fStat("Active Cycles",fpad(live.length),"",""),
  fStat("Crew Reviews Sent",`${pct(sent,crewPs.length)}%`,`${sent} of ${crewPs.length}`,"nav('crew')"),
  fStat("Self Check-ins Done",`${pct(selfD,selfOn.length)}%`,`${selfD} of ${selfOn.length}${od.length?`${SEP}${od.length} overdue`:""}`,"",od.length?"warn":"")];
 const rate=open.length?`<button class="btn s" onclick="nav('crew')">Rate whole crew · about ${Math.max(1,Math.ceil(open.length*0.6))} min</button>`:"";
 /* My Crew: people on the Q4 crew review, with their review status */
 const crew=crewPs.map(p=>({p,e:E(p.eid)})).sort((a,b)=>a.e.name.localeCompare(b.e.name)),top=crew.slice(0,5);
 const crewCard=`<div class="card"><div class="hd"><h3>My Crew</h3>${crew.length?viewAll("nav('crew')"):""}</div>
  ${crew.length?`<div class="hlist">${top.map(({p,e})=>`<button type="button" class="hrow" onclick="openProfile(${e.id})">${av(e.name,30)}<div class="grow"><div class="hrow-t">${esc(e.name)}</div><div class="dim sm hrow-m">${esc(e.title)}${SEP}${esc(crewName(e.crew))}</div></div><div class="hrow-r">${rvPill(p.mgr.st==="Submitted"?"Ready to send":p.mgr.st).replace("Ready to send","Sent")}${CHEV}</div></button>`).join("")}</div>`
  :emptyState("No crew members yet","People you manage show up here.")}</div>`;
 return fLayout(stats,fTasksCard(att,revs,rate),[fCyclesCard(scope,c=>c.id==="c1"?"nav('crew')":"nav('myreviews')","nav('myreviews')"),crewCard])};

/* --- Manager (superintendent) --- */
V.shome=()=>{
 const fieldIds=new Set(D.emps.filter(e=>e.crew||e.mgr===SUPER_ME).map(e=>e.id));
 const scope=p=>fieldIds.has(p.eid)||p.mgr.by===SUPER_ME;
 const mine=D.packets.filter(p=>p.mgr.by===SUPER_ME&&p.mgr.st!=="Submitted"&&p.exc!=="Removed"&&["Active","Paused"].includes(C(p.cid).status));
 const revs=mine.map(p=>{const c=C(p.cid),ip=p.mgr.st==="In progress";return{e:E(p.eid),type:"Manager review",cyc:c.name,due:phaseEnd(c.id,/manager/i),st:p.mgr.st,btn:`<button class="btn s" onclick="openWrite(${p.id},'mgr')">${ip?"Continue":"Start review"}</button>`}});
 const crews=D.crews.map(c=>{const ps=D.packets.filter(p=>p.cid==="c1"&&p.exc!=="Removed"&&p.mgr.by===c.fm);return{c,ps,d:ps.filter(p=>p.mgr.st==="Submitted").length}});
 const behind=crews.filter(x=>x.ps.length&&x.d/x.ps.length<0.5),att=[];
 if(behind.length)att.push(["a",`${behind.length} foremen are behind on crew reviews`,behind.map(x=>`${x.c.fm} ${x.d}/${x.ps.length}`).join(" · ")+` · Due ${phaseEnd("c1",/manager/i)}`,"Nudge all",`toast('Text sent to ${behind.length} foremen with a link to their crew review.')`]);
 const oc=outliers().filter(o=>!o.done).length;if(oc)att.push(["b",`${oc} ratings to check before sharing`,"Optional outlier check · Q3 2026","Check outliers","nav('outliers')"]);
 const rot=D.emps.filter(e=>e.rot).length;if(rot)att.push(["b",`${rot} worker${rot>1?"s":""} rotated between 3 foremen this quarter`,"Each foreman with 40+ hrs rates them, weighted by hours","View crews","nav('crews')"]);
 /* stats */
 const live=dashScoped(["Active","Paused"],scope),all=crews.flatMap(x=>x.ps),sent=all.filter(p=>p.mgr.st==="Submitted").length,od=all.filter(p=>p.exc==="Overdue").length;
 const stats=[
  fStat("Crews",fpad(D.crews.length),"","nav('crews')"),
  fStat("Field Workers",fpad(fieldIds.size),"",""),
  fStat("Active Cycles",fpad(live.length),"",""),
  fStat("Ratings to Check",fpad(oc),"","nav('outliers')"),
  fStat("Crew Review Completion",`${pct(sent,all.length)}%`,`${sent} of ${all.length}${od?`${SEP}${od} overdue`:""}`,"",od||behind.length?"warn":"")];
 /* Crews: one row per crew, foreman + headcount, crew review progress */
 const crewCard=`<div class="card"><div class="hd"><h3>Crews</h3>${viewAll("nav('crews')")}</div>
  <div class="hlist">${crews.map(({c,ps,d})=>`<button type="button" class="hrow" onclick="nav('crews')">${av(c.fm,30)}<div class="grow"><div class="hrow-t">${esc(c.name)}</div><div class="dim sm hrow-m">${esc(c.fm)}${SEP}${ps.length} ${ps.length===1?"person":"people"}</div></div><div class="hrow-r">${fBar(pct(d,ps.length),"Crew reviews sent")}${CHEV}</div></button>`).join("")}</div></div>`;
 return fLayout(stats,fTasksCard(att,revs),[fCyclesCard(scope,c=>c.id==="c1"?"nav('crews')":c.id==="c2"?"nav('outliers')":"","nav('crews')"),crewCard])};
render();
