/* ===== Admin dashboard: 12-col grid: my reviews (8) + needs attention (4), then cycles with Live / Closed toggle (12) (no "how it works") ===== */
const ADMIN_ME="Rachel Kim";
ROLE_OK.admin.push("write");
function myAdminReviews(){return D.packets.filter(p=>p.mgr.by===ADMIN_ME&&p.mgr.st!=="Submitted"&&p.exc!=="Removed"&&["Active","Paused"].includes(C(p.cid).status))}
function cycDue(c){const sc=stageCounts(c),cur=sc.find(s=>s.st==="cur")||sc[sc.length-1];return cur}
/* "Oct 9, 2026" → 10/09/2026 */
function mdy(str){const t=Date.parse(str);if(isNaN(t))return str||"—";const d=new Date(t);return `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`}
/* Header split button: New Review Cycle, with Add Questionnaire in the dropdown */
function newCycleSplit(){return `<span class="kebab"><span class="splitbtn"><button class="btn p" onclick="startCycle()">${ic("plus")} New Review Cycle</button><button class="btn p" aria-label="More create options" aria-haspopup="menu" aria-expanded="${S.menu==="homeAdd"}" onclick="toggleMenu('homeAdd',event)">▾</button></span>${S.menu==="homeAdd"?`<div class="menu split-menu" role="menu" style="top:46px"><button role="menuitem" onclick="S.menu=null;newTemplate()">${ic("tpl")} Add Questionnaire</button></div>`:""}</span>`}
const CHEV=`<svg class="hrow-chev" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
/* Metadata separator: one small light-gray dot everywhere in subtext */
const SEP=`<span class="sep" aria-hidden="true">·</span>`,sepd=t=>t.replace(/ [·•] /g,SEP);
/* Card empty state: 16px medium heading, 14px gray description, optional action */
const emptyState=(h,d,act)=>`<div class="es"><div class="es-h">${h}</div><div class="es-d">${d}</div>${act?`<div class="es-a">${act}</div>`:""}</div>`;
/* Gray tertiary "View All ›" button used in card headers */
const viewAll=go=>`<button type="button" class="btn s tert" onclick="${go}">View All${CHEV}</button>`;
/* Summary cards across the top of the HR Admin overview */
function adminStats(live,att){
 const pad=n=>String(n).padStart(2,"0"),cyc=D.cycles.filter(c=>c.status!=="Archived"),by=st=>cyc.filter(c=>c.status===st).length;
 const tpl=D.templates.filter(t=>!["Archived","Starter"].includes(t.status)),tplDraft=tpl.filter(t=>t.status==="Draft").length;
 const lp=D.packets.filter(p=>live.some(c=>c.id===p.cid)&&p.exc!=="Removed"),subm=lp.filter(p=>p.mgr&&p.mgr.st==="Submitted").length,od=lp.filter(p=>p.exc==="Overdue").length;
 const chev=`<svg class="stat-chev" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 /* go = click handler; cards without one render as plain, non-interactive blocks */
 const card=(l,v,d,go,tone)=>`<${go?`button type="button" onclick="${go}"`:"div"} class="stat${go?"":" static"}${tone?" "+tone:""}"><span class="stat-l"><span class="stat-lt">${l}</span>${go?chev:""}</span><span class="stat-v tab-num">${v}${d?`<span class="stat-d">${d}</span>`:""}</span></${go?"button":"div"}>`;
 return `<div class="g12 statrow">${[
  card("Active Cycles",`${pad(live.length)}<span class="stat-of">/${pad(cyc.length)}</span>`,"",`nav('cycles',{cycTab:'Active'})`),
  card("Scheduled Cycles",pad(by("Scheduled")),"",`nav('cycles',{cycTab:'Scheduled'})`),
  card("Draft Cycles",pad(by("Draft")),"",`nav('cycles',{cycTab:'Drafts'})`),
  card("Closed Cycles",pad(by("Closed")),"",`nav('cycles',{cycTab:'Closed'})`),
  card("Questionnaires",pad(tpl.length),"",`nav('templates')`),
  card("Review Completion Rate",`${pct(subm,lp.length)}%`,`${subm} of ${lp.length}${SEP}${od} overdue`,"",od?"warn":"")
 ].join("")}</div>`}
/* ---- My Tasks data (prototype "today" = 10/14/2026) ----
   Rachel Kim owes: 1 peer review (Priya Shah) + manager reviews for her 4 direct reports in 2026 Annual Review — Office.
   Laura Bennett's manager review is in progress; a second Q4 worker has no phone or email on file. */
