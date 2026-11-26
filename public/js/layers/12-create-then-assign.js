/* ===== Create the cycle first (2 steps), assign people afterwards from the cycles list ("Assign" link, Lumber pattern) ===== */
WS.length=0;WS.push("Cycle details","Reviews");
wzGo=function(i){_wzGo16(Math.min(i,1))};
assignTpl=_assignTpl22;
const _ap23=appliesTo;appliesTo=(k,pool,w)=>pool.length?_ap23(k,pool,w):"";
const _mr23=matchRules;matchRules=(pool,w)=>pool.length?_mr23(pool,w):`<div class="note sm" style="margin-top:12px">Reviewers are matched to each person when you assign people to this cycle: crew workers to their foreman, everyone else to the managers you picked.</div>`;
const wzIssuesCreate=()=>wzIssues().filter(i=>!/match|manager|phone/i.test(i.t));
V.wizard=()=>{
 const w=W();if(!w)return V.cycles();wzCollect();if(w.step>1)w.step=1;rolesInit(w);datesInit(w);syncPhases(w);
 const iss=wzIssuesCreate(),[det]=whoSplit(w,[]);
 const body=w.step===0?det:wzReviews(w,[],iss);
 return `<div class="crumb"><a onclick="wzLeave()">Review Cycles</a> › <span>${w.id&&C(w.id)?"Edit draft":"New review cycle"}</span></div>
 <div class="ph"><div><h1>${w.id&&C(w.id)?esc(w.name):"New Review Cycle"}</h1><div class="sub">Create the cycle, then assign people from the Review Cycles list</div></div><div class="row"><button class="btn" onclick="wzSave()">Save draft</button><button class="btn ghost" onclick="wzLeave()">Exit</button></div></div>
 <div class="hsteps">${WS.map((s,i)=>`<button class="${i===w.step?"on":i<w.step?"done":""}" onclick="wzGo(${i})"><span class="n">${i<w.step?"✓":i+1}</span>${s}${iss.some(x=>x.b&&Math.min(x.step,1)===i)&&i!==w.step?' <span style="color:var(--red)">•</span>':""}</button>`).join("")}</div>
 <div class="wzbox"><div class="card">${body}</div>
 ${w.step===1?launchWarn(iss):""}<div class="wzfoot"><button class="btn" ${w.step?"":"hidden"} onclick="wzGo(${w.step-1})">${ic("back","s")} Back</button><span></span>${w.step<1?`<button class="btn p" onclick="wzGo(1)">Next: Reviews</button>`:`<div class="row"><button class="btn" onclick="wzSave()">Save draft</button><button class="btn p" onclick="createCycle()">Create cycle</button></div>`}</div></div>`};
function createCycle(){const iss=wzIssuesCreate().filter(x=>x.b);if(iss.length){wzGo(Math.min(iss[0].step,1));toast(`Fix ${iss.length} item${iss.length>1?"s":""} first.`);return}
 wzSave(true);const w=W(),c=C(w.id),s=toISO(w.start);
 /* New Hire / Project Completion run per person (probation, project dates), so they have no cycle period and start Active */
 const rolling=!!w.ctype&&w.ctype!=="General Review",fut=!rolling&&(!s||s>"2026-11-03");
 Object.assign(c,{status:fut?"Scheduled":"Active",period:rolling?"Rolling":`${w.start} – ${w.end}`,startISO:rolling?"":s,endISO:rolling?"":toISO(w.end),phases:w.phases.map((p,i)=>({...p,st:!fut&&i===0?"cur":""})),wz:JSON.parse(JSON.stringify(w)),draftStep:null});
 D.activity.unshift({t:"Just now",txt:`${c.name} created · no one assigned yet`,c:"b"});
 S.wz=null;S.hl=c.id;nav("cycles",{cycTab:fut?"Scheduled":"Active"});toast(`${c.name} created. Click Assign to add people.`)}
