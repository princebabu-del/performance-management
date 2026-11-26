/* ===== Refresh behaviour (prototype testing aid)
   · Refresh (Cmd/Ctrl + R, F5, the reload button): everything is kept. Just before the page unloads, the whole prototype state
     (D = demo data incl. cycles / questionnaires created this session, S = UI state incl. the cycle being edited, filters,
     tabs, selections) and the scroll position are saved to sessionStorage (this tab only). After the reload the saved state
     is drawn again with the latest code, so code changes show up on top of what you had set up.
   · Hard refresh (Cmd/Ctrl + Shift + R, Cmd + Option + R, Ctrl/Shift + F5): the keypress is caught before the reload, nothing
     is saved, and the page reopens in its initial state (demo data, nothing typed), on the same screen (address hash below).
     A shift-click on the browser's reload button can't be detected, so it behaves like a normal refresh.
   The address hash records the current screen (role, view and the few keys that pick the page: cycle + tab, list tab,
   questionnaire, review being written, cycle being edited). It's written with replaceState, so Back isn't affected.
   Anything that no longer exists after a hard refresh (e.g. a draft saved this session) falls back to its list page. ===== */
const RK_STORE="pmRefreshState",RK_HARD="pmHardRefresh";
/* hard-refresh shortcuts: flag it so pagehide doesn't save and the next load starts fresh */
addEventListener("keydown",e=>{const k=(e.key||"").toLowerCase(),mod=e.metaKey||e.ctrlKey;
 if((mod&&(e.shiftKey||e.altKey)&&k==="r")||(e.key==="F5"&&(e.ctrlKey||e.shiftKey))){try{sessionStorage.setItem(RK_HARD,"1")}catch(_){}}},true);
/* JSON with Sets, Maps and Dates kept (S.sel is a Set); functions are dropped */
const rkPack=o=>JSON.stringify(o,function(k,v){const raw=this[k];
 if(raw instanceof Set)return {__rk:"Set",v:[...raw]};if(raw instanceof Map)return {__rk:"Map",v:[...raw]};if(raw instanceof Date)return {__rk:"Date",v:raw.toISOString()};
 return typeof v==="function"?undefined:v});
const rkUnpack=t=>JSON.parse(t,(k,v)=>v&&v.__rk==="Set"?new Set(v.v):v&&v.__rk==="Map"?new Map(v.v):v&&v.__rk==="Date"?new Date(v.v):v);
function rkSave(){let hard=false;try{hard=sessionStorage.getItem(RK_HARD)==="1"}catch(_){}
 try{if(hard){sessionStorage.removeItem(RK_STORE);return}
  const sc=document.querySelector(".editor__main .reviewer-table__scroll");
  sessionStorage.setItem(RK_STORE,rkPack({D,S,y:scrollY,tableX:sc?sc.scrollLeft:0,hash:location.hash}))}catch(e){console.warn("Couldn't keep state for refresh",e)}}
addEventListener("pagehide",rkSave);
/* on a plain reload, put the saved state back; returns true when it did */
function rkRestoreState(){let t=null,hard=false;
 try{hard=sessionStorage.getItem(RK_HARD)==="1";sessionStorage.removeItem(RK_HARD);t=sessionStorage.getItem(RK_STORE);sessionStorage.removeItem(RK_STORE)}catch(_){return false}
 const nav0=(performance.getEntriesByType&&performance.getEntriesByType("navigation")[0])||{};
 if(hard||!t||nav0.type!=="reload")return false;
 try{const o=rkUnpack(t);if(!o.D||!o.S)return false;D=o.D;S=o.S;render();
  requestAnimationFrame(()=>{scrollTo(0,o.y||0);const sc=document.querySelector(".editor__main .reviewer-table__scroll");if(sc&&o.tableX){sc.scrollLeft=o.tableX;sc.classList.toggle("is-scrolled",sc.scrollLeft>0)}});
  return true}catch(e){console.warn("Couldn't restore state after refresh; opening the page fresh",e);return false}}
const RK_KEYS={cycle:["cid","tab"],cycles:["cycTab"],templates:["tplTab"],myreviews:["mrTab"]};
/* read once now, before later scripts render the home screen and rewrite the hash */
const rkBoot=(()=>{const h=location.hash.replace(/^#\/?/,"");if(!h)return null;
 if(h==="new-review-cycle")return {view:"wizard",p:new URLSearchParams()}; // old link format
 const [view,qs]=h.split("?");return view?{view,p:new URLSearchParams(qs||"")}:null})();
let rkReady=false;

function rkHash(){
 const v=S.view||"home",p=new URLSearchParams();
 if(S.role&&S.role!=="admin")p.set("role",S.role);
 if(S.newCo)p.set("new","1");
 (RK_KEYS[v]||[]).forEach(k=>{if(S[k]!=null&&S[k]!=="")p.set(k,S[k])});
 if(v==="builder"&&S.bld)p.set("tpl",S.bld.id);
 if(v==="write"&&S.wr){p.set("pid",S.wr.pid);p.set("kind",S.wr.kind)}
 if(v==="wizard"){const w=W();if(w&&(w.editing||w.live)&&w.id)p.set("edit",w.id)}
 const q=p.toString();return "#/"+v+(q?"?"+q:"");
}
function rkSyncUrl(){if(!rkReady)return;const h=rkHash();if(location.hash===h)return;
 try{history.replaceState(history.state,"",location.pathname+location.search+h)}catch(e){}}
const _renderRk=render;render=function(...a){const r=_renderRk(...a);rkSyncUrl();return r};

function rkRestore(){
 const b=rkBoot;if(!b||!V[b.view])return;const p=b.p,g=k=>p.get(k);
 if(p.get("new")==="1"&&!S.newCo)init(true);
 const role=g("role")||"admin";
 if(role!==(S.role||"admin")){if(role!=="admin"&&S.newCo)init(false);S.role=role}
 const v=b.view;
 if(v==="wizard"){const id=g("edit");
  if(id&&C(id)){(C(id).status==="Draft"?editDraft:cycEdit)(id)}else startCycle()}
 else if(v==="builder"){const id=g("tpl");id&&T(id)&&!T(id).isNew?openBuilder(id):nav("templates")}
 else if(v==="write"){const pid=+g("pid"),k=g("kind");PK(pid)&&k?openWrite(pid,k):nav("myreviews")}
 else if(v==="cycle"){const cid=g("cid");C(cid)?nav("cycle",{cid,tab:g("tab")||S.tab}):nav("cycles")}
 else{const o={};(RK_KEYS[v]||[]).forEach(k=>{if(g(k))o[k]=g(k)});nav(v,o)}
 scrollTo(0,0);
}
/* after every script has loaded (later layers wrap render/nav too): a plain refresh puts the saved state back;
   otherwise (hard refresh, first visit, a link) reopen the page the address asks for, fresh */
addEventListener("DOMContentLoaded",()=>{let kept=false;try{kept=rkRestoreState()}catch(e){}
 if(!kept){try{rkRestore()}catch(e){console.warn("Couldn't restore page",e)}}rkReady=true;rkSyncUrl()});
