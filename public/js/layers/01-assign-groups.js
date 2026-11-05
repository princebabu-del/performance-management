/* ===== Who is reviewed: assign by groups (job title, department, union…) or by name; view assignment by name / title / dept / union ===== */
const AF_KEYS=["Job title","Department","Union status","Crew","Job site","Trade","Employee type"];
const _wzCount=wzCount;
wzCount=function(){const w=W();
 if(w.mode==="people")return D.emps.filter(e=>(w.picked||[]).includes(e.id));
 let pool=_wzCount();
 w.filters.forEach(f=>{
  if(f.k==="Job title")pool=pool.filter(e=>e.title===f.v);
  if(f.k==="Department")pool=pool.filter(e=>e.dept===f.v);
 });
 return pool};
const _addFilter=addFilter;
addFilter=function(k){
 if(k==="Job title"||k==="Department"){const base=wzCount(),vals=[...new Set(base.map(e=>k==="Job title"?e.title:e.dept))].sort();
  openModal(`<h3>Filter by ${k.toLowerCase()}</h3><div class="choice" style="margin-top:12px">${vals.map((v,i)=>`<label class="ch ${i?"":"on"}"><input type="radio" name="fv" value="${esc(v)}" ${i?"":"checked"} onchange="$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked))"><div class="t">${esc(v)}</div><div class="d">${base.filter(e=>(k==="Job title"?e.title:e.dept)===v).length} people</div></label>`).join("")}</div><div class="mf"><button class="btn" onclick="closeModal();render()">Cancel</button><button class="btn p" onclick="W().filters.push({k:'${k}',v:$('input[name=fv]:checked').value});closeModal();render()">Add filter</button></div>`);return}
 _addFilter(k)};
function asgSet(k,v){const w=W();w[k]=v;render()}
function asgPick(id){const w=W(),a=w.picked=w.picked||[];const i=a.indexOf(id);i<0?a.push(id):a.splice(i,1);render()}
function asgPickAll(on){const w=W();w.picked=on?asgCandidates().map(e=>e.id):[];render()}
function asgCandidates(){const q=(W().pq||"").toLowerCase();return D.emps.filter(e=>(!e.isMgr||e.title==="Foreman")&&(!q||[e.name,e.title,e.dept].join(" ").toLowerCase().includes(q)))}
const unionTxt=e=>e.union?"Union":"Non-union";
const grpKey={"Job title":e=>e.title,"Department":e=>e.dept,"Union":unionTxt};
function asgView(pool){const w=W(),by=w.viewBy||"Name";
 const seg=`<span class="seg2">${["Name","Job title","Department","Branch","Project","Workplace","Union"].map(x=>`<button class="${by===x?"on":""}" onclick="asgSet('viewBy','${x}')">${x}</button>`).join("")}</span>`;
 let body;
 if(!pool.length)body=`<div class="empty"><b>No one assigned yet</b>${w.mode==="people"?"Pick people from the list above.":"Add a filter to choose who is reviewed."}</div>`;
 else if(by==="Name"){const lim=w.showAll?pool.length:8;
  body=`<div class="tw"><table class="tbl"><thead><tr><th>Name</th><th>Job title</th><th>Department</th><th>Union</th><th></th></tr></thead><tbody>${pool.slice(0,lim).map(e=>`<tr><td><div class="who">${av(e.name,28)}<span>${esc(e.name)}</span></div></td><td>${esc(e.title)}</td><td>${esc(e.dept)}</td><td>${unionTxt(e)}</td><td style="text-align:right">${w.mode==="people"?`<button class="btn xs" onclick="asgPick(${e.id})">Remove</button>`:`<button class="btn xs" onclick="wzExclude('${esc(e.name)}')">Exclude</button>`}</td></tr>`).join("")}</tbody></table></div>
  ${pool.length>8?`<div class="bd" style="padding-top:10px"><button class="link sm" onclick="asgSet('showAll',${!w.showAll})">${w.showAll?"Show fewer":`Show all ${pool.length}`}</button></div>`:""}`}
 else{const g={};pool.forEach(e=>{const k=grpKey[by](e);(g[k]=g[k]||[]).push(e)});
  body=Object.entries(g).sort((a,b)=>b[1].length-a[1].length).map(([k,es])=>`<div class="asg-g"><div class="row" style="justify-content:space-between"><b>${esc(k)}</b><span class="pill">${es.length} ${es.length===1?"person":"people"}</span></div><div class="dim sm" style="margin-top:4px">${es.map(e=>esc(e.name)).join(", ")}</div></div>`).join("")}
 return `<div class="asg card"><div class="hd"><h3>Assigned · ${pool.length} ${pool.length===1?"person":"people"}</h3>${seg}</div>${body}
 ${w.mode!=="people"&&w.excl.length?`<div class="bd asg-ex"><span class="dim sm">Excluded:</span> ${w.excl.map((x,i)=>`<span class="tag">${esc(x.n)} · ${esc(x.r)} <button class="link sm" onclick="W().excl.splice(${i},1);render()">Add back</button></span>`).join(" ")}</div>`:""}</div>`}
