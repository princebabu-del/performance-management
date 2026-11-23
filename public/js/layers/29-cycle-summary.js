/* ===== New Review Cycle: Cycle Summary card, right of the section cards
   (Figma "Exploration – Lumber Web App" 785:34406, the PTO prototype's Policy Summary). One plain sentence per setting,
   the deciding words in bold, rebuilt from the editor state after every render and on every input/change in the editor.
   Styles: src/styles/24-cycle-summary.css ===== */
const fcPl=r=>/man$/i.test(r)?r.replace(/man$/i,"men"):r+"s";
function fcSumLines(w){const x=rxInit(w),L=[],t=w.ctype||"General Review",s=toISO(w.start),e=toISO(w.end),b=v=>`<b>${v}</b>`;
 /* Cycle Details: type and period, repeats, reopening */
 const reopenL=x.reopen?`Can be reopened ${x.reopenWin==="any"?b("any time"):`up to ${b(`${x.reopenMonths} month${+x.reopenMonths===1?"":"s"}`)}`} after the end date.`:`Can't be reopened after the end date.`;
 const projL=t==="Project Completion Review"?(()=>{const k=(w.projs||[]).length;
  return w.projMode==="specific"?(k?`Covers ${b(`${k} project${k===1?"":"s"}`)}.`:`No projects picked yet.`):w.projMode==="all"?`Covers ${b("all projects")}.`:`Projects aren't chosen yet.`})():"";
 if(t==="General Review"){
  L.push(s&&e?`${b(t)} running ${b(fcRange(s,e))}.`:`${b(t)}. The cycle period isn't set yet.`);
  L.push(w.recur&&FC_EVERY[w.recur]?`Repeats ${b(FC_EVERY[w.recur])} with the same setup${fcRecurOk(w.recurN)?`, ${b(`${w.recurN} cycle${w.recurN===1?"":"s"}`)} in total`:""}.`:`Runs ${b("once")}; it doesn't repeat.`);
 }else{
  const n=+w.probEvery||1,at=t==="New Hire Review"?"at the end of probation":"at project completion";
  L.push(w.probSched==="interval"?`${b(t)}, reviewed ${b(`every ${n} month${n===1?"":"s"}`)}.`:`${b(t)}, reviewed ${b("once")}, ${at}.`);
 }
 if(t==="General Review")L.push(reopenL);   // only General Review has Cycle reopening
 /* Reviewee: projects, role, self-evaluation, peer nomination, credentials */
 if(projL)L.push(projL);
 const allProj=t==="Project Completion Review",role=x.reviewee?fcPl(x.reviewee):"";   // allProj: no peer nomination / Auto-assign lines
 L.push(role?`${b(esc(role))} are reviewed.`:`No reviewee role is chosen yet.`);
 /* the rest of the settings only appear on the page once a reviewee role is picked, so the summary stops here too */
 if(!role)return L;
 L.push(`Self-evaluation is ${b(x.self?"on":"off")}.`);
 const visT=(L,v)=>((L.find(o=>o.v===v)||{}).t||v||"").toLowerCase();
 L.push(x.results==="Never"?`Reviewees ${b("never")} see their results.`:`Reviewees see their results ${b(visT(RX_RESULTS,x.results))}.`);
 L.push(x.creds?`Credentials are ${b("shown")} on the review.`:`Credentials are ${b("not included")}.`);
 /* Reviewers: who reviews, editing submission */
 const K=rxKeys(x);
 if(!allProj)L.push(x.peers?`Employees nominate ${b(x.peerMode==="any"?"any number of peers":`up to ${x.peerMax||1} peer${(x.peerMax||1)===1?"":"s"}`)}, approved by their manager.`:`Peer nomination is ${b("off")}.`);
 L.push(K.length?`Reviewed by ${K.map(k=>b(`${k==="Self"?"Self-evaluation":esc(rxName(k))} ${+rxRow(x,k).w||0}%`)).join(", ")}.`:`No reviewers are chosen yet.`);
 L.push(x.revEdit&&x.revEdit.on?`Submissions ${b("can be edited")} until they're due.`:`Submissions ${b("can't be edited")} once sent.`);
 if(x.self)L.push(`Reviewers see the self-evaluation ${b(visT(RX_SELFVIS,x.selfVis))}.`);
 /* Overall Rating */
 const r=w.rating||"Numeric 1–5 with definitions";
 L.push(r==="No rating"?`${b("No overall rating")}; written feedback only.`:`Overall rating uses ${b(RX_FMT_LBL[r]||esc(r))}.`);
 /* Auto-assign */
 const a=x.auto;if(!allProj)L.push(a&&a.on?`${b("Auto-assigns")} ${a.mode==="groups"?`${esc(role||"employees")} from selected groups`:`all ${esc(role||"employees")}`}.`:`People are ${b("added manually")}.`);
 return L}
function fcSumDraw(){if(S.view!=="wizard")return;const body=document.querySelector(".editor__body"),w=W();if(!body||!w)return;
 let el=body.querySelector(":scope>.summary");   // redraw the one card in place
 if(!el){el=document.createElement("aside");el.className="summary";el.setAttribute("aria-label","Cycle Summary");body.appendChild(el)}
 el.innerHTML=`<div class="summary__header"><h2>Cycle Summary</h2></div>
  <ul class="summary__body">${fcSumLines(w).map(l=>`<li><img src="/assets/check-green-16.svg" width="16" height="16" alt="">${`<span>${l}</span>`}</li>`).join("")}</ul>`}
const _renderSum=render;render=function(...a){const r=_renderSum(...a);fcSumDraw();return r};
/* typing and picks that don't re-render (name, notes, repeats, weightage, nested numbers) */
let fcSumRaf=0;
["input","change"].forEach(ev=>document.addEventListener(ev,e=>{if(!e.target.closest||!e.target.closest(".editor"))return;
 cancelAnimationFrame(fcSumRaf);fcSumRaf=requestAnimationFrame(fcSumDraw)}));
render();
