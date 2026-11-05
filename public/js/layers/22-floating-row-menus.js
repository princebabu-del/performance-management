/* ===== Layer 22 · Row kebab menus inside table scrollers (.tw) float above the page =====
   .tw scrolls sideways (overflow-x:auto), which also clips anything that sticks out vertically, so a row
   menu near the bottom of a short table (Questionnaires, Review Cycles) got cut off. The open menu is
   position:fixed (CSS) and placed under its button here; near the bottom of the window it flips above.
   Cycle detail menus (.cd-kb-menu) already do this in layer 17. ===== */
function rowMenuPlace(){const m=document.querySelector(".tw .kebab>.menu:not(.cd-kb-menu)");if(!m)return;
 const b=m.parentElement.querySelector("button");if(!b)return;
 const r=b.getBoundingClientRect(),h=m.offsetHeight,w=m.offsetWidth,below=r.bottom+4+h<=innerHeight-8;
 m.style.top=(below?r.bottom+4:Math.max(8,r.top-4-h))+"px";m.style.left=Math.max(8,Math.min(r.right-w,innerWidth-w-8))+"px"}
const _renderRowMenu=render;render=function(...a){_renderRowMenu(...a);rowMenuPlace()};
addEventListener("resize",rowMenuPlace);
addEventListener("scroll",rowMenuPlace,true);
