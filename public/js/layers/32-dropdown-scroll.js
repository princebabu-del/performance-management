/* ===== Dropdown menus: overlay scrollbar + shared search =====
   Every .rx-pop-list scrolls after 7 options (28-dropdown-menu.css). The native scrollbar is hidden; a .dd-thumb is drawn
   inside the .rx-pop, over the options' right edge (z-index 3), and only shows while the pointer is over the menu.
   It is created lazily (popups are re-rendered as strings) and can be dragged. Spec: MENU SPECS in public/components/single-select/SingleSelect.tsx / multi-select/MultiSelect.tsx */
function ddThumb(list){const pop=list.parentNode;if(!pop)return;let t=pop.querySelector(":scope>.dd-thumb");
 const sh=list.scrollHeight,ch=list.clientHeight;
 if(sh<=ch+1){if(t)t.classList.remove("is-on");return}
 if(!t){t=document.createElement("div");t.className="dd-thumb";t.setAttribute("aria-hidden","true");pop.appendChild(t)}
 const pad=4,track=ch-pad*2,h=Math.max(24,track*ch/sh),top=list.offsetTop+pad+(track-h)*list.scrollTop/(sh-ch);
 t.style.height=h+"px";t.style.top=top+"px";t.classList.add("is-on");t._list=list}
const ddListOf=el=>{const p=el&&el.closest&&el.closest(".rx-pop");return p&&p.querySelector(":scope>.rx-pop-list")};
document.addEventListener("scroll",e=>{const l=e.target;if(l.classList&&l.classList.contains("rx-pop-list"))ddThumb(l)},true);
document.addEventListener("pointerover",e=>{const l=ddListOf(e.target);if(l)ddThumb(l)});
document.addEventListener("input",e=>{const l=ddListOf(e.target);if(l)requestAnimationFrame(()=>ddThumb(l))});
/* drag the thumb */
document.addEventListener("pointerdown",e=>{const t=e.target.closest&&e.target.closest(".dd-thumb");if(!t||!t._list)return;
 e.preventDefault();const l=t._list,y0=e.clientY,s0=l.scrollTop,k=(l.scrollHeight-l.clientHeight)/Math.max(1,l.clientHeight-8-t.offsetHeight);
 t.setPointerCapture(e.pointerId);t.classList.add("is-drag");
 const mv=ev=>{l.scrollTop=s0+(ev.clientY-y0)*k};
 const up=()=>{t.classList.remove("is-drag");t.removeEventListener("pointermove",mv);t.removeEventListener("pointerup",up);t.removeEventListener("pointercancel",up)};
 t.addEventListener("pointermove",mv);t.addEventListener("pointerup",up);t.addEventListener("pointercancel",up)});

/* search for any menu whose rows carry data-n (lower-case search text): hides rows that don't match, shows .rx-none when none do */
function ddFilter(el){const q=el.value.trim().toLowerCase(),pop=el.closest(".rx-pop");let n=0;
 pop.querySelectorAll(".rx-pop-list [data-n]").forEach(m=>{const hit=!q||m.dataset.n.includes(q);m.hidden=!hit;m.style.display=hit?"":"none";if(hit)n++});
 const no=pop.querySelector(".rx-none");if(no)no.hidden=n>0}
/* ↓ in a menu's search moves to the first visible option */
document.addEventListener("keydown",e=>{if(e.key!=="ArrowDown"||!e.target.classList||!e.target.classList.contains("rx-search"))return;
 const l=ddListOf(e.target),f=l&&[...l.querySelectorAll("button:not(:disabled),input:not(:disabled)")].find(x=>x.offsetParent);
 if(f){e.preventDefault();f.focus()}});
