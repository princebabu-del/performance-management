/* ===== Review Cycles and Questionnaires tables: "Columns" opens an anchored dropdown (not a modal).
   One row per column: drag handle · checkbox · name. Checking applies at once. Locked columns (Cycle Name) are checked,
   greyed and can't move. Drag a row by its handle to reorder (or focus the handle and press ↑/↓).
   Sits 4px under the button; the button shows a grey focus ring while open. Closes on outside click, Escape, or leaving the page. ===== */
/* per-page column model: the column list, its current order, the visible columns, and where they're kept in S */
/* (Drafts tabs have their own column set, kept under their own keys) */
const COLV={cycles:{cols:()=>clCols(),order:()=>clOrder(),on:()=>clColsOn(),onKey:()=>clDraftTab()?"cycColsD":"cycCols",orderKey:()=>clDraftTab()?"cycOrderD":"cycOrder"},
 templates:{cols:()=>tplCols(),order:()=>tplOrder(),on:()=>tplColsOn(),onKey:()=>tplDraftTab()?"tplColsD":"tplCols",orderKey:()=>tplDraftTab()?"tplOrderD":"tplOrder"}};
const colV=()=>{const v=COLV[S.view];return v?{...v,onKey:v.onKey(),orderKey:v.orderKey()}:null};
const _colMenuDd=colMenu;
colMenu=function(e){if(!colV())return _colMenuDd(e);if(e)e.stopPropagation();S.colOpen=!S.colOpen;S.menu=null;colSync(true)};
const colBtn=()=>document.querySelector('.tools button[onclick^="colMenu"]');
function colRows(){const V_=colV(),on=V_.on().map(x=>x.k);
 return V_.order().map(k=>{const x=V_.cols().find(c=>c.k===k),lk=!!x.lock,ck=lk||on.includes(k);
  return `<div class="col-row${lk?" lk":""}" data-k="${k}" ${lk?"":'draggable="true"'}>
   <button type="button" class="col-h" ${lk?'disabled aria-hidden="true" tabindex="-1"':`aria-label="Reorder ${esc(x.l)}. Use up and down arrow keys" onkeydown="colKey(event,'${k}')"`}>${ic("drag")}</button>
   <label class="col-l"><input type="checkbox" class="rx-cb col-cb" ${ck?"checked":""} ${lk?"disabled":""} onchange="colToggle('${k}',this.checked)"><span>${esc(x.l)}</span></label></div>`}).join("")}
/* draw = rebuild the list (open / reorder); otherwise only keep the open state and position in sync after a page render */
function colSync(draw){const b=colBtn();let p=document.getElementById("colPop");
 if(!S.colOpen||!colV()||!b){if(p)p.remove();S.colOpen=false;if(b){b.classList.remove("col-open");b.setAttribute("aria-expanded","false")}return}
 b.classList.add("col-open");b.setAttribute("aria-haspopup","true");b.setAttribute("aria-expanded","true");b.setAttribute("aria-controls","colPop");
 if(!p){p=document.createElement("div");p.id="colPop";p.className="col-pop";p.setAttribute("role","group");p.setAttribute("aria-label","Show and order columns");document.body.appendChild(p);draw=true;colDnD(p)}
 if(draw)p.innerHTML=colRows();
 const r=b.getBoundingClientRect(),w=p.offsetWidth,h=p.offsetHeight;
 let top=r.bottom+4;if(top+h>innerHeight-8&&r.top-h-4>8)top=r.top-h-4;
 p.style.top=top+"px";p.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+"px"}
function colClose(focus){if(!S.colOpen)return;S.colOpen=false;colSync();if(focus){const b=colBtn();if(b)b.focus()}}
function colToggle(k,v){const V_=colV();V_.on();const cur=S[V_.onKey];S[V_.onKey]=v?[...new Set([...cur,k])]:cur.filter(x=>x!==k);render()}
function colMove(k,to){const V_=colV(),ord=V_.order(),o=ord.filter(x=>!V_.cols().find(c=>c.k===x).lock),lock=ord.length-o.length,i=o.indexOf(k);
 to=Math.max(0,Math.min(o.length-1,to-lock));if(i<0||i===to)return false;o.splice(i,1);o.splice(to,0,k);S[V_.orderKey]=o;render();colSync(true);return true}
function colKey(e,k){if(e.key!=="ArrowUp"&&e.key!=="ArrowDown")return;e.preventDefault();const i=colV().order().indexOf(k);
 if(colMove(k,i+(e.key==="ArrowUp"?-1:1))){const h=document.querySelector(`#colPop .col-row[data-k="${k}"] .col-h`);if(h)h.focus()}}
/* drag only starts from the handle; the drop line shows above/below the row under the pointer */
function colDnD(p){let from=null,grab=false;
 p.addEventListener("pointerdown",e=>{grab=!!e.target.closest(".col-h:not(:disabled)")});
 p.addEventListener("dragstart",e=>{const r=e.target.closest(".col-row");if(!r||!grab||r.classList.contains("lk")){e.preventDefault();return}
  from=r.dataset.k;r.classList.add("drag");e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",from)});
 p.addEventListener("dragover",e=>{if(!from)return;const r=e.target.closest(".col-row");p.querySelectorAll(".bf,.af").forEach(x=>x.classList.remove("bf","af"));
  if(!r||r.classList.contains("lk")&&r.nextElementSibling&&r.nextElementSibling.classList.contains("lk"))return;
  e.preventDefault();const rc=r.getBoundingClientRect(),after=r.classList.contains("lk")||e.clientY>rc.top+rc.height/2;r.classList.add(after?"af":"bf")});
 p.addEventListener("drop",e=>{if(!from)return;e.preventDefault();const r=p.querySelector(".bf,.af");if(!r)return;
  const ord=colV().order(),k=from;let to=ord.indexOf(r.dataset.k)+(r.classList.contains("af")?1:0);if(ord.indexOf(k)<to)to--;from=null;colMove(k,to)||colSync(true)});
 p.addEventListener("dragend",()=>{from=null;p.querySelectorAll(".drag,.bf,.af").forEach(x=>x.classList.remove("drag","bf","af"))})}
const _renderCol=render;render=function(...a){_renderCol(...a);colSync()};
document.addEventListener("click",e=>{if(S.colOpen&&!e.target.closest("#colPop")&&!e.target.closest('button[onclick^="colMenu"]'))colClose()},true);
document.addEventListener("keydown",e=>{if(S.colOpen&&e.key==="Escape"){e.stopImmediatePropagation();colClose(true)}},true);
addEventListener("resize",()=>colSync());
addEventListener("scroll",e=>{if(S.colOpen&&!(e.target instanceof Element&&e.target.closest("#colPop")))colSync()},true);
