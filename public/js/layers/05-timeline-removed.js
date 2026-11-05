/* ===== Timeline step removed: dates live with the reviews; calendars everywhere; reminders come from company settings ===== */
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function toISO(t){const m=/^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/.exec(t||"");if(!m)return/^\d{4}-\d\d-\d\d$/.test(t||"")?t:"";return `${m[3]}-${String(MON.indexOf(m[1])+1).padStart(2,"0")}-${m[2].padStart(2,"0")}`}
function fromISO(i){if(!i)return"";const[y,m,d]=i.split("-");return `${MON[+m-1]} ${+d}, ${y}`}
function addDays(i,n){const d=new Date(i+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
const DUE_OFF={Self:7,Foreman:14,Manager:14,Admin:21,Peer:10};
function datesInit(w){if(w.datesSet)return;w.datesSet=true;const end=toISO(w.end);
 w.opens=toISO(w.start)||"";
 rolesInit(w);ROLES.forEach(x=>{const r=w.roles[x.k];if(!r.due&&end)r.due=addDays(end,DUE_OFF[x.k])});w.shareOn=w.shareOn||(end?addDays(end,28):"")}
const isRolling=w=>!toISO(w.start)||!toISO(w.end);
function dateSet(f,v){const w=W();w[f]=v?fromISO(v):"";if(f==="start")w.opens=v||"";if(f==="end"&&v){w.datesSet=false;ROLES.forEach(x=>{w.roles[x.k].due=""});w.opens="";datesInit(w)}render()}
function dueSet(k,v){const w=W();if(k==="_opens")w.opens=v;else if(k==="_share")w.shareOn=v;else w.roles[k].due=v;syncPhases(w);render()}
function syncPhases(w){w.phases=ROLES.filter(x=>w.roles[x.k].on).map(x=>({n:x.n+" review",s:fromISO(w.opens)||w.start,e:fromISO(w.roles[x.k].due)||w.end}))}
function dueField(k,s,w){datesInit(w);if(isRolling(w))return `<div style="margin-top:10px"><label class="fl">Due</label><select class="inp" style="height:36px" onchange="W().roles['${k}'].dueRel=this.value">${["7 days after it opens","10 days after it opens","14 days after it opens","21 days after it opens"].map(o=>`<option ${s.dueRel===o?"selected":""}>${o}</option>`).join("")}</select></div>`;
 const bad=s.due&&w.opens&&s.due<w.opens;
 return `<div style="margin-top:10px"><label class="fl">Due date</label>${dateField({value:s.due||"",min:w.opens||"",cls:`inp dt ${bad?"bad":""}`,aria:"Due date",onchange:`dueSet('${k}',this.value)`})}${bad?`<div class="sm" style="color:var(--red);margin-top:4px">Must be after the start date (${fromISO(w.opens)})</div>`:""}</div>`}
function remNote(){return `<div class="dim sm" style="margin-top:10px">Reminders and overdue escalation follow your company settings. <button class="link sm" onclick="nav('settings')">Open settings</button></div>`}
/* step 1: When section with calendars */
const _wzWho16=wzWho;
wzWho=function(w,pool){datesInit(w);const h=_wzWho16(w,pool),i=h.indexOf('<div class="sec"><h4>When</h4>');if(i<0)return h;
 const roll=isRolling(w);
 const when=`<div class="sec"><h4>When</h4>${roll?`<div class="dim sm" style="margin-bottom:10px">This pattern runs on each person's own date (${esc(w.start)} → ${esc(w.end)}). Due dates are set in days on the next step.</div>`:`
 <div class="f2" style="max-width:640px"><div><label class="fl" for="wStart">Review period start</label>${dateField({value:toISO(w.start),cls:"inp dt",aria:"Review period start",onchange:"dateSet('start',this.value)"})}</div>
 <div><label class="fl" for="wEnd">Review period end</label>${dateField({value:toISO(w.end),min:toISO(w.start),cls:"inp dt",aria:"Review period end",onchange:"dateSet('end',this.value)"})}</div></div>
 <div class="dim sm" style="margin-top:6px">Reviews open on the start date. Due dates are set per review on the next step.</div>`}
 <div style="max-width:310px;margin-top:12px"><label class="fl">Repeats</label><select class="inp" onchange="W().recur=this.value">${["One time","Every quarter","Every 6 months","Every year","Rolling (hire date)"].map(o=>`<option ${w.recur===o?"selected":""}>${o}</option>`).join("")}</select></div></div>`;
 return h.slice(0,i)+when};
/* 3-step wizard */
WS.length=0;WS.push("Who and when","Reviews");
const _wzGo16=wzGo;wzGo=function(i){_wzGo16(Math.min(i,1))};
V.wizard=()=>{
 const w=W();if(!w)return V.cycles();wzCollect();if(w.step>1)w.step=1;rolesInit(w);datesInit(w);syncPhases(w);
 const iss=wzIssues(),pool=wzCount();
 let body=[wzWho,wzReviews][w.step](w,pool,iss);
 if(w.step===2){const dd=ROLES.filter(x=>w.roles[x.k].on).map(x=>`${x.n} ${isRolling(w)?(w.roles[x.k].dueRel||"7 days after it opens"):fromISO(w.roles[x.k].due)}`).join(" · ");
  body=body.replace(/<span class="dim">Timeline<\/span><span>[^<]*<\/span><button class="link sm" onclick="wzGo\(2\)">/,`<span class="dim">Due dates</span><span>${isRolling(w)?"":"Open "+fromISO(w.opens)+" · "}${esc(dd)}</span><button class="link sm" onclick="wzGo(1)">`)}
 return `<div class="crumb"><a onclick="wzLeave()">Review Cycles</a> › <span>${w.id&&C(w.id)?"Edit draft":"New review cycle"}</span></div>
 <div class="ph"><div><h1>${w.id&&C(w.id)?esc(w.name):"New Review Cycle"}</h1><div class="sub">${w.saved?"Draft saved":"Nothing is sent until you launch"}</div></div><div class="row"><button class="btn" onclick="wzSave()">Save draft</button><button class="btn ghost" onclick="wzLeave()">Exit</button></div></div>
 <div class="hsteps">${WS.map((s,i)=>`<button class="${i===w.step?"on":i<w.step?"done":""}" onclick="wzGo(${i})"><span class="n">${i<w.step?"✓":i+1}</span>${s}${iss.some(x=>x.b&&Math.min(x.step,1)===i)&&i!==w.step?' <span style="color:var(--red)">•</span>':""}</button>`).join("")}</div>
 <div class="wzbox"><div class="card">${body}</div>
 ${w.step===1?launchWarn(iss):""}<div class="wzfoot"><button class="btn" ${w.step?"":"hidden"} onclick="wzGo(${w.step-1})">${ic("back","s")} Back</button><span></span>${w.step<1?`<button class="btn p" onclick="wzGo(${w.step+1})">Next: ${WS[w.step+1]}</button>`:`<div class="row"><button class="btn" onclick="wzSave()">Save draft</button><button class="btn p" onclick="wzLaunch2()">Launch cycle</button></div>`}</div></div>`;
};
/* launch check: due dates must be after the open date */
const _wzIssues16=wzIssues;wzIssues=function(){const out=_wzIssues16(),w=W();
 if(w&&!isRolling(w)){datesInit(w);const bad=ROLES.filter(x=>w.roles[x.k].on&&(!w.roles[x.k].due||(w.opens&&w.roles[x.k].due<w.opens)));
  if(bad.length)out.unshift({b:1,step:1,t:`${bad.length} due date${bad.length>1?"s need":" needs"} fixing`,d:bad.map(x=>x.n).join(", ")+" · must be after the start date",fix:[["Go to reviews","wzGo(1)"]]})}
 return out};
function launchWarn(iss){const b=iss.filter(x=>x.b),n=iss.filter(x=>!x.b);if(!iss.length)return"";
 return `<div class="lwarn">${b.map(x=>`<div class="bad row"><span class="grow"><b>${x.t}</b>${x.d?" · "+esc(x.d):""}</span>${x.fix.slice(0,1).map(f=>`<button class="btn s" onclick="${f[1]}">${f[0]}</button>`).join("")}</div>`).join("")}${n.map(x=>`<div class="warnl row"><span class="grow"><b>${x.t}</b>${x.d?" · "+esc(x.d):""}</span>${x.fix.map(f=>`<button class="btn xs" onclick="${f[1]}">${f[0]}</button>`).join("")}</div>`).join("")}</div>`}
function wzLaunch2(){const iss=wzIssues(),b=iss.filter(x=>x.b);if(b.length){const st=Math.min(b[0].step,1);if(W().step!==st)wzGo(st);toast(`Fix ${b.length} item${b.length>1?"s":""} before launching.`);return}wzLaunchGo()}
const _wzPattern16=wzPattern;wzPattern=function(k){_wzPattern16(k)};
if(S.wz){S.wz.step=Math.min(S.wz.step,1)}
render();
