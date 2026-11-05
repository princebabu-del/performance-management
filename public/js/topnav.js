/* ================= Lumber Topbar (port of TopNav.tsx) + Performance tab: every role version ================= */
(function(){
const ICON={
 down:'<path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>',
 right:'<path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>',
 gear:'<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>',
 logout:'<path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>',
 bell:'<path d="M12 22c1.1 0 2-.89 2-2h-4c0 1.11.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>'
};
const svg=(k,c)=>`<svg viewBox="0 0 24 24" aria-hidden="true"${c?` class="${c}"`:""}>${ICON[k]}</svg>`;
const LOGO='<img class="lt-logo-img" src="/assets/Lumber-logo-full.svg" width="141" height="36" alt="Lumber">';

/* ---- nav data: bar order Time · Expenses · Pay · Scheduler · Resources · Reports · Documents · HR · Learning · Performance · Forms.
   Credential management lives inside HR. "More" only appears as a fallback when the screen is too narrow for every tab. ---- */
const ALL=[
 {link:"timesheet",title:"Time",subs:[["weekly","Timesheets"],["overview","Timesheet overview"],["holiday","Holiday config"],["timeoff","Time off requests"],["payout_request","Payout requests"],["equipment","Equipment timesheets"]]},
 {link:"expenses",title:"Expenses"},
 {link:"payroll",title:"Pay",subs:[["view","Payroll validation"],["overview","Payroll overview"],["drafts","Payroll drafts"],["history","Payroll history"],["manage","Company info"],["workforceJunctionBenefit","Benefits"]]},
 {link:"scheduler",title:"Scheduler",subs:[["projects","Project"],["serviceorders","Service order"]]},
 {link:"resources",title:"Resources",subs:[["users","Users",[["onboarding","Onboarding users"],["active","Active users"]]],["map","Map"],["equipment","Equipment"]]},
 {link:"reports",title:"Reports"},
 {link:"documents",title:"Documents",subs:[["project","Project"],["payroll","Payroll"],["onboarding","Onboarding"],["data_vault","Data vault"]]},
 {link:"hr",title:"HR",subs:[["hiring","Hiring"],["onboarding","Onboarding"],["lumber_onboarding","Templates"],["hr_onboarding","HR onboarding"],["benefit_admin","Benefits eligibility grouping"],["benefit_admin_console","SSO to benefits junction"],["credentials","Credential management"]]},
 {link:"learning",title:"Learning",subs:[["courses","Courses"],["assignments","Assignments"],["certifications","Certifications"]]},
 {link:"performance",title:"Performance",perf:true},
 {link:"forms",title:"Forms"}
];
const NOTIF=15;
const BAR=ALL.filter(x=>!x.inMore),MORE_ONLY=ALL.filter(x=>x.inMore);

/* ---- Performance tab versions (one per role; items come from the prototype's live ROLE_NAV) ---- */
const ROLES=[
 ["admin","HR Admin","Rachel Kim"],
 ["super","Superintendent","Dana Whitfield"],
 ["foreman","Foreman","Luis Delgado"],
 ["worker","Worker (phone)","Miguel Torres"],
 ["payroll","Payroll admin","Priya Shah"]
];
const ROLE_TOAST={admin:"Viewing as HR admin.",super:"Viewing as Dana Whitfield, superintendent over 4 crews.",foreman:"Viewing as Luis Delgado, foreman of Roofing Crew A.",worker:"Viewing as Miguel Torres on his phone.",payroll:"Viewing as Priya Shah, payroll admin (view only)."};
const role=()=>(S&&S.role)||"admin";
const safe=f=>{try{return f()}catch(e){return 0}};
function badgeFor(r,v){
 if(r!==role())return 0;
 if(v==="home")return safe(()=>r==="admin"&&typeof myTaskCount==="function"?myTaskCount():attention().length);
 if(v==="crew")return safe(()=>crewTodo().length);
 if(v==="outliers")return safe(()=>outliers().filter(o=>!o.done).length);
 return 0;
}
function perfGo(r,v){
 closeAll();if(S)S.pmOpen=false;
 if(role()!==r){S.role=r;if(typeof closeLayer==="function")closeLayer();if(r!=="admin"&&S.newCo)init(false);nav(v);toast(ROLE_TOAST[r])}
 else nav(v);
}
// The role is picked in the floating Scenarios menu (bottom-left); the dropdown only lists that role's Performance tabs.
function perfMenu(){
 const r=role();
 const items=(ROLE_NAV[r]||[]).map(([v,t])=>({label:t,sel:navOn(v),badge:badgeFor(r,v),go:()=>perfGo(r,v),testid:"nav-performance-"+v}));
 /* Performance Settings lives only under the gear menu (Company settings) */
 return items;
}

const soon=t=>()=>{closeAll();toast(`${t} isn't part of this Performance prototype.`)};
function subMenu(item){
 if(item.perf)return perfMenu();
 return (item.subs||[]).map(([l,t,kids])=>{
  if(item.link==="resources"&&l==="users")return {label:t,sel:S.view==="users",children:kids.map(([kl,kt])=>({label:kt,sel:S.view==="users"&&kl==="active",go:()=>{closeAll();nav("users")}}))};
  return {label:t,go:soon(t)};
 });
}
const selectedApp=()=>S&&S.view==="users"?"resources":"performance";

/* ---- generic MUI-like menu engine (stack of open menus) ---- */
let stack=[];        // [{el, anchor, kind}]
function closeFrom(level){
 stack.slice(level).forEach(m=>{m.el.remove();if(m.anchor){m.anchor.classList.remove("open","hot");m.anchor.setAttribute&&m.anchor.getAttribute("aria-expanded")&&m.anchor.setAttribute("aria-expanded","false")}});
 stack=stack.slice(0,level);
}
function closeAll(){closeFrom(0)}
function place(el,anchor,pos){
 const r=anchor.getBoundingClientRect(),w=el.offsetWidth,h=el.offsetHeight,vw=innerWidth,vh=innerHeight;
 let x,y;
 if(pos==="right"){x=r.right;y=r.top-8;if(x+w>vw-8)x=Math.max(8,r.left-w)}
 else{x=r.left;y=r.bottom+4}
 x=Math.max(16,Math.min(x,vw-w-16));y=Math.max(8,Math.min(y,vh-h-8));
 el.style.left=x+"px";el.style.top=y+"px";
}
function openMenu(level,anchor,items,opt={}){
 closeFrom(level);
 const el=document.createElement("div");
 el.className="lt-menu "+(opt.cls||"");el.setAttribute("role","menu");
 const list=document.createElement("div");list.className="lt-list";el.appendChild(list);
 if(opt.cap){const c=document.createElement("div");c.className="lt-cap";c.textContent=opt.cap;list.appendChild(c)}
 items.forEach(it=>{
  if(it.hr){const h=document.createElement("hr");h.className="lt-hr";list.appendChild(h);return}
  const b=document.createElement("button");
  b.type="button";b.className="lt-mi"+(it.sel?" sel":"");b.setAttribute("role","menuitem");
  if(it.testid)b.dataset.testid=it.testid;
  b.innerHTML=`<span class="lt-l">${esc(it.label)}${it.sub?`<span class="lt-sub">${esc(it.sub)}</span>`:""}</span>${it.badge?`<span class="lt-badge">${it.badge}</span>`:""}${it.children?svg("right"):""}`;
  const openKids=()=>{if(stack[level+1]&&stack[level+1].anchor===b)return;list.querySelectorAll(".lt-mi.hot").forEach(x=>x.classList.remove("hot"));b.classList.add("hot");openMenu(level+1,b,it.children,{pos:"right",cls:opt.childCls||"nested"})};
  b.addEventListener("mouseenter",()=>{if(it.children)openKids();else{closeFrom(level+1);list.querySelectorAll(".lt-mi.hot").forEach(x=>x.classList.remove("hot"))}});
  b.addEventListener("click",e=>{e.stopPropagation();if(it.children){openKids();const f=stack[level+1]&&stack[level+1].el.querySelector(".lt-mi");if(f&&e.detail===0)f.focus()}else if(it.go)it.go()});
  list.appendChild(b);
 });
 if(opt.after)el.appendChild(opt.after);
 el.addEventListener("click",e=>e.stopPropagation());
 document.body.appendChild(el);
 place(el,anchor,opt.pos);
 if(level===0&&anchor.classList){anchor.classList.add("open");anchor.setAttribute("aria-expanded","true")}
 stack.push({el,anchor,kind:opt.cls});
 return el;
}
document.addEventListener("click",()=>{if(stack.length)closeAll()});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&stack.length){const top=stack[stack.length-1];closeFrom(stack.length-1);top.anchor&&top.anchor.focus&&top.anchor.focus()}
 if((e.key==="ArrowDown"||e.key==="ArrowUp")&&stack.length){const m=stack[stack.length-1].el,bs=[...m.querySelectorAll(".lt-mi")],i=bs.indexOf(document.activeElement);if(bs.length){e.preventDefault();bs[(i+(e.key==="ArrowDown"?1:-1)+bs.length)%bs.length].focus()}}
 if(e.key==="ArrowLeft"&&stack.length>1){const top=stack[stack.length-1];closeFrom(stack.length-1);top.anchor.focus()}
 if(e.key==="ArrowRight"&&stack.length&&document.activeElement&&document.activeElement.classList.contains("lt-mi"))document.activeElement.click();
});
addEventListener("resize",()=>{closeAll();fit()});
addEventListener("scroll",e=>{
 const bar=document.getElementById("ltBar");
 if(bar&&e.target instanceof Element&&bar.contains(e.target)){e.target.scrollLeft=0;return}   // focus/scrollIntoView inside the clipped tab strip: undo it, keep menus open
 if(stack.length)closeAll();
},true);

