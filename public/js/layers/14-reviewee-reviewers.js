/* ===== Employees · Reviewers · Overall Rating · Additional Settings for the focused cycle editor.
   Employees = reviewed role + self-evaluation / peer nomination options + optional auto-assignment by group.
   Reviewers = reviewer roles (multi-select) → reviewer table
   (weightage, questionnaire, due date, sees self-evaluation, reviewee can view, anonymous, remove) → one global fallback.
   Choices are synced back into w.roles so assignment, questionnaires and launch checks keep working. ===== */
const RX_ROLES=["Worker","Foreman","Crew Manager","Project Manager","Department Manager","Branch Manager","HR Manager"];
const RX_MGR_TYPE={"Crew Manager":"emp","Project Manager":"project","Department Manager":"dept","Branch Manager":"branch"};
const rxRank=r=>RX_ROLES.indexOf(r);
const rxLc=r=>r.replace(/\b(?!HR\b)\w+/g,s=>s.toLowerCase());   // "Crew Manager" → "crew manager", keeps "HR"
const rxIsRole=k=>RX_ROLES.includes(k);
function rxInit(w){const x=w.rx||(w.rx={reviewee:"",revs:[],self:false,peers:false,peerMode:"count",peerMax:3,rows:{},fb:"",wSet:false,creds:false,reopen:false});
 if(x.peerMode===undefined){x.peerMode="count";if(!(x.peerMax>=1))x.peerMax=3;delete x.peerLimit}
 if(!x.revEdit){x.revEdit={on:!!x.editAfter};delete x.editAfter;delete x.editDays}
 if(!x.selfEdit)x.selfEdit={on:false};
 if(x.reopenWin===undefined){x.reopenWin="period";if(!(x.reopenMonths>=1))x.reopenMonths=3}
 if(x.reopenMonths===undefined)x.reopenMonths=3;
 if(!Array.isArray(x.reopenBy))x.reopenBy=["Admin"];
 x.reopenBy=[...new Set(x.reopenBy.map(o=>({Admins:"Admin","HR Managers":"HR Manager"})[o]||o).filter(o=>RX_REOPEN_BY.includes(o)))];
 return x}
/* table rows, in a stable order: roles low → high, then peers, then self */
const rxKeys=x=>[...RX_ROLES.filter(r=>x.revs.includes(r)),...(x.peers?["Peers"]:[]),...(x.self?["Self"]:[])];
function rxDefTpl(x,k){if(k==="Self")return "t1";if(k==="Peers")return "t4";
 if(x.reviewee){const d=rxRank(k)-rxRank(x.reviewee);if(d<0)return "t5";if(d===0)return "t4"}return "t2"}
function rxRow(x,k){const r=x.rows[k]||(x.rows[k]={w:0,seeSelf:rxIsRole(k)&&k!=="Worker",anon:k==="Peers"||k==="Worker"});
 if(r.revSees===undefined)r.revSees=true;if(!r.revSees)r.anon=false;
 if(!r.tpl||!T(r.tpl)||T(r.tpl).status==="Archived")r.tpl=rxDefTpl(x,k);return r}
const rxName=k=>k==="Self"?"Reviewee":k==="Peers"?"Peer nominees":k;
/* ---- weightage ---- */
const rxTotal=x=>rxKeys(x).reduce((a,k)=>a+(+rxRow(x,k).w||0),0);
function rxSplitRows(x){const K=rxKeys(x);if(!K.length)return;const b=Math.floor(100/K.length);let extra=100-b*K.length;K.forEach(k=>{rxRow(x,k).w=b+(extra-->0?1:0)})}
function rxSplit(){const x=rxInit(W());rxSplitRows(x);x.wSet=false;rxClear("weight");render()}
/* hard rule: when someone has no person in a reviewer role, that weightage is split evenly across their other reviewers */
/* ---- keep the older role model in step ---- */
function rxSync(w){const x=rxInit(w),r=rolesInit(w),has=k=>x.revs.includes(k),tp=k=>rxRow(x,k).tpl;
 r.Self.on=x.self;if(x.self)r.Self.tpl=tp("Self");
 r.Peer.on=x.peers||has("Worker");if(x.peers){r.Peer.who=1;r.Peer.tpl=tp("Peers")}else if(has("Worker"))r.Peer.tpl=tp("Worker");
 r.Foreman.on=has("Foreman");if(r.Foreman.on)r.Foreman.tpl=tp("Foreman");
 r.Admin.on=has("HR Manager");if(r.Admin.on)r.Admin.tpl=tp("HR Manager");
 const ms=Object.keys(RX_MGR_TYPE).filter(has);r.Manager.on=ms.length>0;if(ms.length){r.Manager.types=ms.map(k=>RX_MGR_TYPE[k]);r.Manager.tpl=tp(ms[0])}
 rolesSync(w)}
/* ---- state changes ---- */
function rxClear(...ks){const e=W()&&W().errs;if(e)ks.forEach(k=>delete e[k])}
function rxChanged(x){if(!x.wSet)rxSplitRows(x);rxClear("revs","weight");render()}
/* workers don't review other workers; every other reviewee can get worker (upward) feedback */
const rxRevOpts=x=>RX_ROLES.filter(r=>!(r==="Worker"&&x.reviewee==="Worker"));
function rxSetReviewee(v){const x=rxInit(W());x.reviewee=v;rxClear("reviewee");x.revs=x.revs.filter(r=>rxRevOpts(x).includes(r));
 Object.keys(x.rows).forEach(k=>{if(rxIsRole(k)&&["t2","t4","t5"].includes(x.rows[k].tpl))x.rows[k].tpl=rxDefTpl(x,k)});
 rxChanged(x)}
function rxToggle(r,on){const x=rxInit(W());x.revs=x.revs.filter(k=>k!==r);if(on)x.revs.push(r);rxChanged(x)}
function rxSet(f,v){const x=rxInit(W());x[f]=v;rxChanged(x)}
function rxRemove(k){const x=rxInit(W());if(k==="Self")x.self=false;else if(k==="Peers")x.peers=false;else x.revs=x.revs.filter(r=>r!==k);rxChanged(x)}
function rxRowSet(k,f,v){const x=rxInit(W());rxRow(x,k)[f]=v;if(f==="seeSelf")rxNotePaint(x)}
/* repaint only the Review-defaults note so the checkbox keeps focus */
function rxNotePaint(x){const old=document.getElementById("rxDefNote");if(old)old.outerHTML=rxDefaultsNote(x,rxKeys(x))}
function rxW(k,el){const x=rxInit(W());let v=parseInt(el.value,10);if(isNaN(v))v=0;v=Math.max(0,Math.min(100,v));rxRow(x,k).w=v;x.wSet=true;rxPaint()}
function rxWBlur(k,el){el.value=rxRow(rxInit(W()),k).w}
function rxPaint(){const x=rxInit(W()),t=rxTotal(x),el=$("#rxTotal");if(t===100)rxClear("weight");
 if(el){el.textContent=t+"%";el.className="rx-total "+(t===100?"is-ok":"is-bad")}}
function rxNum(f,el,err){const x=rxInit(W());x[f]=parseInt(el.value,10)||0;rxClear(err);el.classList.remove("bad");
 const n=el.closest(".rx-opt-b,.rx-nest");const m=n&&n.querySelector(".fc-err");if(m)m.remove()}
