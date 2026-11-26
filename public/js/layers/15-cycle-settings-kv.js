/* ===== Cycle detail › Settings tab, rebuilt around the focused cycle editor's sections
   (Cycle Details · Reviewee · Reviewers · Overall Rating · Auto-assign).
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
 const star=key==="Stars",badge=i=>star?`<span class="cs-stars" aria-label="${i+1} of 5 stars">${[0,1,2,3,4].map(j=>`<span class="${j<=i?"on":""}" aria-hidden="true">${j<=i?"★":"☆"}</span>`).join("")}</span>`:`<span class="rating-badge n${i+1}">${i+1}</span>`;
 const lv=((star&&D.settings.starLevels)||D.settings.levels).map((l,i)=>[l,i]).reverse();
 return `<ul class="cs-scale">${lv.map(([l,i])=>`<li class="cs-lvl">${badge(i)}<span>${esc(l)}</span></li>`).join("")}</ul>`}
const csRatingKey=r=>r==="Stars"?"Stars":/^(No rating|Written answers only)$/.test(r||"")?"No rating":"Numeric 1–5 with definitions";
/* editor › Overall Rating: same card, with the scale row in place of the blue "What employees see" banner */
rxRating=function(w){if(!RX_FMTS.some(f=>f.k===w.rating))w.rating="Numeric 1–5 with definitions";
 return `<section class="section">${rxHd("Overall Rating","One overall rating format for everyone in this cycle, or no overall rating. Questionnaires can still ask their own questions.")}
  <div class="setting-list"><div class="setting">${fcQ("Rating format"+FC_REQ,{id:"rxFmtQ",d:"One rating format or no rating for this cycle.",did:"rxFmtD"})}
   ${fcSel({id:"rxFmt",value:w.rating,options:RX_FMTS.map(o=>({v:o.k,t:RX_FMT_LBL[o.k]||o.n})),ph:"Select",pick:"rxFmtPick"}).replace('aria-haspopup="listbox"','aria-haspopup="listbox" aria-describedby="rxFmtD"')}
  </div></div><!--fc-rate-->
  ${w.rating==="No rating"?banner("info",`Employees see the written feedback only, without a score.`):csScale(w.rating)}</section>`};
/* Rating format pick (same single-select dropdown as Review type / Repeats, 30-single-select.js) */
function rxFmtPick(v){if(v){W().rating=v;render()}}
/* a row is {k, v} (plain text, escaped here) or {k, html}; note = HTML shown under the value */
const csRow=(k,v,note)=>({k,v,note});
/* V2 › Overview › Evaluation & Scoring › Rating Format: the scale and how the cycle's ratings are spread across it, as one
   vertical bar chart (1 on the left … 5 on the right). Each column = one rating level: count above the bar, badge + level name
   underneath (that's the scale). Counts the overall rating of every submitted review (calibrated rating when there is one).
   Single series → one color, no legend; hover / focus a column for count and share; a screen-reader table carries the numbers. */
