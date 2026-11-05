/* ===== Worker app: "About me" tab — reviews others wrote about the worker (manager + contributing foremen).
   A review only shows once HR shares it (Shared / Acknowledged / Disputed, or the cycle is closed).
   While a cycle is still running, it shows as a locked row with the date results are shared. ===== */
Object.assign(WX.EN,{tTodo:"My tasks",tMe:"About me",meSub:"Reviews your foreman wrote about you. They show up here after HR shares them.",fromF:"From your foreman",contrib:"Other foremen you worked with",byArea:"By area",overall:"Overall rating",ackNote:"Acknowledging means you saw it, not that you agree.",ask:"Questions? Talk to HR",notYet:"Results shared",newR:"New",view:"See your foreman's review",empty:"No reviews about you yet."});
Object.assign(WX.ES,{tTodo:"Mis tareas",tMe:"Sobre mí",meSub:"Evaluaciones que su capataz escribió sobre usted. Aparecen aquí cuando RR. HH. las comparte.",fromF:"De su capataz",contrib:"Otros capataces con los que trabajó",byArea:"Por área",overall:"Calificación general",ackNote:"Confirmar significa que la vio, no que esté de acuerdo.",ask:"¿Preguntas? Hable con RR. HH.",notYet:"Resultados el",newR:"Nueva",view:"Ver la evaluación de su capataz",empty:"Aún no hay evaluaciones sobre usted."});

const WR_VISIBLE=["Shared","Acknowledged","Disputed","Closed"];
const WR_AREAS=[["Trade skill","Habilidad del oficio"],["Safety","Seguridad"],["Quality and rework","Calidad y retrabajo"],["Attendance and reliability","Asistencia y confiabilidad"],["Teamwork","Trabajo en equipo"]];
const WR_LEVELS_ES=["Necesita mejorar","En desarrollo","Cumple expectativas","Supera expectativas","Sobresaliente"];
/* Demo content per cycle: area scores + comments (EN/ES), overall comment, share date, contributor note */
const WR_DATA={
 c2:{on:"10/06/2026",self:"q3",areas:[[4,"Clean cuts on valleys, fewer callbacks than last quarter.","Cortes limpios en los valles, menos regresos que el trimestre pasado."],[3,"Harness not clipped once on the east slope (Oct 12). We talked it through.","Una vez no enganchó el arnés en la pendiente este (12 oct). Lo hablamos."],[4,"",""],[4,"On time 58 of 60 days · 486 hrs this period","A tiempo 58 de 60 días · 486 h en el periodo"],[5,"Helps apprentices without being asked.","Ayuda a los aprendices sin que se lo pidan."]],
  c:["Steady quarter. Good tie-off habits. Ready to start boom lift training.","Trimestre estable. Buenos hábitos de amarre. Listo para empezar la capacitación de boom lift."],
  contrib:{by:"Tom Hayes",hrs:120,site:"Riverside Medical Center",c:["Worked 3 weeks on Riverside. Careful around the medical staff, kept the area clean.","Trabajó 3 semanas en Riverside. Cuidadoso con el personal médico, mantuvo el área limpia."]}},
 c6:{on:"08/10/2026",self:"q2",areas:[[4,"Solid on tear-offs.","Sólido en los desmontes."],[4,"",""],[3,"Some rework on flashing at Maple Ridge.","Algo de retrabajo en los tapajuntas en Maple Ridge."],[5,"Never missed a day.","No faltó ningún día."],[4,"",""]],
  c:["Reliable and on time. Keep coaching the new apprentices.","Confiable y puntual. Siga entrenando a los nuevos aprendices."]}};

function wrMe(){return EN("Miguel Torres")}
function wrPk(cid){const m=wrMe();return D.packets.find(p=>p.cid===cid&&p.eid===m.id)}
const wrShared=p=>p&&p.exc!=="Removed"&&(WR_VISIBLE.includes(p.st)||C(p.cid).status==="Closed")&&(p.adj||p.rating);
const wrAcked=p=>p.st==="Acknowledged"||C(p.cid).status==="Closed"||(p.cid==="c2"&&D.wack);
const wrTitle=(cid,es)=>{const n=C(cid).name.split(" ").slice(0,2).join(" ");return es?"Registro "+n:n+" Check-in"};