function rxPeerMode(v){const x=rxInit(W());x.peerMode=v;if(v==="count"&&!(x.peerMax>=1))x.peerMax=3;rxClear("peerMax");render()}
function rxRevSees(k,on){const r=rxRow(rxInit(W()),k);r.revSees=on;if(!on)r.anon=false;render()}
/* ---- Allow edits after submission: one setting for the reviewee (self-evaluation), one for reviewers.
   Edits stay open until the due date, or the cycle end date when there's no due date. ---- */
function rxEditSet(k,f,v){rxInit(W())[k][f]=v;render()}

/* ---- dropdowns: reviewer multi-select + questionnaire picker ---- */
const RXP={id:null};
function rxOpen(id,e){if(e&&e.target.closest(".rx-tagx"))return;if(FCP.open)fcPeriodClose();RXP.id=RXP.id===id?null:id;render();
 const p=RXP.id&&$(`.rx-pop[data-for="${RXP.id}"]`);if(p){const f=p.querySelector(".rx-search")||p.querySelector("input:checked,input,button");if(f)f.focus({preventScroll:true})}}
function rxClose(focus){if(!RXP.id)return;const id=RXP.id;RXP.id=null;document.querySelectorAll(".rx-pop").forEach(p=>p.remove());
 document.querySelectorAll(".rx-ddbtn[aria-expanded=true]").forEach(b=>b.setAttribute("aria-expanded","false"));
 if(focus){const b=$(`.rx-ddbtn[data-for="${id}"]`);if(b)b.focus()}}
document.addEventListener("mousedown",e=>{if(RXP.id&&!e.target.closest(".rx-dd"))rxClose()});
/* dropdowns inside the horizontally scrolling reviewer table are position:fixed — place them under their field */
function rxPlacePops(){document.querySelectorAll(".rx-scroll .rx-pop").forEach(p=>{const r=p.closest(".rx-dd").getBoundingClientRect(),w=Math.max(r.width,280);
 p.style.width=w+"px";p.style.left=Math.max(16,Math.min(r.left,innerWidth-w-16))+"px";p.style.top=(r.bottom+6)+"px"})}
document.addEventListener("scroll",e=>{if(RXP.id)rxPlacePops();const t=e.target;if(t.classList&&t.classList.contains("rx-scroll"))t.classList.toggle("is-scrolled",t.scrollLeft>0)},true);addEventListener("resize",()=>{if(RXP.id)rxPlacePops()});
document.addEventListener("keydown",e=>{if(RXP.id&&e.key==="Escape")rxClose(true)});
function rxPick(r,on,i){rxToggle(r,on);const c=$("#rxOpt"+i);if(c)c.focus({preventScroll:true})}
function rxTplPick(k,id){rxRowSet(k,"tpl",id);RXP.id=null;render();const b=$(`.rx-ddbtn[data-for="tpl:${k}"]`);if(b)b.focus({preventScroll:true})}
function rxAddTpl(k){RXP.id=null;wzCollect();S.returnTo="wizard";openBuilder(null,"");S.rxTplFor={k,id:S.bld.id}}
const rxTpls=()=>D.templates.filter(t=>!["Archived","Draft"].includes(t.status));
function rxRevsField(w,x){const open=RXP.id==="revs",bad=fcErr(w,"revs");
 const tags=x.revs.length?RX_ROLES.filter(r=>x.revs.includes(r)).map(r=>`<span class="rx-tag">${r}<button type="button" class="rx-tagx" aria-label="Remove ${r}" onclick="rxToggle('${r}',false)">×</button></span>`).join(""):`<span class="rx-ph">Select one or more reviewers</span>`;
 return `<div class="rx-dd">
  <div class="fc-inp rx-ms ${bad?"bad":""} ${open?"open":""}" onclick="rxOpen('revs',event)">${tags}
   <button type="button" class="rx-ddbtn rx-chev" data-for="revs" id="rxRevs" aria-haspopup="true" aria-expanded="${open}" aria-label="Choose reviewer roles${x.revs.length?`, ${x.revs.length} selected`:""}"></button></div>
  ${open?`<div class="rx-pop" data-for="revs" role="group" aria-label="Reviewer roles">${rxRevOpts(x).reverse().map((r,i)=>`<label class="rx-mo"><input class="rx-cb" type="checkbox" id="rxOpt${i}" ${x.revs.includes(r)?"checked":""} onchange="rxPick('${r}',this.checked,${i})"><span>${r}</span>${r===x.reviewee?`<span class="rx-same">Same role</span>`:""}</label>`).join("")}</div>`:""}
 </div>`}
function rxTplFilter(el){const q=el.value.trim().toLowerCase(),pop=el.closest(".rx-tplpop");let n=0;
 pop.querySelectorAll(".rx-oi").forEach(i=>{const hit=!q||i.dataset.n.includes(q);i.hidden=!hit;if(hit)n++});
 pop.querySelector(".rx-none").hidden=n>0}
function rxPrev(id){rxClose();previewTpl(id)}
function rxTplField(x,k){const r=rxRow(x,k),id=`tpl:${k}`,open=RXP.id===id,t=T(r.tpl);
 return `<div class="rx-dd">
  <button type="button" class="fc-inp fc-sel rx-ddbtn rx-tplbtn" data-for="${id}" aria-haspopup="true" aria-expanded="${open}" aria-label="Questionnaire for ${rxName(k)}: ${esc(t?t.name:"none")}" onclick="rxOpen('${id}')"><span>${esc(t?t.name:"Select")}</span></button>
  ${open?`<div class="rx-pop rx-tplpop" data-for="${id}">
   <div class="rx-srch"><input class="rx-search" type="search" placeholder="Search questionnaires" aria-label="Search questionnaires" autocomplete="off" oninput="rxTplFilter(this)"></div>
   <div class="rx-pop-list">${rxTpls().map(o=>`<div class="rx-oi" data-n="${esc(o.name.toLowerCase())}">
    <button type="button" class="rx-o ${o.id===r.tpl?"on":""}" ${o.id===r.tpl?'aria-current="true"':""} onclick="rxTplPick('${k}','${o.id}')"><span class="rx-o-n">${esc(o.name)}</span><span class="rx-o-m">${esc(o.type)} · ${o.q} questions · ~${o.min} min</span></button>
    <button type="button" class="rx-prev" title="Preview" aria-label="Preview ${esc(o.name)}" onclick="rxPrev('${o.id}')">${ic("eye","s")}</button></div>`).join("")}
    <div class="rx-none" hidden>No questionnaires match your search</div></div>
   <button type="button" class="rx-addtpl" onclick="rxAddTpl('${k}')"><span aria-hidden="true">+</span> Add Questionnaire</button></div>`:""}
 </div>`}
/* ---- cards ---- */
const rxHd=(t,d)=>`<div class="fc-hd"><h2>${t}</h2>${d?`<p>${d}</p>`:""}</div>`;
/* number stepper: two small grey stacked chevron buttons inside the right edge of a number field.
   They step the input (respecting min/max) and fire its own oninput, so each field keeps its handler. */
