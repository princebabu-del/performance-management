/* ===== Step 3 uses Lumber's standard "Assign Workers" bulk-assignment modal ===== */
const clsOf=e=>e.type==="Office"?"Salaried":e.title==="Foreman"?"Foreman":/Apprentice/.test(e.title)?"Apprentice":/Laborer/.test(e.title)?"Laborer":"Journeyman";
const AM_F=[["dept","Department","Departments",e=>e.dept],["cls","Class","Class",clsOf],["title","Job Title","Job Titles",e=>e.title],["union","Union","Union Status",e=>e.union?"Union":"Non-union"],["branch","Branch","Branches",e=>e.branch],["project","Project","Projects",e=>e.project||"No project"],["wp","Workplace","Workplaces",e=>wpOf(e)]];
const amPool=()=>D.emps.filter(e=>!e.isMgr||e.title==="Foreman");
function amInit(){const w=W();if(!w.asgInit){w.picked=wzCount().map(e=>e.id);w.mode="people";w.asgInit=true}}
function openAssign(cfg){if(!cfg){const w=W();amInit();cfg={name:w.name,sel:w.picked,onSave:ids=>{w.picked=ids;w.mode="people";w.excl=[];closeLayer();render();toast(`${ids.length} ${ids.length===1?"person":"people"} assigned.`)}}}
 S.am={cfg,tab:"un",crew:"",q:"",f:Object.fromEntries(AM_F.map(f=>[f[0],[]])),dd:null,sel:new Set(cfg.sel||[])};
 openDrawer({title:"Assign Workers",w:620,bodyCls:"am-db",body:`<div id="amBody"></div>`,foot:`<button class="btn" onclick="closeLayer()">Cancel</button><button class="btn p" id="amNext" onclick="amSave()">Next</button>`});amRender()}
function amFiltered(){const a=S.am,hide=a.cfg.hide||new Set();return amPool().filter(e=>!hide.has(e.id)&&AM_F.every(f=>!a.f[f[0]].length||a.f[f[0]].includes(f[3](e)))&&(!a.crew||e.crew===a.crew)&&(!a.q||(e.name+" "+e.code).toLowerCase().includes(a.q.toLowerCase())))}
function amRender(){const a=S.am,el=document.getElementById("amBody");if(!el)return;const foc=document.activeElement&&document.activeElement.id==="amQ";
 const list=amFiltered().filter(e=>a.tab==="un"?!a.sel.has(e.id):a.sel.has(e.id)),allOn=list.length&&a.tab==="un"&&false;
 const dd=f=>{const vals=[...new Set(amPool().map(f[3]).filter(Boolean))].sort(),cur=a.f[f[0]];
  return `<div class="am-fld"><label class="am-l">${f[1]}</label><div class="am-sel ${a.dd===f[0]?"open":""}" onclick="S.am.dd=S.am.dd==='${f[0]}'?null:'${f[0]}';amRender()">${cur.length?cur.map(v=>`<span class="tag">${esc(v)}</span>`).join(""):`<span class="am-ph">Select ${f[2]}</span>`}<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#374151" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
  ${a.dd===f[0]?`<div class="am-pop">${vals.map(v=>`<label class="am-o"><input type="checkbox" ${cur.includes(v)?"checked":""} onchange="amF('${f[0]}','${esc(v)}')"> ${esc(v)} <span class="dim sm">${amPool().filter(e=>f[3](e)===v).length}</span></label>`).join("")}</div>`:""}</div>`};
 el.innerHTML=`<div class="am-card"><b class="am-t">${esc(a.cfg.name)}</b>${a.cfg.note?`<div class="dim sm" style="margin-top:4px">${a.cfg.note}</div>`:""}</div><div class="am-card am-fc${a.fo?" open":""}"><button type="button" class="am-fh" aria-expanded="${!!a.fo}" onclick="S.am.fo=!S.am.fo;S.am.dd=null;amRender()"><span class="am-h">Filters${(()=>{const n=AM_F.reduce((s,f)=>s+a.f[f[0]].length,0);return n?` <i class="am-fn">${n}</i>`:""})()}</span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#374151" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>${a.fo?`<div class="am-flds">${AM_F.map(dd).join("")}</div>`:""}</div>
 <div class="am-card am-w"><div class="am-h">Select Workers</div><div class="am-tabs"><button class="${a.tab==="un"?"on":""}" onclick="S.am.tab='un';amRender()">Unassigned Workers</button><button class="${a.tab==="as"?"on":""}" onclick="S.am.tab='as';amRender()">Assigned Workers <i>${a.sel.size}</i></button></div>
  <label class="am-l">Crew</label><select class="inp" onchange="S.am.crew=this.value;amRender()"><option value="">None</option>${D.crews.map(c=>`<option value="${c.id}" ${a.crew===c.id?"selected":""}>${c.name}</option>`).join("")}</select>
  <div class="am-list"><label class="srch am-s">${ic("search")}<input id="amQ" placeholder="Search" value="${esc(a.q)}" oninput="S.am.q=this.value;amRender()"></label>
  ${list.length?`<label class="am-row all"><input type="checkbox" onchange="amAll(this.checked)" ${a.tab==="as"?"checked":""}> ${a.tab==="un"?"Select All":"Unselect All"} <span class="dim sm">${list.length}</span></label>${list.map(e=>`<label class="am-row"><input type="checkbox" ${a.sel.has(e.id)?"checked":""} onchange="amT(${e.id})"><span class="grow">${esc(e.name)}<span class="dim sm"> · ${esc(e.title)}</span></span><span class="tab-num">${e.code}</span></label>`).join("")}`
   :`<div class="dim" style="padding:16px 4px">${a.tab==="un"?"No unassigned workers match these filters.":"No one assigned yet."}</div>`}</div></div>
 ${a.sel.size?`<div class="am-fab" title="${a.sel.size} assigned" onclick="S.am.tab='as';amRender()">${a.sel.size}</div>`:""}`;
 const nb=document.getElementById("amNext");if(nb){nb.disabled=!a.sel.size}
 if(foc){const i=document.getElementById("amQ");i.focus();i.setSelectionRange(i.value.length,i.value.length)}}
