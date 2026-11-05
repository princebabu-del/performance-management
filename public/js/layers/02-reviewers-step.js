/* ===== Step 2 rebuilt: 1) Who reviews (by role → exact person → form) 2) Missing managers 3) Overall rating ===== */
const ROLES=[
 {k:"Self",n:"Worker (self)",d:"The employee rates themselves.",tt:["Self"],
  who:["Same as employee"]},
 {k:"Foreman",n:"Foreman",d:"Reviews the workers in their crew.",tt:["Manager"],
  who:["Crew foreman","Foreman with most hours with them (time cards)"]},
 {k:"Manager",n:"Manager",d:"Reviews people not in a crew, including foremen.",tt:["Manager"],
  who:["Department manager","Branch manager","Project manager"]},
 {k:"Admin",n:"HR / Admin",d:"A named admin reviews everyone in this cycle.",tt:["Manager"],
  who:["Rachel Kim · Office Manager","Dana Whitfield · Superintendent","Mark Wagner · Owner"]},
 {k:"Peer",n:"Peer",d:"Coworkers give feedback. Anonymous, shown after 3 responses.",tt:["Peer"],
  who:["Manager picks 2 peers","Employee nominates, manager approves","2 random crewmates"]}];
const RATING_FMT=[
 {k:"Stars",n:"★ Stars (1–5)",d:"Quick to read on a phone.",lv:[1,2,3,4,5].map(n=>"★".repeat(n)+"☆".repeat(5-n))},
 {k:"Numeric 1–5 with definitions",n:"1–5 numbers",d:"Each number has a name.",lv:null}];
const OVERALL_BY=["Foreman's or manager's rating (others are input)","Average of all reviewers, weighted by hours","HR sets it after reading the reviews"];
const NO_MGR=["Hector Cruz","Omar Haddad"];
function rolesInit(w){if(w.roles)return w.roles;const field=/crew|90-day|Project/.test(w.pattern||"");
 const tplOf=t=>(w.tpl.find(x=>x.t===t)||{}).id;
 w.roles={Self:{on:!!w.types.Self,who:0,tpl:tplOf("Self")||"t1"},
  Foreman:{on:field&&!!w.types.Manager,who:0,tpl:field?(tplOf("Manager")||"t11"):"t11",notes:!!w.types.Contributor},
  Manager:{on:!!w.types.Manager,who:field?2:0,tpl:"t2",alsoCrew:false},
  Admin:{on:false,who:0,tpl:"t2"},
  Peer:{on:!!w.types.Peer,who:0,tpl:tplOf("Peer")||"t4"}};
 if(!w.ratingSet){w.rating=field?"Stars":"Numeric 1–5 with definitions";w.ratingSet=true}
 w.overallBy=w.overallBy||OVERALL_BY[0];w.mgrFix=w.mgrFix||{};return w.roles}
function rolesSync(w){const r=w.roles;
 w.types={Self:r.Self.on,Manager:r.Foreman.on||r.Manager.on||r.Admin.on,Contributor:r.Foreman.on&&!!r.Foreman.notes,Peer:r.Peer.on};
 w.tpl=[];ROLES.forEach(x=>{if(r[x.k].on)w.tpl.push({g:"Everyone",t:x.k==="Self"||x.k==="Peer"?x.k:"Manager",id:r[x.k].tpl,role:x.k})});
 if(w.types.Contributor)w.tpl.push({g:"Everyone",t:"Contributor",id:"t3",role:"Foreman notes"});}
