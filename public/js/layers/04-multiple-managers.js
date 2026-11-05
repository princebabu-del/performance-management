/* ===== Multiple managers per person: employee / department / branch / project ===== */
const MGR_T=[["emp","Employee manager","Manager on the employee profile"],["dept","Department manager",""],["branch","Branch manager",""],["project","Project manager",""]];
const MT=k=>MGR_T.find(m=>m[0]===k);
(function(){const ri=rolesInit;rolesInit=function(w){const r=ri(w);if(!r.Manager.types)r.Manager.types=/crew|90-day|Project/.test(w.pattern||"")?["emp","project"]:["emp","dept"];return r}})();
function orgInit2(){D.emps.forEach(e=>{e.empMgr=e.noCrew?null:(e.title==="Foreman"?"Dana Whitfield":e.mgr)})}
function mgrOf(e,t){if(t==="emp")return e.empMgr;const u=unitOf(e,t);return u?ORG[t][u]:null}
function unitTxt(e,t){if(t==="emp")return e.empMgr?"Employee profile":"Employee profile · manager left";const u=unitOf(e,t);return u?`${u}${ORG[t][u]?"":" · "+((ORG.note||{})[u]||"no manager")}`:`No ${UNIT_N[t].toLowerCase()}`}
function mgrToggle(t){const w=W();rolesInit(w);const a=w.roles.Manager.types;const i=a.indexOf(t);if(i<0)a.push(t);else if(a.length>1)a.splice(i,1);else{toast("Keep at least one manager type, or turn Manager off.");return}a.sort((x,y)=>MGR_T.findIndex(m=>m[0]===x)-MGR_T.findIndex(m=>m[0]===y));render()}
function mgrPick(s){return `<div class="mchips">${MGR_T.map(m=>`<button class="chip3 ${s.types.includes(m[0])?"on st":""}" aria-pressed="${s.types.includes(m[0])}" onclick="mgrToggle('${m[0]}')">${s.types.includes(m[0])?"✓ ":""}${m[1]}</button>`).join("")}</div><div class="dim sm" style="margin-top:4px">Pick one or more. Each one reviews separately.</div>`}
function revsFor(e,w){rolesInit(w);const r=w.roles,out=[];
 if(inCrew(e)&&r.Foreman.on){const fm=r.Foreman.who===1?(hoursBySite(e).sort((a,b)=>b[1]-a[1])[0]||[])[2]:(D.crews.find(c=>c.id===e.crew)||{}).fm;out.push({t:"crew",name:w.mgrFix[e.name+"|crew"]||fm,type:"Crew foreman",why:`${crewName(e.crew)} (crew)`})}
 if(r.Manager.on&&(!inCrew(e)||!r.Foreman.on||r.Manager.alsoCrew))r.Manager.types.forEach(t=>{const name=w.mgrFix[e.name+"|"+t]||mgrOf(e,t);const dup=name&&out.find(o=>o.name===name);
  if(dup){dup.type+=" + "+MT(t)[1];return}out.push({t,name,type:MT(t)[1],why:unitTxt(e,t)})});
 return out}