/* Reviews about Miguel: shared ones first (newest first), then cycles still running (locked) */
function wReceived(){const out=[];
 ["c2","c6"].forEach(cid=>{const p=wrPk(cid);if(!wrShared(p))return;
  const d=WR_DATA[cid];
  /* Q3: Miguel also worked 120 hrs under Tom Hayes, so a contributing-foreman note comes with it */
  if(d.contrib&&!p.contrib.some(x=>x.by===d.contrib.by))p.contrib.push({by:d.contrib.by,st:"Submitted",hrs:d.contrib.hrs});
  out.push({p,cid,d,r:p.adj||p.rating,by:p.mgr.by,ack:wrAcked(p)})});
 const live=D.packets.filter(p=>p.eid===wrMe().id&&C(p.cid).status==="Active"&&!wrShared(p)&&p.exc!=="Removed"&&p.mgr.st!=="Abandoned");
 live.forEach(p=>{const sh=(C(p.cid).phases||[]).find(ph=>/share/i.test(ph.n));out.push({p,cid:p.cid,locked:true,when:sh?cdMDY(sh.s,C(p.cid)):"after HR review"})});
 return out}
const wrUnacked=()=>wReceived().filter(x=>!x.locked&&!x.ack).length;

function wrStars(r){return `<span class="wa-stars" aria-label="${r} of 5">${"★".repeat(r)}<span class="off">${"★".repeat(5-r)}</span></span>`}
function wrLevel(r){return WA().lang==="ES"?WR_LEVELS_ES[r-1]:D.settings.levels[r-1]}

function wrTabs(){const a=WA(),n=wrUnacked();
 return `<div class="wa-tabs" role="tablist">${[["todo",L("tTodo"),0],["me",L("tMe"),n]].map(([k,lab,b])=>`<button role="tab" aria-selected="${a.tab===k}" class="${a.tab===k?"on":""}" onclick="WA().tab='${k}';render()">${lab}${b?`<i class="wa-badge">${b}</i>`:""}</button>`).join("")}</div>`}

function wrList(){const a=WA(),es=a.lang==="ES",items=wReceived();
 const row=x=>x.locked
  ?`<div class="wa-task locked"><span class="wa-ck lock" aria-hidden="true">🔒</span><span class="grow"><b>${esc(wrTitle(x.cid,es))}</b><span class="wa-sub">${es?"Su capataz está escribiendo su evaluación":"Your foreman is writing your review"}</span><span class="wa-chip">${L("notYet")} ${esc(x.when)}</span></span></div>`
  :`<button class="wa-task" onclick="wrOpen('${x.cid}')"><span class="wa-rbadge">${x.r}<small>/5</small></span><span class="grow"><b>${esc(wrTitle(x.cid,es))}</b><span class="wa-sub">${es?"De":"From"} ${esc(x.by)}${x.p.contrib.some(c=>c.st==="Submitted")?(es?" y 1 capataz más":" + 1 more foreman"):""}</span>${x.ack?`<span class="wa-chip g">✓ ${L("acked")}</span>`:`<span class="wa-chip b">${L("newR")} · ${es?"confirme que la vio":"tap to acknowledge"}</span>`}</span>${chev}</button>`;
 return `<div class="wa-intro"><p>${L("meSub")}</p></div><div class="wa-scroll">${items.length?items.map(row).join(""):`<div class="wa-empty">${L("empty")}</div>`}</div>`}

/* Performance Reviews screen: tabs for "My tasks" (existing list) and "About me" */
const _wList=wList;
wList=function(){const a=WA();a.tab=a.tab||"todo";
 const html=_wList();
 if(a.tab==="todo")return html.replace(`<div class="wa-intro">`,`${wrTabs()}<div class="wa-intro">`);
 const hdr=html.slice(0,html.indexOf(`<div class="wa-intro">`));
 return `${hdr}${wrTabs()}${wrList()}</div>`};

function wrOpen(cid){const a=WA();a.res=cid;a.scr="result";render();const b=document.querySelector(".wa-body");if(b)b.scrollTop=0}
function wrAck(cid){const p=wrPk(cid),es=WA().lang==="ES";if(!p)return;
 if(p.st!=="Acknowledged"&&C(p.cid).status!=="Closed"){p.prev=p.st;p.st="Acknowledged";log(p,"Acknowledged from the Lumber app","g","Miguel Torres")}
 if(cid==="c2")D.wack=true;
 toast(es?"Confirmado. Gracias, Miguel.":"Acknowledged. This means you saw it, not that you agree.");render()}

