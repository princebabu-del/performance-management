/* ===== A refresh keeps you on the same page, in its initial state.
   The address hash records the current screen (role, view and the few keys that pick the page: cycle + tab, list tab,
   questionnaire, review being written, cycle being edited). It's written with replaceState, so Back isn't affected.
   Reloading reopens that screen fresh: demo data, typed input, open drawers/modals and filters are not kept.
   Anything that no longer exists after the reload (e.g. a draft saved this session) falls back to its list page. ===== */
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
/* after every script has loaded (later layers wrap render/nav too), reopen the page the address asks for */
addEventListener("DOMContentLoaded",()=>{try{rkRestore()}catch(e){console.warn("Couldn't restore page",e)}rkReady=true;rkSyncUrl()});
