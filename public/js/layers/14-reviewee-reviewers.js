/* ===== Participants · Evaluation & Scoring for the focused cycle editor (Cycle Details is in 13-focused-cycle-editor.js).
   Participants = reviewed role + self-evaluation · reviewer roles (multi-select) · peer nomination · auto-assignment by group.
   Evaluation & Scoring = reviewer table (weightage, questionnaire, due date, sees self-evaluation, reviewee can view, anonymous, remove)
   · rating format · credentials · results / self-evaluation visibility · edits after submission.
   Choices are synced back into w.roles so assignment, questionnaires and launch checks keep working. ===== */
const RX_ROLES=["Worker","Foreman","Crew Manager","Project Manager","Department Manager","Branch Manager","HR Manager"];
const RX_MGR_TYPE={"Crew Manager":"emp","Project Manager":"project","Department Manager":"dept","Branch Manager":"branch"};
const rxRank=r=>RX_ROLES.indexOf(r);
const rxLc=r=>r.replace(/\b(?!HR\b)\w+/g,s=>s.toLowerCase());   // "Crew Manager" → "crew manager", keeps "HR"
const rxIsRole=k=>RX_ROLES.includes(k);
function rxInit(w){const x=w.rx||(w.rx={reviewee:"",revs:[],self:false,peers:false,peerMode:"count",peerMax:1,rows:{},fb:"",wSet:false,creds:false,reopen:false});
 if(x.peerMode===undefined){x.peerMode="count";if(!(x.peerMax>=1))x.peerMax=1;delete x.peerLimit}
 if(!x.revEdit){x.revEdit={on:!!x.editAfter};delete x.editAfter;delete x.editDays}
 if(!x.selfEdit)x.selfEdit={on:false};
 if(x.reopenWin===undefined){x.reopenWin="period";if(!(x.reopenMonths>=1))x.reopenMonths=3}
 if(x.reopenMonths===undefined)x.reopenMonths=3;
 if(w.ctype==="Project Completion Review")x.peers=false;   // project reviews: no peer nomination
 if(w.ctype&&w.ctype!=="General Review")x.reopen=false;   // New Hire / Project Completion reviews can't be reopened   // no reviewee role for project reviews (everyone on the project)
 /* visibility is set per cycle now (moved out of Settings › Performance); new and older cycles start from the old company default */
 if(!RX_SELFVIS.some(o=>o.v===x.selfVis))x.selfVis=RX_SELFVIS.some(o=>o.v===D.settings.selfVis)?D.settings.selfVis:"After reviewer submits";
 if(!RX_RESULTS.some(o=>o.v===x.results))x.results=RX_RESULTS.some(o=>o.v===D.settings.results)?D.settings.results:"After cycle closes";
 if(!Array.isArray(x.reopenBy))x.reopenBy=["Admin"];
 x.reopenBy=[...new Set(x.reopenBy.map(o=>({Admins:"Admin","HR Managers":"HR Manager"})[o]||o).filter(o=>RX_REOPEN_BY.includes(o)))];RX_REOPEN_LOCKED.slice().reverse().forEach(r=>{if(!x.reopenBy.includes(r))x.reopenBy.unshift(r)});   // admins can always reopen
 return x}
/* table rows, in a stable order: roles low → high, then peers, then self */
const rxKeys=x=>[...RX_ROLES.filter(r=>x.revs.includes(r)),...(x.peers?["Peers"]:[]),...(x.self?["Self"]:[])];
function rxDefTpl(x,k){if(k==="Self")return "t1";if(k==="Peers")return "t4";
 if(x.reviewee){const d=rxRank(k)-rxRank(x.reviewee);if(d<0)return "t5";if(d===0)return "t4"}return "t2"}
/* New / Edit Review Cycle: a new row starts with no questionnaire (picked per row, required to create the cycle); an archived or deleted one is cleared.
   Elsewhere (detail pages of older cycles saved without one) the role's default questionnaire still fills in. */
function rxRow(x,k){const ed=S.view==="wizard",r=x.rows[k]||(x.rows[k]={w:0,seeSelf:rxIsRole(k)&&k!=="Worker",anon:k==="Peers"||k==="Worker",...(ed?{tpl:""}:{})});
 if(r.revSees===undefined)r.revSees=true;if(!r.revSees)r.anon=false;
 if(r.tpl===undefined||(r.tpl&&(!T(r.tpl)||T(r.tpl).status==="Archived")))r.tpl=ed?"":rxDefTpl(x,k);else if(!r.tpl&&!ed)r.tpl=rxDefTpl(x,k);return r}
const rxName=k=>k==="Self"?"Reviewee":k==="Peers"?"Peer nominees":k;
/* ---- weightage ---- */
const rxTotal=x=>rxKeys(x).reduce((a,k)=>a+(+rxRow(x,k).w||0),0);
function rxSplitRows(x){const K=rxKeys(x);if(!K.length)return;const b=Math.floor(100/K.length);let extra=100-b*K.length;K.forEach(k=>{rxRow(x,k).w=b+(extra-->0?1:0)})}
/* already split evenly = totals 100% and no two weights differ by more than 1 (100 doesn't always divide evenly, e.g. 34/33/33) */
const rxIsEven=x=>{const ws=rxKeys(x).map(k=>+rxRow(x,k).w||0);return ws.length>0&&rxTotal(x)===100&&Math.max(...ws)-Math.min(...ws)<=1};
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
/* Project Completion Review: no peer nomination and no Auto-assign (reviewees come from the selected projects).
   rxReady = a reviewee role is picked, so the rest of the form (Reviewers, Overall Rating, Auto-assign…) can show. */
const rxAllInProject=w=>!!w&&w.ctype==="Project Completion Review";
const rxReady=(w,x)=>!!x.reviewee;
const rxRevOpts=x=>RX_ROLES.filter(r=>!(r==="Worker"&&x.reviewee==="Worker"));
function rxSetReviewee(v){const x=rxInit(W());x.reviewee=v;rxClear("reviewee");x.revs=x.revs.filter(r=>rxRevOpts(x).includes(r));
 rxChanged(x)}
function rxToggle(r,on){const x=rxInit(W());x.revs=x.revs.filter(k=>k!==r);if(on)x.revs.push(r);rxChanged(x)}
function rxSet(f,v){const x=rxInit(W());x[f]=v;rxChanged(x)}
function rxRowSet(k,f,v){const x=rxInit(W());rxRow(x,k)[f]=v;if(f==="seeSelf")rxNotePaint(x)}
/* repaint only the Review-defaults note so the checkbox keeps focus */
function rxNotePaint(x){const old=document.getElementById("rxDefNote");if(old)old.outerHTML=rxDefaultsNote(x,rxKeys(x))}
function rxW(k,el){const x=rxInit(W());let v=parseInt(el.value,10);if(isNaN(v))v=0;v=Math.max(0,Math.min(100,v));rxRow(x,k).w=v;x.wSet=true;rxPaint()}
function rxWBlur(k,el){el.value=rxRow(rxInit(W()),k).w}
function rxPaint(){const x=rxInit(W()),t=rxTotal(x),el=$("#rxTotal");if(t===100)rxClear("weight");
 if(el){el.textContent=t+"%";el.className="reviewer-table__total-value "+(t===100?"is-ok":"is-bad")}
 const sp=$("#rxSplitBtn");if(sp)sp.disabled=rxIsEven(x)}
function rxNum(f,el,err){const x=rxInit(W());x[f]=parseInt(el.value,10)||0;rxClear(err);el.classList.remove("bad");
 const n=el.closest(".setting__options,.sub-settings");const m=n&&n.querySelector(".error-text");if(m)m.remove()}
function rxPeerMode(v){const x=rxInit(W());x.peerMode=v;if(v==="count"&&!(x.peerMax>=1))x.peerMax=1;rxClear("peerMax");render()}
/* Peer nomination: the first time it's turned on it starts a specific count at 1 and puts the cursor in the count, ready to type.
   Turning it off keeps what was set (x.peerPrev), so turning it back on in this session shows it again. The Peer nominees row in the
   reviewer table (weightage, questionnaire, due date, checkboxes) is kept in x.rows the same way, as is the Reviewee row for self-evaluation. */
function rxPeersSet(on){const x=rxInit(W());if(on){const p=x.peerPrev;x.peerMode=p?p.mode:"count";x.peerMax=p?p.max:1}else x.peerPrev={mode:x.peerMode,max:x.peerMax};rxSet("peers",on);
 if(on){const i=$("#rxPeerMax");if(i){i.focus({preventScroll:true});i.select()}}}
/* the count never goes below 1 (or above 50): 0 or less snaps to 1; an empty field is allowed while typing and becomes 1 on leaving */
function rxPeerMaxIn(el){if(el.value!==""){const v=parseInt(el.value,10);if(!(v>=1))el.value=1;else if(v>50)el.value=50}rxNum("peerMax",el,"peerMax")}
function rxPeerMaxOut(el){if(el.value===""||!(parseInt(el.value,10)>=1)){el.value=1;rxPeerMaxIn(el)}}
function rxRevSees(k,on){const r=rxRow(rxInit(W()),k);r.revSees=on;if(!on)r.anon=false;render()}
/* ---- Allow edits after submission: one setting for the reviewee (self-evaluation), one for reviewers.
   Edits stay open until the due date, or the cycle end date when there's no due date. ---- */
/* Reviewers › Allow edits after submission also covers the reviewee's self-evaluation: x.selfEdit mirrors x.revEdit
   (kept so the cycle detail page, which reads selfEdit, shows the same answer) */
function rxEditSet(k,f,v){const x=rxInit(W());x[k][f]=v;if(k==="revEdit"&&f==="on")x.selfEdit={...(x.selfEdit||{}),on:v};render()}