function csRatingDist(c,key){
 const star=key==="Stars",names=(star&&D.settings.starLevels)||D.settings.levels;
 const live=D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed"),rated=live.map(p=>p.adj||p.rating).filter(r=>r>=1&&r<=5);
 const n=[0,0,0,0,0];rated.forEach(r=>n[r-1]++);
 const tot=rated.length,max=Math.max(...n,1),pending=live.length-tot,pct=v=>tot?Math.round(v/tot*100):0;
 const badge=i=>star?`<span class="cs-stars" aria-hidden="true">${[0,1,2,3,4].map(j=>`<span class="${j<=i?"on":""}">${j<=i?"★":"☆"}</span>`).join("")}</span>`:`<span class="rating-badge n${i+1}" aria-hidden="true">${i+1}</span>`;
 const unit=v=>`${v} review${v===1?"":"s"}`;
 const cols=n.map((v,i)=>`<div class="rating-dist__col" tabindex="0" aria-label="${esc(`${i+1} · ${names[i]}: ${unit(v)}, ${pct(v)}%`)}" data-tip="${esc(`${names[i]}: ${unit(v)} (${pct(v)}%)`)}">
   <span class="rating-dist__count">${v}</span><span class="rating-dist__bar${v?"":" is-empty"}" style="height:${v?Math.max(4,Math.round(v/max*100)):0}px"></span></div>`).join("");
 const axis=n.map((v,i)=>`<li class="rating-dist__lvl">${badge(i)}<span class="rating-dist__name">${esc(names[i])}</span></li>`).join("");
 return `<figure class="rating-dist">
  <figcaption class="rating-dist__summary">${tot?`${unit(tot)} rated`:"No ratings yet. The chart fills in as reviews are submitted."}${pending&&tot?` · ${pending} not submitted yet`:""}</figcaption>
  <div class="rating-dist__plot">${cols}</div>
  <ul class="rating-dist__axis" aria-hidden="true">${axis}</ul>
  <table class="sr-only"><caption>Ratings received, by level</caption><thead><tr><th scope="col">Rating</th><th scope="col">Reviews</th><th scope="col">Share</th></tr></thead>
   <tbody>${n.map((v,i)=>`<tr><th scope="row">${i+1} · ${esc(names[i])}</th><td>${v}</td><td>${pct(v)}%</td></tr>`).join("")}</tbody></table>
 </figure>`}
/* Sections, their order and their rows follow the New / Edit Review Cycle editor (V.wizard in 14-reviewee-reviewers.js):
   Cycle Details (name · type · review schedule, or period + repeats · cycle reopening)
   · Participants (projects · who is reviewed · self-evaluation · reviewers · peer nomination · auto-assign)
   · Evaluation & Scoring (reviewer table · reviewee view final results · reviewers view self-evaluation · editing submissions · rating format)
   · Review Guidance (additional notes · credentials). */
function csSections(c){const x=csRx(c),type=clType(c),rev=clReviewee(c),rep=clRepeats(c),per=clPeriod(c),gen=type==="General Review",proj=type==="Project Completion Review";
 const peerN=x.peerMax||3,peerTxt=(!x.peers?"Not allowed":x.peerMode==="any"?"Unlimited":`${peerN} peer${peerN===1?"":"s"}`)+(x.peers&&rxV2()?(x.peerAuto?" · Auto-approved":" · Needs approval"):"");
 const reopen=!x.reopen?"Not allowed":`${x.reopenWin==="any"?"Any time after the end date":`Up to ${x.reopenMonths} month${x.reopenMonths>1?"s":""} after the end date`} · ${(x.reopenBy||[]).join(", ")||"Admin"}`;
 const visT=(L,v)=>(L.find(o=>o.v===v)||{}).t||v,K=rxKeys(x);
 const details=[csRow("Cycle Name",c.name),csRow("Review Type",type)];
 if(gen)details.push(csRow("Cycle Period",per==="—"?c.period:per),csRow("Repeats",rep==="—"?"":rep,csRepeatLink(c)),csRow("Cycle Reopening",reopen));
 else details.push(csRow("Review Schedule",clProbSched(c)));
 const people=[...(proj?[csRow("Projects",clProjects(c))]:[]),csRow("Who is reviewed",rev),csRow("Self-evaluation",x.self?"Allowed":"Not allowed"),
  csRow("Reviewers",K.map(rxName).join(", "))];
 if(!proj)people.push(csRow("Peer nomination",peerTxt),{k:"Auto-assign",html:csAutoAssign(x,rev)||"Off"});
 const evals=csReviewerRows(c,x);
 evals.push(csRow(rxResultsLbl(),visT(rxResultsOpts(),x.results||D.settings.results)));
 if(x.self)evals.push(csRow("Reviewers view self-evaluation",visT(rxSelfVisOpts(),rxSelfVisVal({selfVis:x.selfVis||D.settings.selfVis}))));
 if(K.length)evals.push(csRow("Editing submissions",x.revEdit&&x.revEdit.on?"Allowed until the due date, or the cycle end date if there's no due date":"Not allowed"));
 const rk=csRatingKey(c.rating||(c.wz||{}).rating||"");   // value = the format's name (as in the editor's Rating format dropdown), its scale underneath
 evals.push(csRow("Rating Format",RX_FMT_LBL[rk]||rk,rxV2()&&rk!=="No rating"?csRatingDist(c,rk):csScale(rk)));
 const guide=[{k:"Additional Notes",html:cdDescBlock(c)},csRow("Credentials",x.creds?"Shown on the review":"Not included")];
 return [["Cycle Details",details],["Participants",people],["Evaluation & Scoring",evals],["Review Guidance",guide]]}