const rxStepB=`<span class="rx-step-b"><button type="button" tabindex="-1" aria-label="Increase" onmousedown="event.preventDefault()" onclick="rxStep(this,1)"><img src="/assets/chevron-down.svg" class="up" width="12" height="12" alt=""></button><button type="button" tabindex="-1" aria-label="Decrease" onmousedown="event.preventDefault()" onclick="rxStep(this,-1)"><img src="/assets/chevron-down.svg" width="12" height="12" alt=""></button></span>`;
function rxStep(btn,d){const i=btn.closest(".rx-step,.rx-pct").querySelector("input");if(!i||i.disabled)return;
 if(i.value==="")i.value=i.min||0;d>0?i.stepUp():i.stepDown();i.dispatchEvent(new Event("input",{bubbles:true}));i.focus()}
const rxCk=(on,act,label,cls="")=>`<label class="rx-ck ${cls}"><input class="rx-cb" type="checkbox" ${on?"checked":""} onchange="${act}"><span class="rx-cl">${label}</span></label>`;
/* Due date: "[count] days [After assignment | Before end date]".
   r.dueN = count ("" = not set, it's optional) · r.dueRef = "assign" (default) | "end" · r.due = resolved ISO date when it can be known. */
const rxCycleLen=w=>{if(w.ctype&&w.ctype!=="General Review")return 0;const s=toISO(w.start),e=toISO(w.end);return s&&e?Math.round((new Date(e)-new Date(s))/864e5)+1:0};
function rxDueMig(r){if(r.dueN===undefined){const old=r.dueDays==null?"":r.dueDays;r.dueN=old;r.dueRef=old===""?"assign":"end"}if(!r.dueRef)r.dueRef="assign";return r}
const rxDueISO=(w,r)=>{const e=toISO(w.end);if(r.dueRef!=="end"||!e||r.dueN==="")return"";const d=new Date(e+"T12:00:00");d.setDate(d.getDate()-r.dueN);return d.toISOString().slice(0,10)};
/* the assigned date is inside the cycle, so either way the count has to be shorter than the cycle */
const rxDueBad=(w,r)=>{rxDueMig(r);const len=rxCycleLen(w);return r.dueN!==""&&len>0&&r.dueN>=len};
function rxDuePaint(k,cell){const w=W(),r=rxRow(rxInit(w),k);r.due=rxDueISO(w,r);
 if(cell){cell.classList.toggle("bad",rxDueBad(w,r));cell.title=r.due?`Due ${fcMDY(r.due)}`:""}
 if(!document.querySelector(".rx-duec.bad"))rxClear("due")}
function rxDueN(k,el){const r=rxRow(rxInit(W()),k),v=parseInt(el.value,10);r.dueN=isNaN(v)?"":Math.max(0,Math.min(365,v));rxDuePaint(k,el.closest(".rx-duec"))}
function rxDueRef(k,el){rxRow(rxInit(W()),k).dueRef=el.value;rxDuePaint(k,el.closest(".rx-duec"))}
function rxDueCell(w,k,r){rxDueMig(r);r.due=rxDueISO(w,r);
 return `<div class="rx-duec ${rxDueBad(w,r)?"bad":""}" ${r.due?`title="Due ${fcMDY(r.due)}"`:""}>
  <div class="rx-step"><input class="fc-inp rx-dn" type="number" inputmode="numeric" min="0" max="365" step="1" placeholder="0" value="${r.dueN}" aria-label="Due date for ${rxName(k)}: number of days (optional)" oninput="rxDueN('${k}',this)">
   ${rxStepB}</div>
  <span class="rx-days" aria-hidden="true">days</span>
  <select class="fc-inp fc-sel rx-dref" aria-label="Due date for ${rxName(k)}: days counted from" onchange="rxDueRef('${k}',this)"><option value="assign" ${r.dueRef==="assign"?"selected":""}>After assignment</option><option value="end" ${r.dueRef==="end"?"selected":""}>Before end date</option></select></div>`}
