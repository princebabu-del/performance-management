/* ===== Employee profile: overall rating + reviews (to do / completed), same model as the worker app ===== */
const shortCyc=c=>c.name.replace(" Field Crew Check-in"," check-in").replace("2026 Annual Review — Office","2026 annual review");
function ratedPackets(e){return D.packets.filter(p=>p.eid===e.id&&(p.adj||p.rating)&&["Shared","Closed","Acknowledged"].some(s=>p.st.includes(s)||C(p.cid).status==="Closed")).sort((a,b)=>["c6","c2","c1","c3"].indexOf(a.cid)-["c6","c2","c1","c3"].indexOf(b.cid))}
function stars(r){return `<span class="pr-stars">${"★".repeat(r)}<span>${"★".repeat(5-r)}</span></span>`}
function profRating(e){const rp=ratedPackets(e),live=D.packets.find(p=>p.eid===e.id&&C(p.cid).status==="Active"&&!rp.includes(p));
 if(!rp.length)return `<div class="card"><div class="hd"><h3>Overall rating</h3></div><div class="empty"><b>No rating yet</b>${live?`${esc(shortCyc(C(live.cid)))} is in progress. The rating shows here once results are shared.`:"Ratings show here after a review cycle shares results."}</div></div>`;
 const last=rp[rp.length-1],r=last.adj||last.rating,avg=rp.reduce((a,p)=>a+(p.adj||p.rating),0)/rp.length,prev=rp.length>1?(rp[rp.length-2].adj||rp[rp.length-2].rating):null,tr=prev==null?"":r>prev?'<span class="pr-tr up">▲ up from last cycle</span>':r<prev?'<span class="pr-tr dn">▼ down from last cycle</span>':'<span class="pr-tr">— same as last cycle</span>';
 return `<div class="card"><div class="hd"><h3>Overall rating</h3><span class="dim sm">Shown to the employee after results are shared</span></div><div class="bd pr-rate">
  <div class="pr-big"><b>${r.toFixed(1)}</b><div>${stars(r)}<div class="pr-lv">${D.settings.levels[r-1]}</div></div></div>
  <div class="pr-meta"><div>Latest: <b>${esc(shortCyc(C(last.cid)))}</b> · from ${esc(last.mgr.by||"—")}${last.adj?` · adjusted by HR from ${last.rating}`:""}</div><div class="dim sm">${tr} · Average ${avg.toFixed(1)} across ${rp.length} cycle${rp.length>1?"s":""}</div>
  <div class="pr-hist">${rp.map(p=>`<span class="tag">${esc(C(p.cid).name.split(" ")[0])} ${C(p.cid).name.split(" ")[1]||""} · ★ ${p.adj||p.rating}</span>`).join("")}${live?`<span class="tag" style="border-style:dashed">${esc(C(live.cid).name.split(" ").slice(0,2).join(" "))} · in progress</span>`:""}</div></div></div></div>`}
function profTodo(e){const out=[];
 if(e.name===ME)crewRows().filter(r=>r.st!=="Submitted").forEach(r=>out.push({t:`${r.kind==="auto"?r.auto.kind:"Crew review"}: ${E(r.eid).name}`,sub:r.kind==="c"?`Borrowed · ${r.hrs} hrs`:shortCyc(C("c1")),due:r.kind==="auto"?r.auto.due:mphDue(C("c1")),over:false,go:"closeLayer();nav('crew')"}));
 D.packets.filter(p=>p.mgr.by===e.name&&e.name!==ME&&p.mgr.st!=="Submitted"&&p.exc!=="Removed"&&C(p.cid).status==="Active").forEach(p=>out.push({t:`Manager review: ${E(p.eid).name}`,sub:shortCyc(C(p.cid)),due:mphDue(C(p.cid)),go:""}));
 D.packets.filter(p=>p.eid===e.id&&C(p.cid).status==="Active"&&!["Submitted","Off"].includes(p.self.st)).forEach(p=>out.push({t:"Self check-in",sub:shortCyc(C(p.cid)),due:((C(p.cid).phases||[]).find(ph=>/self/i.test(ph.n))||{}).e||"—",over:p.self.st==="Overdue"||p.exc==="Overdue",go:""}));
 if(e.name==="Miguel Torres"&&typeof wItems==="function")wItems().filter(i=>i.id==="peer"&&!i.done).forEach(i=>out.push({t:i.t,sub:i.sub,due:i.due.replace(", 2026",""),go:""}));
 return out}