wzWho=function(w,pool){
 const mode=w.mode||"groups";w.picked=w.picked||[];
 const groups=`<div class="row">${w.filters.map((f,i)=>`<span class="tag x" title="Remove filter" onclick="W().filters.splice(${i},1);render()"><b>${f.k}:</b> ${esc(f.v)} ✕</span>`).join("")}<select class="inp w" style="height:32px" onchange="if(this.value)addFilter(this.value)"><option value="">+ Add filter</option>${AF_KEYS.map(a=>`<option>${a}</option>`).join("")}</select></div>
  <div class="dim sm" style="margin-top:6px">Combine filters: job title, department, union, branch, project, workplace and more. Everyone matching all filters is assigned.</div>`;
 const cand=asgCandidates(),allOn=cand.length&&cand.every(e=>w.picked.includes(e.id));
 const people=`<input class="inp" placeholder="Search by name, job title or department" value="${esc(w.pq||"")}" oninput="W().pq=this.value;clearTimeout(window._pqT);window._pqT=setTimeout(()=>{render();const i=document.querySelector('.asg-pick input.inp');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},250)" style="max-width:480px">
  <div class="asg-list"><label class="asg-row hdr"><input type="checkbox" ${allOn?"checked":""} onchange="asgPickAll(this.checked)"><span>Name</span><span>Job title</span><span>Department</span><span>Union</span></label>
  ${cand.map(e=>`<label class="asg-row"><input type="checkbox" ${w.picked.includes(e.id)?"checked":""} onchange="asgPick(${e.id})"><span>${esc(e.name)}</span><span>${esc(e.title)}</span><span>${esc(e.dept)}</span><span>${unionTxt(e)}</span></label>`).join("")||'<div class="dim sm" style="padding:12px">No matches.</div>'}</div>`;
 return `<div class="sec"><h4>Start from</h4><div class="row">${["Quarterly crew check-in","Annual","90-day new hire","Ad hoc"].map(k=>`<button class="chip2 ${w.pattern===k?"on":""}" onclick="wzPattern('${k}')">${k}</button>`).join("")}</div><div class="fd">Fills in sensible defaults. You can change anything.</div></div>
 <div class="sec"><label class="fl" for="wName">Cycle name</label><input class="inp" id="wName" value="${esc(w.name)}" oninput="W().name=this.value" style="max-width:480px"></div>
 <div class="sec asg-pick"><h4>Who is reviewed</h4>
  <div class="row" style="margin:6px 0 12px"><span class="seg2"><button class="${mode==="groups"?"on":""}" onclick="asgSet('mode','groups')">By group</button><button class="${mode==="people"?"on":""}" onclick="asgSet('mode','people')">By name</button></span><span class="dim sm">${mode==="groups"?"Assign by job title, department, union, branch, project or workplace":"Pick specific people"}</span></div>
  ${mode==="groups"?groups:people}
  <div style="margin-top:16px">${asgView(pool)}</div></div>
 <div class="sec"><h4>When</h4><div class="f2" style="max-width:640px"><div><label class="fl" for="wStart">Review period start</label><input class="inp" id="wStart" value="${esc(w.start)}"></div><div><label class="fl" for="wEnd">Review period end</label><input class="inp" id="wEnd" value="${esc(w.end)}"></div></div>
  <div style="max-width:310px;margin-top:12px"><label class="fl">Repeats</label><select class="inp" onchange="W().recur=this.value">${["One time","Every quarter","Every 6 months","Every year","Rolling (hire date)"].map(o=>`<option ${w.recur===o?"selected":""}>${o}</option>`).join("")}</select></div></div>`};
/* auto-add option removed: keep it off everywhere */
const _newWz=newWz;newWz=function(...a){const w=_newWz(...a);w.auto=false;w.mode="groups";w.picked=[];w.viewBy="Name";return w};
if(S.wz)S.wz.auto=false;
render();