function rxTable(w,x){const K=rxKeys(x),t=rxTotal(x),sv=x.self,s=toISO(w.start),e=toISO(w.end);
 if(!K.length)return "";
 const na=`<span class="rx-na" aria-label="Not applicable">—</span>`;
 const rows=K.map(k=>{const r=rxRow(x,k),self=k==="Self";
  return `<div class="rx-g rx-r">
   <div class="a-name rx-name">${rxName(k)}</div>
   <div class="a-w"><div class="rx-cl rx-cl-b" aria-hidden="true">Weightage (%)</div><div class="rx-pct"><input type="number" inputmode="numeric" min="0" max="100" step="1" value="${r.w}" aria-label="Weightage for ${rxName(k)}, percent" oninput="rxW('${k}',this)" onblur="rxWBlur('${k}',this)">${rxStepB}</div></div>
   <div class="a-tpl"><div class="rx-cl rx-cl-b" aria-hidden="true">Questionnaire</div>${rxTplField(x,k)}</div>
   <div class="a-due"><div class="rx-cl rx-cl-b" aria-hidden="true">Due date <span class="rx-opt-tag">(optional)</span></div>${rxDueCell(w,k,r)}</div>
   ${sv?`<div class="a-see c ${self?"na":""}">${self?na:rxCk(r.seeSelf,`rxRowSet('${k}','seeSelf',this.checked)`,"Can view self-evaluation")}</div>`:""}
   <div class="a-vis c ${self?"na":""}">${self?na:rxCk(r.revSees,`rxRevSees('${k}',this.checked)`,`Reviewee can view ${rxName(k)}'s review`)}</div>
   <div class="a-anon c ${self?"na":""}">${self?na:`<span ${r.revSees?"":`title="Only available when the reviewee can view this review"`}>${rxCk(r.anon,`rxRowSet('${k}','anon',this.checked)`,"Keep anonymous").replace('type="checkbox"',`type="checkbox" ${r.revSees?"":"disabled"}`)}</span>`}</div>
   <div class="a-x"><button type="button" class="rx-x" aria-label="Remove ${rxName(k)}" title="Remove" onclick="rxRemove('${k}')">×</button></div></div>`}).join("");
 return `<div class="rx-tblock"><div class="rx-grid ${sv?"":"noself"}"><div class="rx-scroll">
  <div class="rx-g rx-head" aria-hidden="true"><div>Reviewer</div><div>Weightage (%)</div><div>Questionnaire</div><div title="Optional">Due date</div>${sv?`<div class="c" title="Can view the self-evaluation">View self-eval</div>`:""}<div class="c" title="The reviewee can view this reviewer's review">Reviewee can view</div><div class="c" title="Hide the reviewer's name from the reviewee">Anonymous</div><div></div></div>
  ${rows}</div>
  <div class="rx-tot"><span class="rx-tot-l">Total Weightage:</span><span id="rxTotal" class="rx-total ${t===100?"is-ok":"is-bad"}">${t}%</span><button type="button" class="rx-link" onclick="rxSplit()">Split evenly</button></div>
 </div>${fcMsg(w,"weight")}${fcMsg(w,"due")}
 ${rxDefaultsNote(x,K)}
 ${banner("info","If someone doesn't have one of these reviewers, that reviewer's weightage is split evenly across their other reviewers.")}</div>`}
/* Settings › Performance › Review defaults apply to every cycle. When this table turns on
   "View self-eval" or "Reviewee can view", say when that actually happens and where to change it. */
const RX_SELFVIS_TXT={"After reviewer submits":"after they submit their own review","Hidden until cycle end":"only after the cycle ends","During review":"while their review is in progress"};
const RX_RESULTS_TXT={"After cycle closes":"after the cycle closes","As soon as their reviews are in":"as soon as their reviews are in"};
/* leaving the editor: keep the cycle as a draft so nothing is lost */
function rxGoSettings(){wzSave(true);nav("settings");toast("Cycle saved as a draft.")}
function rxDefaultsNote(x,K){const st=D.settings,others=K.filter(k=>k!=="Self").map(k=>rxRow(x,k)),lines=[];
 if(x.self&&others.some(r=>r.seeSelf))lines.push(`Reviewers can view the self-evaluation <b>${RX_SELFVIS_TXT[st.selfVis]||esc(String(st.selfVis).toLowerCase())}</b>.`);
 if(others.some(r=>r.revSees))lines.push(st.results==="Never"?`Reviewees <b>don't see</b> their results.`:`Reviewees see their results <b>${RX_RESULTS_TXT[st.results]||esc(String(st.results).toLowerCase())}</b>.`);
  return `<div id="rxDefNote">${lines.length?banner("gray",`${lines.join(" ")} This applies to all cycles and can only be changed in settings. <button type="button" class="rx-inlink" onclick="rxGoSettings()">Go to Performance settings</button>`,{cls:"rx-defaults-note"}):""}</div>`}
/* ---- Employees: who's being reviewed (role + self-eval / peer options) and optional auto-assignment by group ---- */
function rxEmployees(w,x){
 const peerErr=fcErr(w,"peerMax");
 return `<section class="fc-card">${rxHd("Reviewees","Choose which role is being reviewed and how reviewees join this cycle.")}
  <div class="fc-form">
   <div class="fc-field"><div class="fc-lbl"><label for="rxWho">Who is going to be reviewed? <span>*</span></label></div>
    <select class="fc-inp fc-sel ${x.reviewee?"":"empty"} ${fcErr(w,"reviewee")?"bad":""}" id="rxWho" onchange="rxSetReviewee(this.value)"><option value="" disabled ${x.reviewee?"":"selected"}>Select a role</option>${[...RX_ROLES].reverse().map(r=>`<option ${x.reviewee===r?"selected":""}>${r}</option>`).join("")}</select>${fcMsg(w,"reviewee")}
    <div class="rx-chkbox"><label class="rx-check"><input class="rx-cb sm" type="checkbox" ${x.self?"checked":""} onchange="rxSet('self',this.checked)"><span>Allow self-evaluation</span></label>
     ${x.self?`<div class="rx-nest rx-nest-col"><label class="rx-check"><input class="rx-cb sm" type="checkbox" ${x.selfEdit.on?"checked":""} onchange="rxEditSet('selfEdit','on',this.checked)"><span>Allow edits after submission</span></label>
      <span class="rx-check-h">Employees can change their submitted self-evaluation until its due date, or the cycle end date if there's no due date.</span></div>`:""}
     <span class="rx-check"><label class="rx-check"><input class="rx-cb sm" type="checkbox" ${x.peers?"checked":""} onchange="rxSet('peers',this.checked)" aria-describedby="rxPeersTip"><span>Allow employees to nominate peers</span></label>
      <span class="rx-tip"><button type="button" class="rx-tip-btn" aria-label="About nominating peers" aria-describedby="rxPeersTip"><img src="/assets/info-circle.svg" width="16" height="16" alt=""></button><span class="rx-tip-box" role="tooltip" id="rxPeersTip">The person being reviewed picks coworkers to give feedback on them. Their manager approves the list.</span></span></span>
    ${x.peers?`<div class="rx-nest"><div class="rx-reopen-f"><label class="rx-reopen-l" for="rxPeerMode">How many peers can they nominate?</label>
      <div class="rx-reopen-row"><select class="fc-inp fc-sel rx-reopen-sel" id="rxPeerMode" onchange="rxPeerMode(this.value)"><option value="count" ${x.peerMode==="count"?"selected":""}>Specific count</option><option value="any" ${x.peerMode==="any"?"selected":""}>Unlimited</option></select>
       ${x.peerMode==="count"?`<span class="rx-step rx-step-n"><input class="fc-inp rx-numin ${peerErr?"bad":""}" type="number" inputmode="numeric" min="1" max="50" value="${x.peerMax||""}" aria-label="Maximum peers they can nominate" oninput="rxNum('peerMax',this,'peerMax')">${rxStepB}</span><span class="rx-check-t">peers</span>`:""}</div>
      ${fcMsg(w,"peerMax")}</div></div>`:""}</div>
   </div>
   ${rxProjects(w)}
  </div>
  ${aaBody(w,x)}</section>`}
/* ---- Project Completion Review: which projects the cycle covers (all, or a picked list). Reuses the reviewer multi-select pattern. ---- */
const rxProjList=()=>Object.keys(ORG.project).sort();
function rxProjMode(m){const w=W();w.projMode=m;rxClear("projs");RXP.id=null;render();const el=document.querySelector(`input[name="rxProjMode"][value="${m}"]`);if(el)el.focus()}
function rxProjPick(i,on){const w=W(),v=rxProjList()[i];w.projs=w.projs.filter(p=>p!==v);if(on)w.projs.push(v);rxClear("projs");render();const c=$("#rxProj"+i);if(c)c.focus({preventScroll:true})}
function rxProjField(w){const open=RXP.id==="projs",L=rxProjList(),sel=L.filter(p=>w.projs.includes(p));
 const tags=sel.length?sel.map(p=>`<span class="rx-tag">${esc(p)}<button type="button" class="rx-tagx" aria-label="Remove ${esc(p)}" onclick="rxProjPick(${L.indexOf(p)},false)">×</button></span>`).join(""):`<span class="rx-ph">Select projects</span>`;
 return `<div class="rx-dd"><div class="fc-inp rx-ms ${fcErr(w,"projs")?"bad":""} ${open?"open":""}" onclick="rxOpen('projs',event)">${tags}
   <button type="button" class="rx-ddbtn rx-chev" data-for="projs" id="rxProjs" aria-haspopup="true" aria-expanded="${open}" aria-label="Choose projects${sel.length?`, ${sel.length} selected`:""}"></button></div>
  ${open?`<div class="rx-pop" data-for="projs" role="group" aria-label="Projects"><div class="rx-pop-list">${L.map((p,i)=>`<label class="rx-mo"><input class="rx-cb" type="checkbox" id="rxProj${i}" ${w.projs.includes(p)?"checked":""} onchange="rxProjPick(${i},this.checked)"><span>${esc(p)}</span></label>`).join("")}</div></div>`:""}</div>`}
function rxProjects(w){if(w.ctype!=="Project Completion Review")return"";fcTypeInit(w);
 const rad=(m,t)=>`<label class="rx-check"><input class="rx-rad" type="radio" name="rxProjMode" value="${m}" ${w.projMode===m?"checked":""} onchange="rxProjMode('${m}')"><span>${t}</span></label>`;
 return `<div class="fc-field rx-proj-f"><div class="fc-lbl"><span class="fc-lbl-t" id="rxProjL">Which projects should be included? <span>*</span></span></div>
  <div class="rx-chkbox fc-prob"><div class="rx-checks" role="radiogroup" aria-labelledby="rxProjL">${rad("all","All projects")}${rad("specific","Specific projects")}</div>
  ${w.projMode==="specific"?`<div class="rx-nest rx-proj">${rxProjField(w)}${fcMsg(w,"projs")}</div>`:""}</div></div>`}
/* ---- Reviewers: reviewer roles (multi-select) → reviewer table ---- */
function rxReviewers(w,x){
 return `<section class="fc-card">${rxHd("Reviewers","Choose who reviews each employee and how much each reviewer's feedback counts.")}
  <div class="fc-form">
   <div class="fc-field full"><div class="fc-lbl"><label for="rxRevs">Who should review them? <span>*</span></label></div>${rxRevsField(w,x)}${fcMsg(w,"revs")}</div>
  </div>
  ${rxTable(w,x)}
  ${rxKeys(x).some(k=>k!=="Self")?`<div class="rx-opts">${rxOpt(x.revEdit.on,"rxEditSet('revEdit','on',this.checked)","Allow edits after submission","Reviewers can change a submitted review until their due date, or the cycle end date if there's no due date.")}</div>`:""}</section>`}
function rxOpt(on,act,t,d,extra=""){return `<div class="rx-opt"><label class="rx-opt-l"><input class="rx-cb" type="checkbox" ${on?"checked":""} onchange="${act}"><span class="rx-opt-t">${t}</span></label><div class="rx-opt-b"><p>${d}</p>${extra}</div></div>`}
/* ---- Which employees should be included? (inside the Employees card)
   All people in the reviewed role, or only those in selected groups. Each group row = category + values; rows combine with AND.
   Exclusions apply on top. Manual assignment from the detail page still works. ---- */
const AA_CATS=[["dept","Department","Departments"],["branch","Branch","Branches"],["project","Project","Projects"],["crew","Crew","Crews"],["site","Location","Locations"],
 ["title","Job title","Job titles"],["trade","Trade","Trades"],["type","Employee type","Employee types"],["mgr","Manager","Managers"],["union","Union status","Union statuses"],["lang","Language","Languages"]];
const AA_CAT=Object.fromEntries(AA_CATS.map(([k,o,p])=>[k,{one:o,pl:p}]));
function aaInit(x){const a=x.auto||(x.auto={mode:"all",groups:[{by:"",vals:[]}],excl:[]});
 if(!a.mode){a.on=!!a.by;a.mode=a.by&&a.by!=="all"?"groups":"all";a.groups=[{by:a.by==="all"?"":(a.by||""),vals:a.vals||[]}];delete a.by;delete a.vals}
 if(!a.groups.length)a.groups.push({by:"",vals:[]});a.excl=a.excl||[];return a}
const aaRoleOk=(e,role)=>!role||(role==="Worker"?e.type==="Field"&&!e.isMgr:role==="Foreman"?e.title==="Foreman":role==="Project Manager"?e.title==="Project Manager":!!e.isMgr);
const aaPool=()=>{const role=rxInit(W()).reviewee;return D.emps.filter(e=>e.status==="Active"&&aaRoleOk(e,role))};
const aaVal=(e,by)=>by==="crew"?(e.crew?crewName(e.crew):""):by==="site"?(e.site&&e.site!=="—"?e.site:""):by==="union"?(e.union?"Union":"Non-union"):
 by==="lang"?({EN:"English",ES:"Spanish"}[e.lang]||e.lang||""):by==="trade"?(e.trade&&e.trade!=="—"?e.trade:""):(e[by]||"");
const aaLive=a=>a.groups.filter(g=>g.by&&g.vals.length);
const aaMatch=a=>{const gs=aaLive(a);return !a.on?[]:aaPool().filter(e=>a.mode==="all"||gs.every(g=>g.vals.includes(aaVal(e,g.by))))};
function aaOpts(f){const a=aaInit(rxInit(W())),pool=aaPool();
 if(f!=="excl"){const by=a.groups[+f.slice(1)].by;return [...new Set(pool.map(e=>aaVal(e,by)).filter(Boolean))].sort().map(v=>({v,t:v,s:`${pool.filter(e=>aaVal(e,by)===v).length}`}))}
 return aaMatch(a).sort((p,q)=>p.name.localeCompare(q.name)).map(e=>({v:e.id,t:e.name,s:e.title}))}
function aaPrune(a){const ids=new Set(aaMatch(a).map(e=>e.id));a.excl=a.excl.filter(id=>ids.has(id))}
function aaMode(m){const a=aaInit(rxInit(W()));a.mode=m;aaPrune(a);rxClear("autoVals");RXP.id=null;render()}
function aaSetCat(g,v){const a=aaInit(rxInit(W()));a.groups[g]={by:v,vals:[]};aaPrune(a);rxClear("autoVals");RXP.id=null;render()}
function aaAddGroup(){const a=aaInit(rxInit(W()));a.groups.push({by:"",vals:[]});RXP.id=null;render();const s=$(`#aaCat${a.groups.length-1}`);if(s)s.focus()}
function aaDelGroup(g){const a=aaInit(rxInit(W()));a.groups.splice(g,1);aaInit(rxInit(W()));aaPrune(a);rxClear("autoVals");RXP.id=null;render()}
function aaToggle(f,i,on){const a=aaInit(rxInit(W())),o=aaOpts(f)[i];if(!o)return;const list=f==="excl"?a.excl:a.groups[+f.slice(1)].vals;
 const k=list.indexOf(o.v);if(k>-1)list.splice(k,1);if(on)list.push(o.v);
 if(f!=="excl"){aaPrune(a);rxClear("autoVals")}
 const q=(document.querySelector(`.rx-pop[data-for="aa:${f}"] .rx-search`)||{}).value||"";render();
 const pop=document.querySelector(`.rx-pop[data-for="aa:${f}"]`);if(pop){const sr=pop.querySelector(".rx-search");if(sr&&q){sr.value=q;aaFilter(sr)}const c=$(`#aaOpt${f}-${i}`);if(c)c.focus({preventScroll:true})}}
function aaFilter(el){const q=el.value.trim().toLowerCase(),pop=el.closest(".rx-pop");let n=0;
 pop.querySelectorAll(".rx-mo").forEach(m=>{const hit=!q||m.dataset.n.includes(q);m.style.display=hit?"":"none";if(hit)n++});pop.querySelector(".rx-none").hidden=n>0}
function aaMulti(f,sel,ph,aria,bad,dis){const id="aa:"+f,open=!dis&&RXP.id===id,opts=dis?[]:aaOpts(f);
 const tags=sel.length?opts.map((o,i)=>sel.includes(o.v)?`<span class="rx-tag">${esc(o.t)}<button type="button" class="rx-tagx" aria-label="Remove ${esc(o.t)}" onclick="aaToggle('${f}',${i},false)">×</button></span>`:"").join(""):`<span class="rx-ph">${ph}</span>`;
 return `<div class="rx-dd"><div class="fc-inp rx-ms ${bad?"bad":""} ${open?"open":""} ${dis?"is-dis":""}" ${dis?"":`onclick="rxOpen('${id}',event)"`}>${tags}
   <button type="button" class="rx-ddbtn rx-chev" data-for="${id}" id="aa_${f}" aria-haspopup="true" aria-expanded="${open}" aria-label="${aria}${sel.length?`, ${sel.length} selected`:""}" ${dis?"disabled":""}></button></div>
  ${open?`<div class="rx-pop" data-for="${id}" role="group" aria-label="${aria}">${f==="excl"||opts.length>8?`<div class="rx-srch"><input class="rx-search" type="search" placeholder="Search" aria-label="Search ${aria.toLowerCase()}" autocomplete="off" oninput="aaFilter(this)"></div>`:""}
   <div class="rx-pop-list">${opts.length?opts.map((o,i)=>`<label class="rx-mo" data-n="${esc((o.t+" "+o.s).toLowerCase())}"><input class="rx-cb" type="checkbox" id="aaOpt${f}-${i}" ${sel.includes(o.v)?"checked":""} onchange="aaToggle('${f}',${i},this.checked)"><span>${esc(o.t)}</span><span class="rx-same">${esc(o.s)}</span></label>`).join(""):`<div class="rx-none">No employees match</div>`}<div class="rx-none" hidden>No matches</div></div></div>`:""}</div>`}
function aaGroupRow(w,a,g,i){const used=a.groups.map(x=>x.by),c=AA_CAT[g.by],bad=fcErr(w,"autoVals");
 return `${i?`<div class="aa-and">and</div>`:""}<div class="aa-grp">
  <select class="fc-inp fc-sel ${g.by?"":"empty"} ${bad&&!g.by?"bad":""}" id="aaCat${i}" aria-label="Group ${i+1}: category" onchange="aaSetCat(${i},this.value)"><option value="" disabled ${g.by?"":"selected"}>Select category</option>${AA_CATS.map(([k,o])=>`<option value="${k}" ${g.by===k?"selected":""} ${k!==g.by&&used.includes(k)?"disabled":""}>${o}</option>`).join("")}</select>
  ${aaMulti("v"+i,g.vals,c?`Select ${c.pl.toLowerCase()}`:"Select a category first",c?c.pl:`Group ${i+1} values`,bad&&g.by&&!g.vals.length,!c)}
  <button type="button" class="rx-x aa-del" aria-label="Remove group ${i+1}" title="Remove" onclick="aaDelGroup(${i})" ${a.groups.length>1?"":"disabled"}>×</button></div>`}
function aaBody(w,x){const a=aaInit(x),role=x.reviewee?x.reviewee+"s":"employees",n=aaMatch(a).filter(e=>!a.excl.includes(e.id)).length,
 ready=a.mode==="all"||aaLive(a).length>0,more=a.groups.length<AA_CATS.length;
 const rad=(m,t)=>`<label class="rx-check"><input class="rx-rad" type="radio" name="aaMode" value="${m}" ${a.mode===m?"checked":""} onchange="aaMode('${m}')"><span>${t}</span></label>`;
 const body=a.on?`<div class="aa-body">
  <div class="rx-checks" role="radiogroup" aria-label="Employees to auto-assign">${rad("all",`All ${esc(role)}`)}${rad("groups",`Only ${esc(role)} from selected groups`)}</div>
  ${a.mode==="groups"?`<div class="aa-grps">${a.groups.map((g,i)=>aaGroupRow(w,a,g,i)).join("")}${fcMsg(w,"autoVals")}
   ${more?`<button type="button" class="rx-link aa-add" onclick="aaAddGroup()"><span aria-hidden="true">+</span> Add category</button>`:""}</div>`:""}
  <div class="fc-field"><div class="fc-lbl"><label for="aa_excl">Exclude <span class="fc-opt">(optional)</span></label></div>${aaMulti("excl",a.excl,"Select employees to exclude","Employees to exclude",false)}</div>
  ${ready?banner("info",`<b>${n} employee${n===1?"":"s"}</b> will be added when the cycle starts${a.excl.length?` (${a.excl.length} excluded)`:""}. Anyone who joins later and matches is added automatically.`):""}</div>`:"";
 return `<div class="fc-subsec">${rxOpt(a.on,"aaOn(this.checked)","Auto-assign cycle",`By default, all ${esc(role)} are included. You can narrow down the selection by choosing specific groups.`,body)}</div>`}
function aaOn(on){const a=aaInit(rxInit(W()));a.on=on;rxClear("autoVals");RXP.id=null;render()}
/* ---- Save as Draft → "Saved" until something changes ---- */
const fcSnap=w=>JSON.stringify(w,(k,v)=>["_snap","errs","saved","editing"].includes(k)?undefined:v);
function fcSaveSync(){const b=$("#fcSaveBtn"),w=W();if(!b||!w)return;const clean=!!w._snap&&w._snap===fcSnap(w);
 b.textContent=clean?"Saved":"Save as Draft";b.classList.toggle("is-saved",clean);b.disabled=clean}
function fcSaveDraft(){wzSave(true);const w=W();render();w._snap=fcSnap(w);fcSaveSync()}
["input","change","click"].forEach(t=>document.addEventListener(t,()=>{if(S.view==="wizard")setTimeout(fcSaveSync,0)},true));
/* ---- multi-selects keep a fixed height: chips that overflow the line are hidden behind a "+N" badge (hover lists them) ---- */
function rxFitChips(){document.querySelectorAll(".fc .rx-ms").forEach(ms=>{
 ms.querySelectorAll(".rx-more").forEach(b=>b.remove());const tags=[...ms.querySelectorAll(":scope>.rx-tag")];tags.forEach(t=>t.hidden=false);if(tags.length<2)return;
 const edge=()=>ms.getBoundingClientRect().right-parseFloat(getComputedStyle(ms).paddingRight)+0.5;
 const fits=el=>el.getBoundingClientRect().right<=edge();
 if(fits(tags[tags.length-1]))return;
 const b=document.createElement("span");b.className="rx-more";tags[tags.length-1].after(b);
 for(let i=tags.length-1,n=1;i>0;i--,n++){tags[i].hidden=true;b.textContent="+"+n;if(fits(b))break}
 b.title=tags.filter(t=>t.hidden).map(t=>t.firstChild.textContent.trim()).join(", ")})}
addEventListener("resize",()=>{if(S.view==="wizard")rxFitChips()});
const _renderSv=render;render=function(...a){_renderSv(...a);if(S.view==="wizard"){fcSaveSync();rxPlacePops();rxFitChips()}};
/* ---- Exit: confirm unless everything is already saved (Figma LMS 1:20632) ---- */
function fcExit(){wzCollect();const w=W();if(w._snap&&w._snap===fcSnap(w)){nav("cycles",{cycTab:"Draft"});return}
 const ex=$("#layer .mbg");if(ex)ex.remove();
 $("#layer").insertAdjacentHTML("beforeend",`<div class="mbg" onclick="if(event.target===this)closeModal()"><div class="fc-dlg" role="alertdialog" aria-modal="true" aria-labelledby="fcDlgT" aria-describedby="fcDlgD">
  <div class="fc-dlg-bg" aria-hidden="true"><img src="/assets/dlg-pattern.svg" width="336" height="336" alt=""></div>
  <button type="button" class="fc-dlg-x" aria-label="Close" onclick="closeModal()"><img src="/assets/x-close-24-gray.svg" width="24" height="24" alt=""></button>
  <div class="fc-dlg-h"><span class="fc-dlg-ic" aria-hidden="true"><img src="/assets/x-close-featured.svg" width="24" height="24" alt=""></span>
   <div class="fc-dlg-t"><h2 id="fcDlgT">Are you sure you want to exit?</h2><p id="fcDlgD">You can save this review cycle as a draft which will show up in the <b>Drafts</b> tab of <b>Review Cycles.</b></p></div></div>
  <div class="fc-dlg-a"><button type="button" class="fc-btn" onclick="fcExitDiscard()">Exit Without Saving</button><button type="button" class="fc-btn p" id="fcDlgSave" onclick="fcExitSave()">Save &amp; Exit</button></div></div></div>`);
 $("#fcDlgSave").focus()}
function fcExitDiscard(){closeModal();const w=W();if(!(w.id&&C(w.id)))S.wz=null;nav("cycles",w.id&&C(w.id)?{cycTab:"Draft"}:{})}
function fcExitSave(){closeModal();wzSave(true);nav("cycles",{cycTab:"Draft"});toast("Draft saved.")}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("#layer .fc-dlg")){closeModal();const b=$(".fc-exit");if(b)b.focus()}});
/* ---- Overall Rating ---- */
const RX_FMT_LBL={"Stars":"Stars (1–5)","Numeric 1–5 with definitions":"Numbers (1–5)","No rating":"No rating"};
const RX_FMTS=[...RATING_FMT,{k:"No rating",n:"No rating"}];
function rxRating(w){if(!RX_FMTS.some(f=>f.k===w.rating))w.rating="Numeric 1–5 with definitions";const none=w.rating==="No rating",star=w.rating==="Stars",lv=(star&&D.settings.starLevels)||D.settings.levels;
 const badge=i=>star?`<span class="rx-stars" aria-label="${i+1} of 5 stars">${[0,1,2,3,4].map(j=>`<span class="${j<=i?"on":""}">★</span>`).join("")}</span>`:`<span class="rx-num n${i+1}">${i+1}</span>`;
 return `<section class="fc-card">${rxHd("Overall Rating","One overall rating format for everyone in this cycle, or no overall rating. Questionnaires can still ask their own questions.")}
  <div class="fc-form"><div class="fc-field"><div class="fc-lbl"><label for="rxFmt">Rating format</label></div>
   <select class="fc-inp fc-sel" id="rxFmt" onchange="W().rating=this.value;render()">${RX_FMTS.map(o=>`<option value="${o.k}" ${o.k===w.rating?"selected":""}>${RX_FMT_LBL[o.k]||o.n}</option>`).join("")}</select>
</div></div>
  ${none?banner("info",`<b>No overall rating for this cycle.</b> Reviewers only answer the questionnaire, and employees see the written feedback without a score. Questionnaires can still ask their own rating questions.`)
   :banner("info",`<b class="rx-scale-h">What employees see</b>${lv.map((l,i)=>`<span class="rx-scale-r">${badge(i)}<span class="rx-lv">${esc(l)}</span></span>`).join("")}`,{cls:"rx-scale"})}</section>`}
