/* ===== Listing / landing pages (Review Cycles, Questionnaires) follow the Figma listing spec
   (Employee-Onboarding 4759:28894). Tags <body> with .listpage so src/styles/25-listing-pages.css
   can style just these two views, and splits #main into the two sections the design has:
     .pagehead  (Sub Header: title row + tabs, full width, 24/32/0/32 padding)
     .pagebody  (Body: everything else, 16px top/bottom, 32px left/right)
   render() (app.js) already moves the title + tabs into .pagehead; this wraps the rest in .pagebody. */
const LISTPAGE_VIEWS=["cycles","templates"];
const _renderListpage=render;
render=function(...a){_renderListpage(...a);
 const on=LISTPAGE_VIEWS.includes(S.view);document.body.classList.toggle("listpage",on);
 if(!on)return;
 const m=$("#main"),head=m.querySelector(":scope>.pagehead"),body=document.createElement("div");body.className="pagebody";
 [...m.children].filter(c=>c!==head).forEach(c=>body.appendChild(c));m.appendChild(body);
 lsColApply();
 // the split shifts the table down by the body padding, so re-place things earlier render wrappers measured
 if(typeof rowMenuPlace==="function")rowMenuPlace();
 if(typeof clPinAll==="function")clPinAll()};

/* ===== Resizable columns (Review Cycles, Questionnaires). Each sortable header (lsTh in app.js) has a handle on its
   right edge; checkbox and action columns have none. The first drag freezes every column at its current width
   (table-layout:fixed), so only the dragged column changes; text that no longer fits is cut with "…".
   S.colW[view] = {columnKey: px}, kept across re-renders, tabs and sorting. Checkbox / action columns keep the
   width they had; if the columns don't fill the card, the last data column takes the spare room. */
const LS_COL_MIN=80;
const lsColKey=(th,i)=>th.dataset.k||(th.classList.contains("cbx")?"cbx":th.classList.contains("act")?"act":"i"+i);
function lsColApply(){document.querySelectorAll("table").forEach(t=>{const h=t.querySelector("th.ls-th[data-view]");if(!h)return;
 const W=(S.colW||{})[h.dataset.view];if(!W)return;
 const ths=[...t.querySelectorAll("thead th")],ws=ths.map((th,i)=>th.classList.contains("ls-th")&&W[lsColKey(th,i)]?W[lsColKey(th,i)]:th.getBoundingClientRect().width);
 const avail=t.parentElement.clientWidth,sum=ws.reduce((a,b)=>a+b,0),last=ths.map(th=>th.classList.contains("ls-th")).lastIndexOf(true);
 if(sum<avail&&last>=0)ws[last]+=avail-sum;
 ths.forEach((th,i)=>th.style.width=ws[i]+"px");t.style.width=Math.max(sum,avail)+"px";t.classList.add("ls-fixed")})}
function lsRzStart(e,view,k){e.preventDefault();e.stopPropagation();
 const rz=e.currentTarget,th=rz.closest("th"),t=th.closest("table"),L=S.colW||(S.colW={});
 if(!L[view]){L[view]={};[...t.querySelectorAll("thead th.ls-th")].forEach(h=>L[view][h.dataset.k]=h.getBoundingClientRect().width)}
 lsColApply();
 const x0=e.clientX,w0=th.getBoundingClientRect().width;
 rz.classList.add("is-drag");document.body.classList.add("ls-resizing");
 const move=ev=>{L[view][k]=Math.max(LS_COL_MIN,Math.round(w0+ev.clientX-x0));lsColApply()};
 const up=()=>{removeEventListener("mousemove",move);removeEventListener("mouseup",up);rz.classList.remove("is-drag");document.body.classList.remove("ls-resizing");
  if(typeof clPinAll==="function")clPinAll()};
 addEventListener("mousemove",move);addEventListener("mouseup",up)}

/* ===== Action columns hug their buttons in every table.
   Auto-layout tables do it in CSS (width:1%; nowrap). Fixed-layout tables (.cd-tbl-fixed, cycle detail People tab)
   size columns from <col>, so measure the widest action cell (buttons are right-aligned, so the span from the
   leftmost to the rightmost button) and set the action <col> to that plus the cell's padding. */
function actColFit(){document.querySelectorAll("table.cd-tbl-fixed").forEach(t=>{const col=t.querySelector("col.c-act");if(!col)return;
 col.style.width="";   // measure at the CSS width (150px) so a previously shrunk column can't wrap wider cells
 let w=0,pad=0;t.querySelectorAll("td.cd-act").forEach(td=>{const bs=[...td.querySelectorAll("button")].filter(b=>!b.closest(".menu"));if(!bs.length)return;
  const rs=bs.map(b=>b.getBoundingClientRect());w=Math.max(w,Math.max(...rs.map(r=>r.right))-Math.min(...rs.map(r=>r.left)));
  const c=getComputedStyle(td);pad=parseFloat(c.paddingLeft)+parseFloat(c.paddingRight)});
 if(w)col.style.width=Math.ceil(w+pad)+"px"})}
const _renderActFit=render;render=function(...a){_renderActFit(...a);actColFit()};
addEventListener("resize",actColFit);

/* Tooltip: moved to the shared component public/components/tooltip (tooltip.js / tooltip.css / Tooltip.tsx) */