function amF(k,v){const c=S.am.f[k],i=c.indexOf(v);i<0?c.push(v):c.splice(i,1);amRender()}
function amT(id){const s=S.am.sel;s.has(id)?s.delete(id):s.add(id);amRender()}
function amAll(on){const a=S.am,list=amFiltered().filter(e=>a.tab==="un"?!a.sel.has(e.id):a.sel.has(e.id));list.forEach(e=>on?a.sel.add(e.id):a.sel.delete(e.id));amRender()}
function amSave(){S.am.cfg.onSave([...S.am.sel])}
/* the same modal for adding people to a live cycle */
addPeople=function(cid){const c=C(cid),inC=new Set(D.packets.filter(p=>p.cid===cid&&p.exc!=="Removed").map(p=>p.eid));
 openAssign({name:c.name,note:`${inC.size} already in this cycle are hidden. New people get a review link right away.`,sel:[],hide:inC,onSave:ids=>{
  ids.forEach(id=>{const e=E(id);D.packets.push({id:Math.max(...D.packets.map(p=>p.id))+1,cid,eid:id,st:"Not started",exc:null,due:"Oct 23",self:{st:"Not started"},mgr:{st:"Not started",by:e.mgr},contrib:[],peers:[],rating:null,ver:1,ans:{},hist:[{t:"Today",who:"Rachel Kim",txt:"Added to cycle; review link sent",c:"g"}]})});
  closeLayer();render();toast(`Added ${ids.length} ${ids.length>1?"people":"person"} to ${c.name}. Review links sent.`)}})};
/* Questionnaires › row Assign action: start a cycle with this questionnaire and open the modal */
const _assignTpl22=assignTpl;assignTpl=function(id){_assignTpl22(id);if(S.view==="wizard"&&W()){W().step=2;render();openAssign()}};
/* step 3 body: summary + the modal */
function asgStepBody(w){amInit();const pool=wzCount();
 return `<div class="sec"><div class="row" style="justify-content:space-between;gap:12px"><div style="min-width:0"><h4>Assign employees</h4><div class="sd" style="margin:0">Pick workers in the assignment modal by department, class, job title, union, branch, project, workplace or crew.</div></div><button class="btn p" onclick="openAssign()">${ic("plus","s")} ${pool.length?"Edit assignment":"Assign workers"}</button></div></div><div class="sec">${asgView(pool)}</div>`}
render();