/* ---- dropdowns: reviewer multi-select + questionnaire picker ---- */
const RXP={id:null};
function rxOpen(id,e){if(e&&e.target.closest(".chip__remove"))return;if(FCP.open)fcPeriodClose();RXP.id=RXP.id===id?null:id;if(String(RXP.id).startsWith("tpl:"))RXP.tplAll=false;if(String(RXP.id).startsWith("rxDref"))RXP.dueAll=false;render();
 const p=RXP.id&&$(`.dropdown__menu[data-for="${RXP.id}"]`);if(p){const f=p.querySelector(".dropdown__search-input")||p.querySelector("input:checked,input,button");if(f)f.focus({preventScroll:true})}}
function rxClose(focus){if(!RXP.id)return;const id=RXP.id;RXP.id=null;document.querySelectorAll(".dropdown__menu").forEach(p=>p.remove());
 document.querySelectorAll(".dropdown__trigger[aria-expanded=true]").forEach(b=>b.setAttribute("aria-expanded","false"));
 document.querySelectorAll(".editor .multiselect.open,.editor .select__trigger.open").forEach(f=>f.classList.remove("open"));   // drop the blue "open" border too
 if(focus){const b=$(`.dropdown__trigger[data-for="${id}"]`);if(b)b.focus()}}
document.addEventListener("mousedown",e=>{if(RXP.id&&!e.target.closest(".dropdown"))rxClose()});
/* a click on empty space (not a field, label, button or open list) takes focus off the field, so no input or select stays highlighted */
document.addEventListener("mousedown",e=>{if(S.view!=="wizard")return;const a=document.activeElement;if(!a||a===document.body||!a.closest(".editor"))return;
 if(e.target.closest("input,textarea,select,button,label,a,[tabindex],.dropdown,.dropdown__menu,.datepicker,.input"))return;a.blur()});
/* dropdowns inside the horizontally scrolling reviewer table are position:fixed — place them under their field */
/* list widths in the reviewer table: Questionnaire 320px, Due date ("after assignment / before cycle end") 200px, others at least 280px */
const rxPopW=(p,r)=>p.closest(".reviewer-table__questionnaire")?320:p.closest(".reviewer-table__due")?200:Math.max(r.width,280);
function rxPlacePops(){document.querySelectorAll(".reviewer-table__scroll .dropdown__menu").forEach(p=>{const r=p.closest(".dropdown").getBoundingClientRect(),w=rxPopW(p,r);
 p.style.width=w+"px";p.style.left=Math.max(16,Math.min(r.left,innerWidth-w-16))+"px";
 p.style.top=(fcPopUp(r,p.offsetHeight,6)?r.top-p.offsetHeight-4:r.bottom+6)+"px"})}
/* every dropdown list / calendar opens below its field, unless it doesn't fit below the field on screen and there's more room above
   (under the sticky header) — then it opens above, 4px from the field. Checked each time it opens or re-renders, and on resize. */
function fcPopUp(r,h,gap){const top=((document.querySelector(".editor__header")||{}).offsetHeight||0)+8,below=innerHeight-r.bottom-8,above=r.top-top;
 return h+gap>below&&above>below}
function fcFlipPops(){if(S.view!=="wizard")return;
 document.querySelectorAll(".editor .dropdown__menu:not(.reviewer-table__scroll .dropdown__menu),.editor .datepicker").forEach(p=>{if(p.closest(".select--up"))return;   // select--up: always above
  p.classList.remove("is-up");const host=p.closest(".dropdown,.date-range");if(!host)return;
  if(fcPopUp(host.getBoundingClientRect(),p.offsetHeight,p.classList.contains("datepicker")?8:6))p.classList.add("is-up")})}
const _renderFlip=render;render=function(...a){const r=_renderFlip(...a);fcFlipPops();return r};
const _fcPopDrawFlip=fcPopDraw;fcPopDraw=function(...a){const r=_fcPopDrawFlip(...a);fcFlipPops();return r};
addEventListener("resize",()=>{fcFlipPops();if(RXP.id)rxPlacePops()});
document.addEventListener("scroll",e=>{if(RXP.id)rxPlacePops();const t=e.target;if(t.classList&&t.classList.contains("reviewer-table__scroll"))t.classList.toggle("is-scrolled",t.scrollLeft>0)},true);addEventListener("resize",()=>{if(RXP.id)rxPlacePops()});
document.addEventListener("keydown",e=>{if(RXP.id&&e.key==="Escape")rxClose(true)});
function rxPick(r,on,i){rxToggle(r,on);const c=$("#rxOpt"+i);if(c)c.focus({preventScroll:true})}
/* Apply to all reviewers (checkbox at the top of the Questionnaire menu, under the search; tick it before picking): ticking it copies this row's questionnaire to every row
   right away (if it has one); while ticked, a pick goes to every row. Unticked again each time a menu opens. */
function rxTplAll(k,on){RXP.tplAll=on;const x=rxInit(W()),t=rxRow(x,k).tpl;if(on&&t){rxKeys(x).forEach(q=>rxRow(x,q).tpl=t);rxClear("tpl")}render();
 const c=$(`.dropdown__menu[data-for="tpl:${k}"] .questionnaire-picker__apply-all input`);if(c)c.focus({preventScroll:true})}
function rxTplPick(k,id){if(RXP.tplAll){const x=rxInit(W());rxKeys(x).forEach(q=>rxRow(x,q).tpl=id)}rxRowSet(k,"tpl",id);{const x=rxInit(W());if(rxKeys(x).every(q=>rxRow(x,q).tpl))rxClear("tpl")}RXP.id=null;render();const b=$(`.dropdown__trigger[data-for="tpl:${k}"]`);if(b)b.focus({preventScroll:true})}
function rxAddTpl(k){RXP.id=null;wzCollect();S.returnTo="wizard";openBuilder(null,"");S.rxTplFor={k,id:S.bld.id}}
const rxTpls=()=>D.templates.filter(t=>!["Archived","Draft"].includes(t.status));
/* Multi-select chips (reviewers, projects, auto-assign values, who can reopen) show in pick order: first picked = first chip */
function rxRevsField(w,x){const open=RXP.id==="revs",bad=fcErr(w,"revs");
 const tags=x.revs.length?x.revs.filter(r=>RX_ROLES.includes(r)).map(r=>`<span class="chip"><span class="chip__label">${r}</span><button type="button" class="chip__remove" aria-label="Remove ${r}" onclick="rxToggle('${r}',false)"><img src="/assets/icons/x-close-badge.svg" width="20" height="20" alt=""></button></span>`).join(""):`<span class="multiselect__placeholder">Select</span>`;
 return `<div class="dropdown">
  <div class="input multiselect ${bad?"bad":""} ${open?"open":""}" onclick="rxOpen('revs',event)">${tags}
   <button type="button" class="dropdown__trigger multiselect__toggle" data-for="revs" id="rxRevs" aria-haspopup="true" aria-required="true" aria-expanded="${open}" aria-label="Choose reviewer roles${x.revs.length?`, ${x.revs.length} selected`:""}"></button></div>
  ${open?`<div class="dropdown__menu" data-for="revs" role="group" aria-label="Reviewer roles">${rxRevOpts(x).reverse().map((r,i)=>`<label class="dropdown__option"><input class="checkbox" type="checkbox" id="rxOpt${i}" ${x.revs.includes(r)?"checked":""} onchange="rxPick('${r}',this.checked,${i})"><span>${r}</span>${r===x.reviewee?`<span class="dropdown__meta">Same role</span>`:""}</label>`).join("")}</div>`:""}
 </div>`}
function rxTplFilter(el){const q=el.value.trim().toLowerCase(),pop=el.closest(".questionnaire-picker__menu");let n=0;
 pop.querySelectorAll(".questionnaire-picker__option").forEach(i=>{const hit=!q||i.dataset.n.includes(q);i.hidden=!hit;if(hit)n++});
 pop.querySelector(".dropdown__empty").hidden=n>0}
function rxPrev(id){rxClose();previewTpl(id)}
function rxTplField(x,k){const r=rxRow(x,k),id=`tpl:${k}`,open=RXP.id===id,t=r.tpl?T(r.tpl):null,bad=!t&&fcErr(W(),"tpl");
 return `<div class="dropdown">
  <button type="button" class="input input--select dropdown__trigger questionnaire-picker__trigger ${t?"":"empty"} ${bad?"bad":""}" data-for="${id}" aria-haspopup="true" aria-expanded="${open}" aria-label="Questionnaire for ${rxName(k)}: ${esc(t?t.name:"none")}" onclick="rxOpen('${id}')"><span>${esc(t?t.name:"Select")}</span></button>
  ${open?`<div class="dropdown__menu questionnaire-picker__menu" data-for="${id}">
   <div class="dropdown__search"><input class="dropdown__search-input" type="search" placeholder="Search questionnaires" aria-label="Search questionnaires" autocomplete="off" oninput="rxTplFilter(this)"></div>${rxKeys(x).length>1?`<label class="dropdown__option questionnaire-picker__apply-all"><input class="checkbox sm" type="checkbox" ${RXP.tplAll?"checked":""} onchange="rxTplAll('${k}',this.checked)"><span>Apply to all reviewers</span></label>`:""}
   <div class="dropdown__list">${rxTpls().map(o=>{const on=o.id===r.tpl;return `<div class="questionnaire-picker__option ${on?"on":""}" data-n="${esc(o.name.toLowerCase())}" onclick="rxTplPick('${k}','${o.id}')">
    <div class="questionnaire-picker__text"><button type="button" class="questionnaire-picker__name-button ${on?"on":""}" ${on?'aria-current="true"':""} title="${esc(o.name)}"><span class="questionnaire-picker__name">${esc(o.name)}</span></button>
     <span class="questionnaire-picker__meta">${esc(o.type)} · ${o.q} questions · <button type="button" class="questionnaire-picker__preview" aria-label="Preview ${esc(o.name)}" onclick="event.stopPropagation();rxPrev('${o.id}')">Preview</button></span></div>
    ${on?`<img class="select__check questionnaire-picker__check" src="/assets/check-blue-16.svg" width="16" height="16" alt="">`:""}</div>`}).join("")}
    <div class="dropdown__empty" hidden>No questionnaires match your search</div></div>
   <div class="questionnaire-picker__footer"><button type="button" class="lb-btn lb-btn--tertiary lb-btn--sm" onclick="rxAddTpl('${k}')"><span class="lb-btn__icon lb-btn__icon--plus" aria-hidden="true"></span><span class="lb-btn__label">Add Questionnaire</span></button></div></div>`:""}
 </div>`}
