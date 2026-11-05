/* ===== Worker side: Lumber mobile app look. Hamburger → Performance Reviews → list → form; completed reviews always viewable ===== */
ROLE_NAV.worker=[["checkin","Worker app"]];
const PEERQ=[Q("Does Jose work safely?","¿Jose trabaja con seguridad?","Single select",{o:[["Always","Siempre"],["Most of the time","Casi siempre"],["Needs reminders","Necesita recordatorios"]]}),
 Q("Does Jose help the crew?","¿Jose ayuda a la cuadrilla?","Single select",{o:[["Yes, a lot","Sí, mucho"],["Sometimes","A veces"],["Not much","Poco"]]}),
 Q("Anything else? (anonymous)","¿Algo más? (anónimo)","Paragraph",{req:false})];
const WX={EN:{menu:"Menu",docs:"Documents",tasks:"My Tasks",courses:"My Courses",perf:"Performance Reviews",settings:"Settings",sub:"Complete your reviews to stay on track.",done:"Completed",submit:"Submit",req:"Required",todo:"To do",past:"Completed reviews",tap:"Hold to talk",lis:"Listening…",res:"Your results",ack:"Acknowledge",acked:"Acknowledged",note:"Type or hold the mic to talk",work:"Work Time",brk:"Break Time",tc:"Time Card",cin:"Clock In",cout:"Clock Out"},
 ES:{menu:"Menú",docs:"Documentos",tasks:"Mis tareas",courses:"Mis cursos",perf:"Evaluaciones",settings:"Ajustes",sub:"Complete sus evaluaciones a tiempo.",done:"Completadas",submit:"Enviar",req:"Obligatorio",todo:"Pendientes",past:"Evaluaciones completadas",tap:"Mantenga para hablar",lis:"Escuchando…",res:"Sus resultados",ack:"Confirmar recibido",acked:"Recibido",note:"Escriba o mantenga el micrófono",work:"Tiempo de trabajo",brk:"Descanso",tc:"Tarjeta de tiempo",cin:"Entrada",cout:"Salida"}};
function WA(){return S.wa=S.wa||{scr:"home",item:null,ans:{},lang:"EN",clock:false}}
D.wdone=D.wdone||{};
/* Same questionnaire object the admin edits in the builder, so changes there show up here */
const wT1=()=>({sections:(T("t1")||{}).sections||TPLQ.t1});
const wPeer=()=>({sections:[{n:"Working with Jose",nes:"Trabajando con Jose",qs:PEERQ}]});
function wItems(){const m=EN("Miguel Torres"),pk=c=>D.packets.find(p=>p.cid===c&&p.eid===m.id);const p1=pk("c1"),q3=pk("c2"),q2=pk("c6");
 const done=id=>D.wdone[id];
 return [
  {id:"q4",t:"Q4 2026 Check-in",tes:"Registro Q4 2026",sub:"Self review · about 2 minutes",ses:"Autoevaluación · unos 2 minutos",due:(((C("c1").phases||[]).find(ph=>/self/i.test(ph.n))||{}).e||"Oct 12")+", 2026",over:true,tpl:wT1(),done:done("q4")||(p1&&p1.self.st==="Submitted"?{on:"Nov 3, 2026",ans:{}}:null)},
  {id:"peer",t:"Peer review: Jose Ramirez",tes:"Evaluación de compañero: Jose Ramirez",sub:"Anonymous · 3 questions",ses:"Anónima · 3 preguntas",due:"Nov 10, 2026",tpl:wPeer(),done:done("peer")},
  {id:"q3",t:"Q3 2026 Check-in",tes:"Registro Q3 2026",sub:"Self review",ses:"Autoevaluación",tpl:wT1(),done:{on:"Oct 2, 2026",ans:{"0_0":"0","0_1":"1","0_2":["1"],"0_3":"Need more harnesses on Riverside."}},res:q3&&q3.st==="Shared"?{r:q3.rating,by:q3.mgr.by,c:"Steady quarter. Good tie-off habits. Ready to start boom lift training.",ack:D.wack}:null},
  {id:"q2",t:"Q2 2026 Check-in",tes:"Registro Q2 2026",sub:"Self review",ses:"Autoevaluación",tpl:wT1(),done:{on:"Jul 3, 2026",ans:{"0_0":"1","0_1":"0","0_2":["0"]}},res:q2?{r:q2.rating,by:q2.mgr.by,c:"Reliable and on time. Keep coaching the new apprentices.",ack:true}:null}]}
