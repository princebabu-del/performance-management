/* ===== Cycle detail › Settings tab, rebuilt around the focused cycle editor's sections
   (Cycle Details · Reviewees · Reviewers · Overall Rating · Additional Settings).
   Key/value rows: fixed 200px key, value 12px after it. Each section header has an Edit button that opens
   the editor (Edit Review Cycle) scrolled to that section — see 16-edit-cycle.js.
   Reads the saved editor state (c.rx, c.ctype, c.rating…); seeded cycles get an equivalent rx built from their older fields. ===== */
/* Older seeded cycles: Self → self-evaluation, Peer → peer nomination, Manager → the employee's manager
   (Crew Manager for field crews, Department Manager for office), Contributor → other foremen (Foreman).
   Questionnaires line up with c.types; weightage is split evenly. */
const CS_SEED_ROLE={field:{Manager:"Crew Manager",Contributor:"Foreman"},office:{Manager:"Department Manager",Contributor:"Project Manager"}};
function csSeedRx(c){const types=c.types||[],tpls=c.tpls||[],rev=clReviewee(c),map=CS_SEED_ROLE[/field|worker|new hire/i.test(c.aud||"")?"field":"office"];
 const x={reviewee:rev==="—"?"":rev,revs:[],self:types.includes("Self"),peers:types.includes("Peer"),peerMode:"count",peerMax:3,rows:{},fb:"",wSet:true,creds:false,reopen:c.status==="Closed",reopenWin:"period",reopenMonths:6,reopenBy:["Admin"]};
 types.forEach((t,i)=>{const k=t==="Self"?"Self":t==="Peer"?"Peers":map[t];if(!k)return;if(rxIsRole(k)&&!x.revs.includes(k))x.revs.push(k);x.rows[k]={tpl:tpls[i]}});
 const K=rxKeys(x),b=Math.floor(100/(K.length||1));let extra=100-b*K.length;K.forEach(k=>{x.rows[k].w=b+(extra-->0?1:0)});
 return x}
const csRx=c=>clRx(c)||csSeedRx(c);
/* Reopen a closed cycle: allowed when the cycle's "Reopen after end date" setting is on, the viewer's role is one of
   "Who can reopen it?", and today is inside the window (any time, or up to N months after the end date). */
const CS_ROLE_NAME={admin:"Admin",hr:"HR Manager"};
function cycReopenUntil(c){const x=csRx(c),e=cycDates(c)[1];if(!x.reopen||!e)return null;if(x.reopenWin==="any")return"any";
 const d=new Date(e+"T12:00:00");d.setMonth(d.getMonth()+(+x.reopenMonths||0));return d.toISOString().slice(0,10)}
function cycCanReopen(c){if(!c||c.status!=="Closed")return false;const x=csRx(c),until=cycReopenUntil(c);
 if(!until||!(x.reopenBy||[]).includes(CS_ROLE_NAME[S.role||"admin"]))return false;
 return until==="any"||toISO(TODAY)<=until}
function cycReopen(cid){const c=C(cid);if(!cycCanReopen(c))return;const until=cycReopenUntil(c);
 reasonModal({title:`Reopen ${c.name}`,desc:`Reviewers can open and edit their reviews again. Employees aren't notified until results are re-shared.${until==="any"?"":` You can reopen this cycle until ${isoMDY(until)}.`}`,confirm:"Reopen cycle",
  onOk:r=>{c.status="Active";c.reopened={on:TODAY,reason:r};closeModal();render(true);toast(`${c.name} reopened.`,()=>{c.status="Closed";delete c.reopened;render(true)})}})}
/* Notes reused from the editor so Overview says exactly what the person saw while creating the cycle:
   Repeats → fcRepeatInfo (13-focused-cycle-editor.js) · Rating System → the "What employees see" scale from rxRating (14-reviewee-reviewers.js). */
/* Repeats → "View Cycles" link under the value; it opens a centered dialog listing this cycle and the next four
   (5 in all), then "and so on". Dates come from the editor's own helpers (fcAddMonths / fcRange in 13-focused-cycle-editor.js). */
const csOrd=n=>n+(["th","st","nd","rd"][(n%100-20)%10]||["th","st","nd","rd"][n%100]||"th");
function csRuns(c,count){const n=(typeof FC_STEP==="object"&&FC_STEP[clRepeats(c)])||0,[s,e]=cycDates(c);if(!n||!s||!e)return[];
 return [...Array(count)].map((_,k)=>[fcAddMonths(s,n*k),fcAddMonths(e,n*k)])}