/* ---- Additional Settings ---- */
/* Who can reopen: admins, HR managers and every manager role (no Foreman / Worker). */
const RX_REOPEN_BY=["Admin","HR Manager",...Object.keys(RX_MGR_TYPE)];
function rxReopenBy(v,on,i){const x=rxInit(W());x.reopenBy=x.reopenBy.filter(o=>o!==v);if(on)x.reopenBy.push(v);rxClear("reopenBy");render();
 const c=i===undefined?null:$("#rxRbOpt"+i);if(c)c.focus({preventScroll:true})}
function rxReopenWin(v){const x=rxInit(W());x.reopenWin=v;if(v==="period"&&!(x.reopenMonths>=1))x.reopenMonths=3;rxClear("reopenMonths");render()}
function rxReopenMonths(el){const x=rxInit(W()),v=parseInt(el.value,10);x.reopenMonths=isNaN(v)?"":v;rxClear("reopenMonths");el.classList.remove("bad");
 const m=el.closest(".rx-reopen-f").querySelector(".fc-err");if(m)m.remove()}
function rxReopenByField(w,x){const open=RXP.id==="reopenBy",bad=fcErr(w,"reopenBy"),sel=RX_REOPEN_BY.filter(o=>x.reopenBy.includes(o));
 const tags=sel.length?sel.map(o=>`<span class="rx-tag">${o}<button type="button" class="rx-tagx" aria-label="Remove ${o}" onclick="rxReopenBy('${o}',false)">×</button></span>`).join(""):`<span class="rx-ph">Select one or more roles</span>`;
 return `<div class="rx-dd">
  <div class="fc-inp rx-ms ${bad?"bad":""} ${open?"open":""}" onclick="rxOpen('reopenBy',event)">${tags}
   <button type="button" class="rx-ddbtn rx-chev" data-for="reopenBy" id="rxReopenBy" aria-haspopup="true" aria-expanded="${open}" aria-label="Who can reopen the cycle${sel.length?`, ${sel.length} selected`:""}"></button></div>
  ${open?`<div class="rx-pop" data-for="reopenBy" role="group" aria-label="Who can reopen the cycle">${RX_REOPEN_BY.map((o,i)=>`<label class="rx-mo"><input class="rx-cb" type="checkbox" id="rxRbOpt${i}" ${sel.includes(o)?"checked":""} onchange="rxReopenBy('${o}',this.checked,${i})"><span>${o}</span></label>`).join("")}</div>`:""}
 </div>`}
