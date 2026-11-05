/* ===== Employee profile panel (Resources → employee), per Figma "Employee info" (Desktop-UX 39133:21561)
   Header (photo · Employee Details · name · history · status) · left nav · section cards · Cancel / Save.
   "Performance" is the new nav item: it carries the profile's rating, reviews and badges. ===== */
const EP_TABS=["Employee Info","Projects","Cost Codes","Paystubs","Pay Rates","Benefits","Deductions","Reimbursements","Assignments","Credentials","Documents","Performance","Roles & Permissions","Attendance Exceptions","Awards"];
const EP_PAY=["Paystubs","Pay Rates","Benefits","Deductions","Reimbursements"];
const EP_ALIAS={"Performance & Skills":"Performance","Manager & Reports":"Employee Info"};

/* "Mar 2021" / "2018" → ISO for dateField */
function epISO(s){if(!s)return"";const m=String(s).match(/^([A-Z][a-z]{2}) (\d{4})$/);if(m)return `${m[2]}-${String("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(m[1])/3+1).padStart(2,"0")}-01`;return /^\d{4}$/.test(s)?`${s}-01-01`:""}

function epSection(title,inner){return `<section class="ep-card"><h3 class="ep-sec">${esc(title)}</h3>${inner}</section>`}
function epRow(label,ctl,cls=""){return `<div class="ep-row ${cls}"><label class="ep-lab">${label}</label><div class="ep-ctl">${ctl}</div></div>`}
function epInp(v,ph,aria){return `<input class="ep-inp" value="${esc(v||"")}" placeholder="${esc(ph)}" aria-label="${esc(aria)}">`}
function epSel(v,ph,opts,aria){return `<select class="ep-inp ep-sel ${v?"":"empty"}" aria-label="${esc(aria)}" onchange="this.classList.toggle('empty',!this.value)"><option value="">${esc(ph)}</option>${opts.map(o=>`<option ${o===v?"selected":""}>${esc(o)}</option>`).join("")}</select>`}
function epDate(v,aria){return dateField({value:v,cls:"ep-date",aria,onchange:"epDirty()"})}

function epInfo(e){const [first,...rest]=e.name.split(" "),role=e.isMgr?"Foreman":e.type==="Office"?"Office":"Worker";
 const pair=(l1,c1,l2,c2)=>`<div class="ep-row ep-pair"><label class="ep-lab">${l1}</label><div class="ep-ctl">${c1}</div><label class="ep-lab">${l2}</label><div class="ep-ctl">${c2}</div></div>`;
 const g=["Male","Female","Non-Binary","Prefer not to disclose"].map(x=>`<label class="ep-radio"><input type="radio" name="ep-g"> ${x}</label>`).join("");
 return epSection("General Information",
  pair("First Name*",epInp(first,"Enter First Name","First Name"),"Middle Name",epInp("","Enter Middle Name","Middle Name"))
  +pair("Last Name*",epInp(rest.join(" "),"Enter Last Name","Last Name"),"Preferred Name",epInp("","Enter Preferred Name","Preferred Name"))
  +epRow("Gender",`<div class="ep-radios" role="radiogroup" aria-label="Gender">${g}</div>`,"ep-gap")
  +epRow("Date of Birth*",epDate("","Date of Birth"))
  +epRow("Birth Place",epInp("","Enter Birth Place","Birth Place"))
  +epRow("Ethnicity",`<label class="ep-check"><input type="checkbox"> Hispanic or Latino</label>`)
  +epRow("Minority (Race)",epSel("","Select Minority (Race)",["American Indian or Alaska Native","Asian","Black or African American","Native Hawaiian or Other Pacific Islander","White","Two or More Races"],"Minority (Race)"))
  +epRow("Marital Status",epSel("","Select Marital Status",["Single","Married","Divorced","Widowed"],"Marital Status"))
  +`<hr class="ep-hr">`
  +epRow("Job Title*",epInp(e.title,"Enter Job Title","Job Title"))
  +epRow("Hire Date*",epDate(epISO(e.hire),"Hire Date"))
  +epRow("Start Date*",epDate(epISO(e.hire),"Start Date"))
  +epRow("Effective Tenure Date",epDate("","Effective Tenure Date"))
  +epRow("Termination Date",epDate("","Termination Date"))
  +epRow("Termination Reason",epInp("","Reason for Termination","Termination Reason"))
  +epRow("Role*",epSel(role,"Select Role",["Worker","Foreman","Office","Admin"],"Role"))
  +epRow("Employment Type",epSel(e.type==="Office"?"Salaried":"Hourly","Select Employment Type",["Hourly","Salaried","Contractor"],"Employment Type"),"ep-gap-b")
  +epRow("Employee Code",epInp(e.code,"Enter Employee Code","Employee Code"))
  +epRow("Secondary Employee ID",epInp("","Enter Secondary Employee ID","Secondary Employee ID")))}