function profDone(e){const out=[];
 D.packets.filter(p=>p.eid===e.id&&p.self.st==="Submitted").forEach(p=>out.push({t:"Self check-in",sub:shortCyc(C(p.cid)),on:C(p.cid).status==="Closed"?"Closed "+(C(p.cid).closed||""):"Submitted",view:`rvView(${p.id},'self')`,r:null}));
 ratedPackets(e).forEach(p=>out.push({t:"Review received",sub:`${shortCyc(C(p.cid))} · from ${p.mgr.by}`,on:/Acknowledged|Closed/.test(p.st)||C(p.cid).status==="Closed"?"Acknowledged":"Shared, not acknowledged",view:`rvView(${p.id},'mgr')`,r:p.adj||p.rating}));
 D.packets.filter(p=>p.mgr.by===e.name&&p.mgr.st==="Submitted").slice(0,6).forEach(p=>out.push({t:`Review given: ${E(p.eid).name}`,sub:shortCyc(C(p.cid)),on:"Submitted",view:`rvView(${p.id},'mgr')`,r:p.adj||p.rating}));
 return out}
function profReviews(e,R){return profRating(e)+profReviewList(e)}
function profReviewList(e){const todo=profTodo(e),done=profDone(e),all=todo.length+done.length;
 const row=(x,isDone)=>`<div class="pr-row">${isDone?'<span class="wa-ck on">✓</span>':'<span class="wa-ck"></span>'}<div class="grow"><b>${esc(x.t)}</b><div class="dim sm">${esc(x.sub)}</div></div>${x.r?stars(x.r):""}
  ${isDone?`<span class="pill ${/not/.test(x.on)?"a":"g"}">${esc(x.on==="Submitted"?"Completed":x.on.startsWith("Closed")?"Completed":x.on)}</span><button class="btn s" onclick="${x.view}">View</button>`
  :`<span class="pill ${x.over?"r":"a"}">${x.over?"Overdue":"Due"} ${x.due}</span>${x.go?`<button class="btn s p" onclick="${x.go}">Start</button>`:`<span class="btn s" style="visibility:hidden">View</span>`}`}</div>`;
 return `<div class="card"><div class="hd"><h3>Reviews</h3><span class="dim sm">${done.length} of ${all} completed</span></div>
 ${all?todo.map(x=>row(x,false)).join("")+done.map(x=>row(x,true)).join(""):`<div class="empty"><b>No reviews yet</b>Reviews this person gives or receives show here.</div>`}</div>`}
function rvView(pid,kind){const p=PK(pid),e=E(p.eid),c=C(p.cid),t=kind==="self"?T("t1"):T(tplOf(p,"mgr")),a=(p.ans||{})[kind]||{},r=p.adj||p.rating;
 openDrawer({label:kind==="self"?"Self check-in":"Review",title:esc(e.name),sub:`${esc(c.name)}${kind==="mgr"?" · by "+esc(p.mgr.by||"—"):""}`,w:760,
  body:`${kind==="mgr"&&r?`<div class="card"><div class="bd pr-rate"><div class="pr-big"><b>${r.toFixed(1)}</b><div>${stars(r)}<div class="pr-lv">${D.settings.levels[r-1]}</div></div></div></div></div>`:""}<div class="card"><div class="bd"><span class="wa-chip g">Completed</span>${Object.keys(a).length&&t?formBody(t,a,{e,ro:true}):'<div class="dim" style="margin-top:10px">Answers were sent from the Lumber app as quick taps.</div>'}</div></div>`,
  foot:`<button class="btn" onclick="openProfile(${e.id},'Performance & Skills')">Back to profile</button>`})}
render();
