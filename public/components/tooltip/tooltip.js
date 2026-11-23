/* ===== Tooltip (spec: Tooltip.tsx · usage: README.md · styles: tooltip.css · Figma Tooltip 4759:29052)
   Any element with data-tip="…" gets a dark tooltip on hover or keyboard focus. One shared bubble floats on <body>
   (position:fixed), so scrollers and sticky cells can't clip it.

     data-tip="Remove"          the text (required)
     data-tip-pos="top"         where the bubble sits; the pointer is on the opposite side:
                                  top (default)  → pointer bottom center    bottom       → pointer top center
                                  top-start      → pointer bottom left      bottom-start → pointer top left
                                  top-end        → pointer bottom right     bottom-end   → pointer top right
                                  left           → pointer right            right        → pointer left
     data-tip-arrow="none"      no pointer
     data-tip-delay="300"       hover waits this many ms before showing (keyboard focus shows at once)

   top/bottom flip when there's no room on that side. It hides when the pointer leaves the element, on mousedown,
   scroll, blur, Escape, and when the element is re-rendered away. Hidden while the element's own kebab menu is open. ===== */
const TIP_GAP=4,TIP_EDGE=8,TIP_ARROW_W=16,TIP_ARROW_INSET=12;   // keep in sync with Tooltip.tsx TOOLTIP_TOKENS
const TIP_POS=["top","top-start","top-end","bottom","bottom-start","bottom-end","left","right"];
const tipEl=document.createElement("div");tipEl.className="lb-tip";tipEl.setAttribute("role","tooltip");tipEl.id="lbTip";tipEl.hidden=true;
tipEl.innerHTML='<div class="lb-tip__bubble"></div><span class="lb-tip__arrow" aria-hidden="true"><img src="/assets/icons/tooltip-pointer.svg" width="16" height="8.5" alt=""></span>';
document.body.appendChild(tipEl);
let tipFor=null,tipWait=0,tipWaitFor=null;

function tipPlace(el,pos){
 const r=el.getBoundingClientRect(),W=tipEl.offsetWidth,H=tipEl.offsetHeight,cx=r.left+r.width/2,cy=r.top+r.height/2;
 const side=pos.split("-")[0],align=pos.split("-")[1]||"center",arrow=tipEl.querySelector(".lb-tip__arrow");
 const clampX=x=>Math.max(TIP_EDGE,Math.min(x,innerWidth-W-TIP_EDGE)),clampY=y=>Math.max(TIP_EDGE,Math.min(y,innerHeight-H-TIP_EDGE));
 let x,y;
 if(side==="top"||side==="bottom"){
  const off=TIP_ARROW_INSET+TIP_ARROW_W/2;   // pointer tip sits 20px in from the bubble's edge for start/end
  x=clampX(align==="start"?cx-off:align==="end"?cx-W+off:cx-W/2);
  y=side==="top"?r.top-H-TIP_GAP:r.bottom+TIP_GAP;
  arrow.style.top="";arrow.style.left=Math.max(TIP_EDGE,Math.min(cx-x-TIP_ARROW_W/2,W-TIP_ARROW_W-TIP_EDGE))+"px";
 }else{
  y=clampY(cy-H/2);x=side==="left"?r.left-W-TIP_GAP:r.right+TIP_GAP;
  arrow.style.left="";arrow.style.top=Math.max(TIP_EDGE,Math.min(cy-y-TIP_ARROW_W/2,H-TIP_ARROW_W-TIP_EDGE))+"px";
 }
 tipEl.style.left=x+"px";tipEl.style.top=y+"px";
 return {side,y}}

function tipShow(el){
 if(el.closest(".kebab")&&el.closest(".kebab").querySelector(".menu"))return tipHide();
 clearTimeout(tipWait);tipWaitFor=null;tipFor=el;
 let pos=TIP_POS.includes(el.dataset.tipPos)?el.dataset.tipPos:"top";
 tipEl.querySelector(".lb-tip__bubble").textContent=el.dataset.tip;
 tipEl.dataset.arrow=el.dataset.tipArrow==="none"?"none":"";tipEl.dataset.pos=pos;tipEl.hidden=false;
 el.setAttribute("aria-describedby",[el.getAttribute("aria-describedby"),"lbTip"].filter(Boolean).join(" "));
 const p=tipPlace(el,pos),H=tipEl.offsetHeight;
 /* not enough room above / below: flip to the other side */
 if(p.side==="top"&&p.y<TIP_EDGE){pos=pos.replace("top","bottom");tipEl.dataset.pos=pos;tipPlace(el,pos)}
 else if(p.side==="bottom"&&p.y+H>innerHeight-TIP_EDGE){pos=pos.replace("bottom","top");tipEl.dataset.pos=pos;tipPlace(el,pos)}}

function tipHide(){
 if(tipFor){const d=(tipFor.getAttribute("aria-describedby")||"").split(" ").filter(x=>x&&x!=="lbTip").join(" ");d?tipFor.setAttribute("aria-describedby",d):tipFor.removeAttribute("aria-describedby")}
 tipFor=null;tipEl.hidden=true;clearTimeout(tipWait);tipWaitFor=null}

/* hover: show (after data-tip-delay if set) */
document.addEventListener("mouseover",e=>{const el=e.target.closest&&e.target.closest("[data-tip]");
 if(!el){if(tipFor||tipWaitFor)tipHide();return}
 if(el===tipFor||el===tipWaitFor)return;
 tipHide();const d=+el.dataset.tipDelay||0;
 if(!d)return tipShow(el);
 tipWaitFor=el;tipWait=setTimeout(()=>{tipWaitFor=null;if(el.isConnected&&el.matches(":hover"))tipShow(el)},d)});
/* stop hovering → hide at once (also when the pointer leaves the window or the element disappears under it) */
document.addEventListener("mouseout",e=>{const el=tipFor||tipWaitFor;if(!el)return;if(!e.relatedTarget||!el.contains(e.relatedTarget))tipHide()});
document.addEventListener("pointermove",()=>{if(tipFor&&tipFor!==document.activeElement&&(!tipFor.isConnected||!tipFor.matches(":hover")))tipHide()},{passive:true});
/* keyboard */
document.addEventListener("focusin",e=>{const el=e.target.closest&&e.target.closest("[data-tip]");if(el&&el.matches(":focus-visible"))tipShow(el)});
document.addEventListener("focusout",()=>tipHide());
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&tipFor)tipHide()});
document.addEventListener("mousedown",()=>tipHide(),true);
addEventListener("scroll",()=>tipHide(),true);
addEventListener("blur",()=>tipHide());
const _renderTip=render;render=function(...a){const r=_renderTip(...a);if(tipFor&&!tipFor.isConnected)tipHide();return r};
/* older name used by a few layers */
const lpTipHide=tipHide;