/* ---- cards ---- */
/* section heading only: section descriptions were removed (questions carry their own descriptions) */
/* section heading: just the text, no wrapper, no margins (styles: .section-hd, 15-focused-editor.css) */
const rxHd=t=>`<h2 class="section-hd">${t}</h2>`;
/* number stepper: two small grey stacked chevron buttons inside the right edge of a number field.
   They step the input (respecting min/max) and fire its own oninput, so each field keeps its handler. */
const rxStepB=`<span class="number-stepper__buttons"><button type="button" tabindex="-1" aria-label="Increase" onmousedown="event.preventDefault()" onclick="rxStep(this,1)"><img src="/assets/chevron-down.svg" class="up" width="12" height="12" alt=""></button><button type="button" tabindex="-1" aria-label="Decrease" onmousedown="event.preventDefault()" onclick="rxStep(this,-1)"><img src="/assets/chevron-down.svg" width="12" height="12" alt=""></button></span>`;
function rxStep(btn,d){const i=btn.closest(".number-stepper,.percent-input").querySelector("input");if(!i||i.disabled)return;
 if(i.value==="")i.value=i.min||0;d>0?i.stepUp():i.stepDown();i.dispatchEvent(new Event("input",{bubbles:true}));i.focus()}
/* focus source: Tab adds html.is-keyboard, any pointer press removes it. Every field shows its 4px focus ring
   only with it (clicking a text input always matches :focus-visible, so CSS alone can't tell click from Tab). */
document.addEventListener("keydown",e=>{if(e.key==="Tab")document.documentElement.classList.add("is-keyboard")},true);
document.addEventListener("pointerdown",()=>document.documentElement.classList.remove("is-keyboard"),true);
const rxCk=(on,act,label,cls="")=>`<label class="reviewer-table__check ${cls}"><input class="checkbox sm" type="checkbox" ${on?"checked":""} onchange="${act}"><span class="sr-only">${label}</span></label>`;
/* Due date: "[count] days [After assignment | Before end date]".
   r.dueN = count ("" = not set, it's optional) · r.dueRef = "assign" (default) | "end" · r.due = resolved ISO date when it can be known. */
const rxCycleLen=w=>{if(w.ctype&&w.ctype!=="General Review")return 0;const s=toISO(w.start),e=toISO(w.end);return s&&e?Math.round((new Date(e)-new Date(s))/864e5)+1:0};
function rxDueMig(r){if(r.dueN===undefined){const old=r.dueDays==null?"":r.dueDays;r.dueN=old;r.dueRef=old===""?"assign":"end"}if(!r.dueRef)r.dueRef="assign";if(r.dueN!==""&&r.dueN<1)r.dueN=1;return r}   // older 0-day values become 1
const rxDueISO=(w,r)=>{const e=toISO(w.end);if(r.dueRef!=="end"||!e||r.dueN==="")return"";const d=new Date(e+"T12:00:00");d.setDate(d.getDate()-r.dueN);return d.toISOString().slice(0,10)};
/* the assigned date is inside the cycle, so either way the count has to be shorter than the cycle */
const rxDueBad=(w,r)=>{rxDueMig(r);const len=rxCycleLen(w);return r.dueN!==""&&len>0&&r.dueN>=len};
function rxDuePaint(k,cell){const w=W(),r=rxRow(rxInit(w),k);r.due=rxDueISO(w,r);
 if(cell){cell.classList.toggle("bad",rxDueBad(w,r));cell.title=r.due?`Due ${fcMDY(r.due)}`:""}
 if(!document.querySelector(".due-date.bad"))rxClear("due")}
/* 0 or a negative number turns into 1 as it's typed (a review can't be due on the same day it's counted from) */
function rxDueN(k,el){const r=rxRow(rxInit(W()),k);let v=parseInt(el.value,10);if(!isNaN(v)&&v<1){v=1;el.value="1"}r.dueN=isNaN(v)?"":Math.min(365,v);rxDuePaint(k,el.closest(".due-date"))}
/* due date "counted from" dropdown (fcSel in each table row; its id ends in the row's index in rxKeys) */
function rxDrefPick(v,id){const x=rxInit(W()),k=rxKeys(x)[+String(id).replace("rxDref","")];if(!k)return;rxRow(x,k).dueRef=v;if(RXP.dueAll)rxDueCopy(x,k);render()}
/* Apply to all reviewers (checkbox at the top of the "counted from" menu, above the options), same as the Questionnaire menu: ticking it copies this
   row's due date (days + after assignment / before end date) to every row right away; while ticked, a pick goes to every row.
   Unticked again each time a menu opens. */
function rxDueCopy(x,k){const r=rxDueMig(rxRow(x,k));rxKeys(x).forEach(q=>{const o=rxRow(x,q);o.dueN=r.dueN;o.dueRef=r.dueRef})}
function rxDueAll(k,on){RXP.dueAll=on;const x=rxInit(W());if(on)rxDueCopy(x,k);render();if(!document.querySelector(".due-date.bad"))rxClear("due");
 const i=rxKeys(x).indexOf(k),c=$(`.dropdown__menu[data-for="rxDref${i}"] .dropdown__apply-all input`);if(c)c.focus({preventScroll:true})}
function rxDueRef(k,el){rxRow(rxInit(W()),k).dueRef=el.value;rxDuePaint(k,el.closest(".due-date"))}
function rxDueCell(w,k,r){rxDueMig(r);r.due=rxDueISO(w,r);
 return `<div class="due-date ${rxDueBad(w,r)?"bad":""}" ${r.due?`title="Due ${fcMDY(r.due)}"`:""}>
  <div class="number-stepper"><input class="input due-date__days" type="number" inputmode="numeric" min="1" max="365" step="1" value="${r.dueN===0?1:r.dueN}" onkeydown="if(['-','+','e','E','.',','].includes(event.key))event.preventDefault()" aria-label="Due date for ${rxName(k)}: number of days" oninput="rxDueN('${k}',this)">
   ${rxStepB}</div>
  <span class="due-date__unit" aria-hidden="true">days</span>
  ${fcSel({id:`rxDref${rxKeys(rxInit(w)).indexOf(k)}`,value:r.dueRef,options:[{v:"assign",t:"after assignment"},{v:"end",t:"before end date"}],ph:"Select",pick:"rxDrefPick",cls:"due-date__from",label:`Due date for ${rxName(k)}: days counted from`,
   head:rxKeys(rxInit(w)).length>1?`<label class="dropdown__option dropdown__apply-all"><input class="checkbox sm" type="checkbox" ${RXP.dueAll?"checked":""} onchange="rxDueAll('${k}',this.checked)"><span>Apply to all reviewers</span></label>`:""})}</div>`}
/* reviewer table header: every column has a resize handle on its right edge (1px #EAECF0 stroke, none on the last column,
   blue while hovered / dragged), same as the Review Cycles table. View self-evaluation and Visible to reviewee show a dark
   tooltip (pointer bottom centre) on hover of the header cell. */
function rxHead(sv){const H=[["Reviewer"],["Wgt. (%)","","Weightage"],["Questionnaire"],["Due Date"]];   // header text in title case; Wgt. is spelled out in its tooltip
 if(sv)H.push(["View Self-Evaluation","c","Reviewers can view the reviewee's self-evaluation"]);
 H.push(["Visible to Reviewee","c","The reviewee can view this reviewer's review"]);
 H.push(["Anonymous","c reviewer-table__anonymous"]);
 return `<div class="reviewer-table__row reviewer-table__row--head" aria-hidden="true">${H.map(([t,c,tip],i)=>`<div class="reviewer-table__heading ${c||""}" ${tip?`data-tip="${esc(tip)}"`:""}><span class="reviewer-table__heading-text">${t}</span><span class="ls-rz reviewer-table__resizer" onmousedown="rxRzStart(event,${i})"></span></div>`).join("")}</div>`}
/* column widths after a drag, per layout (with / without the View self-evaluation column); kept for the session */
const RX_COL_MIN=80;   // narrowest a column can be dragged
/* V2 (layers/34-listing-v2.js) wording for the cycle's Overview › Settings (15-cycle-settings-kv.js); the editor is the same on V1 and V2 */
const rxV2=()=>typeof perfV2==="function"&&perfV2();
const rxLayoutKey=g=>g.classList.contains("noself")?"noself":"self";   // saved column widths per layout
const rxResultsLbl=()=>rxV2()?"Reviewee view reviews":"Reviewee view final results";
function rxColApply(){document.querySelectorAll(".editor__main .reviewer-table__frame").forEach(g=>{const key=rxLayoutKey(g),W=(S.rxColW||{})[key],sc=g.querySelector(".reviewer-table__scroll");
 if(!W||!sc){g.style.removeProperty("--rx-cols");g.style.removeProperty("--rx-min");return}
 const ws=W.slice(),sum=ws.reduce((a,b)=>a+b,0),avail=sc.clientWidth;
 if(sum<avail)ws[ws.length-1]+=avail-sum;   // spare width goes to the last column
 g.style.setProperty("--rx-cols",ws.map(v=>v+"px").join(" "));g.style.setProperty("--rx-min",Math.max(sum,avail)+"px")})}