/* Performance: overall rating, then one section per review cycle (same as the cycle's employee drawer, minus its Next step box: the live cycle
   first, then past cycles newest first). A segmented control (All · Active · Past) and a search box sit above the list; opening the profile from a cycle
   (openProfile(eid,tab,cid)) pre-fills the search with that cycle. */
const EP_CYC_GRP={active:["Active"],past:["Closed","Archived"]};
function epCycPs(e){const start=x=>cycDates(cycOf(x))[0]||"";
 return D.packets.filter(x=>x.eid===e.id&&cycOf(x)).sort((a,b)=>start(b).localeCompare(start(a)))}
function epCycListHTML(e){const ps=epCycPs(e),cur=ps.find(x=>cycOf(x).status==="Active"),f=S.prCyc||"all",q=(S.prQ||"").trim().toLowerCase();
 const rows=ps.filter(x=>{const c=cycOf(x);
  if(f!=="all"&&(EP_CYC_GRP[f]?!EP_CYC_GRP[f].includes(c.status):String(x.cid)!==f))return false;
  return !q||[c.name,c.period,c.status,empStatus(x)].some(v=>String(v||"").toLowerCase().includes(q))});
 return (rows.length?`<div class="pk-stack">${rows.map(x=>cdPkSection(x,x===cur,true)).join("")}</div>`
  :`<div class="card"><div class="empty"><b>No cycles match</b>Try a different search or filter.</div></div>`)}
/* segmented control (All · Active · Past) on the left, search on the right. All is selected by default; opened from a cycle,
   the search is pre-filled with that cycle's name so only it shows. */
function epCycSeg(e){const ps=epCycPs(e),f=S.prCyc||"all",n=k=>ps.filter(x=>EP_CYC_GRP[k].includes(cycOf(x).status)).length;
 return btnGroup([{id:"all",label:"All",count:ps.length},{id:"active",label:"Active",count:n("active")},{id:"past",label:"Past",count:n("past")}],
  {active:f,label:"Filter cycles",onSelect:k=>`epCycSet(${e.id},'${k}')`})}
function epCycles(e){if(!epCycPs(e).length)return"";
 return `<div class="ep-cyc-tools"><div id="ep-cyc-seg">${epCycSeg(e)}</div>
  <label class="srch ep-cyc-q ${S.prQ?"has-v":""}">${ic("search")}<input id="ep-cyc-q" type="search" placeholder="Search cycles" aria-label="Search cycles" value="${esc(S.prQ||"")}" oninput="S.prQ=this.value;this.parentElement.classList.toggle('has-v',!!this.value);epCycRefresh(${e.id})" onkeydown="if(event.key==='Escape'&&this.value){event.stopPropagation();epCycClear(${e.id})}"><button type="button" class="ep-cyc-x" aria-label="Clear search" title="Clear" onmousedown="event.preventDefault()" onclick="epCycClear(${e.id})">${ic("x","s")}</button></label></div>
  <div id="ep-cyc-list" aria-live="polite">${epCycListHTML(e)}</div>`}
