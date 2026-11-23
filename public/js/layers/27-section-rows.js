/* ===== New Review Cycle: section rows, matching the PTO prototype's Policy Details card
   (PTO Policy Config › leave-policy-prototype.html, V5). Every setting reads as a question on the left (280px)
   with its answer on the right; the row layout itself is CSS (src/styles/22-section-rows.css).
   Here: the Overall Rating scale moves into the answer column under its select, and every field's answer is wrapped
   in one answer column. (Checkbox settings are built as rows by rxOpt in 14-reviewee-reviewers.js.) ===== */
/* Overall Rating: the scale (or the no-rating note) sits in the answer column, under the Rating format select */
/* split at the <!--fc-rate--> marker (15-cycle-settings-kv.js), not at the first "</div></div>": an open Rating format
   menu also ends in "</div></div>", which used to put the scale inside the dropdown wrapper and push the menu below it */
const _rxRatingRows=rxRating;rxRating=function(w){const h=_rxRatingRows(w),M="</div></div><!--fc-rate-->",i=h.lastIndexOf(M);if(i<0)return h;
 const rest=h.slice(i+M.length).replace(/\s*<\/section>\s*$/,"").trim();
 return rest?`${h.slice(0,i)}<div class="rating-preview">${rest}</div></div></div></section>`:h};
/* every field row: the question on the left, ONE answer column on the right (.setting__control). The answer's parts (field, errors,
   rating scale, nested options…) stack under each other inside it instead of sharing grid rows with the question,
   so a long question or description never pushes them apart. Runs after each render (moving nodes keeps their handlers). */
function fcWrapAnswers(){document.querySelectorAll(".editor__main .setting-list>.setting").forEach(f=>{if(f.querySelector(":scope>.setting__control"))return;
 const kids=[...f.children].filter(c=>!c.classList.contains("setting__label"));if(!kids.length)return;
 const a=document.createElement("div");a.className="setting__control";kids.forEach(c=>a.appendChild(c));f.appendChild(a)})}
const _renderAns=render;render=function(...a){const r=_renderAns(...a);fcWrapAnswers();return r};
render();
