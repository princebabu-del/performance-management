/* ===== Extend a phase (General Review only).
   Reuses the Cycle Period two-month range calendar from the focused editor (layer 13).
   The start date is locked; only days after the current end date can be picked as the new end.
   New Hire and Project Completion cycles have no cycle period, so the menu hides the action (app.js cycleMenu). ===== */
const CXP={open:false,cid:null,y:0,m:0,s:"",cur:"",e:"",hover:""};
function cxField(){const s=CXP.s,e=CXP.e||CXP.cur;return `${fcMDY(s)} – ${fcMDY(e)}`}
function cycExtend(cid){const c=C(cid);if(clType(c)!=="General Review")return;
 const[s,e]=cycDates(c);Object.assign(CXP,{open:false,cid,s,cur:e,e:"",hover:""});
 reasonModal({title:"Extend a phase",desc:"Pick a new end date. The start date can't change. Everyone in the cycle gets the new date. To extend for specific people, select them in Reviewees.",confirm:"Extend",
  extra:`<div><label class="fl" for="cxPeriod">Cycle Period <span class="req">*</span></label>
   <button type="button" class="inp fc-period" id="cxPeriod" aria-haspopup="dialog" aria-expanded="false" onclick="cxOpen()"><span id="cxVal">${cxField()}</span><img src="/assets/calendar.svg" width="20" height="20" alt=""></button>
   <div class="fd">Starts ${fcMDY(s)} (locked) · currently ends ${fcMDY(e)}</div>
   <div class="err" id="cxErr" hidden>Pick an end date after ${fcMDY(e)}.</div></div>`,
  onOk:r=>{if(!CXP.e){$("#cxErr").hidden=false;$("#cxPeriod").focus();return}
   const ne=CXP.e,days=Math.round((new Date(ne)-new Date(CXP.cur))/864e5);
   c.startISO=s;c.endISO=ne;c.period=`${fromISO(s)} – ${fromISO(ne)}`;
   if(c.wz)c.wz.end=fromISO(ne);
   const last=(c.phases||[])[c.phases.length-1];if(last)last.e=fromISO(ne).replace(/, \d{4}$/,"");
   cxClose();closeModal();render();
   D.activity.unshift({t:"Today",txt:`Anshika R. extended ${c.name} to ${fcMDY(ne)} (+${days} day${days===1?"":"s"}) · ${r}`,c:"a"});
   toast(`Extended to ${fcMDY(ne)}. Reviewers notified of the new date.`)}})}
function cxOpen(){if(CXP.open)return cxClose();const base=new Date((CXP.e||CXP.cur)+"T12:00:00");CXP.y=base.getFullYear();CXP.m=base.getMonth();CXP.open=true;cxDraw()}
function cxClose(){CXP.open=false;const p=$("#cxPop");if(p)p.remove();const f=$("#cxPeriod");if(f)f.setAttribute("aria-expanded","false")}
function cxShift(n){const d=new Date(CXP.y,CXP.m+n,1);CXP.y=d.getFullYear();CXP.m=d.getMonth();cxDraw()}
function cxDay(iso){if(iso<=CXP.cur)return;CXP.e=iso;CXP.hover="";cxDraw()}
function cxHover(iso){if(CXP.hover!==iso){CXP.hover=iso;cxDraw()}}
function cxApply(){if(!CXP.e)return;$("#cxVal").textContent=cxField();$("#cxErr").hidden=true;cxClose();$("#cxPeriod").focus()}
function cxMonth(y,m){const first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),today=new Date().toISOString().slice(0,10);
 const end=CXP.e||(CXP.hover>CXP.cur?CXP.hover:CXP.cur);let cells="";
 for(let i=0;i<first;i++)cells+=`<span></span>`;
 for(let d=1;d<=n;d++){const iso=fcISO(y,m,d),off=iso<=CXP.cur,c=[iso===CXP.s?"s":"",iso===end?"e":"",iso>CXP.s&&iso<end?"in":"",iso===today?"t":""].join(" ").trim();
  cells+=`<button type="button" class="${c}" ${off?"disabled":""} onclick="cxDay('${iso}')" onmouseenter="cxHover('${iso}')" aria-label="${FC_MONTHS[m]} ${d}, ${y}${iso===CXP.s?", start date, locked":""}" aria-pressed="${iso===CXP.s||iso===CXP.e}">${d}</button>`}
 return `<div class="fc-mon"><div class="fc-mon-h">${FC_MONTHS[m]} ${y}</div><div class="fc-wk">${["Su","Mo","Tu","We","Th","Fr","Sa"].map(x=>`<span>${x}</span>`).join("")}</div><div class="fc-days">${cells}</div></div>`}
function cxDraw(){const f=$("#cxPeriod");if(!f)return;let p=$("#cxPop");
 if(!p){p=document.createElement("div");p.id="cxPop";p.className="fc-pop cx-pop";p.setAttribute("role","dialog");p.setAttribute("aria-label","Choose new end date");document.body.appendChild(p)}
 f.setAttribute("aria-expanded","true");
 const nx=new Date(CXP.y,CXP.m+1,1),e=CXP.e,days=e?Math.round((new Date(e)-new Date(CXP.s))/864e5)+1:0,add=e?Math.round((new Date(e)-new Date(CXP.cur))/864e5):0;
 p.innerHTML=`<div class="fc-pop-nav"><button type="button" class="fc-nav" onclick="cxShift(-1)" aria-label="Previous month">‹</button><button type="button" class="fc-nav" onclick="cxShift(1)" aria-label="Next month">›</button></div>
  <div class="fc-mons" onmouseleave="if(CXP.hover){CXP.hover='';cxDraw()}">${cxMonth(CXP.y,CXP.m)}${cxMonth(nx.getFullYear(),nx.getMonth())}</div>
  <div class="fc-pop-f"><span class="fc-pop-sel">${fcMDY(CXP.s)} – ${e?fcMDY(e):"Pick a new end date"}${e?` <span class="dim">· ${days} days (+${add})</span>`:""}</span>
  <div class="fc-acts"><button type="button" class="fc-btn sm" onclick="cxClose()">Cancel</button><button type="button" class="fc-btn p sm" ${e?"":"disabled"} onclick="cxApply()">Apply</button></div></div>`;
 const r=f.getBoundingClientRect(),w=p.offsetWidth,h=p.offsetHeight;
 let top=r.bottom+8;if(top+h>innerHeight-8&&r.top-h-8>8)top=r.top-h-8;
 p.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+"px";p.style.top=Math.max(8,top)+"px"}
document.addEventListener("mousedown",e=>{if(CXP.open&&!e.target.closest("#cxPop")&&!e.target.closest("#cxPeriod"))cxClose()});
document.addEventListener("keydown",e=>{if(CXP.open&&e.key==="Escape"){e.stopPropagation();cxClose();const f=$("#cxPeriod");if(f)f.focus()}},true);
addEventListener("resize",()=>{if(CXP.open)cxClose()});
/* the modal can close (Cancel, backdrop) while the calendar is open: drop the orphaned popup */
const _cxCloseModal=closeModal;closeModal=function(){cxClose();return _cxCloseModal.apply(this,arguments)};