/* Evaluation & Scoring: everything set in the editor's reviewer table, per reviewer —
   Weightage (stacked bar + legend below) · Questionnaire (each questionnaire with a View eye → side drawer, reviewers using it below) · View Self-Evaluation · Visible to Reviewee (Anonymous in brackets) · Edits after submission. */
function csDueText(c,r){r={...r};rxDueMig(r);if(r.dueN===""||r.dueN==null)return"No due date";const n=+r.dueN,d=`${n} day${n===1?"":"s"}`;
 if(r.dueRef!=="end")return `Due ${d} after assignment`;const e=cycDates(c)[1];if(!e)return `Due ${d} before the end date`;
 const t=new Date(e+"T12:00:00");t.setDate(t.getDate()-n);return `Due ${d} before the end date (${isoMDY(t.toISOString().slice(0,10))})`}
function csReviewerRows(c,x){const K=rxKeys(x);if(!K.length)return[];
 const R=K.map(k=>({k,n:rxName(k),r:rxRow(x,k)})),others=R.filter(o=>o.k!=="Self"),list=a=>a.length?esc(a.join(", ")):CS_EMPTY;
 /* Weightage: one horizontal stacked bar (a segment per reviewer, fixed palette order, width = its %; hover a segment for its tooltip)
    with the legend below it (dot · reviewer · %) */
 const CS_SERIES=["#2a78d6","#eb6834","#1baf7a","#eda100","#e87ba4","#008300","#6250d6","#e34948"];
 const W=R.map(({n,r},i)=>({n,w:Math.max(0,Math.min(100,+r.w||0)),col:CS_SERIES[i%CS_SERIES.length]})),tot=W.reduce((a,o)=>a+o.w,0);
 const bar=W.filter(o=>o.w>0).map(o=>`<span class="cs-wt-seg" style="flex:${o.w} 1 0;background:${o.col}" data-tip="${esc(o.n)}: ${o.w}%"></span>`).join("");
 const weight=`<div class="cs-wt"><div class="cs-wt-bar" role="img" aria-label="Weightage: ${esc(W.map(o=>`${o.n} ${o.w}%`).join(", "))}, total ${tot}%">${bar}${tot<100?`<span class="cs-wt-rest" style="flex:${100-tot} 1 0"></span>`:""}</div>
  <ul class="cs-wt-leg">${W.map(o=>`<li><span class="cs-wt-dot" style="background:${o.col}" aria-hidden="true"></span><span class="cs-wt-n">${esc(o.n)}</span><span class="cs-wt-v">${o.w}%</span></li>`).join("")}</ul></div>`;
 /* Questionnaire: each questionnaire once (eye opens it in the side drawer), the reviewers using it underneath */
 const tpls=[];R.forEach(({n,r})=>{const id=r.tpl||"";let g=tpls.find(g=>g.id===id);if(!g)tpls.push(g={id,t:T(id),who:[]});g.who.push(n)});
 const qs=`<div class="cs-qs">${tpls.map(g=>`<div><div class="cs-q-n">${g.t?`${esc(g.t.name)}<span class="hint cs-q-tip"><button type="button" class="cs-rv-eye" aria-label="View questionnaire ${esc(g.t.name)}" onclick="previewTpl('${g.t.id}')">${ic("eye")}</button><span class="hint__box" role="tooltip">View Questionnaire</span></span>`:"No questionnaire"}</div><div class="cs-q-who">${esc(g.who.join(", "))}</div></div>`).join("")}</div>`;
 const rows=[{k:"Weightage (%)",html:weight},{k:"Questionnaire",html:qs}];
 if(others.length){
  if(x.self)rows.push({k:"View Self-Evaluation",tip:"Reviewers can view the reviewee's self-evaluation",html:list(others.filter(o=>o.r.seeSelf).map(o=>o.n))});
  if(rxV2())rows.push({k:"Anonymous",tip:"The reviewee sees these reviews without the reviewer's name",html:list(others.filter(o=>o.r.anon).map(o=>o.n))});
  else rows.push({k:"Visible to Reviewee",tip:"The reviewee can view this reviewer's review",html:list(others.filter(o=>o.r.revSees).map(o=>o.n+(o.r.anon?" (Anonymous)":"")))});}
 return rows}