const wTodo=()=>wItems().filter(i=>!i.done);
function wGo(scr,item){const a=WA();if(scr==="form"){a.item=item;a.ans={};a.err=new Set();a.scr="loading";render();setTimeout(()=>{if(WA().scr==="loading"){WA().scr="form";render()}},700);return}a.scr=scr;render()}
/* Answers use the admin form keys ("section_question"), read straight from the rendered form */
function waCollect(){const f=document.getElementById("waForm"),a=WA();if(!f||!a.item)return;const it=wItems().find(x=>x.id===a.item);if(it&&!it.done)readForm(f,it.tpl,a.ans)}
function waRender(skip){if(!skip)waCollect();const sc=document.querySelector(".wa-body"),y=sc?sc.scrollTop:0;render();const n=document.querySelector(".wa-body");if(n)n.scrollTop=y}
function waChange(){const a=WA();if(a.err&&a.err.size){waCollect();const it=wItems().find(x=>x.id===a.item);a.err=waErrors(it,a.ans)}waRender()}
function waErrors(it,ans){const err=new Set();it.tpl.sections.forEach((s,si)=>s.qs.forEach((q,qi)=>{const k=si+"_"+qi,v=ans[k];
  if(q.req&&(v===undefined||v===""||v===false||(Array.isArray(v)&&!v.length)))err.add(k);
  if(q.low&&v&&+v<=2&&!(ans["c"+k]||"").trim())err.add(k)}));return err}
function wRec(k){const a=WA();waCollect();a.rec=k;waRender();setTimeout(()=>{a.rec=null;waCollect();a.ans[k]=a.lang==="ES"?"Necesitamos más arneses en Maple Ridge. Quiero aprender a manejar el boom lift.":"We need more harnesses on Maple Ridge. I want to learn the boom lift.";waRender(true)},1500)}
function wSubmit(){waCollect();const a=WA(),it=wItems().find(x=>x.id===a.item);a.err=waErrors(it,a.ans);
 if(a.err.size){waRender();const f=document.querySelector(".wa-body .qerr");if(f)f.scrollIntoView({block:"center",behavior:"smooth"});toast(a.lang==="ES"?"Responda las preguntas obligatorias.":`${a.err.size} question${a.err.size>1?"s":""} to finish before submitting.`);return}
 a.scr="saving";render();setTimeout(()=>{D.wdone[it.id]={on:"Nov 3, 2026",ans:JSON.parse(JSON.stringify(a.ans))};
  if(it.id==="q4"){const m=EN("Miguel Torres"),p=D.packets.find(p=>p.cid==="c1"&&p.eid===m.id);if(p){p.self.st="Submitted";p.ans=p.ans||{};p.ans.self=JSON.parse(JSON.stringify(a.ans));if(p.exc==="Overdue")p.exc=null;log(p,"Self check-in submitted from the Lumber app","g","Miguel Torres")}}
  a.scr="list";render();toast(a.lang==="ES"?"Enviado. ¡Gracias!":"Submitted. Thanks, Miguel!")},700)}
