/* ===== Add / Edit Questionnaire: full-page editor laid out like LMS course creation
   (Figma LMS 1:17984 page · 1:19383 settings panel · 1129:14348 Question Settings + panel header). Styles: src/styles/29-questionnaire-editor.css
   Top bar: same as New Review Cycle (fcHeader) — Exit | questionnaire name · Edit / Preview · Save as Draft · Publish.
   Left: grey canvas with one white sheet (name, type, length note, then each section's question cards, "Add Question" under each section, "Add Section" at the end).
   Right: 560px settings panel. Nothing selected → Questionnaire Settings; a question selected → Question Settings (← back, × close).
   Canvas toolbar: English · Español · Both segmented control (S.bld.lang EN / ES / BOTH). Spanish is typed by hand or filled by "Translate with AI";
   AI text is flagged (obj.ai = {es, hes}) with an "AI translation · Check" tag until it's edited or marked checked, and Publish asks for a check first.
   Questions reorder by dragging the grip (or Move Up / Move Down); standard sections are added from the canvas, under Add Section.
   Preview (header Edit / Preview, S.bld.preview): no settings panel and a read-only sheet — no inline editing, selecting, moving or adding.
   S.bld.sel = [section, question] or null · S.bld.add = section index whose "Add Question" menu is open · S.bld.panel = false hides the panel. ===== */

/* answer types: short description + 24px stroke icon, used by the Add Question menu and the Question Settings type row */
const QE_TYPES={
 "Numeric scale":["Rate from 1 to 5",'<path d="M4 20V14M10 20V9M16 20V4"/><path d="M20 20H2"/>'],
 "Star rating":["1 to 5 stars",'<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>'],
 "Named-level scale":["Below, Meets, Exceeds",'<rect x="3" y="8" width="5" height="8" rx="1.5"/><rect x="9.5" y="8" width="5" height="8" rx="1.5"/><rect x="16" y="8" width="5" height="8" rx="1.5"/>'],
 "Short text":["One-line answer",'<path d="M4 7V5h16v2M12 5v14M9 19h6"/>'],
 "Paragraph":["Longer written answer",'<path d="M4 6h16M4 10h16M4 14h16M4 18h10"/>'],
 "Number":["A number, like hours or a count",'<path d="M9 4L7 20M17 4l-2 16M4 9h16M3 15h16"/>'],
 "Single select":["Pick one option",'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/>'],
 "Multi-select":["Pick one or more options",'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12l3 3 5-6"/>'],
 "Date":["A calendar date",'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'],
 "Checkbox":["Yes or no confirmation",'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12l3 3 5-6"/>'],
 "E-signature":["Sign to confirm the answers",'<path d="M3 17c3-1 4-9 6-9s0 9 2 9 2-4 4-4 1 3 3 3 2-1 3-1"/><path d="M3 21h18"/>'],
 "Attachment":["Upload a file or photo",'<path d="M21 11.5l-8.6 8.6a5 5 0 01-7.1-7.1l8.6-8.6a3.3 3.3 0 014.7 4.7l-8.6 8.6a1.7 1.7 0 01-2.4-2.4l7.9-7.9"/>']};
const qeIcon=type=>`<svg class="featured-icon__svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(QE_TYPES[type]||QE_TYPES["Short text"])[1]}</svg>`;
const qeFeatured=type=>`<span class="featured-icon" aria-hidden="true">${qeIcon(type)}</span>`;
const QE_STANDARD=["Safety","Quality and rework","Attendance and reliability","Leadership"];
const QE_REQ=`<span class="required-mark" aria-hidden="true">*</span>`;
const qeSel=()=>{const s=S.bld&&S.bld.sel;if(!s)return null;const t=bT(),sec=t&&t.sections[s[0]],q=sec&&sec.qs[s[1]];return q?{si:s[0],qi:s[1],sec,q}:null};
const qeNewQ=type=>({t:"New question",es:"",type,req:true,help:"",hes:"",cond:"Everyone",low:false,data:"",o:/select/i.test(type)?[["Option 1",""],["Option 2",""]]:null});

/* ---- top bar: the New Review Cycle header (fcHeader, 14-reviewee-reviewers.js · 23-cycle-header.css) plus the Edit / Preview segmented control (button-group component) ---- */
function qeHeader(t){
 return `<header class="editor__header">
  <div class="editor__heading"><button type="button" class="lb-btn lb-btn--link-gray editor__exit" onclick="qeExit()"><span class="lb-btn__icon lb-btn__icon--close" aria-hidden="true"></span><span class="lb-btn__label">Exit</span></button><span class="editor__divider" aria-hidden="true"></span><h1 class="editor__title" id="qeTitle">${esc(t.name||"Untitled questionnaire")}</h1></div>
  <div class="editor__actions">${btnGroup([{id:"Edit",label:"Edit"},{id:"Preview",label:"Preview"}],{active:S.bld.preview?"Preview":"Edit",label:"Editor mode",variant:"segmented",onSelect:id=>`qeMode(${id==="Preview"})`})}
   <button type="button" class="lb-btn lb-btn--secondary editor__save" onclick="bSave()">Save as Draft</button>
   <button type="button" class="lb-btn lb-btn--primary" onclick="bPublish()">${t.status==="Active"?"Publish Changes":"Publish"}</button></div>
 </header>`}