/* date helpers for the list */
const isoMDY=i=>{if(!i)return"—";const[y,m,d]=i.split("-");return `${m}/${d}/${y}`};
function cycDates(c){if(c.startISO)return[c.startISO,c.endISO];const m=/^([A-Z][a-z]{2} \d{1,2})(?:, (\d{4}))? – ([A-Z][a-z]{2} \d{1,2}), (\d{4})$/.exec(c.period||"");if(!m)return["",""];return[toISO(`${m[1]}, ${m[2]||m[4]}`),toISO(`${m[3]}, ${m[4]}`)]}
/* list columns: type, period, repeats, reviewee, reviewer count and rating system come from the saved editor state (c.wz / c.rx), with fallbacks for the seeded cycles */
const clType=c=>{const t=c.ctype||(c.wz||{}).ctype;if(t)return t==="Probation period"?"New Hire Review":t;return /new hire|probation/i.test(c.pattern||"")?"New Hire Review":"General Review"};
const clPeriod=c=>{const[s,e]=cycDates(c);return s&&e?`${isoMDY(s)} – ${isoMDY(e)}`:"—"};
const clRepeats=c=>{const v=(c.wz||{}).recur||c.recurring||"",m={"Every quarter":"Every 3 months"}[v]||v;return ["Every month","Every 3 months","Every 6 months","Every year"].includes(m)?m:"—"};
/* New Hire / Project Completion cycles have no Repeats; their mandatory Review Schedule shows in that column instead
   (seeded ones default to the one-time review). Saved on the cycle, or in c.wz for older drafts. */
const clProbSched=c=>{const g=k=>c[k]!=null?c[k]:(c.wz||{})[k],nh=clType(c)==="New Hire Review",n=g("probEvery"),t=g("probTillN");
 if(g("probSched")!=="interval"||!(n>=1))return nh?"At the end of probation":"At project completion";
 const every=`Every ${n} month${n>1?"s":""}`;
 return !nh?(g("projTillN")>=1?`${every} till ${g("projTillN")} month${g("projTillN")>1?"s":""} after the completion date`:`${every} till project completion`):g("probTill")==="period"&&t>=1?`${every} till ${t} month${t>1?"s":""} after the start date`:`${every} till the end of probation`};
/* List columns for New Hire / Project Completion, split like General Review:
   Cycle Period = the window reviews run in · Repeats = "Every N months", or "One-time" */
const clSchedWindow=c=>{const g=k=>c[k]!=null?c[k]:(c.wz||{})[k],iv=g("probSched")==="interval";
 if(clType(c)==="New Hire Review"){const t=g("probTillN");return iv&&g("probTill")==="period"&&t>=1?`Start date – ${t} month${t>1?"s":""} after`:"Start date – end of probation"}
 const t=g("projTillN");return iv&&t>=1?`Project start – ${t} month${t>1?"s":""} after completion`:"Project start – completion"};
const clSchedEvery=c=>{const g=k=>c[k]!=null?c[k]:(c.wz||{})[k],n=g("probEvery");return g("probSched")==="interval"&&n>=1?`Every ${n} month${n>1?"s":""}`:"One-time"};
/* Project Completion: all projects, or the picked list */
const clProjects=c=>{const g=k=>c[k]!=null?c[k]:(c.wz||{})[k],l=g("projs")||[];return g("projMode")==="specific"&&l.length?l.join(", "):"All projects"};
const clRx=c=>c.rx||(c.wz||{}).rx||null;
/* Reviewee and reviewers are mandatory in the editor, so a live (non-draft) cycle never shows "—" for them.
   Seeded cycles have no saved editor state: field / new-hire audiences map to Worker, office audiences to Project Manager,
   anything else to Worker. Only drafts can still be missing them. */
const clReviewee=c=>{const x=clRx(c);if(x&&x.reviewee)return x.reviewee;const a=c.aud||"";
 if(/field|new hire|worker/i.test(a))return "Worker";if(/office/i.test(a))return "Project Manager";return c.status==="Draft"?"—":"Worker"};
const clReviewers=c=>{const x=clRx(c);if(x&&(x.revs.length||x.self||x.peers))return x.revs.length+(x.peers?1:0)+(x.self?1:0);return (c.types||[]).length||(c.status==="Draft"?"—":1)};
/* Rating System = the editor's Overall Rating options only (Stars (1–5) · Numbers (1–5) · No rating). Like the editor, any older/unknown value falls back to Numbers (1–5) */
const clRating=c=>{const r=c.rating||(c.wz||{}).rating||"";return r==="Stars"?"Stars (1–5)":/^(No rating|Written answers only)$/.test(r)?"No rating":"Numbers (1–5)"};
/* Created Date / Created By: seeded cycles carry fixed values; any other cycle is stamped the first time it's listed
   (it was just created, duplicated or saved as a draft by the signed-in admin). */
