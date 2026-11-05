/* ===== Date field: always shows MM/DD/YYYY (native <input type="date"> follows the browser locale, e.g. dd/mm/yyyy).
   dateField(opts) → HTML string
     opts.value     ISO date "YYYY-MM-DD" or ""
     opts.min/max   ISO bounds (optional) — days outside are disabled
     opts.name      adds a hidden <input name> carrying the ISO value, for forms
     opts.cls       extra classes on the field button (e.g. "fc-inp rx-date")
     opts.aria      accessible label
     opts.disabled  true = read-only
     opts.onchange  JS run after a pick, with `this` = the field button; `this.value` is the ISO date ("" when cleared)
   The field gets class "empty" while no date is set. ===== */
const LDP_MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const ldpMDY=iso=>{if(!iso)return"";const[y,m,d]=iso.split("-");return `${m}/${d}/${y}`};
const ldpISO=(y,m,d)=>`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const ldpAttr=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
function dateField(o={}){
 const v=o.value||"";
 return `<span class="ldp"><button type="button" class="ldp-btn ${o.cls||""} ${v?"":"empty"}" value="${ldpAttr(v)}" data-min="${ldpAttr(o.min)}" data-max="${ldpAttr(o.max)}" data-onchange="${ldpAttr(o.onchange)}"
  aria-haspopup="dialog" aria-expanded="false" ${o.aria?`aria-label="${ldpAttr(o.aria)}${v?`, ${ldpMDY(v)}`:""}"`:""} ${o.disabled?"disabled":""} onclick="ldpOpen(this)"><span class="ldp-v">${v?ldpMDY(v):"MM/DD/YYYY"}</span><img src="/assets/calendar.svg" width="20" height="20" alt=""></button>${o.name?`<input type="hidden" name="${ldpAttr(o.name)}" value="${ldpAttr(v)}">`:""}</span>`}
const LDP={btn:null,y:0,m:0};
function ldpOpen(btn){
 if(LDP.btn===btn)return ldpClose();
 ldpClose();LDP.btn=btn;
 const base=btn.value?new Date(btn.value+"T12:00:00"):btn.dataset.min?new Date(btn.dataset.min+"T12:00:00"):new Date();
 LDP.y=base.getFullYear();LDP.m=base.getMonth();btn.setAttribute("aria-expanded","true");ldpDraw();
 const f=document.querySelector("#ldpPop button.sel")||document.querySelector("#ldpPop .ldp-days button:not(:disabled)");if(f)f.focus()}
function ldpClose(){const p=document.getElementById("ldpPop");if(p)p.remove();if(LDP.btn)LDP.btn.setAttribute("aria-expanded","false");LDP.btn=null}
function ldpShift(n){const d=new Date(LDP.y,LDP.m+n,1);LDP.y=d.getFullYear();LDP.m=d.getMonth();ldpDraw()}
function ldpPick(iso){
 const b=LDP.btn;if(!b)return;
 b.value=iso;b.classList.toggle("empty",!iso);b.querySelector(".ldp-v").textContent=iso?ldpMDY(iso):"MM/DD/YYYY";
 const h=b.parentNode.querySelector("input[type=hidden]");if(h)h.value=iso;
 ldpClose();b.focus();
 const code=b.dataset.onchange;if(code)new Function(code).call(b)}
function ldpDraw(){
 const b=LDP.btn;if(!b)return;
 let p=document.getElementById("ldpPop");
 if(!p){p=document.createElement("div");p.id="ldpPop";p.className="ldp-pop";p.setAttribute("role","dialog");p.setAttribute("aria-label","Choose date");document.body.appendChild(p)}
 const{y,m}=LDP,first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),today=ldpISO(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()),min=b.dataset.min,max=b.dataset.max;
 let cells="";for(let i=0;i<first;i++)cells+="<span></span>";
 for(let d=1;d<=n;d++){const iso=ldpISO(y,m,d),off=(min&&iso<min)||(max&&iso>max);
  cells+=`<button type="button" class="${iso===b.value?"sel":""} ${iso===today?"t":""}" ${off?"disabled":""} onclick="ldpPick('${iso}')" aria-label="${LDP_MONTHS[m]} ${d}, ${y}" ${iso===b.value?'aria-pressed="true"':""}>${d}</button>`}
 p.innerHTML=`<div class="ldp-h"><button type="button" class="ldp-nav" onclick="ldpShift(-1)" aria-label="Previous month">‹</button><span>${LDP_MONTHS[m]} ${y}</span><button type="button" class="ldp-nav" onclick="ldpShift(1)" aria-label="Next month">›</button></div>
  <div class="ldp-wk">${["Su","Mo","Tu","We","Th","Fr","Sa"].map(x=>`<span>${x}</span>`).join("")}</div><div class="ldp-days">${cells}</div>
  ${b.value?`<div class="ldp-f"><button type="button" class="ldp-clear" onclick="ldpPick('')">Clear</button></div>`:""}`;
 const r=b.getBoundingClientRect(),w=p.offsetWidth,hgt=p.offsetHeight;
 let x=Math.min(r.left,innerWidth-w-8),top=r.bottom+6;if(top+hgt>innerHeight-8&&r.top-hgt-6>8)top=r.top-hgt-6;
 p.style.left=Math.max(8,x)+"px";p.style.top=top+"px"}
document.addEventListener("mousedown",e=>{if(LDP.btn&&!e.target.closest("#ldpPop")&&!e.target.closest(".ldp-btn"))ldpClose()});
document.addEventListener("keydown",e=>{if(LDP.btn&&e.key==="Escape"){const b=LDP.btn;ldpClose();b.focus()}});
addEventListener("scroll",e=>{if(LDP.btn&&!(e.target instanceof Element&&e.target.closest&&e.target.closest("#ldpPop")))ldpClose()},true);
addEventListener("resize",()=>ldpClose());