function csRepeatLink(c){return csRuns(c,2).length?`<button type="button" class="cs-link" onclick="csCyclesDlg('${c.id}')">View Cycles</button>`:""}
function csCyclesDlg(cid){const c=C(cid),runs=csRuns(c,5);if(!runs.length)return;const [,e]=cycDates(c),overlap=runs[1][0]<=e;
 openModal(`<div class="cs-dlg"><h3 id="csDlgT">Repeating cycles</h3><p class="cs-dlg-sub">${esc(c.name)} repeats ${esc(clRepeats(c).toLowerCase())} with the same setup.</p>
  <div class="cs-cycles${overlap?" is-overlap":""}"><ol>${runs.map((r,k)=>`<li><span>${csOrd(k+1)} cycle:</span> ${fcRange(...r)}</li>`).join("")}<li class="cs-cycles-more">and so on</li></ol>
  ${overlap?`<p class="cs-cycles-warn">Each cycle starts before the previous one ends, so they overlap.</p>`:""}</div>
  <div class="mf"><button type="button" class="btn" id="csDlgClose" onclick="closeModal()">Close</button></div></div>`,440);
 const d=document.querySelector("#layer .modal");if(d)d.setAttribute("aria-labelledby","csDlgT");const b=document.getElementById("csDlgClose");if(b)b.focus()}
/* Rating scale, shared by Overview › Overall Rating and the New / Edit Review Cycle editor:
   one level per line, highest first: colored number badge (or gold stars) + level name. Plain list, no tags or banner. */
const CS_NO_RATING="No overall rating for this cycle. Reviewers only answer the questionnaire, and employees see the written feedback without a score.";
function csScale(key){
 if(key==="No rating")return `<div class="cs-scale"><span class="cs-scale-none">${CS_NO_RATING}</span></div>`;
 const star=key==="Stars",badge=i=>star?`<span class="cs-stars" aria-label="${i+1} of 5 stars">${[0,1,2,3,4].map(j=>`<span class="${j<=i?"on":""}" aria-hidden="true">${j<=i?"★":"☆"}</span>`).join("")}</span>`:`<span class="rx-num n${i+1}">${i+1}</span>`;
 const lv=((star&&D.settings.starLevels)||D.settings.levels).map((l,i)=>[l,i]).reverse();
 return `<ul class="cs-scale">${lv.map(([l,i])=>`<li class="cs-lvl">${badge(i)}<span>${esc(l)}</span></li>`).join("")}</ul>`}
const csRatingKey=r=>r==="Stars"?"Stars":/^(No rating|Written answers only)$/.test(r||"")?"No rating":"Numeric 1–5 with definitions";
const csRatingNote=c=>csScale(csRatingKey(c.rating||(c.wz||{}).rating||""));
/* editor › Overall Rating: same card, with the scale row in place of the blue "What employees see" banner */
rxRating=function(w){if(!RX_FMTS.some(f=>f.k===w.rating))w.rating="Numeric 1–5 with definitions";
 return `<section class="fc-card">${rxHd("Overall Rating","One overall rating format for everyone in this cycle, or no overall rating. Questionnaires can still ask their own questions.")}
  <div class="fc-form"><div class="fc-field"><div class="fc-lbl"><label for="rxFmt">Rating format</label></div>
   <select class="fc-inp fc-sel" id="rxFmt" onchange="W().rating=this.value;render()">${RX_FMTS.map(o=>`<option value="${o.k}" ${o.k===w.rating?"selected":""}>${RX_FMT_LBL[o.k]||o.n}</option>`).join("")}</select>
  </div></div>
  ${w.rating==="No rating"?banner("info",`<b>No overall rating for this cycle.</b> Reviewers only answer the questionnaire, and employees see the written feedback without a score. Questionnaires can still ask their own rating questions.`):csScale(w.rating)}</section>`};
