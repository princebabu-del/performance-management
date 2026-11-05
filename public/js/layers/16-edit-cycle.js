/* ===== Edit a scheduled / active / paused cycle in the focused editor ("Edit Review Cycle").
   Opened from More › Edit (top of the menu) or a section's Edit button on the Settings tab, which scrolls to that section.
   Live edits don't go through drafts: the header shows Cancel / Save, and Save writes back to the cycle and returns to Settings. ===== */
function cycEdit(cid,sec){const c=C(cid);if(!c)return;
 if(c.status==="Draft"){editDraft(cid)}
 else{
  const pat=Object.keys(PATTERNS).find(k=>k===c.pattern)||"Quarterly crew check-in";
  const w=c.wz?JSON.parse(JSON.stringify(c.wz)):newWz(pat,cid);
  Object.assign(w,{id:cid,name:c.name,saved:true,editing:true,live:true,errs:{}});
  if(!c.wz){const[s,e]=cycDates(c);if(s&&e)Object.assign(w,{start:fromISO(s),end:fromISO(e),opens:s,datesSet:true});
   w.recur=c.recurring||"";if(c.rating)w.rating=c.rating}
  w.rx=JSON.parse(JSON.stringify(csRx(c)));w.desc=cdDesc(c);
  FC_TYPE_KEYS.forEach(k=>{if(c[k]!=null)w[k]=fcCopy(c[k])});
  S.wz=w;nav("wizard");w._live=liveSnap(w)}
 if(sec!==undefined)setTimeout(()=>fcFocusSec(sec),150)}
/* Overview › section Edit: scroll the editor to that section, then flash a blue border on it
   (fades in, holds 500ms, fades out). The flash waits for the scroll to finish so it's seen where the eye lands. */
function fcFocusSec(sec){const el=document.getElementById("fcSec"+sec);if(!el)return;fcMark(sec);fcLock=Date.now()+1200;
 const top=Math.max(0,el.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(el).scrollMarginTop)||0));
 const flash=()=>{const c=document.getElementById("fcSec"+sec);if(!c)return;c.classList.add("fc-flash");setTimeout(()=>{const d=document.getElementById("fcSec"+sec);if(d)d.classList.remove("fc-flash")},500+200)};
 if(Math.abs(scrollY-top)<2)return flash();
 let done=false;const go=()=>{if(done)return;done=true;removeEventListener("scrollend",go);flash()};
 addEventListener("scrollend",go,{once:true});setTimeout(go,900);   // fallback where scrollend isn't supported
 window.scrollTo({top,behavior:"smooth"})}
/* unsaved-change check for Cancel (leaves out the snapshot itself) */
const liveSnap=w=>{const{_live,...r}=w;return fcSnap(r)};
/* header: Exit + Cancel / Save instead of Save as Draft / Create */
const _vwzLive=V.wizard;V.wizard=()=>{const h=_vwzLive(),w=W();if(!w||!w.live)return h;
 return h.replace('onclick="fcExit()"','onclick="fcLiveCancel()"')
  .replace(/<div class="fc-acts">[\s\S]*?<\/div><\/div>/,`<div class="fc-acts"><button type="button" class="fc-btn" onclick="fcLiveCancel()">Cancel</button><button type="button" class="fc-btn p" onclick="fcCreate()">Save</button></div></div>`)};
function fcLiveBack(){const id=W().id;S.wz=null;nav("cycle",{cid:id,tab:"overview"})}
function fcLiveCancel(){wzCollect();const w=W();if(w._live===liveSnap(w))return fcLiveBack();
 openModal(`<h3>Discard changes?</h3><p class="dim" style="margin:0 0 12px">Your edits to this review cycle haven't been saved.</p>
 <div class="mf"><button class="btn" onclick="closeModal()">Keep editing</button><button class="btn d" onclick="closeModal();fcLiveBack()">Discard</button></div>`)}
/* fcCreate validates the form, then calls createCycle(): for a live edit, confirm and save onto the cycle instead */
const _createLive=createCycle;createCycle=function(...a){const w=W();if(!w||!w.live)return _createLive(...a);
 const c=C(w.id),n=D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed").length;
 openModal(`<h3>Save changes?</h3><div class="warn" style="margin:8px 0 12px">This cycle is ${c.status.toLowerCase()}. <b>${n} ${n===1?"employee is":"employees are"}</b> in it. Reviews that haven't started use the new setup; reviews already started keep the version they began with.</div>
 <div class="mf"><button class="btn" onclick="closeModal()">Keep editing</button><button class="btn p" onclick="closeModal();fcLiveSave()">Save changes</button></div>`)};
function fcLiveSave(){const w=W(),c=C(w.id),s=toISO(w.start),e=toISO(w.end);
 Object.assign(c,{name:w.name.trim(),recurring:w.recur||"",rating:w.rating,rx:JSON.parse(JSON.stringify(w.rx))});
 if(w.ctype==="General Review"&&s&&e)Object.assign(c,{startISO:s,endISO:e,period:`${w.start} – ${w.end}`});
 else if(w.ctype!=="General Review")Object.assign(c,{startISO:"",endISO:"",period:"Rolling"});   // New Hire / Project Completion: no cycle period
 FC_TYPE_KEYS.forEach(k=>c[k]=fcCopy(w[k]));
 const keep={...w};["live","_live","_snap","editing","errs"].forEach(k=>delete keep[k]);c.wz=JSON.parse(JSON.stringify(keep));
 D.activity.unshift({t:"Just now",txt:`${c.name} settings updated`,c:"b"});
 fcLiveBack();toast("Changes saved. Logged in the activity log.")}
render();