const CL_SEED_CREATED={c1:["2026-09-15","Rachel Kim"],c2:["2026-06-16","Rachel Kim"],c3:["2025-12-10","Dana Whitfield"],c4:["2026-03-02","Rachel Kim"],c6:["2026-03-17","Rachel Kim"],c7:["2026-11-02","Rachel Kim"],c9:["2026-10-20","Rachel Kim"],c10:["2026-10-28","Dana Whitfield"],c5:["2026-08-14","Rachel Kim"],c8:["2025-12-16","Rachel Kim"]};
function clStamp(c){if(c.createdISO)return c;const seed=CL_SEED_CREATED[c.id],d=new Date();
 [c.createdISO,c.createdBy]=seed||[`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`,"Rachel Kim"];return c}
/* Review Cycles table columns. Created By and Created Date show by default (same as Questionnaires); turn any off from Columns.
   Rows are a fixed 56px: every cell is one line, and text that doesn't fit is cut with "…" (full text on hover). t = escaped text.
   sv = the value the column sorts by (lsSorted / lsTh in app.js). */
/* Active, Scheduled and Closed show the same columns, but an auto-sized table fits each column to the rows on screen, so
   widths changed from tab to tab. clSizer adds an invisible row (tfoot, visibility:collapse — takes no space, still sizes
   columns) holding each column's longest value across all three tabs plus room for the widest actions (two 40px buttons),
   so every column is the same width on all three. Drafts has its own columns and isn't sized this way. */
const clSizer=cols=>{if(clDraftTab())return"";const pool=D.cycles.filter(c=>!["Draft","Archived"].includes(c.status));if(!pool.length)return"";
 const len=(x,c)=>String(x.sv?x.sv(c)??"":"").length;
 return `<tfoot class="cl-sizer" aria-hidden="true"><tr><td class="cbx"></td>${cols.map(x=>x.td(pool.reduce((a,b)=>len(x,b)>len(x,a)?b:a),0,false)).join("")}<td class="act"><span class="cl-sizer-act"></span></td></tr></tfoot>`};
const clSortVal=(c,k)=>{const x=clCols().find(x=>x.k===k);return x&&x.sv?x.sv(c):""};
const clT=t=>`<span class="cl-t" title="${t}">${t}</span>`;
const CL_COLS=[
 {k:"name",l:"Cycle Name",lock:true,sv:c=>c.name,td:c=>`<td>${clT(esc(c.name))}</td>`},
 {k:"type",l:"Review Type",sv:c=>clType(c),td:c=>`<td>${clT(esc(clType(c)))}</td>`},
 {k:"period",l:"Cycle Period",sv:c=>clType(c)!=="General Review"?clSchedWindow(c):clPeriod(c),td:c=>`<td>${clT(esc(clType(c)!=="General Review"?clSchedWindow(c):clPeriod(c)))}</td>`},
 {k:"repeats",l:"Repeats",sv:c=>clType(c)!=="General Review"?clSchedEvery(c):clRepeats(c),td:c=>`<td>${clT(esc(clType(c)!=="General Review"?clSchedEvery(c):clRepeats(c)))}</td>`},
 {k:"reviewee",l:"Reviewee",sv:c=>clReviewee(c),td:c=>`<td>${clT(esc(clReviewee(c)))}</td>`},
 {k:"reviewers",l:"Reviewers",num:true,sv:c=>Number(clReviewers(c))||0,td:c=>`<td class="num">${clReviewers(c)}</td>`},
 {k:"rating",l:"Rating System",sv:c=>clRating(c),td:c=>`<td>${clT(esc(clRating(c)))}</td>`},
 {k:"createdBy",l:"Created By",off:true,sv:c=>clStamp(c).createdBy,td:c=>`<td>${clT(esc(clStamp(c).createdBy))}</td>`},
 {k:"created",l:"Created Date",off:true,sv:c=>clStamp(c).createdISO,td:c=>`<td class="nw">${isoMDY(clStamp(c).createdISO)}</td>`}];