/* key info icon: outline 16px info circle (tertiary) beside the key, 4px gap; hover/focus shows the same tooltip as the
   matching reviewer-table column header (shared data-tip tooltip) */
const CS_INFO=t=>`<span class="cs-kv-info" tabindex="0" role="img" aria-label="${esc(t)}" data-tip="${esc(t)}"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 10.67V8M8 5.33h.007M14.67 8A6.67 6.67 0 1 1 1.33 8a6.67 6.67 0 0 1 13.34 0Z" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
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
   The four sections alternate left/right in editor order (Cycle Details | Participants, Evaluation & Scoring | Review Guidance).
   Edit buttons open the editor at that section. */
/* Edit icon: Untitled UI edit-02, 20px (Figma "Exploration – Lumber Web App" 797:34489); stroke follows the button's text color */
const CS_EDIT_ICO='<svg class="cs-edit-i" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 10 14 6M2.5 21.5l3.384-.376c.414-.046.62-.069.814-.131.171-.056.334-.134.485-.233.17-.112.316-.259.61-.553L21 7a2.828 2.828 0 1 0-4-4L3.794 16.206c-.294.294-.442.442-.553.611a2 2 0 0 0-.233.485c-.063.193-.086.4-.132.814L2.5 21.5Z"/></svg>';
cycSettings=function(c){
 const ro=["Closed","Archived"].includes(c.status),cols=[[],[]];
 csSections(c).forEach(([title,rows],i)=>{
  cols[i%2].push(`<section class="card cs-card" style="--o:${i}"><div class="hd"><h3>${title}</h3>${ro?"":`<button type="button" class="cs-edit" aria-label="Edit ${title.toLowerCase()}" data-tip="Edit" onclick="cycEdit('${c.id}',${i})">${CS_EDIT_ICO}</button>`}</div>
  <div class="cs-kv-list">${rows.length?rows.map(r=>`<div class="cs-kv"><div class="cs-kv-k">${esc(r.k)}${r.tip?CS_INFO(r.tip):""}</div><div class="cs-kv-v">${r.html!==undefined?(r.html||CS_EMPTY):(r.v==null||r.v===""||r.v==="—"?CS_EMPTY:esc(r.v))}${r.note?`<div class="cs-kv-note">${r.note}</div>`:""}</div></div>`).join("")
   :`<div class="cs-kv"><div class="cs-kv-k">${esc(title)}</div><div class="cs-kv-v">${CS_EMPTY}</div></div>`}</div></section>`)});
 return `<div class="cs-bento">${cols.map(x=>`<div class="cs-col">${x.join("")}</div>`).join("")}</div>`};
render();