const L=k=>WX[WA().lang][k];
const chev=`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>`;
const back=`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>`;
const logo=`<svg viewBox="0 0 32 32" width="34" height="34"><g fill="none" stroke="#111" stroke-width="2.4"><circle cx="16" cy="16" r="13.5"/><circle cx="16" cy="16" r="9.5"/><circle cx="16" cy="16" r="5.5"/><circle cx="16" cy="16" r="1.8" fill="#111"/></g></svg>`;
const wic={docs:'<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',tasks:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 13l2 2 4-4"/>',courses:'<path d="M3 5h6a3 3 0 013 3v12a2 2 0 00-2-2H3zM21 5h-6a3 3 0 00-3 3v12a2 2 0 012-2h7z"/>',perf:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8 2 2 0 11-2.8 2.8 1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0 1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3 2 2 0 11-2.8-2.8 1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4 1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8 2 2 0 112.8-2.8 1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0 1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3 2 2 0 112.8 2.8 1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4 1.7 1.7 0 00-1.5 1z"/>'};
const wI=k=>`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4B5563" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${wic[k]}</svg>`;
function wHome(){const a=WA(),n=wTodo().length;
 return `<div class="wa-home"><div class="wa-top"><div><b>Tuesday,</b> November 3</div><div class="row" style="gap:18px"><button class="wa-ic" aria-label="Notifications" onclick="wGo('list')"><svg viewBox="0 0 24 24" width="30" height="30" fill="#fff"><path d="M6 9a6 6 0 1112 0c0 6 2.5 8 2.5 8h-17S6 15 6 9z"/><path d="M10 20a2 2 0 004 0" stroke="#fff" stroke-width="1.5" fill="none"/></svg>${n?'<i class="wa-dot"></i>':""}</button><button class="wa-ic" aria-label="Menu" onclick="wGo('menu')"><svg viewBox="0 0 24 24" width="30" height="30" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button></div></div>
 <div class="wa-t big"><span>0:00</span><small>${L("work")}</small></div><div class="wa-t"><span>0:00</span><small>${L("brk")}</small></div>
 <button class="wa-tc" onclick="toast('Time card')"><svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4" stroke="#fff" stroke-width="2"/><path d="M3 10h18" stroke="#000" stroke-width="1.5"/></svg>${L("tc")}</button>
 <span class="grow"></span><button class="wa-clock ${a.clock?"out":""}" onclick="WA().clock=!WA().clock;render()"><svg viewBox="0 0 24 24" width="26" height="26" fill="#000">${a.clock?'<rect x="6" y="6" width="12" height="12" rx="2"/>':'<path d="M7 4l13 8-13 8z"/>'}</svg>${a.clock?L("cout"):L("cin")}</button></div>`}
function wMenu(){const n=wTodo().length;const row=(k,lab,badge,fn)=>`<button class="wa-mi" onclick="${fn}">${wI(k)}<span class="grow">${lab}</span>${badge?`<i class="wa-badge">${badge}</i>`:""}${chev}</button>`;
 return `${wHome()}<div class="wa-scrim" onclick="wGo('home')"></div><div class="wa-menu"><div class="wa-mh"><button class="wa-x" onclick="wGo('home')" aria-label="Close">✕</button><b>${L("menu")}</b></div>
 ${row("docs",L("docs"),0,"toast('Documents')")}${row("tasks",L("tasks"),0,"toast('My Tasks')")}${row("courses",L("courses"),2,"toast('My Courses')")}${row("perf",L("perf"),n,"wGo('list')")}
 <span class="grow"></span>${row("settings",L("settings"),0,"toast('Settings')")}</div>`}
function chip(it){const es=WA().lang==="ES";if(it.done)return `<span class="wa-sub">${es?"Completada":"Completed"} ${it.done.on}</span>`;return `<span class="wa-chip ${it.over?"r":""}">${it.over?(es?"Vencida":"Overdue"):(es?"Vence":"Due")} ${it.due}</span>`}
function wList(){const a=WA(),all=wItems(),todo=all.filter(i=>!i.done),done=all.filter(i=>i.done),es=a.lang==="ES";
 const row=it=>`<button class="wa-task" onclick="wGo('form','${it.id}')">${it.done?'<span class="wa-ck on">✓</span>':'<span class="wa-ck"></span>'}<span class="grow"><b>${esc(es?it.tes:it.t)}</b><span class="wa-sub">${es?it.ses:it.sub}</span>${chip(it)}</span>${chev}</button>`;
 return `<div class="wa-page"><div class="wa-hdr"><button class="wa-back" onclick="wGo('home')">${back}</button><h2>${L("perf")}</h2>${langT()}</div>
 <div class="wa-intro"><p>${L("sub")}</p><div class="wa-prog"><span>◎ ${done.length}/${all.length} ${L("done")}</span><div class="wa-bar"><i style="width:${pct(done.length,all.length)}%"></i></div></div></div>
 <div class="wa-scroll">${todo.length?`<div class="wa-sec">${L("todo")} · ${todo.length}</div>${todo.map(row).join("")}`:""}<div class="wa-sec">${L("past")}</div>${done.map(row).join("")}</div></div>`}
function langT(){const a=WA();return `<div class="wa-lang"><button class="${a.lang==="EN"?"on":""}" onclick="waCollect();WA().lang='EN';waRender()">EN</button><button class="${a.lang==="ES"?"on":""}" onclick="waCollect();WA().lang='ES';waRender()">ES</button></div>`}
function wForm(loading){const a=WA(),it=wItems().find(x=>x.id===a.item),es=a.lang==="ES",ro=!!it.done,ans=ro?it.done.ans:a.ans;
 const mic=k=>`<button type="button" class="wa-mic ${a.rec===k?"rec":""}" onclick="wRec('${k}')">🎤 ${a.rec===k?L("lis"):L("tap")}</button>`;
 const form=`<form id="waForm" class="wa-form" onsubmit="return false" oninput="waCollect()" onchange="waCollect()">${formBody(it.tpl,ans,{L:a.lang,e:EN("Miguel Torres"),ro,err:ro?new Set():(a.err||new Set()),mic,self:true})}</form>`;
 const res=it.res?`<div class="wa-res"><div class="wa-rh">${L("res")}</div><div class="wa-stars">${"★".repeat(it.res.r)}${"☆".repeat(5-it.res.r)} <b>${D.settings.levels[it.res.r-1]}</b></div><div class="wa-sub">${es?"De":"From"} ${esc(it.res.by)}</div><p>“${esc(it.res.c)}”</p>${it.res.ack?`<span class="wa-chip g">✓ ${L("acked")}</span>`:`<button class="wa-ackb" onclick="D.wack=true;toast('${es?"Confirmado":"Acknowledged. This means you saw it, not that you agree."}');render()">${L("ack")}</button>`}</div>`:"";
 return `<div class="wa-page"><div class="wa-fh"><div class="row" style="justify-content:space-between"><button class="wa-back" onclick="wGo('list')">${back}</button>${langT()}</div>${logo}<h1>${esc(es?it.tes:it.t)}</h1><div class="wa-sub2">${es?it.ses:it.sub}</div>${it.done?`<span class="wa-chip g">${es?"Completada":"Completed"} ${it.done.on}</span>`:chip(it)}</div>
 <div class="wa-scroll wa-body">${loading?'<div class="wa-spin"></div>':res+form}</div>
 ${ro?"":`<div class="wa-foot"><button class="wa-submit" ${loading||a.scr==="saving"?"disabled":""} onclick="wSubmit()">${a.scr==="saving"?"…":L("submit")}</button></div>`}</div>`}
/* iPhone-style device mockup: side buttons, Dynamic Island, real status bar icons, home indicator */
const PM_SBAR=`<span class="pm-time">9:41</span><span class="pm-icons" aria-hidden="true">
 <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
 <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .8 10.4 10.4 0 0 0 .8 3.7L2 5c1.6-1.5 3.7-2.4 6-2.4Zm0 3.5c1.3 0 2.5.5 3.5 1.3l1.2-1.3A7 7 0 0 0 8 4.3a7 7 0 0 0-4.7 1.8l1.2 1.3c1-.8 2.2-1.3 3.5-1.3Zm0 3.4c.4 0 .8.1 1.1.4L8 11.2 6.9 9.9c.3-.3.7-.4 1.1-.4Z"/></svg>
 <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".5"/></svg></span>`;
function workerPhone(){const a=WA();const scr=a.scr==="home"?wHome():a.scr==="menu"?wMenu():a.scr==="list"?wList():wForm(a.scr==="loading");
 return `<div class="pm-device"><span class="pm-key act"></span><span class="pm-key vup"></span><span class="pm-key vdn"></span><span class="pm-key pwr"></span>
 <div class="phone2 wa ${["home","menu"].includes(a.scr)?"dark":""}"><span class="pm-island" aria-hidden="true"></span><div class="sbar">${PM_SBAR}</div><div class="wa-screen">${scr}</div><span class="pm-home" aria-hidden="true"></span></div></div>`}
/* No page header or side notes: just the phone, centred (the Lumber web bar is hidden via body.phonemode) */
V.checkin=()=>`<div class="pm-stage" aria-label="Miguel's Lumber app (phone preview)">${workerPhone()}</div>`;
render();