function myTasksSeed(){
 if(S.newCo)return;
 const c3=D.packets.filter(p=>p.cid==="c3"),by=n=>c3.find(p=>E(p.eid).name===n);
 const priya=by("Priya Shah");if(priya&&!(priya.peers||[]).some(x=>x.by===ADMIN_ME))priya.peers=[{by:ADMIN_ME,st:"Not started"},...(priya.peers||[]).slice(1)];
 const laura=by("Laura Bennett");if(laura&&laura.mgr.by===ADMIN_ME)laura.mgr.st="In progress";
 const q4=D.packets.filter(p=>p.cid==="c1"&&p.exc!=="Removed"),unreach=q4.filter(p=>{const e=E(p.eid);return !e.phone&&!e.email});
 if(unreach.length<2){const e=q4.map(p=>E(p.eid)).find(e=>e.phone&&!e.email&&e.title!=="Foreman");if(e)e.phone=false}
}
const _initMT=init;init=function(...a){_initMT(...a);myTasksSeed()};
myTasksSeed();
/* phase end date of a cycle as MM/DD/YYYY ("Share results" → 10/24/2026) */
const phaseEnd=(cid,re)=>{const c=C(cid),ph=c&&(c.phases||[]).find(x=>re.test(x.n));return ph?cdMDY(ph.e,c):""};
/* Needs attention for the HR admin: [severity, heading, subtext, button, action], red → amber */
attention=function(){
 if(S.newCo)return[];const P=D.packets,it=[];
 const nr=P.filter(p=>p.noReviewer&&p.exc!=="Removed");
 if(nr.length)it.push(["r",`${nr.length} worker${nr.length>1?"s have":" has"} no manager reviewer`,"Q4 2026 Field Crew Check-in · Their manager left on 10/09/2026","Assign reviewer","nr_fix()"]);
 const od=P.filter(p=>p.exc==="Overdue");
 if(od.length)it.push(["a",`${od.length} self review${od.length>1?"s are":" is"} overdue`,`Q4 2026 Field Crew Check-in · Closed ${phaseEnd("c1",/self/i)}, late submissions still accepted`,"Remind all",`actRemind([${od.map(p=>p.id)}])`]);
 const nc=P.filter(p=>p.cid==="c1"&&p.exc!=="Removed"&&!E(p.eid).phone&&!E(p.eid).email);
 if(nc.length)it.push(["a",`${nc.length} worker${nc.length>1?"s":""} can't be reached`,`Q4 2026 Field Crew Check-in · No phone or email on file`,"Update contact",`actContact(${nc[0].id})`]);
 if(D.reopenReqs.length){const r=D.reopenReqs[0],p=PK(r.pid);if(p)it.push(["a",`${r.by} asked to reopen a review`,`${E(p.eid).name} · Q2 2026 · “${r.reason}”`,"Review request","openReopenReq(0)"])}
 return it;
};
/* Reviews the admin owes, as {p, kind:'peer'|'mgr', due ISO-ish sort key}: peer reviews first (earlier due) */
function myAdminTasks(){
 const act=p=>p.exc!=="Removed"&&["Active","Paused"].includes((C(p.cid)||{}).status);
 const peer=D.packets.filter(p=>act(p)&&(p.peers||[]).some(x=>x.by===ADMIN_ME&&x.st!=="Submitted")).map(p=>({p,kind:"peer",st:p.peers.find(x=>x.by===ADMIN_ME).st,due:phaseEnd(p.cid,/peer|self/i)}));
 const mgr=myAdminReviews().map(p=>({p,kind:"mgr",st:p.mgr.st,due:phaseEnd(p.cid,/manager/i)}));
 const key=d=>d?d.slice(6)+d.slice(0,2)+d.slice(3,5):"9";
 return [...peer,...mgr].sort((a,b)=>key(a.due).localeCompare(key(b.due)));
}
/* one source for the My Tasks count: used by the card header and the Overview badge in the top nav */
function myTaskCount(){return S.newCo?0:attention().length+myAdminTasks().length}
V.home=()=>{
 const live=D.cycles.filter(c=>["Active","Paused"].includes(c.status)),done=D.cycles.filter(c=>c.status==="Closed"),att=attention();
 /* My Tasks: things that need the admin (issues first) followed by reviews they owe, as one list */
 const revItems=myAdminTasks().map(({p,kind,st,due})=>{const e=E(p.eid),pid=typeof p.id==="number"?p.id:"'"+p.id+"'",ip=st==="In progress",selfWait=kind==="mgr"&&!ip&&p.self&&!["Submitted","Off"].includes(p.self.st);
   const pill=ip?["b","In progress"]:selfWait?["n","Waiting on self review"]:["a","Not started"];
   return `<div class="att task">${av(e.name,30)}<div class="grow"><div class="t">Review ${esc(e.name)}</div><div class="d">${esc(e.title)}${SEP}${kind==="peer"?"Peer review":"Manager review"}${due?`${SEP}Due ${due}`:""}</div></div><span class="pill ${pill[0]}">${pill[1]}</span><button class="btn s" onclick="openWrite(${pid},'${kind}')">${ip?"Continue":"Start review"}</button></div>`});
 const attItems=att.map(a=>`<div class="att task"><span class="sev ${a[0]}"></span><div class="grow"><div class="t">${a[1]}</div><div class="d">${sepd(esc(a[2]))}</div></div><button class="btn s" onclick="${a[4]}">${a[3]}</button></div>`);
 const grp=(l,items)=>items.length?`<div class="task-grp">${l}<span class="dim">${items.length}</span></div><div>${items.join("")}</div>`:"";
 const nTask=revItems.length+attItems.length;
 const myCard=`<div class="card"><div class="hd"><div class="row" style="gap:8px;flex-wrap:nowrap"><h3>My Tasks</h3><span class="cntpill ${nTask?"r":"g"}">${nTask}</span></div></div>
  ${nTask?grp("Needs attention",attItems)+grp("Reviews to give",revItems):emptyState("You're all caught up","Reviews you owe and issues that need you will show up here.")}</div>`;
 /* Cycle row: type tile · name · type • period • reviewee role · progress (or acknowledged %) · chevron */
 const cycMeta=c=>{const rr=clReviewee(c);return [clType(c),clPeriod(c)!=="—"?clPeriod(c):/^Rolling/i.test(c.period||"")?"Rolling":"",rr!=="—"?rr:""].filter(x=>x&&x!=="—").map(esc).join(SEP)};
 const cycRow=(c,right)=>`<button type="button" class="hrow" onclick="nav('cycle',{cid:'${c.id}',tab:'overview'})">${cdTypeTile(c).replace('class="cd-tile ','class="cd-tile sm ')}<div class="grow"><div class="hrow-t">${esc(c.name)}${c.status==="Paused"?' <span class="pill a">Paused</span>':""}</div><div class="dim sm hrow-m">${cycMeta(c)}</div></div><div class="hrow-r">${right}${CHEV}</div></button>`;
 const bar=(v,l)=>`<div class="row" style="flex-wrap:nowrap;gap:8px" title="${l}"><div class="bar b" style="width:64px"><span style="width:${v}%"></span></div><span class="sm tab-num">${v}%</span></div>`;
 const liveTbl=live.length?`<div class="hlist">${live.map(c=>{const cur=cycDue(c);return cycRow(c,bar(cur?pct(cur.d,cur.t):0,"Current stage progress"))}).join("")}</div>`
  :emptyState("No active cycles","Launch a review cycle to start collecting reviews from your crews and office.",`<button type="button" class="btn s" onclick="startCycle()">${ic("plus")} New Review Cycle</button>`);
 const doneTbl=done.length?`<div class="hlist">${done.map(c=>{const ps=D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed"),ack=ps.filter(p=>/Acknowledged|Closed/.test(p.st)).length;return cycRow(c,bar(pct(ack,ps.length),"Acknowledged"))}).join("")}</div>`
  :emptyState("No closed cycles yet","Results appear here after a cycle closes.");
 const cv=S.homeCyc==="Closed"?"Closed":"Active";
 const cycCard=`<div class="card"><div class="hd"><div class="row" style="gap:24px;flex-wrap:nowrap"><h3>Cycles</h3>
  ${btnGroup([{id:"Active",label:"Active",count:live.length},{id:"Closed",label:"Closed",count:done.length}],{active:cv,label:"Show cycles",onSelect:k=>`S.homeCyc='${k}';render()`})}</div>
  ${(cv==="Active"?live:done).length?viewAll(`nav('cycles',{cycTab:'${cv}'})`):""}</div>
  ${cv==="Active"?liveTbl:doneTbl}</div>`;
 /* last used = latest start date among the cycles that use the questionnaire */
 const lastUsed=t=>(t.used||[]).map(id=>C(id)).filter(Boolean).map(c=>cycDates(c)[0]).filter(Boolean).sort().pop()||"";
 const tpls=D.templates.filter(t=>!["Archived","Starter"].includes(t.status)).sort((x,y)=>lastUsed(y).localeCompare(lastUsed(x))||(Date.parse(y.upd)||0)-(Date.parse(x.upd)||0)).slice(0,5);
 const tplCard=`<div class="card"><div class="hd"><h3>Recent Questionnaires</h3>${tpls.length?viewAll("nav('templates')"):""}</div>
  ${tpls.length?`<div class="hlist">${tpls.map(t=>{const lu=lastUsed(t);return `<button type="button" class="hrow" onclick="openBuilder('${t.id}','')"><div class="grow"><div class="hrow-t">${esc(t.name)}</div><div class="dim sm hrow-m">${esc(t.type)}${SEP}${t.q} question${t.q===1?"":"s"}${SEP}${lu?`Last used ${isoMDY(lu)}`:"Not used yet"}</div></div><div class="hrow-r">${CHEV}</div></button>`}).join("")}</div>`
  :emptyState("No questionnaires yet","Create a questionnaire to use in your review cycles.",`<button type="button" class="btn s" onclick="newTemplate()">${ic("tpl")} Add Questionnaire</button>`)}</div>`;
 return `<div class="ph"><div><h1>Performance</h1></div>${newCycleSplit()}</div>
 <div class="dgrid ov">${adminStats(live,att)}<div class="dcol g7">${myCard}</div><div class="dcol g5">${cycCard}${tplCard}</div></div>`};
const _vw17=V.write;V.write=()=>{const h=_vw17();return S.role==='admin'?h.replace(`<a onclick="nav('myreviews')">My Reviews</a>`,`<a onclick="nav('home')">Performance</a>`):h};
render();