function qeExit(){S.bld.add=null;if(S.returnTo==="wizard"){S.returnTo=null;nav("wizard")}else nav("templates")}

/* ---- canvas: the questionnaire sheet ---- */
function qeLength(t,n,m){const field=/Field|New hires/.test(t.aud);
 const txt=`<b>${n} questions · ~${m} min.</b> ${field?(n>15?"Long for a field form. We recommend 10–15 questions so crews finish in about 3–5 minutes.":"Good length for crews (10–15 recommended)."):"Office forms can be longer."}`;
 return banner(field&&n>15?"warning":"info",txt)}
function qeSheet(t,n,m){const live=t.used.filter(c=>C(c)&&["Active","Scheduled"].includes(C(c).status));
 /* numbering restarts at 1 in each section, so a move only renumbers the sections involved */
 const lang=S.bld.lang,pv=!!S.bld.preview,std=QE_STANDARD.filter(x=>!t.sections.some(s=>s.n===x)),ai=qeAiCount(t),missing=t.sections.reduce((a,s)=>a+s.qs.filter(q=>!q.es).length,0);
 return `<article class="questionnaire-sheet">
  <header class="questionnaire-sheet__header">
   <h2 class="questionnaire-sheet__title" id="qeSheetTitle">${esc(t.name||"Untitled questionnaire")}</h2>
   <p class="questionnaire-sheet__description" id="qeSheetDesc">${esc(t.desc||"")}</p>
   <div class="questionnaire-sheet__meta">${pill(t.status)}${live.length?`<span class="pill a">In use by ${live.length} live cycle${live.length>1?"s":""}</span>`:""}</div>
   ${qeLength(t,n,m)}
   ${ai?banner("warning",`<b>${ai} Spanish text${ai>1?"s were":" was"} translated by AI.</b> Check each one before publishing. Select a question to edit its translation or mark it checked.`):""}
   ${lang!=="EN"&&missing?banner("warning",`${missing} question${missing>1?"s":""} still need Spanish text. Spanish speakers see English for those.`):""}
  </header>
  ${t.sections.map((s,si)=>`<section class="question-section" id="qeSec${si}" aria-label="${esc(s.n)}">
   <div class="question-section__header">
    ${qeSecName(s,si,pv,lang)}
    <span class="question-section__count">${s.qs.length} question${s.qs.length===1?"":"s"}</span>
    ${!pv&&t.sections.length>1?`<button type="button" class="icon-button icon-button--danger" aria-label="Delete module ${esc(s.n)}" data-tip="Delete Module" onclick="qeDelSection(${si})">${ic("trash")}</button>`:""}
   </div>
   ${lang==="BOTH"?qeSecNameEs(s,si,pv):""}
   <div class="question-section__list" data-si="${si}">${s.qs.map((q,qi)=>qeCard(q,si,qi,qi+1,s.qs.length)).join("")}</div>
   ${pv?"":qeAddQ(si)}
  </section>`).join("")}
  ${pv?"":`<div class="divider-action"><button type="button" class="divider-action__button" onclick="qeAddSection()"><img src="/assets/plus-gray-20.svg" width="20" height="20" alt="">Add Module</button></div>
  ${std.length?`<div class="standard-sections"><span class="standard-sections__label">Standard modules</span><div class="chip-buttons">${std.map(x=>`<button type="button" class="button button--small button--with-icon" onclick="qeAddStandard('${x}')"><img src="/assets/plus-gray-20.svg" width="20" height="20" alt="">${x}</button>`).join("")}</div></div>`:""}`}
 </article>`}
/* section name: EN edits s.n, ES edits s.es (typing clears the AI flag); Both shows English here and Spanish on the line below (qeSecNameEs) */
function qeSecName(s,si,pv,lang){const es=lang==="ES",v=es?s.es||"":s.n,aiTag=es&&s.ai&&s.ai.es?QE_AI_TAG:"";
 if(pv)return `<h3 class="question-section__name question-section__name--static">${es&&!v?`<span class="question-card__missing">Needs Spanish · ${esc(s.n)}</span>`:esc(v)}${aiTag}</h3>`;
 return `<input class="question-section__name" value="${esc(v)}" ${es?`placeholder="Spanish name for ${esc(s.n)}"`:""} aria-label="Module name${es?" in Spanish":""}" oninput="${es?`qeSecEs(${si},this.value)`:`bT().sections[${si}].n=this.value;qeSecRow(${si},this.value)`}">${aiTag}`}
function qeSecNameEs(s,si,pv){const aiTag=s.ai&&s.ai.es?QE_AI_TAG:"";
 if(pv)return `<p class="question-section__translation"><span class="lang-tag">ES</span>${s.es?esc(s.es):`<span class="question-card__missing">No Spanish name yet</span>`}${aiTag}</p>`;
 return `<div class="question-section__translation"><span class="lang-tag">ES</span><input class="question-section__name question-section__name--translation" value="${esc(s.es||"")}" placeholder="Spanish module name" aria-label="Module name in Spanish" oninput="qeSecEs(${si},this.value)">${aiTag}</div>`}