revFor=function(e,w){const l=revsFor(e,w);const m=l.find(x=>!x.name);return m||l[0]||{name:null,type:"—",why:"No reviewer role on"}};
function gaps(w,pool){const g=[];pool.forEach(e=>revsFor(e,w).forEach(x=>{if(!x.name)g.push({e,x})}));return g}
noMgr=function(w,pool){const r=w.roles;if(!(r.Foreman.on||r.Manager.on))return[];return [...new Set(gaps(w,pool).map(g=>g.e))]};
function gapFix(key,v){const w=W();if(v)w.mgrFix[key]=v;else delete w.mgrFix[key];w.nrFixed=!gaps(w,wzCount()).length;render()}
mgrFixAll=function(){const w=W();gaps(w,wzCount()).forEach(g=>{w.mgrFix[g.e.name+"|"+g.x.t]=ORG.branch[g.e.branch]||"Dana Whitfield"});w.nrFixed=true;render();toast("Their branch manager fills each missing manager for this cycle.")};
const ALL_MGRS=()=>[...new Set([...D.crews.map(c=>c.fm),"Dana Whitfield",...Object.values(ORG.dept),...Object.values(ORG.branch),...Object.values(ORG.project)].filter(Boolean))];
function mgrSection(w,pool){const r=w.roles;if(!(r.Foreman.on||r.Manager.on))return `<div class="dim sm">Only needed when Foreman or Manager is on.</div>`;
 const g=gaps(w,pool),fixed=Object.keys(w.mgrFix).filter(k=>k.includes("|"));
 if(!g.length&&!fixed.length)return `<div class="ok">Every employee in this cycle has all the managers you picked.</div>`;
 const ppl=new Set(g.map(x=>x.e.name)).size;
 const rows=[...g.map(x=>({e:x.e,t:x.x.t,label:x.x.type,why:x.x.why,val:""})),...fixed.map(k=>{const[n,t]=k.split("|");const e=EN(n);return e&&pool.includes(e)?{e,t,label:t==="crew"?"Crew foreman":MT(t)[1],why:t==="crew"?crewName(e.crew):unitTxt(e,t),val:w.mgrFix[k]}:null}).filter(Boolean)];
 return `<div class="${g.length?"bad":"ok"} row" style="margin-bottom:10px"><span class="grow"><b>${g.length?`${ppl} ${ppl===1?"employee is":"employees are"} missing ${g.length} manager${g.length===1?"":"s"}`:"All fixed for this cycle"}</b>${g.length?" · pick who fills in for each one.":""}</span>${g.length?`<button class="btn s" onclick="mgrFixAll()">Use branch manager for all</button>`:""}</div>
 <div class="tw"><table class="tbl"><thead><tr><th>Employee</th><th>Missing</th><th>Belongs to</th><th>Reviewer for this cycle</th></tr></thead><tbody>${rows.map(x=>`<tr><td><div class="who">${av(x.e.name,28)}<div><div>${esc(x.e.name)}</div><div class="dim sm">${esc(x.e.title)}</div></div></div></td><td>${x.label}</td><td>${esc(x.why)}</td><td><select class="inp" style="height:36px;${x.val?"":"border-color:var(--red)"}" onchange="gapFix('${x.e.name}|${x.t}',this.value)"><option value="">Choose…</option>${ALL_MGRS().map(n=>`<option ${x.val===n?"selected":""}>${n}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table></div>`}
appliesTo=function(k,pool,w){if(!w.roles[k].on)return"";
 if(k==="Foreman"){const n=pool.filter(inCrew).length;return `<div class="dim sm" style="margin-top:6px">Applies to ${n} crew worker${n===1?"":"s"}</div>`}
 if(k==="Manager"){const n=pool.filter(e=>!inCrew(e)||!w.roles.Foreman.on).length,c=w.roles.Manager.alsoCrew&&w.roles.Foreman.on?pool.filter(inCrew).length:0,m=w.roles.Manager.types.length;return `<div class="dim sm" style="margin-top:6px">Applies to ${n} ${n===1?"person":"people"} not in a crew${c?` + ${c} crew workers`:""} · up to ${m} manager review${m===1?"":"s"} each</div>`}
 return ""};
matchRules=function(pool,w){const r=w.roles;if(!(r.Foreman.on||r.Manager.on))return"";
 const g={};pool.forEach(e=>revsFor(e,w).forEach(x=>{x.type.split(" + ").forEach(k=>{(g[k]=g[k]||{n:0,who:new Set(),miss:0});g[k].n++;x.name?g[k].who.add(x.name):g[k].miss++})}));
 const reviews=pool.reduce((a,e)=>a+revsFor(e,w).length,0);
 return `<div class="mrules"><div class="b" style="margin-bottom:6px">How reviewers are matched</div>
 ${r.Foreman.on?`<div class="mr-flow"><span class="tag">In a crew</span> → <b>Crew foreman</b>${r.Manager.on&&r.Manager.alsoCrew?` <span class="dim sm">+ ${r.Manager.types.map(t=>MT(t)[1].toLowerCase()).join(", ")}</span>`:""}</div>`:""}
 ${r.Manager.on?`<div class="mr-flow"><span class="tag">Not in a crew</span> → <b>${r.Manager.types.map(t=>MT(t)[1]).join(" + ")}</b><span class="dim sm"> · foremen, and workers in a department, branch or project</span></div>`:""}
 <div class="mr-res">${Object.entries(g).map(([k,v])=>`<div><b>${v.n}</b> → ${esc(k)}<div class="dim sm">${[...v.who].join(", ")||"—"}${v.miss?` · <span style="color:var(--red)">${v.miss} missing</span>`:""}</div></div>`).join("")}</div>
 <div class="dim sm" style="margin-top:8px">${reviews} reviews to write in total. If one person holds two of these roles, they write one review.</div></div>`};
reviewerMap=function(){const w=W(),pool=wzCount();openDrawer({title:"Reviewers for each person",sub:"Crew workers go to their foreman. Others go to each manager type you picked. Change any row.",w:860,
 body:`<div class="card"><div class="tw"><table class="tbl"><thead><tr><th>Employee</th><th>Reviewers</th></tr></thead><tbody>${pool.map(e=>`<tr><td style="vertical-align:top"><b>${esc(e.name)}</b><div class="dim sm">${esc(e.title)}${inCrew(e)?" · "+crewName(e.crew):" · not in a crew"}</div></td><td>${revsFor(e,w).map(x=>`<div class="rmrow"><span class="dim sm">${x.type}<br>${esc(x.why)}</span><select class="inp" style="height:34px${x.name?"":";border-color:var(--red)"}" onchange="W().mgrFix['${e.name}|${x.t}']=this.value">${x.name?"":"<option>Choose…</option>"}${ALL_MGRS().map(n=>`<option ${n===x.name?"selected":""}>${n}</option>`).join("")}</select></div>`).join("")||'<span class="dim sm">No reviewer role applies</span>'}</td></tr>`).join("")}</tbody></table></div></div>`,
 foot:`<button class="btn" onclick="closeLayer()">Cancel</button><button class="btn p" onclick="const w=W();w.nrFixed=!gaps(w,wzCount()).length;closeLayer();render();toast('Reviewers saved.')">Save</button>`})};
const _wzIssues15=wzIssues;wzIssues=function(){const w=W(),out=_wzIssues15().filter(i=>!/no manager|no reviewer/.test(i.t));
 if(w){const g=gaps(w,wzCount());if(g.length){const p=[...new Set(g.map(x=>x.e.name))];out.unshift({b:1,step:1,t:`${p.length} ${p.length===1?"employee is":"employees are"} missing a manager`,d:g.map(x=>`${x.e.name} (${x.x.type.toLowerCase()})`).join(", "),fix:[["Use branch manager","mgrFixAll()"],["Choose by hand","wzGo(1)"]]})}}
 return out};
const _init15b=init;init=function(...a){_init15b(...a);orgInit();orgInit2()};
orgInit2();if(S.wz)rolesInit(S.wz);render();