function rxRzStart(e,i){e.preventDefault();e.stopPropagation();if(typeof lpTipHide==="function")lpTipHide();
 const rz=e.currentTarget,g=rz.closest(".reviewer-table__frame"),key=rxLayoutKey(g),L=S.rxColW||(S.rxColW={});
 const cells=[...g.querySelectorAll(".reviewer-table__row--head>*")];
 if(!L[key])L[key]=cells.map(c=>Math.round(c.getBoundingClientRect().width));
 const x0=e.clientX,w0=cells[i].getBoundingClientRect().width;
 rz.classList.add("is-drag");document.body.classList.add("ls-resizing");
 const move=ev=>{L[key][i]=Math.max(RX_COL_MIN,Math.round(w0+ev.clientX-x0));rxColApply()};
 const up=()=>{removeEventListener("mousemove",move);removeEventListener("mouseup",up);rz.classList.remove("is-drag");document.body.classList.remove("ls-resizing")};
 addEventListener("mousemove",move);addEventListener("mouseup",up)}
/* Reviewee sees results = Never: the reviewee sees no reviews, so "Visible to reviewee" and "Anonymous" show unchecked and disabled.
   Each row's own choices (r.revSees / r.anon) are kept and come back when another option is picked. */
function rxTable(w,x){const K=rxKeys(x),t=rxTotal(x),sv=x.self,s=toISO(w.start),e=toISO(w.end),never=x.results==="Never",RX_NEVER_TIP="Reviewee view final results is set to Never";
 if(!K.length)return "";
 const na=`<span class="reviewer-table__na"><span class="sr-only">Not applicable</span></span>`;   // visually empty; screen readers still hear "Not applicable"
 const rows=K.map(k=>{const r=rxRow(x,k),self=k==="Self";
  return `<div class="reviewer-table__row reviewer-table__row--body">
   <div class="reviewer-table__name">${rxName(k)}</div>
   <div class="reviewer-table__weight"><div class="sr-only" aria-hidden="true">Weightage (%)</div><div class="percent-input"><input type="number" inputmode="numeric" min="0" max="100" step="1" value="${r.w}" aria-label="Weightage for ${rxName(k)}, percent" oninput="rxW('${k}',this)" onblur="rxWBlur('${k}',this)">${rxStepB}</div></div>
   <div class="reviewer-table__questionnaire"><div class="sr-only" aria-hidden="true">Questionnaire</div>${rxTplField(x,k)}</div>
   <div class="reviewer-table__due"><div class="sr-only" aria-hidden="true">Due date</div>${rxDueCell(w,k,r)}</div>
   ${sv?`<div class="c ${self?"na":""}">${self?na:rxCk(r.seeSelf,`rxRowSet('${k}','seeSelf',this.checked)`,"Can view self-evaluation")}</div>`:""}
   <div class="c ${self?"na":""}">${self?na:never?`<span data-tip="${RX_NEVER_TIP}">${rxCk(false,"",`${rxName(k)}'s review visible to reviewee`).replace('type="checkbox"','type="checkbox" disabled')}</span>`
    :rxCk(r.revSees,`rxRevSees('${k}',this.checked)`,`${rxName(k)}'s review visible to reviewee`)}</div>
   <div class="reviewer-table__anonymous c ${self?"na":""}">${self?na:`<span ${never?`data-tip="${RX_NEVER_TIP}"`:r.revSees?"":`title="Only available when the reviewee can view this review"`}>${rxCk(r.anon&&!never,`rxRowSet('${k}','anon',this.checked)`,"Keep anonymous").replace('type="checkbox"',`type="checkbox" ${r.revSees&&!never?"":"disabled"}`)}</span>`}</div></div>`}).join("");
 return `<div class="reviewer-table" role="group" aria-labelledby="rxTableQ">${fcQ("How should each reviewer review them?"+FC_REQ,{id:"rxTableQ"})}<div class="reviewer-table__frame ${sv?"":"noself"}"><div class="reviewer-table__scroll">
  ${rxHead(sv)}
  ${rows}</div>
  <div class="reviewer-table__total"><span class="reviewer-table__total-label">Total Weightage:</span><span id="rxTotal" class="reviewer-table__total-value ${t===100?"is-ok":"is-bad"}">${t}%</span><button type="button" class="lb-btn lb-btn--link-blue lb-btn--sm" id="rxSplitBtn" ${rxIsEven(x)?"disabled":""} onclick="rxSplit()">Split Evenly</button></div>
 </div>${fcMsg(w,"tpl")}${fcMsg(w,"weight")}${fcMsg(w,"due")}
 ${rxDefaultsNote(x,K)}
 ${banner("info","If an employee doesn't have one of the assigned reviewers, that reviewer's weightage is distributed evenly among their remaining reviewers.",{cls:"split-note"})}</div>`}
/* Settings › Performance › Review defaults apply to every cycle. When this table turns on
   "View self-evaluation" or "Visible to reviewee", say when that actually happens and where to change it. */
/* Reviewer sees self-evaluation / Reviewee sees results: per-cycle choices (values kept from the old company settings) */
const RX_SELFVIS=[{v:"After reviewer submits",t:"After the reviewer submits"},{v:"During review",t:"While the reviewer is reviewing"},{v:"Hidden until cycle end",t:"After the cycle ends"}];
/* V2 Overview › Settings (15-cycle-settings-kv.js): whether a reviewer sees the self-evaluation at all is the View Self-Evaluation column;
   this only says when — before or after they write their own review. "After the cycle ends" reads as "After submitting their review". */
function rxSelfVisOpts(){return rxV2()?[{v:"During review",t:"Before writing their review"},{v:"After reviewer submits",t:"After submitting their review"}]:RX_SELFVIS}
function rxSelfVisVal(x){return rxV2()&&x.selfVis==="Hidden until cycle end"?"After reviewer submits":x.selfVis}
const RX_RESULTS=[{v:"After cycle closes",t:"After the cycle closes"},{v:"As soon as their reviews are in",t:"As soon as their reviews are in"},{v:"Never",t:"Never"}];
/* V2 Overview › Settings wording: drop the ambiguous "their" (stored value unchanged) */
const rxResultsOpts=()=>rxV2()?RX_RESULTS.map(o=>o.v==="As soon as their reviews are in"?{...o,t:"As each review is submitted"}:o):RX_RESULTS;
function rxVisPick(v,id){if(!v)return;const x=rxInit(W());if(id==="rxSelfVis")x.selfVis=v;else x.results=v;render()}
const RX_SELFVIS_TXT={"After reviewer submits":"after they submit their own review","Hidden until cycle end":"only after the cycle ends","During review":"while their review is in progress"};
const RX_RESULTS_TXT={"After cycle closes":"after the cycle closes","As soon as their reviews are in":"as soon as their reviews are in"};
/* leaving the editor: keep the cycle as a draft so nothing is lost */
function rxGoSettings(){wzSave(true);nav("settings");toast("Cycle saved as a draft.")}
function rxDefaultsNote(){return ""}   // visibility is now chosen in this cycle (Reviewers section), so no "change it in settings" note
function rxDefaultsNoteOld(x,K){const st=D.settings,others=K.filter(k=>k!=="Self").map(k=>rxRow(x,k)),lines=[];
 if(x.self&&others.some(r=>r.seeSelf))lines.push(`Reviewers can view the self-evaluation <b>${RX_SELFVIS_TXT[st.selfVis]||esc(String(st.selfVis).toLowerCase())}</b>.`);
 if(others.some(r=>r.revSees))lines.push(st.results==="Never"?`Reviewees <b>don't see</b> their results.`:`Reviewees see their results <b>${RX_RESULTS_TXT[st.results]||esc(String(st.results).toLowerCase())}</b>.`);
  return `<div id="rxDefNote">${lines.length?banner("info",`${lines.join(" ")} This applies to all cycles and can only be changed in settings. <button type="button" class="inline-link" onclick="rxGoSettings()">Go to Performance settings</button>`,{cls:"defaults-note"}):""}</div>`}
/* ---- Peer nomination row (Reviewers section, above the reviewer table): on/off + how many peers ---- */
function rxPeerOpt(w,x){
 return rxOpt(x.peers,"rxPeersSet(this.checked)","Peer nomination","Reviewees nominate peers for their manager to approve.",rxPeerNest(w,x))}
function rxPeerNest(w,x){
 const peerErr=fcErr(w,"peerMax");
 /* edits to a submitted self-evaluation follow Reviewers › Allow edits after submission (no separate option here) */
 const selfNest="";
 const peerNest=x.peers?`<div class="sub-settings"><div class="field"><span class="sr-only" id="rxPeerModeQ">How many peers can they nominate?</span>
   <div class="inline-fields">${fcSel({id:"rxPeerMode",value:x.peerMode,options:[{v:"count",t:"Specific count"},{v:"any",t:"Unlimited"}],ph:"Select",pick:"rxPeerMode",cls:"reopen-settings__select"})}
    ${x.peerMode==="count"?`<span class="number-stepper number-stepper--fluid"><input class="input input--number ${peerErr?"bad":""}" id="rxPeerMax" type="number" inputmode="numeric" min="1" max="50" step="1" value="${x.peerMax||1}" aria-label="Maximum peers they can nominate" onkeydown="if(['-','+','e','E','.',','].includes(event.key))event.preventDefault()" oninput="rxPeerMaxIn(this)" onblur="rxPeerMaxOut(this)">${rxStepB}</span><span class="choice-item__text">peers</span>`:""}</div>
   ${fcMsg(w,"peerMax")}</div></div>`:"";
 return peerNest}
/* ---- Participants: reviewees (projects · role + self-evaluation) · reviewer roles · peer nomination · auto-assignment.
   Everything after the reviewee row shows once a reviewee role is picked. Project Completion Reviews have no peer nomination
   and no auto-assignment (reviewees come from the selected projects). ---- */
function rxParticipants(w,x){const ready=rxReady(w,x),proj=rxAllInProject(w);
 return `<section class="section">${rxHd("Participants")}
  <div class="setting-list">
   ${rxProjects(w)}
   <div class="setting">${fcQ("Who is going to be reviewed?"+FC_REQ,{id:"rxWhoQ"})}
    ${fcSel({id:"rxWho",value:x.reviewee||"",options:[...RX_ROLES].reverse().map(r=>({v:r,t:r})),ph:"Select",pick:"fcWhoPick",bad:fcErr(w,"reviewee"),cls:x.reviewee?"":"select--up"}).replace('aria-haspopup="listbox"','aria-haspopup="listbox" aria-required="true"')}${fcMsg(w,"reviewee")}
    ${x.reviewee?`<label class="choice-item choice--self-eval"><input class="checkbox sm" type="checkbox" ${x.self?"checked":""} onchange="rxSet('self',this.checked)"><span>Allow self-evaluation</span></label>`:""}
   </div>
   ${ready?`<div class="setting">${fcQ("Who should review them?"+FC_REQ,{for:"rxRevs"})}${rxRevsField(w,x)}${fcMsg(w,"revs")}</div>
   ${proj?"":rxPeerOpt(w,x)}`:""}
  </div>
  ${ready&&!proj?aaBody(w,x):""}
</section>`}

/* ---- Project Completion Review: which projects the cycle covers (all, or a picked list). Reuses the reviewer multi-select pattern. ---- */
const rxProjList=()=>Object.keys(ORG.project).sort();
/* All projects / Specific projects (radio group). "Specific projects" opens a project multi-select on a nested line under it. */
function rxProjSync(w){const L=rxProjList();w.projs=w.projs.filter(p=>L.includes(p))}   // drops unknown projects, keeps the pick order (chips show first-picked first)
function rxProjMode(v){const w=W();w.projMode=v;rxClear("projMode");
 if(v==="specific"&&w.projs.length===rxProjList().length)w.projs=[];   // old "all ticked" data starts empty
 rxClear("projs");RXP.id=null;render();const r=document.querySelector(`input[name="projMode"][value="${v}"]`);if(r)r.focus({preventScroll:true})}
function rxProjPick(i,on){const w=W(),v=rxProjList()[i];w.projs=w.projs.filter(p=>p!==v);if(on)w.projs.push(v);rxProjSync(w);rxClear("projs");render();const c=$("#rxProj"+i);if(c)c.focus({preventScroll:true})}
function rxProjField(w){const open=RXP.id==="projs",L=rxProjList(),sel=w.projs.filter(p=>L.includes(p));
 const tags=sel.length?sel.map(p=>`<span class="chip"><span class="chip__label">${esc(p)}</span><button type="button" class="chip__remove" aria-label="Remove ${esc(p)}" onclick="rxProjPick(${L.indexOf(p)},false)"><img src="/assets/icons/x-close-badge.svg" width="20" height="20" alt=""></button></span>`).join(""):`<span class="multiselect__placeholder">Select</span>`;
 return `<div class="dropdown"><div class="input multiselect ${fcErr(w,"projs")?"bad":""} ${open?"open":""}" onclick="rxOpen('projs',event)">${tags}
   <button type="button" class="dropdown__trigger multiselect__toggle" data-for="projs" id="rxProjs" aria-haspopup="true" aria-expanded="${open}" aria-label="Choose projects${sel.length?`, ${sel.length} selected`:""}"></button></div>
  ${open?`<div class="dropdown__menu" data-for="projs" role="group" aria-label="Projects"><div class="dropdown__list">
   ${L.map((p,i)=>`<label class="dropdown__option"><input class="checkbox" type="checkbox" id="rxProj${i}" ${w.projs.includes(p)?"checked":""} onchange="rxProjPick(${i},this.checked)"><span>${esc(p)}</span></label>`).join("")}</div></div>`:""}</div>`}
function rxProjects(w){if(w.ctype!=="Project Completion Review")return"";fcTypeInit(w);
 const rad=(v,t)=>`<label class="choice-item"><input class="radio" type="radio" name="projMode" value="${v}" ${w.projMode===v?"checked":""} onchange="rxProjMode('${v}')"><span>${t}</span></label>`;
 return `<div class="setting">${fcQ("Which projects should be included?"+FC_REQ,{id:"rxProjL"})}
  <div class="choice-group project-scope"><div class="choice-list" role="radiogroup" aria-labelledby="rxProjL" aria-required="true"${fcErr(w,"projMode")?' aria-invalid="true"':""}>${rad("all","All projects")}${rad("specific","Specific projects")}</div>
  ${w.projMode==="specific"?`<div class="sub-settings project-scope__pick">${rxProjField(w)}</div>`:""}</div>${fcMsg(w,"projMode")}${fcMsg(w,"projs")}</div>`}
/* ---- Evaluation & Scoring: reviewer table (weightage · questionnaire · due date · per-reviewer visibility and anonymity)
   → reviewee sees results → reviewer sees self-evaluation → allow edits after submission → rating format ---- */
function rxEvaluation(w,x){
 /* Overall Rating's final card (15-cycle-settings-kv.js + 27-section-rows.js), minus its frame and heading */
 const rating=rxRating(w).replace(/^\s*<section class="section"[^>]*>\s*<h2 class="section-hd">[\s\S]*?<\/h2>/,"").replace(/<\/section>\s*$/,"");
 return `<section class="section">${rxHd("Evaluation &amp; Scoring")}
  ${rxTable(w,x)}
  <div class="setting-list">
   <div class="setting">${fcQ("Reviewee view final results"+FC_REQ,{id:"rxResultsQ",d:"When reviewees can see their reviews and rating.",did:"rxResultsD"})}
    ${fcSel({id:"rxResults",value:x.results,options:RX_RESULTS.map(o=>({v:o.v,t:o.t})),ph:"Select",pick:"rxVisPick"}).replace('aria-haspopup="listbox"','aria-haspopup="listbox" aria-describedby="rxResultsD"')}</div>
   ${x.self?`<div class="setting">${fcQ("Reviewers view self-evaluation"+FC_REQ,{id:"rxSelfVisQ",d:"When reviewers can read the reviewee's self-evaluation.",did:"rxSelfVisD"})}
    ${fcSel({id:"rxSelfVis",value:x.selfVis,options:RX_SELFVIS.map(o=>({v:o.v,t:o.t})),ph:"Select",pick:"rxVisPick"}).replace('aria-haspopup="listbox"','aria-haspopup="listbox" aria-describedby="rxSelfVisD"')}</div>`:""}
   ${rxKeys(x).length?rxOpt(x.revEdit.on,"rxEditSet('revEdit','on',this.checked)","Editing submissions",`Reviewers can edit a submission until it's due, or until the cycle ends if there's no due date.`):""}
  </div>
  ${rating}
</section>`}
/* ---- Review Guidance (last card): what reviewers get alongside the questionnaire — additional notes (18-cycle-description.js) · credentials ---- */
function rxGuidance(w,x){
 return `<section class="section">${rxHd("Review Guidance")}
  <div class="setting-list">
   ${typeof fcNotesRow==="function"?fcNotesRow(w):""}
   ${rxOpt(x.creds,"W().rx.creds=this.checked","Credentials","Show reviewee's licenses and certifications on the review.")}
  </div>
</section>`}
/* checkbox setting: an ordinary .setting row (question + description left; short checkbox label right, nested settings
   under it). It must sit directly in a .setting-list so fcWrapAnswers (27-section-rows.js) moves .setting__options into the answer column. */
const RX_OPT_SHORT={"Editing submissions":"Allow edits after submission","Auto-assign cycle":"Allow",
 "Credentials":"Include credentials in review","Cycle reopening":"Allow reopening after the end date",
 "Self-evaluation":"Allow","Peer nomination":"Allow"};
let rxRowN=0;
function rxOpt(on,act,t,d,extra=""){const id="rxRow"+(++rxRowN);
 return `<div class="setting" role="group" aria-labelledby="${id}t">
  ${fcQ(t,{id:id+"t",d,did:id+"d"})}
  <div class="setting__options"><label class="choice-item"><input class="checkbox sm" type="checkbox" ${on?"checked":""} ${d?`aria-describedby="${id}d"`:""} onchange="${act}"><span>${RX_OPT_SHORT[t]||t}</span></label>${extra}</div></div>`}
/* ---- Which employees should be included? (inside the Employees card)
   All people in the reviewed role, or only those in selected groups. Each group row = category + values; rows combine with AND.
   Exclusions apply on top. Manual assignment from the detail page still works. ---- */
const AA_CATS=[["dept","Department","Departments"],["branch","Branch","Branches"],["project","Project","Projects"],["crew","Crew","Crews"],
 ["title","Job title","Job titles"],["trade","Trade","Trades"],["type","Employee type","Employee types"]];
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
 const q=(document.querySelector(`.dropdown__menu[data-for="aa:${f}"] .dropdown__search-input`)||{}).value||"";render();
 const pop=document.querySelector(`.dropdown__menu[data-for="aa:${f}"]`);if(pop){const sr=pop.querySelector(".dropdown__search-input");if(sr&&q){sr.value=q;aaFilter(sr)}const c=$(`#aaOpt${f}-${i}`);if(c)c.focus({preventScroll:true})}}
function aaFilter(el){const q=el.value.trim().toLowerCase(),pop=el.closest(".dropdown__menu");let n=0;
 pop.querySelectorAll(".dropdown__option").forEach(m=>{const hit=!q||m.dataset.n.includes(q);m.style.display=hit?"":"none";if(hit)n++});pop.querySelector(".dropdown__empty").hidden=n>0}
function aaMulti(f,sel,ph,aria,bad,dis){const id="aa:"+f,open=!dis&&RXP.id===id,opts=dis?[]:aaOpts(f);
 const tags=sel.length?sel.map(v=>opts.findIndex(o=>o.v===v)).filter(i=>i>-1).map(i=>{const o=opts[i];return `<span class="chip"><span class="chip__label">${esc(o.t)}</span><button type="button" class="chip__remove" aria-label="Remove ${esc(o.t)}" onclick="aaToggle('${f}',${i},false)"><img src="/assets/icons/x-close-badge.svg" width="20" height="20" alt=""></button></span>`}).join(""):`<span class="multiselect__placeholder">${ph}</span>`;
 return `<div class="dropdown"><div class="input multiselect ${bad?"bad":""} ${open?"open":""} ${dis?"is-dis":""}" ${dis?"":`onclick="rxOpen('${id}',event)"`}>${tags}
   <button type="button" class="dropdown__trigger multiselect__toggle" data-for="${id}" id="aa_${f}" aria-haspopup="true" aria-expanded="${open}" aria-label="${aria}${sel.length?`, ${sel.length} selected`:""}" ${dis?"disabled":""}></button></div>
  ${open?`<div class="dropdown__menu ${f==="excl"?"dropdown__menu--two-line":""}" data-for="${id}" role="group" aria-label="${aria}">${f==="excl"||opts.length>8?`<div class="dropdown__search"><input class="dropdown__search-input" type="search" placeholder="Search" aria-label="Search ${aria.toLowerCase()}" autocomplete="off" oninput="aaFilter(this)"></div>`:""}
   <div class="dropdown__list">${opts.length?opts.map((o,i)=>`<label class="dropdown__option" data-n="${esc((o.t+" "+o.s).toLowerCase())}"><input class="checkbox" type="checkbox" id="aaOpt${f}-${i}" ${sel.includes(o.v)?"checked":""} onchange="aaToggle('${f}',${i},this.checked)">${f==="excl"?`<span class="dropdown__text"><span class="dropdown__primary">${esc(o.t)}</span><span class="dropdown__secondary">${esc(o.s)}</span></span>`:`<span>${esc(o.t)}</span><span class="dropdown__meta">${esc(o.s)}</span>`}</label>`).join(""):`<div class="dropdown__empty">No employees match</div>`}<div class="dropdown__empty" hidden>No matches</div></div></div>`:""}</div>`}
function aaGroupRow(w,a,g,i){const used=a.groups.map(x=>x.by),c=AA_CAT[g.by],bad=fcErr(w,"autoVals");
 return `${i?`<div class="auto-assign__and">and</div>`:""}<div class="auto-assign__group">
  ${fcSel({id:"aaCat"+i,value:g.by,label:`Group ${i+1}: category`,ph:"Select",pick:"aaCatPick",bad:bad&&!g.by,
   options:AA_CATS.map(([k,o])=>({v:k,t:o,dis:k!==g.by&&used.includes(k),title:"Already used in another group"}))})}
  ${aaMulti("v"+i,g.vals,"Select",c?c.pl:`Group ${i+1} values`,bad&&g.by&&!g.vals.length,!c)}
  <button type="button" class="lb-icon-btn lb-icon-btn--tertiary auto-assign__remove" aria-label="Remove group ${i+1}" ${a.groups.length>1?'data-tip="Remove"':""} onclick="aaDelGroup(${i})" ${a.groups.length>1?"":"disabled"}><span class="lb-icon-btn__icon lb-icon-btn__icon--close" aria-hidden="true"></span></button></div>`}
function aaBody(w,x){return `<div class="setting-list">${rxOpt(aaInit(x).on,"aaOn(this.checked)","Auto-assign cycle",AA_DESC,aaFields(w,x))}</div>`}
const AA_DESC="Add all reviewees or only those in specific groups automatically. You can also assign people to the cycle manually.";
function aaFields(w,x){const a=aaInit(x),role=x.reviewee?(x.reviewee+"s").replace(/\b([A-Z])(?=[a-z])/g,c=>c.toLowerCase()):"employees",   // "workers", "project managers" (acronyms like HR stay)
 n=aaMatch(a).filter(e=>!a.excl.includes(e.id)).length,
 ready=a.mode==="all"||aaLive(a).length>0,more=a.groups.length<AA_CATS.length;
 const rad=(m,t)=>`<label class="choice-item"><input class="radio" type="radio" name="aaMode" value="${m}" ${a.mode===m?"checked":""} onchange="aaMode('${m}')"><span>${t}</span></label>`;
 const body=a.on?`<div class="auto-assign">
  <div class="choice-list" role="radiogroup" aria-label="Employees to auto-assign">${rad("all",`All ${esc(role)}`)}${rad("groups",`Only ${esc(role)} from selected groups`)}</div>
  ${a.mode==="groups"?`<div class="auto-assign__groups">${a.groups.map((g,i)=>aaGroupRow(w,a,g,i)).join("")}${fcMsg(w,"autoVals")}
   ${more?`<button type="button" class="lb-btn lb-btn--tertiary-blue lb-btn--sm auto-assign__add" onclick="aaAddGroup()"><span class="lb-btn__icon lb-btn__icon--plus" aria-hidden="true"></span><span class="lb-btn__label">Add category</span></button>`:""}</div>`:""}
  <div class="field"><label class="field__label" for="aa_excl">Exclude</label>${aaMulti("excl",a.excl,"Select","Employees to exclude",false)}</div>
  ${ready?banner("info",`<b>${n} employee${n===1?"":"s"}</b> will be added when the cycle starts${a.excl.length?` (${a.excl.length} excluded)`:""}. Anyone who joins later and matches will be added automatically.`):""}</div>`:"";
 return body}
function aaOn(on){const a=aaInit(rxInit(W()));a.on=on;rxClear("autoVals");RXP.id=null;render()}
/* ---- Save as Draft → "Saved" until something changes ---- */
const fcSnap=w=>JSON.stringify(w,(k,v)=>["_snap","errs","saved","editing"].includes(k)?undefined:v);
function fcSaveSync(){const b=$("#fcSaveBtn"),w=W();if(!b||!w)return;const clean=!!w._snap&&w._snap===fcSnap(w);
 b.textContent=clean?"Saved":"Save as Draft";b.classList.toggle("is-saved",clean);b.disabled=clean}
function fcSaveDraft(){wzSave(true);const w=W();render();w._snap=fcSnap(w);fcSaveSync()}
["input","change","click"].forEach(t=>document.addEventListener(t,()=>{if(S.view==="wizard")setTimeout(fcSaveSync,0)},true));
/* ---- multi-selects keep a fixed height: chips that overflow the line are hidden behind a "+N" badge (hover lists them).
   Leftover space before the badge is used by the next chip with its label cut off (…), when at least RX_CHIP_MIN px of label shows;
   hovering that chip shows its full name. ---- */
const RX_CHIP_MIN=40;
const rxChipTxt=t=>t.querySelector(".chip__label").textContent.trim();
function rxFitChips(){document.querySelectorAll(".editor .multiselect").forEach(ms=>{
 ms.querySelectorAll(".chip--more").forEach(b=>b.remove());const tags=[...ms.querySelectorAll(":scope>.chip")];
 tags.forEach(t=>{t.hidden=false;t.style.removeProperty("max-width");t.removeAttribute("title")});if(tags.length<2)return;
 const edge=()=>ms.getBoundingClientRect().right-parseFloat(getComputedStyle(ms).paddingRight)+0.5;
 const fits=el=>el.getBoundingClientRect().right<=edge();
 if(fits(tags[tags.length-1]))return;
 const b=document.createElement("span");b.className="chip--more";tags[tags.length-1].after(b);
 let n=1;for(let i=tags.length-1;i>0;i--,n++){tags[i].hidden=true;b.textContent="+"+n;if(fits(b))break}
 /* partial chip: the first hidden one, shrunk to the space left before a "+(N-1)" badge */
 const k=tags.length-n,t=tags[k];
 if(t&&n>0){t.hidden=false;if(n>1)b.textContent="+"+(n-1);else b.hidden=true;
  const gap=parseFloat(getComputedStyle(ms).columnGap)||0,room=edge()-t.getBoundingClientRect().left-(n>1?gap+b.getBoundingClientRect().width:0),
   lbl=t.querySelector(".chip__label"),chrome=t.getBoundingClientRect().width-lbl.getBoundingClientRect().width;
  if(room-chrome>=RX_CHIP_MIN){t.style.maxWidth=Math.floor(room)+"px";t.title=rxChipTxt(t);if(n===1)b.remove()}
  else{t.hidden=true;b.hidden=false;b.textContent="+"+n}}
 if(b.isConnected)b.title=tags.filter(x=>x.hidden).map(rxChipTxt).join(", ")})}
addEventListener("resize",()=>{if(S.view==="wizard")rxFitChips()});
const _renderSv=render;render=function(...a){_renderSv(...a);if(S.view==="wizard"){fcSaveSync();rxPlacePops();rxFitChips()}};
/* ---- Exit: confirm unless everything is already saved (Figma LMS 1:20632) ---- */
function fcExit(){wzCollect();const w=W();if(w._snap&&w._snap===fcSnap(w)){nav("cycles",{cycTab:"Draft"});return}
 const ex=$("#layer .mbg");if(ex)ex.remove();
 $("#layer").insertAdjacentHTML("beforeend",`<div class="mbg" onclick="if(event.target===this)closeModal()"><div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="fcDlgT" aria-describedby="fcDlgD">
  <div class="dialog__backdrop" aria-hidden="true"><img src="/assets/dlg-pattern.svg" width="336" height="336" alt=""></div>
  <button type="button" class="lb-icon-btn lb-icon-btn--tertiary dialog__close" aria-label="Close" onclick="closeModal()"><span class="lb-icon-btn__icon lb-icon-btn__icon--close" aria-hidden="true"></span></button>
  <div class="dialog__header"><span class="dialog__icon" aria-hidden="true"><img src="/assets/x-close-featured.svg" width="24" height="24" alt=""></span>
   <div class="dialog__title"><h2 id="fcDlgT">Are you sure you want to exit?</h2><p id="fcDlgD">You can save this review cycle as a draft which will show up in the <b>Drafts</b> tab of <b>Review Cycles.</b></p></div></div>
  <div class="dialog__actions"><button type="button" class="lb-btn lb-btn--secondary" onclick="fcExitDiscard()">Exit Without Saving</button><button type="button" class="lb-btn lb-btn--primary" id="fcDlgSave" onclick="fcExitSave()">Save &amp; Exit</button></div></div></div>`);
 $("#fcDlgSave").focus()}
function fcExitDiscard(){closeModal();const w=W();if(!(w.id&&C(w.id)))S.wz=null;nav("cycles",w.id&&C(w.id)?{cycTab:"Draft"}:{})}
function fcExitSave(){closeModal();wzSave(true);nav("cycles",{cycTab:"Draft"});toast("Draft saved.")}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("#layer .dialog")){closeModal();const b=$(".editor__exit");if(b)b.focus()}});
/* ---- Overall Rating ---- */
const RX_FMT_LBL={"Stars":"Stars (1–5)","Numeric 1–5 with definitions":"Numbers (1–5)","No rating":"No rating"};
const RX_FMTS=[...RATING_FMT,{k:"No rating",n:"No rating"}];
function rxRating(w){if(!RX_FMTS.some(f=>f.k===w.rating))w.rating="Numeric 1–5 with definitions";const none=w.rating==="No rating",star=w.rating==="Stars",lv=(star&&D.settings.starLevels)||D.settings.levels;
 const badge=i=>star?`<span class="rating-stars" aria-label="${i+1} of 5 stars">${[0,1,2,3,4].map(j=>`<span class="${j<=i?"on":""}">★</span>`).join("")}</span>`:`<span class="rating-badge n${i+1}">${i+1}</span>`;
 return `<section class="section">${rxHd("Overall Rating","One overall rating format for everyone in this cycle, or no overall rating. Questionnaires can still ask their own questions.")}
  <div class="setting-list"><div class="setting">${fcQ("Rating format"+FC_REQ,{for:"rxFmt"})}
   <select class="input input--select" id="rxFmt" onchange="W().rating=this.value;render()">${RX_FMTS.map(o=>`<option value="${o.k}" ${o.k===w.rating?"selected":""}>${RX_FMT_LBL[o.k]||o.n}</option>`).join("")}</select>
</div></div>
  ${none?banner("info",`Employees see the written feedback only, without a score.`)
   :banner("info",`<b class="rating-scale__heading">What employees see</b>${lv.map((l,i)=>`<span class="rating-scale__row">${badge(i)}<span class="rating-scale__label">${esc(l)}</span></span>`).join("")}`,{cls:"rating-scale"})}</section>`}
