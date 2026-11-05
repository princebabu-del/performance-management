/* ===== Review cycle detail page, laid out like the LMS course detail (Figma LMS 1:17316).
   Sub header (← Review Cycles) · header (name, metadata strip, kebab + Assign) · tabs (Employees · Outlier check · Settings · Audit Log)
   · Employees tab: table card (search · quick filters · Filters, sortable table, pagination).
   Same data as before, only rearranged. ===== */
P.kebab='<circle cx="12" cy="5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="19" r="1.3"/>';
/* "Oct 1" / "Nov 15, 2026" → MM/DD/YYYY; dates without a year take the cycle's start year (or the next year when they fall before the start month) */
function cdMDY(str,c){if(!str)return"";if(/^\d{2}\/\d{2}\/\d{4}$/.test(str))return str;const s=(cycDates(c)[0]||"2026-01-01"),y0=+s.slice(0,4),m0=+s.slice(5,7);
 let t=Date.parse(/\d{4}/.test(str)?str:`${str}, ${y0}`);if(isNaN(t))return str;let d=new Date(t);
 if(!/\d{4}/.test(str)&&d.getMonth()+1<m0)d=new Date(Date.parse(`${str}, ${y0+1}`));
 return `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`}
const cdKV=(k,v)=>`<div class="cd-m"><span class="cd-mk">${k}</span><span class="cd-mv">${v}</span></div>`;
const cdStrip=items=>`<div class="cd-meta">${items.join('<span class="cd-div" aria-hidden="true"></span>')}</div>`;
/* ISO → "Sep 15, 2026" */
const cdMMM=iso=>iso?new Date(iso+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}):"";
/* review-type icon tile (56×56) before the cycle name — Lucide icons (lucide-static 0.460.0, ISC), one color per type */
const CD_TYPE_TILE={
 "General Review":{k:"general",svg:'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M17 14h-6"/><path d="M13 18H7"/><path d="M7 14h.01"/><path d="M17 18h.01"/>'},
 "New Hire Review":{k:"probation",svg:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>'},
 "Project Completion Review":{k:"project",svg:'<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>'},};
const cdTypeTile=c=>{const t=clType(c),d=CD_TYPE_TILE[t]||CD_TYPE_TILE["General Review"];
 return `<span class="cd-tile cd-tile--${d.k}" role="img" aria-label="${esc(t)}" title="${esc(t)}"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d.svg}</svg></span>`};
const cdAv=n=>`<span class="cd-av" aria-hidden="true">${initials(n)}</span>`;
/* header kebab: the existing More menu behind a 44px icon button */
/* the header shows Reopen as its own button, so the ⋮ menu leaves it out */
const cycKebab=c=>cycleMenu(c,true,true).replace('class="btn "','class="cd-iconbtn "').replace(/>More (<svg[\s\S]*?<\/svg>)<\/button>/,`>${ic("kebab")}</button>`);
/* old tab keys still used by links elsewhere: settings → overview, employee-list shortcuts → people */
const CD_TAB_ALIAS={settings:"overview",reviewees:"people",reviewers:"people"};
V.cycle=()=>{
 const c=C(S.cid);if(!c)return V.cycles();clStamp(c);
 S.tab=CD_TAB_ALIAS[S.tab]||S.tab;
 const ps=D.packets.filter(p=>p.cid===c.id),live=ps.filter(p=>p.exc!=="Removed");
 const calN=ps.filter(p=>p.st==="In calibration"||p.st==="Manager submitted").length;
 const tabs=[["overview","Overview"],["people","Employees",live.length]];if(c.calib)tabs.push(["calibration","Outlier check",calN||""]);tabs.push(["audit","Audit Log"]);
 if(!tabs.some(t=>t[0]===S.tab))S.tab="overview";
 const attn=live.filter(needsAttn),per=clPeriod(c);
 const rep=clRepeats(c);
 /* header: name + status badge, then one secondary line (period • reviewee • created by), then the description */
 const rv=clReviewee(c),sub=[clType(c),clType(c)!=="General Review"?clProbSched(c):per==="—"?c.period:per,rv==="—"?"":rv,`Created by ${c.createdBy} on ${isoMDY(c.createdISO)}`].filter(Boolean);
 const canAssign=!["Closed","Archived","Draft"].includes(c.status);
 const body=S.tab==="people"?cycPeople(c,ps,attn):S.tab==="calibration"?cycCalibration(c,ps):S.tab==="audit"?cycAudit(c):cycSettings(c,ps);
 return `<div class="cd">
 <div class="cd-sub"><button type="button" class="cd-back" onclick="nav('cycles')"><img src="/assets/arrow-left-24.svg" width="24" height="24" alt="">Back to Review Cycles</button></div>
 <div class="cd-head">
  <div class="cd-top">
   <div class="cd-info cd-info--tile">${cdTypeTile(c)}<div class="cd-title"><div class="cd-name"><h1>${esc(c.name)}</h1>${pill(c.status==="Paused"?"Paused":c.status)}</div>
    <p class="cd-desc">${sub.map(esc).join('<span class="cd-dot" aria-hidden="true"> • </span>')}</p></div></div>
   <div class="cd-acts">${c.status==="Paused"?`<button type="button" class="cd-btn" onclick="cycResume('${c.id}')">Resume</button>`:""}${cycCanReopen(c)?`<button type="button" class="cd-btn" onclick="cycReopen('${c.id}')">${ic("undo")} Reopen</button>`:""}${cycKebab(c)}${canAssign?`<button type="button" class="cd-btn p" onclick="assignCycle('${c.id}')">${ic("useradd")} Assign</button>`:""}</div>
  </div>
  ${tabBar(tabs.map(t=>({id:t[0],label:t[1],count:t[2]===""?undefined:t[2]})),{active:S.tab,label:"Cycle sections",cls:"cd-tabs",onSelect:id=>`nav('cycle',{cid:'${c.id}',tab:'${id}',quick:'All'})`})}
 </div>
 <div class="cd-body">${body}</div></div>`};
/* stage progress as stat cards */
const cdStats=c=>`<div class="cd-stats">${stageCounts(c).map(s=>`<div class="cd-stat ${s.st||""}"><div class="cd-stat-k">${s.st==="done"?"✓ ":""}${esc(s.n)}${s.st==="cur"?'<span class="cd-now">Current</span>':""}</div>
 <div class="cd-stat-v">${s.t?`${s.d}<span>/${s.t}</span>`:"—"}</div><div class="cd-stat-d">${cdMDY(s.s,c)} – ${cdMDY(s.e,c)}</div></div>`).join("")}</div>`;
function cdSortTh(k,label){const s=S.empSort,on=s&&s.k===k,dir=on?(s.dir>0?"ascending":"descending"):"none";
 return `<th aria-sort="${dir}"><button type="button" class="th-sort ${on?"on":""}" data-k="${k}" onclick="empSort('${k}')">${label}<svg class="th-sort-i" viewBox="0 0 12 12" aria-hidden="true"><path class="up ${on&&s.dir>0?"on":""}" d="M6 2 9 5H3z"/><path class="dn ${on&&s.dir<0?"on":""}" d="M6 10 3 7h6z"/></svg></button></th>`}
/* Employees table: one collapsible group per reviewee. The group row is the reviewee (chevron · attention dot · avatar · name)
   with the packet's overall due date, status and next step; expanding it shows one row per reviewer, in the cycle's reviewer order
   (Settings › Reviewers): role · reviewer · due · that reviewer's status · remind. Needs-attention states are yellow. */
const CD_ATTN=new Set(["Overdue","No reviewer","Disputed","Recalled","Reopened","Abandoned"]);
const CD_REV_DONE=new Set(["Submitted","Approved","Shared","Acknowledged","Closed","Manager submitted"]);
const cdPill=s=>`<span class="pill ${CD_ATTN.has(s)?"a":s==="Completed"?"g":PILL[s]||"n"}"><i></i>${esc(s)}</span>`;
S.empOpen=S.empOpen||new Set();
function cdRemind(id,name){const p=D.packets.find(x=>x.id===id);if(p)log(p,"Reminder sent to "+name);toast(`Reminder sent to ${name}.`);render(true)}
function cdEmpToggle(id){S.empOpen.has(id)?S.empOpen.delete(id):S.empOpen.add(id);render()}
function cdRevs(c,p){const x=csRx(c),rev=x.revs||[],mgrRole=rev.find(r=>/Manager/.test(r))||"Manager",conRole=rev.find(r=>r!==mgrRole)||"Contributor",out=[],skip=p.skip||[];
 rxKeys(x).forEach(k=>{
  const tpl=(rxRow(x,k)||{}).tpl||"",n=out.length,miss=()=>{if(!skip.includes(k))out.push({role:k,by:"",st:"No reviewer",missing:true})};
  if(k==="Self"){if(p.self)out.push({role:"Reviewee",by:E(p.eid).name,st:p.self.st})}
  else if(k==="Peers")(p.peers||[]).forEach(r=>out.push({role:"Peer",by:r.by||r.name,st:r.st||"Not started"}));
  else if(k===mgrRole){if(p.noReviewer||!(p.mgr&&p.mgr.by))miss();else out.push({role:k,by:p.mgr.by,st:p.mgr.st})}
  else{const L=k===conRole?(p.contrib||[]):((p.extra||{})[k]||[]);L.forEach(r=>out.push({role:k,by:r.by,st:r.st}));if(!L.length)miss()}
  out.slice(n).forEach(r=>{r.tpl=tpl;r.mgr=k===mgrRole;r.con=k===conRole})});
 /* the reviewee's own (self) review is always the first row */
 return [...out.filter(r=>r.role==="Reviewee"),...out.filter(r=>r.role!=="Reviewee")]}
function cdKebab(id,label,items){return `<div class="kebab"><button type="button" class="cd-kb" aria-label="${esc(label)}" aria-haspopup="menu" aria-expanded="${S.menu===id}" onclick="toggleMenu('${id}',event)">${ic("kebab")}</button>${S.menu===id?`<div class="menu cd-kb-menu" role="menu">${items.map(i=>`<button type="button" role="menuitem" class="${i[3]?"d":""}" onclick="S.menu=null;${i[2].replace(/"/g,"&quot;")}">${ic(i[0],"s")} ${esc(i[1])}</button>`).join("")}</div>`:""}</div>`}
/* reviewers still owing a review (have a person, not done) */
const cdOpenRevs=(c,p)=>cdRevs(c,p).filter(r=>r.by&&!CD_REV_DONE.has(r.st));
function cdRemindAll(cid,id){const p=PK(id),R=cdOpenRevs(C(cid),p);if(!R.length){toast("Everyone has already submitted.");return}
 log(p,"Reminder sent to "+R.map(r=>r.by).join(", "));toast(`Reminder sent to ${R.length} reviewer${R.length>1?"s":""}.`);render(true)}
/* remove one reviewer from a reviewee's review: their weight is shared by the others; undo from the toast */
function cdRevRemove(id,role,name){const p=PK(id),self=role==="Reviewee";
 reasonModal({title:`Remove ${name} as ${role==="Reviewee"?"self-reviewer":role}`,desc:`${E(p.eid).name}'s review continues without this reviewer. Feedback already submitted is kept.`,confirm:"Remove",danger:true,
  onOk:r=>{const snap=JSON.stringify({self:p.self,mgr:p.mgr,contrib:p.contrib,peers:p.peers,noReviewer:p.noReviewer,extra:p.extra||{}});
   if(self)p.self=null;
   else if(p.mgr&&p.mgr.by===name){p.mgr={...p.mgr,by:""};p.noReviewer=true}
   else{p.contrib=(p.contrib||[]).filter(x=>x.by!==name);p.peers=(p.peers||[]).filter(x=>(x.by||x.name)!==name);if(p.extra&&p.extra[role])p.extra[role]=p.extra[role].filter(x=>x.by!==name)}
   log(p,`${name} removed as reviewer · Reason: ${r}`,"r");render(true);
   toast(`${name} removed from ${E(p.eid).name}'s review.`,()=>{Object.assign(p,JSON.parse(snap));log(p,"Reviewer removal undone","g");render(true)})}})}
/* questionnaire cell: questionnaire name + eye (opens it in the side drawer, "View Questionnaire" tooltip) */
function cdTplCell(id){const t=id&&T(id);if(!t)return '<span class="dim">—</span>';
 return `<div class="cd-tpl"><span class="cd-n cd-tpl-n">${esc(t.name)}</span><span class="rx-tip cs-q-tip" onclick="event.stopPropagation()"><button type="button" class="cs-rv-eye" aria-label="View questionnaire ${esc(t.name)}" onclick="previewTpl('${t.id}')">${ic("eye")}</button><span class="rx-tip-box" role="tooltip">View Questionnaire</span></span></div>`}
/* a role nobody fills: Remove drops it from this reviewee's review (undo from the toast) */
function cdRoleSkip(id,role){const p=PK(id);p.skip=[...(p.skip||[]),role];if(/Manager/.test(role))p.noReviewer=false;log(p,`${role} not required for this review`,"a");render(true);
 toast(`${role} removed from ${E(p.eid).name}'s review.`,()=>{p.skip=p.skip.filter(r=>r!==role);if(/Manager/.test(role)&&!(p.mgr&&p.mgr.by))p.noReviewer=true;log(p,"Role removal undone","g");render(true)})}
/* Assign: dialog to pick people for a missing role — one person for the manager role, any number otherwise */
function cdAssignDlg(cid,id,role){const c=C(cid),p=PK(id),e=E(p.eid),r=cdRevs(c,p).find(x=>x.role===role)||{},one=!!r.mgr,type=one?"radio":"checkbox";
 const sug=(D.crews.find(x=>x.id===e.crew)||{}).fm,people=D.emps.filter(u=>u.id!==e.id).sort((a,b)=>(b.name===sug)-(a.name===sug)||(!!b.isMgr-!!a.isMgr)||a.name.localeCompare(b.name));
 openModal(`<div class="cd-asg"><h3 id="cdAsgT">Assign ${esc(role)}</h3><p class="dim" style="margin:4px 0 16px">${one?"Pick the person":"Pick the people"} who will review ${esc(e.name)} as ${esc(role)}. They're notified right away.</p>
  <label class="cd-srch cd-asg-s">${ic("search")}<input id="cdAsgQ" placeholder="Search people" aria-label="Search people" oninput="const q=this.value.toLowerCase();document.querySelectorAll('.cd-asg-o').forEach(o=>o.hidden=!o.dataset.n.includes(q))"></label>
  <div class="cd-asg-list" role="${one?"radiogroup":"group"}" aria-labelledby="cdAsgT">${people.map(u=>`<label class="cd-asg-o" data-n="${esc(u.name.toLowerCase())}"><input type="${type}" name="cdAsg" value="${esc(u.name)}">${cdAv(u.name)}<span class="cd-asg-t"><span class="cd-n">${esc(u.name)}</span><span class="cd-s">${esc([u.isMgr?"Manager":"",crewName(u.crew)].filter(x=>x&&x!=="—").join(" · "))}</span></span>${u.name===sug?'<span class="asm">Suggested</span>':""}</label>`).join("")}</div>
  <div class="mf"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="button" class="btn p" onclick="cdAssign('${cid}',${id},'${esc(role).replace(/'/g,"\\'")}')">Assign</button></div></div>`,520);
 const d=document.querySelector("#layer .modal");if(d)d.setAttribute("aria-labelledby","cdAsgT");const q=document.getElementById("cdAsgQ");if(q)q.focus()}
function cdAssign(cid,id,role){const names=[...document.querySelectorAll('.cd-asg-o input:checked')].map(i=>i.value);if(!names.length){toast("Pick at least one person.");return}
 const c=C(cid),p=PK(id),r=cdRevs(c,p).find(x=>x.role===role)||{};
 if(r.mgr){p.mgr={...(p.mgr||{}),by:names[0],st:"Not started"};p.noReviewer=false}
 else if(r.con)p.contrib=[...(p.contrib||[]),...names.map(n=>({by:n,st:"Not started"}))];
 else{p.extra=p.extra||{};p.extra[role]=[...(p.extra[role]||[]),...names.map(n=>({by:n,st:"Not started"}))]}
 log(p,`${role} assigned: ${names.join(", ")}`,"g");closeModal();S.empOpen.add(id);render(true);toast(`${names.join(", ")} assigned as ${role} for ${E(p.eid).name}.`)}
/* a reviewer's due date (their own, else the review's); parent row rolls them up: one shared date → that date,
   none at all → "No due date", anything else (different dates, or some with and some without) → "Multiple" */
function cdRevDue(c,p,r){return cdMDY(r.due!==undefined?r.due:p.due,c)}
function cdDueSum(c,p,R){if(!R.length)return'<span class="dim">No due date</span>';const d=new Set(R.map(r=>cdRevDue(c,p,r)));
 if(d.size>1)return"Multiple";const v=[...d][0];return v?v:'<span class="dim">No due date</span>'}
function cdEmpGroup(c,p){const e=E(p.eid),at=needsAttn(p),open=S.empOpen.has(p.id),R=cdRevs(c,p),gid="eg"+p.id;
 const allDone=R.length&&R.every(r=>r.by&&CD_REV_DONE.has(r.st)),q=s=>esc(s).replace(/'/g,"\\'");
 const head=`<tr class="click cd-grp ${S.sel.has(p.id)?"sel":""}" onclick="cdEmpToggle(${p.id})"><td class="cbx" onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select ${esc(e.name)}" ${S.sel.has(p.id)?"checked":""} onchange="this.checked?S.sel.add(${p.id}):S.sel.delete(${p.id});render()"></td>
  <td><div class="cd-who"><span class="rdot" style="visibility:${at?"visible":"hidden"}" ${at?'title="Needs attention"':""}></span><button type="button" class="cd-chev ${open?"open":""}" aria-expanded="${open}" aria-controls="${gid}" aria-label="${open?"Hide":"Show"} reviewers for ${esc(e.name)}" onclick="event.stopPropagation();cdEmpToggle(${p.id})"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 5l5 5-5 5"/></svg></button>${cdAv(e.name)}<div style="min-width:0"><button type="button" class="cd-n cd-n-link" title="View employee profile" onclick="event.stopPropagation();openProfile(${e.id},'Performance & Skills','${c.id}')">${esc(e.name)}</button><div class="cd-s">${e.code?"#"+esc(e.code):"—"}</div></div></div></td>
  <td><span class="cd-n tab-num" title="${R.length} reviewer${R.length===1?"":"s"}">${R.length}</span></td>
  <td>${(n=>`<span class="cd-n tab-num" title="${n} questionnaire${n===1?"":"s"}">${n}</span>`)(new Set(R.map(r=>r.tpl).filter(Boolean)).size)}</td>
  <td class="tab-num">${cdDueSum(c,p,R)}</td>
  <td>${cdPill(p.exc==="Removed"?"Removed":allDone?"Completed":"In progress")}</td>
  <td class="cd-act" onclick="event.stopPropagation()">${cdKebab("eg-"+p.id,`Actions for ${e.name}`,[["user","View employee profile",`openProfile(${e.id},'Performance & Skills','${c.id}')`],["send","Send reminder for all",`cdRemindAll('${c.id}',${p.id})`],["down","Download PDF",`toast('PDF downloaded for ${q(e.name)}.')`],["x","Remove",`actRemove([${p.id}])`,1]])}</td></tr>`;
 if(!open)return head;
 return head+R.map((r,i)=>{const items=[];
   if(r.by&&!CD_REV_DONE.has(r.st))items.push(["send","Send reminder",r.role==="Reviewee"?`actRemind([${p.id}])`:`cdRemind(${p.id},'${q(r.by)}')`]);
   items.push(["x","Remove",r.missing?`cdRoleSkip(${p.id},'${q(r.role)}')`:`cdRevRemove(${p.id},'${q(r.role)}','${q(r.by)}')`,1]);
  return `<tr class="cd-sub-row${r.missing?" is-missing":""}${i===R.length-1?" last":""}" ${i?"":`id="${gid}"`}><td class="cbx"></td><td></td>
  <td>${r.by?`<div class="cd-who">${cdAv(r.by)}<div style="min-width:0"><div class="cd-n">${esc(r.by)}</div><div class="cd-s">${esc(r.role)}</div></div></div>`:`<div class="cd-who"><span class="cd-av cd-av-empty" aria-hidden="true">${ic("user")}</span><div style="min-width:0"><div class="cd-miss">Not assigned</div><div class="cd-s">${esc(r.role)}</div></div></div>`}</td>
  <td>${cdTplCell(r.tpl)}</td>
  <td class="tab-num">${CD_REV_DONE.has(r.st)?'<span class="dim">—</span>':(cdRevDue(c,p,r)||'<span class="dim">No due date</span>')}</td>
  <td>${cdPill(r.st)}</td>
  <td class="cd-act" onclick="event.stopPropagation()"><div class="cd-acts-c">${r.missing?`<button type="button" class="cd-tert" onclick="cdAssignDlg('${c.id}',${p.id},'${q(r.role)}')">Assign</button>`:""}${cdKebab(`er-${p.id}-${i}`,`Actions for ${r.by||r.role}`,items)}</div></td></tr>`}).join("")}
/* Bulk action bar (Figma: Bulk Action Panel): "N selected" · actions · ✕, 12px after the segmented control.
   Actions that don't fit move, from the end, into a "More" dropdown — cdBulkFit() measures after every render and on resize. */
function cdBulkBar(sel,selP){const ap=selP.filter(p=>p.st==="Approved").map(p=>p.id);
 const A=[["send","Send reminder",`actRemind([${sel}])`]];
 if(ap.length)A.push(["check","Share results",`actShare([${ap}])`]);
 A.push(["x","Remove",`actRemove([${sel}])`,1]);
 return bulkBar(sel.length,A)}
/* shared bar markup (also used by the Review Cycles table): A = [[icon, label, js, danger?], …] */
function bulkBar(n,A){
 const js=a=>a[2].replace(/"/g,"&quot;"),open=S.menu==="bulkMore",sel={length:n};
 return `<div class="cd-bulk-wrap"><div class="cd-bulk" role="toolbar" aria-label="Bulk actions">
  <div class="cd-bulk-n" aria-live="polite">${sel.length} selected</div>
  <div class="cd-bulk-acts">${A.map((a,i)=>`<button type="button" class="cd-bulk-a${a[3]?" d":""}" data-i="${i}" onclick="${js(a)}">${ic(a[0])}<span>${a[1]}</span></button>`).join("")}
   <button type="button" class="cd-bulk-a cd-bulk-more" hidden aria-haspopup="menu" aria-expanded="${open}" onclick="toggleMenu('bulkMore',event)"><span>More</span><svg class="cd-bulk-car" viewBox="0 0 20 20" aria-hidden="true"><path d="${open?"M5 12.5l5-5 5 5":"M5 7.5l5 5 5-5"}"/></svg></button></div>
  <button type="button" class="cd-bulk-x" aria-label="Clear selection" onclick="S.sel=new Set();S.menu=null;render()">${ic("x")}</button></div>
  ${open?`<div class="menu cd-bulk-menu" role="menu">${A.map((a,i)=>`<button type="button" role="menuitem" class="${a[3]?"d":""}" data-i="${i}" onclick="S.menu=null;${js(a)}">${ic(a[0],"s")} ${a[1]}</button>`).join("")}</div>`:""}</div>`}
function cdBulkFit(){const wrap=document.querySelector(".cd-bulk-wrap");if(!wrap)return;
 const bar=wrap.querySelector(".cd-bulk"),acts=[...bar.querySelectorAll(".cd-bulk-a:not(.cd-bulk-more)")],more=bar.querySelector(".cd-bulk-more");
 acts.forEach(a=>a.hidden=false);more.hidden=true;
 const fixed=bar.querySelector(".cd-bulk-n").offsetWidth+bar.querySelector(".cd-bulk-x").offsetWidth+4,avail=wrap.clientWidth-fixed;
 let used=acts.reduce((t,a)=>t+a.offsetWidth,0);
 if(used>avail){more.hidden=false;const mw=more.offsetWidth;for(let i=acts.length-1;i>=0&&used+mw>avail;i--){used-=acts[i].offsetWidth;acts[i].hidden=true}}
 const hid=new Set(acts.filter(a=>a.hidden).map(a=>a.dataset.i)),menu=wrap.querySelector(".cd-bulk-menu");
 if(!hid.size&&S.menu==="bulkMore")S.menu=null;
 if(menu){menu.querySelectorAll("[data-i]").forEach(b=>b.hidden=!hid.has(b.dataset.i));menu.style.left=(bar.offsetLeft+more.offsetLeft)+"px"}}
/* row kebab menus float (position:fixed) so the card / table scroller can't clip them; flip above the button near the bottom */
function cdKbPlace(){const m=document.querySelector(".cd-kb-menu");if(!m)return;const b=m.parentElement.querySelector(".cd-kb");if(!b)return;
 const r=b.getBoundingClientRect(),h=m.offsetHeight,w=m.offsetWidth,below=r.bottom+4+h<=innerHeight-8;
 m.style.top=(below?r.bottom+4:Math.max(8,r.top-4-h))+"px";m.style.left=Math.max(8,Math.min(r.right-w,innerWidth-w-8))+"px"}
/* header "select all" boxes marked data-indet show the indeterminate (–) state when only some rows are selected; it's a DOM property, so set it after each render */
const bulkIndet=()=>document.querySelectorAll("input[data-indet]").forEach(i=>{i.indeterminate=true});
const _renderBulk=render;render=function(...a){_renderBulk(...a);bulkIndet();if(S.view==="cycle"){cdBulkFit();cdKbPlace()}if(S.view==="cycles")cdBulkFit()};
addEventListener("resize",()=>{if(S.view==="cycle"){cdBulkFit();cdKbPlace()}if(S.view==="cycles")cdBulkFit()});
addEventListener("scroll",()=>{if(S.view==="cycle")cdKbPlace()},true);
cycPeople=function(c,ps,attn){
 const Q=["All","Needs attention","In progress","Done"];if(ps.some(p=>p.exc==="Removed"))Q.push("Removed");
 if(!Q.includes(S.quick))S.quick="All";
 const cnt=q=>q==="All"?ps.filter(p=>p.exc!=="Removed").length:ps.filter(p=>quickOf(p)===q).length;
 const rows=empSorted(filterPk(ps)),sel=[...S.sel].filter(id=>rows.some(p=>p.id===id)),selP=sel.map(PK),pk="emp-"+c.id+"-"+S.quick;
 return `

 <div class="cd-card">
  <div class="cd-tools"><div class="cd-tools-l">${btnGroup(Q.map(q=>({id:q,label:q,count:cnt(q),tone:q==="Needs attention"&&cnt(q)?"warning":"neutral"})),{active:S.quick,label:"Show employees",size:"lg",onSelect:q=>`S.quick='${q}';S.sel=new Set();render()`})}${sel.length?cdBulkBar(sel,selP):""}</div>
   <div class="cd-tools-r"><label class="cd-srch">${ic("search")}<input id="rq" placeholder="Search employees" aria-label="Search employees" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#rq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label>
   <button type="button" class="cd-btn" onclick="openFilters()">${ic("filter")} Filters${fCount()?` · ${fCount()}`:""}</button></div></div>

  ${rows.length?`<div class="tw"><table class="tbl cd-tbl cd-tbl-fixed"><colgroup><col class="c-cbx"><col class="c-emp"><col class="c-rev"><col class="c-tpl"><col class="c-due"><col class="c-st"><col class="c-act"></colgroup><thead><tr><th class="cbx"><input type="checkbox" aria-label="Select all" ${sel.length&&sel.length===rows.length?"checked":""} ${sel.length&&sel.length<rows.length?'data-indet="1" aria-checked="mixed"':""} onchange="S.sel=new Set(this.checked&&!this.hasAttribute('data-indet')?[${rows.map(p=>p.id)}]:[]);render()"></th>${cdSortTh("Employee","Employee")}${cdSortTh("Reviewer","Reviewer")}<th>Questionnaire</th>${cdSortTh("Due","Due Date")}${cdSortTh("Status","Status")}<th class="cd-act"><span class="cd-vh">Actions</span></th></tr></thead><tbody>
  ${pgRows(rows,pk).map(p=>cdEmpGroup(c,p)).join("")}
  </tbody></table></div>${pgFoot(rows.length,pk)}`:`<div class="empty"><b>No employees here</b><button class="link" onclick="S.quick='All';S.q='';S.flt.cycle={};render()">Show all employees</button></div>`}
 </div>`};
/* Audit Log tab: the activity log, inline */
function cycAudit(c){const ev=D.packets.filter(p=>p.cid===c.id).flatMap(p=>p.hist.map(h=>({...h,n:E(p.eid).name}))).reverse();
 return `<div class="cd-card"><div class="cd-card-hd"><div><h3>Audit Log</h3><p>Every change in this cycle, with who made it and when</p></div><button type="button" class="cd-btn" onclick="toast('Audit log exported.')">${ic("down","s")} Export</button></div>
  ${ev.length?`<div class="bd feed cd-feed">${ev.map(h=>`<div class="ev"><span class="dot ${h.c}"></span><div><b>${esc(h.n)}</b> · ${esc(h.txt)}<div class="m">${h.t} · ${esc(h.who)}</div></div></div>`).join("")}</div>`:`<div class="empty"><b>No activity yet</b></div>`}</div>`}
/* Review drawer: no label, no tabs. One section per cycle the person was in, stacked: the opened cycle first
   (with its next step), then past cycles newest first. Each section: cycle name, period, status, reviewer progress, result. */
function cdPkSection(x,cur,noNext){/* noNext: employee profile: hide the Next step box; an Active cycle whose period hasn't ended shows "In progress" instead of the review status */const c=cycOf(x),e=E(x.eid),ns=nextStep(x),[cs,ce]=cycDates(c);
 const per=cs&&ce?`${isoMDY(cs)} – ${isoMDY(ce)}`:(c.period||"");
 const step=(name,who,st,acts,isDone)=>{if(st==="Off"||!st)return"";const done=isDone??["Submitted","Shared","Acknowledged","Closed"].includes(st);
  return `<div class="tk ${done?"done":""}"><span class="tdot">${done?"✓":""}</span><div class="grow"><div class="b" style="font-weight:500">${name}</div><div class="dim sm">${esc(who)}</div></div>${cdPill(st)}${acts.map(a=>`<button class="btn xs" onclick="${a[1].replace(/"/g,"&quot;")}">${a[0]}</button>`).join("")}</div>`};
 const res=DONE.includes(x.st)||["Disputed","Recalled"].includes(x.st)?(x.st==="Approved"?"Not shared":x.st):"Not shared",r=x.adj||x.rating;
 const acts=a=>cur?a:[];
 return `<section class="pk-cyc${cur?" is-cur":""}">
  <div class="pk-cyc-hd"><div style="min-width:0"><h3>${esc(c.name)}</h3><div class="dim sm">${esc(per)}${cur?" · This cycle":""}</div></div>${pill(noNext&&c.status==="Active"&&(!ce||toISO(TODAY)<=ce)?"In progress":empStatus(x))}</div>
  ${cur&&!noNext&&ns.a.length?`<div class="nextbox"><div class="k">Next step</div><div class="t">${ns.t}</div><div class="row">${ns.a.map(a=>`<button class="btn s ${a.k}" onclick="${a.f.replace(/"/g,"&quot;")}">${a.l}</button>`).join("")}</div></div>`:""}
  <div class="pk-steps">
   ${cdRevs(c,x).map(rv=>{const self=rv.role==="Reviewee",t=rv.tpl&&typeof T==="function"?T(rv.tpl):null,done=CD_REV_DONE.has(rv.st),due=done||rv.missing?"":cdRevDue(c,x,rv),q=v=>esc(v).replace(/'/g,"\\'");
    const who=[rv.by||"Not assigned",t&&t.name,due&&`Due ${due}`].filter(Boolean).join(" · ");
    const a=rv.missing?acts([["Assign",`cdAssignDlg('${c.id}',${x.id},'${q(rv.role)}')`]])
     :done?(self?[["View",`viewForm(${x.id},'self')`]]:rv.mgr?[["View",`viewForm(${x.id},'mgr')`]]:[])
     :acts([["Remind",self?`actRemind([${x.id}])`:`cdRemind(${x.id},'${q(rv.by)}')`]]);
    return step(self?"Self review":`${esc(rv.role)} review`,who,rv.st,a,done)}).join("")}
   ${step("Results",r?`Rating ${r} · ${D.settings.levels[r-1]}${x.adj?` (calibrated from ${x.rating})`:""}`:"Shared after "+(c.calib?"calibration":"manager review"),res,[])}
  </div></section>`}
openPacket=function(id){const p=PK(id),e=E(p.eid),start=x=>cycDates(cycOf(x))[0]||"";
 const others=D.packets.filter(x=>x.eid===p.eid&&x.id!==id&&cycOf(x)).sort((a,b)=>start(b).localeCompare(start(a)));
 openDrawer({avatar:initials(e.name),title:esc(e.name),sub:`${esc(e.title)} · ${crewName(e.crew)}${e.code?` · #${esc(e.code)}`:""}`,w:720,
  body:`<div class="pk-stack">${[p,...others].map(x=>cdPkSection(x,x.id===id)).join("")}${others.length?"":`<p class="dim sm pk-none">No past cycles for ${esc(e.name.split(" ")[0])} yet.</p>`}</div>`,
  foot:`${p.exc==="Removed"?`<button class="btn" onclick="actRestore(${p.id})">Restore</button>`:`<button class="btn d" onclick="actRemove([${p.id}])">Remove</button>`}<span style="flex:1"></span><button class="btn" onclick="toast('PDF downloaded.')">${ic("down","s")} PDF</button><button class="btn p" onclick="closeLayer()">Done</button>`});
 S.pkOpen=id};
render();