/* ---- bar ---- */
function appBtn(item,sel){
 const b=document.createElement("button");
 const has=!!(item.subs||item.perf);
 b.type="button";b.className="lt-app"+(sel?" on":"");b.dataset.testid=`nav-${item.link}-menu`;
 if(has)b.setAttribute("aria-haspopup","true"),b.setAttribute("aria-expanded","false");
 b.innerHTML=`<span>${esc(item.title)}</span>${has?svg("down","lt-chev"):""}`;
 b.addEventListener("click",e=>{
  e.stopPropagation();
  if(stack[0]&&stack[0].anchor===b){closeAll();return}
  if(!has){soon(item.title)();return}
  openMenu(0,b,subMenu(item),{cls:"tab",childCls:"tab nested"});
 });
 return b;
}
function moreBtn(items){
 const b=document.createElement("button");
 b.type="button";b.className="lt-app lt-more";b.setAttribute("aria-haspopup","true");b.setAttribute("aria-expanded","false");
 b.innerHTML=`<span>More</span>${svg("down","lt-chev")}`;
 b.addEventListener("click",e=>{
  e.stopPropagation();
  if(stack[0]&&stack[0].anchor===b){closeAll();return}
  openMenu(0,b,items.map(it=>{
   const kids=(it.subs||it.perf)?subMenu(it):null;
   return {label:it.title,sel:it.link===selectedApp(),children:kids,go:kids?null:soon(it.title)};
  }),{cls:"tab ov",childCls:"tab ovsub"});
 });
 return b;
}
function settingsMenu(anchor){
 const R=role(),who=(ROLES.find(x=>x[0]===R)||ROLES[0])[2];
 const prof=document.createElement("div");prof.className="lt-prof";
 prof.innerHTML=`<button type="button" class="lt-mi" data-testid="user_logout"><span style="display:flex;align-items:center;gap:12px;flex:1 0 0;min-width:0"><span class="lt-pd"><span class="lt-pname">${esc(who)}</span><span class="lt-pmail">${esc(who.toLowerCase().replace(/\s+/g,"."))}@lumberfi-demo.com</span></span></span><span style="display:flex;padding:8px">${svg("logout")}</span></button>`;
 prof.querySelector("button").addEventListener("click",soon("Log out"));
 openMenu(0,anchor,[
  {label:"Manage",go:soon("Manage")},
  {label:"Company settings",sel:S.view==="settings",go:()=>perfGo("admin","settings"),testid:"company-settings-menu-item"},
  {label:"Admin",go:soon("Admin")}
 ],{cls:"tab",after:prof});
}
let shown=BAR.length;
function primaryCount(){return BAR.length}   // start with every tab; fit() moves the overflow into "More"
function split(n){
 let vis=BAR.slice(0,n);
 const perf=BAR.find(x=>x.perf);
 if(!vis.includes(perf))vis=BAR.slice(0,Math.max(0,n-1)).concat(perf);   // Performance always stays in the bar
 return [vis,BAR.filter(x=>!vis.includes(x)).concat(MORE_ONLY)];
}
function draw(n){
 const bar=document.getElementById("ltBar");if(!bar||!S)return;
 closeAll();
 const [vis,ov]=split(n),sel=selectedApp();
 bar.innerHTML=`<div class="lt-in"><div class="lt-left"><button type="button" class="lt-logo" aria-label="Lumber home">${LOGO}</button><div class="lt-items"></div></div>
  <div class="lt-right"><button type="button" class="lt-icon lt-bell" aria-label="Notifications, ${NOTIF} unread">${svg("bell")}<span class="lt-count" aria-hidden="true">${NOTIF}</span></button><button type="button" class="lt-icon" data-testid="settings-button" aria-label="Open settings menu" aria-haspopup="true">${svg("gear")}</button></div></div>`;
 const box=bar.querySelector(".lt-items");
 vis.forEach(it=>box.appendChild(appBtn(it,it.link===sel)));
 if(ov.length)box.appendChild(moreBtn(ov));
 bar.querySelector(".lt-logo").addEventListener("click",e=>{e.stopPropagation();closeAll();perfGo(role(),ROLE_HOME[role()])});
 const [bell,gear]=bar.querySelectorAll(".lt-icon");
 bell.addEventListener("click",e=>{e.stopPropagation();soon("Notifications")()});
 gear.addEventListener("click",e=>{e.stopPropagation();if(stack[0]&&stack[0].anchor===gear){closeAll();return}settingsMenu(gear)});
 shown=n;
}
function fit(){
 let n=primaryCount();draw(n);
 const over=()=>{const l=document.querySelector("#ltBar .lt-left");return l&&l.scrollWidth>l.clientWidth+1};
 while(n>1&&over()){n--;draw(n)}   // drop more items into "More" if they still don't fit
}

/* ---- hook into the prototype's render loop ---- */
const _rn=renderNav;
renderNav=function(){_rn();fit()};
window.ltCloseTopbar=closeAll;
render();
})();