function rxSettings(w,x){const badM=fcErr(w,"reopenMonths"),per=x.reopenWin==="period";
 const reopen=x.reopen?`<div class="rx-nest rx-nest-col rx-reopen">
   <div class="rx-reopen-f"><div class="rx-reopen-row"><select class="fc-inp fc-sel rx-reopen-sel" id="rxReopenWin" aria-label="How long after the end date it can be reopened" onchange="rxReopenWin(this.value)"><option value="period" ${per?"selected":""}>Specific period</option><option value="any" ${per?"":"selected"}>Anytime</option></select>
     ${per?`<span class="rx-step rx-step-n"><input class="fc-inp rx-numin ${badM?"bad":""}" type="number" inputmode="numeric" min="1" max="24" value="${x.reopenMonths}" aria-label="Months after the end date that the cycle can be reopened" oninput="rxReopenMonths(this)">${rxStepB}</span><span class="rx-check-t">months</span>`:""}</div>${fcMsg(w,"reopenMonths")}</div>
   <div class="rx-reopen-f"><label class="rx-reopen-l" for="rxReopenBy">Who can reopen it?</label>${rxReopenByField(w,x)}${fcMsg(w,"reopenBy")}</div></div>`:"";
 return `<section class="fc-card">${rxHd("Additional Settings","")}
  <div class="rx-opts flush">
   ${rxOpt(x.creds,"W().rx.creds=this.checked","Include credentials in review","Show their licenses and certifications on the review so reviewers can take them into account.")}
   ${rxOpt(x.reopen,"W().rx.reopen=this.checked;rxClear('reopenMonths','reopenBy');render()","Allow reopening after the end date","The cycle can be reopened to collect late or missed reviews.",reopen)}
  </div></section>`}
