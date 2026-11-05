/* ===== New Review Cycle: focused full-page editor (Figma LMS 1024:14407).
   Sub header (Exit · title · Save as Draft / Create) over a grey canvas with stacked 900px cards.
   No stepper: Cycle Details, then the important cards from the old Reviews step. People are still assigned afterwards from the list. ===== */
const FC_REPEATS=["Every month","Every 3 months","Every 6 months","Every year"];
/* older pattern/draft values map onto the new list; anything else (One time, Rolling) shows as not set */
const fcRecur=w=>{const v={"Every quarter":"Every 3 months"}[w.recur]||w.recur;w.recur=FC_REPEATS.includes(v)?v:"";return w.recur};
const fcErr=(w,k)=>(w.errs||{})[k];
const fcMsg=(w,k)=>fcErr(w,k)?`<div class="fc-err">${esc(fcErr(w,k))}</div>`:"";
function fcName(el){const w=W();w.name=el.value;$("#fcCount").textContent=`${el.value.length}/100`;if(w.errs&&w.errs.name&&el.value.trim()){delete w.errs.name;el.classList.remove("bad");const m=el.closest(".fc-field").querySelector(".fc-err");if(m)m.remove()}}
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
 return `<div class="fc-mon"><div class="fc-mon-h">${FC_MONTHS[m]} ${y}</div><div class="fc-wk">${["Su","Mo","Tu","We","Th","Fr","Sa"].map(x=>`<span>${x}</span>`).join("")}</div><div class="fc-days">${cells}</div></div>`}
function fcPopDraw(){const host=$("#fcPeriodWrap");if(!host)return;let p=$("#fcPop");if(!p){p=document.createElement("div");p.id="fcPop";p.className="fc-pop";p.setAttribute("role","dialog");p.setAttribute("aria-label","Choose cycle period");host.appendChild(p)}
 $("#fcPeriod").setAttribute("aria-expanded","true");
 const nx=new Date(FCP.y,FCP.m+1,1),days=FCP.s&&FCP.e?Math.round((new Date(FCP.e)-new Date(FCP.s))/864e5)+1:0;
 p.innerHTML=`<div class="fc-pop-nav"><button type="button" class="fc-nav" onclick="fcShift(-1)" aria-label="Previous month">‹</button><button type="button" class="fc-nav" onclick="fcShift(1)" aria-label="Next month">›</button></div>
  <div class="fc-mons" onmouseleave="if(FCP.hover){FCP.hover='';fcPopDraw()}">${fcMonth(FCP.y,FCP.m)}${fcMonth(nx.getFullYear(),nx.getMonth())}</div>
  <div class="fc-pop-f"><span class="fc-pop-sel">${FCP.s?`${fcMDY(FCP.s)} – ${FCP.e?fcMDY(FCP.e):"Pick an end date"}`:"Pick a start date"}${days?` <span class="dim">· ${days} days</span>`:""}</span>
  <div class="fc-acts"><button type="button" class="fc-btn sm" onclick="fcPeriodClose()">Cancel</button><button type="button" class="fc-btn p sm" ${FCP.s&&FCP.e?"":"disabled"} onclick="fcApply()">Apply</button></div></div>`}
document.addEventListener("mousedown",e=>{if(FCP.open&&!e.target.closest("#fcPeriodWrap"))fcPeriodClose()});
document.addEventListener("keydown",e=>{if(FCP.open&&e.key==="Escape"){fcPeriodClose();const f=$("#fcPeriod");if(f)f.focus()}});
/* ---- Review Type: General Review (Cycle Period + Repeats) · New Hire Review / Project Completion Review (own Review Schedule) ---- */
const FC_TYPES=["General Review","New Hire Review","Project Completion Review"];
/* one-time option per type; "At regular intervals" is shared. New Hire adds "till [end of probation | N months after the start date]" */
const FC_SCHED_END={"New Hire Review":"One-time review at the end of probation","Project Completion Review":"One-time review at project completion"};
const FC_TILL={probation:"End of probation period",period:"Specific period from start date"};
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
 return `<div class="fc-field full"><div class="fc-lbl"><span class="fc-lbl-t" id="fcProbL">Review Schedule <span>*</span></span></div>
  <div class="rx-chkbox fc-prob"><div class="rx-checks" role="radiogroup" aria-labelledby="fcProbL">${rad("end",FC_SCHED_END[w.ctype])}${rad("interval","At regular intervals")}</div>
  ${w.probSched==="interval"?`<div class="rx-nest"><span>Every</span>${fcNumIn("fcEveryIn",w.probEvery,fcErr(w,"probEvery"),"Review every how many months","fcEvery(this)",12)}<span>months till</span>${till}${fcNestMsg(w,"probEvery")}${fcNestMsg(w,"probTillN")}${fcNestMsg(w,"projTillN")}</div>`:""}</div></div>`}