/* "Add Question" on the section's bottom rule; opens the answer-type menu (Figma "Add Module" + Resource Link / Document menu) */
function qeAddQ(si){const open=S.bld.add===si;
 return `<div class="divider-action">
  <button type="button" class="divider-action__button" aria-haspopup="menu" aria-expanded="${open}" onclick="qeToggleAdd(${si})"><img src="/assets/plus-gray-20.svg" width="20" height="20" alt="">Add Question</button>
  ${open?`<div class="type-menu" role="menu" aria-label="Answer type">${QT.map(x=>`<button type="button" role="menuitem" class="type-menu__item" onclick="qeAddQuestion(${si},'${x}')">${qeFeatured(x)}<span class="type-menu__text"><span class="type-menu__title">${x}</span><span class="type-menu__description">${(QE_TYPES[x]||[""])[0]}</span></span></button>`).join("")}</div>`:""}
 </div>`}
function qeCard(q,si,qi,num,count){
 const pv=!!S.bld.preview,on=!pv&&!!(S.bld.sel&&S.bld.sel[0]===si&&S.bld.sel[1]===qi),lang=S.bld.lang,es=lang==="ES",both=lang==="BOTH";
 const txt=es?(q.es?esc(q.es):`<span class="question-card__missing">Needs Spanish · ${esc(q.t)}</span>`):esc(q.t);
 const help=es&&q.hes?q.hes:q.help;
 const esLine=(v,id,none)=>`<p class="question-card__translation"><span class="lang-tag">ES</span><span ${id?`id="${id}"`:""}>${v?esc(v):`<span class="question-card__missing">${none}</span>`}</span></p>`;
 const trans=both?esLine(q.es,`qtes${si}_${qi}`,"No Spanish text yet")+(q.help?esLine(q.hes,"","No Spanish help text yet"):""):"";
 const aiTag=lang!=="EN"&&q.ai&&(q.ai.es||q.ai.hes)?`<span class="tag tag--ai">AI translation · Check</span>`:"";
 const body=/scale/i.test(q.type)&&q.type!=="Named-level scale"?`<div class="scale">${[1,2,3,4,5].map(n=>`<span title="${lvl(n-1,es?"ES":"EN")}">${n}<small>${lvl(n-1,es?"ES":"EN").split(" ")[0]}</small></span>`).join("")}</div>`
  :q.type==="Named-level scale"?`<div class="scale">${["Below","Meets","Exceeds"].map(s=>`<span>${s}</span>`).join("")}</div>`
  :q.type==="Star rating"?`<div class="scale">${"★★★★★".split("").map(s=>`<span>${s}</span>`).join("")}</div>`
  :q.o?`<div class="ochips">${q.o.map(o=>`<span>${q.type==="Multi-select"?"☐":"○"} ${esc(es&&o[1]?o[1]:o[0])}${both&&o[1]?` / ${esc(o[1])}`:""}</span>`).join("")}</div>`
  :q.type==="Paragraph"?`<div class="finp ta question-card__field question-card__field--tall"></div>`
  :q.type==="E-signature"?`<div class="sigbox question-card__gap">Sign here</div>`
  :q.type==="Checkbox"?`<label class="check-option question-card__gap"><input class="checkbox sm" type="checkbox" disabled><span class="check-option__title">Yes</span></label>`
  :`<div class="finp question-card__field ${q.type==="Number"||q.type==="Date"?"question-card__field--short":""}">${q.type==="Date"?'<span class="dim">MM/DD/YYYY</span>':q.type==="Attachment"?'<span class="dim">Upload a file or photo</span>':""}</div>`;
 /* card actions behind a kebab (shared .kebab / S.menu / toggleMenu — outside click and Escape close it); items stop the click so the card isn't selected */
 const menuId=`qe-q-${si}-${qi}`,open=S.menu===menuId;
 const mi=(icon,label,js,cls="")=>`<button type="button" role="menuitem" class="action-menu__item${cls}" onclick="event.stopPropagation();S.menu=null;${js}">${icon}${label}</button>`;
 const arrow=d=>`<svg class="action-menu__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
 const mask=f=>`<span class="action-menu__icon action-menu__icon--mask" style="--icon:url(/assets/icons/${f})" aria-hidden="true"></span>`;
 const kebab=`<div class="question-card__actions kebab"><button type="button" class="icon-button" aria-label="Question actions" aria-haspopup="menu" aria-expanded="${open}" data-tip="More Options" onclick="toggleMenu('${menuId}',event)"><img src="/assets/icons/dots-vertical.svg" width="20" height="20" alt=""></button>${open?`<div class="action-menu question-menu" role="menu" aria-label="Question actions">${[
   qi>0?mi(arrow("M10 15.8V4.2M4.2 10L10 4.2l5.8 5.8"),"Move Up",`bMove(${si},${qi},-1)`):"",
   qi<count-1?mi(arrow("M10 4.2v11.6M15.8 10L10 15.8 4.2 10"),"Move Down",`bMove(${si},${qi},1)`):"",
   mi(mask("copy-03.svg"),"Duplicate",`qeDuplicate(${si},${qi})`),
   count>1?mi(mask("trash-01.svg"),"Delete",`qeDelete(${si},${qi})`," action-menu__item--danger"):""].join("")}</div>`:""}</div>`;
 if(pv)return `<div class="question-card question-card--static">${qeCardInner(q,si,qi,num,txt,help,body,"",trans,false,aiTag)}</div>`;
 return `<div class="question-card ${on?"is-selected":""}" data-si="${si}" data-qi="${qi}" role="button" tabindex="0" aria-pressed="${on}" onclick="qeSelect(${si},${qi})" onkeydown="if(event.target===this&&(event.key==='Enter'||event.key===' ')){event.preventDefault();qeSelect(${si},${qi})}">
${qeCardInner(q,si,qi,num,txt,help,body,kebab,trans,true,aiTag)}
 </div>`}
/* card contents shared by Edit (selectable, with move / duplicate / delete) and Preview (read-only, no actions) */
function qeCardInner(q,si,qi,num,txt,help,body,actions,trans,drag,aiTag){return `  <div class="question-card__header">
   ${drag?`<span class="question-card__handle" aria-hidden="true" data-tip="Drag to Reorder" onmousedown="this.closest('.question-card').draggable=true" onclick="event.stopPropagation()"><svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor"><circle cx="7.5" cy="5" r="1.4"/><circle cx="12.5" cy="5" r="1.4"/><circle cx="7.5" cy="10" r="1.4"/><circle cx="12.5" cy="10" r="1.4"/><circle cx="7.5" cy="15" r="1.4"/><circle cx="12.5" cy="15" r="1.4"/></svg></span>`:""}
   <span class="question-card__number">${num}</span>
   <div class="question-card__text"><span id="qt${si}_${qi}">${txt}</span>${q.req?`<span class="req">*</span>`:""}</div>
   ${actions}
  </div>
  ${trans}
  <div class="question-card__tags"><span class="tag">${q.type}</span>${aiTag}${q.cond!=="Everyone"?`<span class="tag">Only: ${esc(q.cond)}</span>`:""}</div>
  ${help?`<p class="question-card__help">${esc(help)}</p>`:""}
  ${q.data?`<div><span class="datafield">${ic("chart","s")} Shows: ${q.data} (from Lumber)</span></div>`:""}
  ${body}
  ${q.low?`<p class="question-card__help">Comment required for ratings of 2 or lower</p>`:""}`}

/* ---- settings panel ---- */
const qeGroup=(title,body)=>`<section class="settings-panel__group"><h3 class="settings-panel__group-title">${title}</h3>${body}</section>`;
const qeField=(label,id,control,hint)=>`<div class="field"><label class="field__label" for="${id}" id="${id}Q">${label}</label>${control}${hint?`<p class="field__hint">${hint}</p>`:""}</div>`;
const qeCheck=(checked,onchange,title,desc)=>`<label class="check-option"><input class="checkbox sm" type="checkbox" ${checked?"checked":""} onchange="${onchange}"><span class="check-option__text"><span class="check-option__title">${title}</span>${desc?`<span class="check-option__description">${desc}</span>`:""}</span></label>`;
const QE_DIVIDER=`<hr class="settings-panel__divider">`;
function qePanelHead(title,back){
 return `<header class="settings-panel__header">${back?`<button type="button" class="settings-panel__back" aria-label="Back to Questionnaire Settings" data-tip="Back" onclick="qeSelect(null)"><img src="/assets/arrow-left-20.svg" width="20" height="20" alt=""></button>`:""}
  <h2 class="settings-panel__title">${title}</h2>
  <button type="button" class="settings-panel__close" aria-label="Close ${title}" data-tip="Close" onclick="${back?"qeSelect(null)":"qePanel(false)"}"><img src="/assets/x-close-header-20.svg" width="20" height="20" alt=""></button></header>`}
function qeTplSettings(t){
 return `${qePanelHead("Questionnaire Settings")}<div class="settings-panel__body">
  ${qeGroup("Questionnaire Details",`
   ${qeField("Questionnaire Name"+QE_REQ,"qeName",`<input class="input" id="qeName" aria-required="true" maxlength="100" placeholder="e.g. Quarterly field crew check-in" value="${esc(t.name)}" oninput="qeName(this.value)" autocomplete="off">`)}
   ${qeField("Description","qeDesc",`<textarea class="input input--textarea" id="qeDesc" maxlength="500" placeholder="What this questionnaire covers and who fills it in" oninput="qeDesc(this.value)">${esc(t.desc||"")}</textarea>`)}`)}
  ${QE_DIVIDER}
  ${qeGroup("Modules",`
   <div class="section-list">${t.sections.map((s,i)=>`<button type="button" class="section-list__item" onclick="qeJump(${i})"><span class="section-list__name" id="qeSecRow${i}">${esc(s.n)}</span><span class="section-list__count">${s.qs.length}</span></button>`).join("")}</div>
   <button type="button" class="button button--with-icon" onclick="qeAddSection()"><img src="/assets/plus-gray-20.svg" width="20" height="20" alt="">Add Module</button>`)}
 </div>`}
/* Spanish field in Question Settings: typed by hand, or filled by "Translate with AI" (flagged until edited or marked checked) */
function qeEsField(label,id,k,src,q,si,qi,input){const ai=q.ai&&q.ai[k];
 const on=`qeEsInput(${si},${qi},'${k}',this.value)`;
 const ctl=input?`<input class="input" id="${id}" value="${esc(q[k]||"")}" placeholder="Type it in Spanish" oninput="${on}">`:`<textarea class="input input--textarea settings-panel__textarea--short" id="${id}" placeholder="Type it in Spanish" oninput="${on}">${esc(q[k]||"")}</textarea>`;
 return `<div class="field"><div class="field__label-row"><label class="field__label" for="${id}">${label}</label>${src?`<button type="button" class="link-button ai-button" onclick="qeAiOne(${si},${qi},'${k}')">${QE_AI_ICON}${q[k]?"Translate Again with AI":"Translate with AI"}</button>`:""}</div>${ctl}
  ${ai?`<p class="field__hint field__hint--ai">Translated by AI. Check it before publishing. <button type="button" class="link-button" onclick="qeAiChecked(${si},${qi},'${k}')">Mark as Checked</button></p>`:""}</div>`}
function qeQSettings(x){const {si,qi,q}=x,set=(k,v)=>`bT().sections[${si}].qs[${qi}].${k}=${v}`;
 return `${qePanelHead("Question Settings",true)}<div class="settings-panel__body">
  ${qeGroup("Content",`
   ${qeField("Question · English"+QE_REQ,"qeQEn",`<input class="input" id="qeQEn" aria-required="true" value="${esc(q.t)}" oninput="bTxt(${si},${qi},'t',this.value)" autocomplete="off">`)}
   ${qeEsField("Question · Spanish","qeQEs","es",q.t,q,si,qi,true)}
   ${qeField("Help Text · English","qeHelp",`<textarea class="input input--textarea settings-panel__textarea--short" id="qeHelp" placeholder="Shown under the question" oninput="${set("help","this.value")};qeLiveCard()">${esc(q.help)}</textarea>`)}
   ${qeEsField("Help Text · Spanish","qeHelpEs","hes",q.help,q,si,qi,false)}`)}
  ${QE_DIVIDER}
  ${qeGroup("Answer",`
   ${qeField("Answer Type"+QE_REQ,"qeAns",fcSel({id:"qeAns",value:q.type,options:QT.map(v=>({v,t:v,s:(QE_TYPES[v]||[""])[0]})),ph:"Select",pick:"qePickAnswer"}))}
   ${qeOptions(q,si,qi)}
   ${/scale|rating/i.test(q.type)?qeCheck(q.low,`${set("low","this.checked")};render()`,"Require a comment on low ratings","Ratings of 2 or lower need a comment"):""}`)}
  ${QE_DIVIDER}
  ${qeGroup("Access",qeCheck(q.req,`${set("req","this.checked")};render()`,"Required","Reviewers must answer this question"))}
 </div>`}
/* Answer Options (Question Settings › Answer): English + Spanish side by side.
   Single select / Multi-select: editable rows (q.o = [[en, es], …]), at least 2, Add Option below.
   Scales: the fixed levels, read-only (Numeric scale and Star rating use the company levels from Performance Settings).
   Other types have no options, so nothing is shown. */
function qeOptions(q,si,qi){
 const head=`<div class="answer-options__row answer-options__row--head" aria-hidden="true"><span>English</span><span>Spanish</span></div>`;
 if(/select/i.test(q.type)&&q.o){const one=q.o.length<=2;
  return `<div class="field"><span class="field__label" id="qeOptsQ">Answer Options</span><div class="answer-options" role="group" aria-labelledby="qeOptsQ">${head}
   ${q.o.map((o,i)=>`<div class="answer-options__row answer-options__row--edit">
    <input class="input" id="qeOpt${i}" value="${esc(o[0])}" aria-label="Option ${i+1} in English" oninput="qeOptText(${si},${qi},${i},0,this.value)" autocomplete="off">
    <input class="input" value="${esc(o[1]||"")}" placeholder="Type it in Spanish" aria-label="Option ${i+1} in Spanish" oninput="qeOptText(${si},${qi},${i},1,this.value)" autocomplete="off">
    <button type="button" class="icon-button icon-button--danger" aria-label="Delete option ${i+1}" ${one?`disabled data-tip="At least 2 options"`:`data-tip="Delete Option"`} onclick="qeOptDel(${si},${qi},${i})">${ic("trash")}</button></div>`).join("")}</div>
   <button type="button" class="button button--with-icon" onclick="qeOptAdd(${si},${qi})"><img src="/assets/plus-gray-20.svg" width="20" height="20" alt="">Add Option</button></div>`}
 const levels=q.type==="Named-level scale"?[["Below","Por debajo"],["Meets","Cumple"],["Exceeds","Supera"]]
  :/scale|rating/i.test(q.type)?[0,1,2,3,4].map(i=>[`${i+1} · ${lvl(i,"EN")}`,`${i+1} · ${lvl(i,"ES")}`]):null;
 if(!levels)return "";
 return `<div class="field"><span class="field__label" id="qeOptsQ">Answer Options</span><div class="answer-options" role="group" aria-labelledby="qeOptsQ">${head}
  ${levels.map(l=>`<div class="answer-options__row"><input class="input" value="${esc(l[0])}" disabled aria-label="${esc(l[0])}"><input class="input" value="${esc(l[1])}" disabled aria-label="${esc(l[1])} (Spanish)"></div>`).join("")}</div>
  ${q.type==="Named-level scale"?"":`<p class="field__hint">Labels come from Performance Settings.</p>`}</div>`}
function qeOptText(si,qi,i,k,v){bT().sections[si].qs[qi].o[i][k]=v;qeLiveCard()}
function qeOptAdd(si,qi){const o=bT().sections[si].qs[qi].o;o.push([`Option ${o.length+1}`,""]);render();
 const el=document.getElementById("qeOpt"+(o.length-1));if(el){el.focus();el.select()}}
function qeOptDel(si,qi,i){const o=bT().sections[si].qs[qi].o;if(o.length<=2)return;o.splice(i,1);render()}

/* ---- page ---- */
V.builder=()=>{
 const t=bT();if(!t)return V.templates();const {n,m}=bStats(t);
 if(S.bld.sel&&!qeSel())S.bld.sel=null;
 const pv=!!S.bld.preview,x=pv?null:qeSel(),panel=!pv&&(S.bld.panel!==false||!!x);
 return `<div class="editor editor--questionnaire">
  ${qeHeader(t)}
  <div class="editor__body">
   <div class="editor__canvas">${qeToolbar(t,pv,panel)}${qeSheet(t,n,m)}</div>
   ${panel?`<aside class="settings-panel" aria-label="${x?"Question Settings":"Questionnaire Settings"}">${x?qeQSettings(x):qeTplSettings(t)}</aside>`:""}
  </div>
 </div>`};

/* ---- languages: canvas toolbar + AI translation ----
   Left: English · Español · Both. Right (Edit only): Translate Missing with AI (when Spanish is missing) · Questionnaire Settings (when the panel is closed). */
var QE_AI_ICON='<svg class="ai-button__icon" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M8 2.5l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5zM15 11.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>';
var QE_AI_TAG='<span class="tag tag--ai">AI translation · Check</span>';
/* everything that still needs Spanish: question text, help text, section names */
function qeMissingEs(t){let n=0;t.sections.forEach(s=>{if(!s.es)n++;s.qs.forEach(q=>{if(!q.es)n++;if(q.help&&!q.hes)n++})});return n}
function qeAiCount(t){let n=0;t.sections.forEach(s=>{if(s.ai&&s.ai.es)n++;s.qs.forEach(q=>{if(q.ai){if(q.ai.es)n++;if(q.ai.hes)n++}})});return n}
/* English → Spanish machine translation (MyMemory public API: no key, CORS-enabled; prototype stand-in for the real AI call).
   Rejects on a network error, a non-200 status or a quota warning, so a failed call never leaves fake text in a field. */
async function qeTranslate(v){if(!v||!v.trim())return "";
 const r=await fetch("https://api.mymemory.translated.net/get?langpair=en|es&q="+encodeURIComponent(v.trim()));
 const j=await r.json(),out=j&&j.responseData&&j.responseData.translatedText;
 if(!r.ok||+j.responseStatus!==200||!out||/MYMEMORY WARNING/i.test(out))throw new Error("translation failed");
 const d=document.createElement("textarea");d.innerHTML=out;return d.value}   // decode &#39; etc.
var qeAiBusy=false;
function qeToolbar(t,pv,panel){const missing=qeMissingEs(t);
 return `<div class="canvas-toolbar">
  ${btnGroup([{id:"EN",label:"English"},{id:"ES",label:"Español",count:missing||undefined,tone:"warning"},{id:"BOTH",label:"Both"}],{active:S.bld.lang,label:"Questionnaire language",variant:"segmented",onSelect:id=>`qeLang('${id}')`})}
  ${pv?"":`<div class="canvas-toolbar__actions">${missing?`<button type="button" class="lb-btn lb-btn--secondary ai-button" onclick="qeAiAll()">${QE_AI_ICON}Translate Missing with AI</button>`:""}${panel?"":`<button type="button" class="lb-btn lb-btn--secondary" onclick="qePanel(true)">Questionnaire Settings</button>`}</div>`}
 </div>`}
function qeLang(id){if(S.bld.lang===id)return;S.bld.lang=id;S.bld.add=null;render()}
/* Translate Missing with AI: every empty Spanish field, in parallel. Each field is filled only if its own call succeeds. */
async function qeAiAll(){if(qeAiBusy)return;const t=bT(),jobs=[];
 t.sections.forEach(s=>{if(!s.es)jobs.push([s,"es",s.n]);s.qs.forEach(q=>{if(!q.es)jobs.push([q,"es",q.t]);if(q.help&&!q.hes)jobs.push([q,"hes",q.help])})});
 if(!jobs.length)return;qeAiBusy=true;toast("Translating with AI…");
 const res=await Promise.allSettled(jobs.map(([o,k,v])=>qeTranslate(v).then(es=>{if(es&&!o[k]){o[k]=es;o.ai={...o.ai,[k]:true};return 1}return 0})));
 qeAiBusy=false;const n=res.filter(r=>r.status==="fulfilled"&&r.value).length,bad=res.filter(r=>r.status==="rejected").length;
 if(n&&S.bld.lang==="EN")S.bld.lang="BOTH";render();
 toast(bad?`${n} translated, ${bad} couldn't be translated. Try again or type the Spanish.`:`${n} Spanish text${n>1?"s":""} added by AI. Check each one before publishing.`)}
async function qeAiOne(si,qi,k){if(qeAiBusy)return;const q=bT().sections[si].qs[qi],src=k==="es"?q.t:q.help;if(!src||!src.trim())return;
 qeAiBusy=true;toast("Translating with AI…");
 try{const es=await qeTranslate(src);q[k]=es;q.ai={...q.ai,[k]:true};render();toast("Translated by AI. Check it before publishing.")}
 catch(e){toast("Couldn't translate right now. Try again or type the Spanish.")}
 finally{qeAiBusy=false}}
function qeAiChecked(si,qi,k){const q=bT().sections[si].qs[qi];if(q.ai)delete q.ai[k];render()}
/* typing in a Spanish field counts as checking it: clear the AI flag (re-render only when the flag was on, so focus isn't lost mid-word otherwise) */
function qeEsInput(si,qi,k,v){const q=bT().sections[si].qs[qi],was=q.ai&&q.ai[k];
 if(k==="es")bTxt(si,qi,k,v);else{q[k]=v;qeLiveCard()}
 if(was){delete q.ai[k];const id=k==="es"?"qeQEs":"qeHelpEs";render();const el=document.getElementById(id);if(el){el.focus();el.setSelectionRange(el.value.length,el.value.length)}}}
function qeSecEs(si,v){const s=bT().sections[si];s.es=v;if(s.ai&&s.ai.es){delete s.ai.es;render();const el=document.querySelector(`#qeSec${si} input[aria-label="Module name in Spanish"]`);if(el){el.focus();el.setSelectionRange(v.length,v.length)}}}
/* Publish: unchecked AI translations get a check-first step */
const _bPublishQe=bPublish;bPublish=function(...a){const n=qeAiCount(bT());if(!n)return _bPublishQe(...a);
 window._pubAi=()=>{closeModal();_bPublishQe(...a)};
 openModal(`<h3>Check AI translations first</h3><p class="dim" style="margin:0 0 12px">${n} Spanish text${n>1?"s were":" was"} translated by AI and ${n>1?"haven't":"hasn't"} been checked. Spanish speakers see exactly what's written, so check ${n>1?"each one":"it"} before publishing.</p>
 <div class="mf"><button class="btn" onclick="closeModal();qeLang('BOTH');S.bld.preview=false;render()">Review Translations</button><button class="btn p" onclick="window._pubAi()">Publish Anyway</button></div>`)};

/* ---- actions ---- */
function qeDesc(v){bT().desc=v;const el=document.getElementById("qeSheetDesc");if(el)el.textContent=v}
/* live typing in Question Settings: update the card text for whichever language(s) it shows */
bTxt=function(si,qi,k,v){const q=bT().sections[si].qs[qi];q[k]=v;const L=S.bld.lang;
 const id=k==="t"&&L!=="ES"?"qt":k==="es"&&L==="ES"?"qt":k==="es"&&L==="BOTH"?"qtes":"";
 const el=id&&document.getElementById(id+si+"_"+qi);if(el)el.textContent=v||""};
/* drag to reorder: the grip arms the card (draggable) on mousedown; drop before/after another card, or into an empty section */
var QE_DRAG=null;
function qeDropAt(e){const card=e.target.closest(".question-card[data-si]");
 if(card){const r=card.getBoundingClientRect(),after=e.clientY>r.top+r.height/2;return{si:+card.dataset.si,qi:+card.dataset.qi+(after?1:0),card,after}}
 const list=e.target.closest(".question-section__list[data-si]");if(list){const si=+list.dataset.si;return{si,qi:bT().sections[si].qs.length}}
 return null}
function qeClearDrop(){document.querySelectorAll(".question-card.is-drop-before,.question-card.is-drop-after").forEach(c=>c.classList.remove("is-drop-before","is-drop-after"))}
function qeSelect(si,qi){S.bld.add=null;S.bld.sel=si==null?null:[si,qi];if(si!=null)S.bld.panel=true;render()}
function qeMode(preview){if(!!S.bld.preview===preview)return;S.bld.preview=preview;S.bld.add=null;render();scrollTo(0,0)}
function qePanel(on){S.bld.panel=on;if(!on)S.bld.sel=null;render()}
function qeName(v){bT().name=v;["qeTitle","qeSheetTitle"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=v||"Untitled questionnaire"})}
function qeSecRow(si,v){const el=document.getElementById("qeSecRow"+si);if(el)el.textContent=v}
function qeJump(si){const el=document.getElementById("qeSec"+si);if(el)el.scrollIntoView({block:"start",behavior:"smooth"})}
function qeToggleAdd(si){S.bld.add=S.bld.add===si?null:si;render()}
function qeAddQuestion(si,type){const s=bT().sections[si];s.qs.push(qeNewQ(type));S.bld.add=null;qeSelect(si,s.qs.length-1);
 const el=document.getElementById("qeQEn");if(el){el.focus();el.select()}}