function epCycSet(eid,k){S.prCyc=k;const g=$("#ep-cyc-seg");if(g){g.innerHTML=epCycSeg(E(eid));const on=g.querySelector(".is-selected");if(on)on.focus()}epCycRefresh(eid)}
/* re-render just the list so the search box keeps focus while typing */
function epCycRefresh(eid){const l=$("#ep-cyc-list");if(l)l.innerHTML=epCycListHTML(E(eid))}
/* clear button (shown while the search has text): empties it, keeps focus in the field */
function epCycClear(eid){S.prQ="";const q=$("#ep-cyc-q");if(q){q.value="";q.parentElement.classList.remove("has-v");q.focus()}epCycRefresh(eid)}
function epPerf(e,inScope,F){const mine=F?crewRows().filter(r=>r.eid===e.id):[];
 if(!inScope)return `<div class="card"><div class="empty"><b>Performance details are private</b>Only ${esc(e.name.split(" ")[0])}'s reviewers, superintendent and HR can see them.</div></div>`;
 return (F&&mine.length?`<div class="card"><div class="bd row" style="justify-content:space-between"><div><b>Your Q4 review of ${esc(e.name.split(" ")[0])}</b><div class="dim sm">${mine[0].st==="Submitted"?"Sent":"Not sent yet"} · Crew Review</div></div><button class="btn p" onclick="closeLayer();nav('crew')">${mine[0].st==="Submitted"?"View in crew review":"Rate in crew review"}</button></div></div>`:"")
  +epRating(e)+epCycles(e)}
/* top card: average of shared ratings, its level, and how many shared cycles it covers (empty state reuses profRating's) */
function epRating(e){const rp=ratedPackets(e);if(!rp.length)return profRating(e);
 const avg=rp.reduce((a,p)=>a+(p.adj||p.rating),0)/rp.length,lv=Math.min(5,Math.max(1,Math.round(avg))),tone=lv>=4?"g":lv===3?"b":lv===2?"a":"r";
 return `<section class="ep-card ep-rate ${tone}"><h3 class="ep-rate-k">Overall Performance Rating</h3>
  <div class="ep-rate-row"><b class="ep-rate-n ${tone}">${avg.toFixed(1)}</b>
   <div class="ep-rate-txt"><span class="ep-rate-l">${esc(D.settings.levels[lv-1]||"")}</span><span class="ep-rate-s">Average across ${rp.length} shared review cycle${rp.length>1?"s":""}</span></div></div>${epRateStars(avg)}</section>`}
/* decorative stars on the right of the rating card: always 5 in an arc (larger toward the middle); the score fills them left to right in
   the rating color, a fractional score part-fills the next star, the rest stay gray */
const EP_STAR_POS=[[44,84,30,-16],[94,54,44,-8],[150,38,58,0],[206,54,44,8],[256,84,30,16]];
function epRateStars(score){const P="M12 2.6l2.85 5.95 6.55.85-4.8 4.55 1.25 6.5L12 17.3l-5.85 3.15 1.25-6.5-4.8-4.55 6.55-.85z";
 const sp=(x,y,r)=>`<path class="ep-spark" d="M${x} ${y-r}Q${x} ${y} ${x+r} ${y}Q${x} ${y} ${x} ${y+r}Q${x} ${y} ${x-r} ${y}Q${x} ${y} ${x} ${y-r}z"/>`;
 const star=([x,y,sz,r],i)=>{const f=Math.max(0,Math.min(1,score-i)),k=sz/24;
  return `<g transform="translate(${x-sz/2} ${y-sz/2}) rotate(${r} ${sz/2} ${sz/2}) scale(${k})">
   <path class="ep-star-off" d="${P}" stroke-width="1.6" stroke-linejoin="round"/>
   ${f?`${f<1?`<clipPath id="epStarC${i}"><rect x="0" y="0" width="${(24*f).toFixed(2)}" height="24"/></clipPath>`:""}<path class="ep-star-on" d="${P}" fill="url(#epStarG)" stroke="url(#epStarG)" stroke-width="1.6" stroke-linejoin="round"${f<1?` clip-path="url(#epStarC${i})"`:""}/>`:""}</g>`};
 return `<svg class="ep-rate-stars" viewBox="0 0 300 120" aria-hidden="true" focusable="false"><defs><linearGradient id="epStarG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ep-sg1"/><stop offset="1" class="ep-sg2"/></linearGradient></defs>
  ${sp(30,30,5)}${sp(282,24,6)}${sp(272,106,4)}${EP_STAR_POS.map(star).join("")}</svg>`}