/* Drafts tab: Cycle Name · Review Type · Last Modified By · Last Modified Date. Last modified falls back to created
   until the draft is saved again (wzSave stamps modBy / modISO, layer 31). */
const clMod=c=>{clStamp(c);return {by:c.modBy||c.createdBy,iso:c.modISO||c.createdISO}};
const CL_DRAFT_COLS=[CL_COLS[0],CL_COLS[1],
 {k:"modBy",l:"Last Modified By",sv:c=>clMod(c).by,td:c=>`<td>${clT(esc(clMod(c).by))}</td>`},
 {k:"modified",l:"Last Modified Date",sv:c=>clMod(c).iso,td:c=>`<td class="nw">${isoMDY(clMod(c).iso)}</td>`}];
const clDraftTab=()=>S.view==="cycles"&&S.cycTab==="Drafts"&&!(typeof PR==="function"&&PR());
const clCols=()=>clDraftTab()?CL_DRAFT_COLS:CL_COLS;
/* visible columns, in the user's order (set by dragging in the Columns dropdown — layer 21). Locked columns stay first.
   The Drafts tab keeps its own choices (S.cycColsD / S.cycOrderD) apart from the other tabs (S.cycCols / S.cycOrder). */
const clOrder=()=>{const C_=clCols(),so=S[clDraftTab()?"cycOrderD":"cycOrder"],all=C_.map(x=>x.k),o=Array.isArray(so)?so.filter(k=>all.includes(k)):[];
 const rest=[...o,...all.filter(k=>!o.includes(k))],lock=C_.filter(x=>x.lock).map(x=>x.k);return [...lock,...rest.filter(k=>!lock.includes(k))]};
const clColsOn=()=>{const C_=clCols(),key=clDraftTab()?"cycColsD":"cycCols";if(!Array.isArray(S[key]))S[key]=C_.filter(x=>!x.off).map(x=>x.k);
 return clOrder().map(k=>C_.find(x=>x.k===k)).filter(x=>x.lock||S[key].includes(x.k))};
