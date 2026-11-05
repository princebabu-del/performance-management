/* ===== Org model: crews → foreman; departments / branches / projects → their managers ===== */
const ORG={
 dept:{"Field Operations":"Dana Whitfield","Estimating":"Rachel Kim","Projects":"Priya Shah","Finance":"Rachel Kim","Admin":"Rachel Kim","Safety":"Dana Whitfield","Site Services":null},
 branch:{"Denver":"Mark Wagner","Colorado Springs":"Greg Hall"},
 project:{"Maple Ridge Apartments":"Priya Shah","Riverside Medical Center":"David Chen","Oak Hollow Elementary":"Priya Shah","Harbor Point Retail":null},
 note:{"Harbor Point Retail":"project manager left"}};
const UNIT=["dept","branch","project"],UNIT_N={dept:"Department",branch:"Branch",project:"Project"};
function orgInit(){D.emps.forEach(e=>{
 e.branch=e.branch||(["cC","cD"].includes(e.crew)||/Harbor|Oak/.test(e.site||"")?"Colorado Springs":"Denver");
 e.project=e.project||(D.sites.includes(e.site)?e.site:null);
 if(["Hector Cruz","Omar Haddad"].includes(e.name)){e.noCrew=true;e.project="Harbor Point Retail";e.branch="Colorado Springs";e.unitNote="In the labor pool, not a crew"}})}
const inCrew=e=>!!e.crew&&!e.noCrew&&e.title!=="Foreman";
function unitOf(e,u){return u==="dept"?e.dept:u==="branch"?e.branch:e.project}
function revFor(e,w){const r=w.roles;rolesInit(w);
 if(inCrew(e)&&r.Foreman.on){const fm=r.Foreman.who===1?(hoursBySite(e).sort((a,b)=>b[1]-a[1])[0]||[])[2]:(D.crews.find(c=>c.id===e.crew)||{}).fm;
  return {name:w.mgrFix[e.name]||fm,type:"Crew foreman",why:`${crewName(e.crew)} (crew)`}}
 if(r.Manager.on&&(!inCrew(e)||!r.Foreman.on)){const u=UNIT[r.Manager.who]||"dept",unit=unitOf(e,u),m=unit?ORG[u][unit]:null;
  return {name:w.mgrFix[e.name]||m||null,type:UNIT_N[u]+" manager",why:unit?`${unit} (${UNIT_N[u].toLowerCase()})${m?"":" · no manager"}`:`No ${UNIT_N[u].toLowerCase()}`}}
 return {name:w.mgrFix[e.name]||null,type:"—",why:inCrew(e)?`${crewName(e.crew)} (crew) · Foreman is off`:`Not in a crew${e.unitNote?" · "+e.unitNote:""}`}}
function appliesTo(k,pool,w){if(!w.roles[k].on)return"";
 if(k==="Foreman"){const n=pool.filter(inCrew).length;return `<div class="dim sm" style="margin-top:6px">Applies to ${n} crew worker${n===1?"":"s"}</div>`}
 if(k==="Manager"){const n=pool.filter(e=>!inCrew(e)||!w.roles.Foreman.on).length,c=w.roles.Manager.alsoCrew?pool.filter(inCrew).length:0;return `<div class="dim sm" style="margin-top:6px">Applies to ${n} ${n===1?"person":"people"} not in a crew${c?` + ${c} crew workers`:""}</div>`}
 return ""}
function matchRules(pool,w){const r=w.roles;if(!(r.Foreman.on||r.Manager.on))return"";
 const g={};pool.forEach(e=>{const x=revFor(e,w),k=x.type;(g[k]=g[k]||{n:0,who:new Set(),miss:0});g[k].n++;x.name?g[k].who.add(x.name):g[k].miss++});
 if(r.Manager.alsoCrew&&r.Foreman.on){const u=UNIT[r.Manager.who];const crewP=pool.filter(inCrew);const k=UNIT_N[u]+" manager (also)";g[k]={n:crewP.length,who:new Set(crewP.map(e=>ORG[u][unitOf(e,u)]).filter(Boolean)),miss:0}}
 return `<div class="mrules"><div class="b" style="margin-bottom:6px">How reviewers are matched</div>
 <div class="mr-flow"><span class="tag">In a crew</span> → <b>Crew foreman</b><span class="dim sm"> · workers</span></div>
 <div class="mr-flow"><span class="tag">Not in a crew</span> → <b>${UNIT_N[UNIT[r.Manager.who]]} manager</b><span class="dim sm"> · foremen, and workers placed in a department, branch or project</span></div>
 <div class="mr-res">${Object.entries(g).map(([k,v])=>`<div><b>${v.n}</b> → ${esc(k)}<div class="dim sm">${[...v.who].join(", ")||"—"}${v.miss?` · <span style="color:var(--red)">${v.miss} without one</span>`:""}</div></div>`).join("")}</div></div>`}