/* ---- Review Settings: rating format, credentials, edits after submission, reopening, auto-assign ---- */
/* Who can reopen: admins, HR managers and every manager role (no Foreman / Worker). */
const RX_REOPEN_BY=["Admin","HR Admin","HR Manager",...Object.keys(RX_MGR_TYPE)];
/* Admin and HR Admin can always reopen: ticked, can't be removed */
const RX_REOPEN_LOCKED=["Admin","HR Admin"];
function rxReopenBy(v,on,i){const x=rxInit(W());if(RX_REOPEN_LOCKED.includes(v))return;x.reopenBy=x.reopenBy.filter(o=>o!==v);if(on)x.reopenBy.push(v);rxClear("reopenBy");render();
 const c=i===undefined?null:$("#rxRbOpt"+i);if(c)c.focus({preventScroll:true})}
/* shared single-select pick: "Specific period" puts the cursor in the months field */
function rxReopenWinPick(v){if(!v)return;rxReopenWin(v);if(v==="period")setTimeout(()=>{const n=$("#rxReopenMonths");if(n)n.focus()},0)}
function rxReopenWin(v){const x=rxInit(W());x.reopenWin=v;if(v==="period"&&!(x.reopenMonths>=1))x.reopenMonths=3;rxClear("reopenMonths");render()}
function rxReopenMonths(el){const x=rxInit(W()),v=parseInt(el.value,10);x.reopenMonths=isNaN(v)?"":v;rxClear("reopenMonths");el.classList.remove("bad");
 const m=el.closest(".field").querySelector(".error-text");if(m)m.remove()}