function fcDetails(w){
 fcRecur(w);fcTypeInit(w);
 const s=toISO(w.start),e=toISO(w.end);
 return `<section class="fc-card"><h2>Cycle Details</h2><div class="fc-form">
  <div class="fc-field"><div class="fc-lbl"><label for="wName">Cycle Name <span>*</span></label><span class="fc-count" id="fcCount">${w.name.length}/100</span></div>
   <input class="fc-inp ${fcErr(w,"name")?"bad":""}" id="wName" maxlength="100" placeholder="Enter" value="${esc(w.name)}" oninput="fcName(this)" autocomplete="off">${fcMsg(w,"name")}</div>
  <div class="fc-field"><div class="fc-lbl"><label for="fcTypeSel">Review Type <span>*</span></label></div>
   <select class="fc-inp fc-sel" id="fcTypeSel" onchange="fcType(this.value)">${FC_TYPES.map(o=>`<option ${w.ctype===o?"selected":""}>${o}</option>`).join("")}</select></div>
  ${w.ctype!=="General Review"?fcProbation(w):""}
  ${w.ctype==="General Review"?`<div class="fc-field"><div class="fc-lbl"><label for="fcPeriod">Cycle Period <span>*</span></label></div>
   <div class="fc-dwrap" id="fcPeriodWrap"><button type="button" class="fc-inp fc-period ${s&&e?"":"empty"} ${fcErr(w,"period")?"bad":""}" id="fcPeriod" aria-haspopup="dialog" aria-expanded="false" aria-required="true" onclick="fcPeriodOpen()"><span>${s&&e?`${fcMDY(s)} – ${fcMDY(e)}`:"MM/DD/YYYY – MM/DD/YYYY"}</span><img src="/assets/calendar.svg" width="20" height="20" alt=""></button></div>${fcMsg(w,"period")}</div>
  <div class="fc-field"><div class="fc-lbl"><label for="fcRepeats">Repeats</label></div>
   <div class="fc-clr ${w.recur?"has":""}"><select class="fc-inp fc-sel ${w.recur?"":"empty"}" id="fcRepeats" onchange="W().recur=this.value;this.classList.remove('empty');this.parentNode.classList.add('has');fcRepeatDraw()"><option value="" disabled ${w.recur?"":"selected"}>Select</option>${FC_REPEATS.map(o=>`<option ${w.recur===o?"selected":""}>${o}</option>`).join("")}</select>
    <button type="button" class="fc-clr-x" aria-label="Clear repeats" title="Clear" onclick="fcRepeatClear()"><img src="/assets/x-close-20.svg" width="16" height="16" alt=""></button></div></div>
  <div class="fc-field full fc-rep" id="fcRepeatInfo" ${w.recur?"":"hidden"}>${fcRepeatInfo(w)}</div>`:""}
 </div></section>`}
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
function fcRepeatInfo(w){
 const n=FC_STEP[w.recur];if(!n)return"";
 const every=FC_EVERY[w.recur],s=toISO(w.start),e=toISO(w.end);
 if(!s||!e)return banner("info",`A new cycle with the same setup will start ${every}. Pick a cycle period to see the dates.`);
 const next=[1,2].map(k=>[fcAddMonths(s,n*k),fcAddMonths(e,n*k)]);
 const overlap=next[0][0]<=e;
 const txt=`This cycle runs <b>${fcRange(s,e)}</b>. Repeating ${every}, the next cycles with the same setup are <b>${fcRange(...next[0])}</b>, then <b>${fcRange(...next[1])}</b>, and so on.`;
 return overlap?banner("warning",`${txt} Each cycle starts before the previous one ends, so they'll overlap. Shorten the cycle period or repeat less often.`)
  :banner("info",txt)}