function qeAddSection(){const t=bT();t.sections.push({n:"New module",qs:[qeNewQ("Numeric scale")]});const si=t.sections.length-1;qeSelect(si,0);
 const el=document.querySelector(`#qeSec${si} .question-section__name`);if(el){el.scrollIntoView({block:"center",behavior:"smooth"});el.focus({preventScroll:true});el.select()}}
function qeAddStandard(name){const t=bT();t.sections.push({n:name,qs:[{...qeNewQ("Numeric scale"),t:name+" rating",low:true}]});render();qeJump(t.sections.length-1)}
function qeDelSection(si){const t=bT(),s=t.sections[si];t.sections.splice(si,1);S.bld.sel=null;render();
 toast(`${s.n} deleted.`,()=>{t.sections.splice(si,0,s);render()})}
function qeDuplicate(si,qi){const s=bT().sections[si];s.qs.splice(qi+1,0,JSON.parse(JSON.stringify(s.qs[qi])));qeSelect(si,qi+1)}
function qeDelete(si,qi){const s=bT().sections[si],q=s.qs[qi];s.qs.splice(qi,1);S.bld.sel=null;render();
 toast("Question deleted.",()=>{s.qs.splice(qi,0,q);render()})}
/* help text typed in the panel: redraw just that card so the panel field keeps focus */
function qeLiveCard(){const x=qeSel();if(!x)return;const el=document.querySelector(".question-card.is-selected");if(!el)return;
 const num=el.querySelector(".question-card__number").textContent;el.outerHTML=qeCard(x.q,x.si,x.qi,+num,x.sec.qs.length)}
