/* ===== New Review Cycle: focused full-page editor (Figma LMS 1024:14407).
   Sub header (Exit · title · Save as Draft / Create) over a grey canvas with stacked 900px cards.
   No stepper: Cycle Details, then the important cards from the old Reviews step. People are still assigned afterwards from the list. ===== */
const FC_REPEATS=["Every month","Every 3 months","Every 6 months","Every year"];
/* older pattern/draft values map onto the new list; anything else (One time, Rolling) shows as not set */
const fcRecur=w=>{const v={"Every quarter":"Every 3 months"}[w.recur]||w.recur;w.recur=FC_REPEATS.includes(v)?v:"";return w.recur};
/* mandatory question: a "*" after the text (PTO prototype .req: same color as the question, 2px gap). Hidden from screen readers; the field carries aria-required */
const FC_REQ=`<span class="fc-req" aria-hidden="true">*</span>`;
const fcErr=(w,k)=>(w.errs||{})[k];
const fcMsg=(w,k)=>fcErr(w,k)?`<div class="fc-err">${esc(fcErr(w,k))}</div>`:"";
function fcName(el){const w=W();w.name=el.value;if(w.errs&&w.errs.name&&el.value.trim()){delete w.errs.name;el.classList.remove("bad");const m=el.closest(".fc-field").querySelector(".fc-err");if(m)m.remove()}}
/* ---- Cycle Period: one field, two-month range calendar ---- */
const fcMDY=iso=>{if(!iso)return"";const[y,m,d]=iso.split("-");return `${m}/${d}/${y}`};
const fcISO=(y,m,d)=>`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const FC_MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const FCP={open:false,y:0,m:0,s:"",e:"",hover:""};
function fcPeriodOpen(){if(FCP.open)return fcPeriodClose();const w=W();FCP.s=toISO(w.start);FCP.e=toISO(w.end);FCP.hover="";
 const base=FCP.s?new Date(FCP.s+"T12:00:00"):new Date();FCP.y=base.getFullYear();FCP.m=base.getMonth();FCP.open=true;fcPopDraw()}
function fcPeriodClose(){FCP.open=false;const p=$("#fcPop");if(p)p.remove();const f=$("#fcPeriod");if(f)f.setAttribute("aria-expanded","false")}
function fcShift(n){const d=new Date(FCP.y,FCP.m+n,1);FCP.y=d.getFullYear();FCP.m=d.getMonth();fcPopDraw()}
function fcDay(iso){if(!FCP.s||FCP.e){FCP.s=iso;FCP.e=""}else if(iso<FCP.s){FCP.s=iso}else{FCP.e=iso}FCP.hover="";fcPopDraw()}
function fcHover(iso){if(FCP.s&&!FCP.e&&FCP.hover!==iso){FCP.hover=iso;fcPopDraw()}}
function fcApply(){if(!FCP.s||!FCP.e)return;const w=W();if(w.errs)delete w.errs.period;FCP.open=false;
 w.start=fromISO(FCP.s);w.opens=FCP.s;dateSet("end",FCP.e);fcRepeatDraw()}
function fcMonth(y,m){const first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),today=new Date().toISOString().slice(0,10);
 const end=FCP.e||(FCP.s&&FCP.hover>FCP.s?FCP.hover:"");let cells="";
 for(let i=0;i<first;i++)cells+=`<span></span>`;
 for(let d=1;d<=n;d++){const iso=fcISO(y,m,d),c=[iso===FCP.s?"s":"",iso===end?"e":"",FCP.s&&end&&iso>FCP.s&&iso<end?"in":"",iso===today?"t":""].join(" ").trim();
  cells+=`<button type="button" class="${c}" onclick="fcDay('${iso}')" onmouseenter="fcHover('${iso}')" aria-label="${FC_MONTHS[m]} ${d}, ${y}" aria-pressed="${iso===FCP.s||iso===FCP.e}">${d}</button>`}
 return `<div><div class="fc-mon-h">${FC_MONTHS[m]} ${y}</div><div class="fc-wk">${["Su","Mo","Tu","We","Th","Fr","Sa"].map(x=>`<span>${x}</span>`).join("")}</div><div class="fc-days">${cells}</div></div>`}
function fcPopDraw(){const host=$("#fcPeriodWrap");if(!host)return;let p=$("#fcPop");if(!p){p=document.createElement("div");p.id="fcPop";p.className="fc-pop";p.setAttribute("role","dialog");p.setAttribute("aria-label","Choose cycle period");host.appendChild(p)}
 $("#fcPeriod").setAttribute("aria-expanded","true");
 const nx=new Date(FCP.y,FCP.m+1,1),days=FCP.s&&FCP.e?Math.round((new Date(FCP.e)-new Date(FCP.s))/864e5)+1:0;
 p.innerHTML=`<div class="fc-pop-nav"><button type="button" class="fc-nav" onclick="fcShift(-1)" aria-label="Previous month">‹</button><button type="button" class="fc-nav" onclick="fcShift(1)" aria-label="Next month">›</button></div>
  <div class="fc-mons" onmouseleave="if(FCP.hover){FCP.hover='';fcPopDraw()}">${fcMonth(FCP.y,FCP.m)}${fcMonth(nx.getFullYear(),nx.getMonth())}</div>
  <div class="fc-pop-f"><span class="fc-pop-sel">${FCP.s?`${fcMDY(FCP.s)} – ${FCP.e?fcMDY(FCP.e):"Pick an end date"}`:"Pick a start date"}${days?` <span class="dim">· ${days} days</span>`:""}</span>
  <div class="fc-acts"><button type="button" class="fc-btn sm" onclick="fcPeriodClose()">Cancel</button><button type="button" class="fc-btn p sm" ${FCP.s&&FCP.e?"":"disabled"} onclick="fcApply()">Apply</button></div></div>`}
document.addEventListener("mousedown",e=>{if(FCP.open&&!e.target.closest("#fcPeriodWrap"))fcPeriodClose()});
/* × before the calendar icon: removes the chosen period (same hover/focus × as Repeats) */
function fcPeriodClear(){const w=W();fcPeriodClose();Object.assign(w,{start:"",end:"",opens:"",datesSet:false});FCP.s=FCP.e=FCP.hover="";render();
 const f=$("#fcPeriod");if(f)f.focus({preventScroll:true})}
document.addEventListener("keydown",e=>{if(FCP.open&&e.key==="Escape"){fcPeriodClose();const f=$("#fcPeriod");if(f)f.focus()}});
/* ---- Review Type: General Review (Cycle Period + Repeats) · New Hire Review / Project Completion Review (own Review Schedule) ---- */
const FC_TYPES=["General Review","New Hire Review","Project Completion Review"];
/* one-time option per type; "At regular intervals" is shared. New Hire adds "till [end of probation | N months after the start date]" */
const FC_SCHED_END={"New Hire Review":"One-time review at the end of probation","Project Completion Review":"One-time review at project completion"};
const FC_TILL={probation:"end of probation period",period:"specific period from start date"};   // lowercase: reads on from "months till …"
function fcTypeInit(w){if(w.ctype==="Probation period")w.ctype="New Hire Review";if(!FC_TYPES.includes(w.ctype))w.ctype="General Review";
 if(!["end","interval"].includes(w.probSched))w.probSched="end";if(w.probEvery==null)w.probEvery=1;
 if(!FC_TILL[w.probTill])w.probTill="probation";if(w.probTillN==null)w.probTillN=12;if(w.projTillN==null)w.projTillN=3;
 if(!["all","specific"].includes(w.projMode))w.projMode="all";if(!Array.isArray(w.projs))w.projs=[];
 if(w.ctype!=="General Review")w.recur=""}
/* only General Review has a Cycle Period and Repeats; switching away clears Repeats so the cycle doesn't carry a hidden schedule */
function fcType(v){const w=W();w.ctype=v;if(v!=="General Review")w.recur="";if(w.errs)["probEvery","probTillN","projTillN","period","projs"].forEach(k=>delete w.errs[k]);render();const el=$("#fcTypeSel");if(el)el.focus()}
function fcProbSched(v){const w=W();w.probSched=v;if(w.errs){delete w.errs.probEvery;delete w.errs.probTillN;delete w.errs.projTillN}render();const el=document.querySelector(`input[name="fcProb"][value="${v}"]`);if(el)el.focus()}
function fcTill(v){const w=W();w.probTill=v;if(w.errs)delete w.errs.probTillN;render();const el=$("#fcTill");if(el)el.focus()}
/* number fields in the nested row: clear only their own error, without a re-render (keeps focus) */
function fcNestNum(el,k,ok){const w=W();w[k]=parseInt(el.value,10)||0;if(w.errs&&w.errs[k]&&ok(w)){delete w.errs[k];el.classList.remove("bad");const m=el.closest(".rx-nest").querySelector(`.fc-err[data-k="${k}"]`);if(m)m.remove()}}
const fcEvery=el=>fcNestNum(el,"probEvery",w=>w.probEvery>=1);
const fcTillN=el=>fcNestNum(el,"probTillN",w=>w.probTillN>=1);
const fcProjTillN=el=>fcNestNum(el,"projTillN",w=>w.projTillN>=1);
const fcNestMsg=(w,k)=>fcErr(w,k)?`<div class="fc-err" data-k="${k}">${esc(fcErr(w,k))}</div>`:"";
const fcNumIn=(id,v,bad,aria,oninput,max)=>`<span class="rx-step rx-step-n"><input class="fc-inp rx-numin ${bad?"bad":""}" id="${id}" type="number" inputmode="numeric" min="1" max="${max}" value="${v||""}" aria-label="${aria}" oninput="${oninput}">${typeof rxStepB==="string"?rxStepB:""}</span>`;
function fcProbation(w){const nh=w.ctype==="New Hire Review";
 const rad=(v,t)=>`<label class="rx-check"><input class="rx-rad" type="radio" name="fcProb" value="${v}" ${w.probSched===v?"checked":""} onchange="fcProbSched('${v}')"><span>${t}</span></label>`;
 const till=nh?`<select class="fc-inp fc-sel rx-till-sel" id="fcTill" aria-label="Keep reviewing till" onchange="fcTill(this.value)">${Object.entries(FC_TILL).map(([k,t])=>`<option value="${k}" ${w.probTill===k?"selected":""}>${t}</option>`).join("")}</select>
  ${w.probTill==="period"?`${fcNumIn("fcTillIn",w.probTillN,fcErr(w,"probTillN"),"Months after the start date","fcTillN(this)",36)}<span>months after the start date</span>`:""}`
  /* Project Completion: "till [N] months after the completion date" */
  :`${fcNumIn("fcProjTillIn",w.projTillN,fcErr(w,"projTillN"),"Months after the completion date","fcProjTillN(this)",36)}<span>months after the completion date</span>`;
 return `<div class="fc-field full">${fcQ("Review schedule",{id:"fcProbL"})}
  <div class="rx-chkbox fc-prob"><div class="rx-checks" role="radiogroup" aria-labelledby="fcProbL">${rad("end",FC_SCHED_END[w.ctype])}${rad("interval","At regular intervals")}</div>
  ${w.probSched==="interval"?`<div class="rx-nest"><span>Every</span>${fcNumIn("fcEveryIn",w.probEvery,fcErr(w,"probEvery"),"Review every how many months","fcEvery(this)",12)}<span>months till</span>${till}${fcNestMsg(w,"probEvery")}${fcNestMsg(w,"probTillN")}${fcNestMsg(w,"projTillN")}</div>`:""}</div></div>`}
/* question column (PTO prototype V5 .v5lblwrap): the question, and an optional description under it.
   o.for → a <label> for that control; o.id → the question's id (for aria-labelledby); o.d / o.did → description text / its id */
function fcQ(t,o={}){const id=o.id?` id="${o.id}"`:"";
 return `<div class="v5lblwrap">${o.for?`<label class="v5lbl" for="${o.for}"${id}>${t}</label>`:`<span class="v5lbl"${id}>${t}</span>`}${o.d?`<span class="v5desc"${o.did?` id="${o.did}"`:""}>${o.d}</span>`:""}</div>`}
function fcDetails(w){
 fcRecur(w);fcTypeInit(w);
 const s=toISO(w.start),e=toISO(w.end);
 return `<section class="fc-card"><h2>Cycle Details</h2><div class="fc-form">
  <div class="fc-field">${fcQ("Cycle name"+FC_REQ,{for:"wName"})}
   <input class="fc-inp ${fcErr(w,"name")?"bad":""}" id="wName" aria-required="true" maxlength="100" placeholder="Enter cycle name" value="${esc(w.name)}" oninput="fcName(this)" autocomplete="off">${fcMsg(w,"name")}</div>
  <div class="fc-field">${fcQ("Review type",{id:"fcTypeSelQ"})}
   ${fcSel({id:"fcTypeSel",value:w.ctype,options:FC_TYPES.map(o=>({v:o,t:o})),ph:"Select an option",pick:"fcTypePick"})}</div>
  ${w.ctype!=="General Review"?fcProbation(w):""}
  ${w.ctype==="General Review"?`<div class="fc-field">${fcQ("Cycle period"+FC_REQ,{for:"fcPeriod"})}
   <div class="fc-dwrap fc-clr ${s&&e?"has":""}" id="fcPeriodWrap"><button type="button" class="fc-inp fc-period ${s&&e?"":"empty"} ${fcErr(w,"period")?"bad":""}" id="fcPeriod" aria-haspopup="dialog" aria-expanded="false" aria-required="true" onclick="fcPeriodOpen()"><span>${s&&e?`${fcMDY(s)} – ${fcMDY(e)}`:"MM/DD/YYYY – MM/DD/YYYY"}</span><img src="/assets/calendar.svg" width="20" height="20" alt=""></button>${s&&e?`<button type="button" class="fc-clr-x" aria-label="Clear cycle period" data-tip="Remove" data-tip-delay="300" onclick="fcPeriodClear()"><span class="fc-clr-i" aria-hidden="true"></span></button>`:""}</div>${fcMsg(w,"period")}</div>
  <div class="fc-field">${fcQ("Repeats",{id:"fcRepeatsQ"})}
   <div class="fc-rep-row">${fcSel({id:"fcRepeats",value:w.recur||"",options:FC_REPEATS.map(o=>({v:o,t:o})),ph:"Select an option",pick:"fcRepeatPick",clear:"Clear repeats"})}
    ${w.recur?`${fcNumIn("fcRecurN",w.recurN,fcErr(w,"recurN"),"Number of occurrences, including this cycle","fcRecurNIn(this)",FC_RECUR_MAX).replace('<input ','<input onkeydown="if([\'-\',\'+\',\'e\',\'E\',\'.\',\',\'].includes(event.key))event.preventDefault()" ')}<span class="fc-rep-u">occurrences</span>`:""}</div>
   ${fcMsg(w,"recurN")}
   <div class="fc-rep-note" id="fcRepeatInfo" ${w.recur&&fcRecurOk(w.recurN)?"":"hidden"}>${fcRepeatInfo(w)}</div></div>`:""}
  ${typeof rxReopenOpt==="function"?rxReopenOpt(w,rxInit(w)):""}
 </div></section>`}   // Cycle reopening sits under Repeats (defined in 14-reviewee-reviewers.js)
/* ---- Repeats: explain what happens after this cycle, using the chosen period ---- */
const FC_STEP={"Every month":1,"Every 3 months":3,"Every 6 months":6,"Every year":12};
const FC_EVERY={"Every month":"every month","Every 3 months":"every 3 months","Every 6 months":"every 6 months","Every year":"every year"};
const fcD=iso=>new Date(iso+"T12:00:00");
/* move a date forward n months; a month-end date stays on the month end (Dec 31 → Jan 31 → Feb 28) */
function fcAddMonths(iso,n){const d=fcD(iso),y=d.getFullYear(),m=d.getMonth()+n,day=d.getDate(),eom=day===new Date(y,d.getMonth()+1,0).getDate(),last=new Date(y,m+1,0).getDate();
 return fcISO(new Date(y,m,1).getFullYear(),new Date(y,m,1).getMonth(),eom?last:Math.min(day,last))}
function fcRange(s,e){const a=fcD(s),b=fcD(e),o={month:"short",day:"numeric"};
 return a.getFullYear()===b.getFullYear()?`${a.toLocaleDateString("en-US",o)} – ${b.toLocaleDateString("en-US",{...o,year:"numeric"})}`
  :`${a.toLocaleDateString("en-US",{...o,year:"numeric"})} – ${b.toLocaleDateString("en-US",{...o,year:"numeric"})}`}
/* Occurrences: how many cycles run in total, this one included (1 to FC_RECUR_MAX). Starts empty;
   0 or a negative number turns into 1 as it's typed. */
const FC_RECUR_MAX=24;
const fcRecurOk=v=>v>=1&&v<=FC_RECUR_MAX;
function fcRecurNIn(el){const w=W();let v=parseInt(el.value,10);if(!isNaN(v)&&v<1){v=1;el.value="1"}w.recurN=isNaN(v)?"":v;
 if(w.errs&&w.errs.recurN&&fcRecurOk(w.recurN)){delete w.errs.recurN;el.classList.remove("bad");const m=el.closest(".fc-field").querySelector(".fc-err");if(m)m.remove()}
 fcRepeatDraw()}
function fcRepeatInfo(w){
 const n=FC_STEP[w.recur];if(!n)return"";
 const every=FC_EVERY[w.recur],s=toISO(w.start),e=toISO(w.end),N=fcRecurOk(w.recurN)?w.recurN:0;
 if(!N)return"";   // no note until Occurrences is filled in
 if(!s||!e)return banner("info",N===1?`Runs once: with 1 occurrence, this cycle doesn't repeat. Pick a cycle period to see the dates.`:`${N} cycles with the same setup, one starting ${every}. Pick a cycle period to see the dates.`);
 if(N===1)return banner("info",`This cycle runs <b>${fcRange(s,e)}</b>. With <b>1 occurrence</b>, it doesn't repeat.`);
 const runs=Array.from({length:N},(_,k)=>[fcAddMonths(s,n*k),fcAddMonths(e,n*k)]),R=r=>`<b>${fcRange(...r)}</b>`;
 const next=runs.slice(1),overlap=next[0][0]<=e;