function rxReopenByField(w,x){const open=RXP.id==="reopenBy",bad=fcErr(w,"reopenBy"),sel=x.reopenBy.filter(o=>RX_REOPEN_BY.includes(o));
 const tags=sel.length?sel.map(o=>`<span class="chip"><span class="chip__label">${o}</span>${RX_REOPEN_LOCKED.includes(o)?"":`<button type="button" class="chip__remove" aria-label="Remove ${o}" onclick="rxReopenBy('${o}',false)"><img src="/assets/icons/x-close-badge.svg" width="20" height="20" alt=""></button>`}</span>`).join(""):`<span class="multiselect__placeholder">Select</span>`;
 return `<div class="dropdown">
  <div class="input multiselect ${bad?"bad":""} ${open?"open":""}" onclick="rxOpen('reopenBy',event)">${tags}
   <button type="button" class="dropdown__trigger multiselect__toggle" data-for="reopenBy" id="rxReopenBy" aria-haspopup="true" aria-expanded="${open}" aria-label="Who can reopen the cycle${sel.length?`, ${sel.length} selected`:""}"></button></div>
  ${open?`<div class="dropdown__menu" data-for="reopenBy" role="group" aria-label="Who can reopen the cycle">${RX_REOPEN_BY.map((o,i)=>`<label class="dropdown__option"><input class="checkbox" type="checkbox" id="rxRbOpt${i}" ${sel.includes(o)?"checked":""} ${RX_REOPEN_LOCKED.includes(o)?`disabled title="${o}s can always reopen a cycle"`:""} onchange="rxReopenBy('${o}',this.checked,${i})"><span>${o}</span></label>`).join("")}</div>`:""}
 </div>`}