/* a row is {k, v} (plain text, escaped here) or {k, html}; note = HTML shown under the value */
const csRow=(k,v,note)=>({k,v,note});
function csSections(c){const x=csRx(c),type=clType(c),rev=clReviewee(c),rep=clRepeats(c),per=clPeriod(c);
 const details=[csRow("Cycle Name",c.name),csRow("Cycle Type",type)];
 if(type==="General Review")details.push(csRow("Cycle Period",per==="—"?c.period:per),csRow("Repeats",rep==="—"?"":rep,csRepeatLink(c)));
 if(type!=="General Review")details.push(csRow("Review Schedule",clProbSched(c)));
 details.push({k:"Status",html:pill(c.status==="Paused"?"Paused":c.status)},{k:"Additional Notes",html:cdDescBlock(c)});
 const peerTxt=!x.peers?"Not allowed":`${x.peerMode==="any"?"Unlimited peers":`Up to ${x.peerMax||3} peers`}, approved by their manager`;
 const reopen=!x.reopen?"Not allowed":`${x.reopenWin==="any"?"Any time after the end date":`Up to ${x.reopenMonths} month${x.reopenMonths>1?"s":""} after the end date`} · ${(x.reopenBy||[]).join(", ")||"Admin"}`;
 return [
  ["Cycle Details",details],
  ["Reviewees",[csRow("Who is reviewed",rev),...(type==="Project Completion Review"?[csRow("Projects",clProjects(c))]:[]),{k:"Self-evaluation",html:x.self?`Allowed<div class="cs-sub">Edits after submission: ${x.selfEdit&&x.selfEdit.on?"allowed until its due date, or the cycle end date if there's no due date":"not allowed"}</div>`:"Not allowed"},csRow("Peer nomination",peerTxt),{k:"Auto Assign",html:csAutoAssign(x,rev)}]],
  ["Reviewers",csReviewerRows(c,x)],
  ["Overall Rating",[{k:"Rating System",html:csRatingNote(c)}]],
  ["Additional Settings",[csRow("Include credentials",x.creds?"Shown on the review":"Not included"),csRow("Reopen after end date",reopen)]]]}
/* Reviewers: everything set in the editor's reviewer table, per reviewer —
   Reviewers (role names) · Weightage (donut + legend on the right) · Questionnaire (each questionnaire with a View eye → side drawer, reviewers using it below) · View Reviewee's evaluation · Reviewee sees reviews from (Anonymous in brackets) · Edits after submission. */
function csDueText(c,r){r={...r};rxDueMig(r);if(r.dueN===""||r.dueN==null)return"No due date";const n=+r.dueN,d=`${n} day${n===1?"":"s"}`;
 if(r.dueRef!=="end")return `Due ${d} after assignment`;const e=cycDates(c)[1];if(!e)return `Due ${d} before the end date`;
 const t=new Date(e+"T12:00:00");t.setDate(t.getDate()-n);return `Due ${d} before the end date (${isoMDY(t.toISOString().slice(0,10))})`}
function csReviewerRows(c,x){const K=rxKeys(x);if(!K.length)return[];
 const R=K.map(k=>({k,n:rxName(k),r:rxRow(x,k)})),others=R.filter(o=>o.k!=="Self"),list=a=>a.length?esc(a.join(", ")):CS_EMPTY;
 /* Weightage: donut (a segment per reviewer, fixed palette order, total in the centre) with the legend on the right */
 const CS_SERIES=["#2a78d6","#eb6834","#1baf7a","#eda100","#e87ba4","#008300","#6250d6","#e34948"];
 const W=R.map(({n,r},i)=>({n,w:Math.max(0,Math.min(100,+r.w||0)),col:CS_SERIES[i%CS_SERIES.length]})),tot=W.reduce((a,o)=>a+o.w,0);
 const RAD=52,CIRC=2*Math.PI*RAD,GAP=W.filter(o=>o.w>0).length>1?2:0;let off=0;
 const segs=W.filter(o=>o.w>0).map(o=>{const len=CIRC*o.w/Math.max(tot,100),seg=`<circle class="cs-wt-seg" cx="64" cy="64" r="${RAD}" stroke="${o.col}" stroke-dasharray="${Math.max(len-GAP,.5)} ${CIRC}" stroke-dashoffset="${-off}"><title>${esc(o.n)}: ${o.w}%</title></circle>`;off+=len;return seg}).join("");
 const weight=`<div class="cs-wt"><div class="cs-wt-donut"><svg viewBox="0 0 128 128" role="img" aria-label="Weightage: ${esc(W.map(o=>`${o.n} ${o.w}%`).join(", "))}"><circle class="cs-wt-track" cx="64" cy="64" r="${RAD}"/><g transform="rotate(-90 64 64)">${segs}</g></svg><span class="cs-wt-tot">${tot}%</span></div>
  <ul class="cs-wt-leg" style="--rows:${Math.min(W.length,5)}">${W.map(o=>`<li><span class="cs-wt-dot" style="background:${o.col}" aria-hidden="true"></span><span class="cs-wt-n">${esc(o.n)}</span><span class="cs-wt-v">${o.w}%</span></li>`).join("")}</ul></div>`;
 /* Questionnaire: each questionnaire once (eye opens it in the side drawer), the reviewers using it underneath */
 const tpls=[];R.forEach(({n,r})=>{const id=r.tpl||"";let g=tpls.find(g=>g.id===id);if(!g)tpls.push(g={id,t:T(id),who:[]});g.who.push(n)});
 const qs=`<div class="cs-qs">${tpls.map(g=>`<div class="cs-q"><div class="cs-q-n">${g.t?`${esc(g.t.name)}<span class="rx-tip cs-q-tip"><button type="button" class="cs-rv-eye" aria-label="View questionnaire ${esc(g.t.name)}" onclick="previewTpl('${g.t.id}')">${ic("eye")}</button><span class="rx-tip-box" role="tooltip">View Questionnaire</span></span>`:"No questionnaire"}</div><div class="cs-q-who">${esc(g.who.join(", "))}</div></div>`).join("")}</div>`;
 const rows=[{k:"Reviewers",html:`<ul class="cs-chips">${R.map(o=>`<li class="cs-chip">${esc(o.n)}</li>`).join("")}</ul>`},{k:"Weightage (%)",html:weight},{k:"Questionnaire",html:qs}];
 if(others.length){
  if(x.self)rows.push({k:"View Reviewee's evaluation",html:list(others.filter(o=>o.r.seeSelf).map(o=>o.n))});
  rows.push({k:"Reviewee sees reviews from",html:list(others.filter(o=>o.r.revSees).map(o=>o.n+(o.r.anon?" (Anonymous)":"")))});
  rows.push(csRow("Edits after submission",x.revEdit&&x.revEdit.on?"Allowed until the due date, or the cycle end date if there's no due date":"Not allowed"))}
 return rows}