reviewerMap=function(){const w=W(),pool=wzCount();openDrawer({title:"Reviewers for each person",sub:"Crew workers go to their foreman. Everyone else goes to the manager of their department, branch or project. Change any row.",w:820,
 body:`<div class="card"><div class="tw"><table class="tbl"><thead><tr><th>Employee</th><th>Belongs to</th><th>Reviewer</th></tr></thead><tbody>${pool.map(e=>{const x=revFor(e,w);return `<tr><td><b>${esc(e.name)}</b><div class="dim sm">${esc(e.title)}</div></td><td>${esc(x.why)}<div class="dim sm">${x.type}</div></td><td><select class="inp" style="height:36px${x.name?"":";border-color:var(--red)"}" onchange="W().mgrFix['${e.name}']=this.value">${x.name?"":"<option>Choose…</option>"}${[...new Set([...D.crews.map(c=>c.fm),...Object.values(ORG.dept),...Object.values(ORG.branch),...Object.values(ORG.project)].filter(Boolean))].map(n=>`<option ${n===x.name?"selected":""}>${n}</option>`).join("")}</select></td></tr>`}).join("")}</tbody></table></div></div>`,
 foot:`<button class="btn" onclick="closeLayer()">Cancel</button><button class="btn p" onclick="const w=W();w.nrFixed=noMgr(w,wzCount()).length===0;closeLayer();render();toast('Reviewers saved.')">Save</button>`})};
/* foremen are reviewed too: include them in who-is-reviewed */
const _wzCount15=wzCount;
wzCount=function(){const w=W();const pool=_wzCount15();if(w.mode==="people")return pool;
 const fms=D.emps.filter(e=>e.title==="Foreman"&&!w.excl.some(x=>x.n===e.name)&&w.filters.every(f=>{
  if(f.k==="Employee type")return e.type===f.v;if(f.k==="Department")return e.dept===f.v;if(f.k==="Crew")return crewName(e.crew)===f.v;
  if(f.k==="Job title")return e.title===f.v;if(f.k==="Trade")return e.trade===f.v;if(f.k==="Union status")return f.v==="Non-union";
  if(f.k==="Job site")return e.site===f.v;if(f.k==="Branch")return e.branch===f.v;if(f.k==="Project")return e.project===f.v;if(f.k==="Workplace")return wpOf(e)===f.v;return true}));
 let out=[...pool,...fms.filter(f=>!pool.includes(f))];
 w.filters.forEach(f=>{if(f.k==="Branch")out=out.filter(e=>e.branch===f.v);if(f.k==="Project")out=out.filter(e=>e.project===f.v);if(f.k==="Workplace")out=out.filter(e=>wpOf(e)===f.v)});return out};
AF_KEYS.splice(3,0,"Branch","Project","Workplace");
function wpOf(e){return e.type==="Office"?"Main office":(e.branch==="Colorado Springs"?"Colorado Springs yard":"Denver yard")}
const _addFilter15=addFilter;addFilter=function(k){if(k==="Branch"||k==="Project"||k==="Workplace"){const val=e=>k==="Branch"?e.branch:k==="Project"?e.project:wpOf(e);const base=wzCount(),vals=[...new Set(base.map(val).filter(Boolean))].sort();
 openModal(`<h3>Filter by ${k.toLowerCase()}</h3><div class="choice" style="margin-top:12px">${vals.map((v,i)=>`<label class="ch ${i?"":"on"}"><input type="radio" name="fv" value="${esc(v)}" ${i?"":"checked"} onchange="$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked))"><div class="t">${esc(v)}</div><div class="d">${base.filter(e=>val(e)===v).length} people</div></label>`).join("")}</div><div class="mf"><button class="btn" onclick="closeModal();render()">Cancel</button><button class="btn p" onclick="W().filters.push({k:'${k}',v:$('input[name=fv]:checked').value});closeModal();render()">Add filter</button></div>`);return}
 _addFilter15(k)};
/* assignment view: add branch / project */
grpKey["Branch"]=e=>e.branch||"—";grpKey["Workplace"]=e=>wpOf(e);grpKey["Project"]=e=>e.project||"No project";
const _init15=init;init=function(...a){_init15(...a);orgInit()};
orgInit();if(S.wz)rolesInit(S.wz);render();