/* ---- editor: Cycle Details → Employees → Reviewers → Overall Rating → Additional Settings ---- */
V.wizard=()=>{
 FCP.open=false;const w=W();if(!w)return V.cycles();wzCollect();rolesInit(w);datesInit(w);syncPhases(w);
 const x=rxInit(w);
 if(S.rxTplFor){const n=T(S.rxTplFor.id);if(n&&n.status==="Active"&&rxKeys(x).includes(S.rxTplFor.k)){rxRow(x,S.rxTplFor.k).tpl=n.id}S.rxTplFor=null}
 rxSync(w);w.overallBy="Weighted average of all reviewers";
 const edit=!!w.editing;
 return `<div class="fc">
  <div class="fc-sub"><div class="fc-left"><button class="fc-exit" onclick="fcExit()"><img src="/assets/x-close-20.svg" width="20" height="20" alt="">Exit</button><span class="fc-div" aria-hidden="true"></span><h1>${edit?"Edit Review Cycle":"New Review Cycle"}</h1></div>
   <div class="fc-acts"><button class="fc-btn fc-save" id="fcSaveBtn" onclick="fcSaveDraft()">Save as Draft</button><button class="fc-btn p" onclick="fcCreate()">Create</button></div></div>
  <div class="fc-body">${fcSteps()}<div class="fc-main">${fcSections([fcDetails(w),rxEmployees(w,x),rxReviewers(w,x),rxRating(w),rxSettings(w,x)])}</div></div>
 </div>`};