/* up to 5 occurrences: every period after this one; more than 5: the first 4 after this one, then "and so on" */
 const shown=next.slice(0,4).map(R),more=N>5;
 const list=more?`${shown.join(", ")}, and so on`
  :shown.length===1?shown[0]:shown.length===2?shown.join(" and "):`${shown.slice(0,-1).join(", ")}, and ${shown[shown.length-1]}`;
 const txt=`This cycle runs <b>${fcRange(s,e)}</b>. Repeating ${every}, <b>${N} cycles</b> run in total: after this one, ${list}.`;
 return overlap?banner("info",`${txt} Each cycle starts before the previous one ends, so they'll overlap. Shorten the cycle period or repeat less often.`)
  :banner("info",txt)}
function fcRepeatClear(){W().recur="";const el=$("#fcRepeats");if(el){el.value="";el.classList.add("empty");el.parentNode.classList.remove("has");el.focus()}fcRepeatDraw()}
function fcRepeatDraw(){const el=$("#fcRepeatInfo");if(!el)return;const w=W();el.hidden=!(w.recur&&fcRecurOk(w.recurN));el.innerHTML=fcRepeatInfo(w)}
/* Reuse the Reviews step, one card per section (who reviews · missing managers · overall rating) */
/* the editor view (V.wizard) and its top bar are built in 14-reviewee-reviewers.js */
function fcCreate(){wzCollect();const w=W(),s=toISO(w.start),e=toISO(w.end),errs={};
 if(!w.name.trim())errs.name="Enter a cycle name";
 if(!s||!e)errs.period="Select a cycle period";
 w.errs=errs;const n=Object.keys(errs).length+wzIssuesCreate().filter(x=>x.b&&!/cycle name/i.test(x.t)).length;
 if(n){render();const f=document.querySelector(".fc .bad");if(f){f.scrollIntoView({block:"center",behavior:"smooth"});if(f.focus)f.focus({preventScroll:true})}toast(`Fix ${n} item${n>1?"s":""} first.`);return}
 createCycle()}
/* steps are gone: any old "go to step" link just scrolls to the reviewers card */
wzGo=function(){wzCollect();render();const c=document.querySelectorAll(".fc-card")[1];if(c)c.scrollIntoView({block:"start",behavior:"smooth"})};
/* a brand-new cycle starts empty, like the design; drafts keep their values */
startCycle=function(pattern){S.wz=newWz(pattern||"Quarterly crew check-in");Object.assign(S.wz,{name:"",start:"",end:"",recur:"",datesSet:false,ctype:"General Review",probSched:"end",probEvery:1,probTill:"probation",probTillN:12,projMode:"all",projs:[]});nav("wizard")};
const _editDraftFc=editDraft;editDraft=function(cid){_editDraftFc(cid);S.wz.editing=true;render()};
/* full-page mode: hide the Lumber top nav while the editor is open */
const _renderFc=render;render=function(...a){_renderFc(...a);document.body.classList.toggle("focusmode",S.view==="wizard")};
render();