/* Cycle reopening: a row in the Cycle Details card, under Repeats.
   Checking it starts on "Specific period" with the months field empty and the cursor in it (it's required: fcCreate flags it if left empty) */
function rxReopenSet(on){const x=rxInit(W());x.reopen=on;if(on){x.reopenWin="period";x.reopenMonths=""}rxClear("reopenMonths","reopenBy");render();
 if(on){const i=$("#rxReopenMonths");if(i)i.focus({preventScroll:true})}}
function rxReopenOpt(w,x){const badM=fcErr(w,"reopenMonths"),per=x.reopenWin==="period";
 const reopen=x.reopen?`<div class="sub-settings sub-settings--column reopen-settings">
   <div class="field"><div class="inline-fields">${fcSel({id:"rxReopenWin",value:per?"period":"any",options:[{v:"period",t:"Specific period"},{v:"any",t:"Anytime"}],ph:"Select",pick:"rxReopenWinPick",label:"How long after the end date it can be reopened",cls:"reopen-settings__select"})}
     ${per?`<span class="number-stepper number-stepper--fluid"><input class="input input--number ${badM?"bad":""}" id="rxReopenMonths" type="number" inputmode="numeric" min="1" max="24" value="${x.reopenMonths}" aria-label="Months after the end date that the cycle can be reopened" oninput="rxReopenMonths(this)">${rxStepB}</span><span class="choice-item__text">months</span>`:""}</div>${fcMsg(w,"reopenMonths")}</div>
   <div class="field"><label class="field__label" for="rxReopenBy">Who can reopen it?</label>${rxReopenByField(w,x)}${fcMsg(w,"reopenBy")}</div></div>`:"";
 return rxOpt(x.reopen,"rxReopenSet(this.checked)","Cycle reopening","Reopen the cycle after the end date to collect late or missed reviews.",reopen)}
/* ---- top bar (Figma Exploration – Lumber Web App 785:34380): Exit | title on the left, Save as Draft + Create on the right.
   Styles: src/styles/23-cycle-header.css. The Edit flow (16-edit-cycle.js) swaps the actions for Cancel / Save. ---- */
const fcHeader=title=>`<header class="editor__header">
  <div class="editor__heading"><button type="button" class="lb-btn lb-btn--link-gray editor__exit" onclick="fcExit()"><span class="lb-btn__icon lb-btn__icon--close" aria-hidden="true"></span><span class="lb-btn__label">Exit</span></button><span class="editor__divider" aria-hidden="true"></span><h1 class="editor__title">${title}</h1></div>
  <div class="editor__actions"><button type="button" class="lb-btn lb-btn--secondary editor__save" id="fcSaveBtn" onclick="fcSaveDraft()">Save as Draft</button><button type="button" class="lb-btn lb-btn--primary" onclick="fcCreate()">Create Cycle</button></div>
 </header>`;
/* ---- editor: Cycle Details → Participants → Evaluation & Scoring → Review Guidance ---- */
V.wizard=()=>{
 FCP.open=false;const w=W();if(!w)return V.cycles();wzCollect();rolesInit(w);datesInit(w);syncPhases(w);
 const x=rxInit(w);
 if(S.rxTplFor){const n=T(S.rxTplFor.id);if(n&&n.status==="Active"&&rxKeys(x).includes(S.rxTplFor.k)){rxRow(x,S.rxTplFor.k).tpl=n.id}S.rxTplFor=null}
 rxSync(w);w.overallBy="Weighted average of all reviewers";
 const edit=!!w.editing;
 return `<div class="editor">
  ${fcHeader(fcTitle(w))}
  <div class="editor__body">${fcSteps()}<div class="editor__main">${fcSections([fcDetails(w),rxParticipants(w,x),...(rxReady(w,x)?[rxEvaluation(w,x),rxGuidance(w,x)]:[])])}</div></div>
 </div>`};