/* ---- left section nav (Figma LMS 1031:14622): one step per card, click to scroll, highlights the card in view ---- */
const FC_SECS=["Cycle Details","Reviewees","Reviewers","Overall Rating","Additional Settings"];
let fcOn=0;
/* each card gets an id for the nav, and its heading is numbered to match the nav step ("1. Cycle Details") */
const fcSections=cards=>cards.map((c,i)=>c.replace('<section class="fc-card"',`<section class="fc-card" id="fcSec${i}"`).replace("<h2>",`<h2>${i+1}. `)).join("");
const fcSteps=()=>`<nav class="fc-steps" aria-label="Sections">${FC_SECS.map((t,i)=>`<button type="button" class="fc-step ${i===fcOn?"on":""}" ${i===fcOn?'aria-current="step"':""} onclick="fcJump(${i})"><span class="fc-step-n">${i+1}</span><span class="fc-step-t">${t}</span></button>`).join("")}</nav>`;
function fcMark(i){if(i===fcOn&&document.querySelector(".fc-step.on"))return;fcOn=i;document.querySelectorAll(".fc-step").forEach((b,j)=>{b.classList.toggle("on",j===i);j===i?b.setAttribute("aria-current","step"):b.removeAttribute("aria-current")})}
function fcJump(i){const c=document.getElementById("fcSec"+i);if(!c)return;fcMark(i);fcLock=Date.now()+700;c.scrollIntoView({block:"start",behavior:"smooth"})}
let fcLock=0;
addEventListener("scroll",()=>{if(S.view!=="wizard"||Date.now()<fcLock)return;const top=(document.querySelector(".fc-sub")||{}).offsetHeight||0;
 const cards=FC_SECS.map((_,i)=>document.getElementById("fcSec"+i)).filter(Boolean);if(!cards.length)return;
 const atEnd=innerHeight+scrollY>=document.documentElement.scrollHeight-2;
 let i=0;cards.forEach((c,j)=>{if(c.getBoundingClientRect().top<=top+120)i=j});fcMark(atEnd?cards.length-1:i)},{passive:true});
const _navFc=nav;nav=function(v,...a){if(v==="wizard")fcOn=0;return _navFc(v,...a)};
fcCreate=function(){wzCollect();RXP.id=null;const w=W(),x=rxInit(w),s=toISO(w.start),e=toISO(w.end),errs={},K=rxKeys(x),t=rxTotal(x);
 if(!w.name.trim())errs.name="Add a cycle name";
 if(w.ctype==="General Review"&&(!s||!e))errs.period="Select a cycle period";
 if(w.ctype!=="General Review"&&w.probSched==="interval"){fcTypeInit(w);
  if(!(w.probEvery>=1&&w.probEvery<=12))errs.probEvery="Enter a number of months from 1 to 12";
  if(w.ctype==="New Hire Review"&&w.probTill==="period"&&!(w.probTillN>=1&&w.probTillN<=36))errs.probTillN="Enter 1 to 36 months after the start date";
  else if(w.ctype==="New Hire Review"&&w.probTill==="period"&&w.probEvery>=1&&w.probTillN<w.probEvery)errs.probTillN="The period must be at least as long as the interval";
  if(w.ctype==="Project Completion Review"&&!(w.projTillN>=1&&w.projTillN<=36))errs.projTillN="Enter 1 to 36 months after the completion date"}
 if(w.ctype==="Project Completion Review"&&w.projMode==="specific"&&!(w.projs||[]).length)errs.projs="Pick at least one project, or choose All projects";
 if(!x.reviewee)errs.reviewee="Choose who is going to be reviewed";
 if(!K.length)errs.revs="Pick at least one reviewer, or include a self-evaluation";
 else if(t!==100)errs.weight=`Weightage must add up to 100%. It's ${t}% now.`;
 const lateDue=K.filter(k=>rxDueBad(w,rxRow(x,k)));
 if(lateDue.length)errs.due=`Due date${lateDue.length>1?"s":""} for ${lateDue.map(rxName).join(", ")} must fall within the cycle period (${rxCycleLen(w)} days)`;
 const aa=aaInit(x);if(aa.on&&aa.mode==="groups"&&(!aaLive(aa).length||aa.groups.some(g=>!g.by||!g.vals.length)))errs.autoVals="Pick a category and at least one value for each group, or remove the empty group";
 if(x.peers&&x.peerMode==="count"&&!(x.peerMax>=1&&x.peerMax<=50))errs.peerMax="Enter 1 to 50 peers, or choose Unlimited";
 if(x.reopen){if(x.reopenWin==="period"&&!(x.reopenMonths>=1&&x.reopenMonths<=24))errs.reopenMonths="Enter 1 to 24 months";
  if(!x.reopenBy.length)errs.reopenBy="Pick at least one role who can reopen the cycle"}
 w.errs=errs;rxSync(w);const n=Object.keys(errs).length;   // only the inline field errors block Create
 if(n){render();const f=document.querySelector(".fc .bad");if(f){f.scrollIntoView({block:"center",behavior:"smooth"});if(f.focus)f.focus({preventScroll:true})}toast(`Fix ${n} item${n>1?"s":""} first.`);return}
 createCycle()};
/* drafts keep the participant setup */
const fcCopy=v=>Array.isArray(v)?[...v]:v;
const FC_TYPE_KEYS=["ctype","probSched","probEvery","probTill","probTillN","projTillN","projMode","projs"];
const _wzSaveRx=wzSave;wzSave=function(...a){_wzSaveRx(...a);const w=W(),c=w&&w.id&&C(w.id);if(!c)return;if(w.rx)c.rx=JSON.parse(JSON.stringify(w.rx));FC_TYPE_KEYS.forEach(k=>c[k]=fcCopy(w[k]))};
const _editDraftRx=editDraft;editDraft=function(cid){_editDraftRx(cid);const c=C(cid);if(!c||!S.wz)return;if(c.rx)S.wz.rx=JSON.parse(JSON.stringify(c.rx));FC_TYPE_KEYS.forEach(k=>{if(c[k]!=null)S.wz[k]=fcCopy(c[k])});render()};
render();