function fcRepeatClear(){W().recur="";const el=$("#fcRepeats");if(el){el.value="";el.classList.add("empty");el.parentNode.classList.remove("has");el.focus()}fcRepeatDraw()}
function fcRepeatDraw(){const el=$("#fcRepeatInfo");if(!el)return;const w=W();el.hidden=!w.recur;el.innerHTML=fcRepeatInfo(w)}
/* Reuse the Reviews step, one card per section (who reviews · missing managers · overall rating) */
function fcReviewCards(w,iss){
 const h=wzReviews(w,[],iss);
 return h.split(/(?=<div class="sec"><h4>)/).filter(x=>x.trim()).map(sec=>`<section class="fc-card">${sec.replace(/<h4>\d+\.\s*/,"<h4>")}</section>`).join("")}
V.wizard=()=>{
 FCP.open=false;const w=W();if(!w)return V.cycles();wzCollect();rolesInit(w);datesInit(w);syncPhases(w);
 const iss=wzIssuesCreate().filter(x=>!/cycle name/i.test(x.t)),edit=!!w.editing;
 return `<div class="fc">
  <div class="fc-sub"><div class="fc-left"><button class="fc-exit" onclick="wzLeave()"><img src="/assets/x-close-20.svg" width="20" height="20" alt="">Exit</button><span class="fc-div" aria-hidden="true"></span><h1>${edit?"Edit Review Cycle":"New Review Cycle"}</h1></div>
   <div class="fc-acts"><button class="fc-btn" onclick="wzSave()">Save as Draft</button><button class="fc-btn p" onclick="fcCreate()">Create</button></div></div>
  <div class="fc-body">${fcDetails(w)}${fcReviewCards(w,iss)}${launchWarn(iss.filter(x=>x.b))?`<div class="fc-card fc-warn">${launchWarn(iss.filter(x=>x.b))}</div>`:""}</div>
 </div>`};
function fcCreate(){wzCollect();const w=W(),s=toISO(w.start),e=toISO(w.end),errs={};
 if(!w.name.trim())errs.name="Add a cycle name";
 if(!s||!e)errs.period="Select a cycle period";
 w.errs=errs;const n=Object.keys(errs).length+wzIssuesCreate().filter(x=>x.b&&!/cycle name/i.test(x.t)).length;
 if(n){render();const f=document.querySelector(".fc .bad, .fc-warn");if(f){f.scrollIntoView({block:"center",behavior:"smooth"});if(f.focus)f.focus({preventScroll:true})}toast(`Fix ${n} item${n>1?"s":""} first.`);return}
 createCycle()}
/* steps are gone: any old "go to step" link just scrolls to the reviewers card */
wzGo=function(){wzCollect();render();const c=document.querySelectorAll(".fc-card")[1];if(c)c.scrollIntoView({block:"start",behavior:"smooth"})};
/* a brand-new cycle starts empty, like the design; drafts keep their values */
startCycle=function(pattern){S.wz=newWz(pattern||"Quarterly crew check-in");Object.assign(S.wz,{name:"",start:"",end:"",recur:"",datesSet:false,ctype:"General Review",probSched:"end",probEvery:1,probTill:"probation",probTillN:12,projMode:"all",projs:[]});nav("wizard")};
const _editDraftFc=editDraft;editDraft=function(cid){_editDraftFc(cid);S.wz.editing=true;render()};
/* full-page mode: hide the Lumber top nav while the editor is open */
const _renderFc=render;render=function(...a){_renderFc(...a);document.body.classList.toggle("focusmode",S.view==="wizard")};
render();
