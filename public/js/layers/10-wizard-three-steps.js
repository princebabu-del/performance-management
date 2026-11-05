/* ===== Wizard: 1 Cycle details → 2 Reviews → 3 Assign employees (launch here). Full width. ===== */
WS.length=0;WS.push("Cycle details","Reviews","Assign employees");
const _wzGo21=_wzGo16;wzGo=function(i){_wzGo21(Math.min(i,2))};
function whoSplit(w,pool){const h=wzWho(w,pool),a=h.indexOf('<div class="sec asg-pick">'),b=h.indexOf('<div class="sec"><h4>When</h4>');if(a<0||b<0)return[h,""];return[h.slice(0,a)+h.slice(b),h.slice(a,b)]}
const issStep=x=>/No one matches|phone or email/.test(x.t)?2:Math.min(x.step,2);
V.wizard=()=>{
 const w=W();if(!w)return V.cycles();wzCollect();if(w.step>2)w.step=2;rolesInit(w);datesInit(w);syncPhases(w);
 const iss=wzIssues(),pool=wzCount(),[det,asg]=whoSplit(w,pool);
 const body=w.step===0?det:w.step===1?wzReviews(w,pool,iss):typeof asgStepBody==="function"?asgStepBody(w):`<div class="sec"><h4>Assign employees</h4><div class="sd">Pick who this cycle reviews. Assign by job title, department, union, branch, project or workplace, or pick people by name.</div></div>`+asg.replace('<h4>Who is reviewed</h4>','');
 return `<div class="crumb"><a onclick="wzLeave()">Review Cycles</a> › <span>${w.id&&C(w.id)?"Edit draft":"New review cycle"}</span></div>
 <div class="ph"><div><h1>${w.id&&C(w.id)?esc(w.name):"New Review Cycle"}</h1><div class="sub">${w.saved?"Draft saved":"Nothing is sent until you launch"}</div></div><div class="row"><button class="btn" onclick="wzSave()">Save draft</button><button class="btn ghost" onclick="wzLeave()">Exit</button></div></div>
 <div class="hsteps">${WS.map((s,i)=>`<button class="${i===w.step?"on":i<w.step?"done":""}" onclick="wzGo(${i})"><span class="n">${i<w.step?"✓":i+1}</span>${s}${iss.some(x=>x.b&&issStep(x)===i)&&i!==w.step?' <span style="color:var(--red)">•</span>':""}</button>`).join("")}</div>
 <div class="wzbox"><div class="card">${body}</div>
 ${w.step===2?launchWarn(iss):""}<div class="wzfoot"><button class="btn" ${w.step?"":"hidden"} onclick="wzGo(${w.step-1})">${ic("back","s")} Back</button><span></span>${w.step<2?`<button class="btn p" onclick="wzGo(${w.step+1})">Next: ${WS[w.step+1]}</button>`:`<div class="row"><span class="dim sm">${pool.length} ${pool.length===1?"person":"people"} assigned</span><button class="btn" onclick="wzSave()">Save draft</button><button class="btn p" onclick="wzLaunch2()">Launch cycle</button></div>`}</div></div>`};
wzLaunch2=function(){const iss=wzIssues(),b=iss.filter(x=>x.b);if(b.length){const st=issStep(b[0]);if(W().step!==st)wzGo(st);toast(`Fix ${b.length} item${b.length>1?"s":""} before launching.`);return}wzLaunchGo()};
if(S.wz)S.wz.step=Math.min(S.wz.step,2);
render();