/* anything not configured shows an em dash */
const CS_EMPTY=`<span class="cs-empty" aria-label="Not set">—</span>`;
/* Auto Assign: "—" when off; otherwise who's added — all of the reviewed role, or each category with its values, one per line — then exclusions */
function csAutoAssign(x,rev){const a=x.auto;if(!a||!a.on)return"";const role=rev==="—"?"employees":rev.toLowerCase()+"s";
 const groups=a.mode==="groups"?(a.groups||[]).filter(g=>g.by&&g.vals&&g.vals.length):[];
 const ex=(a.excl||[]).map(id=>(E(id)||{}).name).filter(Boolean);
 const line=(k,v)=>`<div class="cs-aa"><span class="cs-aa-k">${esc(k)}:</span> <span>${esc(v)}</span></div>`;
 return `<div class="cs-aa-list">${a.mode==="groups"?(groups.length?groups.map(g=>line((AA_CAT[g.by]||{one:g.by}).one,g.vals.join(", "))).join(""):CS_EMPTY):`<div>All ${esc(role)}</div>`}
  ${ex.length?line("Excluded",ex.join(", ")):""}</div>`}
/* Bento layout: two independent columns with a 16px gap both ways, so cards never leave holes whatever their height.
   All five sections alternate left/right in editor order (Cycle Details | Reviewees, Reviewers | Overall Rating, Additional Settings).
   Edit buttons open the editor at that section. */
cycSettings=function(c){
 const ro=["Closed","Archived"].includes(c.status),cols=[[],[]];
 csSections(c).forEach(([title,rows],i)=>{
  cols[i%2].push(`<section class="card cs-card" style="--o:${i}"><div class="hd"><h3>${title}</h3>${ro?"":`<button type="button" class="btn ghost s cs-edit" aria-label="Edit ${title.toLowerCase()}" onclick="cycEdit('${c.id}',${i})">${ic("edit","s")} Edit</button>`}</div>
  <div class="cs-kv-list">${rows.length?rows.map(r=>`<div class="cs-kv"><div class="cs-kv-k">${esc(r.k)}</div><div class="cs-kv-v">${r.html!==undefined?(r.html||CS_EMPTY):(r.v==null||r.v===""||r.v==="—"?CS_EMPTY:esc(r.v))}${r.note?`<div class="cs-kv-note">${r.note}</div>`:""}</div></div>`).join("")
   :`<div class="cs-kv"><div class="cs-kv-k">${esc(title)}</div><div class="cs-kv-v">${CS_EMPTY}</div></div>`}</div></section>`)});
 return `<div class="cs-bento">${cols.map(x=>`<div class="cs-col">${x.join("")}</div>`).join("")}</div>`};
render();
