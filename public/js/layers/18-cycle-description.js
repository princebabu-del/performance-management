/* ===== Cycle description, labelled "Additional Notes": optional, up to 500 characters.
   Editor: an Additional Notes textarea at the end of Cycle Details (id wDesc, which wzCollect already reads into w.desc).
   Detail page: Overview › Cycle Details › Additional Notes, clamped to 3 lines with More / Less.
   Reviewer form: the last card in the right-side context panel. ===== */
const CD_DESC_MAX=500;
/* demo descriptions for the seeded cycles (a saved description, even an empty one, wins) */
const CD_SEED_DESC={
 c1:"Quarterly check-in for field crews. Workers answer a short self review on their phone, their crew manager completes the crew batch review on three metrics, and foremen who worked with them this quarter add notes. Results are calibrated by branch before they're shared, and every employee acknowledges receipt.",
 c2:"Quarterly check-in for field crews covering July through September: self review, crew batch review and contributing foreman notes, calibrated before sharing.",
 c3:"Annual review for office staff. Employees complete a self review, nominate up to three peers for their manager to approve, and receive a manager review. Ratings are calibrated and approved before results are shared."};
const cdDesc=c=>c?(c.desc!==undefined?c.desc:(CD_SEED_DESC[c.id]||"")):"";
/* Overview › Cycle Details › Additional Notes: clamped to 3 lines; "More" only when it's actually cut off, "Less" collapses it */
function cdDescBlock(c){const d=(cdDesc(c)||"").trim();if(!d)return`<span class="dim">—</span>`;const open=S.descOpen===c.id;
 return `<div class="cs-desc ${open?"open":""}"><span class="cs-desc-t">${esc(d)}</span>${open?`<button type="button" class="cd-more" onclick="S.descOpen=null;render()">Less</button>`
  :`<button type="button" class="cd-more" hidden aria-label="Show full notes" onclick="S.descOpen='${c.id}';render()">More</button>`}</div>`}
function cdDescFit(){const a=document.querySelector(".cs-desc:not(.open)");if(!a)return;const t=a.querySelector(".cs-desc-t"),b=a.querySelector(".cd-more");if(t&&b)b.hidden=t.scrollHeight<=t.clientHeight+1}
const _renderAbout=render;render=function(...a){_renderAbout(...a);if(S.view==="cycle")cdDescFit()};
addEventListener("resize",()=>{if(S.view==="cycle")cdDescFit()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(S.view==="cycle")cdDescFit()});
/* editor field (Additional Notes + helper text): after Cycle Period / Repeats, at the end of the Cycle Details card */
function fcDescIn(el){W().desc=el.value;const n=$("#fcDescCount");if(n)n.textContent=`${el.value.length}/${CD_DESC_MAX}`}
const _fcDetailsDesc=fcDetails;fcDetails=function(w){const h=_fcDetailsDesc(w),d=w.desc||"",i=h.lastIndexOf("</div></section>");
 const f=`<div class="fc-field full"><div class="fc-lbl"><label for="wDesc">Additional Notes</label><span class="fc-count" id="fcDescCount">${d.length}/${CD_DESC_MAX}</span></div>
  <textarea class="fc-inp fc-ta" id="wDesc" maxlength="${CD_DESC_MAX}" rows="4" placeholder="Enter" aria-describedby="wDescHelp" oninput="fcDescIn(this)">${esc(d)}</textarea>
  <p class="fc-help" id="wDescHelp">Shown to reviewers while they complete the review. Add focus areas, rating guidance or anything that affected this period.</p></div>`;
 return i<0?h:h.slice(0,i)+f+h.slice(i)};
/* save: drafts and new cycles (createCycle saves through wzSave), and live edits */
const _wzSaveDesc=wzSave;wzSave=function(...a){_wzSaveDesc(...a);const w=W(),c=w&&w.id&&C(w.id);if(c)c.desc=(w.desc||"").trim()};
const _fcLiveSaveDesc=fcLiveSave;fcLiveSave=function(...a){const w=W(),c=w&&C(w.id);if(c)c.desc=(w.desc||"").trim();return _fcLiveSaveDesc(...a)};
/* load: drafts (live edits load it in cycEdit) */
const _editDraftDesc=editDraft;editDraft=function(cid){_editDraftDesc(cid);if(S.wz){S.wz.desc=cdDesc(C(cid));render()}};
/* reviewer form: the cycle's Additional Notes as the last card in the context panel (only when there is a note) */
const _vWriteDesc=V.write;V.write=(...a)=>{const h=_vWriteDesc(...a),w=S.wr,p=w&&PK(w.pid),d=p?(cdDesc(cycOf(p))||"").trim():"",i=h.lastIndexOf("</aside>");
 if(!d||i<0)return h;
 return h.slice(0,i)+`<div class="card"><div class="hd"><h3>Additional notes</h3><span class="dim sm">From HR</span></div><div class="bd sm" style="white-space:pre-line;line-height:1.5">${esc(d)}</div></div>`+h.slice(i)};
render();