V.cycles=()=>{
 const tabs=[["Active",c=>["Active","Paused"].includes(c.status)],["Scheduled",c=>c.status==="Scheduled"],["Drafts",c=>c.status==="Draft"],["Closed",c=>c.status==="Closed"]];
 if(!tabs.some(t=>t[0]===S.cycTab))S.cycTab="Active";
 D.cycles.forEach(clStamp);
 let rows=D.cycles.filter(tabs.find(t=>t[0]===S.cycTab)[1]).filter(c=>!S.q||c.name.toLowerCase().includes(S.q.toLowerCase()));
 if(typeof lsFilterRows==="function")rows=lsFilterRows("cycles",rows);   // Filters drawer (layers/31-listing-filters.js)
 const list=lsSorted("cycles",rows,clSortVal),cols=clColsOn();
 const sel=[...S.sel].filter(id=>list.some(c=>c.id===id)),all=list.length&&sel.length===list.length,some=sel.length&&!all;
 return `<div class="ph"><div><h1>Review Cycles</h1></div><button class="btn p" onclick="startCycle()">${ic("plus")} Add Review Cycle</button></div>
 ${tabBar(tabs.map(t=>({id:t[0],label:t[0],count:D.cycles.filter(t[1]).length})),{active:S.cycTab,label:"Review cycle status",onSelect:id=>`nav('cycles',{cycTab:'${id}'})`})}
 <div class="card">${list.length||S.q||fltOn("cycles")?toolbar(`<div class="cl-tools-l"><label class="srch">${ic("search")}<input id="cq" placeholder="Search review cycles" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#cq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label>${sel.length?bulkBar(sel.length,clBulkActs(S.cycTab,sel)):""}</div>`):""}
 ${list.length?`<div class="tw"><table class="tbl cyctbl"><thead><tr><th class="cbx"><input type="checkbox" aria-label="Select all cycles" ${all?"checked":""} ${some?'data-indet="1" aria-checked="mixed"':""} onchange="S.sel=new Set(this.checked&&!this.hasAttribute('data-indet')?[${list.map(c=>`'${c.id}'`)}]:[]);S.menu=null;render()"></th>${cols.map(x=>lsTh("cycles",x.k,x.l,x.num?"num":"")).join("")}<th class="act"></th></tr></thead><tbody>${pgRows(list,"cycles-"+S.cycTab).map(c=>{const n=D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed").length,draft=c.status==="Draft";
  const act=draft?`<button type="button" class="cd-tert" onclick="editDraft('${c.id}')">Continue setup</button>`:c.status==="Closed"?(cycCanReopen(c)?`<button type="button" class="cd-tert" onclick="cycReopen('${c.id}')">Reopen</button>`:""):`<button class="btn ghost s" aria-label="Assign review cycle" data-tip="Assign Review Cycle" onclick="assignCycle('${c.id}')">${ic("userplus")}</button>`;
  const on=S.sel.has(c.id);
  return `<tr class="click ${S.hl===c.id?"hl":""} ${on?"sel":""}" onclick="${draft?`editDraft('${c.id}')`:`nav('cycle',{cid:'${c.id}',tab:'overview'})`}"><td class="cbx" onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select ${esc(c.name)}" ${on?"checked":""} onchange="this.checked?S.sel.add('${c.id}'):S.sel.delete('${c.id}');S.menu=null;render()"></td>${cols.map(x=>x.td(c,n,draft)).join("")}
  <td class="act" onclick="event.stopPropagation()"><div class="cyc-act">${act}${cycleMenu(c,false,true)}</div></td></tr>`}).join("")}</tbody>${clSizer(cols)}</table></div>${pgFoot(list.length,"cycles-"+S.cycTab)}`:clEmpty()}</div>`};
/* empty table: the Overview card empty state (heading + gray description), no button. A search with no hits gets its own message. */
const CL_EMPTY={Active:["No active cycles","Cycles show up here once they start. Scheduled cycles move here on their start date."],
 Scheduled:["No scheduled cycles","Cycles with a future start date wait here until they begin."],
 Drafts:["No drafts","Cycles saved as a draft show up here so you can finish setting them up."],
 Closed:["No closed cycles yet","Results appear here after a cycle closes."]};
const fltOn=view=>Object.values((S.flt||{})[view]||{}).some(v=>Array.isArray(v)?v.length:v&&(v.from||v.to));   // any filter applied (lists or date ranges)
const clEmpty=()=>S.q?emptyState("No cycles match your search",`Nothing in ${esc(S.cycTab)} matches “${esc(S.q)}”. Try a different name or check the other tabs.`)
 :fltOn("cycles")?emptyState("No cycles match your filters",`Nothing in ${esc(S.cycTab)} matches the selected filters. Try resetting a filter or check the other tabs.`)
 :emptyState(...(CL_EMPTY[S.cycTab]||CL_EMPTY.Active));
/* Questionnaires table empty state: same pattern as review cycles (heading + gray description, no button).
   A search or filter with no hits gets its own message. */
const TPL_EMPTY={Active:["No active questionnaires","Published questionnaires show up here, ready to use in your review cycles."],
 Starter:["No starter questionnaires","Lumber's ready-made questionnaires for crews and offices show up here."],
 Favorites:["No favorites yet","Star a questionnaire to keep it here for quick access."],
 Drafts:["No drafts","Questionnaires saved as a draft show up here so you can finish them."],
 Archive:["No archived questionnaires","Questionnaires in use are archived instead of deleted, so history stays intact."]};
const tplEmpty=()=>{const flt=fltOn("templates");
 return S.q?emptyState("No questionnaires match your search",`Nothing in ${esc(S.tplTab)} matches “${esc(S.q)}”. Try a different name or check the other tabs.`)
  :flt?emptyState("No questionnaires match your filters",`Nothing in ${esc(S.tplTab)} matches the selected filters. Try clearing a filter or check the other tabs.`)
  :emptyState(...(TPL_EMPTY[S.tplTab]||TPL_EMPTY.Active))};
/* pinned columns: measure the checkbox column for the name column's left offset, and show the edge shadows
   only when there's content scrolled under them (pin-l: scrolled right of the start · pin-r: more to the right) */
function clPinSync(tw){if(!tw)return;const t=tw.querySelector(".cyctbl");if(!t)return;const cb=t.querySelector("th.cbx");if(cb)t.style.setProperty("--cl-cbx",cb.offsetWidth+"px");
 tw.classList.toggle("pin-l",tw.scrollLeft>0);tw.classList.toggle("pin-r",tw.scrollLeft+tw.clientWidth<tw.scrollWidth-1)}
const clPinAll=()=>document.querySelectorAll(".tw").forEach(tw=>{if(tw.querySelector(".cyctbl"))clPinSync(tw)});
document.addEventListener("scroll",e=>{const t=e.target;if(t.classList&&t.classList.contains("tw")&&t.querySelector(".cyctbl"))clPinSync(t)},true);
addEventListener("resize",clPinAll);
const _renderPin=render;render=function(...a){_renderPin(...a);clPinAll()};
function assignCycle(cid){const c=C(cid),cur=D.packets.filter(p=>p.cid===cid&&p.exc!=="Removed").map(p=>p.eid);
 openAssign({name:c.name,sel:cur,onSave:ids=>{const add=ids.filter(id=>!cur.includes(id)),rem=cur.filter(id=>!ids.includes(id)),w=c.wz;
  let pid=Math.max(0,...D.packets.map(p=>p.id));
  add.forEach(id=>{const e=E(id),rv=w?revsFor(e,w):[],by=(rv.find(x=>x.name)||{}).name||e.mgr;
   D.packets.push({id:++pid,cid,eid:id,st:"Not started",exc:null,due:(c.phases[0]||{}).e||"",self:{st:(!w||w.roles.Self.on)?"Not started":"Off"},mgr:{st:"Not started",by},contrib:[],peers:[],rating:null,ver:1,ans:{},hist:[{t:"Today",who:"Rachel Kim",txt:"Assigned to cycle",c:"b"}]})});
  rem.forEach(id=>{const p=D.packets.find(p=>p.cid===cid&&p.eid===id&&p.exc!=="Removed");if(p){p.prev=p.st;p.exc="Removed"}});
  closeLayer();S.hl=cid;render();
  const msg=`${ids.length} ${ids.length===1?"person":"people"} assigned${c.status==="Scheduled"?`. Review links go out on ${(c.phases[0]||{}).s||"the start date"}`:". Review links sent"}.`;
  const g=w?gaps(w,ids.map(E)):[];if(g.length)gapModal(cid);else toast(msg)}})}
function gapModal(cid){const c=C(cid),w=c.wz,pool=D.packets.filter(p=>p.cid===cid&&p.exc!=="Removed").map(p=>E(p.eid)),g=gaps(w,pool);
 if(!g.length){closeModal();toast("Every assigned person has a reviewer.");return}
 openModal(`<h3>${new Set(g.map(x=>x.e.name)).size} people need a reviewer</h3><p class="dim" style="margin:0 0 12px">They're assigned, but no manager was found for a role you picked. Choose who reviews them.</p>
 <div class="card"><div class="tw"><table class="tbl"><thead><tr><th>Employee</th><th>Missing</th><th>Reviewer</th></tr></thead><tbody>${g.map(x=>`<tr><td>${esc(x.e.name)}<div class="dim sm">${esc(x.x.why)}</div></td><td>${x.x.type}</td><td><select class="inp" style="height:36px;border-color:var(--red)" onchange="C('${cid}').wz.mgrFix['${x.e.name}|${x.x.t}']=this.value;gapModal('${cid}')"><option value="">Select</option>${ALL_MGRS().map(n=>`<option>${n}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table></div></div>
 <div class="mf"><button class="btn" onclick="closeModal();toast('Saved. Fix the missing reviewers from the cycle page.')">Fix later</button><button class="btn p" onclick="g2Branch('${cid}')">Use branch manager for all</button></div>`,720)}
function g2Branch(cid){const c=C(cid),w=c.wz,pool=D.packets.filter(p=>p.cid===cid&&p.exc!=="Removed").map(p=>E(p.eid));gaps(w,pool).forEach(x=>{w.mgrFix[x.e.name+"|"+x.x.t]=ORG.branch[x.e.branch]||"Dana Whitfield"});closeModal();toast("Their branch manager will review them.")}
if(S.wz)S.wz.step=Math.min(S.wz.step,1);
render();
