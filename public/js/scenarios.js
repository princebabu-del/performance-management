/* ================= Prototype scenarios: floating button (bottom-left) + menu =================
   Replaces the old yellow prototype bar. Shortcut: ⌘/Ctrl + / toggles the menu; Esc closes it. */
(function(){
const USERS=[
 ["admin","Admin","Rachel Kim · HR admin"],
 ["super","Manager","Dana Whitfield · superintendent over 4 crews"],
 ["foreman","Foreman","Luis Delgado · Roofing Crew A"],
 ["worker","Worker","Miguel Torres · on his phone"],
 ["payroll","Payroll admin","Priya Shah · view-only cycle status and results"]
];
const STATES=[[true,"Empty","Brand-new company, no review cycles yet"],[false,"Filled","Company with running review cycles"]];
const isMac=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent);
const KEY=(isMac?"⌘":"Ctrl")+" /";
let open=false;

const root=document.createElement("div");
root.className="scn";
root.innerHTML=`<div class="scn-panel" id="scnPanel" role="dialog" aria-modal="false" aria-labelledby="scnTitle" hidden></div>
<button type="button" class="scn-fab" id="scnFab" aria-haspopup="dialog" aria-expanded="false" aria-controls="scnPanel" title="Prototype scenarios (${KEY})">
 <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
 <span class="scn-fab-l">Scenarios</span>
</button>`;
document.body.appendChild(root);
const fab=root.querySelector("#scnFab"),panel=root.querySelector("#scnPanel");

function opt(on,label,sub,act,disabled){
 return `<button type="button" class="scn-opt${on?" on":""}" role="radio" aria-checked="${on}" ${disabled?`disabled aria-disabled="true"`:""} data-act="${act}">
  <span class="scn-radio" aria-hidden="true"></span><span class="scn-txt"><b>${esc(label)}</b><span>${esc(sub)}</span></span></button>`;
}
function draw(){
 const R=(S&&S.role)||"admin",adm=R==="admin";
 panel.innerHTML=`<div class="scn-hd"><div><h2 id="scnTitle">Prototype scenarios</h2><div class="scn-kbd">Toggle with <kbd>${KEY}</kbd></div></div>
  <button type="button" class="scn-x" aria-label="Close scenarios" data-act="close">✕</button></div>
 <div class="scn-body">
  <section><h3 id="scnU">User</h3><div role="radiogroup" aria-labelledby="scnU">${USERS.map(([r,l,s])=>opt(R===r,l,s,"role:"+r)).join("")}</div></section>
  <section><h3 id="scnS">State</h3><div role="radiogroup" aria-labelledby="scnS">${STATES.map(([n,l,s])=>opt(!!S.newCo===n,l,s,"state:"+n,n&&!adm)).join("")}</div>
   ${adm?"":`<p class="scn-note">The empty state is only available for Admin.</p>`}</section>
 </div>
 <div class="scn-ft"><button type="button" class="btn scn-reset" data-act="reset">Reset demo</button></div>`;
}
function setOpen(v,focusFab){
 open=v;panel.hidden=!v;fab.setAttribute("aria-expanded",String(v));fab.classList.toggle("on",v);
 if(v){draw();const f=panel.querySelector(".scn-opt.on")||panel.querySelector("button");f&&f.focus()}
 else if(focusFab)fab.focus();
}
fab.addEventListener("click",e=>{e.stopPropagation();setOpen(!open)});
panel.addEventListener("click",e=>{
 e.stopPropagation();
 const b=e.target.closest("[data-act]");if(!b||b.disabled)return;
 const [a,v]=b.dataset.act.split(":");
 if(a==="close")return setOpen(false,true);
 if(a==="role"){if(v!==S.role)setRole(v)}
 else if(a==="state"){const n=v==="true";if(n!==!!S.newCo){setMode(n);toast(n?"Showing the empty state.":"Showing the filled state.")}}
 else if(a==="reset")resetDemo();
 if(open)draw();
});
document.addEventListener("click",e=>{if(open&&!root.contains(e.target))setOpen(false)});
document.addEventListener("keydown",e=>{
 if((e.metaKey||e.ctrlKey)&&!e.altKey&&(e.key==="/"||e.code==="Slash")){e.preventDefault();setOpen(!open,open);return}
 if(e.key==="Escape"&&open){e.stopImmediatePropagation();setOpen(false,true)}
},true);

/* keep the panel in sync when the role/state changes elsewhere (e.g. "Try it as Miguel") */
const _rn=renderNav;
renderNav=function(){_rn();if(open)draw()};
})();