function roleSet(k,f,v){const w=W();rolesInit(w);w.roles[k][f]=v;rolesSync(w);render()}
function tplOpts(role,cur){const o=D.templates.filter(t=>t.status!=="Archived"&&role.tt.some(x=>t.type.includes(x)||(t.type==="Self + Manager"&&["Self","Manager"].includes(x))));return (o.length?o:D.templates).map(t=>`<option value="${t.id}" ${t.id===cur?"selected":""}>${esc(t.name)}</option>`).join("")}
function noMgr(w,pool){const r=w.roles;if(!(r.Foreman.on||r.Manager.on))return [];return pool.filter(e=>!revFor(e,w).name)}
function mgrFixOne(name,v){const w=W();w.mgrFix[name]=v;const pool=wzCount();w.nrFixed=noMgr(w,pool).every(e=>w.mgrFix[e.name]);render()}
function mgrFixAll(){const w=W(),pool=wzCount();noMgr(w,pool).forEach(e=>{w.mgrFix[e.name]=(typeof ORG!=="undefined"&&ORG.branch[e.branch])||"Dana Whitfield"});w.nrFixed=true;render();toast("Their branch manager will review them in this cycle.")}
wzReviews=function(w,pool){
 const r=rolesInit(w);rolesSync(w);
 const rows=ROLES.map(x=>{const s=r[x.k];return `<div class="rv-row ${s.on?"":"off"}">
  <label class="rv-role"><span class="sw"><input type="checkbox" ${s.on?"checked":""} onchange="roleSet('${x.k}','on',this.checked)"><span></span></span><span><b>${x.n}</b><span class="dim sm">${x.d}</span></span></label>
  ${s.on?`<div class="rv-f"><label class="fl">Assignee${x.k==="Manager"?"s":""}</label>${x.k==="Manager"&&typeof mgrPick==="function"?mgrPick(s):x.who.length>1?`<select class="inp" onchange="roleSet('${x.k}','who',+this.value)">${x.who.map((o,i)=>`<option value="${i}" ${s.who===i?"selected":""}>${esc(o)}</option>`).join("")}</select>`:`<div class="rv-static">${x.who[0]}</div>`}
   ${x.k==="Foreman"?`<label class="opt sm" style="margin-top:6px"><input type="checkbox" ${s.notes?"checked":""} onchange="roleSet('Foreman','notes',this.checked)"> Other foremen with 40+ hrs add notes</label>`:""}${x.k==="Manager"?`<label class="opt sm" style="margin-top:6px"><input type="checkbox" ${s.alsoCrew?"checked":""} onchange="roleSet('Manager','alsoCrew',this.checked)"> Also review crew workers, alongside their foreman</label>`:""}${typeof appliesTo==="function"?appliesTo(x.k,pool,w):""}</div>
  <div class="rv-f"><label class="fl">Questionnaire</label><div class="row" style="flex-wrap:nowrap"><select class="inp" onchange="roleSet('${x.k}','tpl',this.value)">${tplOpts(x,s.tpl)}</select><button class="btn s" onclick="previewTpl('${s.tpl}')">Preview</button></div>${typeof dueField==="function"?dueField(x.k,s,w):""}</div>`
  :`<div class="rv-f dim sm" style="grid-column:span 2;align-self:center">Off. Turn on to choose the assignee and questionnaire.</div>`}</div>`}).join("");
 const on=ROLES.filter(x=>r[x.k].on).length;
 const _g=gaps(w,pool);if(_g.length)w.gapOpen=true;const showGap=_g.length>0;if(!showGap)w.gapOpen=false;const mgrSec=showGap?mgrSection(w,pool):"";
 if(!RATING_FMT.some(f=>f.k===w.rating))w.rating="Numeric 1–5 with definitions";const fmt=RATING_FMT.find(f=>f.k===w.rating);
 const scale=fmt.lv===null?D.settings.levels.map((l,i)=>`${i+1} ${l}`):fmt.lv.map((x,i)=>`${x} ${D.settings.levels[i]}`);
 return `<div class="sec"><h4>1. Who reviews each person</h4><div class="sd">Turn on a role, then choose its assignee and questionnaire. ${on} role${on===1?"":"s"} on.</div>
  <div class="card rv">${rows}</div>${typeof remNote==="function"?remNote():""}
  ${typeof matchRules==="function"?matchRules(pool,w):""}<button class="link sm" style="margin-top:10px" onclick="reviewerMap()">See reviewers for each person</button></div>
 ${showGap?`<div class="sec"><h4>2. Employees with no manager</h4><div class="sd">These employees have no manager for a role you picked. Choose who reviews them in this cycle.</div>${mgrSec}</div>`:""}
 <div class="sec"><h4>${showGap?3:2}. Overall rating for this cycle</h4><div class="sd">One format for everyone in this cycle. Questionnaires can still ask their own questions.</div>
  <div class="rf">${RATING_FMT.map(f=>`<label class="rf-c ${w.rating===f.k?"on":""}"><input type="radio" name="rfmt" ${w.rating===f.k?"checked":""} onchange="W().rating='${f.k}';render()"><b>${f.n}</b><span class="dim sm">${f.d}</span></label>`).join("")}</div>
  ${scale.length?`<div class="rf-scale"><span class="dim sm">Employees see:</span>${scale.map(s=>`<span class="tag">${esc(s)}</span>`).join("")}</div>
  <div style="max-width:420px;margin-top:14px"><label class="fl">Who sets the final rating</label><select class="inp" onchange="W().overallBy=this.value">${OVERALL_BY.map(o=>`<option ${w.overallBy===o?"selected":""}>${o}</option>`).join("")}</select></div>`:""}</div>`};
/* step 4 summary + launch checks use the new wording */
const _wzIssues14=wzIssues;
wzIssues=function(){const w=W();if(w)rolesInit(w),rolesSync(w);const out=_wzIssues14();
 out.forEach(i=>{if(/no reviewer/.test(i.t)){const pool=wzCount(),m=noMgr(w,pool).filter(e=>!w.mgrFix[e.name]);if(!m.length){i._drop=1;return}i.t=`${m.length} ${m.length===1?"employee has":"employees have"} no manager attached`;i.d=m.map(e=>e.name).join(", ")+" · pick who reviews them";i.fix=[["Use branch manager","mgrFixAll()"],["Choose by hand","wzGo(1)"]]}});
 return out.filter(i=>!i._drop)};
const _newWz14=newWz;newWz=function(...a){const w=_newWz14(...a);rolesInit(w);rolesSync(w);return w};
if(S.wz){rolesInit(S.wz);rolesSync(S.wz)}
render();