/* ---- left section nav (Figma Exploration – Lumber Web App 785:34389): one step per card, text only, click to scroll, highlights the card in view ---- */
const FC_SECS=["Cycle Details","Participants","Evaluation & Scoring","Review Guidance"];
let fcOn=0;
/* each card gets an id for the nav (no numbering: Figma Exploration – Lumber Web App 785:34389) */
/* each card's id is its section name (left nav, Overview › Edit and the scroll highlight find cards by it) */
const FC_SEC_IDS=["cycle-details","participants","evaluation","guidance"];
/* Overview › Settings has the same four cards as the editor: each card's Edit opens its own section */
const FC_CARD_SEC=[0,1,2,3];
const fcSecEl=i=>document.getElementById(FC_SEC_IDS[i]);
const fcSections=cards=>cards.map((c,i)=>c.replace('<section class="section"',`<section class="section" id="${FC_SEC_IDS[i]}"`)).join("");
/* the nav lists only the cards on the page: Evaluation & Scoring and Review Guidance appear once a reviewee role is picked */
const fcSecCount=()=>{const w=W();return w&&rxReady(w,rxInit(w))?FC_SECS.length:2};
const fcSteps=()=>`<nav class="editor__nav" aria-label="Sections">${FC_SECS.slice(0,fcSecCount()).map((t,i)=>`<button type="button" class="editor__nav-item ${i===fcOn?"on":""}" ${i===fcOn?'aria-current="step"':""} onclick="fcJump(${i})"><span class="editor__nav-label">${t}</span></button>`).join("")}</nav>`;
function fcMark(i){if(i===fcOn&&document.querySelector(".editor__nav-item.on"))return;fcOn=i;document.querySelectorAll(".editor__nav-item").forEach((b,j)=>{b.classList.toggle("on",j===i);j===i?b.setAttribute("aria-current","step"):b.removeAttribute("aria-current")})}
function fcJump(i){const c=fcSecEl(i);if(!c)return;fcMark(i);fcLock=Date.now()+700;c.scrollIntoView({block:"start",behavior:"smooth"})}
let fcLock=0;
addEventListener("scroll",()=>{if(S.view!=="wizard"||Date.now()<fcLock)return;const top=(document.querySelector(".editor__header")||{}).offsetHeight||0;
 const cards=FC_SECS.map((_,i)=>fcSecEl(i)).filter(Boolean);if(!cards.length)return;
 const atEnd=innerHeight+scrollY>=document.documentElement.scrollHeight-2;
 let i=0;cards.forEach((c,j)=>{if(c.getBoundingClientRect().top<=top+120)i=j});fcMark(atEnd?cards.length-1:i)},{passive:true});
/* opening the editor (new cycle, draft or edit) puts the cursor in Cycle name, at the end of any name already there */
function fcFocusName(){const n=$("#wName");if(!n)return;n.focus({preventScroll:true});const e=n.value.length;try{n.setSelectionRange(e,e)}catch(_){}}
const _navFc=nav;nav=function(v,...a){const was=S.view;if(v==="wizard")fcOn=0;const r=_navFc(v,...a);if(v==="wizard"&&was!=="wizard")setTimeout(fcFocusName,0);return r};
fcCreate=function(){wzCollect();RXP.id=null;const w=W(),x=rxInit(w),s=toISO(w.start),e=toISO(w.end),errs={},K=rxKeys(x),t=rxTotal(x);
 if(!w.name.trim())errs.name="Enter a cycle name";
 if(w.ctype==="General Review"&&(!s||!e))errs.period="Select a cycle period";
 if(w.ctype==="General Review"&&w.recur&&!fcRecurOk(w.recurN))errs.recurN=`Enter 1 to ${FC_RECUR_MAX} occurrences`;
 if(w.ctype!=="General Review"&&w.probSched==="interval"){fcTypeInit(w);
  if(!(w.probEvery>=1&&w.probEvery<=12))errs.probEvery="Enter a number of months from 1 to 12";
  if(w.ctype==="New Hire Review"&&w.probTill==="period"&&!(w.probTillN>=1&&w.probTillN<=36))errs.probTillN="Enter 1 to 36 months after the start date";
  else if(w.ctype==="New Hire Review"&&w.probTill==="period"&&w.probEvery>=1&&w.probTillN<w.probEvery)errs.probTillN="The period must be at least as long as the interval";
  if(w.ctype==="Project Completion Review"&&!(w.projTillN>=1&&w.projTillN<=36))errs.projTillN="Enter 1 to 36 months after the completion date"}
 if(w.ctype==="Project Completion Review"&&!w.projMode)errs.projMode="Select which projects to include";
 if(w.ctype==="Project Completion Review"&&w.projMode==="specific"&&!(w.projs||[]).length)errs.projs="Select at least one project";
 if(!rxReady(w,x))errs.reviewee="Select who is going to be reviewed";
 if(!K.length)errs.revs="Pick at least one reviewer, or include a self-evaluation";
 else if(t!==100)errs.weight=`Weightage must add up to 100%. It's ${t}% now.`;
 const noTpl=K.filter(k=>!rxRow(x,k).tpl);
 if(noTpl.length)errs.tpl=`Select a questionnaire for ${noTpl.map(rxName).join(", ")}`;
 const lateDue=K.filter(k=>rxDueBad(w,rxRow(x,k)));
 if(lateDue.length)errs.due=`Due date${lateDue.length>1?"s":""} for ${lateDue.map(rxName).join(", ")} must fall within the cycle period (${rxCycleLen(w)} days)`;
 const aa=aaInit(x);if(!rxAllInProject(w)&&aa.on&&aa.mode==="groups"&&(!aaLive(aa).length||aa.groups.some(g=>!g.by||!g.vals.length)))errs.autoVals="Pick a category and at least one value for each group, or remove the empty group";
 if(x.peers&&x.peerMode==="count"&&!(x.peerMax>=1&&x.peerMax<=50))errs.peerMax="Enter 1 to 50 peers, or choose Unlimited";
 if(x.reopen){if(x.reopenWin==="period"&&!(x.reopenMonths>=1&&x.reopenMonths<=24))errs.reopenMonths="Enter 1 to 24 months";
  if(!x.reopenBy.length)errs.reopenBy="Pick at least one role who can reopen the cycle"}
 w.errs=errs;rxSync(w);const n=Object.keys(errs).length;   // only the inline field errors block Create
 if(n){render();const f=document.querySelector(".editor .bad");if(f){f.scrollIntoView({block:"center",behavior:"smooth"});if(f.focus)f.focus({preventScroll:true})}toast(`Fix ${n} item${n>1?"s":""} first.`);return}
 createCycle()};
/* drafts keep the participant setup */
const fcCopy=v=>Array.isArray(v)?[...v]:v;
const FC_TYPE_KEYS=["recurN","ctype","probSched","probEvery","probTill","probTillN","projTillN","projMode","projs"];
const _wzSaveRx=wzSave;wzSave=function(...a){_wzSaveRx(...a);const w=W(),c=w&&w.id&&C(w.id);if(!c)return;if(w.rx)c.rx=JSON.parse(JSON.stringify(w.rx));FC_TYPE_KEYS.forEach(k=>c[k]=fcCopy(w[k]))};
const _editDraftRx=editDraft;editDraft=function(cid){_editDraftRx(cid);const c=C(cid);if(!c||!S.wz)return;if(c.rx)S.wz.rx=JSON.parse(JSON.stringify(c.rx));FC_TYPE_KEYS.forEach(k=>{if(c[k]!=null)S.wz[k]=fcCopy(c[k])});render()};
/* sidebar red dot: a section whose card shows an inline error (unfilled mandatory field) gets an 8px red dot at the
   right end of its nav item; re-synced after every render and after edits, since some fixes clear errors without a render */
function fcNavDots(){if(S.view!=="wizard")return;document.querySelectorAll(".editor__nav-item").forEach((b,i)=>{const c=fcSecEl(i),bad=!!(c&&c.querySelector(".error-text")),d=b.querySelector(".editor__nav-dot");
 if(bad&&!d)b.insertAdjacentHTML("beforeend",'<span class="editor__nav-dot" aria-label="Has required fields to fill"></span>');else if(!bad&&d)d.remove()})}
["input","change","click"].forEach(t=>document.addEventListener(t,()=>setTimeout(fcNavDots),true));
const _renderRxCols=render;render=function(...a){_renderRxCols(...a);if(S.view==="wizard"){rxColApply();fcNavDots()}};
addEventListener("resize",()=>{if(S.view==="wizard")rxColApply()});

/* header title: the cycle name once it's filled (new cycles, drafts and live edits alike); while the name is empty,
   "New Review Cycle" / "Edit Review Cycle". Updates on every keystroke in the Cycle name field. */
function fcTitle(w){const n=(w&&w.name||"").trim();return n?esc(n):(w&&w.editing?"Edit Review Cycle":"New Review Cycle")}
document.addEventListener("input",e=>{if(e.target.id!=="wName"||S.view!=="wizard")return;const h=document.querySelector(".editor__title"),w=W();
 if(h&&w){const n=e.target.value.trim();h.textContent=n||(w.editing?"Edit Review Cycle":"New Review Cycle");h.title=n}});
/* first paint (on a refresh straight into the editor this can throw, because later layers aren't loaded yet:
   keep it the LAST statement in this file so nothing above is skipped) */
render();
/* reviewer table: keep its sideways scroll across re-renders (picking a questionnaire, ticking a checkbox, typing a weight…).
   Saved before the page re-draws, put back after the column widths are applied, then open menus are re-placed. */
const _renderRxScroll=render;render=function(...a){const sc=S.view==="wizard"&&document.querySelector(".editor__main .reviewer-table__scroll"),left=sc?sc.scrollLeft:0;
 _renderRxScroll(...a);if(!left||S.view!=="wizard")return;const n=document.querySelector(".editor__main .reviewer-table__scroll");if(!n)return;
 n.scrollLeft=left;n.classList.toggle("is-scrolled",n.scrollLeft>0);if(RXP.id)rxPlacePops()};