function wResult(){const a=WA(),es=a.lang==="ES",x=wReceived().find(i=>i.cid===a.res&&!i.locked);
 if(!x){a.scr="list";return wList()}
 const d=x.d,tr=(en,sp)=>es&&sp?sp:en;
 const areas=d.areas.map((ar,i)=>`<div class="wa-area"><div class="wa-area-h"><b>${WR_AREAS[i][es?1:0]}</b><span class="wa-pill">${ar[0]} · ${esc(wrLevel(ar[0]))}</span></div>${ar[1]?`<p>${esc(tr(ar[1],ar[2]))}</p>`:""}</div>`).join("");
 const cn=d.contrib&&x.p.contrib.find(c=>c.by===d.contrib.by&&c.st==="Submitted");
 return `<div class="wa-page"><div class="wa-fh"><div class="row" style="justify-content:space-between"><button class="wa-back" aria-label="Back" onclick="wGo('list')">${back}</button>${langT()}</div>${logo}
  <h1>${esc(wrTitle(x.cid,es))}</h1><div class="wa-sub2">${es?"Evaluación de":"Review from"} ${esc(x.by)} · ${es?"compartida":"shared"} ${d.on}</div>${x.ack?`<span class="wa-chip g">✓ ${L("acked")}</span>`:`<span class="wa-chip b">${L("newR")}</span>`}</div>
 <div class="wa-scroll wa-body">
  <div class="wa-res"><div class="wa-rh">${L("overall")}</div><div class="wa-big">${wrStars(x.r)}<b>${esc(wrLevel(x.r))}</b></div>
   <div class="wa-sub">${L("fromF")} · ${esc(x.by)}</div><p>“${esc(tr(d.c[0],d.c[1]))}”</p></div>
  <div class="wa-sec flush">${L("byArea")}</div>${areas}
  ${cn?`<div class="wa-sec flush">${L("contrib")}</div><div class="wa-res"><div class="wa-sub" style="margin-top:0"><b style="color:#111827">${esc(cn.by)}</b> · ${cn.hrs} ${es?"h juntos":"hrs together"} · ${esc(d.contrib.site)}</div><p>“${esc(tr(d.contrib.c[0],d.contrib.c[1]))}”</p></div>`:""}
  ${d.self?`<button class="wa-link" onclick="wGo('form','${d.self}')">${es?"Ver su autoevaluación":"See your self review"} ${chev}</button>`:""}
  <button class="wa-link" onclick="toast('${es?"Mensaje enviado a RR. HH.":"Message sent to HR. They will reach out."}')">${L("ask")} ${chev}</button>
 </div>
 ${x.ack?"":`<div class="wa-foot"><div class="wa-sub" style="text-align:center;margin:0 0 8px">${L("ackNote")}</div><button class="wa-submit" onclick="wrAck('${x.cid}')">${L("ack")}</button></div>`}</div>`}

/* Self-review screen: replace the inline results card with a link to the full review in "About me" */
const _wForm=wForm;
wForm=function(loading){const a=WA(),it=wItems().find(x=>x.id===a.item);
 let html=_wForm(loading);
 const cid=Object.keys(WR_DATA).find(k=>WR_DATA[k].self===a.item),x=cid&&wReceived().find(i=>i.cid===cid&&!i.locked);
 if(it&&it.res){const s=html.indexOf(`<div class="wa-res">`),e=html.indexOf(`<form id="waForm"`);if(s>-1&&e>s)html=html.slice(0,s)+html.slice(e)}
 if(x&&!loading)html=html.replace(`<div class="wa-scroll wa-body">`,`<div class="wa-scroll wa-body"><button class="wa-link card" onclick="WA().tab='me';wrOpen('${cid}')"><span class="wa-rbadge">${x.r}<small>/5</small></span><span class="grow">${L("view")}${x.ack?"":` <i class="wa-chip b" style="margin:0 0 0 6px">${L("newR")}</i>`}</span>${chev}</button>`);
 return html};

workerPhone=function(){const a=WA();const scr=a.scr==="home"?wHome():a.scr==="menu"?wMenu():a.scr==="list"?wList():a.scr==="result"?wResult():wForm(a.scr==="loading");
 return `<div class="pm-device"><span class="pm-key act"></span><span class="pm-key vup"></span><span class="pm-key vdn"></span><span class="pm-key pwr"></span>
 <div class="phone2 wa ${["home","menu"].includes(a.scr)?"dark":""}"><span class="pm-island" aria-hidden="true"></span><div class="sbar">${PM_SBAR}</div><div class="wa-screen">${scr}</div><span class="pm-home" aria-hidden="true"></span></div></div>`};
render();
