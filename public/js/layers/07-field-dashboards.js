/* ===== Same dashboard for Foreman and Superintendent (scoped to their people), on the admin's 12-col grid:
   my reviews (8) + needs attention (4), then one Cycles card with a Live / Closed button group (12) ===== */
const SUPER_ME="Dana Whitfield";
ROLE_NAV.foreman.unshift(["fhome","Overview"]);ROLE_NAV.super.unshift(["shome","Overview"]);
ROLE_HOME.foreman="fhome";ROLE_HOME.super="shome";
ROLE_OK.foreman.push("fhome");ROLE_OK.super.push("shome","write");
const mphDue=c=>((c.phases||[]).find(ph=>/manager/i.test(ph.n))||{}).e||"—";
const dashScoped=(st,scope)=>D.cycles.filter(c=>st.includes(c.status)).map(c=>({c,ps:D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed"&&scope(p))})).filter(x=>x.ps.length);
function dashLive(scope,open){const live=dashScoped(["Active","Paused"],scope);
 return `${live.length?`<div class="tw"><table class="tbl"><thead><tr><th>Cycle</th><th class="num">People</th><th>Current stage</th><th>Reviews sent</th><th>Self check-ins</th><th>Needs attention</th></tr></thead><tbody>${live.map(({c,ps})=>{const cur=cycDue(c),sent=ps.filter(p=>p.mgr.st==="Submitted").length,selfOn=ps.filter(p=>p.self.st!=="Off"),selfD=selfOn.filter(p=>p.self.st==="Submitted").length,od=ps.filter(p=>p.exc==="Overdue").length;
  return `<tr class="click" onclick="${open(c)}"><td><div style="font-weight:500">${esc(c.name)}</div><div class="dim sm">${esc(c.period)}</div></td><td class="num">${ps.length}</td><td>${cur?`${cur.n}<div class="dim sm">closes ${cur.e}</div>`:"—"}</td>
  <td><div class="row" style="flex-wrap:nowrap;gap:8px"><div class="bar b" style="width:90px"><span style="width:${pct(sent,ps.length)}%"></span></div><span class="sm tab-num">${sent}/${ps.length}</span></div></td>
  <td>${selfOn.length?`<span class="sm tab-num">${selfD}/${selfOn.length}</span>`:'<span class="dim sm">Off</span>'}</td><td>${od?`<span class="pill r">${od} overdue</span>`:'<span class="dim sm">None</span>'}</td></tr>`}).join("")}</tbody></table></div>`
 :`<div class="empty"><b>No live cycles for your people</b>You'll see them here when HR launches one.</div>`}`}
function dashDone(scope){const done=dashScoped(["Closed"],scope);
 return `${done.length?`<div class="tw"><table class="tbl"><thead><tr><th>Cycle</th><th class="num">People</th><th>Closed</th><th>Average rating</th><th>Acknowledged</th></tr></thead><tbody>${done.map(({c,ps})=>{const r=ps.filter(p=>p.adj||p.rating),avg=r.length?r.reduce((a,p)=>a+(p.adj||p.rating),0)/r.length:0,ack=ps.filter(p=>/Acknowledged|Closed/.test(p.st)).length;
  return `<tr><td><div style="font-weight:500">${esc(c.name)}</div><div class="dim sm">${esc(c.period)}</div></td><td class="num">${ps.length}</td><td>${c.closed||"—"}</td><td>${avg?`${avg.toFixed(1)} · ${D.settings.levels[Math.round(avg)-1]}`:"—"}</td><td>${pct(ack,ps.length)}%</td></tr>`}).join("")}</tbody></table></div>`
 :`<div class="empty"><b>No closed cycles yet</b>Results show here after a cycle closes.</div>`}`}
/* one Cycles card, Live by default; the choice is shared with the admin overview (S.homeCyc) */
function dashCycles(scope,open){const cv=S.homeCyc==="Closed"?"Closed":"Live",n={Live:dashScoped(["Active","Paused"],scope).length,Closed:dashScoped(["Closed"],scope).length};
 return `<div class="card g12"><div class="hd"><div class="row" style="gap:24px;flex-wrap:nowrap"><h3>Cycles</h3>
  ${btnGroup(["Live","Closed"].map(k=>({id:k,label:k,count:n[k]})),{active:cv,label:"Show cycles",onSelect:k=>`S.homeCyc='${k}';render()`})}</div>
  <span class="dim sm">Your people only</span></div>
 ${cv==="Live"?dashLive(scope,open):dashDone(scope)}</div>`}
function dashAtt(items){return items.length?`<div class="card g4"><div class="hd"><h3>Needs your attention</h3><span class="cntpill r">${items.length}</span></div>${items.map(a=>`<div class="att"><span class="sev ${a[0]}"></span><div class="grow"><div class="t">${a[1]}</div><div class="d">${esc(a[2])}</div></div>${a[3]?`<button class="btn s" onclick="${a[4]}">${a[3]}</button>`:""}</div>`).join("")}</div>`:""}
const rvPill=st=>`<span class="pill ${st==="Ready to send"?"g":st==="In progress"?"b":"a"}">${st}</span>`;
/* --- Foreman --- */
V.fhome=()=>{
 const crewIds=new Set(D.emps.filter(e=>e.mgr===ME||crewRows().some(r=>r.eid===e.id)).map(e=>e.id));
 const scope=p=>p.mgr.by===ME||p.contrib.some(x=>x.by===ME)||crewIds.has(p.eid);
 const open=crewRows().filter(r=>r.st!=="Submitted"),other=myTodos().filter(i=>i.p.cid!=="c1");
 const rows=[...open.map(r=>{const e=E(r.eid),ready=rowDone(r);return{e,type:r.kind==="c"?`Borrowed · ${r.hrs} hrs with you`:r.kind==="auto"?r.auto.kind:"Crew review",cyc:r.kind==="auto"?"Automatic review":C("c1").name,due:r.kind==="auto"?r.auto.due:mphDue(C("c1")),st:ready?"Ready to send":r.st,btn:`<button class="btn s ${ready?"":"p"}" onclick="nav('crew')">${ready?"Review":"Rate"}</button>`}}),
  ...other.map(i=>{const e=E(i.p.eid),c=cycOf(i.p);return{e,type:i.label,cyc:c.name,due:mphDue(c),st:i.st,btn:`<button class="btn s p" onclick="openWrite(${i.p.id},'${i.kind}')">${i.st==="In progress"?"Continue":"Start"}</button>`}})];
 const myCard=`<div class="card __myw__"><div class="hd"><h3>Reviews you need to give</h3><div class="row"><span class="cntpill ${rows.length?"r":"g"}">${rows.length}</span>${open.length?`<button class="btn p s" onclick="nav('crew')">Rate whole crew · about ${Math.max(1,Math.ceil(open.length*0.6))} min</button>`:""}</div></div>
  ${rows.length?`<div class="tw"><table class="tbl"><thead><tr><th>Employee</th><th>Review</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(x=>`<tr><td><div class="who">${av(x.e.name,30)}<div><div>${esc(x.e.name)}</div><div class="dim sm">${esc(x.e.title)}</div></div></div></td><td>${esc(x.type)}<div class="dim sm">${esc(x.cyc)}</div></td><td>${x.due}</td><td>${rvPill(x.st)}</td><td style="text-align:right">${x.btn}</td></tr>`).join("")}</tbody></table></div>`
  :`<div class="empty"><b>You're all caught up</b>No reviews waiting for you.</div>`}</div>`;
 const crewPs=D.packets.filter(p=>p.cid==="c1"&&p.exc!=="Removed"&&p.mgr.by===ME),att=[];
 const od=crewPs.filter(p=>p.exc==="Overdue");if(od.length)att.push(["a",`${od.length} self check-in${od.length>1?"s are":" is"} overdue in your crew`,od.map(p=>E(p.eid).name).join(", "),"Remind",`actRemind([${od.map(p=>p.id)}])`]);
 const ex=[...crewIds].map(E).filter(e=>e&&e.certs.some(c=>c.s==="expired"));if(ex.length)att.push(["r",`${ex.length} crew member${ex.length>1?"s have":" has"} an expired certification`,ex.map(e=>e.name+" · "+e.certs.find(c=>c.s==="expired").n).join(", "),"View",`openProfile(${ex[0].id},'Performance & Skills')`]);
 (D.reopenReqs||[]).filter(r=>r.by===ME).forEach(r=>{const p=PK(r.pid);if(p)att.push(["b",`Your reopen request for ${E(p.eid).name} is with HR`,"You'll get a text when HR decides","",""])});
 return `<div class="ph"><div><h1>Performance</h1></div></div>
 <div class="dgrid">${myCard.replace("__myw__",att.length?"g8":"g12")}${dashAtt(att)}${dashCycles(scope,c=>c.id==="c1"?"nav('crew')":"nav('myreviews')")}</div>`};
/* --- Superintendent --- */
V.shome=()=>{
 const fieldIds=new Set(D.emps.filter(e=>e.crew||e.mgr===SUPER_ME).map(e=>e.id));
 const scope=p=>fieldIds.has(p.eid)||p.mgr.by===SUPER_ME;
 const mine=D.packets.filter(p=>p.mgr.by===SUPER_ME&&p.mgr.st!=="Submitted"&&p.exc!=="Removed"&&["Active","Paused"].includes(C(p.cid).status));
 const myCard=`<div class="card __myw__"><div class="hd"><h3>Reviews you need to give</h3><span class="cntpill ${mine.length?"r":"g"}">${mine.length}</span></div>
  ${mine.length?`<div class="tw"><table class="tbl"><thead><tr><th>Employee</th><th>Review</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody>${mine.map(p=>{const e=E(p.eid),c=C(p.cid);return `<tr><td><div class="who">${av(e.name,30)}<div><div>${esc(e.name)}</div><div class="dim sm">${esc(e.title)}</div></div></div></td><td>Manager review<div class="dim sm">${esc(c.name)}</div></td><td>${mphDue(c)}</td><td>${rvPill(p.mgr.st)}</td><td style="text-align:right"><button class="btn s ${p.mgr.st==="In progress"?"":"p"}" onclick="openWrite(${p.id},'mgr')">${p.mgr.st==="In progress"?"Continue":"Start review"}</button></td></tr>`}).join("")}</tbody></table></div>`
  :`<div class="empty"><b>You're all caught up</b>No reviews waiting for you.</div>`}</div>`;
 const att=[];
 const behind=D.crews.map(c=>{const ps=D.packets.filter(p=>p.cid==="c1"&&p.exc!=="Removed"&&p.mgr.by===c.fm);return{c,ps,d:ps.filter(p=>p.mgr.st==="Submitted").length}}).filter(x=>x.ps.length&&x.d/x.ps.length<0.5);
 if(behind.length)att.push(["a",`${behind.length} foremen are behind on crew reviews`,behind.map(x=>`${x.c.fm} ${x.d}/${x.ps.length}`).join(" · ")+` · due ${mphDue(C("c1"))}`,"Nudge all",`toast('Text sent to ${behind.length} foremen with a link to their crew review.')`]);
 const oc=outliers().filter(o=>!o.done).length;if(oc)att.push(["b",`${oc} ratings to check before sharing`,"Optional outlier check · Q3 2026","Check outliers","nav('outliers')"]);
 const rot=D.emps.filter(e=>e.rot).length;if(rot)att.push(["b",`${rot} worker${rot>1?"s":""} rotated between 3 foremen this quarter`,"Each foreman with 40+ hrs rates them, weighted by hours","View crews","nav('crews')"]);
 return `<div class="ph"><div><h1>Performance</h1></div></div>
 <div class="dgrid">${myCard.replace("__myw__",att.length?"g8":"g12")}${dashAtt(att)}${dashCycles(scope,c=>c.id==="c1"?"nav('crews')":c.id==="c2"?"nav('outliers')":"")}</div>`};
/* write page crumb goes back to the role's overview */
const _vw18=V.write;V.write=()=>{const h=_vw18();const home={super:"shome",foreman:"fhome"}[S.role];return home?h.replace(`<a onclick="nav('myreviews')">My Reviews</a>`,`<a onclick="nav('${home}')">Performance</a>`):h};
if(["foreman","super"].includes(S.role))S.view=ROLE_HOME[S.role];
render();