function epBody(e,tab,inScope,F){
 if(tab==="Employee Info")return epInfo(e);
 if(tab==="Performance")return epPerf(e,inScope,F);
 if(tab==="Projects")return epSection("Projects",hoursBySite(e).map(h=>`<div class="ep-line"><b>${esc(h[0])}</b><span class="dim">${h[1]} hrs · ${esc(h[2])}</span></div>`).join("")||`<div class="ep-empty">No projects on file.</div>`);
 if(tab==="Credentials")return epSection("Credentials",e.certs.map(x=>`<div class="ep-line"><b>${esc(x.n)}</b><span class="pill ${x.s==="active"?"g":x.s==="expired"?"r":"a"}">${x.s==="active"?"Valid":x.s==="expired"?"Expired":"Expiring"} · ${x.d}</span></div>`).join("")||`<div class="ep-empty">No credentials on file.</div>`);
 if(tab==="Assignments")return epSection("Assignments",`<div class="ep-empty"><b>No open assignments</b>Onboarding and form tasks show here.</div>`);
 return epSection(tab,`<div class="ep-empty">No ${esc(tab.toLowerCase())} on file.</div>`)}

function openProfile(eid,tab,cid){const e=E(eid);tab=EP_ALIAS[tab]||tab;
 /* cycle filter: scoped to the cycle it was opened from; reset when opening a different employee, kept while switching sections */
 if(cid!==undefined){const c=C(cid);S.prCyc="all";S.prQ=c?c.name:""}else if(S.prE!==eid){S.prCyc="all";S.prQ=""}
 const R=S.role||"admin",F=R==="foreman",inScope=!F||crewRows().some(r=>r.eid===eid)||e.mgr===ME||e.name===ME;
 const tabs=EP_TABS.filter(t=>R==="admin"||!EP_PAY.includes(t));
 S.prTab=tabs.includes(tab)?tab:"Employee Info";S.prE=eid;
 S.pkOpen=null;
 const enter=!$("#layer .ep");/* animate only on first open, not when switching sections */
 $("#layer").innerHTML=`<div class="dbg${enter?" ep-enter":""}" onclick="if(event.target===this)closeLayer()"><div class="ep" role="dialog" aria-modal="true" aria-labelledby="ep-name">
  <header class="ep-hd"><div class="ep-who"><img class="ep-photo" src="/assets/profile/profile-photo.svg" width="48" height="48" alt=""><div><div class="ep-lab-top">Employee Details</div><h2 id="ep-name" class="ep-name">${esc(e.name)}</h2></div></div>
   <div class="ep-hd-acts"><button type="button" class="ep-hist" aria-label="Profile change history" title="History" onclick="toast('Profile change history opens here.')"><img src="/assets/profile/clock-fast-forward.svg" width="20" height="20" alt=""></button>
    <label class="ep-status"><img class="ep-dot" src="/assets/profile/status-dot.svg" width="8" height="8" alt=""><select aria-label="Employee status" onchange="this.parentElement.classList.toggle('off',this.value==='Disabled')"><option>Enabled</option><option>Disabled</option></select><img class="ep-car" src="/assets/profile/select-caret.svg" width="24" height="24" alt=""></label></div></header>
  <div class="ep-wrap"><nav class="ep-nav" aria-label="Employee sections">${tabs.map(t=>`<button type="button" class="ep-nav-i ${S.prTab===t?"on":""}" ${S.prTab===t?'aria-current="page"':""} onclick="epGo(${eid},'${t}')">${esc(t)}</button>`).join("")}</nav>
   <div class="ep-main"><div class="ep-stack">${epBody(e,S.prTab,inScope,F)}</div></div></div>
  <footer class="ep-ft" hidden><button type="button" class="ep-btn" onclick="closeLayer()">Cancel</button><button type="button" class="ep-btn p" onclick="closeLayer();toast('Saved.')">Save</button></footer></div></div>`;
 document.body.style.overflow="hidden";
 /* Cancel / Save only appear once something is edited (the cycle search and filter don't count) */
 const ep=$("#layer .ep"),edit=ev=>{if(!ev.target.closest(".ep-cyc-tools"))epDirty()};
 ep.addEventListener("input",edit);ep.addEventListener("change",edit);
}
function epDirty(){const f=$("#layer .ep-ft");if(f)f.hidden=false}
/* switching sections re-renders the panel; keep keyboard focus on the chosen nav item */
function epGo(eid,t){openProfile(eid,t);const on=$("#layer .ep-nav-i.on");if(on)on.focus({preventScroll:true})}