/* single-select picks (fcSel calls these with the value) */
function qePickType(v){if(v){bT().type=v;render()}}
function qePickAud(v){if(v){bT().aud=v;render()}}
function qePickAnswer(v){const x=qeSel();if(!x||!v)return;x.q.type=v;if(/select/i.test(v)&&!x.q.o)x.q.o=[["Option 1",""],["Option 2",""]];if(!/scale|rating/i.test(v))x.q.low=false;render()}

/* a questionnaire opens on Questionnaire Settings (nothing selected), like a new course */
const _openBuilderQe=openBuilder;openBuilder=function(...a){_openBuilderQe(...a);if(S.bld){S.bld.sel=null;S.bld.add=null;S.bld.panel=true;S.bld.preview=false;render()}};
document.addEventListener("dragstart",e=>{const c=S.view==="builder"&&e.target.closest&&e.target.closest(".question-card[data-si]");if(!c||!c.draggable)return;
 QE_DRAG={si:+c.dataset.si,qi:+c.dataset.qi};c.classList.add("is-dragging");e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain","")});
document.addEventListener("dragover",e=>{if(!QE_DRAG)return;const d=qeDropAt(e);if(!d)return;e.preventDefault();e.dataTransfer.dropEffect="move";
 qeClearDrop();if(d.card)d.card.classList.add(d.after?"is-drop-after":"is-drop-before")});
document.addEventListener("drop",e=>{if(!QE_DRAG)return;const d=qeDropAt(e);qeClearDrop();if(!d)return;e.preventDefault();
 const t=bT(),from=t.sections[QE_DRAG.si].qs,sel=S.bld.sel,wasSel=sel&&sel[0]===QE_DRAG.si&&sel[1]===QE_DRAG.qi;
 let qi=d.qi;if(d.si===QE_DRAG.si&&qi>QE_DRAG.qi)qi--;
 const [q]=from.splice(QE_DRAG.qi,1);t.sections[d.si].qs.splice(qi,0,q);
 S.bld.sel=wasSel?[d.si,qi]:null;QE_DRAG=null;render()});
document.addEventListener("dragend",e=>{const c=e.target.closest&&e.target.closest(".question-card");if(c){c.draggable=false;c.classList.remove("is-dragging")}qeClearDrop();QE_DRAG=null});
document.addEventListener("mouseup",()=>{if(!QE_DRAG)document.querySelectorAll(".question-card[draggable=true]").forEach(c=>c.draggable=false)});
/* Add Question menu: outside click / Escape closes it */
document.addEventListener("mousedown",e=>{if(S.view==="builder"&&S.bld&&S.bld.add!=null&&!e.target.closest(".divider-action")){S.bld.add=null;render()}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&S.view==="builder"&&S.bld&&S.bld.add!=null){const si=S.bld.add;S.bld.add=null;render();
 const b=document.querySelector(`#qeSec${si} .divider-action__button`);if(b)b.focus()}});
/* full-page mode, like the New Review Cycle editor: hide the Lumber top nav */
const _renderQe=render;render=function(...a){const r=_renderQe(...a);if(S.view==="builder")document.body.classList.add("focusmode");return r};
