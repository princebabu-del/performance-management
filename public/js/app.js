/* Core, data, views and layers V1–V5. Kept as ONE file: it contains repeated `function` declarations whose hoisting decides which version wins. */
/* ================= CORE ================= */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const P={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z"/>',
 cycle:'<path d="M21 12a9 9 0 11-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
 tpl:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
 goal:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 chat:'<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.5A8 8 0 1121 12z"/>',
 flag:'<path d="M5 21V4h11l-1.5 4L16 12H5"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
 bell:'<path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c1-3.5 3.6-5 7-5s6 1.5 7 5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.2 1.3 5 4"/>',
 swap:'<path d="M7 7h13l-4-4M17 17H4l4 4"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 check:'<path d="M5 12l5 5L20 7"/>',
 more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
 send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 pause:'<path d="M9 5v14M15 5v14"/>',
 play:'<path d="M7 4l13 8-13 8z"/>',
 copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h3"/>',
 undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 010 10h-3"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
 alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 18h.01"/>',
 phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 down:'<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>',
 edit:'<path d="M4 20h4L18.5 9.5a2.8 2.8 0 00-4-4L4 16v4"/>',
 drag:'<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
 star:'<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>',
 cert:'<circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/>',
 hard:'<path d="M3 18h18M5 18v-3a7 7 0 0114 0v3M10 8V5h4v3"/>',
 cols:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
 filter:'<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
 useradd:'<circle cx="9" cy="8" r="4"/><path d="M2 21c1-4 4-6 7-6 2 0 3.5.6 4.5 1.5M19 14v6M16 17h6"/>',
 hist:'<path d="M3 12a9 9 0 103-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
 flow:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M6 9v4a2 2 0 002 2h7"/>',
 archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M10 13h4"/>'
};
const ic=(n,c="")=>`<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]||""}</svg>`;
const initials=n=>n.split(" ").map(x=>x[0]).slice(0,2).join("");
const AV_COL=["#2F6FDE","#0EA5E9","#16A34A","#D97706","#7C3AED","#DB2777","#0F766E","#B45309","#4B5563"];
const av=(n,sz=30)=>`<span class="avatar" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.38)}px;background:${AV_COL[[...n].reduce((a,c)=>a+c.charCodeAt(0),0)%AV_COL.length]}">${initials(n)}</span>`;
const pct=(a,b)=>b?Math.round(a*100/b):0;
const TODAY="Oct 14, 2026";

/* ================= DATA ================= */
let D, S;
function seed(){
 const crews=[
  {id:"cA",name:"Roofing Crew A",fm:"Luis Delgado",trade:"Roofer"},
  {id:"cB",name:"Roofing Crew B",fm:"Tom Hayes",trade:"Roofer"},
  {id:"cC",name:"Framing Crew",fm:"Ken Okafor",trade:"Carpenter"},
  {id:"cD",name:"Siding Crew",fm:"Ray Brooks",trade:"Siding installer"}];
 const sites=["Maple Ridge Apartments","Riverside Medical Center","Oak Hollow Elementary","Harbor Point Retail"];
 const fieldNames=["Miguel Torres","Jose Ramirez","Carlos Mendez","Andre Wilson","Juan Herrera","Tyler Brooks","Marco Diaz","Kevin Nguyen","Pedro Alvarez","Darnell Jones","Luis Ortega","Sam Carter","Eddie Morales","Brian Kowalski","Hector Cruz","Jake Sullivan","Rafael Soto","Chris Palmer","Omar Haddad","Victor Reyes","Dylan Price","Ivan Petrov","Mateo Garcia","Noah Fischer"];
 const officeNames=["Rachel Kim","Priya Shah","Megan Ross","David Chen","Laura Bennett","Steve Martin","Alicia Gomez","Ben Turner"];
 const emps=[];let id=1;
 fieldNames.forEach((n,i)=>{const c=crews[i%4];
  const certs=[{n:"OSHA 10",s:"active",d:"03/31/2028"}];
  if(i%5===1)certs.push({n:"Fall Protection",s:"expired",d:"09/30/2026"});
  else if(i%5===3)certs.push({n:"Forklift Operator",s:"expiring",d:"12/02/2026"});
  else certs.push({n:"Fall Protection",s:"active",d:"06/30/2027"});
  emps.push({id:id++,name:n,code:String(1100+i*7),type:"Field",title:i%6===0?"Lead hand":(i%7===2?"Apprentice":c.trade),trade:c.trade,dept:"Field Operations",crew:c.id,site:sites[(i+(i>11?1:0))%4],sites:i%4===0?[sites[i%4],sites[(i+1)%4]]:[sites[i%4]],mgr:c.fm,hire:["Mar 2021","Jun 2023","Jan 2025","Aug 2019","May 2024","Feb 2026","Jul 2022"][i%7],phone:!(i===9||i===17),email:i%3===0,lang:i%3===1?"ES":"EN",union:i%4===2,hrs:[486,512,398,520,455,301,540][i%7],certs,status:"Active",rehire:i===20?"Eligible with conditions":null});
 });
 crews.forEach(c=>emps.push({id:id++,name:c.fm,code:String(900+id),type:"Field",title:"Foreman",trade:c.trade,dept:"Field Operations",crew:c.id,site:sites[0],sites:[sites[0]],mgr:"Dana Whitfield",hire:"2018",phone:true,email:true,lang:"EN",union:false,hrs:520,certs:[{n:"OSHA 30",s:"active",d:"12/31/2028"}],status:"Active",isMgr:true}));
 emps.push({id:id++,name:"Dana Whitfield",code:"801",type:"Office",title:"Superintendent",trade:"—",dept:"Field Operations",crew:null,site:"—",sites:[],mgr:"Mark Wagner",hire:"2015",phone:true,email:true,lang:"EN",certs:[],status:"Active",isMgr:true});
 officeNames.forEach((n,i)=>emps.push({id:id++,name:n,code:String(700+i),type:"Office",title:["Estimator","Project Manager","Payroll Specialist","Project Engineer","Office Manager","Safety Coordinator","AP Clerk","Estimator"][i],trade:"—",dept:["Estimating","Projects","Finance","Projects","Admin","Safety","Finance","Estimating"][i],crew:null,site:"Main office",sites:[],mgr:i<4?"Dana Whitfield":"Rachel Kim",hire:["2019","2021","2022","2023","2017","2020","2024","2025"][i],phone:true,email:true,lang:"EN",certs:[{n:"First Aid / CPR",s:"active",d:"03/14/2028"},i%3===1?{n:"OSHA 10",s:"expired",d:"09/30/2026"}:{n:"OSHA 10",s:"active",d:"06/30/2027"},{n:"Fire Extinguisher Training",s:"active",d:"01/15/2027"},{n:"Confined Space Awareness",s:"active",d:"05/31/2028"}],status:"Active",isMgr:i===0}));
 const empBy=n=>emps.find(e=>e.name===n);

 const templates=[
  {id:"t1",fav:true,name:"Field Worker Self Review",type:"Self",aud:"Field employees",q:8,min:3,langs:["EN","ES"],status:"Active",ver:3,used:["c1","c2","c6"],upd:"Sep 28, 2026",starter:true},
  {id:"t2",name:"Foreman Crew Review",type:"Manager",aud:"Field employees",q:12,min:5,langs:["EN","ES"],status:"Active",ver:4,used:["c1","c2","c6"],upd:"Oct 2, 2026",starter:true},
  {id:"t3",name:"Contributing Foreman Notes",type:"Contributor",aud:"Field employees",q:4,min:2,langs:["EN","ES"],status:"Active",ver:1,used:["c1","c2"],upd:"Aug 14, 2026"},
  {id:"t4",name:"Peer Review (Short)",type:"Peer",aud:"Everyone",q:5,min:2,langs:["EN","ES"],status:"Active",ver:2,used:["c3"],upd:"Jul 30, 2026",starter:true},
  {id:"t5",name:"Upward Review",type:"Upward",aud:"Managers & foremen",q:6,min:3,langs:["EN","ES"],status:"Active",ver:1,used:[],upd:"Jul 30, 2026",starter:true},
  {id:"t6",name:"Office Employee Annual",type:"Self + Manager",aud:"Office employees",q:18,min:12,langs:["EN"],status:"Active",ver:2,used:["c3"],upd:"Sep 3, 2026",starter:true},
  {id:"t7",name:"90-Day New Hire Check",type:"Manager",aud:"New hires",q:10,min:4,langs:["EN","ES"],status:"Active",ver:1,used:["c4"],upd:"Jun 10, 2026",starter:true},
  {id:"t9",name:"Superintendent Review",type:"Manager",aud:"Superintendents",q:14,min:9,langs:["EN"],status:"Draft",ver:0,used:[],upd:"Oct 11, 2026"},
  {id:"t10",name:"2025 Field Review (old)",type:"Manager",aud:"Field employees",q:22,min:11,langs:["EN"],status:"Archived",ver:5,used:["c8"],upd:"Jan 4, 2026"}];

 const PH=(n,s,e,st)=>({n,s,e,st});
 const cycles=[
  {id:"c1",name:"Q4 2026 Field Crew Check-in",pattern:"Quarterly crew check-in",status:"Active",period:"Oct 1 – Dec 31, 2026",aud:"Field employees",tpls:["t1","t2","t3"],types:["Self","Manager","Contributor"],rating:"1–5 with definitions",model:"HR pre-maps",calib:true,ack:true,approval:false,anon:3,recurring:"Every quarter",auto:"Auto-enroll new field hires after 30 days",
   phases:[PH("Self review","Oct 1","Oct 12","done"),PH("Manager review","Oct 8","Oct 30","cur"),PH("Calibration","Nov 2","Nov 6",""),PH("Share results","Nov 9","Nov 20","")],todayPos:34},
  {id:"c2",name:"Q3 2026 Field Crew Check-in",pattern:"Quarterly crew check-in",status:"Active",period:"Jul 1 – Sep 30, 2026",aud:"Field employees",tpls:["t1","t2","t3"],types:["Self","Manager","Contributor"],rating:"1–5 with definitions",model:"HR pre-maps",calib:true,ack:true,approval:false,anon:3,recurring:"Every quarter",auto:"Auto-enroll new field hires after 30 days",
   phases:[PH("Self review","Jul 6","Jul 17","done"),PH("Manager review","Jul 13","Jul 31","done"),PH("Calibration","Aug 3","Oct 9","done"),PH("Share results","Oct 6","Oct 24","cur")],todayPos:78},
  {id:"c3",name:"2026 Annual Review — Office",pattern:"Annual",status:"Active",period:"Jan 1 – Dec 31, 2026",aud:"Office employees",tpls:["t6","t4"],types:["Self","Manager","Peer"],rating:"Named levels",model:"Employee nominates, manager approves",calib:true,ack:true,approval:true,anon:3,recurring:"Every year",auto:"—",
   phases:[PH("Nominations","Oct 1","Oct 10","done"),PH("Self + peer","Oct 8","Oct 24","cur"),PH("Manager review","Oct 20","Nov 13",""),PH("Calibration","Nov 16","Nov 25",""),PH("Share results","Dec 1","Dec 15","")],todayPos:30},
  {id:"c4",name:"90-Day New Hire Check",pattern:"90-day new hire",status:"Active",period:"Rolling · 90 days after hire date",aud:"New hires",tpls:["t7"],types:["Manager"],rating:"1–5 with definitions",model:"Lumber manager",calib:false,ack:true,approval:false,anon:3,recurring:"Rolling (hire date)",auto:"Every new hire",phases:[PH("Manager review","Day 80","Day 90","cur"),PH("Share results","Day 90","Day 97","")],todayPos:50},
  {id:"c5",name:"Riverside Medical Center Closeout",pattern:"Project completion",status:"Active",period:"Rolling",aud:"Field employees",tpls:["t1","t2"],types:["Self","Manager"],rating:"1–5 with definitions",model:"Lumber manager",calib:false,ack:true,approval:false,anon:3,recurring:"",auto:"—",
   ctype:"Project Completion Review",probSched:"end",probEvery:1,projTillN:3,projMode:"specific",projs:["Riverside Medical Center"],
   desc:"Rate each worker on their part of the Riverside build: quality of work, safety on site and how they handled the final punch list.",
   phases:[PH("Self review","Completion","+7 days","cur"),PH("Manager review","Completion","+14 days",""),PH("Share results","+14 days","+21 days","")],todayPos:20},
  {id:"c9",name:"Winter Crew Readiness Review",pattern:"Fixed window",status:"Scheduled",period:"Dec 1, 2026 – Jan 15, 2027",aud:"Field employees",tpls:["t1","t2"],types:["Self","Manager"],rating:"Stars",model:"HR pre-maps",calib:false,ack:true,approval:false,anon:3,recurring:"",auto:"—",
   desc:"Before the winter shutdown, check each crew member on cold-weather safety, equipment care and readiness for the January restart.",
   phases:[PH("Self review","Dec 1","Dec 12",""),PH("Manager review","Dec 8","Jan 8",""),PH("Share results","Jan 11","Jan 15","")],todayPos:0},
  {id:"c10",name:"2027 Annual Review — Office",pattern:"Annual",status:"Scheduled",period:"Jan 1 – Dec 31, 2027",aud:"Office employees",tpls:["t6","t4"],types:["Self","Manager","Peer"],rating:"1–5 with definitions",model:"Employee nominates, manager approves",calib:true,ack:true,approval:true,anon:3,recurring:"Every year",auto:"—",
   phases:[PH("Nominations","Oct 1","Oct 10",""),PH("Self + peer","Oct 8","Oct 24",""),PH("Manager review","Oct 20","Nov 13",""),PH("Calibration","Nov 16","Nov 25",""),PH("Share results","Dec 1","Dec 15","")],todayPos:0},
  {id:"c6",name:"Q2 2026 Field Crew Check-in",pattern:"Quarterly crew check-in",status:"Closed",period:"Apr 1 – Jun 30, 2026",aud:"Field employees",tpls:["t1","t2"],types:["Self","Manager"],rating:"1–5 with definitions",model:"HR pre-maps",calib:true,ack:true,approval:false,anon:3,recurring:"Every quarter",auto:"—",phases:[PH("Self review","Jul 1","Jul 8","done"),PH("Manager review","Jul 6","Jul 17","done"),PH("Calibration","Jul 20","Jul 24","done"),PH("Share results","Jul 27","Aug 7","done")],todayPos:100,closed:"Aug 10, 2026"},
  {id:"c7",name:"Q1 2027 Field Crew Check-in",pattern:"Quarterly crew check-in",status:"Draft",period:"Jan 1 – Mar 31, 2027",aud:"Field employees",tpls:["t1","t2","t3"],types:["Self","Manager","Contributor"],rating:"1–5 with definitions",model:"HR pre-maps",calib:true,ack:true,approval:false,anon:3,recurring:"Every quarter",auto:"Auto-enroll new field hires after 30 days",phases:[PH("Self review","Jan 5","Jan 16",""),PH("Manager review","Jan 12","Jan 30",""),PH("Calibration","Feb 2","Feb 6",""),PH("Share results","Feb 9","Feb 20","")],todayPos:0,draftStep:4},
  {id:"c8",name:"Q1 2026 Field Crew Check-in",pattern:"Quarterly crew check-in",status:"Archived",period:"Jan 1 – Mar 31, 2026",aud:"Field employees",tpls:["t10"],types:["Manager"],rating:"1–5 with definitions",model:"Lumber manager",calib:false,ack:false,approval:false,anon:3,recurring:"Every quarter",auto:"—",phases:[PH("Manager review","Apr 1","Apr 17","done"),PH("Share results","Apr 20","Apr 30","done")],todayPos:100,closed:"May 3, 2026"}];

 const packets=[];let pid=1;
 const field=emps.filter(e=>e.type==="Field"&&!e.isMgr);
 const H=(t,who,txt,c="")=>({t,who,txt,c});
 // c1: in-flight statuses
 const c1st=["Not started","In progress","Submitted","Manager in progress","Manager in progress","Manager submitted","Submitted","In progress","Not started","Manager in progress","Submitted","Manager in progress","In progress","Manager submitted","Not started","Manager in progress","Submitted","Not started","Manager in progress","In progress","Manager in progress","Submitted","Manager in progress","In progress"];
 field.forEach((e,i)=>{
  let st=c1st[i%c1st.length],exc=null;
  const selfSt={"Not started":"Not started","In progress":"In progress"}[st]||"Submitted";
  if(selfSt!=="Submitted"&&[0,8,14,17,7].includes(i))exc="Overdue";
  if(i===23){exc="Removed"}
  const mgrSt=st==="Manager submitted"?"Submitted":st==="Manager in progress"?"In progress":"Not started";
  const multi=e.sites.length>1;
  packets.push({id:pid++,cid:"c1",eid:e.id,st,exc,prev:null,due:selfSt==="Submitted"?"Oct 30":(exc==="Overdue"?"Oct 12":"Oct 16"),self:{st:exc==="Overdue"?"Overdue":selfSt},mgr:{st:mgrSt,by:e.mgr},
   contrib:multi?[{by:crews[(i+1)%4].fm,st:i%2?"Submitted":"Not started",hrs:96}]:[],peers:[],rating:st==="Manager submitted"?[4,3,5,4][i%4]:null,adj:null,ver:1,noReviewer:i===5||i===19,
   hist:[H("Oct 5, 9:02 AM","System","Packet created at launch","b"),H("Oct 5, 9:03 AM","System","Self review sent by SMS"+(e.lang==="ES"?" (Spanish)":""),"b")].concat(selfSt==="Submitted"?[H("Oct "+(7+i%5)+", 6:4"+(i%9)+" PM",e.name,"Self review submitted from SMS link","g")]:[]).concat(exc==="Removed"?[H("Oct 10, 2:15 PM","Anshika R.","Removed from cycle · Reason: On leave until January","r")]:[])});
  if(exc==="Removed")packets[packets.length-1].prev="In progress";
  if(selfSt!=="Submitted"&&!exc)packets[packets.length-1].hist.push(H("Oct 11, 4:02 PM","Anshika R.","Extended to Oct 16 · Reason: Working out of town at Harbor Point this week","a"));
 });
 // fix: noReviewer packets have no manager
 packets.filter(p=>p.noReviewer).forEach(p=>{p.mgr.by=null;p.st=p.st.startsWith("Manager")?"Submitted":p.st;p.rating=null});
 // c2: results stage
 const c2st=["Shared","Acknowledged","Acknowledged","In calibration","Approved","Shared","Acknowledged","In calibration","Disputed","Acknowledged","Shared","Recalled","Approved","Acknowledged","In calibration","Shared","Acknowledged","Reopened","Acknowledged","Manager submitted","Abandoned","Approved","Acknowledged","Shared"];
 field.forEach((e,i)=>{
  let st=c2st[i%c2st.length];const r=[4,3,5,4,2,4,3,5,3,4][i%10];
  const p={id:pid++,cid:"c2",eid:e.id,st,exc:null,prev:null,due:"Oct 24",self:{st:st==="Abandoned"?"Abandoned":"Submitted"},mgr:{st:st==="Abandoned"?"Abandoned":"Submitted",by:e.mgr},contrib:[],peers:[],rating:st==="Abandoned"?null:r,adj:(i===3?3:null),adjReason:i===3?"Brought in line with crew average after site walk-through notes":null,ver:st==="Recalled"?1:(st==="Reopened"?2:1),
   hist:[H("Jul 6, 9:00 AM","System","Packet created at launch","b"),H("Jul 15, 5:20 PM",e.name,"Self review submitted","g"),H("Jul 29, 7:10 PM",e.mgr,"Manager review submitted","g")]};
  if(["Approved","Shared","Acknowledged","Disputed","Recalled","Reopened"].includes(st))p.hist.push(H("Oct 3, 11:12 AM","Anshika R.","Calibration approved","g"));
  if(["Shared","Acknowledged","Disputed","Recalled"].includes(st))p.hist.push(H("Oct 6, 7:00 AM","Anshika R.","Packet shared by SMS","b"));
  if(["Acknowledged","Disputed"].includes(st))p.hist.push(H("Oct 7, 6:18 PM",e.name,"Acknowledged receipt"+(i%3===0?" · Comment: \"Thanks, I want to work toward lead hand.\"":""),"g"));
  if(st==="Disputed"){p.prev="Acknowledged";p.dispute={by:e.name,on:"Oct 9",due:"Oct 16",text:"My attendance score doesn't count the two weeks I was sent to the Harbor Point site by Tom. I was never late.",owner:"Anshika R."};p.hist.push(H("Oct 9, 8:41 PM",e.name,"Flagged a dispute","r"))}
  if(st==="Recalled"){p.prev="Shared";p.hist.push(H("Oct 8, 10:05 AM","Anshika R.","Recalled · Reason: Wrong job site listed on packet","a"))}
  if(st==="Reopened"){p.prev="Acknowledged";p.reopen={by:"Anshika R.",editors:[e.mgr],notify:["Employee","Manager"],reason:"Manager request: certification renewal was completed before review date"};p.hist.push(H("Oct 12, 3:30 PM","Anshika R.","Reopened · Reason: Manager request: certification renewal was completed before review date · Editors: "+e.mgr,"a"))}
  if(st==="Abandoned")p.hist.push(H("Aug 1, 12:00 AM","System","Manager review missing at phase close · marked abandoned","r"));
  packets.push(p);
 });
 // c3 office
 emps.filter(e=>e.type==="Office"&&e.name!=="Dana Whitfield").forEach((e,i)=>packets.push({id:pid++,cid:"c3",eid:e.id,st:["In progress","Submitted","Not started","In progress","Submitted","In progress","Not started","Submitted"][i],exc:null,due:"Oct 24",self:{st:["In progress","Submitted","Not started","In progress","Submitted","In progress","Not started","Submitted"][i]},mgr:{st:"Not started",by:e.mgr},contrib:[],peers:[{by:"Peer reviewer 1",st:i%2?"Submitted":"In progress"},{by:"Peer reviewer 2",st:"Not started"},{by:"Peer reviewer 3",st:i%3?"Submitted":"Not started"}],rating:null,ver:1,hist:[H("Oct 8, 9:00 AM","System","Packet created","b")]}));
 // c4 new hires
 field.filter(e=>e.hire==="Feb 2026"||e.hire==="May 2024").slice(0,4).forEach((e,i)=>packets.push({id:pid++,cid:"c4",eid:e.id,st:["Manager in progress","Not started","Manager submitted","Manager in progress"][i],exc:null,due:["Oct 20","Oct 28","Oct 14","Nov 3"][i],self:{st:"Off"},mgr:{st:["In progress","Not started","Submitted","In progress"][i],by:e.mgr},contrib:[],peers:[],rating:i===2?4:null,ver:1,hist:[H("Sep 25","System","Enrolled automatically · hire date","b")]}));
 // c6 closed
 field.slice(0,22).forEach((e,i)=>packets.push({id:pid++,cid:"c6",eid:e.id,st:"Closed",exc:null,due:"Aug 7",self:{st:"Submitted"},mgr:{st:"Submitted",by:e.mgr},contrib:[],peers:[],rating:[4,3,4,5,3,4,2,4][i%8],ver:1,hist:[H("Aug 10","Anshika R.","Cycle closed","n")]}));

 const goals=[
  {id:1,eid:3,title:"Renew Fall Protection certification",cat:"Certification and training",lvl:"Individual",due:"Nov 15, 2026",prog:40,st:"On track",src:"Created from certification gap in Q3 review"},
  {id:2,eid:1,title:"Lead a 3-person tear-off without rework",cat:"Leadership",lvl:"Individual",due:"Dec 31, 2026",prog:65,st:"On track",src:"From Q3 review comment"},
  {id:3,eid:null,crew:"cA",title:"Zero recordable incidents on Maple Ridge",cat:"Safety",lvl:"Crew",due:"Dec 31, 2026",prog:80,st:"On track"},
  {id:4,eid:9,title:"Reduce flashing rework callbacks to under 2 per month",cat:"Quality",lvl:"Individual",due:"Dec 1, 2026",prog:20,st:"At risk"},
  {id:5,eid:null,crew:"cC",title:"Finish Oak Hollow framing 1 week ahead",cat:"Schedule",lvl:"Project",due:"Nov 30, 2026",prog:55,st:"On track"},
  {id:6,eid:14,title:"Complete OSHA 30",cat:"Certification and training",lvl:"Individual",due:"Jan 31, 2027",prog:10,st:"Not started"},
  {id:7,eid:6,title:"Learn standing-seam metal install",cat:"Professional development",lvl:"Individual",due:"Mar 31, 2027",prog:35,st:"On track"},
  {id:8,eid:20,title:"On-time arrival 95% for 8 weeks",cat:"Productivity",lvl:"Individual",due:"Nov 30, 2026",prog:100,st:"Completed"}];
 const notes=[
  {id:1,eid:2,by:"Luis Delgado",type:"Praise",vis:"Employee-visible",txt:"Caught a missing ridge vent before the inspector did. Saved us a return trip.",on:"Oct 13",voice:true,linked:true},
  {id:2,eid:5,by:"Tom Hayes",type:"Safety observation",vis:"Manager-only",txt:"Harness not clipped while moving between sections on the east slope. Talked to him on the spot.",on:"Oct 12",voice:true,linked:true},
  {id:3,eid:11,by:"Ken Okafor",type:"Concern",vis:"HR-only",txt:"Third late arrival this month. Says his ride fell through.",on:"Oct 10",voice:false,linked:false},
  {id:4,eid:7,by:"Coworker",type:"Recognition",vis:"Employee-visible",txt:"Stayed late to help Siding Crew finish before the rain.",on:"Oct 9",voice:false,anon:true,linked:false},
  {id:5,eid:16,by:"Ray Brooks",type:"Praise",vis:"Employee-visible",txt:"Trained two apprentices on J-channel cuts this week.",on:"Oct 8",voice:true,linked:true}];
 const cas=[
  {id:1,eid:11,kind:"Write-up",cat:"Attendance",on:"Oct 11, 2026",by:"Ken Okafor",st:"Awaiting acknowledgment",ver:1},
  {id:2,eid:5,kind:"Write-up",cat:"Safety",on:"Sep 22, 2026",by:"Tom Hayes",st:"Acknowledged",ver:2},
  {id:3,eid:9,kind:"Improvement plan",cat:"Quality",on:"Sep 1, 2026",by:"Luis Delgado",st:"Check-in due Oct 15",ver:1,checkins:"30 / 60 days"},
  {id:4,eid:18,kind:"Improvement plan",cat:"Attendance",on:"Jun 3, 2026",by:"Ken Okafor",st:"Completed",ver:1,checkins:"30 / 60 days"}];
 const rehire=[
  {eid:21,st:"Eligible with conditions",reason:"Needs fall protection renewal before next roofing project",by:"Tom Hayes",on:"Sep 30, 2026",when:"Crew review · Harbor Point Retail"},
  {name:"Gary Holt",st:"Not eligible",reason:"Walked off site twice without notice",by:"Luis Delgado",on:"Aug 12, 2026",when:"Termination"},
  {name:"Felipe Rojas",st:"Eligible",reason:"Seasonal layoff, strong crew feedback",by:"Ray Brooks",on:"Dec 20, 2025",when:"Seasonal layoff"}];
 const reopenReqs=[{pid:packets.find(p=>p.cid==="c6").id,by:"Luis Delgado",on:"Oct 13",reason:"Score for safety was entered as 2 by mistake. Should be 4."}];
 const activity=[
  {t:"Oct 14, 8:10 AM",txt:"3 new field hires auto-enrolled in Q4 2026 Field Crew Check-in",c:"b"},
  {t:"Oct 13, 6:44 PM",txt:"Luis Delgado requested a reopen on Q2 2026 · Miguel Torres",c:"a"},
  {t:"Oct 12, 3:30 PM",txt:"Anshika R. reopened Q3 2026 · "+field[17].name,c:"a"},
  {t:"Oct 9, 8:41 PM",txt:field[8].name+" flagged a dispute on Q3 2026",c:"r"},
  {t:"Oct 8, 10:05 AM",txt:"Anshika R. recalled Q3 2026 · "+field[11].name,c:"a"},
  {t:"Oct 6, 7:00 AM",txt:"Q3 2026 results shared with 14 employees by SMS",c:"g"},
  {t:"Oct 5, 9:02 AM",txt:"Q4 2026 Field Crew Check-in launched · 24 packets created",c:"g"}];
 return {crews,sites,emps,templates,cycles,packets,goals,notes,cas,rehire,reopenReqs,activity,
  settings:{selfOn:true,selfVis:"After reviewer submits",results:"After cycle closes",extra:"HR pre-maps",past:"Last cycle, score only",reopen:"1 year",certOn:true,certWin:90,scale:"1–5 with definitions",anonMin:3,editAfter:true,delegate:"Allowed, HR is told",nomEsc:"Auto-approve after 3 days",payrollView:"Status and final results",disputeDays:5,
   levels:["Needs improvement","Developing","Meets expectations","Exceeds expectations","Outstanding"],
   starLevels:["Needs improvement","Developing","Meets expectations","Exceeds expectations","Outstanding"],
   notifs:[{n:"Review to complete",to:"Reviewer",when:"When assigned or phase opens",on:true,ch:"SMS · App · Email"},{n:"Deadline reminder",to:"Reviewers with open reviews",when:"3 days before and on due date",on:true,ch:"SMS · App · Email"},{n:"Overdue escalation",to:"Reviewer's manager, then HR",when:"1 day after due date",on:true,ch:"App · Email"},{n:"Nomination action needed",to:"Employee / approving manager",when:"When nominations open or are submitted",on:true,ch:"SMS · App · Email"},{n:"Results ready",to:"Employee",when:"When packet is shared",on:true,ch:"SMS · App · Email"},{n:"Reopen request or dispute",to:"HR owner",when:"Immediately",on:true,ch:"App · Email"},{n:"Review updated",to:"People ticked at reopen or recall",when:"When review is closed again or re-shared",on:true,ch:"SMS · App · Email"}]},
  checklist:[true,true,true,true,true,true,false]};
}
function init(newCo){
 D=seed();
 S={view:"home",cid:null,tab:"overview",tplId:null,fStatus:"All",q:"",sel:new Set(),newCo:!!newCo,wz:null,group:"crew",tplTab:"Active",cycTab:"All",caTab:"Write-ups",calGroup:"Foreman",goalF:"All",menu:null,openMsg:0,flt:{}};
 if(newCo){D.cycles=[];D.packets=[];D.goals=[];D.notes=[];D.cas=[];D.rehire=[];D.reopenReqs=[];D.activity=[];D.checklist=[false,false,false,false,false,false,false];
  D.templates.forEach(t=>{t.used=[];if(!t.starter){t.status="Starter"}});D.templates=D.templates.filter(t=>t.starter);D.templates.forEach(t=>t.status="Starter");}
}
const E=id=>D.emps.find(e=>e.id===id);
const EN=n=>D.emps.find(e=>e.name===n);
const C=id=>D.cycles.find(c=>c.id===id);
const T=id=>D.templates.find(t=>t.id===id);
const PK=id=>D.packets.find(p=>p.id===id);
const crewName=id=>(D.crews.find(c=>c.id===id)||{}).name||"—";

/* ================= LAYERS ================= */
function closeLayer(){S.pkOpen=null;S.fDraft=null;$("#layer").innerHTML="";document.body.style.overflow=""}
function openDrawer({title,sub="",body,foot="",w=760,label="",avatar="",tabs="",status="",bodyCls="",hist=""}){
 S.pkOpen=null;
 $("#layer").innerHTML=`<div class="dbg" onclick="if(event.target===this)closeLayer()"><div class="drawer" style="width:${w}px" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="dh"><div class="row" style="gap:16px;flex-wrap:nowrap;min-width:0;flex:1">${avatar?`<span class="dav">${avatar}</span>`:""}<div style="min-width:0">${label?`<div class="dlab">${label}</div>`:""}<h2>${title}</h2>${sub?`<div class="dim sm" style="margin-top:4px">${sub}</div>`:""}</div></div>${status}<button class="x" onclick="closeLayer()" aria-label="Close">✕</button></div><div class="db ${bodyCls}">${tabs}${body}</div>${foot?`<div class="df">${hist?`<button class="hbtn" title="History" onclick="${hist}">${ic("hist")}</button>`:""}${foot}</div>`:""}</div></div>`;
 document.body.style.overflow="hidden";
}

function openModal(html,w=560){
 const ex=$("#layer .mbg");if(ex)ex.remove();
 $("#layer").insertAdjacentHTML("beforeend",`<div class="mbg" onclick="if(event.target===this)closeModal()"><div class="modal" style="width:${w}px" role="dialog" aria-modal="true">${html}</div></div>`);
}
function closeModal(){const m=$("#layer .mbg");if(m)m.remove();if(!$("#layer .dbg"))document.body.style.overflow=""}
let _tt;
function toast(msg,undo){
 clearTimeout(_tt);window._undo=undo||null;
 $("#toastHost").innerHTML=`<div class="toast" role="status"><span><b>✓</b> ${msg}</span>${undo?`<button class="link" onclick="window._undo&&window._undo();$('#toastHost').innerHTML=''">Undo</button>`:""}</div>`;
 _tt=setTimeout(()=>$("#toastHost").innerHTML="",undo?7000:4200);
}
function nav(view,o={}){
 if(o.q===undefined)S.q="";
 Object.assign(S,{view,menu:null},o);
 if(o.keepSel!==true)S.sel=new Set();
 render();window.scrollTo(0,0);
}
function setMode(n){init(n);render()}
function resetDemo(){init(S.newCo);render();toast("Demo data reset.")}
function toggleMenu(id,ev){ev&&ev.stopPropagation();S.menu=S.menu===id?null:id;render(true)}
/* Close an open kebab / More menu on any click outside it. Capture phase, because many table cells call stopPropagation()
   (actions, checkbox cells) and would otherwise swallow the click. That outside click only closes the menu: it is stopped
   here so it doesn't also open the row, switch tab or navigate underneath (like a menu backdrop). Inputs still get focus,
   since focus moves on mousedown. Escape closes it too and returns focus to the trigger. */
const MENU_ZONE=".kebab,.cd-bulk-more,.cd-bulk-menu";
function menuDismiss(){if(!S||!S.menu)return null;S.menu=null;
 document.querySelectorAll(".kebab .menu,.cd-bulk-menu").forEach(m=>m.remove());
 let t=null;document.querySelectorAll('.kebab [aria-expanded="true"],.cd-bulk-more[aria-expanded="true"]').forEach(b=>{b.setAttribute("aria-expanded","false");t=b});
 return t||document.querySelector(".kebab:focus-within button")}
document.addEventListener("click",e=>{if(S&&S.menu&&!e.target.closest(MENU_ZONE)){menuDismiss();e.preventDefault();e.stopPropagation()}},true);
/* Picking a menu item: items run "S.menu=null;action()" and many actions only open a modal without re-rendering the page,
   so the open menu stayed on screen behind (or above) the modal. Once the item's own handler has run, clear any menu left over. */
function menuCleanup(){if(S&&S.menu)return;document.querySelectorAll(".kebab>.menu,.cd-bulk-menu").forEach(m=>m.remove());
 document.querySelectorAll('.kebab [aria-expanded="true"],.cd-bulk-more[aria-expanded="true"]').forEach(b=>b.setAttribute("aria-expanded","false"))}
document.addEventListener("click",e=>{if(e.target.closest(".kebab>.menu button,.cd-bulk-menu button"))setTimeout(menuCleanup,0)},true);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&S&&S.menu){e.stopImmediatePropagation();const t=menuDismiss();if(t)t.focus()}},true);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if($("#layer .mbg"))closeModal();else closeLayer()}});
/* ================= STATUS ENGINE ================= */
const MAIN=["Not started","In progress","Submitted","Manager in progress","Manager submitted","In calibration","Approved","Shared","Acknowledged","Closed"];
const PILL={"Not started":"n","In progress":"b","Submitted":"b","Manager in progress":"b","Manager submitted":"v","In calibration":"v","Approved":"g","Shared":"g","Acknowledged":"g","Closed":"n","Overdue":"r","Paused":"a","Reopened":"a","Recalled":"a","Disputed":"r","Abandoned":"n","Removed":"n","Cancelled":"n","Off":"o","Starter":"b","Active":"g","Draft":"n","Archived":"n","Scheduled":"b"};
const pill=(s,extra="")=>`<span class="pill ${PILL[s]||"n"}"><i></i>${esc(s)}${extra}</span>`;
const pstat=p=>p.exc||p.st;
const statPill=p=>p.exc?`${pill(p.exc)} <span class="dim sm">· ${esc(p.exc==="Removed"?"was "+(p.prev||p.st):p.st)}</span>`:pill(p.st);
function log(p,txt,c="b",who="Anshika R."){p.hist.push({t:"Oct 14, "+new Date().toTimeString().slice(0,5),who,txt,c});D.activity.unshift({t:"Today "+new Date().toTimeString().slice(0,5),txt:`${who} · ${txt} · ${E(p.eid).name}`,c})}
const cycOf=p=>C(p.cid);

function nextStep(p){
 const e=E(p.eid),c=cycOf(p),A=(l,f,k="")=>({l,f,k});
 const noContact=!e.phone&&!e.email;
 if(p.exc==="Removed")return{t:`Removed from this cycle. Feedback already submitted is kept.`,a:[A("Restore to cycle",`actRestore(${p.id})`,"p")]};
 if(p.exc==="Paused")return{t:"Paused. Nothing can be edited and reminders are stopped. Drafts are kept.",a:[A("Resume",`actResume(${p.id})`,"p")]};
 if(p.exc==="Overdue"){
  const who=p.self.st==="Overdue"?e.name+"'s self review":"Manager review";
  return{t:`${who} was due ${p.due} and is overdue.${noContact?" This worker has no phone or email on file.":""}`,a:[noContact?A("Add phone or assign kiosk",`actContact(${p.id})`,"p"):A("Send reminder",`actRemind([${p.id}])`,"p"),A("Extend for this person",`actExtend([${p.id}])`),noContact?A("Enter answers from paper form",`actOnBehalf(${p.id})`):A("Enter on their behalf",`actOnBehalf(${p.id})`)]};}
 if(p.noReviewer&&["Submitted","Not started","In progress"].includes(p.st))return{t:`No manager reviewer. ${e.name}'s manager in Lumber has left, so nobody can write this review.`,a:[A("Use Lumber manager ("+(D.crews.find(x=>x.id===e.crew)||{}).fm+")",`actFixReviewer(${p.id})`,"p"),A("Choose reviewer",`actReassign([${p.id}])`),A("Assign HR as reviewer",`actFixReviewer(${p.id},'Anshika R.')`)]};
 switch(p.st){
  case "Not started":return{t:`Waiting on ${e.name} to open the self review.${noContact?" No phone or email on file.":` Sent by ${e.phone?"SMS":"email"}${e.lang==="ES"?" in Spanish":""}.`}`,a:[noContact?A("Add phone or assign kiosk",`actContact(${p.id})`,"p"):A("Send reminder",`actRemind([${p.id}])`,"p"),A("Extend",`actExtend([${p.id}])`),A("Enter on their behalf",`actOnBehalf(${p.id})`)]};
  case "In progress":return{t:`${e.name} has started the self review. Draft saved automatically.`,a:[A("Send reminder",`actRemind([${p.id}])`,"p"),A("Extend",`actExtend([${p.id}])`)]};
  case "Submitted":return{t:`Self review is in. Waiting on ${p.mgr.by} to start the manager review.`,a:[A("Remind "+p.mgr.by.split(" ")[0],`actRemind([${p.id}],'mgr')`,"p"),A("Reassign reviewer",`actReassign([${p.id}])`)]};
  case "Manager in progress":return{t:`${p.mgr.by} is writing the review${p.contrib.length?`; ${p.contrib.map(x=>x.by).join(", ")} contributes (${p.contrib[0].hrs} hrs together)`:""}.`,a:[A("Remind "+p.mgr.by.split(" ")[0],`actRemind([${p.id}],'mgr')`,"p"),A("Reassign reviewer",`actReassign([${p.id}])`),A("Extend",`actExtend([${p.id}])`)]};
  case "Manager submitted":return c.calib?{t:"All required reviews are in. This cycle requires calibration before sharing.",a:[A("Start calibration",`actCalibrate([${p.id}])`,"p"),A("Send back to manager",`actSendBack(${p.id})`)]}:{t:"All required reviews are in. Ready to share.",a:[A("Share with employee",`actShare([${p.id}])`,"p"),A("Send back to manager",`actSendBack(${p.id})`)]};
  case "In calibration":return{t:"Ratings are being compared. The manager can view but not edit.",a:[A("Open calibration",`nav('cycle',{cid:'${p.cid}',tab:'calibration'})`,"p"),A("Approve this packet",`actApprove([${p.id}])`),A("Send back to manager",`actSendBack(${p.id})`)]};
  case "Approved":return{t:"Ratings locked and ready to share.",a:[A("Share now",`actShare([${p.id}])`,"p"),A("Send back",`actSendBack(${p.id})`)]};
  case "Shared":return{t:`Shared with ${e.name}. ${c.ack?"Waiting for acknowledgment.":""}`,a:[c.ack?A("Remind to acknowledge",`actRemind([${p.id}],'ack')`,"p"):A("Close packet",`actClosePk([${p.id}])`,"p"),A("Recall to correct",`actRecall(${p.id})`),A("Download PDF",`toast('PDF downloaded (v${p.ver}).')`)]};
  case "Acknowledged":return{t:`${e.name} confirmed receipt. They can still flag a dispute until the cycle closes.`,a:[A("Close packet",`actClosePk([${p.id}])`,"p"),A("Recall to correct",`actRecall(${p.id})`),A("Download PDF",`toast('PDF downloaded (v${p.ver}).')`)]};
  case "Disputed":return{t:`${e.name} disputed the results on ${p.dispute.on}. Response due ${p.dispute.due}.`,a:[A("Resolve dispute",`actDispute(${p.id})`,"p")]};
  case "Recalled":return{t:`Recalled. ${e.name} sees "This review is being updated".`,a:[A("Correct and re-share",`actReshare(${p.id})`,"p"),A("Reopen for manager",`actReopen(${p.id})`)]};
  case "Reopened":return{t:`Reopened for ${(p.reopen&&p.reopen.editors.join(", "))||"editing"}. People ticked are told when it's closed again.`,a:[A("Mark edits done",`actFinishReopen(${p.id})`,"p"),A("Cancel reopen",`actCancelReopen(${p.id})`)]};
  case "Abandoned":return{t:"Cycle phase closed with the manager review missing.",a:[A("Reopen and assign reviewer",`actReopen(${p.id})`,"p"),A("Share without it",`actShare([${p.id}])`)]};
  case "Closed":return{t:"Final and read-only.",a:[A("Reopen with reason",`actReopen(${p.id})`,"p"),A("Download PDF",`toast('PDF downloaded.')`)]};
 }
 return{t:"",a:[]};
}

/* ---------- reason modal helper ---------- */
function reasonModal({title,desc="",affected="",confirm="Confirm",danger=false,extra="",reasonLabel="Reason",needReason=true,onOk}){
 window._ok=onOk;
 openModal(`<h3>${title}</h3>${desc?`<p class="dim" style="margin:0 0 12px;line-height:1.5">${desc}</p>`:""}
 ${affected?`<div class="warn" style="margin-bottom:12px">${affected}</div>`:""}
 <div class="fg">${extra}${needReason?`<div><label class="fl" for="mReason">${reasonLabel} <span class="req">*</span></label><textarea class="inp" id="mReason" placeholder="This is logged in the audit trail"></textarea><div class="err" id="mErr" hidden>Add a reason. It's saved to the audit trail.</div></div>`:""}</div>
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn ${danger?"d solid":"p"}" onclick="const r=$('#mReason');if(r&&!r.value.trim()){$('#mErr').hidden=false;r.focus();return}window._ok(r?r.value.trim():'');">${confirm}</button></div>`);
 setTimeout(()=>{const r=$("#mReason");if(r)r.focus()},30);
}
const after=()=>{closeModal();if($("#layer .dbg")&&S.pkOpen)openPacket(S.pkOpen);render(true)};
const ids2p=ids=>ids.map(PK).filter(Boolean);
const nm=ps=>ps.length===1?E(ps[0].eid).name:ps.length+" people";

/* ---------- actions ---------- */
function actRemind(ids,who="self"){const ps=ids2p(ids);
 const sms=ps.filter(p=>E(p.eid).phone).length;
 ps.forEach(p=>log(p,who==="mgr"?"Reminder sent to "+p.mgr.by:who==="ack"?"Acknowledgment reminder sent":"Reminder sent"));
 toast(who==="mgr"?`Reminder sent to ${[...new Set(ps.map(p=>p.mgr.by))].join(", ")}.`:`Reminder sent to ${nm(ps)}${sms?` · ${sms} by SMS`:""}.`);render(true);if(S.pkOpen)openPacket(S.pkOpen)}
function actExtend(ids){const ps=ids2p(ids);
 reasonModal({title:`Extend due date · ${nm(ps)}`,desc:"Only these people get more time. Everyone else keeps the cycle's dates.",confirm:"Extend",
  extra:`<div><label class="fl" for="mDate">New due date</label><select class="inp" id="mDate"><option>Oct 21, 2026</option><option>Oct 23, 2026</option><option selected>Oct 28, 2026</option><option>Nov 4, 2026</option></select><div class="fd">Reminders reschedule automatically.</div></div>`,
  onOk:r=>{const d=$("#mDate").value;ps.forEach(p=>{p.due=d.replace(", 2026","");if(p.exc==="Overdue"){p.exc=null;if(p.self.st==="Overdue")p.self.st="Not started"}log(p,`Extended to ${d} · Reason: ${r}`,"a")});after();toast(`Extended to ${d} for ${nm(ps)}.`)}})}
function reviewerOpts(){return D.emps.filter(e=>e.isMgr).map(e=>`<option>${e.name}</option>`).join("")+`<option>Anshika R. (HR)</option>`}
function actReassign(ids){const ps=ids2p(ids);
 reasonModal({title:`Reassign manager reviewer · ${nm(ps)}`,desc:"The new reviewer sees the same form and context panel, for these workers only.",confirm:"Reassign",
  extra:`<div><label class="fl" for="mRev">New reviewer</label><select class="inp" id="mRev">${reviewerOpts()}</select><div class="fd"><span class="asm">Suggested</span> Tom Hayes worked 212 hrs with ${ps.length===1?E(ps[0].eid).name.split(" ")[0]:"them"} this quarter.</div></div>
  <div><div class="fl">Draft</div><label class="opt"><input type="radio" name="mDr" checked> Hand over the current draft</label><label class="opt"><input type="radio" name="mDr"> New reviewer starts fresh (draft kept in history)</label></div>`,
  onOk:r=>{const v=$("#mRev").value;ps.forEach(p=>{const old=p.mgr.by;p.mgr.by=v;p.noReviewer=false;log(p,`Reviewer changed from ${old||"none"} to ${v} · Reason: ${r}`,"a")});after();toast(`${v} is now the reviewer for ${nm(ps)}. They've been notified.`)}})}
function actFixReviewer(id,who){const p=PK(id),e=E(p.eid);const v=who||(D.crews.find(x=>x.id===e.crew)||{}).fm;p.mgr.by=v;p.noReviewer=false;log(p,"Reviewer assigned: "+v,"g");render(true);if(S.pkOpen)openPacket(S.pkOpen);toast(`${v} assigned as reviewer for ${e.name}.`)}
function actRemove(ids){const ps=ids2p(ids).filter(p=>p.exc!=="Removed");
 reasonModal({title:`Remove from cycle · ${nm(ps)}`,desc:"Feedback already submitted is kept. You can restore them while the cycle is open.",confirm:"Remove",danger:true,
  affected:`${ps.length} packet${ps.length>1?"s":""} removed · ${ps.filter(p=>p.mgr.by).length} reviewer${ps.length>1?"s":""} stop getting reminders`,
  onOk:r=>{ps.forEach(p=>{p.prev=p.st;p.exc="Removed";log(p,"Removed from cycle · Reason: "+r,"r")});S.sel=new Set();after();toast(`Removed ${nm(ps)} from the cycle.`,()=>{ps.forEach(p=>{p.exc=null;log(p,"Removal undone","g")});render(true)})}})}
function actRestore(id){const p=PK(id);p.exc=null;p.st=p.prev||p.st;log(p,"Restored to cycle","g");render(true);if(S.pkOpen)openPacket(S.pkOpen);toast(`${E(p.eid).name} restored. Status: ${p.st}.`)}
function actResume(id){const p=PK(id);p.exc=null;log(p,"Resumed","g");render(true);if(S.pkOpen)openPacket(S.pkOpen);toast("Resumed.")}
function actOnBehalf(id){const p=PK(id),e=E(p.eid);
 openModal(`<h3>Enter answers for ${e.name}</h3><p class="dim" style="margin:0 0 12px">Use this when a worker filled out a paper form or answered in person. The review is marked "Entered by HR on behalf of ${e.name}".</p>
 <div class="fg"><div><label class="fl" for="obM">How were the answers collected?</label><select class="inp" id="obM"><option>Paper form</option><option>In person / verbal</option><option>Phone call</option></select></div>
 <div><label class="fl">Upload signed paper form <span class="dim">(optional)</span></label><input type="file" class="inp" style="padding:8px"></div>
 <div class="note">Opens the same form the worker sees, in ${e.lang==="ES"?"Spanish":"English"}. <span class="asm">Form view shown in employee prototype</span></div></div>
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" id="obGo">Save as submitted</button></div>`);
 $("#obGo").onclick=()=>{p.self.st="Submitted";p.exc=null;if(["Not started","In progress"].includes(p.st))p.st="Submitted";log(p,`Self review entered by HR on behalf of ${e.name} (${$("#obM").value})`,"g");after();toast(`Self review saved for ${e.name}, marked as entered by HR.`)}}
function actContact(id){const p=PK(id),e=E(p.eid);
 openModal(`<h3>Reach ${e.name}</h3><p class="dim" style="margin:0 0 12px">No phone or email is on file, so review links can't be sent.</p>
 <div class="choice"><label class="ch on"><input type="radio" name="ctc" value="phone" checked onchange="$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked));$('#ctPh').hidden=false"><div><div class="t">Add a mobile number</div><div class="d">Saved to their Lumber profile. The review link goes out by SMS right away.</div></div></label>
 <div id="ctPh"><input class="inp" id="ctNum" placeholder="(555) 555-0142" inputmode="tel"></div>
 <label class="ch"><input type="radio" name="ctc" value="kiosk" onchange="$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked));$('#ctPh').hidden=true"><div><div class="t">Use the site kiosk</div><div class="d">They sign in with their Lumber PIN at the ${e.site} kiosk. Their foreman is told.</div></div></label>
 <label class="ch"><input type="radio" name="ctc" value="paper" onchange="$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked));$('#ctPh').hidden=true"><div><div class="t">Print a paper form</div><div class="d">Download a PDF in ${e.lang==="ES"?"Spanish":"English"}, then enter the answers on their behalf.</div></div></label></div>
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" id="ctGo">Save</button></div>`);
 $("#ctGo").onclick=()=>{const v=$("input[name=ctc]:checked").value;if(v==="phone"){if(!$("#ctNum").value.trim()){$("#ctNum").focus();$("#ctNum").style.borderColor="var(--red)";return}e.phone=true;log(p,"Mobile number added; review link sent by SMS","g");toast(`Number saved. Review link sent to ${e.name} by SMS.`)}else if(v==="kiosk"){e.kiosk=true;e.phone=true;log(p,"Assigned to site kiosk","g");toast(`${e.name} can complete the review at the ${e.site} kiosk.`)}else{toast("Paper form downloaded. Enter answers when it's back.");}after()}}
function actShare(ids){const ps=ids2p(ids).filter(p=>["Approved","Manager submitted","Abandoned"].includes(p.st)||ids.length===1);
 const c=cycOf(ps[0]);
 openModal(`<h3>Share results · ${nm(ps)}</h3><p class="dim" style="margin:0 0 12px">Each employee gets a text or app notification with a link to their packet${c.ack?" and is asked to acknowledge receipt":""}.</p>
 <div class="choice"><label class="ch on"><input type="radio" name="shw" checked onchange="$('#shDt').hidden=true;$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked))"><div><div class="t">Share now</div></div></label>
 <label class="ch"><input type="radio" name="shw" onchange="$('#shDt').hidden=false;$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked))"><div><div class="t">Schedule</div><div class="d">For example, the morning of their 1:1.</div></div></label>
 <div id="shDt" hidden><select class="inp"><option>Tomorrow, 7:00 AM</option><option>Mon Oct 19, 7:00 AM</option></select></div></div>
 ${ps.some(p=>p.st==="Abandoned")?`<div class="warn" style="margin-top:12px">The packet notes that the manager review is missing.</div>`:""}
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" id="shGo">Share ${ps.length>1?ps.length+" packets":""}</button></div>`);
 $("#shGo").onclick=()=>{ps.forEach(p=>{p.st="Shared";p.exc=null;log(p,`Packet shared (v${p.ver})`,"g")});S.sel=new Set();after();toast(`Shared with ${nm(ps)}.`)}}
function actRecall(id){const p=PK(id),e=E(p.eid);
 reasonModal({title:`Recall ${e.name}'s packet`,desc:`${e.name} will see "This review is being updated" until you re-share it. The current version is kept.`,confirm:"Recall",danger:true,
  onOk:r=>{p.prev=p.st;p.st="Recalled";log(p,"Recalled · Reason: "+r,"a");after();toast("Recalled. Correct it, then re-share.")}})}
function actReshare(id){const p=PK(id),e=E(p.eid);
 openModal(`<h3>Re-share corrected packet</h3><p class="dim" style="margin:0 0 12px">${e.name} is told the review was updated. Version ${p.ver+1} supersedes version ${p.ver}; both stay in history.</p>
 <div class="ok">Change summary sent to employee: <b>"Job site corrected to Maple Ridge Apartments."</b></div>
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" id="rsGo">Re-share as v${p.ver+1}</button></div>`);
 $("#rsGo").onclick=()=>{p.ver++;p.st="Shared";log(p,`Re-shared as v${p.ver}`,"g");after();toast(`Re-shared as version ${p.ver}. ${e.name} was told it changed.`)}}
function actReopen(id){const p=PK(id),e=E(p.eid),c=cycOf(p);
 reasonModal({title:`Reopen ${e.name}'s review`,desc:`The current version is kept. Only the editors you pick are told now; everyone you tick below hears when it's closed again.`,confirm:"Reopen",
  extra:`<div><div class="fl">Who needs to edit?</div><label class="opt"><input type="checkbox" id="roM" checked> Manager (${p.mgr.by||"—"})</label>${p.self.st!=="Off"?`<label class="opt"><input type="checkbox" id="roE"> Employee (self review)</label>`:""}</div>
  <div><div class="fl">Notify when it's closed again</div><label class="opt"><input type="checkbox" checked> Employee</label><label class="opt"><input type="checkbox" checked> Manager</label><label class="opt"><input type="checkbox"> Payroll admin</label></div>
  ${c.calib?`<div class="note">This cycle requires calibration, so the edited packet goes back through calibration before re-sharing.</div>`:""}`,
  onOk:r=>{p.prev=p.st;p.st="Reopened";p.exc=null;p.reopen={by:"Anshika R.",editors:[p.mgr.by],reason:r};log(p,"Reopened · Reason: "+r,"a");after();toast(`Reopened. ${p.mgr.by} was asked to edit.`)}})}
function actCancelReopen(id){const p=PK(id);reasonModal({title:"Cancel reopen",desc:"The packet returns to its prior version and status. Edits made since the reopen are discarded.",confirm:"Cancel reopen",danger:true,onOk:r=>{p.st=p.prev||"Closed";log(p,"Reopen cancelled · Reason: "+r,"a");after();toast("Reopen cancelled. Prior version restored.")}})}
function actFinishReopen(id){const p=PK(id),c=cycOf(p);p.ver++;p.st=c.calib&&c.status!=="Closed"?"In calibration":"Approved";log(p,`Edits done · v${p.ver} created`,"g");render(true);if(S.pkOpen)openPacket(S.pkOpen);toast(`Edits saved as version ${p.ver}. Next: ${p.st==="In calibration"?"calibrate, then share":"share"}.`)}
function actDispute(id){const p=PK(id),e=E(p.eid);
 openModal(`<h3>Resolve dispute · ${e.name}</h3>
 <div class="bad" style="margin:8px 0 14px"><b>${e.name} wrote on ${p.dispute.on}:</b><br>"${esc(p.dispute.text)}"</div>
 <div class="fl">Outcome <span class="req">*</span></div>
 <div class="choice" id="dOut">${[["upheld","Upheld","No change. Packet returns to Acknowledged."],["corrected","Corrected","Review is reopened for "+p.mgr.by+", corrected and re-shared."],["escalated","Escalated","Sent to a named approver. Stays Disputed with a new owner."]].map((o,i)=>`<label class="ch"><input type="radio" name="dOut" value="${o[0]}" onchange="$$('#dOut .ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked))"><div><div class="t">${o[1]}</div><div class="d">${o[2]}</div></div></label>`).join("")}</div>
 <div style="margin-top:12px"><label class="fl" for="dNote">Resolution note <span class="req">*</span></label><textarea class="inp" id="dNote" placeholder="${e.name} sees this note"></textarea></div>
 <div class="err" id="dErr" hidden>Pick an outcome and add a note. ${e.name} is told both.</div>
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" id="dGo">Resolve</button></div>`);
 $("#dGo").onclick=()=>{const o=$("input[name=dOut]:checked"),n=$("#dNote").value.trim();if(!o||!n){$("#dErr").hidden=false;return}
  if(o.value==="upheld"){p.st=p.prev||"Acknowledged"}else if(o.value==="corrected"){p.st="Reopened";p.reopen={editors:[p.mgr.by]}}else{p.dispute.owner="Dana Whitfield"}
  log(p,`Dispute resolved: ${o.value} · Note: ${n}`,o.value==="escalated"?"a":"g");after();toast(`Dispute ${o.value}. ${e.name} has been notified.`)}}
function actCalibrate(ids){ids2p(ids).forEach(p=>{p.st="In calibration";log(p,"Calibration started","b")});render(true);if(S.pkOpen)openPacket(S.pkOpen);toast("Moved to calibration.",null)}
function actApprove(ids){const ps=ids2p(ids);ps.forEach(p=>{p.st="Approved";log(p,"Calibration approved · ratings locked","g")});S.sel=new Set();render(true);if(S.pkOpen)openPacket(S.pkOpen);toast(`Approved ${nm(ps)}. Ratings locked; managers can see final ratings.`)}
function actSendBack(id){const p=PK(id);reasonModal({title:"Send back to manager",desc:`${p.mgr.by} can edit again. The packet returns to Manager in progress.`,confirm:"Send back",onOk:r=>{p.st="Manager in progress";p.mgr.st="In progress";log(p,"Sent back to manager · Reason: "+r,"a");after();toast(`Sent back to ${p.mgr.by}.`)}})}
function actClosePk(ids){ids2p(ids).forEach(p=>{p.st="Closed";log(p,"Packet closed","n")});render(true);if(S.pkOpen)openPacket(S.pkOpen);toast("Closed. Reopen any time within 1 year.")}
/* ================= SHELL ================= */
const NAV=[["home","Home","home"],["cycles","Review cycles","cycle"],["templates","Questionnaires","tpl"],["g","Develop"],["goals","Goals","goal"],["feedback","Feedback & notes","chat"],["corrective","Corrective action & rehire","flag"],["g","Insights"],["reports","Reports","chart"],["settings","Settings","gear"]];
function attention(){
 if(S.newCo)return[];
 const P=D.packets,it=[];
 const disp=P.filter(p=>p.st==="Disputed");
 if(disp.length)it.push({sev:"r",t:`${disp.length} dispute${disp.length>1?"s":""} waiting for a response`,d:`${E(disp[0].eid).name} · Q3 2026 · response due ${disp[0].dispute.due}`,a:[["Resolve",`actDispute(${disp[0].id})`,"p"],["Open packet",`openPacket(${disp[0].id})`]]});
 if(D.reopenReqs.length){const r=D.reopenReqs[0],p=PK(r.pid);it.push({sev:"a",t:`${D.reopenReqs.length} reopen request from a manager`,d:`${r.by} · ${E(p.eid).name} · ${cycOf(p).name}: "${r.reason}"`,a:[["Review request",`openReopenReq(0)`,"p"]]})}
 const nr=P.filter(p=>p.noReviewer&&p.exc!=="Removed");
 if(nr.length)it.push({sev:"r",t:`${nr.length} reviewees have no manager reviewer`,d:`Q4 2026 Field Crew Check-in · their manager in Lumber has left`,a:[["Use Lumber managers",`nr_fix()`,"p"],["Review",`nav('cycle',{cid:'c1',tab:'reviewees',fStatus:'No reviewer'})`]]});
 const od=P.filter(p=>p.exc==="Overdue");
 if(od.length)it.push({sev:"a",t:`${od.length} review${od.length>1?"s are":" is"} overdue`,d:`Q4 2026 Field Crew Check-in · self review phase closed Oct 12; late submissions are still accepted`,a:[["Remind all",`actRemind([${od.map(p=>p.id)}])`,"p"],["Extend",`actExtend([${od.map(p=>p.id)}])`],["View",`nav('cycle',{cid:'c1',tab:'reviewees',fStatus:'Overdue'})`]]});
 const nc=P.filter(p=>p.cid==="c1"&&p.exc!=="Removed"&&!E(p.eid).phone&&!E(p.eid).email);
 if(nc.length)it.push({sev:"a",t:`${nc.length} worker${nc.length>1?"s":""} can't be reached`,d:`No phone or email on file: ${nc.map(p=>E(p.eid).name).join(", ")}`,a:[["Fix "+E(nc[0].eid).name.split(" ")[0],`actContact(${nc[0].id})`,"p"]]});
 const cal=P.filter(p=>p.cid==="c2"&&p.st==="In calibration");
 if(cal.length)it.push({sev:"b",t:`${cal.length} packets waiting on calibration`,d:"Q3 2026 Field Crew Check-in · sharing is blocked until approved",a:[["Open calibration",`nav('cycle',{cid:'c2',tab:'calibration'})`,"p"]]});
 const ap=P.filter(p=>p.cid==="c2"&&p.st==="Approved");
 if(ap.length)it.push({sev:"b",t:`${ap.length} approved packets ready to share`,d:"Q3 2026 Field Crew Check-in",a:[["Share all",`actShare([${ap.map(p=>p.id)}])`,"p"]]});
 return it;
}
const PMNAV=[["home","Overview"],["cycles","Review Cycles"],["templates","Questionnaires"],["goals","Goals"],["feedback","Feedback & Notes"],["corrective","Corrective Actions & Rehire"],["reports","Reports"]];
function navOn(k){return S.view===k||(k==="cycles"&&["cycle","wizard"].includes(S.view))||(k==="templates"&&S.view==="builder")||(k==="reports"&&S.view==="report")}
function renderNav(){
 const n=attention().length;
 $("#pmdd").innerHTML=PMNAV.map(x=>`<button class="${navOn(x[0])?"on":""}" onclick="event.stopPropagation();S.pmOpen=false;nav('${x[0]}')">${x[1]}${x[0]==="home"&&n?`<span class="cnt">${n}</span>`:""}</button>`).join("")+`<hr><button onclick="event.stopPropagation();S.pmOpen=false;nav('settings')">Performance Settings</button>`;
 $("#pmdd").hidden=!S.pmOpen;
 if(S.pmOpen){const r=$("#pmNav").getBoundingClientRect();$("#pmdd").style.left=Math.max(8,Math.min(r.left,window.innerWidth-270))+"px";$("#pmdd").style.top=(r.bottom+6)+"px"}
 $("#modeSeg").innerHTML=`<button class="btn xs ${S.newCo?"":"p"}" onclick="setMode(false)">Running cycles</button> <button class="btn xs ${S.newCo?"p":""}" onclick="setMode(true)">Brand-new company</button>`;
}
function togglePm(e){e.stopPropagation();S.pmOpen=!S.pmOpen;renderNav()}
document.addEventListener("click",e=>{if(S&&S.pmOpen&&!e.target.closest("#pmdd")){S.pmOpen=false;renderNav()}});
function render(){
 renderNav();const m=$("#main");m.innerHTML=(V[S.view]||V.home)();
 document.body.classList.toggle("setmode",S.view==="settings");
 const head=document.createElement("div");head.className="pagehead";
 while(m.firstElementChild&&m.firstElementChild.matches(".crumb,.ph,.ptabs,.lb-tabs"))head.appendChild(m.firstElementChild);
 if(head.children.length)m.prepend(head);
}
/* pagination: 25 rows per page by default; the footer only shows when a table has more than 25 rows.
   Each table passes its own key so page + page size are remembered per table. */
const PG_MIN=25,PG_SIZES=[25,50,100];
const pgState=key=>{const g=S.pg||(S.pg={});return g[key]||(g[key]={p:1,size:PG_MIN})};
const pgClamp=(n,s)=>{const last=Math.max(1,Math.ceil(n/s.size));if(s.p>last)s.p=last;if(s.p<1)s.p=1;return last};
const pgRows=(rows,key="t")=>{const s=pgState(key);pgClamp(rows.length,s);return rows.slice((s.p-1)*s.size,s.p*s.size)};
const pgFoot=(n,key="t")=>{if(n<=PG_MIN)return"";const s=pgState(key),last=pgClamp(n,s),k=esc(key);
 const go=p=>`S.pg['${k}'].p=${p};render()`;
 const nums=last<=7?[...Array(last)].map((_,i)=>i+1):[...new Set([1,s.p-1,s.p,s.p+1,last].filter(p=>p>=1&&p<=last))].sort((a,b)=>a-b).flatMap((p,i,a)=>i&&p-a[i-1]>1?["…",p]:[p]);
 return `<div class="pgfoot"><div class="pp"><select aria-label="Rows per page" onchange="S.pg['${k}']={p:1,size:+this.value};render()">${PG_SIZES.map(z=>`<option ${z===s.size?"selected":""}>${z}</option>`).join("")}</select> per page<span class="dim sm">${(s.p-1)*s.size+1}–${Math.min(n,s.p*s.size)} of ${n}</span></div>
 <nav class="pg" aria-label="Pagination"><button type="button" aria-label="Previous page" ${s.p>1?"":"disabled"} onclick="${go(s.p-1)}">‹</button>${nums.map(p=>p==="…"?`<span>…</span>`:`<button type="button" class="${p===s.p?"on":""}" ${p===s.p?'aria-current="page"':""} onclick="${go(p)}">${p}</button>`).join("")}<button type="button" aria-label="Next page" ${s.p<last?"":"disabled"} onclick="${go(s.p+1)}">›</button></nav></div>`};
const toolbar=(search,extra="")=>`<div class="tools">${search}<div class="row">${extra}<button class="btn" onclick="colMenu(event)">${ic("cols")} Columns</button><button class="btn" onclick="openFilters()">${ic("filter")} Filters${fCount()?` · ${fCount()}`:""}</button></div></div>`;
function colMenu(e){e.stopPropagation();openModal(`<h3>Columns</h3><p class="dim" style="margin:0 0 10px">Choose which columns show in this table.</p>${["Employee","Crew · job site","Self","Manager review","Rating","Status","Next step"].map(c=>`<label class="opt"><input type="checkbox" checked> ${c}</label>`).join("")}<div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" onclick="closeModal();toast('Columns saved for you.')">Apply</button></div>`,380)}
const V={};

/* ================= HOME ================= */
const CK=[["Confirm reporting lines","Every worker has a manager","settings"],["Choose a rating scale","1–5 with definitions","settings"],["Review a starter questionnaire","Preview and save one","templates"],["Create the first cycle","Save a draft","wizard"],["Assign reviewers","Every reviewee has one","wizard"],["Launch","Packets created, people told","wizard"],["First completions","10 reviews or 25% in","cycles"]];
function checklistCard(){
 const done=D.checklist.filter(Boolean).length,cur=D.checklist.indexOf(false);
 return `<div class="card" style="margin-bottom:16px"><div class="hd"><div><h3>Get your first cycle live</h3><div class="dim sm" style="margin-top:2px">${done} of 7 done · most companies finish in under 10 minutes with the defaults</div></div><div class="row"><div class="bar" style="width:160px"><span style="width:${pct(done,7)}%"></span></div><button class="btn s p" onclick="ckGo(${cur})">Continue: ${CK[cur]?CK[cur][0]:"Done"}</button></div></div>
 <div class="ckl">${CK.map((c,i)=>`<button class="ck ${D.checklist[i]?"done":i===cur?"cur":""}" onclick="ckGo(${i})"><span class="n">${D.checklist[i]?"✓":i+1}</span><span class="h">${c[0]}</span><span class="s">${c[1]}</span></button>`).join("")}</div></div>`;
}
function ckGo(i){if(i<0)return;if(i===0)return reportingLines();if(i===1)return nav("settings");if(i===2)return nav("templates");if(i>=3&&i<=5)return startCycle();nav("cycles")}
V.home=()=>{
 const att=attention();
 if(S.newCo)return `<div class="ph"><div><h1>Performance</h1><div class="sub">Run reviews, set goals and document performance using the hours, crews and certifications already in Lumber.</div></div><button class="btn p" onclick="startCycle()">${ic("plus")} Create review cycle</button></div>
 ${checklistCard()}
 <div class="grid3">
  ${[["Quarterly crew check-in","Short self + foreman review every quarter. 3 minutes per worker on a phone.","Quarterly crew check-in"],["Annual review","Self, manager and peer reviews for office staff, with calibration.","Annual"],["90-day new hire","Starts automatically 80 days after each hire date.","90-day new hire"]].map(x=>`<div class="card"><div class="bd"><div class="b" style="font-size:16px">${x[0]}</div><div class="dim sm" style="margin:6px 0 14px;min-height:38px">${x[1]}</div><button class="btn s" onclick="startCycle('${x[2]}')">Start from this</button></div></div>`).join("")}
 </div>
 <div class="card" style="margin-top:16px"><div class="empty"><b>No review cycles yet</b>Your dashboard fills in once your first cycle is live: completion, overdue reviews, certification flags and crew ratings.</div></div>`;
 const P=D.packets.filter(p=>p.exc!=="Removed");
 const c1=P.filter(p=>p.cid==="c1");
 const doneSelf=c1.filter(p=>p.self.st==="Submitted").length;
 const od=P.filter(p=>p.exc==="Overdue").length;
 const wm=P.filter(p=>["Submitted","Manager in progress"].includes(p.st)&&["c1","c3","c4"].includes(p.cid)).length;
 const certs=new Set(P.filter(p=>["c1","c2","c4"].includes(p.cid)).map(p=>p.eid).filter(id=>E(id).certs.some(c=>c.s!=="active"))).size;
 const disp=P.filter(p=>p.st==="Disputed").length;
 const act=D.cycles.filter(c=>c.status==="Active");
 return `<div class="ph"><div><h1>Performance</h1><div class="sub">Good morning, Anshika. ${att.length?`${att.length} things need you today.`:"Nothing needs you today."}</div></div><div class="row"><button class="btn" onclick="nav('reports')">${ic("chart")} Reports</button><button class="btn p" onclick="startCycle()">${ic("plus")} Create review cycle</button></div></div>
 <div class="kpis">
  <button class="kpi" onclick="nav('cycles',{cycTab:'Active'})"><span class="k">Active cycles</span><span class="v">${act.length}</span><span class="t">${P.filter(p=>act.some(c=>c.id===p.cid)).length} people in review</span></button>
  <button class="kpi" onclick="nav('cycle',{cid:'c1',tab:'overview'})"><span class="k">Q4 self reviews done</span><span class="v">${pct(doneSelf,c1.length)}%</span><span class="t g">${doneSelf} of ${c1.length} · late ones still accepted</span></button>
  <button class="kpi" onclick="nav('cycle',{cid:'c1',tab:'reviewees',fStatus:'Overdue'})"><span class="k">Overdue reviews</span><span class="v">${od}</span><span class="t ${od?"r":""}">${od?"Remind or extend":"All on time"}</span></button>
  <button class="kpi" onclick="nav('cycle',{cid:'c1',tab:'reviewers'})"><span class="k">Waiting on a manager</span><span class="v">${wm}</span><span class="t">across 3 cycles</span></button>
  <button class="kpi" onclick="nav('reports',{});setTimeout(()=>openReport('Certification gaps'),0)"><span class="k">Certification flags</span><span class="v">${certs}</span><span class="t a">expired or expiring in 90 days</span></button>
  <button class="kpi" onclick="nav('cycle',{cid:'c2',tab:'reviewees',fStatus:'Disputed'})"><span class="k">Open disputes</span><span class="v">${disp}</span><span class="t ${disp?"r":""}">${disp?"Due Oct 16":"None"}</span></button>
 </div>
 <div class="split">
  <div class="stack">
   <div class="card"><div class="hd"><h3>Needs your attention</h3><span class="dim sm">Each item can be fixed from here</span></div>
    ${att.length?att.map(a=>`<div class="att"><span class="sev ${a.sev}"></span><div class="grow"><div class="t">${a.t}</div><div class="d">${esc(a.d)}</div></div><div class="row acts">${a.a.map(b=>`<button class="btn s ${b[2]||""}" onclick="${b[1]}">${b[0]}</button>`).join("")}</div></div>`).join(""):`<div class="empty"><b>All clear</b>Nothing is blocked or overdue.</div>`}
   </div>
   <div class="card"><div class="hd"><h3>Active cycles</h3><button class="link" onclick="nav('cycles')">All cycles ${ic("arrow","s")}</button></div>
    ${act.map(c=>cycleRow(c)).join("")}
   </div>
  </div>
  <div class="stack">
   <div class="card"><div class="hd"><h3>Q3 rating distribution</h3><span class="dim sm">After calibration</span></div><div class="bd">${distChart(D.packets.filter(p=>p.cid==="c2"&&p.rating))}</div></div>
   <div class="card"><div class="hd"><h3>Crews by average rating</h3><span class="dim sm">Q3 2026</span></div><div class="bd">${crewBars("c2")}</div></div>
   <div class="card"><div class="hd"><h3>Recent activity</h3></div><div class="bd feed">${D.activity.slice(0,6).map(a=>`<div class="ev"><span class="dot ${a.c}"></span><div>${esc(a.txt)}<div class="m">${a.t}</div></div></div>`).join("")}</div></div>
  </div>
 </div>`;
};
function nr_fix(){const nr=D.packets.filter(p=>p.noReviewer&&p.exc!=="Removed");nr.forEach(p=>{const e=E(p.eid);p.mgr.by=(D.crews.find(x=>x.id===e.crew)||{}).fm;p.noReviewer=false;log(p,"Reviewer assigned: "+p.mgr.by+" (Lumber manager)","g")});render();toast(`Assigned ${nr.length} reviewers from Lumber reporting lines.`,()=>{nr.forEach(p=>{p.noReviewer=true;p.mgr.by=null});render()})}
function openReopenReq(i){const r=D.reopenReqs[i],p=PK(r.pid),e=E(p.eid),c=cycOf(p);
 openModal(`<h3>Reopen request</h3><p class="dim" style="margin:0 0 12px">${r.by} asked on ${r.on} to reopen ${e.name}'s review in ${c.name} (closed ${c.closed}).</p>
 <div class="note" style="margin-bottom:12px">"${esc(r.reason)}"</div>
 <div class="ok">Within the 1-year reopen window. If approved, only ${r.by} is asked to edit; the employee hears when it's closed again.</div>
 <div style="margin-top:12px"><label class="fl" for="rrN">Note to ${r.by.split(" ")[0]} <span class="dim">(required to decline)</span></label><textarea class="inp" id="rrN"></textarea></div>
 <div class="mf"><button class="btn" onclick="closeModal()">Later</button><button class="btn d" id="rrNo">Decline</button><button class="btn p" id="rrYes">Approve and reopen</button></div>`);
 $("#rrYes").onclick=()=>{p.prev=p.st;p.st="Reopened";p.reopen={editors:[r.by],reason:r.reason};log(p,`Reopen approved (requested by ${r.by}) · Reason: ${r.reason}`,"a");D.reopenReqs.splice(i,1);closeModal();render();toast(`Reopened. ${r.by} can edit now.`)};
 $("#rrNo").onclick=()=>{if(!$("#rrN").value.trim()){$("#rrN").focus();$("#rrN").style.borderColor="var(--red)";return}D.reopenReqs.splice(i,1);closeModal();render();toast(`Declined. ${r.by} was sent your note.`)}}
function cycleRow(c){
 const ps=D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed");
 const doneN=ps.filter(p=>["Manager submitted","In calibration","Approved","Shared","Acknowledged","Closed"].includes(p.st)).length;
 const nextPh=c.phases.find(x=>x.st==="cur")||c.phases.find(x=>!x.st)||c.phases[c.phases.length-1];
 return `<div class="cyc" onclick="nav('cycle',{cid:'${c.id}',tab:'overview'})" tabindex="0" onkeydown="if(event.key==='Enter')this.click()"><div><div class="nm">${esc(c.name)}</div><div class="mt">${ps.length} reviewees · ${esc(c.period)}</div></div>
 <div class="phases">${c.phases.map(x=>`<div class="${x.st}"><div class="pb"><span style="width:${x.st==="done"?100:x.st==="cur"?Math.max(15,pct(doneN,ps.length)):0}%"></span></div><div class="pl">${x.n}</div></div>`).join("")}</div>
 <div style="text-align:right"><div class="sm b">${nextPh.n}</div><div class="sm dim">closes ${nextPh.e}</div></div></div>`;
}
function distChart(ps,adj){
 const L=D.settings.levels,cnt=[1,2,3,4,5].map(r=>ps.filter(p=>(p.adj||p.rating)===r).length),mx=Math.max(...cnt,1);
 return `<div class="dist">${cnt.map(n=>`<div><span class="bn">${n}</span><span class="bv" style="height:${n/mx*82}%"></span></div>`).join("")}</div><div class="distl">${L.map((l,i)=>`<div>${i+1}<br>${l.split(" ")[0]}</div>`).join("")}</div>`;
}
function crewBars(cid){
 return D.crews.map(c=>{const ps=D.packets.filter(p=>p.cid===cid&&p.rating&&E(p.eid).crew===c.id);const a=ps.length?ps.reduce((s,p)=>s+(p.adj||p.rating),0)/ps.length:0;return{c,a,n:ps.length}}).sort((x,y)=>y.a-x.a).map(x=>`<div class="hb"><span>${x.c.name}<div class="dim" style="font-size:12px">${x.c.fm} · ${x.n} rated</div></span><div class="bar b"><span style="width:${x.a/5*100}%"></span></div><b class="tab-num">${x.a.toFixed(1)}</b></div>`).join("");
}
function reportingLines(){
 const issues=[{n:"Hector Cruz",i:"Manager has left the company (Mike Dunn, terminated Sep 30)",s:"Use crew foreman: Luis Delgado"},{n:"Omar Haddad",i:"No manager set",s:"Use crew foreman: Ray Brooks"},{n:"Marco Diaz",i:"Worked under 3 foremen in the last 90 days",s:"Primary by hours: Tom Hayes (212 hrs)"}];
 openDrawer({title:"Reporting-line check",sub:"Reviews start from each worker's manager in Lumber. Fix these so every reviewee has a reviewer.",
  body:`<div class="card"><div class="tw"><table class="tbl"><thead><tr><th>Worker</th><th>Issue</th><th>Suggested fix</th><th></th></tr></thead><tbody>${issues.map((x,i)=>`<tr id="rlr${i}"><td><div class="who">${av(x.n)}<span class="n">${x.n}</span></div></td><td>${x.i}</td><td>${x.s}</td><td><div class="row"><button class="btn xs p" onclick="this.closest('tr').innerHTML='<td colspan=4><span class=\\'pill g\\'><i></i>Fixed</span> ${x.n} · manager updated in Lumber</td>'">Apply</button><button class="btn xs" onclick="this.closest('tr').innerHTML='<td colspan=4><span class=\\'pill n\\'><i></i>Marked as exception</span> ${x.n}</td>'">Mark exception</button></div></td></tr>`).join("")}</tbody></table></div></div>
  <div class="note">Changes update the manager field on the employee's Lumber profile. HR & Onboarding uses the same field.</div>`,
  foot:`<button class="btn" onclick="closeLayer()">Close</button><button class="btn p" onclick="D.checklist[0]=true;closeLayer();render();toast('Reporting lines confirmed. Step 1 done.')">Apply all and mark done</button>`});
}

/* ================= CYCLES LIST ================= */
V.cycles=()=>{
 const tabs=["All","Active","Scheduled","Draft","Closed","Archived"];
 const cf=(S.flt||{}).cycles||{};
 const list=D.cycles.filter(c=>S.cycTab==="All"?c.status!=="Archived":c.status===S.cycTab).filter(c=>!S.q||c.name.toLowerCase().includes(S.q.toLowerCase())).filter(c=>!(cf.Status&&cf.Status.length)||cf.Status.includes(c.status)).filter(c=>!(cf.Pattern&&cf.Pattern.length)||cf.Pattern.includes(c.pattern));
 return `<div class="ph"><div><h1>Review Cycles</h1></div><div class="row"><button class="btn" onclick="nav('templates')">${ic("tpl")} Questionnaires</button><button class="btn p" onclick="startCycle()">${ic("plus")} New Review Cycle</button></div></div>
 <div class="tabs ptabs">${tabs.map(t=>`<button class="${S.cycTab===t?"on":""}" onclick="nav('cycles',{cycTab:'${t}'})">${t}<span class="c">${t==="All"?D.cycles.filter(c=>c.status!=="Archived").length:D.cycles.filter(c=>c.status===t).length}</span></button>`).join("")}</div>
 <div class="card">${toolbar(`<label class="srch">${ic("search")}<input id="cq" placeholder="Search review cycles" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#cq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label>`)}
 ${list.length?`<div class="tw"><table class="tbl"><thead><tr><th class="cbx"><input type="checkbox" aria-label="Select all"></th><th>Name</th><th>Pattern</th><th class="num">Reviewees</th><th>Current phase</th><th>Progress</th><th>Status</th><th></th></tr></thead><tbody>${list.map(c=>{
  const ps=D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed");const done=ps.filter(p=>["Manager submitted","In calibration","Approved","Shared","Acknowledged","Closed"].includes(p.st)).length;
  const ph=c.phases.find(x=>x.st==="cur");
  return `<tr class="click" onclick="${c.status==="Draft"?`editDraft('${c.id}')`:`nav('cycle',{cid:'${c.id}',tab:'overview'})`}"><td class="cbx" onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select"></td><td><div class="b">${esc(c.name)}</div><div class="dim sm">${esc(c.period)}</div></td><td>${c.pattern}</td><td class="num">${c.status==="Draft"||c.status==="Scheduled"?`<span class="dim">~${c.id==="c5"?14:24}</span>`:ps.length}</td><td>${ph?`${ph.n}<div class="dim sm">closes ${ph.e}</div>`:c.status==="Draft"?`<span class="dim">Step ${c.draftStep} of 7</span>`:c.status==="Scheduled"?`<span class="dim">Opens ${c.phases[0].s}</span>`:`<span class="dim">Closed ${c.closed||""}</span>`}</td>
  <td style="min-width:140px">${ps.length?`<div class="row" style="gap:8px;flex-wrap:nowrap"><div class="bar grow"><span style="width:${pct(done,ps.length)}%"></span></div><span class="sm tab-num">${pct(done,ps.length)}%</span></div>`:`<span class="dim">—</span>`}</td>
  <td>${pill(c.status)}</td><td onclick="event.stopPropagation()">${cycleMenu(c)}</td></tr>`}).join("")}</tbody></table></div>${pgFoot(list.length)}`:`<div class="empty"><b>No ${S.cycTab.toLowerCase()} cycles</b>${S.cycTab==="Archived"?"Archived cycles can be restored at any time.":`<button class="btn s p" style="margin-top:10px" onclick="startCycle()">Create review cycle</button>`}</div>`}
 </div>`;
};
function cycleMenu(c,big,noReopen){
 const id="cm"+c.id+(big?"b":"");
 const items=[];
 if(["Scheduled","Active","Paused"].includes(c.status))items.push(["edit","Edit",`cycEdit('${c.id}')`]);
 if(c.status==="Draft")items.push(["edit","Continue setup",`editDraft('${c.id}')`]);
 else if(!["Active","Paused","Closed"].includes(c.status))items.push(["eye","Open",`nav('cycle',{cid:'${c.id}',tab:'overview'})`]);
 if(!noReopen&&c.status==="Closed"&&typeof cycCanReopen==="function"&&cycCanReopen(c))items.push(["undo","Reopen",`cycReopen('${c.id}')`]);   // active cycles open from the row click, so no Open item
 if(c.status==="Active"){items.push(["send","Send reminders",`cycRemind('${c.id}')`]);if(typeof clType!=="function"||clType(c)==="General Review")items.push(["clock","Extend a phase",`cycExtend('${c.id}')`]);items.push(["pause","Pause cycle",`cycPause('${c.id}')`])}   // probation period and project end cycles have no cycle period to extend
 if(c.status==="Paused")items.push(["play","Resume cycle",`cycResume('${c.id}')`]);
 items.push(["copy","Duplicate",`cycDup('${c.id}')`]);
 if(["Closed"].includes(c.status))items.push(["archive","Archive",`cycArchive('${c.id}')`]);
 if(c.status==="Archived")items.push(["undo","Restore",`cycRestore('${c.id}')`]);
 const danger=[];
 if(c.status==="Active"||c.status==="Paused")danger.push(["check","Close cycle",`cycClose('${c.id}')`],["x","Cancel cycle",`cycCancel('${c.id}')`]);
 if(c.status==="Draft"||c.status==="Scheduled")danger.push(["x",c.status==="Draft"?"Delete draft":"Cancel launch",`cycCancel('${c.id}')`]);
 return `<div class="kebab"><button class="btn ${big?"":"ghost s"}" aria-label="More actions" onclick="toggleMenu('${id}',event)">${big?"More ":""}${ic("more")}</button>${S.menu===id?`<div class="menu">${items.map(i=>`<button onclick="S.menu=null;${i[2]}">${ic(i[0],"s")} ${i[1]}</button>`).join("")}${danger.length?"<hr>"+danger.map(i=>`<button class="d" onclick="S.menu=null;${i[2]}">${ic(i[0],"s")} ${i[1]}</button>`).join(""):""}</div>`:""}</div>`;
}
function cycRemind(cid){const ps=D.packets.filter(p=>p.cid===cid&&p.exc!=="Removed"&&(["Not started","In progress","Submitted","Manager in progress"].includes(p.st)||p.exc==="Overdue"));
 openModal(`<h3>Send reminders</h3><p class="dim" style="margin:0 0 12px">Only people with an open review are reminded. Field workers get a text; office staff get app and email.</p>
 <div class="choice">${[["Everyone with an open review",ps.length],["Overdue only",ps.filter(p=>p.exc==="Overdue").length],["Managers only",new Set(ps.filter(p=>p.st.startsWith("Manager")||p.st==="Submitted").map(p=>p.mgr.by)).size]].map((o,i)=>`<label class="ch ${i?"":"on"}"><input type="radio" name="rmd" ${i?"":"checked"} onchange="$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked))"><div><div class="t">${o[0]}</div><div class="d">${o[1]} people</div></div></label>`).join("")}</div>
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" onclick="closeModal();toast('Reminders sent.')">Send reminders</button></div>`)}
function cycExtend(cid){const c=C(cid);reasonModal({title:"Extend a phase",desc:"Everyone in the phase gets the new date. To extend for specific people, select them in Reviewees.",confirm:"Extend phase",
 extra:`<div class="f2"><div><label class="fl">Phase</label><select class="inp" id="exPh">${c.phases.filter(p=>p.st!=="done").map(p=>`<option>${p.n} (closes ${p.e})</option>`).join("")}</select></div><div><label class="fl">New close date</label><select class="inp"><option>Oct 21</option><option selected>Oct 23</option><option>Oct 30</option></select></div></div><div class="note">Later phases shift by the same number of days. You can change them after.</div>`,
 onOk:r=>{closeModal();D.activity.unshift({t:"Today",txt:`Anshika R. extended ${$("#exPh")?"":""}a phase in ${c.name} · ${r}`,c:"a"});toast("Phase extended. Reviewers notified of the new date.")}})}
function cycPause(cid){const c=C(cid),n=D.packets.filter(p=>p.cid===cid&&p.exc!=="Removed").length;reasonModal({title:`Pause ${c.name}`,affected:`${n} packets pause. Reminders stop. Drafts are kept.`,desc:"Reviewers can't edit while paused.",confirm:"Pause cycle",danger:true,extra:`<label class="opt"><input type="checkbox" checked> Shift due dates by the length of the pause when I resume</label>`,onOk:r=>{c.status="Paused";c._paused=true;closeModal();render();toast("Cycle paused.",()=>{c.status="Active";render()})}})}
function cycResume(cid){const c=C(cid);c.status="Active";render();toast("Cycle resumed. Due dates shifted by 0 days.")}
function cycDup(cid){const c=C(cid),n={...JSON.parse(JSON.stringify(c)),id:"c"+Date.now(),name:c.name.replace(/Q(\d) (\d{4})/,(m,q,y)=>q==="4"?`Q1 ${+y+1}`:`Q${+q+1} ${y}`)+(c.name.match(/Q\d/)?"":" (copy)"),status:"Draft",draftStep:1};n.phases.forEach(p=>p.st="");D.cycles.unshift(n);
 openModal(`<h3>Duplicated as a draft</h3><p class="dim" style="margin:0 0 12px">Copied: questionnaires and assignments, eligibility filters, reviewer model and mappings (refreshed against today's reporting lines), phases, reminders and results settings.</p><div class="note">Not copied: responses, drafts, ratings or packets.</div><div class="mf"><button class="btn" onclick="closeModal();render()">Stay here</button><button class="btn p" onclick="closeModal();editDraft('${n.id}')">Review draft</button></div>`)}
function cycArchive(cid){const c=C(cid);c.status="Archived";render();toast(`${c.name} archived.`,()=>{c.status="Closed";render()})}
function cycRestore(cid){const c=C(cid);c.status="Closed";render();toast(`${c.name} restored.`)}
function cycClose(cid){const c=C(cid),ps=D.packets.filter(p=>p.cid===cid&&p.exc!=="Removed");const open=ps.filter(p=>["Not started","In progress","Submitted","Manager in progress"].includes(p.st)||p.exc==="Overdue");
 reasonModal({title:`Close ${c.name}?`,desc:"Submitted reviews are locked. Packets can still be reopened within the 1-year window.",danger:true,confirm:"Close cycle",
  affected:open.length?`<b>${open.length} reviews are still open.</b> They'll be marked abandoned and the manager and HR are told. You could <a class="link" onclick="closeModal();cycExtend('${cid}')">extend instead</a>.`:"All reviews are in.",
  onOk:r=>{open.forEach(p=>{p.st="Abandoned";p.exc=null;log(p,"Marked abandoned at cycle close","r")});c.status="Closed";c.closed="Oct 14, 2026";c.phases.forEach(x=>x.st="done");closeModal();render();toast(`${c.name} closed. ${open.length} reviews marked abandoned.`)}})}
function cycCancel(cid){const c=C(cid);
 if(c.status==="Draft"){reasonModal({title:"Delete draft?",desc:"Drafts are moved to Archived for 30 days, then deleted.",confirm:"Delete draft",danger:true,needReason:false,onOk:()=>{c.status="Archived";closeModal();render();toast("Draft deleted.",()=>{c.status="Draft";render()})}});return}
 reasonModal({title:`Cancel ${c.name}?`,desc:"This is final. Submitted feedback stays in history marked cancelled. Packets already shared are not affected. You can duplicate the cycle later.",danger:true,confirm:"Cancel cycle",
  affected:`${D.packets.filter(p=>p.cid===cid).length} packets cancelled · all reviewers notified`,onOk:r=>{c.status="Closed";c.closed="Cancelled Oct 14";D.packets.filter(p=>p.cid===cid&&!["Shared","Acknowledged","Closed"].includes(p.st)).forEach(p=>{p.exc=null;p.st="Cancelled"});closeModal();render();toast("Cycle cancelled.")}})}
/* ================= CYCLE DETAIL ================= */
V.cycle=()=>{
 const c=C(S.cid);if(!c)return V.cycles();
 const ps=D.packets.filter(p=>p.cid===c.id);
 const live=ps.filter(p=>p.exc!=="Removed");
 const tabs=[["overview","Overview"],["reviewees","Reviewees",live.length],["reviewers","Reviewers"]];
 if(c.calib)tabs.push(["calibration","Calibration",ps.filter(p=>p.st==="In calibration").length||""]);
 if(c.model.includes("nominates"))tabs.push(["nominations","Nominations",3]);
 tabs.push(["activity","Activity"],["settings","Cycle settings"]);
 const body={overview:cycOverview,reviewees:cycReviewees,reviewers:cycReviewers,calibration:cycCalibration,nominations:cycNoms,activity:cycActivity,settings:cycSettings}[S.tab]||cycOverview;
 const shareable=ps.filter(p=>p.st==="Approved");
 return `<div class="crumb"><a onclick="nav('home')">Performance</a> › <a onclick="nav('cycles')">Review Cycles</a> › <span>${esc(c.name)}</span></div>
 <div class="ph"><div><div class="row"><h1>${esc(c.name)}</h1>${pill(c.status)}</div><div class="sub">${esc(c.period)} · ${c.pattern} · ${c.recurring} · ${live.length} reviewees</div></div>
 <div class="row">${c.status==="Active"?`<button class="btn" onclick="cycRemind('${c.id}')">${ic("send")} Send reminders</button>`:""}${shareable.length?`<button class="btn p" onclick="actShare([${shareable.map(p=>p.id)}])">Share ${shareable.length} approved</button>`:""}${c.status==="Paused"?`<button class="btn p" onclick="cycResume('${c.id}')">${ic("play")} Resume cycle</button>`:""}${cycleMenu(c,true)}</div></div>
 <div class="tabs ptabs" role="tablist">${tabs.map(t=>`<button role="tab" class="${S.tab===t[0]?"on":""}" onclick="nav('cycle',{cid:'${c.id}',tab:'${t[0]}',fStatus:'All'})">${t[1]}${t[2]?`<span class="c ${t[0]==="calibration"?"r":""}">${t[2]}</span>`:""}</button>`).join("")}</div>
 ${c.status==="Paused"?`<div class="warn" style="margin-bottom:14px"><b>This cycle is paused.</b> Reviewers can't edit and reminders are stopped. <button class="link" onclick="cycResume('${c.id}')">Resume</button></div>`:""}
 ${c.status==="Closed"?`<div class="note" style="margin-bottom:14px">Closed ${c.closed}. Reviews are read-only. HR can reopen a packet with a reason until ${c.closed?"Aug 10, 2027":""}; managers can request a reopen.</div>`:""}
 ${S.tab==="overview"?`<div class="card" style="margin-bottom:16px"><div class="hd"><h3>Timeline</h3><span class="dim sm">${esc(c.period)}</span></div><div class="bd"><div class="tl" style="margin-top:12px"><div class="track">${c.phases.map(p=>`<div class="seg ${p.st}"><b>${p.n}</b>${p.s} – ${p.e}</div>`).join("")}</div>${c.todayPos>0&&c.todayPos<100?`<span class="today" style="left:${c.todayPos}%"></span>`:""}</div></div></div>`:""}
 ${body(c,ps)}`;
};
function cycOverview(c,ps){
 const live=ps.filter(p=>p.exc!=="Removed");
 const cnt=f=>live.filter(f).length;
 const stats=c.id==="c2"?[["In calibration",cnt(p=>p.st==="In calibration"),"calibration"],["Approved",cnt(p=>p.st==="Approved"),"Approved"],["Shared",cnt(p=>["Shared","Acknowledged"].includes(p.st)),"Shared"],["Acknowledged",cnt(p=>p.st==="Acknowledged"),"Acknowledged"]]
  :[["Self reviews in",cnt(p=>p.self.st==="Submitted"),"Submitted"],["Manager reviews in",cnt(p=>p.mgr.st==="Submitted"),"Manager submitted"],["Overdue",cnt(p=>p.exc==="Overdue"),"Overdue"],["No reviewer",cnt(p=>p.noReviewer),"No reviewer"]];
 const risk=[];
 live.filter(p=>p.noReviewer).forEach(p=>risk.push([`${E(p.eid).name} has no reviewer`,"Manager in Lumber has left",[["Use Lumber manager",`actFixReviewer(${p.id})`,"p"]]]));
 live.filter(p=>!E(p.eid).phone&&!E(p.eid).email).forEach(p=>risk.push([`${E(p.eid).name} can't be reached`,"No phone or email",[["Fix",`actContact(${p.id})`,"p"]]]));
 live.filter(p=>p.st==="Not started"&&!p.exc&&E(p.eid).phone).slice(0,3).forEach(p=>risk.push([`${E(p.eid).name} hasn't started`,`Due ${p.due} · 2 days left`,[["Remind",`actRemind([${p.id}])`,"p"]]]));
 live.filter(p=>p.st==="Disputed").forEach(p=>risk.push([`${E(p.eid).name} disputed results`,`Response due ${p.dispute.due}`,[["Resolve",`actDispute(${p.id})`,"p"]]]));
 const g=S.group||"crew";
 const keyOf=p=>{const e=E(p.eid);return g==="crew"?crewName(e.crew):g==="site"?e.site:e.mgr};
 const groups=[...new Set(live.map(keyOf))].map(k=>{const gp=live.filter(p=>keyOf(p)===k);const done=gp.filter(p=>c.id==="c2"?["Shared","Acknowledged","Closed"].includes(p.st):p.self.st==="Submitted").length;return{k,n:gp.length,done,od:gp.filter(p=>p.exc==="Overdue").length}});
 return `<div class="kpis k4">${stats.map(s=>`<button class="kpi" onclick="nav('cycle',{cid:'${c.id}',tab:'${s[2]==="calibration"?"calibration":"reviewees"}',fStatus:'${s[2]}'})"><span class="k">${s[0]}</span><span class="v">${s[1]}</span><span class="t">of ${live.length}</span></button>`).join("")}</div>
 <div class="split"><div class="stack">
  <div class="card"><div class="hd"><h3>Completion by ${g==="crew"?"crew":g==="site"?"job site":"manager"}</h3><span class="seg">${[["crew","Crew"],["site","Job site"],["mgr","Manager"]].map(x=>`<button class="btn xs ${g===x[0]?"p":""}" onclick="S.group='${x[0]}';render()">${x[1]}</button>`).join(" ")}</span></div>
  <div class="tw"><table class="tbl"><thead><tr><th>${g==="crew"?"Crew":g==="site"?"Job site":"Manager"}</th><th class="num">People</th><th>${c.id==="c2"?"Shared":"Self reviews in"}</th><th class="num">Overdue</th><th></th></tr></thead><tbody>${groups.map(x=>`<tr><td class="b">${esc(x.k)}</td><td class="num">${x.n}</td><td style="min-width:160px"><div class="row" style="flex-wrap:nowrap;gap:8px"><div class="bar grow"><span style="width:${pct(x.done,x.n)}%"></span></div><span class="sm tab-num">${x.done}/${x.n}</span></div></td><td class="num">${x.od?`<span class="pill r">${x.od}</span>`:"0"}</td><td>${x.od?`<button class="btn xs" onclick="actRemind([${live.filter(p=>keyOf(p)===x.k&&p.exc==="Overdue").map(p=>p.id)}])">Remind overdue</button>`:""}</td></tr>`).join("")}</tbody></table></div></div>
  ${live.some(p=>p.rating)?`<div class="card"><div class="hd"><h3>Rating distribution</h3><span class="dim sm">${live.filter(p=>p.rating).length} rated so far</span></div><div class="bd">${distChart(live.filter(p=>p.rating))}</div></div>`:""}
 </div>
 <div class="card"><div class="hd"><h3>At risk</h3><span class="pill ${risk.length?"a":"g"}">${risk.length}</span></div>${risk.length?risk.map(r=>`<div class="att"><span class="sev"></span><div class="grow"><div class="t" style="font-size:14px">${r[0]}</div><div class="d">${r[1]}</div></div>${r[2].map(b=>`<button class="btn xs ${b[2]||""}" onclick="${b[1]}">${b[0]}</button>`).join("")}</div>`).join(""):`<div class="empty"><b>Nothing at risk</b></div>`}</div>
 </div>`;
}
function filterPk(ps){
 const f=S.fStatus||"All";let r=ps;
 if(f==="Overdue")r=ps.filter(p=>p.exc==="Overdue");
 else if(f==="No reviewer")r=ps.filter(p=>p.noReviewer&&p.exc!=="Removed");
 else if(f==="Removed")r=ps.filter(p=>p.exc==="Removed");
 else if(f==="Shared")r=ps.filter(p=>["Shared","Acknowledged"].includes(p.st)&&!p.exc);
 else if(f!=="All")r=ps.filter(p=>p.st===f&&p.exc!=="Removed");
 else r=ps.filter(p=>p.exc!=="Removed");
 if(S.q)r=r.filter(p=>E(p.eid).name.toLowerCase().includes(S.q.toLowerCase()));
 const ff=(S.flt||{}).cycle||{},has=k=>ff[k]&&ff[k].length;
 if(has("Crew"))r=r.filter(p=>ff.Crew.includes(crewName(E(p.eid).crew)));
 if(has("Job Site"))r=r.filter(p=>{const e=E(p.eid);return ff["Job Site"].some(x=>e.sites.includes(x)||e.site===x)});
 if(has("Trade"))r=r.filter(p=>ff.Trade.includes(E(p.eid).trade));
 if(has("Manager"))r=r.filter(p=>ff.Manager.includes(p.mgr.by));
 if(has("Language"))r=r.filter(p=>ff.Language.includes(E(p.eid).lang==="ES"?"Spanish":"English"));
 if(has("Certification"))r=r.filter(p=>{const c=E(p.eid).certs;return ff.Certification.some(x=>x==="Expired"?c.some(y=>y.s==="expired"):x==="Expiring"?c.some(y=>y.s==="expiring"):c.every(y=>y.s==="active"))});
 if(has("Contact"))r=r.filter(p=>{const e=E(p.eid);return !e.phone&&!e.email});
 return r;
}
function cycReviewees(c,ps){
 const present=MAIN.concat(["Reopened","Recalled","Disputed","Abandoned"]).filter(s=>ps.some(p=>p.st===s&&p.exc!=="Removed"));
 const chips=["All",...present,"Overdue","No reviewer","Removed"].filter(s=>s==="All"||present.includes(s)||(s==="Overdue"&&ps.some(p=>p.exc==="Overdue"))||(s==="No reviewer"&&ps.some(p=>p.noReviewer))||(s==="Removed"&&ps.some(p=>p.exc==="Removed")));
 if(!chips.includes(S.fStatus||"All"))S.fStatus="All";
 const counts=chips.map(s=>{const n=(()=>{const f=S.fStatus;S.fStatus=s;const q=S.q;S.q="";const x=filterPk(ps).length;S.fStatus=f;S.q=q;return x})();return n});
 const rows=filterPk(ps);
 const sel=[...S.sel].filter(id=>rows.some(p=>p.id===id));
 const allSel=rows.length&&sel.length===rows.length;
 const selP=sel.map(PK);
 return `<div class="sf" style="margin-bottom:12px">${chips.map((s,i)=>`<button class="${(S.fStatus||"All")===s?"on":""}" onclick="S.fStatus='${s}';S.sel=new Set();render()">${s}<span class="c">${counts[i]}</span></button>`).join("")}</div>
 <div class="card">${toolbar(`<label class="srch">${ic("search")}<input id="rq" placeholder="Search employees" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#rq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label>`,`<button class="btn" onclick="addPeople('${c.id}')">${ic("useradd")} Add People</button><button class="btn" onclick="toast('Exported ${rows.length} rows to spreadsheet.')">${ic("down")} Export</button>`)}
 ${fCount()?`<div class="row" style="padding:0 24px 14px">${Object.entries((S.flt||{}).cycle||{}).flatMap(([k,v])=>v.map(x=>`<span class="tag x" onclick="fDrop('${k}','${esc(x)}')">${k}: ${esc(x)} ✕</span>`)).join("")}<button class="link sm" onclick="S.flt.cycle={};render()">Clear filters</button></div>`:""}
 ${sel.length?`<div class="bulk"><b>${sel.length} selected</b><span style="flex:1"></span>
  <button class="btn" onclick="actRemind([${sel}])">${ic("send","s")} Remind</button>
  <button class="btn" onclick="actExtend([${sel}])">${ic("clock","s")} Extend</button>
  <button class="btn" onclick="actReassign([${sel}])">${ic("swap","s")} Change reviewer</button>
  ${selP.some(p=>p.st==="In calibration")?`<button class="btn" onclick="actApprove([${selP.filter(p=>p.st==="In calibration").map(p=>p.id)}])">${ic("check","s")} Approve</button>`:""}
  ${selP.some(p=>["Approved","Manager submitted"].includes(p.st))?`<button class="btn" onclick="actShare([${selP.filter(p=>["Approved","Manager submitted"].includes(p.st)).map(p=>p.id)}])">${ic("send","s")} Share</button>`:""}
  <button class="btn" onclick="actRemove([${sel}])">${ic("x","s")} Remove</button>
  <button class="btn" style="border-color:transparent" onclick="S.sel=new Set();render()">Clear</button></div>`:""}
 ${rows.length?`<div class="tw"><table class="tbl"><thead><tr><th class="cbx"><input type="checkbox" aria-label="Select all" ${allSel?"checked":""} onchange="S.sel=new Set(this.checked?[${rows.map(p=>p.id)}]:[]);render()"></th><th>Employee</th><th>Crew · Job Site</th><th>Self Review</th><th>Manager Review</th><th class="num">Rating</th><th>Status</th><th>Next Step</th></tr></thead><tbody>
 ${rows.map(p=>{const e=E(p.eid),ns=nextStep(p),a0=ns.a[0];const certBad=e.certs.find(x=>x.s==="expired");
  return `<tr class="click ${S.sel.has(p.id)?"sel":""}" onclick="openPacket(${p.id})"><td class="cbx" onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select ${esc(e.name)}" ${S.sel.has(p.id)?"checked":""} onchange="this.checked?S.sel.add(${p.id}):S.sel.delete(${p.id});render()"></td>
  <td><div class="who"><span class="rdot" style="visibility:${p.exc==="Overdue"||p.noReviewer||p.st==="Disputed"||(!e.phone&&!e.email)?"visible":"hidden"}"></span>${av(e.name)}<div style="min-width:0"><div class="n">${esc(e.name)} ${e.lang==="ES"?'<span class="tag">ES</span>':""}${certBad?` <span title="${certBad.n} expired" style="color:var(--red)">${ic("cert","s")}</span>`:""}</div><div class="s">${e.title}${!e.phone&&!e.email?' · <span style="color:var(--red)">no phone/email</span>':""}</div></div></div></td>
  <td>${crewName(e.crew)}<div class="dim sm">${e.sites.length>1?e.sites.length+" sites":e.site}</div></td>
  <td>${p.self.st==="Off"?'<span class="dim">Off</span>':pill(p.self.st)}</td>
  <td>${p.mgr.by?`${esc(p.mgr.by)}<div class="sm">${p.mgr.st==="Submitted"?'<span style="color:var(--green-d)">Submitted</span>':p.mgr.st==="Abandoned"?'<span class="dim">Abandoned</span>':`<span class="dim">${p.mgr.st}</span>`}${p.contrib.length?` · +${p.contrib.length} contributor`:""}</div>`:`<span class="pill r">No reviewer</span>`}</td>
  <td class="num">${p.rating?`<b>${p.adj||p.rating}</b>${p.adj?`<span class="dim sm"> (was ${p.rating})</span>`:""}`:'<span class="dim">—</span>'}</td>
  <td>${statPill(p)}</td>
  <td onclick="event.stopPropagation()">${a0?`<button class="btn xs" onclick="${a0.f.replace(/"/g,"&quot;")}">${a0.l}</button>`:""}</td></tr>`}).join("")}
 </tbody></table></div>${pgFoot(rows.length)}`:`<div class="empty"><b>No one here</b>${S.fStatus!=="All"?`<button class="link" onclick="S.fStatus='All';render()">Show everyone</button>`:"Add people to this cycle."}</div>`}
 </div>`;
}
function addPeople(cid){
 const inC=new Set(D.packets.filter(p=>p.cid===cid).map(p=>p.eid));
 const cand=D.emps.filter(e=>!inC.has(e.id)&&!e.isMgr).slice(0,8);
 openModal(`<h3>Add people to this cycle</h3><p class="dim" style="margin:0 0 12px">They get a packet and the review link right away. Reviewers come from their Lumber manager; you can change them after.</p>
 <div class="card" style="max-height:300px;overflow:auto">${cand.map(e=>`<label class="opt" style="padding:10px 14px;border-top:1px solid var(--line)"><input type="checkbox" class="apc" value="${e.id}"><div class="grow"><b>${e.name}</b><div class="dim sm">${e.title} · ${e.dept} · manager ${e.mgr}</div></div></label>`).join("")}</div>
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" onclick="addPeopleGo('${cid}')">Add selected</button></div>`)}
function addPeopleGo(cid){const ids=$$(".apc:checked").map(x=>+x.value);if(!ids.length){toast("Select at least one person.");return}
 ids.forEach(id=>{const e=E(id);D.packets.push({id:Math.max(...D.packets.map(p=>p.id))+1,cid,eid:id,st:"Not started",exc:null,due:"Oct 23",self:{st:"Not started"},mgr:{st:"Not started",by:e.mgr},contrib:[],peers:[],rating:null,ver:1,hist:[{t:"Today",who:"Anshika R.",txt:"Added to cycle; review link sent",c:"g"}]})});closeModal();render();toast(`Added ${ids.length} ${ids.length>1?"people":"person"}. Review links sent.`)}

/* ---------- packet drawer ---------- */
function openPacket(id){
 if(S.pkLast!==id){S.pkTab="Overview";S.pkLast=id}
 const p=PK(id),e=E(p.eid),c=cycOf(p),ns=nextStep(p);
 const flow=MAIN.filter(s=>!(s==="In calibration"&&!c.calib)&&!(["Not started","In progress","Submitted"].includes(s)&&p.self.st==="Off"));
 const ix=flow.indexOf(p.st==="Reopened"||p.st==="Recalled"||p.st==="Disputed"?(p.prev||"Shared"):p.st==="Abandoned"?"Manager in progress":p.st);
 const certs=e.certs.map(x=>`<div class="form-row"><span style="color:${x.s==="expired"?"var(--red)":x.s==="expiring"?"var(--amber)":"var(--green-d)"}">${ic("cert")}</span><div class="grow"><b>${x.n}</b><div class="dim sm">${x.s==="expired"?"Expired "+x.d:x.s==="expiring"?"Expires "+x.d:"Valid until "+x.d}</div></div>${x.s!=="active"?`<span class="pill ${x.s==="expired"?"r":"a"}">${x.s==="expired"?"Expired":"Expiring"}</span>${x.s==="expired"&&p.mgr.st!=="Submitted"?`<span class="dim sm">Manager must acknowledge before submitting</span>`:""}<button class="btn xs" onclick="certGoal(${e.id},'${x.n}')">Create renewal goal</button>`:""}</div>`).join("");
 const rv=[];
 if(p.self.st!=="Off")rv.push(["Self review",e.name,p.self.st,p.self.st!=="Submitted"?[["Remind",`actRemind([${p.id}])`],["Enter on their behalf",`actOnBehalf(${p.id})`]]:[["View",`viewForm(${p.id},'self')`]]]);
 rv.push(["Manager review",p.mgr.by||"No reviewer",p.mgr.by?p.mgr.st:"No reviewer",p.mgr.by?(p.mgr.st!=="Submitted"?[["Remind",`actRemind([${p.id}],'mgr')`],["Change reviewer",`actReassign([${p.id}])`]]:[["View",`viewForm(${p.id},'mgr')`]]):[["Assign",`actFixReviewer(${p.id})`]]]);
 p.contrib.forEach(x=>rv.push([`Contributing foreman · ${x.hrs} hrs together`,x.by,x.st,x.st!=="Submitted"?[["Remind",`toast('Reminder sent to ${x.by}.')`]]:[["View",`viewForm(${p.id},'c')`]]]));
 p.peers.forEach(x=>rv.push(["Peer review · anonymous",x.by,x.st,[]]));
 const tabN=["Overview","Reviews","Credentials","History"];if(!tabN.includes(S.pkTab))S.pkTab="Overview";
 const parts={Overview:`<div class="card"><div class="bd row" style="gap:14px">${av(e.name,48)}<div class="grow"><div class="b" style="font-size:16px">${esc(e.name)} <span class="dim sm">#${e.code}</span></div><div class="dim sm">${e.title} · ${crewName(e.crew)} · manager ${e.mgr} · hired ${e.hire} · ${e.lang==="ES"?"Spanish":"English"} · ${e.phone?"SMS":e.email?"Email":"<span style='color:var(--red)'>no phone or email</span>"}</div></div><button class="btn s" onclick="openProfile(${e.id})">${ic("user","s")} Performance profile</button></div>
  <div class="ctx"><div><div class="k">Hours this period</div><div class="v">${e.hrs} hrs</div></div><div><div class="k">Job sites</div><div class="v">${e.sites.join(", ")||e.site}</div></div><div><div class="k">Last cycle</div><div class="v">${(()=>{const q=D.packets.find(x=>x.eid===e.id&&x.cid==="c6");return q?q.rating+" · "+D.settings.levels[q.rating-1]:"—"})()}</div></div><div><div class="k">Union</div><div class="v">${e.union?"Yes":"No"}</div></div></div></div>
 <div><div class="statusflow">${flow.map((s,i)=>`<span class="${i<ix?"past":i===ix?"now":""}">${s}</span>`).join("")}</div>${p.exc||["Reopened","Recalled","Disputed","Abandoned"].includes(p.st)?`<div style="margin-top:8px">${statPill(p)} ${["Reopened","Recalled","Disputed","Abandoned"].includes(p.st)?pill(p.st):""}</div>`:""}</div>
 <div class="nextbox"><div class="k">Next step</div><div class="t">${ns.t}</div><div class="row">${ns.a.map(a=>`<button class="btn s ${a.k}" onclick="${a.f.replace(/"/g,"&quot;")}">${a.l}</button>`).join("")}</div></div>
 ${p.dispute&&p.st==="Disputed"?`<div class="bad"><b>Dispute from ${e.name} · ${p.dispute.on}</b><br>"${esc(p.dispute.text)}"<div class="sm" style="margin-top:6px">Owner: ${p.dispute.owner} · response due ${p.dispute.due}</div></div>`:""}
 ${p.rating?`<div class="card"><div class="hd"><h3>Rating</h3>${["Approved","Shared","Acknowledged","Closed"].includes(p.st)?`<span class="pill n">${ic("lock","s")} Locked after calibration</span>`:""}</div><div class="bd"><div class="row"><span style="font-size:24px;font-weight:700">${p.adj||p.rating}</span><span>${D.settings.levels[(p.adj||p.rating)-1]}</span></div>${p.adj?`<div class="dim sm" style="margin-top:6px">Adjusted from ${p.rating} in calibration · "${esc(p.adjReason)}"</div>`:""}</div></div>`:""}`,
 Reviews:` <div class="card"><div class="hd"><h3>Reviews in this packet</h3><span class="dim sm">Due ${p.due}</span></div><div class="bd">${rv.map(r=>`<div class="form-row"><div class="grow"><div class="b">${r[0]}</div><div class="dim sm">${esc(r[1])}</div></div>${pill(r[2])}${r[3].map(b=>`<button class="btn xs" onclick="${b[1]}">${b[0]}</button>`).join("")}</div>`).join("")}${c.anon&&p.peers.length?`<div class="note" style="margin-top:8px">Peer feedback shows once ${c.anon} responses are in. Names are never shown.</div>`:""}</div></div>`,
 Credentials:`${e.certs.length?`<div class="card"><div class="hd"><h3>Certifications</h3><span class="dim sm">From credential management</span></div><div class="bd">${certs}</div></div>`:""}${e.certs.length?"":`<div class="card"><div class="empty"><b>No credentials on file</b>Credentials come from credential management.</div></div>`}`,
 History:`<div class="card"><div class="hd"><h3>History and audit trail</h3><span class="dim sm">${p.hist.length} events</span></div><div class="bd feed">${[...p.hist].reverse().map(h=>`<div class="ev"><span class="dot ${h.c}"></span><div>${esc(h.txt)}<div class="m">${h.t} · ${esc(h.who)}</div></div></div>`).join("")}</div></div>`};
 openDrawer({label:"Review Packet",avatar:initials(e.name),title:esc(e.name),sub:`${esc(c.name)} · v${p.ver}`,w:860,status:`<span class="dstat">${statPill(p)}</span>`,
  tabs:`<div class="dtabs">${tabN.map(t=>`<button class="${S.pkTab===t?"on":""}" onclick="S.pkTab='${t}';openPacket(${p.id})">${t}${t==="Reviews"?` (${rv.length})`:t==="Credentials"&&e.certs.some(x=>x.s!=="active")?` · ${e.certs.filter(x=>x.s!=="active").length} flagged`:""}</button>`).join("")}</div>`,
  hist:`S.pkTab='History';openPacket(${p.id})`,
 body:parts[S.pkTab],
 foot:`${p.exc==="Removed"?`<button class="btn" onclick="actRestore(${p.id})">Restore</button>`:`<button class="btn d" onclick="actRemove([${p.id}])">Remove from cycle</button>`}<span style="flex:1"></span><button class="btn" onclick="toast('PDF downloaded (v${p.ver}).')">${ic("down","s")} PDF</button><button class="btn p" onclick="closeLayer()">Done</button>`});
 S.pkOpen=id;
}
function certGoal(eid,cert){const e=E(eid);D.goals.unshift({id:Date.now(),eid,title:`Renew ${cert} certification`,cat:"Certification and training",lvl:"Individual",due:"Dec 15, 2026",prog:0,st:"Not started",src:"Created from certification flag"});toast(`Goal created for ${e.name}: Renew ${cert}. It shows on their phone.`)}
function viewForm(pid,kind){const p=PK(pid),e=E(p.eid);
 const sec=[["Trade skill",4,"Clean cuts on valleys, needs fewer callbacks than last quarter."],["Safety",kind==="self"?5:3,kind==="self"?"Always tied off.":"Harness not clipped once on east slope (note Oct 12). Talked through it."],["Quality and rework",4,""],["Attendance and reliability",4,"On time 58 of 60 days · 486 hrs this period"],["Teamwork",5,"Helps apprentices without being asked."]];
 openModal(`<h3>${kind==="self"?"Self review":kind==="mgr"?"Manager review":"Contributor notes"} · ${e.name}</h3><p class="dim sm" style="margin:0 0 12px">Submitted ${kind==="self"?"Oct 9 from SMS link"+(e.lang==="ES"?" · answered in Spanish, translation shown":""):"Oct 13 · "+(p.mgr.by||"")} · read-only</p>
 ${sec.map(s=>`<div style="padding:10px 0;border-top:1px solid var(--line)"><div class="row"><b class="grow">${s[0]}</b><span class="pill b">${s[1]} · ${D.settings.levels[s[1]-1]}</span></div>${s[2]?`<div class="sm" style="margin-top:4px">${s[2]}</div>`:""}</div>`).join("")}
 <div class="mf"><button class="btn p" onclick="closeModal()">Close</button></div>`,600)}

/* ---------- reviewers ---------- */
function cycReviewers(c,ps){
 const live=ps.filter(p=>p.exc!=="Removed");
 const by={};live.forEach(p=>{const k=p.mgr.by||"__none";(by[k]=by[k]||[]).push(p)});
 const rows=Object.entries(by).map(([k,list])=>({k,list,sub:list.filter(p=>p.mgr.st==="Submitted").length,od:list.filter(p=>p.exc==="Overdue").length,ready:list.filter(p=>["Submitted"].includes(p.st)).length}));
 return `<div class="card"><div class="hd"><h3>Who owes what</h3><span class="dim sm">Manager reviews · contributors are listed in each packet</span></div><div class="tw"><table class="tbl"><thead><tr><th>Reviewer</th><th class="num">Assigned</th><th class="num">Ready to review</th><th>Submitted</th><th class="num">Overdue</th><th></th></tr></thead><tbody>${rows.map(r=>r.k==="__none"?`<tr><td><span class="pill r">No reviewer</span><div class="dim sm" style="margin-top:4px">Manager left the company</div></td><td class="num">${r.list.length}</td><td class="num">—</td><td>—</td><td class="num">—</td><td><div class="row"><button class="btn xs p" onclick="nr_fix()">Use Lumber managers</button><button class="btn xs" onclick="actReassign([${r.list.map(p=>p.id)}])">Choose reviewer</button></div></td></tr>`:`<tr><td><div class="who">${av(r.k)}<div><div class="n">${esc(r.k)}</div><div class="s">${(EN(r.k)||{}).title||"HR"} · ${EN(r.k)&&EN(r.k).phone?"SMS + app":"App"}</div></div></div></td><td class="num">${r.list.length}</td><td class="num">${r.ready}</td><td style="min-width:150px"><div class="row" style="flex-wrap:nowrap;gap:8px"><div class="bar grow"><span style="width:${pct(r.sub,r.list.length)}%"></span></div><span class="sm tab-num">${r.sub}/${r.list.length}</span></div></td><td class="num">${r.od?`<span class="pill r">${r.od}</span>`:0}</td><td><div class="row"><button class="btn xs" onclick="actRemind([${r.list.map(p=>p.id)}],'mgr')">Remind</button><button class="btn xs" onclick="actReassign([${r.list.map(p=>p.id)}])">Reassign all</button></div></td></tr>`).join("")}</tbody></table></div></div>
 <div class="note" style="margin-top:12px">Workers on more than one site: the foreman with the most hours is the primary reviewer; other foremen with 40+ hrs contribute. <span class="asm">40 hr minimum is an open question</span></div>`;
}

/* ---------- calibration ---------- */
function cycCalibration(c,ps){
 const pool=ps.filter(p=>["In calibration","Manager submitted"].includes(p.st)&&p.exc!=="Removed");
 const done=ps.filter(p=>["Approved","Shared","Acknowledged","Closed","Disputed","Recalled"].includes(p.st));
 const gk=S.calGroup;
 const key=p=>{const e=E(p.eid);return gk==="Foreman"?p.mgr.by:gk==="Crew"?crewName(e.crew):gk==="Job site"?e.site:e.trade};
 const groups=[...new Set(pool.map(key))];
 if(!pool.length)return `<div class="card"><div class="empty"><b>Nothing waiting on calibration</b>${done.length} packets are approved. ${ps.some(p=>p.st==="Approved")?`<button class="link" onclick="actShare([${ps.filter(p=>p.st==="Approved").map(p=>p.id)}])">Share approved packets</button>`:"Packets arrive here once manager reviews are submitted."}</div></div>`;
 return `<div class="row" style="justify-content:space-between;margin-bottom:12px"><div class="row"><span class="dim">Compare by</span><span class="seg">${["Foreman","Crew","Job site","Trade"].map(x=>`<button class="btn xs ${gk===x?"p":""}" onclick="S.calGroup='${x}';render()">${x}</button>`).join(" ")}</span></div>
 <div class="row"><span class="dim sm">${pool.filter(p=>p.st==="In calibration").length} in calibration · ${pool.filter(p=>p.st==="Manager submitted").length} not started</span><button class="btn p" onclick="calApproveAll()">Approve all ${pool.length}</button></div></div>
 <div class="note" style="margin-bottom:12px">Adjust a rating and give a reason; the original and adjusted ratings are both kept and the reviewer is told. Approving locks ratings and comments.</div>
 <div style="display:grid;gap:14px">${groups.map(g=>{const gp=pool.filter(p=>key(p)===g);const avg=gp.reduce((s,p)=>s+(p.adj||p.rating||0),0)/gp.length;
  return `<div class="card"><div class="hd"><div><h3>${esc(g)}</h3><div class="dim sm">${gp.length} packets · average ${avg.toFixed(1)} · company average 3.7</div></div><button class="btn s" onclick="actApprove([${gp.map(p=>p.id)}])">Confirm all in ${esc(g.split(" ")[0])}'s group</button></div>
  <div class="tw"><table class="tbl"><thead><tr><th>Employee</th><th>Reviewer</th><th class="num">Manager rating</th><th>Calibrated rating</th><th>Reason (required if changed)</th><th></th></tr></thead><tbody>${gp.map(p=>{const e=E(p.eid);return `<tr><td><div class="who">${av(e.name,26)}<div><div class="n">${esc(e.name)}</div><div class="s">${e.title} · ${e.hrs} hrs</div></div></div></td><td>${esc(p.mgr.by)}</td><td class="num"><b>${p.rating}</b></td>
   <td><select class="inp w" id="adj${p.id}" style="height:34px" onchange="calChange(${p.id})">${[1,2,3,4,5].map(r=>`<option value="${r}" ${(p.adj||p.rating)===r?"selected":""}>${r} · ${D.settings.levels[r-1]}</option>`).join("")}</select></td>
   <td><input class="inp" id="rsn${p.id}" style="height:34px" placeholder="${p.adj?"":"—"}" value="${esc(p.adjReason||"")}" ${p.adj?"":"disabled"}></td>
   <td><button class="btn xs p" onclick="calApprove(${p.id})">Approve</button></td></tr>`}).join("")}</tbody></table></div></div>`}).join("")}</div>`;
}
function calChange(id){const p=PK(id),v=+$("#adj"+id).value,r=$("#rsn"+id);r.disabled=v===p.rating;if(v===p.rating){r.value="";p.adj=null}else{p.adj=v;r.focus();r.style.borderColor="var(--amber)"}}
function calApprove(id){const p=PK(id),r=$("#rsn"+id);if(p.adj&&!r.value.trim()){r.style.borderColor="var(--red)";r.placeholder="Add a reason to change the rating";r.focus();toast("Add a reason for the changed rating.");return}if(p.adj){p.adjReason=r.value.trim();log(p,`Rating adjusted ${p.rating} → ${p.adj} · Reason: ${p.adjReason}`,"a")}actApprove([id])}
function calApproveAll(){const c=C(S.cid);const pool=D.packets.filter(p=>p.cid===c.id&&["In calibration","Manager submitted"].includes(p.st)&&p.exc!=="Removed");const miss=pool.filter(p=>p.adj&&!($("#rsn"+p.id)||{}).value);if(miss.length){miss.forEach(p=>{const r=$("#rsn"+p.id);if(r)r.style.borderColor="var(--red)"});toast(`${miss.length} changed rating${miss.length>1?"s need":" needs"} a reason.`);return}pool.forEach(p=>{if(p.adj){p.adjReason=$("#rsn"+p.id).value}});actApprove(pool.map(p=>p.id))}

/* ---------- nominations / activity / settings ---------- */
function cycNoms(c){
 const n=[["Priya Shah","David Chen, Laura Bennett, Ben Turner","Rachel Kim","Waiting 4 days"],["Megan Ross","Alicia Gomez, Steve Martin","Rachel Kim","Waiting 2 days"],["Steve Martin","Megan Ross, Priya Shah, Ben Turner","Rachel Kim","Waiting 1 day"]];
 return `<div class="warn" style="margin-bottom:12px">Managers have 3 days to act on nominations; after that they auto-approve (company setting). </div>
 <div class="card"><div class="tw"><table class="tbl"><thead><tr><th>Employee</th><th>Nominated peers</th><th>Approver</th><th>Waiting</th><th></th></tr></thead><tbody>${n.map((x,i)=>`<tr id="nm${i}"><td class="b">${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td><td><div class="row"><button class="btn xs p" onclick="this.closest('tr').querySelector('td:last-child').innerHTML='<span class=\\'pill g\\'><i></i>Approved on behalf of ${x[2]}</span>';toast('Approved. Nominees notified.')">Approve on behalf</button><button class="btn xs" onclick="toast('Reminder sent to ${x[2]}.')">Remind approver</button></div></td></tr>`).join("")}</tbody></table></div></div>`;
}
function cycActivity(c,ps){
 const ev=ps.flatMap(p=>p.hist.map(h=>({...h,n:E(p.eid).name}))).reverse().slice(0,40);
 return `<div class="card"><div class="hd"><h3>Activity</h3><button class="btn s" onclick="toast('Audit log exported.')">${ic("down","s")} Export audit log</button></div><div class="bd feed">${ev.map(h=>`<div class="ev"><span class="dot ${h.c}"></span><div><b>${esc(h.n)}</b> · ${esc(h.txt)}<div class="m">${h.t} · ${esc(h.who)}</div></div></div>`).join("")}</div></div>`;
}
function cycSettings(c,ps){
 const n=ps.filter(p=>p.exc!=="Removed").length;
 const rows=[["Questionnaires",c.tpls.map(t=>T(t).name).join(", ")],["Review types",c.types.join(", ")],["Rating format",c.rating],["Reviewer model",c.model],["Calibration",c.calib?"Required before sharing":"Off"],["Approval before sharing",c.approval?"Required":"Off"],["Acknowledgment",c.ack?"Required":"Off"],["Anonymity minimum",c.anon+" responses"],["Recurrence",c.recurring],["Auto-enrollment",c.auto]];
 return `<div class="card"><div class="hd"><h3>Cycle settings</h3><span class="dim sm">Changes show who they affect before saving</span></div>${rows.map(r=>`<div class="pol"><div><div class="t">${r[0]}</div></div><div class="row" style="justify-content:space-between"><span>${esc(r[1])}</span>${c.status==="Closed"?"":`<button class="btn xs" onclick="editCycSetting('${r[0]}',${n})">Edit</button>`}</div></div>`).join("")}</div>`;
}
function editCycSetting(name,n){
 const tpl=name==="Questionnaires";
 openModal(`<h3>Edit ${name.toLowerCase()}</h3>
 <div class="warn" style="margin:8px 0 12px">This cycle is live. <b>${n} people</b> are in it; ${tpl?"9 reviews have started.":"the change applies to their packets."}</div>
 ${tpl?`<div class="choice">${[["Swap for reviews not started","15 reviews switch to the new version. 9 started reviews keep the version they began with."],["Reopen started reviews with the new questionnaire","Reviewers who already started are asked to redo affected questions. Their answers are kept where questions match."],["Leave as is","Use the new questionnaire from the next cycle."]].map((o,i)=>`<label class="ch ${i?"":"on"}"><input type="radio" name="es" ${i?"":"checked"} onchange="$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked))"><div><div class="t">${o[0]}</div><div class="d">${o[1]}</div></div></label>`).join("")}</div>`
 :`<div class="choice">${[["Apply to this cycle and future cycles",`Updates ${n} live packets now. People affected are notified.`],["Future cycles only","This cycle keeps its current setting."]].map((o,i)=>`<label class="ch ${i?"":"on"}"><input type="radio" name="es" ${i?"":"checked"} onchange="$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked))"><div><div class="t">${o[0]}</div><div class="d">${o[1]}</div></div></label>`).join("")}</div>`}
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" onclick="closeModal();toast('${name} updated. Logged in the audit trail.')">Save change</button></div>`)}

/* ---------- filters drawer (Lumber two-pane) ---------- */
const FCATS={cycle:{"Crew":()=>D.crews.map(c=>c.name),"Job Site":()=>D.sites,"Trade":()=>["Roofer","Carpenter","Siding installer"],"Manager":()=>D.crews.map(c=>c.fm),"Language":()=>["English","Spanish"],"Certification":()=>["Expired","Expiring","All valid"],"Contact":()=>["No phone or email"]},
 cycles:{"Status":()=>["Active","Scheduled","Draft","Closed"],"Pattern":()=>Object.keys(PATTERNS)},
 templates:{"Type":()=>["Self","Manager","Contributor","Peer","Upward","Self + Manager"],"Created By":()=>["Lumber starter","Anshika R."],"Language":()=>["English","Spanish"]}};
function fCount(){const f=(S.flt||{})[S.view]||{};return Object.values(f).reduce((a,v)=>a+v.length,0)}
function fDrop(k,v){const f=S.flt[S.view];f[k]=f[k].filter(x=>x!==v);render()}
function fTog(k,v,on){const d=S.fDraft;d[k]=d[k]||[];d[k]=on?[...d[k],v]:d[k].filter(x=>x!==v);openFilters(k)}
function openFilters(cat){S.flt=S.flt||{};const cats=FCATS[S.view]||FCATS.cycle;const keys=Object.keys(cats);
 if(!S.fDraft)S.fDraft=JSON.parse(JSON.stringify(S.flt[S.view]||{}));S.fCat=cat||(keys.includes(S.fCat)?S.fCat:keys[0]);const d=S.fDraft;
 const keep=S.fDraft;
 openDrawer({title:"Filters",w:820,bodyCls:"nopad",body:`<div class="fpane"><div class="fcat">${keys.map(k=>`<button class="${k===S.fCat?"on":""}" onclick="openFilters('${k}')">${k}${(d[k]||[]).length?`<span class="cntpill n">${d[k].length}</span>`:""}</button>`).join("")}</div><div class="fopt">${cats[S.fCat]().map(v=>`<label class="opt" style="font-size:16px"><input type="checkbox" value="${esc(v)}" ${(d[S.fCat]||[]).includes(v)?"checked":""} onchange="fTog('${S.fCat}',this.value,this.checked)"> ${esc(v)}</label>`).join("")}</div></div>`,
  foot:`<button class="btn" onclick="S.fDraft={};openFilters()">Reset</button><button class="btn p" onclick="S.flt[S.view]=S.fDraft;S.fDraft=null;closeLayer();render();toast('Filters applied.')">Apply</button>`});
 S.fDraft=keep;
}
/* ================= CYCLE SETUP WIZARD ================= */
const PATTERNS={
 "Quarterly crew check-in":{name:"Q1 2027 Field Crew Check-in",d:"Short self review and foreman review every quarter.",kind:"Recurring",recur:"Every quarter",start:"Jan 1, 2027",end:"Mar 31, 2027",types:{Self:true,Manager:true,Contributor:true,Peer:false,Upward:false},filters:[["Employee type","Field"],["Department","Field Operations"]],tpl:[["Field employees","Self","t1"],["Field employees","Manager","t2"],["Field employees","Contributor","t3"]],calib:true,ph:[["Self review","Jan 5","Jan 16"],["Manager review","Jan 12","Jan 30"],["Calibration","Feb 2","Feb 6"],["Share results","Feb 9","Feb 20"]]},
 "Annual":{name:"2027 Annual Review",d:"Self, manager and peer reviews once a year.",kind:"Fixed window",recur:"Every year",start:"Jan 1, 2027",end:"Dec 31, 2027",types:{Self:true,Manager:true,Contributor:false,Peer:true,Upward:false},filters:[["Employee type","Office"]],tpl:[["Office employees","Self","t6"],["Office employees","Manager","t6"],["Office employees","Peer","t4"]],calib:true,ph:[["Nominations","Oct 1","Oct 10"],["Self + peer","Oct 8","Oct 24"],["Manager review","Oct 20","Nov 13"],["Calibration","Nov 16","Nov 25"],["Share results","Dec 1","Dec 15"]]},
 "Semiannual":{name:"H1 2027 Review",d:"Twice a year.",kind:"Recurring",recur:"Every 6 months",start:"Jan 1, 2027",end:"Jun 30, 2027",types:{Self:true,Manager:true,Contributor:false,Peer:false,Upward:false},filters:[["Employee type","Office"]],tpl:[["Office employees","Self","t6"],["Office employees","Manager","t6"]],calib:true,ph:[["Self review","Jul 1","Jul 10"],["Manager review","Jul 8","Jul 24"],["Share results","Jul 27","Aug 7"]]},
 "90-day new hire":{name:"90-Day New Hire Check",d:"Starts automatically for every new hire.",kind:"Hire date",recur:"Rolling (hire date)",start:"Day 80",end:"Day 97",types:{Self:false,Manager:true,Contributor:false,Peer:false,Upward:false},filters:[["Hire date","Hired after cycle starts"]],tpl:[["New hires","Manager","t7"]],calib:false,ph:[["Manager review","Day 80","Day 90"],["Share results","Day 90","Day 97"]]},
 "Probation end":{name:"Probation End Review",d:"Runs when probation ends.",kind:"Probation end",recur:"Rolling (probation end)",start:"Probation end − 10 days",end:"Probation end",types:{Self:false,Manager:true,Contributor:false,Peer:false,Upward:false},filters:[["Employee type","On probation"]],tpl:[["Everyone","Manager","t7"]],calib:false,ph:[["Manager review","−10 days","Probation end"]]},
 "Ad hoc":{name:"Ad hoc Review",d:"One-off review for a few people.",kind:"Fixed window",recur:"One time",start:"Oct 19, 2026",end:"Nov 6, 2026",types:{Self:false,Manager:true,Contributor:false,Peer:false,Upward:false},filters:[],tpl:[["Everyone","Manager","t2"]],calib:false,ph:[["Manager review","Oct 19","Oct 30"],["Share results","Nov 2","Nov 6"]]}};
const WSTEPS=["Basics","Schedule","Phases & reminders","Questionnaires","Reviewees & reviewers","Results & privacy","Review & launch"];
function newWz(pattern,fromCycle){
 const P=PATTERNS[pattern]||PATTERNS["Quarterly crew check-in"];
 return {id:fromCycle||null,step:fromCycle?(C(fromCycle).draftStep||1)-1:0,saved:!!fromCycle,pattern,
  name:fromCycle?C(fromCycle).name:P.name,desc:"",rating:"Numeric 1–5 with definitions",types:{...P.types},kind:P.kind,recur:P.recur,start:P.start,end:P.end,auto:pattern!=="Ad hoc",wait:30,
  phases:P.ph.map(x=>({n:x[0],s:x[1],e:x[2]})),gate:true,rem:{7:false,3:true,2:false,1:true,0:true},escalate:true,
  tpl:P.tpl.map(x=>({g:x[0],t:x[1],id:x[2]})),filters:P.filters.map(x=>({k:x[0],v:x[1]})),excl:[{n:"Ivan Petrov",r:"On leave until January"}],
  model:"HR pre-maps",multi:true,minHrs:40,tiered:false,nrFixed:false,ncFixed:false,ovl:null,
  calib:P.calib,approval:false,ack:true,anon:true,anonMin:3,selfVis:"After reviewer submits",results:"After cycle closes",editAfter:true,incl:{ratings:true,comments:true,goals:true,certs:true}};
}
function startCycle(pattern){
 if(pattern){S.wz=newWz(pattern);nav("wizard");return}
 const past=D.cycles.filter(c=>["Closed","Active"].includes(c.status));
 openModal(`<h3>Create review cycle</h3><p class="dim" style="margin:0 0 14px">Start from a pattern. Every setting can be changed in the next steps.</p>
 <div class="chgrid">${Object.entries(PATTERNS).map(([k,v])=>`<button class="ch" style="text-align:left" onclick="closeModal();startCycle('${k}')"><div><div class="t">${k}</div><div class="d">${v.d}</div></div></button>`).join("")}</div>
 ${past.length?`<div style="margin-top:16px"><div class="fl">Or duplicate a past cycle</div><div class="row">${past.slice(0,3).map(c=>`<button class="btn s" onclick="closeModal();cycDup('${c.id}')">${ic("copy","s")} ${esc(c.name)}</button>`).join("")}</div></div>`:""}
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button></div>`,680);
}
function editDraft(cid){const c=C(cid);const pat=Object.keys(PATTERNS).find(k=>k===c.pattern)||"Quarterly crew check-in";S.wz=newWz(pat,cid);S.wz.name=c.name;nav("wizard")}
const W=()=>S.wz;
function wzCount(){
 const w=W();let pool=D.emps.filter(e=>!e.isMgr);
 w.filters.forEach(f=>{
  if(f.k==="Employee type")pool=pool.filter(e=>f.v==="Field"?e.type==="Field":f.v==="Office"?e.type==="Office":true);
  if(f.k==="Crew")pool=pool.filter(e=>crewName(e.crew)===f.v);
  if(f.k==="Job site")pool=pool.filter(e=>e.sites.includes(f.v)||e.site===f.v);
  if(f.k==="Trade")pool=pool.filter(e=>e.trade===f.v);
  if(f.k==="Union status")pool=pool.filter(e=>f.v==="Union"?e.union:!e.union);
  if(f.k==="Hours worked")pool=pool.filter(e=>(e.hrs||0)>=400);
  if(f.k==="Hire date")pool=pool.filter(e=>e.hire==="Feb 2026"||e.hire==="May 2024");
 });
 return pool.filter(e=>!w.excl.some(x=>x.n===e.name));
}
function wzIssues(){
 const w=W(),pool=wzCount(),out=[];
 if(!w.name.trim())out.push({b:1,step:0,t:"Cycle name is missing",fix:[["Add a name","wzGo(0)"]]});
 if(!Object.values(w.types).some(Boolean))out.push({b:1,step:0,t:"Pick at least one review type",fix:[["Choose review types","wzGo(0)"]]});
 if(!pool.length)out.push({b:1,step:4,t:"No one matches the eligibility filters",fix:[["Edit filters","wzGo(4)"]]});
 const types=Object.entries(w.types).filter(x=>x[1]).map(x=>x[0]);
 types.forEach(t=>{if(!w.tpl.some(r=>r.t===t&&r.id))out.push({b:1,step:3,t:`No questionnaire for ${t.toLowerCase()} reviews`,fix:[["Assign "+T(t==="Peer"?"t4":t==="Upward"?"t5":t==="Self"?"t1":t==="Contributor"?"t3":"t2").name,`wzAutoTpl('${t}')`]]})});
 const nr=pool.filter(e=>e.name==="Hector Cruz"||e.name==="Omar Haddad");
 if(nr.length&&!w.nrFixed&&w.model!=="Employee nominates, manager approves")out.push({b:1,step:4,t:`${nr.length} reviewees have no reviewer`,d:nr.map(e=>e.name).join(", ")+" · manager in Lumber has left",fix:[["Use crew foremen","W().nrFixed=true;render();toast('Crew foremen assigned as reviewers.')"],["Map by hand","wzGo(4)"]]});
 const nc=pool.filter(e=>!e.phone&&!e.email);
 if(nc.length&&!w.ncFixed)out.push({b:0,step:4,t:`${nc.length} workers have no phone or email`,d:nc.map(e=>e.name).join(", ")+" · they can't get the review link",fix:[["Use site kiosk for both","W().ncFixed=true;render();toast('Kiosk assigned. Foremen will be told.')"],["Fix later from the cycle","W().ncFixed=true;render()"]]});
 const ov=pool.filter(e=>D.packets.some(p=>p.cid==="c4"&&p.eid===e.id));
 if(ov.length&&w.ovl===null&&w.types.Manager)out.push({b:0,step:6,t:`${ov.length} people are also in 90-Day New Hire Check`,d:"Both have a manager review in the same weeks. Default: both run, reminders are combined into one message.",fix:[["Keep both","W().ovl='keep';render()"],["Merge into one review","W().ovl='merge';render();toast('Merged. One manager review counts for both cycles.')"],["Exclude from this cycle","W().ovl='excl';ov_excl();render()"]]});
 return out;
}
function ov_excl(){const w=W();wzCount().filter(e=>D.packets.some(p=>p.cid==="c4"&&p.eid===e.id)).forEach(e=>w.excl.push({n:e.name,r:"In 90-Day New Hire Check"}))}
function wzAutoTpl(t){const w=W();const id=t==="Peer"?"t4":t==="Upward"?"t5":t==="Self"?"t1":t==="Contributor"?"t3":"t2";w.tpl.push({g:w.filters.find(f=>f.v==="Office")?"Office employees":"Field employees",t,id});render();toast(`${T(id).name} assigned.`)}
function wzGo(i){wzCollect();W().step=i;render();window.scrollTo(0,0)}
function wzCollect(){const w=W();if(!w)return;const g=id=>{const el=$("#"+id);return el?el.value:null};
 if(g("wName")!==null)w.name=g("wName");if(g("wDesc")!==null)w.desc=g("wDesc");
 w.phases.forEach((p,i)=>{if(g("ps"+i)!==null){p.s=g("ps"+i);p.e=g("pe"+i)}});
 if(g("wStart")!==null){w.start=g("wStart");w.end=g("wEnd")}
}
function wzSave(quiet){wzCollect();const w=W();
 if(!w.id){w.id="c"+Date.now();D.cycles.unshift({id:w.id,name:w.name,pattern:w.pattern,status:"Draft",period:`${w.start} – ${w.end}`,aud:"",tpls:w.tpl.map(r=>r.id),types:Object.keys(w.types).filter(k=>w.types[k]),rating:w.rating,model:w.model,calib:w.calib,ack:w.ack,approval:w.approval,anon:w.anonMin,recurring:w.recur,auto:w.auto?"Auto-enroll after "+w.wait+" days":"—",phases:w.phases.map(p=>({...p,st:""})),todayPos:0,draftStep:w.step+1})}
 else{const c=C(w.id);Object.assign(c,{name:w.name,draftStep:w.step+1})}
 w.saved=true;if(S.newCo)D.checklist[3]=true;
 if(!quiet)toast("Draft saved. Find it under Review cycles › Draft.");
}
V.wizard=()=>{
 const w=W();if(!w)return V.cycles();
 wzCollect();
 const iss=wzIssues(),pool=wzCount();
 const body=[wzBasics,wzSchedule,wzPhases,wzTemplates,wzPeople,wzResults,wzLaunch][w.step](w,pool,iss);
 const stepIss=i=>iss.some(x=>x.step===i&&x.b);
 const minutes=w.tpl.filter(r=>r.t==="Self").map(r=>T(r.id).min)[0];
 return `<div class="crumb"><a onclick="wzLeave()">Review cycles</a> › <span>${w.id&&C(w.id)?"Edit draft":"New cycle"}</span></div>
 <div class="ph"><div><h1>${esc(w.name||"Untitled cycle")}</h1><div class="sub">${w.pattern} · ${w.saved?"Draft saved":"Not saved yet"}</div></div><div class="row"><button class="btn" onclick="wzSave()">Save as draft</button><button class="btn ghost" onclick="wzLeave()">Exit</button></div></div>
 <div class="wz">
  <div class="steps">${WSTEPS.map((s,i)=>`<button class="st ${i===w.step?"on":i<w.step?"done":""}" onclick="wzGo(${i})"><span class="n">${i<w.step?"✓":i+1}</span>${s}${stepIss(i)&&i!==w.step?`<span class="w" title="Needs attention">${ic("alert","s")}</span>`:""}</button>`).join("")}</div>
  <div style="min-width:0"><div class="card">${body}</div>
   <div class="wzfoot"><button class="btn" ${w.step?"":"hidden"} onclick="wzGo(${w.step-1})">${ic("back","s")} Back</button><span></span>${w.step<6?`<button class="btn p" onclick="wzGo(${w.step+1})">Next: ${WSTEPS[w.step+1]} ${ic("arrow","s")}</button>`:""}</div></div>
  <aside class="card summ"><div class="hd"><h3>Summary</h3><span class="dim sm">Updates as you go</span></div><div class="bd">
   ${[["Reviewees",pool.length+" people"],["Review types",Object.keys(w.types).filter(k=>w.types[k]).join(", ")||"—"],["Schedule",w.kind+(w.recur?" · "+w.recur:"")],["Period",w.start+" – "+w.end],["Phases",w.phases.length],["Questionnaires",w.tpl.length],["Reviewers",w.model],["Calibration",w.calib?"Required":"Off"],["Field self review",minutes?`~${minutes} min on a phone`:"—"]].map(x=>`<div class="li"><span>${x[0]}</span><span>${esc(x[1])}</span></div>`).join("")}
   ${iss.length?`<div class="${iss.some(x=>x.b)?"bad":"warn"}" style="margin-top:12px"><b>${iss.filter(x=>x.b).length} blocking · ${iss.filter(x=>!x.b).length} to review</b><br><button class="link" onclick="wzGo(6)">See launch checks</button></div>`:`<div class="ok" style="margin-top:12px">Ready to launch.</div>`}
  </div></aside>
 </div>`;
};
function wzLeave(){wzCollect();const w=W();if(w.saved){wzSave(true);nav("cycles",{cycTab:"Draft"});return}
 openModal(`<h3>Leave setup?</h3><p class="dim" style="margin:0 0 12px">You haven't saved this cycle yet.</p><div class="mf"><button class="btn" onclick="closeModal()">Keep editing</button><button class="btn d" onclick="closeModal();S.wz=null;nav('cycles')">Discard</button><button class="btn p" onclick="closeModal();wzSave();nav('cycles',{cycTab:'Draft'})">Save draft and leave</button></div>`)}
const chk=(cond,onc,label,desc="")=>`<label class="ch ${cond?"on":""}"><input type="checkbox" ${cond?"checked":""} onchange="${onc};render()"><div><div class="t">${label}</div>${desc?`<div class="d">${desc}</div>`:""}</div></label>`;
const rad=(cond,onc,label,desc="",name="r")=>`<label class="ch ${cond?"on":""}"><input type="radio" name="${name}" ${cond?"checked":""} onchange="${onc};render()"><div><div class="t">${label}</div>${desc?`<div class="d">${desc}</div>`:""}</div></label>`;
function wzBasics(w){
 return `<div class="sec"><h4>Name and description</h4><div class="fg"><div><label class="fl" for="wName">Cycle name <span class="req">*</span></label><input class="inp" id="wName" value="${esc(w.name)}" oninput="W().name=this.value"></div><div><label class="fl" for="wDesc">Additional notes <span class="dim">(optional, shown to reviewers)</span></label><textarea class="inp" id="wDesc" placeholder="Quick quarterly check-in. Takes about 3 minutes on your phone.">${esc(w.desc)}</textarea></div></div></div>
 <div class="sec"><h4>Review types</h4><div class="sd">Who writes a review about each person.</div><div class="chgrid">
  ${[["Self","Employee reviews themselves. Field workers get a short form by text."],["Manager","Primary reviewer: their manager or the foreman with the most hours."],["Contributor","Other foremen who worked with them this period add notes."],["Peer","Coworkers. Anonymous; shows after "+w.anonMin+" responses."],["Upward","Reports review their manager or foreman. Anonymous."]].map(t=>chk(w.types[t[0]],`W().types['${t[0]}']=this.checked`,t[0],t[1])).join("")}</div></div>
 <div class="sec"><h4>Rating format</h4><div class="sd">Default for this cycle's questionnaires. Can be changed per question.</div><div class="chgrid">
  ${[["Numeric 1–5 with definitions","1 Needs improvement … 5 Outstanding"],["Stars","1 to 5 stars"],["Named levels","Below / Meets / Exceeds"],["Written answers only","No ratings"]].map(r=>rad(w.rating===r[0],`W().rating='${r[0]}'`,r[0],r[1],"wr")).join("")}</div></div>`;
}
function wzSchedule(w){
 return `<div class="sec"><h4>When does it run?</h4><div class="chgrid">
  ${[["Fixed window","One start and end date."],["Recurring","Repeats on a schedule. New cycle created automatically."],["Hire date","Starts for each person based on their hire date or anniversary."],["Probation end","Starts as each person's probation ends."]].map(k=>rad(w.kind===k[0],`W().kind='${k[0]}'`,k[0],k[1],"wk")).join("")}</div></div>
 <div class="sec"><h4>Dates</h4><div class="f2"><div><label class="fl" for="wStart">Review period start</label><input class="inp" id="wStart" value="${esc(w.start)}"></div><div><label class="fl" for="wEnd">Review period end</label><input class="inp" id="wEnd" value="${esc(w.end)}"></div></div>
  ${w.kind==="Recurring"?`<div style="margin-top:14px"><label class="fl">Repeats</label><select class="inp" onchange="W().recur=this.value;render()">${["Every quarter","Every 6 months","Every year"].map(o=>`<option ${w.recur===o?"selected":""}>${o}</option>`).join("")}</select><div class="fd">Next cycles: Q2 2027 (Apr 1), Q3 2027 (Jul 1). Each opens as a draft you can review, or launches automatically.</div></div>`:""}</div>
 <div class="sec"><h4>New people</h4><label class="opt"><span class="sw"><input type="checkbox" ${w.auto?"checked":""} onchange="W().auto=this.checked;render()"><span></span></span><div><b>Enroll new people automatically</b><div class="dim sm">Anyone who joins a matching group is added and gets the review link.</div></div></label>
  ${w.auto?`<div class="row" style="margin:8px 0 0 52px">After a waiting period of <input class="inp w" style="width:70px" type="number" value="${w.wait}" onchange="W().wait=+this.value"> days <span class="asm">Default is an open question</span></div>`:""}</div>`;
}
function wzPhases(w){
 return `<div class="sec"><h4>Phases</h4><div class="sd">Each review type has its own dates. Phases can overlap.</div>
  <div class="tw"><table class="tbl"><thead><tr><th>Phase</th><th>Opens</th><th>Closes</th><th></th></tr></thead><tbody>${w.phases.map((p,i)=>`<tr><td class="b">${p.n}</td><td><input class="inp" id="ps${i}" value="${esc(p.s)}" style="height:34px"></td><td><input class="inp" id="pe${i}" value="${esc(p.e)}" style="height:34px"></td><td>${w.phases.length>1?`<button class="btn xs ghost" aria-label="Remove phase" onclick="wzCollect();W().phases.splice(${i},1);render()">${ic("x","s")}</button>`:""}</td></tr>`).join("")}</tbody></table></div>
  <button class="link" style="margin-top:10px" onclick="wzCollect();W().phases.push({n:'Share results',s:'',e:''});render()">${ic("plus","s")} Add phase</button></div>
 <div class="sec"><h4>Phase gate</h4><label class="opt"><span class="sw"><input type="checkbox" ${w.gate?"checked":""} onchange="W().gate=this.checked;render()"><span></span></span><div><b>Open the manager review for a person once their self review is in</b><div class="dim sm">Otherwise it opens on the phase date for everyone.</div></div></label></div>
 <div class="sec"><h4>Reminders</h4><div class="sd">Sent to anyone with an open review. They stop once it's submitted. Field workers get a text in their language.</div>
  <div class="row">${[7,3,2,1,0].map(d=>`<label class="tag" style="padding:6px 10px;cursor:pointer"><input type="checkbox" ${w.rem[d]?"checked":""} onchange="W().rem[${d}]=this.checked"> ${d?d+" days before":"On due date"}</label>`).join("")}</div>
  <label class="opt" style="margin-top:12px"><input type="checkbox" ${w.escalate?"checked":""} onchange="W().escalate=this.checked"> Escalate overdue reviews to the reviewer's manager, then HR</label>
  <label class="opt"><input type="checkbox" checked> Send managers one daily digest instead of a reminder per person</label></div>`;
}
function wzTemplates(w){
 const types=Object.keys(w.types).filter(k=>w.types[k]);
 const grps=["Field employees","Foremen","Office employees","New hires","Apprentices","Everyone"];
 return `<div class="sec"><h4>Which questionnaire does each group get?</h4><div class="sd">Questionnaires come from your library. Different groups can get different questionnaires in one cycle.</div>
  ${w.tpl.map((r,i)=>{const opts=D.templates.filter(t=>t.status!=="Archived"&&(t.type.includes(r.t)||t.type==="Self + Manager"&&["Self","Manager"].includes(r.t)));const t=T(r.id);
  return `<div class="rule"><select class="inp" onchange="W().tpl[${i}].g=this.value">${grps.map(g=>`<option ${r.g===g?"selected":""}>${g}</option>`).join("")}</select><span class="dim" style="text-align:center">→</span>
  <div><select class="inp" onchange="W().tpl[${i}].id=this.value;render()">${opts.map(o=>`<option value="${o.id}" ${o.id===r.id?"selected":""}>${o.name}${o.status==="Draft"?" (draft)":""}</option>`).join("")}</select><div class="fd">${r.t} review · ${t?`${t.q} questions · ~${t.min} min · ${t.langs.join(" + ")}`:""}</div></div>
  <div class="row" style="flex-wrap:nowrap"><button class="btn xs" onclick="previewTpl('${r.id}')">${ic("eye","s")} Preview</button><button class="btn xs ghost" aria-label="Remove" onclick="W().tpl.splice(${i},1);render()">${ic("x","s")}</button></div></div>`}).join("")}
  <div class="row" style="margin-top:10px"><span class="dim sm">Add a rule for</span>${types.map(t=>`<button class="btn xs" onclick="W().tpl.push({g:'Everyone',t:'${t}',id:'${t==="Peer"?"t4":t==="Upward"?"t5":t==="Self"?"t1":t==="Contributor"?"t3":"t2"}'});render()">${ic("plus","s")} ${t}</button>`).join("")}</div></div>
 <div class="sec"><div class="row" style="justify-content:space-between"><div><h4>Need a different questionnaire?</h4><div class="sd" style="margin:0">Your setup is saved; you'll come back to this step.</div></div><button class="btn s" onclick="wzSave(true);S.returnTo='wizard';openBuilder(null,'t2')">${ic("plus","s")} Create questionnaire</button></div></div>`;
}
function wzPeople(w,pool){
 const add=["Department","Location","Job site","Crew","Trade","Classification","Union status","Employee type","Hire date","Hours worked","Custom group"];
 const nr=pool.filter(e=>e.name==="Hector Cruz"||e.name==="Omar Haddad");
 return `<div class="sec"><h4>Who is reviewed</h4><div class="sd">Filters use live Lumber data. ${w.auto?"New matches are enrolled automatically.":""}</div>
  <div class="row">${w.filters.map((f,i)=>`<span class="tag x" title="Remove filter" onclick="W().filters.splice(${i},1);render()"><b>${f.k}:</b> ${esc(f.v)} ✕</span>`).join("")}
  <select class="inp w" style="height:30px;font-size:14px" onchange="if(this.value){addFilter(this.value)}"><option value="">+ Add filter</option>${add.map(a=>`<option>${a}</option>`).join("")}</select></div>
  <div class="row" style="margin-top:14px;justify-content:space-between"><div><b style="font-size:20px">${pool.length}</b> <span class="dim">people match · ${w.excl.length} excluded</span></div><button class="link" onclick="S.showPool=!S.showPool;render()">${S.showPool?"Hide":"Show"} list</button></div>
  ${S.showPool?`<div class="card" style="margin-top:10px;max-height:300px;overflow:auto"><table class="tbl"><thead><tr><th>Name</th><th>Crew</th><th>Hours</th><th></th></tr></thead><tbody>${pool.map(e=>`<tr><td>${e.name}</td><td>${crewName(e.crew)}</td><td class="tab-num">${e.hrs||"—"}</td><td><button class="btn xs" onclick="wzExclude('${e.name}')">Exclude</button></td></tr>`).join("")}</tbody></table></div>`:""}
  ${w.excl.length?`<div style="margin-top:12px"><div class="fl">Excluded</div>${w.excl.map((x,i)=>`<div class="row sm" style="padding:4px 0"><span class="tag">${x.n}</span><span class="dim">${esc(x.r)}</span><button class="link" onclick="W().excl.splice(${i},1);render()">Add back</button></div>`).join("")}</div>`:""}</div>
 <div class="sec"><h4>How reviewers are chosen</h4><div class="chgrid">
  ${[["HR pre-maps","You map foremen to workers. Suggestions come from shared hours."],["Employee nominates, manager approves","Employees pick peers; their manager approves."],["Both","HR maps foremen; employees can nominate extra peers."]].map(m=>rad(w.model===m[0],`W().model='${m[0]}'`,m[0],m[1],"wm")).join("")}</div>
  <label class="opt" style="margin-top:12px"><input type="checkbox" ${w.multi?"checked":""} onchange="W().multi=this.checked;render()"><div>Workers on several sites: foreman with the most hours is primary; others with <input class="inp w" style="width:60px;height:28px" value="${w.minHrs}" onchange="W().minHrs=+this.value">+ hrs contribute</div></label>
  <label class="opt"><input type="checkbox" ${w.tiered?"checked":""} onchange="W().tiered=this.checked;render()"><div>Reviewer lists need manager, then director approval before reviewers are notified</div></label></div>
 ${w.model!=="Employee nominates, manager approves"?`<div class="sec"><div class="row" style="justify-content:space-between;margin-bottom:10px"><div><h4>Reviewer map</h4><div class="sd" style="margin:0">Suggested from Lumber reporting lines and shared hours this period.</div></div><button class="btn s" onclick="toast('Reviewer map exported. Edit and re-import if you prefer a spreadsheet.')">${ic("down","s")} Export / import</button></div>
  ${nr.length&&!w.nrFixed?`<div class="bad" style="margin-bottom:10px">${nr.length} reviewees have no reviewer because their manager in Lumber has left. <button class="link" onclick="W().nrFixed=true;render()">Use crew foremen</button></div>`:""}
  <div class="card tw"><table class="tbl"><thead><tr><th>Reviewee</th><th>Primary reviewer</th><th>Contributors</th></tr></thead><tbody>${pool.slice(0,10).map(e=>{const missing=(e.name==="Hector Cruz"||e.name==="Omar Haddad")&&!w.nrFixed;const c2=e.sites.length>1&&w.multi;
   return `<tr><td><div class="n b">${e.name}</div><div class="dim sm">${crewName(e.crew)} · ${e.hrs||"—"} hrs</div></td><td>${missing?`<select class="inp" style="height:34px;border-color:var(--red)" onchange="W().nrFixed=true;render()"><option>Choose reviewer…</option>${D.emps.filter(x=>x.isMgr).map(x=>`<option>${x.name}</option>`).join("")}</select>`:`<select class="inp" style="height:34px">${D.emps.filter(x=>x.isMgr).map(x=>`<option ${x.name===e.mgr?"selected":""}>${x.name}</option>`).join("")}</select>`}</td><td>${c2?`<span class="tag">${D.crews[(D.crews.findIndex(c=>c.id===e.crew)+1)%4].fm} · 96 hrs</span>`:`<span class="dim sm">None</span>`}</td></tr>`}).join("")}</tbody></table></div>
  ${pool.length>10?`<div class="dim sm" style="margin-top:8px">+ ${pool.length-10} more, all mapped</div>`:""}</div>`:""}`;
}
function addFilter(k){const vals={"Department":["Field Operations","Estimating","Projects","Finance"],"Location":["Main office","Yard"],"Job site":D.sites,"Crew":D.crews.map(c=>c.name),"Trade":["Roofer","Carpenter","Siding installer"],"Classification":["Journeyman","Apprentice","Laborer"],"Union status":["Union","Non-union"],"Employee type":["Field","Office"],"Hire date":["Hired after cycle starts","Hired before Jan 1, 2026"],"Hours worked":["400+ hrs this period"],"Custom group":["Leadership track"]}[k]||["Any"];
 openModal(`<h3>Filter by ${k.toLowerCase()}</h3><div class="choice" style="margin-top:12px">${vals.map((v,i)=>`<label class="ch ${i?"":"on"}"><input type="radio" name="fv" value="${esc(v)}" ${i?"":"checked"} onchange="$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked))"><div class="t">${esc(v)}</div></label>`).join("")}</div><div class="mf"><button class="btn" onclick="closeModal();render()">Cancel</button><button class="btn p" onclick="W().filters.push({k:'${k}',v:$('input[name=fv]:checked').value});closeModal();render()">Add filter</button></div>`)}
function wzExclude(n){reasonModal({title:`Exclude ${n}`,desc:"They're listed as excluded with this reason. You can add them back any time.",confirm:"Exclude",onOk:r=>{W().excl.push({n,r});closeModal();render()}})}
function wzResults(w){
 return `<div class="sec"><h4>Before results are shared</h4><div class="chgrid">
  ${chk(w.calib,"W().calib=this.checked","Calibration required","Compare and adjust ratings by foreman, crew and site. Sharing waits for it.")}
  ${chk(w.approval,"W().approval=this.checked","Approval required","Named approvers sign off on each packet.")}
  ${chk(w.ack,"W().ack=this.checked","Acknowledgment required","Employee confirms receipt by SMS, app or web. Not agreement. They can comment or dispute.")}</div>
  ${w.approval?`<div style="margin-top:12px"><label class="fl">Approvers</label><select class="inp"><option>Dana Whitfield (Superintendent)</option><option>Mark Wagner (Owner)</option></select></div>`:""}</div>
 <div class="sec"><h4>What the packet includes</h4><div class="row">${[["ratings","Final ratings"],["comments","Written answers"],["goals","Goals set in the cycle"],["certs","Certification status"]].map(x=>`<label class="tag" style="padding:6px 10px;cursor:pointer"><input type="checkbox" ${w.incl[x[0]]?"checked":""} onchange="W().incl['${x[0]}']=this.checked"> ${x[1]}</label>`).join("")}</div><div class="fd">Never included: drafts, private manager or HR notes, pre-calibration ratings, pay data, names of anonymous reviewers.</div></div>
 <div class="sec"><h4>Privacy and visibility</h4><div class="fg">
  <div class="f2"><div><label class="fl">Manager sees self review content</label><select class="inp" onchange="W().selfVis=this.value">${["Hidden until cycle end","After reviewer submits","During review"].map(o=>`<option ${w.selfVis===o?"selected":""}>${o}</option>`).join("")}</select><div class="fd">Managers always see whether it was submitted.</div></div>
  <div><label class="fl">Employee sees results</label><select class="inp" onchange="W().results=this.value">${["After cycle closes","As soon as their reviews are in","Never"].map(o=>`<option ${w.results===o?"selected":""}>${o}</option>`).join("")}</select></div></div>
  <label class="opt"><input type="checkbox" ${w.anon?"checked":""} onchange="W().anon=this.checked;render()"><div>Peer and upward feedback is anonymous; show only after <input class="inp w" style="width:56px;height:28px" value="${w.anonMin}" onchange="W().anonMin=+this.value"> responses</div></label>
  <label class="opt"><input type="checkbox" ${w.editAfter?"checked":""} onchange="W().editAfter=this.checked"><div>Reviewers can edit after submitting, until the phase closes</div></label>
  <div class="dim sm">Defaults come from <button class="link" onclick="wzSave(true);nav('settings')">company policies</button>.</div></div></div>`;
}
function wzLaunch(w,pool,iss){
 const blocking=iss.filter(x=>x.b),warn=iss.filter(x=>!x.b);
 const es=pool.filter(e=>e.lang==="ES").length;
 return `<div class="sec"><h4>Launch checks</h4><div class="sd">Only real problems block launch. Each has a fix right here.</div>
  ${iss.length?iss.map(x=>`<div class="att" style="padding:12px 0"><span class="sev ${x.b?"r":""}"></span><div class="grow"><div class="t">${x.b?"Blocking: ":""}${x.t}</div>${x.d?`<div class="d">${esc(x.d)}</div>`:""}<div class="row" style="margin-top:8px">${x.fix.map((f,i)=>`<button class="btn xs ${i?"":"p"}" onclick="${f[1].replace(/"/g,"&quot;")}">${f[0]}</button>`).join("")}</div></div></div>`).join(""):`<div class="ok">No problems found. ${pool.length} packets will be created.</div>`}
  ${w.ovl==="keep"?`<div class="note" style="margin-top:8px">Overlap: both reviews run; reminders combined.</div>`:""}</div>
 <div class="sec"><h4>What people will get</h4><div class="grid2">
  <div><div class="fl">Text to field workers · English</div><div class="note" style="background:#F3F4F6;border-color:var(--line);color:var(--ink)">Lumberfi-Demo: Your ${esc(w.name)} is ready. Takes about 3 min. Open: lmbr.co/r/8KQ2 · Due ${w.phases[0]?w.phases[0].e:""}</div></div>
  <div><div class="fl">Text · Spanish (${es} people)</div><div class="note" style="background:#F3F4F6;border-color:var(--line);color:var(--ink)">Lumberfi-Demo: Su evaluación está lista. Toma unos 3 min. Abrir: lmbr.co/r/8KQ2 · Fecha límite ${w.phases[0]?w.phases[0].e:""}</div></div></div>
  <div class="dim sm" style="margin-top:8px">Foremen and managers get an app notification and email, including any expired certifications on their crew.</div></div>
 <div class="sec"><div class="row" style="justify-content:space-between"><div><b>${pool.length} packets</b> <span class="dim">· ${pool.filter(e=>e.type==="Field").length} field workers by text (${es} in Spanish) · ${new Set(pool.map(e=>e.mgr)).size} reviewers notified</span></div>
  <div class="row"><button class="btn" onclick="wzSave()">Save as draft</button><button class="btn p" ${blocking.length?'aria-disabled="true"':""} onclick="${blocking.length?`toast('Fix ${blocking.length} blocking issue${blocking.length>1?"s":""} above to launch.')`:"wzLaunchGo()"}">Launch cycle</button></div></div>
  ${blocking.length?`<div class="err" style="text-align:right">Fix ${blocking.length} blocking issue${blocking.length>1?"s":""} above to launch.</div>`:""}</div>`;
}
function wzLaunchGo(){const w=W(),pool=wzCount();const future=/2027|Day|Probation/.test(w.start);
 openModal(`<h3>${future?"Schedule":"Launch"} ${esc(w.name)}?</h3><p class="dim" style="margin:0 0 12px">${pool.length} packets are created${future?` when it opens on ${w.phases[0].s}`:" now"}. People are notified ${future?"then":"right away"}.</p>
 <div class="note">After launch you can still pause, extend, add or remove people, change reviewers and edit settings. Every change is logged.</div>
 <div class="mf"><button class="btn" onclick="closeModal()">Not yet</button><button class="btn p" onclick="wzLaunchDo(${future})">${future?"Schedule":"Launch"}</button></div>`)}
function wzLaunchDo(future){wzSave(true);const w=W(),c=C(w.id),pool=wzCount();
 c.status=future?"Scheduled":"Active";c.period=w.start+" – "+w.end;c.phases=w.phases.map((p,i)=>({...p,st:future?"":i===0?"cur":""}));c.todayPos=future?0:4;
 if(!future){let id=Math.max(0,...D.packets.map(p=>p.id));pool.forEach(e=>D.packets.push({id:++id,cid:c.id,eid:e.id,st:w.types.Self?"Not started":"Manager in progress",exc:null,due:w.phases[0].e,self:{st:w.types.Self?"Not started":"Off"},mgr:{st:"Not started",by:e.mgr},contrib:[],peers:[],rating:null,ver:1,hist:[{t:"Oct 14",who:"System",txt:"Packet created at launch",c:"b"}]}))}
 D.activity.unshift({t:"Just now",txt:`${c.name} ${future?"scheduled":"launched"} · ${pool.length} packets`,c:"g"});
 if(S.newCo){D.checklist[3]=D.checklist[4]=D.checklist[5]=true}
 closeModal();S.wz=null;nav(future?"cycles":"cycle",{cid:c.id,tab:"overview",cycTab:future?"Scheduled":"All"});toast(future?`Scheduled. Opens ${c.phases[0].s}.`:`Launched. ${pool.length} packets created and people notified.`)}
/* ================= TEMPLATES ================= */
V.templates=()=>{
 const tabs=S.newCo?["Starter","Favorites","Drafts","Archive"]:["Active","Favorites","Drafts","Archive"];
 const map={Active:"Active",Starter:"Starter",Drafts:"Draft",Archive:"Archived"};
 if(!tabs.includes(S.tplTab))S.tplTab=tabs[0];
 const f=(S.flt||{}).templates||{};
 let list=S.tplTab==="Favorites"?D.templates.filter(t=>t.fav&&t.status!=="Draft"):D.templates.filter(t=>t.status===map[S.tplTab]);
 if(f.Type&&f.Type.length)list=list.filter(t=>f.Type.includes(t.type));
 if(f.Language&&f.Language.includes("Spanish"))list=list.filter(t=>t.langs.includes("ES"));
 if(S.q)list=list.filter(t=>t.name.toLowerCase().includes(S.q.toLowerCase()));
 const cnt=t=>t==="Favorites"?D.templates.filter(x=>x.fav&&x.status!=="Draft").length:D.templates.filter(x=>x.status===map[t]).length;
 return `<div class="ph"><div><h1>Questionnaires</h1></div><button class="btn p" onclick="newTemplate()">${ic("tpl")} Add Questionnaire</button></div>
 ${tabBar(tabs.map(t=>({id:t,label:t,count:cnt(t)})),{active:S.tplTab,label:"Questionnaire status",onSelect:t=>`S.tplTab='${t}';render()`})}
 ${S.newCo&&S.tplTab==="Starter"?`<div class="note" style="margin-bottom:14px">Starter questionnaires are built for construction crews and offices, in English and Spanish. Preview one and save it to finish step 3 of setup.</div>`:""}
 <div class="card">${toolbar(`<label class="srch">${ic("search")}<input id="tq" placeholder="Search questionnaires" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#tq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label>`)}
 ${list.length?`<div class="tw"><table class="tbl tpltbl"><thead><tr><th class="cbx"><input type="checkbox" aria-label="Select all"></th><th>Template Name</th><th>Questions</th><th>Created By</th><th>Created Date ↓</th><th>Used in Review Cycles</th><th class="act"><span class="cd-vh">Actions</span></th></tr></thead><tbody>${list.map(t=>{
  const cycs=t.used.map(C).filter(Boolean);
  const used=cycs.length?`<span title="${esc(cycs.map(c=>c.name).join(", "))}">${esc(cycs[0].name)}${cycs.length>1?` <span class="dim">+${cycs.length-1} more</span>`:""}</span>`:'<span class="dim">-</span>';
  return `<tr class="click" onclick="openBuilder('${t.id}')"><td class="cbx" onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select ${esc(t.name)}"></td><td><span class="b" style="font-weight:500">${esc(t.name)}</span>${t.langs.includes("ES")?' <span class="tag">EN · ES</span>':""}</td>
  <td class="tab-num">${t.q}</td><td>${t.starter?"Lumber":"Anshika R."}</td><td class="tab-num">${t.created||"09/"+(10+t.id.length*3)+"/2026"}</td>
  <td>${used}</td>
  <td class="act" onclick="event.stopPropagation()"><div class="tpl-act">${t.status==="Draft"?"":`<button class="btn ghost s ${t.fav?"fav":""}" aria-label="${t.fav?"Remove from favorites":"Add to favorites"}" title="${t.fav?"Remove from favorites":"Add to favorites"}" aria-pressed="${!!t.fav}" onclick="T('${t.id}').fav=!T('${t.id}').fav;render()">${ic("star")}</button>`}${tplMenu(t)}</div></td></tr>`}).join("")}</tbody></table></div>${pgFoot(list.length)}`:tplEmpty()}</div>`;
};
function assignTpl(id){const t=T(id);if(t.status==="Draft"){toast("Publish this questionnaire before assigning it.");openBuilder(id);return}
 const pat=t.id==="t7"?"90-day new hire":t.id==="t6"?"Annual":"Quarterly crew check-in";S.wz=newWz(pat);const w=S.wz;const ty=t.type==="Self + Manager"?"Manager":t.type;if(!w.tpl.some(r=>r.id===id)){const r=w.tpl.find(r=>r.t===ty);if(r)r.id=id;else w.tpl.push({g:t.aud,t:ty,id})}w.types[ty]=true;nav("wizard");toast(`${t.name} added. Pick who to review next.`)}
function tplMenu(t){const id="tm"+t.id,draft=t.status==="Draft";
 const items=[["edit","Edit",`openBuilder('${t.id}')`]];
 if(t.status==="Archived")items.push(["undo","Enable",`t_set('${t.id}','Active')`]);else if(!draft)items.push(["archive","Archive",`tplArchive('${t.id}')`]);
 const danger=draft?[["x","Delete draft",`tplDelete('${t.id}')`]]:[];   // drafts were never used in a cycle, so they're deleted instead of archived
 return `<div class="kebab"><button class="btn ghost s" aria-label="More actions" onclick="toggleMenu('${id}',event)">${ic("more")}</button>${S.menu===id?`<div class="menu">${items.map(i=>`<button onclick="S.menu=null;${i[2]}">${ic(i[0],"s")} ${i[1]}</button>`).join("")}${danger.length?"<hr>"+danger.map(i=>`<button class="d" onclick="S.menu=null;${i[2]}">${ic(i[0],"s")} ${i[1]}</button>`).join(""):""}</div>`:""}</div>`}
function tplArchive(id){const t=T(id),live=t.used.map(C).filter(c=>c&&["Active","Paused","Scheduled"].includes(c.status));
 reasonModal({title:"Archive questionnaire?",desc:`${esc(t.name)} moves to the Archive tab and can't be added to new review cycles. You can enable it again at any time.`,
  affected:live.length?`In use by ${live.length} review cycle${live.length>1?"s":""}. ${live.length>1?"They":"It"} keep${live.length>1?"":"s"} working with this questionnaire.`:"",
  confirm:"Archive",needReason:false,onOk:()=>{closeModal();t_set(id,"Archived")}})}
function tplDelete(id){const t=T(id);
 reasonModal({title:"Delete draft?",desc:`${esc(t.name)} will be permanently deleted.`,confirm:"Delete draft",danger:true,needReason:false,onOk:()=>{const i=D.templates.indexOf(t);D.templates.splice(i,1);closeModal();render();toast("Draft deleted.",()=>{D.templates.splice(i,0,t);render()})}})}
function t_set(id,st){const t=T(id),old=t.status;t.status=st;render();toast(`${t.name} ${st==="Archived"?"archived. Cycles using it keep working.":"enabled."}`,()=>{t.status=old;render()})}
function dupTpl(id){const t=T(id),n={...JSON.parse(JSON.stringify(t)),id:"t"+Date.now(),name:t.name+" (copy)",status:"Draft",fav:false,used:[],ver:0,starter:false,upd:"Today"};D.templates.push(n);S.tplTab="Drafts";openBuilder(n.id)}
function newTemplate(){
 openModal(`<h3>Create questionnaire</h3><p class="dim" style="margin:0 0 12px">Starters are built for construction roles. Each comes in English and Spanish.</p>
 <div class="chgrid">${[["t1","Field worker self review","8 questions · 3 min"],["t2","Foreman crew review","12 questions · 5 min"],["t7","90-day new hire","10 questions · 4 min"],["t4","Peer review","5 questions · 2 min"],["t5","Upward review","6 questions · 3 min"],["t6","Office employee","18 questions · 12 min"],["","Blank questionnaire","Start from nothing"]].map(x=>`<button class="ch" style="text-align:left" onclick="closeModal();openBuilder(null,'${x[0]}')"><div><div class="t">${x[1]}</div><div class="d">${x[2]}</div></div></button>`).join("")}</div>
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button></div>`,640)}
const QT=["Numeric scale","Star rating","Named-level scale","Short text","Paragraph","Number","Single select","Multi-select","Date","Checkbox","E-signature","Attachment"];
function sampleSections(kind){
 const Q=(t,type="Numeric scale",o={})=>({t,es:o.es||"",type,req:o.req!==false,help:o.help||"",cond:o.cond||"Everyone",low:o.low||false,data:o.data||""});
 if(kind==="t1")return[{n:"How did this quarter go?",qs:[Q("How safe did you work this quarter?","Numeric scale",{es:"¿Qué tan seguro trabajó este trimestre?"}),Q("How was the quality of your work?","Numeric scale",{es:"¿Cómo fue la calidad de su trabajo?"}),Q("Did you show up on time and ready?","Numeric scale",{es:"¿Llegó a tiempo y listo?",data:"Attendance this period"}),Q("How well did your crew work together?","Numeric scale",{es:"¿Qué tan bien trabajó su cuadrilla?"})]},{n:"Looking ahead",qs:[Q("What do you want to learn next?","Paragraph",{req:false,es:"¿Qué quiere aprender después?",help:"Tap the mic to answer by voice"}),Q("Any certification you want to get?","Single select",{req:false,es:"¿Alguna certificación que quiera obtener?"}),Q("Anything your foreman should know?","Paragraph",{req:false,es:"¿Algo que su capataz deba saber?"}),Q("Sign to submit","E-signature",{es:"Firme para enviar"})]}];
 if(kind==="")return[{n:"Section 1",qs:[Q("New question")]}];
 return[{n:"Trade skill",qs:[Q("Quality of trade work (cuts, installs, finish)","Numeric scale",{low:true}),Q("Reads plans and follows specs","Numeric scale")]},{n:"Safety",qs:[Q("Follows safety rules and uses PPE","Numeric scale",{low:true,data:"Incidents logged"}),Q("Speaks up about hazards","Numeric scale")]},{n:"Quality and rework",qs:[Q("Rework and callbacks caused","Numeric scale",{low:true}),Q("Example of quality work or a miss","Paragraph",{req:false})]},{n:"Attendance and reliability",qs:[Q("On time and ready to work","Numeric scale",{data:"Hours this period"}),Q("Reliability when plans change","Numeric scale")]},{n:"Teamwork and leadership",qs:[Q("Works well with the crew","Numeric scale"),Q("Leads others on site","Numeric scale",{cond:"Foremen and lead hands"})]},{n:"Development",qs:[Q("Certification progress","Numeric scale",{data:"Active certifications"}),Q("Goals for next quarter","Paragraph",{req:false})]}];
}
function openBuilder(id,from){
 let t=id?T(id):null;
 if(!t){const base=from?T(from):null;t={id:"t"+Date.now(),name:base?base.name+" (new)":"Untitled questionnaire",type:base?base.type:"Manager",aud:base?base.aud:"Field employees",q:0,min:0,langs:["EN","ES"],status:"Draft",ver:0,used:[],upd:"Today",isNew:true};D.templates.push(t)}
 if(!t.sections)t.sections=sampleSections(id||from||"");
 S.bld={id:t.id,sel:[0,0],lang:"EN",prev:false};S.tplTab={Starter:"Starter",Active:"Active",Draft:"Drafts",Archived:"Archive"}[t.status]||"Active";nav("builder");
}
function bT(){return T(S.bld.id)}
function bStats(t){const n=t.sections.reduce((a,s)=>a+s.qs.length,0);const m=Math.max(1,Math.round(t.sections.reduce((a,s)=>a+s.qs.reduce((b,q)=>b+(q.type==="Paragraph"?.8:q.type==="E-signature"?.2:.35),0),0)));t.q=n;t.min=m;return{n,m}}
V.builder=()=>{
 const t=bT();if(!t)return V.templates();const {n,m}=bStats(t);const [si,qi]=S.bld.sel;const sec=t.sections[si];const q=sec&&sec.qs[qi];
 const field=/Field|New hires/.test(t.aud);const live=t.used.filter(c=>C(c)&&["Active","Scheduled"].includes(C(c).status));
 let k=0;
 return `<div class="crumb">${S.returnTo==="wizard"?`<a onclick="S.returnTo=null;nav('wizard')">${ic("back","s")} Back to cycle setup</a> · `:""}<a onclick="nav('templates')">Questionnaires</a> › <span>${esc(t.name)}</span></div>
 <div class="ph"><div style="min-width:0;flex:1"><input class="inp" style="font-size:20px;font-weight:600;height:46px;max-width:520px" value="${esc(t.name)}" aria-label="Questionnaire name" oninput="bT().name=this.value"><div class="row sm" style="margin-top:8px">${pill(t.status)}<span class="dim">${t.type} review · for ${t.aud}</span>${live.length?`<span class="pill a">In use by ${live.length} live cycle${live.length>1?"s":""}</span>`:""}</div></div>
 <div class="row"><span class="seg"><button class="btn xs ${S.bld.lang==="EN"?"p":""}" onclick="S.bld.lang='EN';render()">English</button> <button class="btn xs ${S.bld.lang==="ES"?"p":""}" onclick="S.bld.lang='ES';render()">Español</button></span><button class="btn" onclick="previewTpl('${t.id}')">${ic("eye","s")} Preview</button><button class="btn" onclick="bSave()">Save draft</button><button class="btn p" onclick="bPublish()">${t.status==="Active"?"Publish changes":"Publish"}</button></div></div>
 <div class="${field&&n>15?"warn":"note"}" style="margin-bottom:14px;display:flex;gap:16px;flex-wrap:wrap"><b>${n} questions · ~${m} min</b><span>${field?(n>15?"Long for a field form. We recommend 10–15 questions so crews finish in about 3–5 minutes.":"Good length for crews (10–15 recommended)."):"Office forms can be longer."}</span>${S.bld.lang==="ES"?`<span>${t.sections.reduce((a,s)=>a+s.qs.filter(q=>!q.es).length,0)} questions still need Spanish text</span>`:""}</div>
 <div class="bld">
  <div class="card qlist" style="padding-bottom:8px">${t.sections.map((s,i)=>`<div class="sh"><span>${esc(s.n)}</span><span>${s.qs.length}</span></div>${s.qs.map((x,j)=>{k++;return `<div class="qi ${i===si&&j===qi?"on":""}" onclick="S.bld.sel=[${i},${j}];render()"><span class="qn">${k}</span><span>${esc(S.bld.lang==="ES"&&x.es?x.es:x.t)}</span></div>`}).join("")}`).join("")}
   <div style="padding:10px 14px"><button class="link" onclick="bT().sections.push({n:'New section',qs:[{t:'New question',es:'',type:'Numeric scale',req:true,help:'',cond:'Everyone',low:false,data:''}]});S.bld.sel=[bT().sections.length-1,0];render()">${ic("plus","s")} Add section</button></div>
   <div style="padding:0 14px"><div class="fl sm" style="margin-top:6px">Standard sections</div><div class="row">${["Safety","Quality and rework","Attendance and reliability","Leadership"].filter(x=>!t.sections.some(s=>s.n===x)).map(x=>`<button class="btn xs" onclick="bT().sections.push({n:'${x}',qs:[{t:'${x} rating',es:'',type:'Numeric scale',req:true,help:'',cond:'Everyone',low:true,data:''}]});render()">+ ${x}</button>`).join("")||'<span class="dim sm">All added</span>'}</div></div>
  </div>
  <div class="stack" style="gap:12px">${sec?`<div class="card"><div class="hd"><input class="inp" style="font-weight:600;max-width:340px;height:34px" value="${esc(sec.n)}" aria-label="Section name" oninput="bT().sections[${si}].n=this.value"><div class="row"><button class="btn xs" onclick="bAddQ(${si})">${ic("plus","s")} Question</button>${t.sections.length>1?`<button class="btn xs ghost" onclick="bT().sections.splice(${si},1);S.bld.sel=[0,0];render()">Delete section</button>`:""}</div></div><div class="bd" style="display:grid;gap:10px">${sec.qs.map((x,j)=>qCard(x,si,j,j===qi)).join("")}</div></div>`:""}</div>
  <div class="card props">${q?qProps(q,si,qi):""}</div>
 </div>`;
};
function qCard(q,si,j,on){
 const txt=S.bld.lang==="ES"?(q.es||`<span style="color:var(--amber)">Needs Spanish · ${esc(q.t)}</span>`):esc(q.t);
 const L=D.settings.levels;
 const body=q.type==="Numeric scale"?`<div class="scale">${[1,2,3,4,5].map(n=>`<span title="${L[n-1]}">${n}</span>`).join("")}</div>`:q.type==="Star rating"?`<div class="scale">${"★★★★★".split("").map(s=>`<span>${s}</span>`).join("")}</div>`:q.type==="Named-level scale"?`<div class="scale">${["Below","Meets","Exceeds"].map(s=>`<span>${s}</span>`).join("")}</div>`:q.type==="Paragraph"||q.type==="Short text"?`<div class="inp" style="margin-top:10px;height:${q.type==="Paragraph"?60:38}px;background:var(--sub)"></div>`:q.type==="E-signature"?`<div class="inp" style="margin-top:10px;height:50px;background:var(--sub);display:flex;align-items:center" ><span class="dim sm">Sign here</span></div>`:`<div class="dim sm" style="margin-top:8px">${q.type}</div>`;
 return `<div class="qcard ${on?"on":""}" onclick="S.bld.sel=[${si},${j}];render()"><div class="row"><span class="dim">${ic("drag","s")}</span><span class="qt grow" id="qt${si}_${j}">${txt}${q.req?' <span class="req">*</span>':""}</span>${q.cond!=="Everyone"?`<span class="tag">Only: ${q.cond}</span>`:""}</div>${q.help?`<div class="dim sm" style="margin-top:4px">${esc(q.help)}</div>`:""}${q.data?`<div style="margin-top:8px"><span class="datafield">${ic("chart","s")} Shows: ${q.data} (from Lumber)</span></div>`:""}${body}${q.low?`<div class="dim sm" style="margin-top:6px">Comment required for ratings of 2 or lower</div>`:""}</div>`;
}
function qProps(q,si,qi){
 const set=(k,v)=>`bT().sections[${si}].qs[${qi}].${k}=${v}`;
 return `<div class="hd"><h3>Question</h3><div class="row"><button class="btn xs ghost" aria-label="Move up" onclick="bMove(${si},${qi},-1)">↑</button><button class="btn xs ghost" aria-label="Move down" onclick="bMove(${si},${qi},1)">↓</button></div></div><div class="bd fg">
 <div><label class="fl">Question · English</label><textarea class="inp" style="height:60px" oninput="bTxt(${si},${qi},'t',this.value)">${esc(q.t)}</textarea></div>
 <div><label class="fl">Pregunta · Español</label><textarea class="inp" style="height:60px" placeholder="Add Spanish text" oninput="bTxt(${si},${qi},'es',this.value)">${esc(q.es)}</textarea><button class="link sm" onclick="${set("es","'[ES] '+bT().sections["+si+"].qs["+qi+"].t")};render();toast('Draft translation added. Review before publishing.')">Suggest translation</button></div>
 <div><label class="fl">Answer type</label><select class="inp" onchange="${set("type","this.value")};render()">${QT.map(x=>`<option ${q.type===x?"selected":""}>${x}</option>`).join("")}</select></div>
 <label class="opt"><span class="sw"><input type="checkbox" ${q.req?"checked":""} onchange="${set("req","this.checked")};render()"><span></span></span> Required</label>
 ${/scale|rating/i.test(q.type)?`<label class="opt"><input type="checkbox" ${q.low?"checked":""} onchange="${set("low","this.checked")};render()"> Require a comment on ratings of 2 or lower</label>`:""}
 <div><label class="fl">Help text</label><input class="inp" value="${esc(q.help)}" oninput="${set("help","this.value")}" placeholder="Shown under the question"></div>
 <div><label class="fl">Show this question to</label><select class="inp" onchange="${set("cond","this.value")};render()">${["Everyone","Foremen and lead hands","Apprentices","Office employees","Union workers"].map(x=>`<option ${q.cond===x?"selected":""}>${x}</option>`).join("")}</select></div>
 <div><label class="fl">Show Lumber data beside it <span class="dim">(read-only)</span></label><select class="inp" onchange="${set("data","this.value")};render()">${["","Hours this period","Attendance this period","Active certifications","Incidents logged","Job sites worked","PTO taken"].map(x=>`<option value="${x}" ${q.data===x?"selected":""}>${x||"None"}</option>`).join("")}</select></div>
 <div class="row"><button class="btn xs" onclick="const s=bT().sections[${si}];s.qs.splice(${qi}+1,0,JSON.parse(JSON.stringify(s.qs[${qi}])));S.bld.sel=[${si},${qi+1}];render()">${ic("copy","s")} Duplicate</button>${bT().sections[si].qs.length>1?`<button class="btn xs d" onclick="bT().sections[${si}].qs.splice(${qi},1);S.bld.sel=[${si},0];render()">Delete</button>`:""}</div></div>`;
}
function bTxt(si,qi,k,v){const q=bT().sections[si].qs[qi];q[k]=v;if((k==='t'&&S.bld.lang==='EN')||(k==='es'&&S.bld.lang==='ES')){const el=document.getElementById('qt'+si+'_'+qi);if(el)el.textContent=v}}
function bAddQ(si){const s=bT().sections[si];s.qs.push({t:"New question",es:"",type:"Numeric scale",req:true,help:"",cond:"Everyone",low:false,data:""});S.bld.sel=[si,s.qs.length-1];render()}
function bMove(si,qi,d){const qs=bT().sections[si].qs,j=qi+d;if(j<0||j>=qs.length)return;[qs[qi],qs[j]]=[qs[j],qs[qi]];S.bld.sel=[si,j];render()}
function bSave(){const t=bT();t.upd="Today";if(t.status==="Starter")t.status="Active";if(S.newCo)D.checklist[2]=true;toast("Draft saved.");render()}
function bPublish(){const t=bT();const live=t.used.filter(c=>C(c)&&["Active","Scheduled"].includes(C(c).status));
 const done=()=>{t.status="Active";t.ver++;t.upd="Today";if(S.newCo)D.checklist[2]=true;closeModal();if(S.returnTo==="wizard"){S.returnTo=null;const w=W();if(w){const r=w.tpl.find(x=>x.t===t.type)||w.tpl[0];if(r)r.id=t.id}nav("wizard");toast(`Published and added to your cycle.`);return}render();toast(`Published v${t.ver}.`)};
 if(!live.length){window._pub=done;openModal(`<h3>Publish ${esc(t.name)}?</h3><p class="dim" style="margin:0 0 12px">It becomes available in cycle setup.${t.sections.some(s=>s.qs.some(q=>!q.es))?" Some questions have no Spanish text yet; Spanish speakers will see English for those.":""}</p><div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" onclick="window._pub()">Publish</button></div>`);return}
 window._pub=done;
 openModal(`<h3>Publish changes to a questionnaire in use</h3><p class="dim" style="margin:0 0 12px">Reviews already started keep the version they began with. Choose what happens to reviews not started yet.</p>
 <div class="warn" style="margin-bottom:12px">Used by ${live.map(c=>`<b>${esc(C(c).name)}</b>`).join(", ")} · 14 reviews not started · 9 in progress</div>
 <div class="choice">${[["Apply to reviews not started","14 reviews switch to v"+(t.ver+1)+"."],["New cycles only","Live cycles keep v"+t.ver+"."]].map((o,i)=>`<label class="ch ${i?"":"on"}"><input type="radio" name="pa" ${i?"":"checked"} onchange="$$('.ch').forEach(x=>x.classList.toggle('on',x.querySelector('input').checked))"><div><div class="t">${o[0]}</div><div class="d">${o[1]}</div></div></label>`).join("")}</div>
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" onclick="window._pub()">Publish v${t.ver+1}</button></div>`)}
function previewTpl(id){
 const t=T(id);if(!t.sections)t.sections=sampleSections(id);
 S.pv=S.pv||{as:"Employee",dev:"Phone",lang:"EN"};const pv=S.pv;
 const qs=t.sections.flatMap(s=>s.qs.map(q=>({...q,s:s.n}))).filter(q=>q.cond==="Everyone"||pv.as!=="Employee");
 const tx=q=>pv.lang==="ES"&&q.es?q.es:q.t;
 const seg=(k,opts)=>`<span class="seg">${opts.map(o=>`<button class="btn xs ${pv[k]===o?"p":""}" onclick="S.pv.${k}='${o}';previewTpl('${id}')">${o}</button>`).join(" ")}</span>`;
 const phone=`<div class="phone"><div class="pbar">${pv.lang==="ES"?"Su evaluación":"Your review"} · ${esc(t.name)}</div><div class="pbody"><div class="prog"><span></span></div><div class="dim sm">${pv.lang==="ES"?"Pregunta 1 de":"Question 1 of"} ${qs.length} · ~${t.min||3} min</div>${qs.slice(0,3).map(q=>`<div><div class="b" style="font-size:16px">${esc(tx(q))}</div>${q.data&&pv.as!=="Employee"?`<span class="datafield" style="margin-top:6px">${q.data}: 486 hrs</span>`:""}${/scale/i.test(q.type)?`<div class="tap" style="margin-top:8px">${[1,2,3,4,5].map(n=>`<span>${n}</span>`).join("")}</div>`:`<div class="inp" style="height:56px;margin-top:8px;display:flex;align-items:flex-end;justify-content:flex-end;padding:6px">🎤</div>`}</div>`).join("")}<button class="btn p" style="width:100%;justify-content:center;height:46px">${pv.lang==="ES"?"Siguiente":"Next"}</button></div></div>`;
 const web=`<div class="card"><div class="bd" style="display:grid;gap:14px">${qs.map((q,i)=>`<div style="border-top:${i?"1px solid var(--line)":"0"};padding-top:${i?12:0}px"><div class="dim sm">${esc(q.s)}</div><div class="b">${i+1}. ${esc(tx(q))}${q.req?' <span class="req">*</span>':""}</div>${q.data&&pv.as!=="Employee"?`<span class="datafield" style="margin-top:6px">${q.data}: 486 hrs</span>`:""}${/scale/i.test(q.type)?`<div class="scale">${[1,2,3,4,5].map(n=>`<span>${n}</span>`).join("")}</div>`:""}</div>`).join("")}</div></div>`;
 openDrawer({title:"Preview · "+esc(t.name),sub:`${t.q||qs.length} questions · ~${t.min||3} min · ${t.langs.join(" + ")}`,w:720,
  body:`<div class="row" style="justify-content:space-between">${seg("as",["Employee","Manager","Peer","Admin"])}${seg("dev",["Phone","Web"])}${seg("lang",["EN","ES"])}</div>
  ${pv.as!=="Employee"?`<div class="note">${pv.as==="Manager"?"Managers see Lumber data beside questions and the context panel (hours, sites, certifications, last score).":pv.as==="Peer"?"Peers see the questions only. Their name is never shown to the employee.":"Admins see every question, including conditional ones."}</div>`:""}
  ${pv.dev==="Phone"?phone:web}`,
  foot:`<button class="btn" onclick="closeLayer()">Close</button><button class="btn p" onclick="closeLayer();${S.view==="wizard"?"":`openBuilder('${id}')`}">${S.view==="wizard"?"Use this questionnaire":"Edit questionnaire"}</button>`});
 if(S.newCo)D.checklist[2]=true;
}
/* ================= V3 LEAN LAYER: review-cycle flow only ================= */
PMNAV.splice(0,PMNAV.length,["home","Overview"],["cycles","Review Cycles"],["templates","Questionnaires"]);
const KEEP=["c1","c2","c3","c4","c5","c6","c7","c9","c10"];
PILL["No reviewer"]="r";PILL["Not shared"]="n";
function init(newCo){
 D=seed();
 D.cycles=D.cycles.filter(c=>KEEP.includes(c.id));
 D.packets=D.packets.filter(p=>KEEP.includes(p.cid));
 D.templates.forEach(t=>t.used=t.used.filter(c=>KEEP.includes(c)));
 S={view:"home",cid:null,tab:"people",q:"",sel:new Set(),newCo:!!newCo,wz:null,tplTab:"Active",cycTab:"Active",quick:"All",menu:null,flt:{},guide:true,calGroup:"Foreman",openMsg:0};
 if(newCo){D.cycles=[];D.packets=[];D.reopenReqs=[];D.activity=[];D.templates=D.templates.filter(t=>t.starter);D.templates.forEach(t=>{t.status="Starter";t.used=[]});}
}
FCATS.cycle={"Crew":()=>D.crews.map(c=>c.name),"Job Site":()=>D.sites,"Reviewer":()=>D.crews.map(c=>c.fm),"Language":()=>["English","Spanish"],"Certification":()=>["Expired","Expiring","All valid"]};
FCATS.cycles={"Pattern":()=>Object.keys(PATTERNS)};

/* ---------- simple status groups ---------- */
const DONE=["Approved","Shared","Acknowledged","Closed"];
const needsAttn=p=>p.exc==="Overdue"||p.noReviewer||["Disputed","Recalled","Reopened","Abandoned"].includes(p.st)||(!E(p.eid).phone&&!E(p.eid).email);
const quickOf=p=>p.exc==="Removed"?"Removed":needsAttn(p)?"Needs attention":DONE.includes(p.st)?"Done":"In progress";
function stageCounts(c){
 const ps=D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed"),n=ps.length;
 const selfOn=ps.filter(p=>p.self.st!=="Off");
 return c.phases.map(ph=>{const k=ph.n.toLowerCase();let d=0,t=n;
  if(k.includes("self")){t=selfOn.length;d=selfOn.filter(p=>p.self.st==="Submitted").length}
  else if(k.includes("manager")){d=ps.filter(p=>p.mgr.st==="Submitted").length}
  else if(k.includes("calibration")){d=ps.filter(p=>DONE.includes(p.st)||["Disputed","Recalled"].includes(p.st)).length}
  else if(k.includes("share")){d=ps.filter(p=>["Shared","Acknowledged","Closed","Disputed"].includes(p.st)).length}
  else if(k.includes("nomination")){d=t}
  return{...ph,d,t}});
}
function stageBar(c){return `<div class="stg">${stageCounts(c).map((s,i)=>`<div class="st2 ${s.st}"><div class="row" style="justify-content:space-between;gap:6px;flex-wrap:nowrap"><span class="nm">${s.st==="done"?"✓ ":""}${s.n}</span><span class="ct tab-num">${s.t?`${s.d}/${s.t}`:""}</span></div><div class="bar ${s.st==="cur"?"b":""}"><span style="width:${s.t?pct(s.d,s.t):0}%"></span></div><div class="dt">${s.s} – ${s.e}</div></div>`).join("")}</div>`}

/* ---------- attention (max 5, one action each) ---------- */
function attention(){
 if(S.newCo)return[];const P=D.packets,it=[];
 const disp=P.filter(p=>p.st==="Disputed");
 if(disp.length)it.push(["r",`${E(disp[0].eid).name} disputed their Q3 results`,`Response due ${disp[0].dispute.due}`,"Resolve",`actDispute(${disp[0].id})`]);
 const nr=P.filter(p=>p.noReviewer&&p.exc!=="Removed");
 if(nr.length)it.push(["r",`${nr.length} people have no reviewer`,"Q4 Field Crew Check-in · their manager left","Use crew foremen","nr_fix()"]);
 const od=P.filter(p=>p.exc==="Overdue");
 if(od.length)it.push(["a",`${od.length} self reviews are overdue`,"Q4 Field Crew Check-in","Remind all",`actRemind([${od.map(p=>p.id)}])`]);
 if(D.reopenReqs.length){const r=D.reopenReqs[0],p=PK(r.pid);if(p)it.push(["a",`${r.by} asked to reopen a review`,`${E(p.eid).name} · Q2 2026`,"Review request","openReopenReq(0)"])}
 const cal=P.filter(p=>p.cid==="c2"&&p.st==="In calibration");
 if(cal.length)it.push(["b",`${cal.length} ratings to check before sharing`,"Q3 Field Crew Check-in · optional outlier check","Check outliers",`nav('cycle',{cid:'c2',tab:'calibration'})`]);
 return it;
}

/* ---------- OVERVIEW ---------- */
const GUIDE=[["Pick questionnaires","Ready-made forms for crews and office, in English and Spanish.","templates","Open questionnaires"],["Create a cycle","Choose who is reviewed, which reviews, and the dates. Launch texts each worker a link.","new","New review cycle"],["Track and fix","See who is done. Remind, extend or change a reviewer in one click.","track","Open Q4 cycle"],["Check and share","Optional outlier check across foremen, then share results by text and collect acknowledgment.","share","Open Q3 outlier check"]];
function guideGo(k){if(k==="templates")return nav("templates");if(k==="new")return startCycle();if(S.newCo)return toast("Available once your first cycle is live.");if(k==="track")return nav("cycle",{cid:"c1",tab:"people",quick:"All"});nav("cycle",{cid:"c2",tab:"calibration"})}
function guideCard(){
 const st=S.newCo?["Next","","",""]:["Done","Done","Now","Now"];
 return `<div class="card guide"><div class="hd"><div><h3>How a review cycle works</h3><div class="dim sm">Four steps. Everything else in the module supports one of them.</div></div>${S.newCo?"":`<button class="link sm" onclick="S.guide=false;render()">Hide</button>`}</div>
 <div class="gsteps">${GUIDE.map((g,i)=>`<button class="gs" onclick="guideGo('${g[2]}')"><span class="gn ${st[i]==="Done"?"done":st[i]?"cur":""}">${st[i]==="Done"?"✓":i+1}</span><span class="gt">${g[0]}</span><span class="gd">${g[1]}</span><span class="link sm">${g[3]} →</span></button>`).join(`<span class="garrow" aria-hidden="true">›</span>`)}</div></div>`;
}
V.home=()=>{
 const att=attention(),act=D.cycles.filter(c=>["Active","Paused"].includes(c.status));
 return `<div class="ph"><div><h1>Performance</h1></div><button class="btn p" onclick="startCycle()">${ic("plus")} New Review Cycle</button></div>
 ${S.guide||S.newCo?guideCard():`<div style="margin-bottom:12px"><button class="link sm" onclick="S.guide=true;render()">Show how it works</button></div>`}
 ${S.newCo?`<div class="card"><div class="empty"><b>No review cycles yet</b>Start with step 1 or 2 above. Most companies launch a first cycle in under 10 minutes using a starter questionnaire.<br><button class="btn p" style="margin-top:14px" onclick="startCycle()">New Review Cycle</button></div></div>`:`
 <div class="grid2l">
 <div class="card"><div class="hd"><h3>Needs your attention</h3><span class="cntpill ${att.length?"r":"g"}">${att.length}</span></div>
  ${att.length?att.map(a=>`<div class="att"><span class="sev ${a[0]}"></span><div class="grow"><div class="t">${a[1]}</div><div class="d">${esc(a[2])}</div></div><button class="btn s" onclick="${a[4]}">${a[3]}</button></div>`).join(""):`<div class="empty"><b>All clear</b>Nothing is blocked or overdue.</div>`}</div>
 <div class="card"><div class="hd"><h3>Live cycles</h3><button class="link sm" onclick="nav('cycles')">All cycles →</button></div>
  ${act.map(c=>{const sc=stageCounts(c),cur=sc.find(s=>s.st==="cur")||sc[sc.length-1];return `<div class="att click" style="cursor:pointer" onclick="nav('cycle',{cid:'${c.id}',tab:'people',quick:'All'})"><div class="grow"><div class="t">${esc(c.name)}</div><div class="d">${cur.n} · ${cur.d} of ${cur.t} done · closes ${cur.e}</div></div><div class="bar b" style="width:110px"><span style="width:${pct(cur.d,cur.t)}%"></span></div></div>`}).join("")}</div>
 </div>`}`;
};

/* ---------- CYCLES LIST ---------- */
V.cycles=()=>{
 const tabs=[["Active",c=>["Active","Paused"].includes(c.status)],["Scheduled",c=>c.status==="Scheduled"],["Drafts",c=>c.status==="Draft"],["Closed",c=>c.status==="Closed"]];
 if(!tabs.some(t=>t[0]===S.cycTab))S.cycTab="Active";
 const pf=((S.flt||{}).cycles||{}).Pattern||[];
 const list=D.cycles.filter(tabs.find(t=>t[0]===S.cycTab)[1]).filter(c=>!S.q||c.name.toLowerCase().includes(S.q.toLowerCase())).filter(c=>!pf.length||pf.includes(c.pattern));
 return `<div class="ph"><div><h1>Review Cycles</h1></div><button class="btn p" onclick="startCycle()">${ic("plus")} New Review Cycle</button></div>
 <div class="tabs ptabs">${tabs.map(t=>`<button class="${S.cycTab===t[0]?"on":""}" onclick="nav('cycles',{cycTab:'${t[0]}'})">${t[0]}<span class="c">${D.cycles.filter(t[1]).length}</span></button>`).join("")}</div>
 <div class="card">${toolbar(`<label class="srch">${ic("search")}<input id="cq" placeholder="Search review cycles" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#cq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label>`)}
 ${list.length?`<div class="tw"><table class="tbl"><thead><tr><th>Name</th><th class="num">People</th><th>Stage</th><th>Progress</th><th></th></tr></thead><tbody>${list.map(c=>{
  const n=D.packets.filter(p=>p.cid===c.id&&p.exc!=="Removed").length,sc=stageCounts(c),cur=sc.find(s=>s.st==="cur");
  return `<tr class="click" onclick="${c.status==="Draft"?`editDraft('${c.id}')`:`nav('cycle',{cid:'${c.id}',tab:'people',quick:'All'})`}"><td><div class="b" style="font-weight:500">${esc(c.name)}</div><div class="dim sm">${esc(c.period)}</div></td><td class="num">${n||"—"}</td>
  <td>${cur?`${cur.n}<div class="dim sm">closes ${cur.e}</div>`:c.status==="Draft"?`<span class="dim">Draft · continue setup</span>`:c.status==="Closed"?`<span class="dim">Closed ${c.closed||""}</span>`:`<span class="dim">Opens ${c.phases[0].s}</span>`}</td>
  <td style="min-width:160px">${cur?`<div class="row" style="gap:8px;flex-wrap:nowrap"><div class="bar b grow"><span style="width:${pct(cur.d,cur.t)}%"></span></div><span class="sm tab-num">${cur.d}/${cur.t}</span></div>`:c.status==="Closed"?`<span class="pill n">Closed</span>`:`<span class="pill n">${c.status}</span>`}</td>
  <td onclick="event.stopPropagation()">${cycleMenu(c)}</td></tr>`}).join("")}</tbody></table></div>${pgFoot(list.length)}`:`<div class="empty"><b>No ${S.cycTab.toLowerCase()} cycles</b><button class="btn s p" style="margin-top:10px" onclick="startCycle()">New Review Cycle</button></div>`}</div>`;
};

/* ---------- CYCLE DETAIL ---------- */
V.cycle=()=>{
 const c=C(S.cid);if(!c)return V.cycles();
 const ps=D.packets.filter(p=>p.cid===c.id),live=ps.filter(p=>p.exc!=="Removed");
 const calN=ps.filter(p=>p.st==="In calibration"||p.st==="Manager submitted").length;
 const tabs=[["people","Employees",live.length]];if(c.calib)tabs.push(["calibration","Outlier check",calN||""]);tabs.push(["settings","Settings"]);
 if(!tabs.some(t=>t[0]===S.tab))S.tab="people";
 const attn=live.filter(needsAttn);
 return `<div class="crumb"><a onclick="nav('cycles')">Review Cycles</a> › <span>${esc(c.name)}</span></div>
 <div class="ph"><div><div class="row"><h1>${esc(c.name)}</h1>${pill(c.status==="Paused"?"Paused":c.status)}</div><div class="sub">${esc(c.period)} · ${live.length} ${live.length===1?"employee":"employees"} · ${c.recurring}</div></div>
 <div class="row">${c.status==="Paused"?`<button class="btn p" onclick="cycResume('${c.id}')">Resume</button>`:""}${cycleMenu(c,true)}</div></div>
 <div class="tabs ptabs">${tabs.map(t=>`<button class="${S.tab===t[0]?"on":""}" onclick="nav('cycle',{cid:'${c.id}',tab:'${t[0]}',quick:'All'})">${t[1]}${t[2]?`<span class="c">${t[2]}</span>`:""}</button>`).join("")}</div>
 ${S.tab==="settings"?"":`<div class="card" style="margin-bottom:16px"><div class="bd">${stageBar(c)}</div></div>`}
 ${S.tab==="people"?cycPeople(c,ps,attn):S.tab==="calibration"?cycCalibration(c,ps):cycSettings(c,ps)}`;
};
function filterPk(ps){
 let r=ps.filter(p=>quickOf(p)===(S.quick==="All"?quickOf(p)==="Removed"?"x":quickOf(p):S.quick));
 if(S.q)r=r.filter(p=>E(p.eid).name.toLowerCase().includes(S.q.toLowerCase()));
 const ff=(S.flt||{}).cycle||{},has=k=>ff[k]&&ff[k].length;
 if(has("Crew"))r=r.filter(p=>ff.Crew.includes(crewName(E(p.eid).crew)));
 if(has("Job Site"))r=r.filter(p=>{const e=E(p.eid);return ff["Job Site"].some(x=>e.sites.includes(x)||e.site===x)});
 if(has("Reviewer"))r=r.filter(p=>ff.Reviewer.includes(p.mgr.by));
 if(has("Language"))r=r.filter(p=>ff.Language.includes(E(p.eid).lang==="ES"?"Spanish":"English"));
 if(has("Certification"))r=r.filter(p=>{const c=E(p.eid).certs;return ff.Certification.some(x=>x==="Expired"?c.some(y=>y.s==="expired"):x==="Expiring"?c.some(y=>y.s==="expiring"):c.every(y=>y.s==="active"))});
 return r;
}
function cycPeople(c,ps,attn){
 const Q=["All","Needs attention","In progress","Done"];if(ps.some(p=>p.exc==="Removed"))Q.push("Removed");
 if(!Q.includes(S.quick))S.quick="All";
 const cnt=q=>q==="All"?ps.filter(p=>p.exc!=="Removed").length:ps.filter(p=>quickOf(p)===q).length;
 const rows=empSorted(filterPk(ps)),sel=[...S.sel].filter(id=>rows.some(p=>p.id===id)),selP=sel.map(PK),pk="emp-"+c.id+"-"+S.quick;
 return `${attn.length&&S.quick!=="Needs attention"?`<div class="warn row" style="margin-bottom:14px"><span class="grow"><b>${attn.length} ${attn.length>1?"employees need":"employee needs"} attention</b> · ${[["no reviewer",attn.filter(p=>p.noReviewer).length],["overdue",attn.filter(p=>p.exc==="Overdue").length],["can't be reached",attn.filter(p=>!E(p.eid).phone&&!E(p.eid).email).length],["disputed",attn.filter(p=>p.st==="Disputed").length],["being corrected",attn.filter(p=>["Recalled","Reopened"].includes(p.st)).length]].filter(x=>x[1]).map(x=>x[1]+" "+x[0]).join(" · ")}</span><button class="btn s" onclick="S.quick='Needs attention';render()">Show them</button></div>`:""}
 <div class="card"><div class="tools"><div class="row"><div class="seg2">${Q.map(q=>`<button class="${S.quick===q?"on":""}" onclick="S.quick='${q}';S.sel=new Set();render()">${q} <span>${cnt(q)}</span></button>`).join("")}</div></div>
 <div class="row"><label class="srch" style="width:260px">${ic("search")}<input id="rq" placeholder="Search employees" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#rq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label><button class="btn" onclick="openFilters()">${ic("filter")} Filters${fCount()?` · ${fCount()}`:""}</button><button class="btn" onclick="addPeople('${c.id}')">${ic("plus")} Add</button></div></div>
 ${sel.length?`<div class="bulk"><b>${sel.length} selected</b><span style="flex:1"></span><button class="btn" onclick="actRemind([${sel}])">Remind</button><button class="btn" onclick="actExtend([${sel}])">Extend</button><button class="btn" onclick="actReassign([${sel}])">Change reviewer</button>${selP.some(p=>p.st==="Approved")?`<button class="btn" onclick="actShare([${selP.filter(p=>p.st==="Approved").map(p=>p.id)}])">Share</button>`:""}<button class="btn" onclick="actRemove([${sel}])">Remove</button><button class="btn" style="border-color:transparent" onclick="S.sel=new Set();render()">Clear</button></div>`:""}
 ${rows.length?`<div class="tw"><table class="tbl"><thead><tr><th class="cbx"><input type="checkbox" aria-label="Select all" ${sel.length&&sel.length===rows.length?"checked":""} onchange="S.sel=new Set(this.checked?[${rows.map(p=>p.id)}]:[]);render()"></th>${["Employee","Reviewer","Status","Due"].map(sortTh).join("")}<th>Next step</th></tr></thead><tbody>
 ${pgRows(rows,pk).map(p=>{const e=E(p.eid),a0=nextStep(p).a[0],at=needsAttn(p);
  return `<tr class="click ${S.sel.has(p.id)?"sel":""}" onclick="openPacket(${p.id})"><td class="cbx" onclick="event.stopPropagation()"><input type="checkbox" aria-label="Select ${esc(e.name)}" ${S.sel.has(p.id)?"checked":""} onchange="this.checked?S.sel.add(${p.id}):S.sel.delete(${p.id});render()"></td>
  <td><div class="who"><span class="rdot" style="visibility:${at?"visible":"hidden"}"></span>${av(e.name)}<div style="min-width:0"><div class="n" style="font-weight:500">${esc(e.name)}</div><div class="s">${crewName(e.crew)}</div></div></div></td>
  <td>${p.mgr.by?esc(p.mgr.by):`<span style="color:var(--red)">None</span>`}</td>
  <td>${pill(empStatus(p))}</td>
  <td class="tab-num">${DONE.includes(p.st)?'<span class="dim">—</span>':p.due}</td>
  <td onclick="event.stopPropagation()">${a0?`<button class="btn xs" onclick="${a0.f.replace(/"/g,"&quot;")}">${a0.l}</button>`:""}</td></tr>`}).join("")}
 </tbody></table></div>${pgFoot(rows.length,pk)}`:`<div class="empty"><b>No employees here</b><button class="link" onclick="S.quick='All';S.q='';S.flt.cycle={};render()">Show all employees</button></div>`}</div>`;
}
/* employees table sorting: click a header to sort ascending, again for descending. Empty values (no reviewer, no due date) always go last. */
const empStatus=p=>p.exc==="Overdue"?"Overdue":p.noReviewer?"No reviewer":p.exc||p.st;
const empDue=p=>{if(DONE.includes(p.st)||!p.due)return null;const t=Date.parse(/\d{4}/.test(p.due)?p.due:p.due+", 2026");return isNaN(t)?null:t};
const EMP_SORT={Employee:p=>E(p.eid).name.toLowerCase(),Reviewer:p=>(p.mgr.by||"").toLowerCase()||null,Status:p=>empStatus(p).toLowerCase(),Due:empDue};
function empSorted(rows){const s=S.empSort;if(!s||!EMP_SORT[s.k])return rows;const f=EMP_SORT[s.k];
 return [...rows].sort((a,b)=>{const x=f(a),y=f(b);if(x===y)return 0;if(x==null)return 1;if(y==null)return -1;return (x<y?-1:1)*s.dir})}
function empSort(k){const s=S.empSort;S.empSort=s&&s.k===k?{k,dir:-s.dir}:{k,dir:1};Object.keys(S.pg||{}).forEach(x=>{if(x.startsWith("emp-"))S.pg[x].p=1});render();const b=document.querySelector(`.th-sort[data-k="${k}"]`);if(b)b.focus()}
function sortTh(k){const s=S.empSort,on=s&&s.k===k,dir=on?(s.dir>0?"ascending":"descending"):"none";
 return `<th aria-sort="${dir}"><button type="button" class="th-sort ${on?"on":""}" data-k="${k}" onclick="empSort('${k}')">${k}<svg class="th-sort-i" viewBox="0 0 12 12" aria-hidden="true"><path class="up ${on&&s.dir>0?"on":""}" d="M6 2 9 5H3z"/><path class="dn ${on&&s.dir<0?"on":""}" d="M6 10 3 7h6z"/></svg></button></th>`}
function cycSettings(c,ps){
 const n=ps.filter(p=>p.exc!=="Removed").length;
 const rows=[["Reviews",c.types.join(", ")],["Questionnaires",c.tpls.map(t=>T(t)?T(t).name:"").join(", ")],["Reviewers",c.model],["Before sharing",[c.calib&&"Calibration",c.approval&&"Approval"].filter(Boolean).join(" + ")||"Nothing, share directly"],["After sharing",c.ack?"Employee acknowledges receipt":"No acknowledgment"],["Repeats",c.recurring]];
 return `<div class="card"><div class="hd"><h3>Cycle settings</h3><span class="dim sm">Changes show who they affect before saving</span></div>${rows.map(r=>`<div class="pol"><div class="t">${r[0]}</div><div class="row" style="justify-content:space-between"><span>${esc(r[1])}</span>${c.status==="Closed"?"":`<button class="btn xs" onclick="editCycSetting('${r[0]}',${n})">Edit</button>`}</div></div>`).join("")}</div>
 <div class="row" style="margin-top:12px"><button class="link sm" onclick="activityLog('${c.id}')">View activity log</button></div>`;
}
function activityLog(cid){const ev=D.packets.filter(p=>p.cid===cid).flatMap(p=>p.hist.map(h=>({...h,n:E(p.eid).name}))).reverse().slice(0,40);
 openDrawer({title:"Activity log",sub:C(cid).name+" · every change, with who and when",w:640,body:`<div class="card"><div class="bd feed">${ev.map(h=>`<div class="ev"><span class="dot ${h.c}"></span><div><b>${esc(h.n)}</b> · ${esc(h.txt)}<div class="m">${h.t} · ${esc(h.who)}</div></div></div>`).join("")}</div></div>`,foot:`<button class="btn" onclick="toast('Audit log exported.')">${ic("down","s")} Export</button><button class="btn p" onclick="closeLayer()">Done</button>`})}

/* ---------- PACKET DRAWER (simple) ---------- */
function openPacket(id){
 if(S.pkLast!==id){S.pkTab="Overview";S.pkLast=id}
 const p=PK(id),e=E(p.eid),c=cycOf(p),ns=nextStep(p);
 const step=(name,who,st,acts)=>{const done=["Submitted","Shared","Acknowledged","Closed"].includes(st),off=st==="Off";return off?"":`<div class="tk ${done?"done":["Not started","Not shared"].includes(st)?"":"cur"}"><span class="tdot">${done?"✓":""}</span><div class="grow"><div class="b" style="font-weight:500">${name}</div><div class="dim sm">${esc(who)}</div></div>${pill(st)}${acts.map(a=>`<button class="btn xs" onclick="${a[1]}">${a[0]}</button>`).join("")}</div>`};
 const res=DONE.includes(p.st)||["Disputed","Recalled"].includes(p.st)?(p.st==="Approved"?"Not shared":p.st):"Not shared";
 const cert=e.certs.filter(x=>x.s!=="active");
 const ov=`<div class="nextbox"><div class="k">Next step</div><div class="t">${ns.t}</div><div class="row">${ns.a.map(a=>`<button class="btn s ${a.k}" onclick="${a.f.replace(/"/g,"&quot;")}">${a.l}</button>`).join("")}</div></div>
 ${p.dispute&&p.st==="Disputed"?`<div class="bad"><b>${e.name} wrote:</b> "${esc(p.dispute.text)}"</div>`:""}
 <div class="card"><div class="hd"><h3>Progress</h3><span class="dim sm">Due ${p.due}</span></div><div class="bd">
  ${step("Self review",e.name+(e.lang==="ES"?" · Spanish":""),p.self.st==="Overdue"?"Overdue":p.self.st,p.self.st==="Submitted"?[["View",`viewForm(${p.id},'self')`]]:p.self.st==="Off"?[]:[["Remind",`actRemind([${p.id}])`]])}
  ${step("Manager review",p.mgr.by||"No reviewer yet",p.mgr.by?p.mgr.st:"No reviewer",p.mgr.st==="Submitted"?[["View",`viewForm(${p.id},'mgr')`]]:p.mgr.by?[["Change",`actReassign([${p.id}])`]]:[["Assign",`actFixReviewer(${p.id})`]])}
  ${p.contrib.map(x=>step("Other foreman's notes",`${x.by} · ${x.hrs} hrs together`,x.st,[])).join("")}
  ${p.peers.length?step("Peer reviews",`${p.peers.filter(x=>x.st==="Submitted").length} of ${p.peers.length} in · anonymous`,p.peers.every(x=>x.st==="Submitted")?"Submitted":"In progress",[]):""}
  ${step("Results",p.rating?`Rating ${p.adj||p.rating} · ${D.settings.levels[(p.adj||p.rating)-1]}${p.adj?` (calibrated from ${p.rating})`:""}`:"Shared after "+(c.calib?"calibration":"manager review"),res,[])}
 </div></div>
 ${cert.length?`<div class="warn">${ic("cert","s")} ${cert.map(x=>`${x.n} ${x.s==="expired"?"expired":"expires"} ${x.d}`).join(" · ")}. The manager sees this while reviewing${cert.some(x=>x.s==="expired")?" and must acknowledge it":""}.</div>`:""}`;
 const hi=`<div class="card"><div class="bd feed">${[...p.hist].reverse().map(h=>`<div class="ev"><span class="dot ${h.c}"></span><div>${esc(h.txt)}<div class="m">${h.t} · ${esc(h.who)}</div></div></div>`).join("")}</div></div>`;
 openDrawer({label:"Review",avatar:initials(e.name),title:esc(e.name),sub:`${e.title} · ${crewName(e.crew)} · ${esc(c.name)}`,w:720,
  tabs:`<div class="dtabs">${["Overview","History"].map(t=>`<button class="${S.pkTab===t?"on":""}" onclick="S.pkTab='${t}';openPacket(${p.id})">${t}</button>`).join("")}</div>`,
  body:S.pkTab==="History"?hi:ov,hist:`S.pkTab='History';openPacket(${p.id})`,
  foot:`${p.exc==="Removed"?`<button class="btn" onclick="actRestore(${p.id})">Restore</button>`:`<button class="btn d" onclick="actRemove([${p.id}])">Remove</button>`}<span style="flex:1"></span><button class="btn" onclick="toast('PDF downloaded.')">${ic("down","s")} PDF</button><button class="btn p" onclick="closeLayer()">Done</button>`});
 S.pkOpen=id;
}

/* ---------- WIZARD: 4 steps ---------- */
const WS=["Who and when","Reviews","Timeline","Review and launch"];
function startCycle(pattern){S.wz=newWz(pattern||"Quarterly crew check-in");nav("wizard")}
function wzPattern(k){const name=W().name,keep=W().id;S.wz=newWz(k);S.wz.id=keep;render()}
function wzIssues(){
 const w=W(),pool=wzCount(),out=[];
 if(!w.name.trim())out.push({b:1,step:0,t:"Add a cycle name",fix:[["Go to step 1","wzGo(0)"]]});
 if(!pool.length)out.push({b:1,step:0,t:"No one matches who is reviewed",fix:[["Edit who","wzGo(0)"]]});
 if(!Object.values(w.types).some(Boolean))out.push({b:1,step:1,t:"Turn on at least one review",fix:[["Go to reviews","wzGo(1)"]]});
 const nr=pool.filter(e=>e.name==="Hector Cruz"||e.name==="Omar Haddad");
 if(nr.length&&!w.nrFixed)out.push({b:1,step:1,t:`${nr.length} people have no reviewer`,d:nr.map(e=>e.name).join(", ")+" · their manager left",fix:[["Use crew foremen","W().nrFixed=true;render();toast('Crew foremen assigned.')"]]});
 const nc=pool.filter(e=>!e.phone&&!e.email);
 if(nc.length&&!w.ncFixed)out.push({b:0,step:0,t:`${nc.length} ${nc.length===1?"worker has":"workers have"} no phone or email`,d:nc.map(e=>e.name).join(", "),fix:[["Use site kiosk","W().ncFixed=true;render();toast('They can use the site kiosk with their PIN.')"],["Fix later","W().ncFixed=true;render()"]]});
 return out;
}
V.wizard=()=>{
 const w=W();if(!w)return V.cycles();wzCollect();if(w.step>3)w.step=3;
 const iss=wzIssues(),pool=wzCount();
 const body=[wzWho,wzReviews,wzTimeline,wzReview][w.step](w,pool,iss);
 return `<div class="crumb"><a onclick="wzLeave()">Review Cycles</a> › <span>${w.id&&C(w.id)?"Edit draft":"New review cycle"}</span></div>
 <div class="ph"><div><h1>${w.id&&C(w.id)?esc(w.name):"New Review Cycle"}</h1><div class="sub">${w.saved?"Draft saved":"Nothing is sent until you launch"}</div></div><div class="row"><button class="btn" onclick="wzSave()">Save draft</button><button class="btn ghost" onclick="wzLeave()">Exit</button></div></div>
 <div class="hsteps">${WS.map((s,i)=>`<button class="${i===w.step?"on":i<w.step?"done":""}" onclick="wzGo(${i})"><span class="n">${i<w.step?"✓":i+1}</span>${s}${iss.some(x=>x.b&&x.step===i)&&i!==w.step?' <span style="color:var(--red)">•</span>':""}</button>`).join("")}</div>
 <div class="wzbox"><div class="card">${body}</div>
 <div class="wzfoot"><button class="btn" ${w.step?"":"hidden"} onclick="wzGo(${w.step-1})">${ic("back","s")} Back</button><span></span>${w.step<3?`<button class="btn p" onclick="wzGo(${w.step+1})">Next: ${WS[w.step+1]}</button>`:""}</div></div>`;
};
function wzWho(w,pool){
 return `<div class="sec"><h4>Start from</h4><div class="row">${["Quarterly crew check-in","Annual","90-day new hire","Ad hoc"].map(k=>`<button class="chip2 ${w.pattern===k?"on":""}" onclick="wzPattern('${k}')">${k}</button>`).join("")}</div><div class="fd">Fills in sensible defaults. You can change anything.</div></div>
 <div class="sec"><label class="fl" for="wName">Cycle name</label><input class="inp" id="wName" value="${esc(w.name)}" oninput="W().name=this.value" style="max-width:480px"></div>
 <div class="sec"><h4>Who is reviewed</h4><div class="row">${w.filters.map((f,i)=>`<span class="tag x" title="Remove" onclick="W().filters.splice(${i},1);render()"><b>${f.k}:</b> ${esc(f.v)} ✕</span>`).join("")}<select class="inp w" style="height:32px;font-size:14px" onchange="if(this.value)addFilter(this.value)"><option value="">+ Add filter</option>${["Department","Job site","Crew","Trade","Employee type","Union status","Hours worked","Hire date"].map(a=>`<option>${a}</option>`).join("")}</select></div>
  <div class="row" style="margin-top:12px"><b style="font-size:20px">${pool.length} people</b><button class="link sm" onclick="peopleList()">See list</button>${w.excl.length?`<span class="dim sm">· ${w.excl.length} excluded</span>`:""}</div>
  <label class="opt" style="margin-top:10px"><input type="checkbox" ${w.auto?"checked":""} onchange="W().auto=this.checked"> Add new people who match automatically (after 30 days)</label></div>
 <div class="sec"><h4>When</h4><div class="f2" style="max-width:640px"><div><label class="fl" for="wStart">Review period start</label><input class="inp" id="wStart" value="${esc(w.start)}"></div><div><label class="fl" for="wEnd">Review period end</label><input class="inp" id="wEnd" value="${esc(w.end)}"></div></div>
  <div style="max-width:310px;margin-top:12px"><label class="fl">Repeats</label><select class="inp" onchange="W().recur=this.value">${["One time","Every quarter","Every 6 months","Every year","Rolling (hire date)"].map(o=>`<option ${w.recur===o?"selected":""}>${o}</option>`).join("")}</select></div></div>`;
}
function peopleList(){const pool=wzCount();openDrawer({title:`${pool.length} people`,sub:"Matching who is reviewed. Exclude anyone with a reason.",w:620,body:`<div class="card"><table class="tbl"><thead><tr><th>Name</th><th>Crew</th><th></th></tr></thead><tbody>${pool.map(e=>`<tr><td>${e.name}</td><td>${crewName(e.crew)}</td><td><button class="btn xs" onclick="closeLayer();wzExclude('${e.name}')">Exclude</button></td></tr>`).join("")}</tbody></table></div>${W().excl.length?`<div class="card"><div class="hd"><h3>Excluded</h3></div><div class="bd">${W().excl.map((x,i)=>`<div class="form-row"><b class="grow">${x.n}</b><span class="dim sm">${esc(x.r)}</span><button class="btn xs" onclick="W().excl.splice(${i},1);peopleList();render()">Add back</button></div>`).join("")}</div></div>`:""}`,foot:`<button class="btn p" onclick="closeLayer()">Done</button>`})}
const RTYPES=[["Self","Self review","Employee reviews themselves. Field workers get a short form by text."],["Manager","Manager review","Their manager in Lumber. If they worked several job sites, the foreman with the most hours."],["Contributor","Other foremen","Foremen who worked 40+ hrs with them add short notes."],["Peer","Peer review","Coworkers review them. Anonymous, shown after 3 responses."]];
const tplFor=t=>({Self:"t1",Manager:"t2",Contributor:"t3",Peer:"t4"})[t];
function wzReviews(w,pool,iss){
 const nr=iss.find(x=>x.t.includes("no reviewer"));
 return `<div class="sec"><h4>Which reviews</h4><div class="sd">Each review uses a questionnaire from your library.</div>
 <div class="card">${RTYPES.map(r=>{const on=w.types[r[0]];const row=w.tpl.find(x=>x.t===r[0]);const opts=D.templates.filter(t=>t.status!=="Archived"&&(t.type.includes(r[0])||(t.type==="Self + Manager"&&["Self","Manager"].includes(r[0]))));
  return `<div class="pol" style="grid-template-columns:minmax(0,1fr) 300px"><label class="opt" style="align-items:center"><span class="sw"><input type="checkbox" ${on?"checked":""} onchange="wzType('${r[0]}',this.checked)"><span></span></span><div><div class="t">${r[1]}</div><div class="d">${r[2]}</div></div></label>
  ${on?`<div class="row" style="flex-wrap:nowrap"><select class="inp" onchange="wzTpl('${r[0]}',this.value)">${opts.map(o=>`<option value="${o.id}" ${row&&row.id===o.id?"selected":""}>${o.name}</option>`).join("")}</select><button class="btn xs" onclick="previewTpl('${row?row.id:tplFor(r[0])}')">Preview</button></div>`:`<span class="dim sm">Off</span>`}</div>`}).join("")}</div></div>
 <div class="sec"><h4>Reviewers</h4><div class="sd">Taken from Lumber reporting lines. You only need to fix exceptions.</div>
  ${nr?`<div class="bad row"><span class="grow"><b>${nr.t}</b> · ${esc(nr.d)}</span><button class="btn s" onclick="W().nrFixed=true;render();toast('Crew foremen assigned.')">Use crew foremen</button></div>`:`<div class="ok">Everyone has a reviewer.</div>`}
  <button class="link sm" style="margin-top:10px" onclick="reviewerMap()">See or change reviewers</button></div>
 <div class="sec"><h4>Rating</h4><select class="inp" style="max-width:310px" onchange="W().rating=this.value">${["Numeric 1–5 with definitions","Stars","Named levels","Written answers only"].map(o=>`<option ${w.rating===o?"selected":""}>${o}</option>`).join("")}</select></div>`;
}
function wzType(t,on){const w=W();w.types[t]=on;if(on&&!w.tpl.some(x=>x.t===t))w.tpl.push({g:"Everyone",t,id:tplFor(t)});if(!on)w.tpl=w.tpl.filter(x=>x.t!==t);render()}
function wzTpl(t,id){const r=W().tpl.find(x=>x.t===t);if(r)r.id=id;render()}
function reviewerMap(){const w=W(),pool=wzCount();openDrawer({title:"Reviewers",sub:"Suggested from Lumber reporting lines and shared hours. Change any row; use Export for large lists.",w:760,
 body:`<div class="card"><div class="tools"><label class="srch" style="width:260px">${ic("search")}<input placeholder="Search people"></label><button class="btn s" onclick="toast('Exported. Re-import the edited sheet to update many reviewers at once.')">${ic("down","s")} Export / import</button></div><table class="tbl"><thead><tr><th>Employee</th><th>Reviewer</th></tr></thead><tbody>${pool.slice(0,12).map(e=>{const miss=(e.name==="Hector Cruz"||e.name==="Omar Haddad")&&!w.nrFixed;return `<tr><td>${e.name}<div class="dim sm">${crewName(e.crew)}${e.sites.length>1?" · 2 job sites":""}</div></td><td><select class="inp" style="height:36px${miss?";border-color:var(--red)":""}">${miss?"<option>Choose reviewer…</option>":""}${D.emps.filter(x=>x.isMgr).map(x=>`<option ${!miss&&x.name===e.mgr?"selected":""}>${x.name}</option>`).join("")}</select></td></tr>`}).join("")}</tbody></table>${pgFoot(pool.length)}</div>`,
 foot:`<button class="btn" onclick="closeLayer()">Cancel</button><button class="btn p" onclick="W().nrFixed=true;closeLayer();render();toast('Reviewers saved.')">Save</button>`})}
function wzTimeline(w){
 return `<div class="sec"><h4>Phases</h4><div class="sd">When each review opens and closes. Phases can overlap.</div>
 <div class="tw" style="max-width:720px"><table class="tbl"><thead><tr><th>Phase</th><th>Opens</th><th>Closes</th></tr></thead><tbody>${w.phases.map((p,i)=>`<tr><td>${p.n}</td><td><input class="inp" id="ps${i}" value="${esc(p.s)}" style="height:36px"></td><td><input class="inp" id="pe${i}" value="${esc(p.e)}" style="height:36px"></td></tr>`).join("")}</tbody></table></div>
 <label class="opt" style="margin-top:12px"><input type="checkbox" ${w.gate?"checked":""} onchange="W().gate=this.checked"> Open each manager review as soon as that person's self review is in</label></div>
 <div class="sec"><h4>Reminders</h4><div class="row"><span>Texts 3 days before and on the due date. Overdue reviews go to the reviewer's manager.</span><button class="link sm" onclick="S.remOpen=!S.remOpen;render()">${S.remOpen?"Hide":"Change"}</button></div>
  ${S.remOpen?`<div class="row" style="margin-top:10px">${[7,3,1,0].map(d=>`<label class="tag" style="padding:6px 10px;cursor:pointer"><input type="checkbox" ${w.rem[d]?"checked":""} onchange="W().rem[${d}]=this.checked"> ${d?d+" days before":"On due date"}</label>`).join("")}</div><label class="opt" style="margin-top:8px"><input type="checkbox" ${w.escalate?"checked":""} onchange="W().escalate=this.checked"> Escalate overdue reviews</label>`:""}</div>`;
}
function wzReview(w,pool,iss){
 const blocking=iss.filter(x=>x.b);
 const rows=[["Who",`${pool.length} people${w.auto?" · new matches added automatically":""}`,0],["When",`${w.start} – ${w.end} · ${w.recur}`,0],["Reviews",(w.roles&&typeof ROLES!=="undefined")?ROLES.filter(x=>w.roles[x.k].on).map(x=>x.n).join(", "):RTYPES.filter(r=>w.types[r[0]]).map(r=>r[1]).join(", "),1],["Overall rating",(typeof RATING_FMT!=="undefined"&&(RATING_FMT.find(f=>f.k===w.rating)||{}).n)||w.rating,1],["Timeline",`${w.phases.length} phases · first closes ${w.phases[0]?w.phases[0].e:""}`,2]];
 return `<div class="sec"><h4>Summary</h4>${rows.map(r=>`<div class="pol" style="grid-template-columns:160px minmax(0,1fr) auto"><span class="dim">${r[0]}</span><span>${esc(r[1])}</span><button class="link sm" onclick="wzGo(${r[2]})">Edit</button></div>`).join("")}</div>
 <div class="sec"><div class="row" style="justify-content:space-between"><div><h4>Results and privacy</h4><div class="sd" style="margin:0">Using your company defaults.</div></div><button class="link sm" onclick="S.resOpen=!S.resOpen;render()">${S.resOpen?"Done":"Change"}</button></div>
  ${S.resOpen?`<div class="fg" style="margin-top:12px">
   <label class="opt"><input type="checkbox" ${w.calib?"checked":""} onchange="W().calib=this.checked"> Outlier check before sharing (optional: flags ratings far from the crew norm)</label>
   <label class="opt"><input type="checkbox" ${w.ack?"checked":""} onchange="W().ack=this.checked"> Employee acknowledges receipt</label>
   <label class="opt"><input type="checkbox" ${w.approval?"checked":""} onchange="W().approval=this.checked"> Approval before sharing</label>
   <div class="f2" style="max-width:640px"><div><label class="fl">Manager sees self review</label><select class="inp" onchange="W().selfVis=this.value">${["After reviewer submits","Hidden until cycle end","During review"].map(o=>`<option ${w.selfVis===o?"selected":""}>${o}</option>`).join("")}</select></div><div><label class="fl">Employee sees results</label><select class="inp" onchange="W().results=this.value">${["After cycle closes","As soon as their reviews are in","Never"].map(o=>`<option ${w.results===o?"selected":""}>${o}</option>`).join("")}</select></div></div></div>`
  :`<ul class="plain">${[w.calib&&"Ratings are calibrated before sharing",w.ack&&"Employees acknowledge receipt (not agreement)","Managers see the self review after they submit","Peer feedback is anonymous"].filter(Boolean).map(x=>`<li>${x}</li>`).join("")}</ul>`}</div>
 <div class="sec"><h4>Before you launch</h4>${iss.length?iss.map(x=>`<div class="att" style="padding:10px 0"><span class="sev ${x.b?"r":""}"></span><div class="grow"><div class="t">${x.t}</div>${x.d?`<div class="d">${esc(x.d)}</div>`:""}</div>${x.fix.map((f,i)=>`<button class="btn xs ${i?"":"p"}" onclick="${f[1].replace(/"/g,"&quot;")}">${f[0]}</button>`).join("")}</div>`).join(""):`<div class="ok">All set. ${pool.length} people will get a text with their review link.</div>`}</div>
 <div class="sec row" style="justify-content:flex-end"><button class="btn" onclick="wzSave()">Save draft</button><button class="btn p" ${blocking.length?'aria-disabled="true"':""} onclick="${blocking.length?`toast('Fix ${blocking.length} item${blocking.length>1?"s":""} above first.')`:"wzLaunchGo()"}">Launch cycle</button></div>`;
}

/* ---------- SETTINGS (lean) ---------- */
const POLS=[["Review defaults","Every cycle uses these. Change them here to change them for all cycles.",[["selfVis","Reviewer sees self review",["After reviewer submits","Hidden until cycle end","During review"]],["results","Reviewee sees results",["After cycle closes","As soon as their reviews are in","Never"]]]]];
V.settings=()=>{
 const st=D.settings,SN=["Time Tracking","Expenses","Payroll","Onboarding","HR","Performance","Company Info","API Integration","Form I-9","Org Chart"];
 const MSG=[["Review to Complete","Sent to a reviewer when a review opens.","Your {cycleName} review for {employeeName} is ready. Open: {link} · Due {dueDate}"],["Self Review Ready","Sent to an employee when their self review opens.","Your {cycleName} is ready. Takes about 3 minutes. Open: {link} · Due {dueDate}"],["Reminder","Sent before the due date to anyone with an open review.","Reminder: your {cycleName} review is due {dueDate}. Open: {link}"],["Results Ready","Sent when results are shared.","Your {cycleName} results are ready. Please confirm you received them: {link}"]];
 const chipify=t=>esc(t).replace(/\{(\w+)\}/g,'<span class="vchip">$1</span>');
 return `<div class="setwrap"><h1>Settings</h1><div class="setgrid">
 <nav class="setnav">${SN.map(x=>`<button class="${x==="Performance"?"on":""}" onclick="${x==="Performance"?"":`toast('${x} settings are unchanged.')`}">${x}${x==="Performance"?' <span class="new">NEW</span>':""}</button>`).join("")}</nav>
 <div class="setbody"><h2>Performance</h2><div class="sd0">Company defaults for review cycles. Saved changes apply to new cycles; live cycles are changed from each cycle's Settings tab.</div>
 <div class="setsec"><div><h3>Rating Scale</h3><div class="sd">Level names for each rating format. Used by every cycle and questionnaire that rates.</div></div><div class="set-scales">${(()=>{const F=[["levels","Numbers (1–5)",i=>`<span class="rx-num n${i+1}">${i+1}</span>`],["starLevels","Stars (1–5)",i=>`<span class="cs-stars" aria-hidden="true">${[0,1,2,3,4].map(j=>`<span class="${j<=i?"on":""}">${j<=i?"★":"☆"}</span>`).join("")}</span>`]],[key,lbl,badge]=F.find(f=>f[0]===(S.setScale||"levels"));
  return `${btnGroup(F.map(f=>({id:f[0],label:f[1]})),{active:key,label:"Rating format",onSelect:id=>`S.setScale='${id}';render()`})}
  <div class="card">${(st[key]||st.levels).map((l,i)=>`<div class="pol set-lvl">${badge(i)}<input class="inp" value="${esc(l)}" onchange="D.settings.${key}[${i}]=this.value;toast('Rating scale saved.')" aria-label="${lbl}, level ${i+1} name"></div>`).join("")}</div>`})()}</div></div>
 ${POLS.map(g=>`<div class="setsec"><div><h3>${g[0]}</h3><div class="sd">${g[1]}</div></div><div><div class="card set-pols">${g[2].map(p=>`<div class="pol"><div class="t">${p[1]}</div><select class="inp" onchange="D.settings['${p[0]}']=this.value;toast('Saved. Applies to all cycles.')">${p[2].map(o=>`<option ${String(st[p[0]])===o?"selected":""}>${o}</option>`).join("")}</select></div>`).join("")}</div></div></div>`).join("")}
 <div class="setsec" style="border-bottom:0"><div><h3>Employee Communication</h3><div class="sd">Text and email messages, in English and Spanish.</div></div><div><div class="acc">${MSG.map((m,i)=>{const open=S.openMsg===i;return `<div class="ai ${open?"open":""}"><div class="ah" onclick="S.openMsg=${open?-1:i};render()"><span class="cv"></span><div class="grow"><b>${m[0]}</b><span class="d">${m[1]}</span></div></div>${open?`<div class="ab"><div style="margin-bottom:10px">Hi <span class="vchip">User</span> , ${chipify(m[2])}</div><textarea class="inp" style="height:96px">${esc(m[2])}</textarea><div class="row" style="margin-top:8px"><label class="opt"><input type="checkbox" checked> Include greetings</label><label class="opt"><input type="checkbox"> Set to default message</label></div></div>`:""}</div>`}).join("")}</div></div></div>
 </div></div></div>`;
};

/* ================= V4: realistic forms, Lumber-app mobile preview, foreman review writing ================= */
const ME="Luis Delgado";
const LV_ES=["Necesita mejorar","En desarrollo","Cumple expectativas","Supera expectativas","Sobresaliente"];
const Q=(t,es,type="Numeric scale",x={})=>({t,es,type,req:x.req!==false,help:x.help||"",hes:x.hes||"",cond:x.cond||"Everyone",low:!!x.low,data:x.data||"",o:x.o||null});
const TPLQ={
 t1:[{n:"Your work this quarter",nes:"Su trabajo este trimestre",qs:[
   Q("How safely did you work this quarter?","¿Qué tan seguro trabajó este trimestre?"),
   Q("How would you rate the quality of your work?","¿Cómo calificaría la calidad de su trabajo?"),
   Q("Did you show up on time and ready to work?","¿Llegó a tiempo y listo para trabajar?","Single select",{o:[["Always","Siempre"],["Most days","La mayoría de los días"],["Some days","Algunos días"],["Rarely","Casi nunca"]]}),
   Q("Which job sites did you work on?","¿En qué obras trabajó?","Multi-select",{data:"Job sites worked",help:"Filled in from your Lumber time cards. Change it if something is missing.",hes:"Llenado con sus tarjetas de tiempo de Lumber.",o:[["Maple Ridge Apartments","Maple Ridge Apartments"],["Riverside Medical Center","Riverside Medical Center"],["Oak Hollow Elementary","Oak Hollow Elementary"],["Harbor Point Retail","Harbor Point Retail"]]})]},
  {n:"Looking ahead",nes:"Mirando hacia adelante",qs:[
   Q("What do you want to get better at?","¿En qué quiere mejorar?","Multi-select",{req:false,o:[["Reading plans","Leer planos"],["Running a crew","Dirigir una cuadrilla"],["Operating equipment","Operar equipo"],["Safety training","Capacitación de seguridad"],["English or Spanish","Inglés o español"]]}),
   Q("Which certification would you like to get next?","¿Qué certificación le gustaría obtener?","Single select",{req:false,o:[["OSHA 30","OSHA 30"],["Fall Protection","Protección contra caídas"],["Forklift Operator","Operador de montacargas"],["First Aid / CPR","Primeros auxilios / RCP"],["None right now","Ninguna por ahora"]]}),
   Q("Anything your foreman should know?","¿Algo que su capataz deba saber?","Paragraph",{req:false,help:"Tap the mic to answer by voice.",hes:"Toque el micrófono para responder con voz."}),
   Q("Sign to confirm these are your answers","Firme para confirmar sus respuestas","E-signature")]}],
 t2:[{n:"Trade skill",qs:[Q("Quality of trade work (cuts, flashing, finish)","","Numeric scale",{low:true}),Q("Reads plans and follows specs without rework","")]},
  {n:"Safety",qs:[Q("Follows safety rules and uses PPE (harness, tie-off, eye protection)","","Numeric scale",{low:true,data:"Incidents logged"}),Q("Safety incidents this quarter","","Single select",{o:[["None","Ninguno"],["Near-miss reported","Casi accidente reportado"],["Recordable incident","Incidente registrable"]]})]},
  {n:"Quality and rework",qs:[Q("Rework or callbacks caused","","Single select",{o:[["None","Ninguno"],["1–2","1–2"],["3 or more","3 o más"]]}),Q("Example of strong work or a miss","","Paragraph",{req:false})]},
  {n:"Attendance and reliability",qs:[Q("On time and ready to work","","Numeric scale",{data:"Attendance this period"}),Q("Reliable when plans change (overtime, site moves)","")]},
  {n:"Teamwork and leadership",qs:[Q("Works well with the crew and other trades",""),Q("Leads others on site","","Numeric scale",{cond:"Foremen and lead hands"})]},
  {n:"Development",qs:[Q("Ready for more responsibility?","","Single select",{o:[["Not yet","Todavía no"],["Ready for lead hand","Listo para líder"],["Ready for foreman","Listo para capataz"]]}),Q("Goals for next quarter","","Paragraph",{req:false,help:"Each goal can become a tracked goal after the review."})]},
  {n:"Overall",qs:[Q("Overall rating","","Numeric scale",{low:true,help:"Your overall view. HR may calibrate it across crews."})]}],
 t3:[{n:"On your job site",qs:[Q("Hours they worked on your site","","Number",{data:"Hours with you"}),Q("Quality of work on your site",""),Q("Safety on your site","","Numeric scale",{low:true}),Q("Anything the primary foreman should know?","","Paragraph",{req:false})]}],
 t4:[{n:"Working with {name}",nes:"Trabajando con {name}",qs:[Q("How well do they work with the crew?","¿Qué tan bien trabaja con la cuadrilla?"),Q("Can you count on them when plans change?","¿Puede contar con esta persona cuando cambian los planes?"),Q("Do they work safely and look out for others?","¿Trabaja con seguridad y cuida a los demás?"),Q("One thing they do well","Algo que hace bien","Short text"),Q("One thing they could do better","Algo que podría mejorar","Short text",{req:false})]}],
 t5:[{n:"Your foreman",nes:"Su capataz",qs:[Q("Explains the plan for the day clearly","Explica claramente el plan del día"),Q("Stops work when something is unsafe","Detiene el trabajo cuando algo no es seguro"),Q("Makes sure we have the tools and materials we need","Se asegura de que tengamos herramientas y materiales"),Q("Treats everyone on the crew fairly","Trata a todos en la cuadrilla con justicia"),Q("Helps me learn new skills","Me ayuda a aprender nuevas habilidades"),Q("What should your foreman keep doing or change?","¿Qué debería seguir haciendo o cambiar su capataz?","Paragraph",{req:false})]}],
 t6:[{n:"Results",qs:[Q("Met the goals set for this year",""),Q("Biggest accomplishment this year","","Paragraph"),Q("Accuracy and quality of work","")]},{n:"Collaboration",qs:[Q("Works well with field teams and other departments",""),Q("Communicates clearly and on time","")]},{n:"Growth",qs:[Q("Skills to build next year","","Multi-select",{req:false,o:[["Estimating software","Software de estimación"],["Project scheduling","Programación de proyectos"],["Leading people","Liderar personas"],["Contract review","Revisión de contratos"]]}),Q("Overall rating","","Numeric scale",{low:true})]}],
 t7:[{n:"First 90 days",qs:[Q("Meeting expectations for the role",""),Q("Completed safety orientation","","Checkbox"),Q("Knows site rules and emergency procedures",""),Q("Shows up on time","","Numeric scale",{data:"Attendance this period"}),Q("Learning the trade at the expected pace",""),Q("Recommend continuing employment?","","Single select",{o:[["Yes","Sí"],["Yes, with conditions","Sí, con condiciones"],["No","No"]]}),Q("Notes for HR","","Paragraph",{req:false})]}],
 t9:[{n:"Leadership",qs:[Q("Runs multiple crews to schedule",""),Q("Keeps sites safe and inspection-ready","","Numeric scale",{low:true}),Q("Develops foremen","")]}],
 t10:[{n:"General",qs:[Q("Overall performance","")]}]};
function sampleSections(kind){return JSON.parse(JSON.stringify(TPLQ[kind]||[{n:"Section 1",qs:[Q("New question","")]}]))}

/* ---------- init (adds role, sections, answers) ---------- */
function init(newCo){
 D=seed();
 D.cycles=D.cycles.filter(c=>KEEP.includes(c.id));
 D.packets=D.packets.filter(p=>KEEP.includes(p.cid));
 D.templates.forEach(t=>{t.used=t.used.filter(c=>KEEP.includes(c));t.sections=sampleSections(t.id);bStats(t)});
 const role=S&&S.role||"admin";
 S={view:role==="foreman"?"myreviews":"home",role,cid:null,tab:"people",q:"",sel:new Set(),newCo:!!newCo,wz:null,tplTab:"Active",cycTab:"Active",quick:"All",menu:null,flt:{},guide:true,calGroup:"Foreman",openMsg:0,mrTab:"To do"};
 const jr=D.packets.find(p=>p.cid==="c1"&&E(p.eid).name==="Jose Ramirez");if(jr)jr.contrib=[{by:ME,st:"Not started",hrs:64}];
 D.packets.forEach(p=>{p.ans={};if(p.mgr.st==="Submitted")p.ans.mgr=autoAns(p,"t2",p.rating||4);if(p.self.st==="Submitted")p.ans.self=autoAns(p,"t1",4);if(p.mgr.st==="In progress"&&p.mgr.by===ME)p.ans.mgr=autoAns(p,"t2",4,5)});
 if(newCo){D.cycles=[];D.packets=[];D.reopenReqs=[];D.activity=[];D.templates=D.templates.filter(t=>t.starter);D.templates.forEach(t=>{t.status="Starter";t.used=[]});}
}
function autoAns(p,tid,r,limit){const a={},secs=TPLQ[tid]||[];let n=0;const txt=["Clean valleys and tight flashing on the Maple Ridge east roof. Zero callbacks.","Get his OSHA 30 and start leading the tear-off crew.","Good week on Riverside; needs to slow down on cleanup."];
 secs.forEach((s,si)=>s.qs.forEach((q,qi)=>{if(limit&&n>=limit)return;n++;const k=si+"_"+qi,v=Math.max(1,Math.min(5,r+((si+qi+p.eid)%3===0?1:(si+qi)%4===0?-1:0)));
  if(/scale/i.test(q.type))a[k]=String(v);else if(q.type==="Single select")a[k]="0";else if(q.type==="Multi-select")a[k]=["0"];else if(q.type==="Paragraph"||q.type==="Short text")a[k]=txt[(si+qi)%3];else if(q.type==="Checkbox")a[k]=true;else if(q.type==="Number")a[k]=String(E(p.eid).hrs>200?96:40);else if(q.type==="E-signature")a[k]=E(p.eid).name}));return a}
function setMode(n){init(n);render()}
function resetDemo(){init(S.newCo);render();toast("Demo data reset.")}
function setRole(r){S.role=r;S.pmOpen=false;closeLayer();nav(r==="foreman"?"myreviews":"home");toast(r==="foreman"?"Viewing as Luis Delgado, foreman of Roofing Crew A.":"Viewing as HR admin.")}

/* ---------- nav with role ---------- */
function navOn(k){return S.view===k||(k==="cycles"&&["cycle","wizard"].includes(S.view))||(k==="templates"&&S.view==="builder")||(k==="myreviews"&&S.view==="write")}
function renderNav(){
 const F=S.role==="foreman",items=F?[["myreviews","My Reviews"]]:PMNAV,n=F?myTodos().length:attention().length;
 $("#pmdd").innerHTML=items.map(x=>`<button class="${navOn(x[0])?"on":""}" onclick="event.stopPropagation();S.pmOpen=false;nav('${x[0]}')">${x[1]}${(x[0]==="home"||x[0]==="myreviews")&&n?`<span class="cnt">${n}</span>`:""}</button>`).join("")+(F?"":`<hr><button onclick="event.stopPropagation();S.pmOpen=false;nav('settings')">Performance Settings</button>`);
 $("#pmdd").hidden=!S.pmOpen;
 if(S.pmOpen){const r=$("#pmNav").getBoundingClientRect();$("#pmdd").style.left=Math.max(8,Math.min(r.left,window.innerWidth-270))+"px";$("#pmdd").style.top=(r.bottom+6)+"px"}
 $("#pmNav").classList.toggle("on",S.view!=="users");$("#resNav").classList.toggle("on",S.view==="users");
 $("#modeSeg").innerHTML=`<span class="dim">Viewing as</span> <button class="btn xs ${F?"":"p"}" onclick="setRole('admin')">HR Admin</button> <button class="btn xs ${F?"p":""}" onclick="setRole('foreman')">Foreman · Luis Delgado</button>${F?"":` <span class="dim" style="margin-left:10px">Company</span> <button class="btn xs ${S.newCo?"":"p"}" onclick="setMode(false)">Running cycles</button> <button class="btn xs ${S.newCo?"p":""}" onclick="setMode(true)">Brand-new</button>`}`;
 const lab=document.querySelector(".proto span");if(lab&&lab.textContent==="Company state:")lab.remove();
}

/* ---------- form field rendering ---------- */
const lvl=(i,L)=>(L==="ES"?LV_ES:D.settings.levels)[i];
function dataNote(q,e){if(!q.data)return"";const v={"Hours this period":`${e.hrs} hrs this quarter`,"Attendance this period":`On time ${58-(e.id%3)} of 60 days`,"Active certifications":e.certs.map(c=>c.n).join(", "),"Incidents logged":D.notes.some(n=>n.eid===e.id&&n.type==="Safety observation")?"1 safety observation (Oct 12) · 0 incidents":"0 incidents logged","Job sites worked":e.sites.join(", "),"Hours with you":"64 hrs on Maple Ridge Apartments"}[q.data]||"";return `<div class="dnote">${ic("chart","s")} From Lumber: ${esc(v)}</div>`}
const qText=(q,L,e)=>(L==="ES"&&q.es?q.es:q.t).replace("{name}",e?e.name.split(" ")[0]:"them");
function field(q,k,v,{L="EN",mode="web",ro=false,e=null}={}){
 const dis=ro?"disabled":"",nm=`q${k}`;
 if(/scale|rating/i.test(q.type)){
  if(mode==="mobile")return `<div class="mrad">${[0,1,2,3,4].map(i=>`<label><input type="radio" name="${nm}" value="${i+1}" ${v==String(i+1)?"checked":""} ${dis}> ${i+1} · ${lvl(i,L)}</label>`).join("")}</div>`;
  return `<div class="wscale">${[0,1,2,3,4].map(i=>`<label class="${v==String(i+1)?"on":""}"><input type="radio" name="${nm}" value="${i+1}" ${v==String(i+1)?"checked":""} ${dis} onchange="wrChange()"><b>${i+1}</b><span>${lvl(i,L)}</span></label>`).join("")}</div>`}
 if(q.type==="Single select")return `<div class="mrad ${mode==="web"?"row3":""}">${(q.o||[]).map((o,i)=>`<label><input type="radio" name="${nm}" value="${i}" ${v==String(i)?"checked":""} ${dis} onchange="wrChange()"> ${esc(L==="ES"?o[1]:o[0])}</label>`).join("")}</div>`;
 if(q.type==="Multi-select"){const pre=v||(q.data==="Job sites worked"&&e?e.sites.map(s=>String((q.o||[]).findIndex(o=>o[0]===s))):[]);return `<div class="mrad ${mode==="web"?"row3":""}">${(q.o||[]).map((o,i)=>`<label><input type="checkbox" name="${nm}" value="${i}" ${pre.includes(String(i))?"checked":""} ${dis}> ${esc(L==="ES"?o[1]:o[0])}</label>`).join("")}</div>`}
 if(q.type==="Paragraph")return `<div class="tawrap"><textarea class="finp ta" name="${nm}" ${dis} placeholder="${L==="ES"?"Escriba o use el micrófono":"Type or use the mic"}">${esc(v||"")}</textarea>${mode==="mobile"?`<span class="mic">${ic("phone","s")}</span>`:""}</div>`;
 if(q.type==="Short text")return `<input class="finp" name="${nm}" value="${esc(v||"")}" ${dis}>`;
 if(q.type==="Number")return `<input class="finp" type="number" name="${nm}" value="${esc(v||"")}" ${dis} style="max-width:200px">`;
 if(q.type==="Date")return `<div style="max-width:240px">${dateField({value:v||"",name:nm,cls:"finp",disabled:!!ro,aria:"Date"})}</div>`;
 if(q.type==="Checkbox")return `<label class="opt"><input type="checkbox" name="${nm}" ${v?"checked":""} ${dis}> ${L==="ES"?"Sí":"Yes"}</label>`;
 if(q.type==="E-signature")return mode==="mobile"?`<div class="sigbox">${v?`<span class="sig">${esc(v)}</span>`:L==="ES"?"Toque para firmar":"Tap to sign"}</div>`:`<input class="finp sigin" name="${nm}" value="${esc(v||"")}" placeholder="Type your full name to sign" ${dis}>`;
 if(q.type==="Attachment")return `<input type="file" class="finp" ${dis}>`;
 return `<input class="finp" name="${nm}" ${dis}>`;
}

/* ---------- PREVIEW (Lumber app mobile form) ---------- */
function previewTpl(id){
 const t=T(id);if(!t.sections)t.sections=sampleSections(id);
 const empFacing=/Self|Peer|Upward/.test(t.type)&&!/Manager/.test(t.type);
 S.pv=S.pv||{dev:"Phone",lang:"EN"};const pv=S.pv;if(!empFacing)pv.dev="Web";
 const e=E(1),L=pv.lang;
 const seg=(k,opts)=>`<span class="seg">${opts.map(o=>`<button class="btn xs ${pv[k]===o[0]?"p":""}" onclick="S.pv.${k}='${o[0]}';previewTpl('${id}')">${o[1]}</button>`).join(" ")}</span>`;
 const title=(L==="ES"?{Self:"Autoevaluación",Peer:"Evaluación de compañero",Upward:"Evaluación de su capataz"}[t.type]:null)||t.name;
 const mob=`<div class="phone2"><div class="sbar"><span>9:41</span><span>●●● ▮</span></div><div class="abar"><span class="back">‹</span><b>${esc(title)}</b><span></span></div>
  <div class="ascroll"><div class="mf"><div class="fld"><div class="lbl">${L==="ES"?"Nombre del empleado":"Employee Name"}</div><div class="finp ro">${t.type==="Peer"?"Andre Wilson":t.type==="Upward"?"Luis Delgado":e.name}</div></div>
  <div class="dim sm" style="margin:-4px 0 6px">Q4 2026 Field Crew Check-in · ${L==="ES"?"Fecha límite":"Due"} Oct 12 · ~${t.min} min</div>
  ${t.sections.map((s,si)=>`<div class="msec">${esc((L==="ES"&&s.nes?s.nes:s.n).replace("{name}","Andre"))}</div><div class="mind">${s.qs.filter(q=>q.cond==="Everyone").map((q,qi)=>`<div class="fld"><div class="lbl">${esc(qText(q,L,{name:"Andre Wilson"}))}${q.req?" *":""}</div>${q.help?`<div class="hlp">${esc(L==="ES"&&q.hes?q.hes:q.help)}</div>`:""}${q.data?dataNote(q,e):""}${field(q,"p"+si+"_"+qi,null,{L,mode:"mobile",e})}</div>`).join("")}</div>`).join("")}
  </div></div><div class="abot"><button class="btn p" style="width:100%;justify-content:center">${L==="ES"?"Enviar":"Submit"}</button></div></div>`;
 const web=`<div class="card"><div class="bd">${formBody(t,{},{L,e,preview:true})}</div></div>`;
 openDrawer({title:"Preview · "+esc(t.name),sub:`${t.q} questions · ~${t.min} min · ${empFacing?"answered by the employee in the Lumber app":"answered by the foreman or manager on the web"}`,w:pv.dev==="Phone"?640:900,
  body:`<div class="row" style="justify-content:space-between">${empFacing?seg("dev",[["Phone","Lumber app"],["Web","Web"]]):`<span class="dim sm">Foremen and managers answer this on the web: Performance › My Reviews, or from the employee's profile.</span>`}${seg("lang",[["EN","English"],["ES","Español"]])}</div>
  ${pv.dev==="Phone"?mob:web}`,
  foot:`<button class="btn" onclick="closeLayer()">Close</button><button class="btn p" onclick="closeLayer();${S.view==="wizard"?"":`openBuilder('${id}')`}">${S.view==="wizard"?"Use this questionnaire":"Edit questionnaire"}</button>`});
 if(S.newCo)D.checklist[2]=true;
}
function formBody(t,ans,{L="EN",e,ro=false,err=new Set(),preview=false,mic=null,self=false}){
 const ES=L==="ES";
 let n=0;
 return t.sections.map((s,si)=>`<div class="wsec"><h3>${esc((ES&&s.nes?s.nes:s.n).replace("{name}",e?e.name.split(" ")[0]:""))}</h3>${s.qs.map((q,qi)=>{n++;const k=si+"_"+qi,v=ans[k];const showLow=q.low&&v&&+v<=2;
  return `<div class="wq ${err.has(k)?"qerr":""}" id="wq${k}"><div class="lbl"><span class="qn">${n}</span>${esc(qText(q,L,e))}${q.req?' <span class="req">*</span>':""}${q.cond!=="Everyone"?` <span class="tag">${q.cond}</span>`:""}</div>${q.help?`<div class="hlp">${esc(ES&&q.hes?q.hes:q.help)}</div>`:""}${e?dataNote(q,e):""}${field(q,k,v,{L,mode:"web",ro:ro,e})}${mic&&!ro&&q.type==="Paragraph"?mic(k):""}
  ${showLow?`<div class="lowc"><label class="fl">${ES?"¿Por qué esta calificación?":"Why this rating?"} <span class="req">*</span></label><textarea class="finp ta" name="c${k}" ${ro?"disabled":""} placeholder="${ES?"Obligatorio para calificaciones de 2 o menos.":`Required for ratings of 2 or lower.${self?"":" The employee sees this."}`}">${esc(ans["c"+k]||"")}</textarea></div>`:""}
  ${err.has(k)?`<div class="err">${showLow&&!ans["c"+k]&&v?(ES?"Agregue el motivo de esta calificación.":"Add a reason for this rating."):(ES?"Responda esta pregunta para enviar.":"Answer this question to submit.")}</div>`:""}</div>`}).join("")}</div>`).join("");
}

/* ---------- builder card shows options ---------- */
function qCard(q,si,j,on){
 const txt=S.bld.lang==="ES"?(q.es||`<span style="color:var(--amber)">Needs Spanish · ${esc(q.t)}</span>`):esc(q.t);
 const body=/scale/i.test(q.type)?`<div class="scale">${[1,2,3,4,5].map(n=>`<span title="${lvl(n-1,S.bld.lang)}">${n}<small>${lvl(n-1,S.bld.lang).split(" ")[0]}</small></span>`).join("")}</div>`:(q.o?`<div class="ochips">${q.o.map(o=>`<span>${q.type==="Multi-select"?"☐":"○"} ${esc(S.bld.lang==="ES"?o[1]:o[0])}</span>`).join("")}</div>`:q.type==="Paragraph"?`<div class="finp ta" style="background:var(--sub);height:56px;margin-top:10px"></div>`:q.type==="E-signature"?`<div class="sigbox" style="margin-top:10px">Sign here</div>`:`<div class="finp" style="background:var(--sub);margin-top:10px;max-width:${q.type==="Number"?"200px":"100%"}"></div>`);
 return `<div class="qcard ${on?"on":""}" onclick="S.bld.sel=[${si},${j}];render()"><div class="row"><span class="dim">${ic("drag","s")}</span><span class="qt grow" id="qt${si}_${j}">${txt}${q.req?' <span class="req">*</span>':""}</span><span class="tag">${q.type}</span>${q.cond!=="Everyone"?`<span class="tag">Only: ${q.cond}</span>`:""}</div>${q.help?`<div class="dim sm" style="margin-top:4px">${esc(q.help)}</div>`:""}${q.data?`<div style="margin-top:8px"><span class="datafield">${ic("chart","s")} Shows: ${q.data} (from Lumber)</span></div>`:""}${body}${q.low?`<div class="dim sm" style="margin-top:6px">Comment required for ratings of 2 or lower</div>`:""}</div>`;
}

/* ---------- FOREMAN: My Reviews ---------- */
const tplOf=(p,kind)=>kind==="c"?"t3":(((typeof cycOf==="function"&&cycOf(p))||{}).tpls||[]).includes("t6")?"t6":"t2";
function myItems(){const out=[];D.packets.filter(p=>p.exc!=="Removed").forEach(p=>{const c=cycOf(p);if(!c||!["Active","Closed","Paused"].includes(c.status))return;
 if(p.mgr.by===ME)out.push({p,kind:"mgr",st:p.mgr.st,label:"Manager review"});
 p.contrib.filter(x=>x.by===ME).forEach(x=>out.push({p,kind:"c",st:x.st,label:"Other foreman's notes",x}))});return out}
const mgrOpen=c=>c.status==="Active"&&c.phases.some(ph=>/manager/i.test(ph.n)&&ph.st==="cur");
const myTodos=()=>myItems().filter(i=>!["Submitted","Abandoned"].includes(i.st)&&mgrOpen(cycOf(i.p)));
const mySubmitted=()=>myItems().filter(i=>i.st==="Submitted");
function answered(p,kind){const t=T(tplOf(p,kind)),a=(p.ans||{})[kind]||{};let tot=0,done=0;t.sections.forEach((s,si)=>s.qs.forEach((q,qi)=>{if(q.cond!=="Everyone"&&!E(p.eid).title.match(/Lead|Foreman/))return;tot++;const v=a[si+"_"+qi];if(v!==undefined&&v!==""&&!(Array.isArray(v)&&!v.length))done++}));return{tot,done}}
V.myreviews=()=>{
 if(S.role!=="foreman")return V.home();
 const todo=myTodos(),sub=mySubmitted(),list=S.mrTab==="Submitted"?sub:todo;
 const rows=list.filter(i=>!S.q||E(i.p.eid).name.toLowerCase().includes(S.q.toLowerCase()));
 return `<div class="ph"><div><h1>My Reviews</h1><div class="sub">Reviews you owe as a foreman. You can also write them from each person's profile.</div></div>${todo.length?`<button class="btn p" onclick="openWrite(${todo[0].p.id},'${todo[0].kind}')">Start next review</button>`:""}</div>
 ${tabBar([{id:"To do",label:"To do",count:todo.length},{id:"Submitted",label:"Submitted",count:sub.length}],{active:S.mrTab||"To do",label:"My reviews",onSelect:t=>`S.mrTab='${t}';render()`})}
 ${S.mrTab==="To do"&&todo.length?`<div class="card" style="margin-bottom:16px"><div class="bd row" style="justify-content:space-between"><div><b>Q4 2026 Field Crew Check-in</b><div class="dim sm">${todo.length} review${todo.length>1?"s":""} to write · due Oct 30 · about 5 minutes each</div></div><div class="row" style="flex-wrap:nowrap;gap:10px;min-width:220px"><div class="bar b grow"><span style="width:${pct(sub.filter(i=>i.p.cid==="c1").length,sub.filter(i=>i.p.cid==="c1").length+todo.length)}%"></span></div><span class="sm tab-num">${sub.filter(i=>i.p.cid==="c1").length}/${sub.filter(i=>i.p.cid==="c1").length+todo.length} done</span></div></div></div>`:""}
 <div class="card"><div class="tools"><label class="srch">${ic("search")}<input id="mq" placeholder="Search your crew" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#mq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label></div>
 ${rows.length?`<div class="tw"><table class="tbl"><thead><tr><th>Employee</th><th>Review</th><th>Cycle</th><th>Self review</th><th>Status</th><th>Due</th><th></th></tr></thead><tbody>${rows.map(i=>{const p=i.p,e=E(p.eid),c=cycOf(p),a=answered(p,i.kind);const stt=i.st==="Submitted"?"Submitted":a.done?"Draft":"Not started";
  return `<tr class="click" onclick="openWrite(${p.id},'${i.kind}')"><td><div class="who">${av(e.name)}<div><button class="link" style="font-weight:600;color:var(--ink)" onclick="event.stopPropagation();openProfile(${e.id},'Performance','${c.id}')">${esc(e.name)}</button><div class="s">${e.title} · ${crewName(e.crew)}</div></div></div></td><td>${i.label}</td><td class="sm">${esc(c.name.replace(" Field Crew Check-in",""))}</td>
  <td>${p.self.st==="Submitted"?'<span class="pill g">Submitted</span>':p.self.st==="Off"?'<span class="dim">Off</span>':'<span class="pill n">Not yet</span>'}</td>
  <td>${stt==="Draft"?`<span class="pill b">Draft · ${a.done}/${a.tot}</span>`:pill(stt)}</td><td class="tab-num">${i.st==="Submitted"?'<span class="dim">—</span>':"Oct 30"}</td>
  <td><button class="btn xs ${stt==="Submitted"?"":"p"}">${stt==="Submitted"?"View":stt==="Draft"?"Continue":"Start review"}</button></td></tr>`}).join("")}</tbody></table></div>${pgFoot(rows.length)}`:`<div class="empty"><b>${S.mrTab==="To do"?"You're all caught up":"Nothing submitted yet"}</b>${S.mrTab==="To do"?"New reviews show up here and in your notifications.":""}</div>`}</div>`;
};

/* ---------- FOREMAN: writing a review (web) ---------- */
function openWrite(pid,kind){if(S.view==="write")wrCollect();S.wrSkip=true;closeLayer();S.wr={pid,kind};S.wrErr=new Set();nav("write",{q:S.q})}
function wrCollect(){const f=$("#rvForm"),w=S.wr;if(!f||!w)return;const p=PK(w.pid);p.ans=p.ans||{};const a=p.ans[w.kind]=p.ans[w.kind]||{};readForm(f,T(tplOf(p,w.kind)),a);
 const ca=f.querySelector("#certack");if(ca)a.certack=ca.checked;}
/* Reads a formBody() form into an answers object keyed "section_question" (shared by web reviews and the worker app) */
function readForm(f,t,a){
 t.sections.forEach((s,si)=>s.qs.forEach((q,qi)=>{const k=si+"_"+qi,nm="q"+k;
  if(["Numeric scale","Star rating","Named-level scale","Single select"].includes(q.type)){const x=f.querySelector(`input[name="${nm}"]:checked`);if(x)a[k]=x.value}
  else if(q.type==="Multi-select")a[k]=[...f.querySelectorAll(`input[name="${nm}"]:checked`)].map(x=>x.value);
  else if(q.type==="Checkbox"){const x=f.querySelector(`input[name="${nm}"]`);if(x)a[k]=x.checked}
  else{const x=f.querySelector(`[name="${nm}"]`);if(x)a[k]=x.value}
  const c=f.querySelector(`[name="c${k}"]`);if(c)a["c"+k]=c.value}));return a}
function wrChange(){if(S.view==="checkin"&&typeof waChange==="function")return waChange();if(S.view==="write"){wrCollect();const y=window.scrollY;render();window.scrollTo(0,y)}}
V.write=()=>{
 const w=S.wr;if(!w)return V.myreviews();if(!S.wrSkip)wrCollect();S.wrSkip=false;
 const p=PK(w.pid),e=E(p.eid),c=cycOf(p),t=T(tplOf(p,w.kind)),a=(p.ans||{})[w.kind]||{};
 const it=myItems().find(i=>i.p.id===p.id&&i.kind===w.kind);const submitted=it&&it.st==="Submitted";
 const locked=submitted&&(c.status==="Closed"||DONE.includes(p.st)||["In calibration","Disputed","Recalled"].includes(p.st));
 const ro=locked;const q=myTodos(),ix=q.findIndex(i=>i.p.id===p.id&&i.kind===w.kind);
 const an=answered(p,w.kind),expired=e.certs.filter(x=>x.s==="expired");
 const last=D.packets.find(x=>x.cid==="c6"&&x.eid===e.id);
 const sv=D.settings.selfVis,selfVisible=p.self.st==="Submitted"&&(sv==="During review"||(sv==="After reviewer submits"&&submitted)||c.status==="Closed");
 return `<div class="crumb"><a onclick="nav('myreviews')">My Reviews</a> › <span>${esc(e.name)}</span></div>
 <div class="ph"><div><div class="row"><h1>${esc(e.name)}</h1>${submitted?pill("Submitted"):an.done?'<span class="pill b">Draft</span>':""}</div><div class="sub">${it?it.label:"Review"} · ${esc(c.name)} · ${submitted?"submitted":"due "+(((c.phases||[]).find(ph=>/manager/i.test(ph.n))||{}).e||"Oct 30")}</div></div>
 <div class="row">${ix>=0&&q.length>1?`<span class="dim sm">${ix+1} of ${q.length} to do</span><button class="btn s" aria-label="Previous" ${ix>0?"":"disabled"} onclick="wrGo(${ix-1})">‹</button><button class="btn s" aria-label="Next" ${ix<q.length-1?"":"disabled"} onclick="wrGo(${ix+1})">›</button>`:""}<button class="btn" onclick="openProfile(${e.id},'Performance')">${ic("user","s")} View Profile</button></div></div>
 ${locked?`<div class="note row" style="margin-bottom:14px"><span class="grow">Submitted. Ratings were calibrated and shared, so changes go through HR.</span><button class="btn s" onclick="reqReopen(${p.id})">Request reopen</button></div>`:submitted?`<div class="ok" style="margin-bottom:14px">Submitted. You can still edit until the phase closes on ${(((c.phases||[]).find(ph=>/manager/i.test(ph.n))||{}).e||"Oct 30")}.</div>`:""}
 ${S.wrErr.size?`<div class="bad" style="margin-bottom:14px"><b>${S.wrErr.size} item${S.wrErr.size>1?"s need":" needs"} attention before you can submit.</b> They're marked in red below.</div>`:""}
 <div class="wrgrid"><form id="rvForm" onsubmit="event.preventDefault()" onchange="wrCollect()" class="card"><div class="bd">${formBody(t,a,{e,ro,err:S.wrErr})}
  ${expired.length?`<div class="wq ${S.wrErr.has("cert")?"qerr":""}"><label class="opt"><input type="checkbox" id="certack" ${a.certack?"checked":""} ${ro?"disabled":""}> <span><b>I've reviewed ${esc(e.name.split(" ")[0])}'s credentials.</b></span></label>${S.wrErr.has("cert")?`<div class="err">Confirm you've reviewed their credentials to submit.</div>`:""}</div>`:""}
 </div>
 ${ro?"":`<div class="wrfoot"><span class="dim sm">${an.done} of ${an.tot} answered · draft saves automatically</span><span class="grow"></span><button class="btn" onclick="wrSave()">Save draft</button><button class="btn p" onclick="wrSubmit()">${submitted?"Save changes":"Submit review"}</button></div>`}</form>
 <aside class="stack ctxp">
  <div class="card"><div class="hd"><h3>At a glance</h3><span class="dim sm">From Lumber</span></div><div class="bd kv">
   ${[["Title",e.title],["Crew",e.crew?crewName(e.crew):""],["Hired",e.hire],["Hours this quarter",e.hrs?e.hrs+" hrs":""],["Job sites",e.sites.map((s,i)=>`${s} · ${i?96:e.hrs-(e.sites.length>1?96:0)} hrs`).join("<br>")],["Attendance",`On time ${58-(e.id%3)} of 60 days`],["Last review",last?`${last.rating} · ${D.settings.levels[last.rating-1]} (Q2)`:"First review"]].filter(x=>x[1]).map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join("")}</div></div>
  <div class="card"><div class="hd"><h3>Certifications</h3></div><div class="bd">${e.certs.length?`<div class="ci-list">${e.certs.map(certItem).join("")}</div>`:'<span class="dim sm">No certifications on file.</span>'}</div></div>
  <div class="card"><div class="hd"><h3>Self review</h3>${p.self.st==="Submitted"?pill("Submitted"):""}</div><div class="bd sm">${p.self.st==="Off"?`<span class="dim">This cycle doesn't include a self review.</span>`:p.self.st!=="Submitted"?`<span class="dim">${esc(e.name.split(" ")[0])} hasn't submitted a self review yet. You can still write your review.</span>`:selfVisible?`<div class="dim" style="margin-bottom:10px">Submitted Oct 9.</div><button type="button" class="btn s" onclick="viewForm(${p.id},'self')">View self review</button>`:`<span class="dim">Submitted Oct 9. ${sv==="Hidden until cycle end"?"HR keeps self reviews hidden until the cycle closes.":"You can open it after you submit your review, so your rating stays your own."}</span>`}</div></div>
 </aside></div>`;
};
/* certification item: badge thumbnail + issuer / name / status, then Category · Issued · Expires */
const CERT_META={"OSHA 10":{by:"OSHA Outreach Training",cat:"Safety",yrs:5},"OSHA 30":{by:"OSHA Outreach Training",cat:"Safety",yrs:5},"Fall Protection":{by:"National Safety Council",cat:"Safety",yrs:3},"Forklift Operator":{by:"Lumber Training",cat:"Equipment",yrs:3},"First Aid / CPR":{by:"American Red Cross",cat:"Health",yrs:2},"Fire Extinguisher Training":{by:"National Fire Protection Association",cat:"Safety",yrs:1},"Confined Space Awareness":{by:"National Safety Council",cat:"Safety",yrs:3}};
function certItem(x){const m=CERT_META[x.n]||{},d=/^\d\d\/\d\d\/\d{4}$/.test(x.d||"")?x.d:"",iss=x.iss||(d&&m.yrs?d.slice(0,6)+(+d.slice(6)-m.yrs):"");
 const ok=x.s==="active",ex=x.s==="expired";
 const check=`<span class="ci-ok" role="img" aria-label="Verified" title="Verified"><svg viewBox="0 0 24 24"><path d="M7 12.5l3.2 3.2L17 9"/></svg></span>`;
 const warn=ok?"":`<div class="ci-warn ${ex?"r":"a"}" role="img" aria-label="${ex?"Expired":"Expiring soon"}" title="${ex?"Expired":"Expiring soon"}"><span class="ci-wi" aria-hidden="true"><svg viewBox="0 0 24 24"><path class="t" d="M12 6.5l6 10.5H6z"/><path class="m" d="M12 10.5v3M12 15.4v.1"/></svg></span></div>`;
 return `<div class="ci"><div class="ci-top"><div class="ci-img" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/></svg></div><div class="ci-tx"><div class="ci-by">${esc(x.by||m.by||"-")}</div><div class="ci-n">${esc(x.n)}${ok?check:""}</div></div>${warn}</div>
 <div class="ci-meta">${[["Category",x.cat||m.cat||"Others"],["Issued",iss||"-"],["Expires",x.d||"-"]].map(k=>`<div><span>${k[0]}</span><b>${esc(k[1])}</b></div>`).join("")}</div></div>`}
function selfSummary(p){const a=(p.ans||{}).self||{},t=T("t1");return t.sections.flatMap((s,si)=>s.qs.map((q,qi)=>{const v=a[si+"_"+qi];if(v===undefined||q.type==="E-signature")return"";const shown=/scale/i.test(q.type)?`${v} · ${D.settings.levels[v-1]}`:q.type==="Single select"?q.o[+v][0]:q.type==="Multi-select"?v.map(i=>q.o[+i][0]).join(", "):esc(v);return `<div style="padding:4px 0"><div class="dim">${esc(q.t)}</div><b>${shown}</b></div>`})).join("")}
function wrGo(i){wrCollect();const q=myTodos()[i];if(q)openWrite(q.p.id,q.kind)}
function wrSave(){wrCollect();const w=S.wr,p=PK(w.pid);if(w.kind==="mgr"&&p.mgr.st==="Not started"){p.mgr.st="In progress";if(["Submitted","In progress","Not started"].includes(p.st)&&p.self.st==="Submitted")p.st="Manager in progress"}if(w.kind==="c"){const x=p.contrib.find(x=>x.by===ME);if(x&&x.st==="Not started")x.st="In progress"}log(p,"Review draft saved","b",ME);toast("Draft saved. Pick up where you left off any time.")}
function wrSubmit(){wrCollect();const w=S.wr,p=PK(w.pid),e=E(p.eid),t=T(tplOf(p,w.kind)),a=p.ans[w.kind]||{},err=new Set();
 t.sections.forEach((s,si)=>s.qs.forEach((q,qi)=>{const k=si+"_"+qi,v=a[k];if(q.cond!=="Everyone"&&!e.title.match(/Lead|Foreman/))return;
  if(q.req&&(v===undefined||v===""||v===false||(Array.isArray(v)&&!v.length)))err.add(k);
  if(q.low&&v&&+v<=2&&!(a["c"+k]||"").trim())err.add(k)}));
 if(e.certs.some(x=>x.s==="expired")&&!a.certack)err.add("cert");
 S.wrErr=err;
 if(err.size){render();const f=document.querySelector(".qerr");if(f)f.scrollIntoView({block:"center",behavior:"smooth"});toast(`${err.size} item${err.size>1?"s":""} to finish before submitting.`);return}
 const scales=Object.entries(a).filter(([k,v])=>/^\d+_\d+$/.test(k)&&/scale/i.test((t.sections[+k.split("_")[0]].qs[+k.split("_")[1]]||{}).type)).map(([k,v])=>+v);
 const ov=a[(t.sections.length-1)+"_0"];
 if(w.kind==="mgr"){p.mgr.st="Submitted";p.rating=/scale/i.test(t.sections[t.sections.length-1].qs[0].type)&&ov?+ov:Math.round(scales.reduce((x,y)=>x+y,0)/Math.max(1,scales.length));if(p.self.st==="Submitted"||p.self.st==="Off"){p.st="Manager submitted";p.exc=null}else p.st="Manager in progress"}
 else{const x=p.contrib.find(x=>x.by===ME);if(x)x.st="Submitted"}
 if(a.certack)log(p,`Expired certification acknowledged by ${ME}`,"a",ME);
 log(p,w.kind==="mgr"?"Manager review submitted":"Other foreman's notes submitted","g",ME);
 const nx=myTodos()[0];
 if(nx){openWrite(nx.p.id,nx.kind);toast(`Submitted ${e.name.split(" ")[0]}'s review. Next: ${E(nx.p.eid).name}.`)}else{nav("myreviews",{mrTab:"Submitted"});toast("Submitted. You're all caught up.")}
}
function reqReopen(pid){const p=PK(pid);reasonModal({title:"Request reopen",desc:"HR decides. If approved, only you are asked to edit, and the employee hears about it when the review is closed again.",confirm:"Send request",onOk:r=>{D.reopenReqs.unshift({pid,by:ME,on:"Today",reason:r});log(p,"Reopen requested · "+r,"a",ME);closeModal();toast("Request sent to HR.")}})}

/* ---------- EMPLOYEE DETAILS drawer (Lumber) with Performance tab ---------- */
function openProfile(eid,tab){const e=E(eid);S.prTab=tab||S.prTab||"Employee Info";S.prE=eid;
 const PT=["Employee Info","Manager & Reports","Credentials","Projects","Assignments","Performance"];
 const F=S.role==="foreman";const mine=myItems().filter(i=>i.p.eid===eid);const inScope=!F||mine.length||e.mgr===ME;
 const frow=(l,v)=>`<div class="frow"><label>${l}</label><input class="inp" value="${esc(v)}" readonly></div>`;
 let body;
 if(S.prTab==="Performance"){
  const cur=D.packets.filter(p=>p.eid===eid&&cycOf(p)&&cycOf(p).status==="Active");
  const past=["c6","c2"].map(c=>D.packets.find(p=>p.eid===eid&&p.cid===c&&p.rating)).filter(Boolean);
  if(!inScope)body=`<div class="card"><div class="empty"><b>Performance details are private</b>Only ${esc(e.name.split(" ")[0])}'s reviewers and HR can see them.</div></div>`;
  else body=(F?`<div class="card"><div class="hd"><h3>Your reviews of ${esc(e.name.split(" ")[0])}</h3></div><div class="bd">${mine.length?mine.map(i=>`<div class="form-row"><div class="grow"><b>${i.label}</b><div class="dim sm">${esc(cycOf(i.p).name)} · ${i.st==="Submitted"?"submitted":"due Oct 30"}</div></div>${pill(i.st==="Submitted"?"Submitted":answered(i.p,i.kind).done?"In progress":"Not started")}<button class="btn s ${i.st==="Submitted"?"":"p"}" onclick="openWrite(${i.p.id},'${i.kind}')">${i.st==="Submitted"?"View":answered(i.p,i.kind).done?"Continue review":"Write review"}</button></div>`).join(""):'<span class="dim">No open reviews for you.</span>'}</div></div>`
   :`<div class="card"><div class="hd"><h3>Current reviews</h3></div><div class="bd">${cur.length?cur.map(p=>`<div class="form-row"><div class="grow"><b>${esc(cycOf(p).name)}</b><div class="dim sm">${nextStep(p).t}</div></div>${pill(p.exc||p.st)}<button class="btn s" onclick="closeLayer();nav('cycle',{cid:'${p.cid}',tab:'people',quick:'All'});setTimeout(()=>openPacket(${p.id}),0)">Open</button></div>`).join(""):'<span class="dim">Not in an open cycle.</span>'}</div></div>`)
   +`<div class="card"><div class="hd"><h3>Past reviews</h3></div><div class="bd">${past.length?`<div class="row" style="gap:28px">${past.map(p=>`<div><div class="dim sm">${cycOf(p).name.replace(" Field Crew Check-in","")}</div><div style="font-size:24px;font-weight:700">${p.adj||p.rating}</div><div class="sm">${D.settings.levels[(p.adj||p.rating)-1]}</div></div>`).join('<span class="dim">→</span>')}</div>`:'<span class="dim">No completed reviews yet.</span>'}</div></div>`
   +`<div class="card"><div class="hd"><h3>Certifications</h3></div><div class="bd">${e.certs.map(x=>`<div class="row" style="justify-content:space-between;padding:4px 0"><span>${x.n}</span><span class="pill ${x.s==="active"?"g":x.s==="expired"?"r":"a"}">${x.s==="active"?"Valid":x.s==="expired"?"Expired":"Expiring"} · ${x.d}</span></div>`).join("")||'<span class="dim">None on file.</span>'}</div></div>`;
 }else if(S.prTab==="Employee Info")body=`<div class="card"><div class="bd"><div class="b" style="margin-bottom:10px">General Information</div>${frow("First Name",e.name.split(" ")[0])}${frow("Last Name",e.name.split(" ").slice(1).join(" "))}${frow("Employee ID",e.code)}${frow("Job Title",e.title)}${frow("Hire Date",e.hire)}${frow("Language",e.lang==="ES"?"Spanish":"English")}</div></div>`;
 else if(S.prTab==="Manager & Reports")body=`<div class="card"><div class="bd">${frow("Manager",e.mgr)}${frow("Crew",crewName(e.crew))}${frow("Department",e.dept)}</div></div>`;
 else if(S.prTab==="Credentials")body=`<div class="card"><div class="bd">${e.certs.map(x=>`<div class="form-row"><b class="grow">${x.n}</b><span class="pill ${x.s==="active"?"g":x.s==="expired"?"r":"a"}">${x.s==="active"?"Valid":x.s==="expired"?"Expired":"Expiring"} · ${x.d}</span></div>`).join("")||"None on file."}</div></div>`;
 else if(S.prTab==="Projects")body=`<div class="card"><div class="bd">${e.sites.map((s,i)=>`<div class="form-row"><b class="grow">${s}</b><span class="dim">${i?96:e.hrs-(e.sites.length>1?96:0)} hrs this quarter</span></div>`).join("")||"No projects."}</div></div>`;
 else body=`<div class="card"><div class="empty"><b>No open assignments</b>Onboarding and form tasks show here.</div></div>`;
 openDrawer({label:"Employee Details",avatar:initials(e.name),title:esc(e.name),w:980,status:`<span class="dstat"><i></i>Enabled ▾</span>`,
  tabs:`<div class="dtabs">${PT.map(t=>`<button class="${S.prTab===t?"on":""}" onclick="openProfile(${eid},'${t}')">${t}${t==="Performance"?' <span class="new" style="margin-left:4px">NEW</span>':""}</button>`).join("")}</div>`,body,hist:"toast('Profile change history opens here.')",
  foot:`<button class="btn" onclick="closeLayer()">Cancel</button><button class="btn p" onclick="closeLayer();toast('Saved.')">Save</button>`});
}

/* ---------- Resources › Users ---------- */
V.users=()=>{
 const all=D.emps.filter(e=>e.name!=="Dana Whitfield"||true);const rows=all.filter(e=>!S.q||e.name.toLowerCase().includes(S.q.toLowerCase()));
 return `<div class="ph"><div><h1>Users</h1></div></div>
 ${tabBar(["Employees","Contractors","Crews","Archive","Issues"].map(t=>({id:t,label:t,...(t==="Issues"?{count:3,tone:"danger"}:{})})),{active:"Employees",label:"Users",onSelect:t=>`toast('${t} is unchanged in this prototype.')`})}
 <div class="card"><div class="hd"><div class="row"><h3>All Employees</h3><span class="cntpill g">${all.length} Enabled</span><span class="cntpill n">0 Disabled</span></div></div>
 <div class="tools"><label class="srch">${ic("search")}<input id="uq" placeholder="Search employees" value="${esc(S.q)}" oninput="S.q=this.value;render();const i=$('#uq');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></label></div>
 <div class="tw"><table class="tbl"><thead><tr><th class="cbx"><input type="checkbox" aria-label="Select all"></th><th>First Name</th><th>Last Name</th><th>Employee ID</th><th>Role</th><th>Job Title</th><th>Crew</th><th>Department</th></tr></thead><tbody>${rows.map(e=>`<tr class="click" onclick="openProfile(${e.id},'Employee Info')"><td class="cbx" onclick="event.stopPropagation()"><input type="checkbox"></td><td><div class="who">${av(e.name,28)}${esc(e.name.split(" ")[0])}</div></td><td>${esc(e.name.split(" ").slice(1).join(" "))}</td><td class="tab-num">${e.code}</td><td>${e.isMgr?"Foreman":e.type==="Office"?"Office":"Worker"}</td><td>${e.title}</td><td>${e.crew?crewName(e.crew):"—"}</td><td>${e.dept}</td></tr>`).join("")}</tbody></table></div>${pgFoot(rows.length)}</div>`;
};
const _adminOnly=["home","cycles","cycle","wizard","templates","builder","settings"];
const _render=render;

/* ================= V5: FIELD-FIRST REDESIGN ================= */
const SUPER="Dana Whitfield";
const M3=[["nw","✕","Needs work","Mejorar"],["ok","✓","Solid","Bien"],["st","★","Standout","Destacado"]];
const METRICS=[["s","Safety / PPE","Tie-off, harness, PPE, housekeeping"],["q","Quality / Rework","Clean work, callbacks, punch list"],["r","Reliability","On time, shows up, stays till done"]];
const NW_REASONS={s:["PPE missing","Not tied off","Unsafe tool use","Housekeeping"],q:["Rework","Callbacks","Slow on specs","Cleanup"],r:["Late","No-call / no-show","Leaves early","Phone on site"]};
const TIERS=[["Laborer","$20–22/hr"],["Apprentice","$22–25/hr"],["Journeyman Roofer","$27–31/hr"],["Lead Hand","$32–35/hr"],["Foreman","$36–42/hr"]];
const BADGES=[["OSHA 10","Required on every site"],["OSHA 30","Needed for Lead Hand"],["Fall Protection","Required for roof work"],["Boom Lift","Dispatch to boom work"],["Scaffolding","Dispatch to scaffold work"],["Forklift Operator","Dispatch to material handling"],["First Aid / CPR","Needed for Lead Hand"]];

/* --- micro check-in replaces long self review --- */
TPLQ.t1=[{n:"Quick check-in",nes:"Registro rápido",qs:[
 Q("How did work go this quarter?","¿Cómo le fue en el trabajo este trimestre?","Single select",{o:[["😀 Good","😀 Bien"],["🙂 OK","🙂 Más o menos"],["😟 Hard","😟 Difícil"]]}),
 Q("Did you have what you needed to work safely?","¿Tuvo lo necesario para trabajar con seguridad?","Single select",{o:[["Yes","Sí"],["Mostly","Casi siempre"],["No","No"]]}),
 Q("What do you want to learn next?","¿Qué quiere aprender después?","Multi-select",{req:false,o:[["Lead a crew","Dirigir cuadrilla"],["Equipment","Equipo"],["Safety training","Seguridad"],["English / Spanish","Inglés / Español"],["Not now","Ahora no"]]}),
 Q("Anything your foreman should know?","¿Algo que su capataz deba saber?","Paragraph",{req:false,help:"Hold the mic and talk. We type it for you.",hes:"Mantenga el micrófono y hable. Lo escribimos por usted."})]}];
TPLQ.t11=[{n:"Crew review · 3 metrics",qs:[Q("Safety / PPE","","Single select",{o:M3.map(m=>[m[2],m[3]])}),Q("Quality / Rework","","Single select",{o:M3.map(m=>[m[2],m[3]])}),Q("Reliability","","Single select",{o:M3.map(m=>[m[2],m[3]])}),Q("Quick note (voice or tap reasons)","","Paragraph",{req:false})]}];
PATTERNS["Quarterly crew check-in"].calib=false;
PATTERNS["Quarterly crew check-in"].tpl=[["Field employees","Self","t1"],["Field employees","Manager","t11"],["Field employees","Contributor","t3"]];
RTYPES[0][1]="Worker check-in";RTYPES[0][2]="2 minutes on a phone: 3 taps and an optional voice note, English or Spanish.";
RTYPES[1][1]="Foreman crew review";RTYPES[1][2]="Whole crew on one screen: Safety, Quality, Reliability. About 5 minutes for 8 people.";
RTYPES[2][1]="Other foremen";RTYPES[2][2]="Foremen with 40+ hrs on the worker rate the same 3 metrics. Weighted by hours.";

const _init11=init;
init=function(newCo){
 _init11(newCo);
 const t1=T("t1");if(t1){t1.name="Worker Micro Check-in";t1.type="Self";t1.sections=sampleSections("t1");bStats(t1);t1.min=2}
 D.templates.splice(1,0,{id:"t11",name:"Crew Batch Review (3 metrics)",type:"Manager",aud:"Field crews",q:4,min:1,langs:["EN","ES"],status:newCo?"Starter":"Active",ver:1,used:newCo?[]:["c1"],upd:"Oct 30, 2026",starter:true,sections:sampleSections("t11")});
 const t2=T("t2");if(t2)t2.name="Detailed Review (office, 90-day, PIP)";
 if(newCo)return;
 const c1=C("c1");if(c1){c1.calib=false;c1.tpls=["t1","t11","t3"]}
 // crew data for Luis Delgado
 const mig=EN("Miguel Torres");mig.sites=["Maple Ridge Apartments","Riverside Medical Center","Oak Hollow Elementary"];mig.rot=[["Luis Delgado",290,"Maple Ridge Apartments"],["Tom Hayes",120,"Riverside Medical Center"],["Ken Okafor",76,"Oak Hollow Elementary"]];
 const pm=D.packets.find(p=>p.cid==="c1"&&p.eid===mig.id);if(pm)pm.contrib=[{by:"Tom Hayes",st:"Submitted",hrs:120},{by:"Ken Okafor",st:"Not started",hrs:76}];
 const sam=EN("Sam Carter"),ps=D.packets.find(p=>p.cid==="c1"&&p.eid===sam.id);if(ps)ps.contrib=[{by:ME,st:"Not started",hrs:48}];
 const nid=Math.max(...D.emps.map(e=>e.id))+1;
 D.emps.push({id:nid,name:"Marcos Vega",code:"1291",type:"Field",title:"Roofer (new hire)",trade:"Roofer",dept:"Field Operations",crew:"cA",site:"Maple Ridge Apartments",sites:["Maple Ridge Apartments"],mgr:ME,hire:"Aug 5, 2026",phone:true,email:false,lang:"ES",union:false,hrs:402,certs:[{n:"OSHA 10",s:"active",d:"08/31/2031"},{n:"Fall Protection",s:"expiring",d:"11/30/2026"}],status:"Active"});
 D.auto=[{eid:nid,kind:"90-day check",sub:"Hired Aug 5 · day 85 of 90",due:"Nov 3",by:ME,st:"Not started",keep:null},
  {eid:EN("Eddie Morales").id,kind:"5-year anniversary",sub:"Nov 12 · merged into this crew review",by:ME,merged:true,st:"Merged"},
  {eid:EN("Darnell Jones").id,kind:"1-year anniversary",sub:"Nov 18",due:"Nov 25",by:"Tom Hayes",st:"Scheduled"},
  {eid:EN("Omar Haddad").id,kind:"90-day check",sub:"Hired Sep 2 · day 62",due:"Dec 1",by:"Ken Okafor",st:"Scheduled"}];
 D.rules=[{id:"r90",on:true,n:"90-day new hire check",trig:"Day 80 after hire date",who:"Foreman of record (most hours)",form:"Crew Batch Review + keep-on decision",due:"Due by day 90"},
  {id:"ran",on:true,n:"Work anniversary",trig:"Each hire anniversary",who:"Current foreman",form:"Crew Batch Review",due:"Due 7 days after",note:"Skipped if a crew review is already open; merged into it instead"},
  {id:"rpr",on:false,n:"Probation end",trig:"Probation end date on profile",who:"Foreman of record",form:"Detailed Review",due:"Due on probation end"}];
 D.batch={};
 S.crewMode=window.innerWidth<820?"cards":"table";S.ckLang="EN";S.ck={step:"q",a:{},note:"",rec:false};
};

/* --- roles & nav --- */
/* Automatic Reviews (V.auto) is hidden for now: to restore, add ["auto","Automatic Reviews"] after Review Cycles below and "auto" to ROLE_OK.admin */
const ROLE_NAV={admin:[["home","Overview"],["cycles","Review Cycles"],["templates","Questionnaires"]],super:[["crews","Crews"],["outliers","Outlier Check"]],foreman:[["crew","Crew Review"],["myreviews","All My Reviews"]],worker:[["checkin","My Check-in"]]};
const ROLE_HOME={admin:"home",super:"crews",foreman:"crew",worker:"checkin"};
const ROLE_OK={admin:["home","cycles","cycle","wizard","templates","builder","settings","users"],super:["crews","outliers","users"],foreman:["crew","myreviews","write","users"],worker:["checkin"]};
function navOn(k){return S.view===k||(k==="cycles"&&["cycle","wizard"].includes(S.view))||(k==="templates"&&S.view==="builder")||(k==="myreviews"&&S.view==="write")}
function renderNav(){
 const R=S.role||"admin",items=ROLE_NAV[R],badge={home:attention().length,crew:crewTodo().length,outliers:outliers().filter(o=>!o.done).length};
 $("#pmdd").innerHTML=items.map(x=>`<button class="${navOn(x[0])?"on":""}" onclick="event.stopPropagation();S.pmOpen=false;nav('${x[0]}')">${x[1]}${badge[x[0]]?`<span class="cnt">${badge[x[0]]}</span>`:""}</button>`).join("")+(R==="admin"?`<hr><button onclick="event.stopPropagation();S.pmOpen=false;nav('settings')">Performance Settings</button>`:"");
 $("#pmdd").hidden=!S.pmOpen;
 if(S.pmOpen){const r=$("#pmNav").getBoundingClientRect();$("#pmdd").style.left=Math.max(8,Math.min(r.left,window.innerWidth-270))+"px";$("#pmdd").style.top=(r.bottom+6)+"px"}
 $("#pmNav").classList.toggle("on",S.view!=="users");$("#resNav").classList.toggle("on",S.view==="users");
}
function setRole(r){S.role=r;S.pmOpen=false;closeLayer();if(r!=="admin"&&S.newCo)init(false);nav(ROLE_HOME[r]);toast({admin:"Viewing as HR admin.",super:"Viewing as Dana Whitfield, superintendent over 4 crews.",foreman:"Viewing as Luis Delgado, foreman of Roofing Crew A.",worker:"Viewing as Miguel Torres on his phone."}[r])}
render=function(){const R=S.role||"admin";if(!ROLE_OK[R].includes(S.view))S.view=ROLE_HOME[R];_render();document.body.classList.toggle("phonemode",S.view==="checkin")};

/* --- crew helpers --- */
const lvl3=v=>M3.find(m=>m[0]===v);
function crewRows(){
 const rows=[];
 D.packets.filter(p=>p.cid==="c1"&&p.exc!=="Removed").forEach(p=>{
  if(p.mgr.by===ME)rows.push({p,eid:p.eid,kind:"mgr",st:p.mgr.st});
  p.contrib.filter(x=>x.by===ME).forEach(x=>rows.push({p,eid:p.eid,kind:"c",st:x.st,hrs:x.hrs,from:crewName(E(p.eid).crew)}))});
 (D.auto||[]).filter(a=>a.by===ME&&!a.merged).forEach(a=>rows.push({auto:a,eid:a.eid,kind:"auto",st:a.st}));
 return rows;
}
const rowKey=r=>r.kind+"_"+r.eid;
const crewTodo=()=>(S.role==="foreman"||S.role==="admin")&&D.batch?crewRows().filter(r=>r.st!=="Submitted"):[];
function bState(r){const k=rowKey(r);return D.batch[k]=D.batch[k]||{s:null,q:null,r:null,why:{},note:"",keep:null}}
function rowIssues(r){const b=bState(r),out=[];METRICS.forEach(m=>{if(!b[m[0]])out.push(m[1]+" not rated");else if(b[m[0]]==="nw"&&!(b.why[m[0]]||[]).length&&!b.note.trim())out.push("Add a reason for "+m[1])});if(r.kind==="auto"&&!b.keep)out.push("Pick keep-on decision");const e=E(r.eid);if(e.certs.some(c=>c.s==="expired")&&!b.cert)out.push("Acknowledge expired cert");return out}
const rowDone=r=>r.st==="Submitted"||!rowIssues(r).length;
function hoursBySite(e){if(e.rot)return e.rot.map(x=>[x[2],x[1],x[0]]);if(e.sites.length>1)return[[e.sites[0],e.hrs-96,e.mgr],[e.sites[1],96,D.crews[(D.crews.findIndex(c=>c.id===e.crew)+1)%4].fm]];return[[e.site,e.hrs,e.mgr]]}
function weeks(e){return Array.from({length:12},(_,i)=>((e.id*7+i*3)%11===0?"late":(e.id+i)%17===0?"miss":"ok"))}
function safetyLog(e){const n=D.notes.filter(x=>x.eid===e.id&&(x.type==="Safety observation"||x.type==="Concern"));return n.length?n.map(x=>[x.on,x.txt,x.by]):((e.id%5===2)?[["Sep 18","Near-miss reported: loose ladder footing, fixed same day","Self-reported"]]:[])}
function ctxChips(e,r){const att=weeks(e).filter(x=>x!=="ok").length,sl=safetyLog(e).length,mine=r&&r.kind==="c"?r.hrs:hoursBySite(e).filter(h=>h[2]===ME).reduce((a,h)=>a+h[1],0);
 return `<span class="cx">${ic("clock","s")} ${mine||e.hrs} hrs with you${hoursBySite(e).length>1?` · ${hoursBySite(e).length} sites`:""}</span><span class="cx ${att>1?"warn":""}">${att?att+" late/missed":"On time"} · 12 wks</span><span class="cx ${sl?"warn":""}">${sl?sl+" safety note"+(sl>1?"s":""):"No safety notes"}</span>${e.certs.filter(c=>c.s!=="active").map(c=>`<span class="cx ${c.s==="expired"?"bad":"warn"}">${ic("cert","s")} ${c.n} ${c.s}</span>`).join("")}`}

/* --- FOREMAN: Crew Batch Review --- */
V.crew=()=>{
 const rows=crewRows(),open=rows.filter(r=>r.st!=="Submitted"),done=open.filter(rowDone).length,sub=rows.filter(r=>r.st==="Submitted");
 const left=Math.max(0,Math.ceil((open.length-done)*0.6));
 const mode=S.crewMode;
 return `<div class="ph"><div><h1>Crew Review</h1><div class="sub">Q4 2026 · Roofing Crew A + 2 borrowed workers + 1 automatic check · due Oct 30</div></div>
 <div class="row"><span class="seg2"><button class="${mode==="table"?"on":""}" onclick="S.crewMode='table';render()">Table</button><button class="${mode==="cards"?"on":""}" onclick="S.crewMode='cards';render()">One at a time</button></span></div></div>
 <div class="crewbar card"><div class="bd row" style="justify-content:space-between">
  <div class="row" style="gap:14px"><b style="font-size:20px">${done} of ${open.length}</b><span class="dim">ready to send${open.length-done?` · about ${left} min left`:""}${sub.length?` · ${sub.length} already sent`:""}</span></div>
  <div class="bar b" style="flex:1;min-width:120px;max-width:360px"><span style="width:${pct(done,open.length)}%"></span></div>
  <div class="row"><button class="btn s" onclick="fillSolid()">Set empty ratings to Solid</button><button class="btn p" onclick="sendCrew()">${ic("send","s")} Send ${done} review${done===1?"":"s"}</button></div></div></div>
 <div class="legend dim sm">Tap one per column: <b>✕ Needs work</b> (pick a reason) · <b>✓ Solid</b> · <b>★ Standout</b>. Tap a name for jobsite context. Self check-ins stay hidden until you send.</div>
 ${open.length?(mode==="table"?crewTable(open):crewCard(open)):`<div class="card"><div class="empty"><b>Crew done</b>All reviews sent. HR shares results after the cycle closes.</div></div>`}
 ${sub.length?`<div class="card" style="margin-top:16px"><div class="hd"><h3>Sent</h3><span class="dim sm">You can change these until Oct 30</span></div><div class="bd">${sub.map(r=>{const e=E(r.eid),b=bState(r);return `<div class="form-row"><div class="who grow">${av(e.name,28)}<b>${esc(e.name)}</b></div>${METRICS.map(m=>b[m[0]]?`<span class="chip3 ${b[m[0]]} on">${lvl3(b[m[0]])[1]} ${m[1].split(" ")[0]}</span>`:"").join("")}<button class="btn xs" onclick="reopenRow('${rowKey(r)}')">Edit</button></div>`}).join("")}</div></div>`:""}`;
};
function triBtns(k,m,v){return `<div class="tri">${M3.map(x=>`<button class="${x[0]} ${v===x[0]?"on":""}" title="${x[2]}" aria-pressed="${v===x[0]}" onclick="tap('${k}','${m}','${x[0]}')"><span>${x[1]}</span><small>${x[2]}</small></button>`).join("")}</div>`}
function tag(r){return r.kind==="c"?`<span class="tag">Borrowed · ${r.hrs} hrs with you</span>`:r.kind==="auto"?`<span class="tag auto">${r.auto.kind} · auto</span>`:E(r.eid).rot?`<span class="tag">3 foremen this quarter</span>`:((D.auto||[]).find(a=>a.eid===r.eid&&a.merged)?`<span class="tag auto">5-yr anniversary · merged</span>`:"")}
function extraRow(r,k,b){const e=E(r.eid),x=[];
 METRICS.forEach(m=>{if(b[m[0]]==="nw")x.push(`<div class="why"><span class="dim sm">${m[1]}: why?</span>${NW_REASONS[m[0]].map(w=>`<button class="chip3 ${(b.why[m[0]]||[]).includes(w)?"on nw":""}" onclick="why('${k}','${m[0]}','${w}')">${w}</button>`).join("")}</div>`)});
 if(r.kind==="auto")x.push(`<div class="why"><span class="dim sm">Keep on after 90 days?</span>${["Yes","Yes, with conditions","No"].map(w=>`<button class="chip3 ${b.keep===w?"on ok":""}" onclick="keep('${k}','${w}')">${w}</button>`).join("")}</div>`);
 const ex=e.certs.find(c=>c.s==="expired");if(ex)x.push(`<div class="why"><label class="opt"><input type="checkbox" ${b.cert?"checked":""} onchange="bState(crewRows().find(r=>rowKey(r)==='${k}')).cert=this.checked;render()"> ${ex.n} expired ${ex.d}. I've seen this.</label></div>`);
 if(b.note)x.push(`<div class="why"><span class="dim sm">${ic("chat","s")} Note:</span> <i>${esc(b.note)}</i></div>`);
 return x.join("")}
function crewTable(open){
 return `<div class="card"><div class="tw"><table class="tbl crewt"><thead><tr><th>Worker</th>${METRICS.map(m=>`<th title="${m[2]}">${m[1]}</th>`).join("")}<th>Note</th><th></th></tr></thead><tbody>
 ${open.map(r=>{const e=E(r.eid),k=rowKey(r),b=bState(r),ok=rowDone(r),ex=extraRow(r,k,b);
  return `<tr class="${ok?"rdone":""}"><td><button class="wbtn" onclick="ctxSheet(${r.eid},'${k}')"><div class="who">${av(e.name,34)}<div style="min-width:0;text-align:left"><div class="n">${esc(e.name)} ${e.lang==="ES"?'<span class="tag">ES</span>':""}</div><div class="s">${e.title}</div></div></div></button><div class="cxl">${tag(r)}${ctxChips(e,r)}</div></td>
  ${METRICS.map(m=>`<td>${triBtns(k,m[0],b[m[0]])}</td>`).join("")}
  <td><button class="btn s ${b.note?"p":""}" aria-label="Voice note" onclick="voice('${k}')">${ic("chat","s")}</button></td><td>${ok?'<span class="pill g">Ready</span>':`<span class="dim sm">${rowIssues(r).length} left</span>`}</td></tr>
  ${ex?`<tr class="xrow"><td colspan="6">${ex}</td></tr>`:""}`}).join("")}
 </tbody></table></div></div>`;
}
function crewCard(open){
 S.ci=Math.min(S.ci||0,open.length-1);const r=open[S.ci],e=E(r.eid),k=rowKey(r),b=bState(r);
 return `<div class="ccard card"><div class="bd">
  <div class="row" style="justify-content:space-between"><span class="dim sm">${S.ci+1} of ${open.length}</span><div class="dots">${open.map((x,i)=>`<i class="${i===S.ci?"on":rowDone(x)?"ok":""}"></i>`).join("")}</div></div>
  <button class="wbtn" onclick="ctxSheet(${r.eid},'${k}')"><div class="who" style="margin:10px 0">${av(e.name,48)}<div style="text-align:left"><div class="n" style="font-size:20px">${esc(e.name)}</div><div class="s">${e.title} · ${crewName(e.crew)}</div></div></div></button>
  <div class="cxl">${tag(r)}${ctxChips(e,r)}</div>
  ${METRICS.map(m=>`<div class="cm"><div class="b">${m[1]} <span class="dim sm">${m[2]}</span></div>${triBtns(k,m[0],b[m[0]])}</div>`).join("")}
  ${extraRow(r,k,b)}
  <div class="row" style="margin-top:14px"><button class="btn" onclick="voice('${k}')">${ic("chat","s")} ${b.note?"Edit note":"Voice note"}</button><span class="grow"></span><button class="btn" ${S.ci?"":"disabled"} onclick="S.ci--;render()">‹ Prev</button><button class="btn p" onclick="${S.ci<open.length-1?"S.ci++;render()":"sendCrew()"}">${S.ci<open.length-1?"Next ›":"Send crew"}</button></div>
 </div></div>`;
}
function rowByKey(k){return crewRows().find(r=>rowKey(r)===k)}
function tap(k,m,v){const b=bState(rowByKey(k));b[m]=b[m]===v?null:v;if(b[m]!=="nw")delete b.why[m];render()}
function why(k,m,w){const b=bState(rowByKey(k)),a=b.why[m]=b.why[m]||[];const i=a.indexOf(w);i<0?a.push(w):a.splice(i,1);render()}
function keep(k,w){bState(rowByKey(k)).keep=w;render()}
function fillSolid(){const open=crewRows().filter(r=>r.st!=="Submitted");let n=0;open.forEach(r=>{const b=bState(r);METRICS.forEach(m=>{if(!b[m[0]])n++})});
 if(!n){toast("Nothing empty to fill.");return}
 openModal(`<h3>Set ${n} empty ratings to Solid?</h3><p class="dim" style="margin:0 0 12px">Only empty cells change. Anything you already tapped stays. You can still change any rating before sending.</p><div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" onclick="crewRows().filter(r=>r.st!=='Submitted').forEach(r=>{const b=bState(r);METRICS.forEach(m=>{if(!b[m[0]])b[m[0]]='ok'})});closeModal();render();toast('${n} ratings set to Solid.')">Set to Solid</button></div>`,460)}
function voice(k){const r=rowByKey(k),b=bState(r),e=E(r.eid);
 openModal(`<h3>Voice note · ${esc(e.name)}</h3><p class="dim" style="margin:0 0 12px">Hold to talk. It's typed out for you; edit if needed. ${e.lang==="ES"?"The worker sees it in Spanish.":""}</p>
 <div class="micbig" id="micb" onclick="this.classList.add('rec');this.innerHTML='Listening…';setTimeout(()=>{const t=document.getElementById('vnote');t.value=t.value||'Good week on the east slope. Tie-off was solid. Needs to bag debris before lunch, not end of day.';this.classList.remove('rec');this.innerHTML='🎤 Tap to add more'},1600)">🎤 Tap and talk</div>
 <textarea class="finp ta" id="vnote" style="margin-top:12px" placeholder="Transcript appears here">${esc(b.note)}</textarea>
 <div class="mf"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn p" onclick="bState(rowByKey('${k}')).note=$('#vnote').value.trim();closeModal();render()">Save note</button></div>`,520)}
function sendCrew(){const rows=crewRows().filter(r=>r.st!=="Submitted"),ready=rows.filter(rowDone),miss=rows.filter(r=>!rowDone(r));
 if(!ready.length){toast("Rate at least one worker fully to send.");return}
 const val={nw:2,ok:3,st:5};
 ready.forEach(r=>{const b=bState(r),rt=Math.round(METRICS.reduce((a,m)=>a+val[b[m[0]]],0)/3);
  if(r.kind==="mgr"){const p=r.p;p.mgr.st="Submitted";p.rating=rt;p.ans=p.ans||{};p.ans.batch=JSON.parse(JSON.stringify(b));if(p.self.st==="Submitted"){p.st="Manager submitted";p.exc=null}else p.st="Manager in progress";log(p,`Crew review sent (Safety ${lvl3(b.s)[2]}, Quality ${lvl3(b.q)[2]}, Reliability ${lvl3(b.r)[2]})`,"g",ME)}
  else if(r.kind==="c"){const x=r.p.contrib.find(x=>x.by===ME);x.st="Submitted";log(r.p,`Borrowed-worker rating sent (${r.hrs} hrs)`,"g",ME)}
  else{r.auto.st="Submitted";r.auto.res=b}
  r.st="Submitted"});
 render();toast(`Sent ${ready.length} review${ready.length>1?"s":""}.${miss.length?` ${miss.length} still need a tap or reason.`:" Crew done."}`)}
function reopenRow(k){const r=rowByKey(k);if(r.kind==="mgr"){r.p.mgr.st="In progress";if(r.p.st==="Manager submitted")r.p.st="Manager in progress"}else if(r.kind==="c")r.p.contrib.find(x=>x.by===ME).st="In progress";else r.auto.st="Not started";render()}

/* --- Jobsite Context sheet --- */
function ctxSheet(eid,k){const e=E(eid),hs=hoursBySite(e),tot=hs.reduce((a,h)=>a+h[1],0),wk=weeks(e),sl=safetyLog(e),last=D.packets.find(p=>p.cid==="c6"&&p.eid===eid);
 openDrawer({label:"Jobsite context",avatar:initials(e.name),title:esc(e.name),sub:`${e.title} · ${crewName(e.crew)} · hired ${e.hire}`,w:560,
 body:`<div class="card"><div class="hd"><h3>Hours this quarter</h3><span class="dim sm">${tot} hrs · from time cards</span></div><div class="bd">${hs.map(h=>`<div class="hb2"><div><b>${esc(h[0])}</b><div class="dim sm">${esc(h[2])}${h[2]===ME?" (you)":""}${h[1]<40?" · under 40 hrs, doesn't review":""}</div></div><div class="bar b"><span style="width:${pct(h[1],tot)}%"></span></div><b class="tab-num">${h[1]}</b></div>`).join("")}
  ${hs.length>1?`<div class="note sm" style="margin-top:10px">Rotation rule: each foreman with 40+ hrs rates the same 3 metrics. The quarter score is weighted by hours, so ${esc(hs[0][2])} (${pct(hs[0][1],tot)}%) counts most.</div>`:""}</div></div>
 <div class="card"><div class="hd"><h3>Attendance · last 12 weeks</h3></div><div class="bd"><div class="wk">${wk.map((w,i)=>`<i class="${w}" title="Week ${i+1}: ${w==="ok"?"on time":w==="late"?"late arrival":"missed day"}"></i>`).join("")}</div><div class="dim sm" style="margin-top:6px">■ on time · <span style="color:var(--amber)">■</span> late · <span style="color:var(--red)">■</span> missed</div></div></div>
 <div class="card"><div class="hd"><h3>Safety log</h3></div><div class="bd sm">${sl.length?sl.map(x=>`<div style="padding:4px 0"><b>${x[0]}</b> · ${esc(x[1])} <span class="dim">· ${esc(x[2])}</span></div>`).join(""):'<span class="dim">No incidents or observations this quarter.</span>'}</div></div>
 <div class="card"><div class="hd"><h3>Badges</h3></div><div class="bd">${e.certs.map(c=>`<span class="chip3 ${c.s==="active"?"ok":c.s==="expired"?"nw":"wa"} on" style="margin:0 6px 6px 0">${c.n} · ${c.s==="active"?"valid":c.s} ${c.d}</span>`).join("")}${last?`<div class="dim sm" style="margin-top:8px">Last review: ${last.rating} · ${D.settings.levels[last.rating-1]} (Q2)</div>`:""}</div></div>`,
 foot:`<button class="btn" onclick="closeLayer();openProfile(${eid},'Performance & Skills')">Full profile</button><button class="btn p" onclick="closeLayer()">Back to crew</button>`})}

/* --- WORKER: 2-minute micro check-in (phone) --- */
const CK_TXT={EN:{t:"Quarter check-in",hi:"Hi Miguel 👋",sub:"About 2 minutes. Tap your answers.",n:"Anything your foreman should know?",tap:"Hold to talk",lis:"Listening…",send:"Send",done:"Thanks, Miguel!",dsub:"Luis sees your answers after he sends his review. You'll get a text when results are ready.",opt:"Optional",again:"Start over"},
 ES:{t:"Registro trimestral",hi:"Hola Miguel 👋",sub:"Unos 2 minutos. Toque sus respuestas.",n:"¿Algo que su capataz deba saber?",tap:"Mantenga para hablar",lis:"Escuchando…",send:"Enviar",done:"¡Gracias, Miguel!",dsub:"Luis verá sus respuestas después de enviar su evaluación. Recibirá un mensaje cuando estén los resultados.",opt:"Opcional",again:"Empezar de nuevo"}};
function checkinPhone(live){const L=live?S.ckLang:(S.pv&&S.pv.lang)||"EN",X=CK_TXT[L],ck=live?S.ck:{step:"q",a:{},note:""},qs=TPLQ.t1[0].qs;
 const tg=`<div class="lang"><button class="${L==="EN"?"on":""}" onclick="${live?"S.ckLang='EN';render()":"S.pv.lang='EN';previewTpl('t1')"}">EN</button><button class="${L==="ES"?"on":""}" onclick="${live?"S.ckLang='ES';render()":"S.pv.lang='ES';previewTpl('t1')"}">ES</button></div>`;
 if(ck.step==="done")return `<div class="phone2"><div class="sbar"><span>9:41</span><span>●●● ▮</span></div><div class="abar"><span class="back">‹</span><b>${X.t}</b>${tg}</div><div class="ascroll"><div class="mf" style="text-align:center;padding:40px 18px"><div style="font-size:54px">✅</div><div class="b" style="font-size:20px;margin:10px 0">${X.done}</div><div class="dim">${X.dsub}</div><button class="btn" style="margin-top:20px" onclick="S.ck={step:'q',a:{},note:''};render()">${X.again}</button></div></div></div>`;
 const q=(i)=>{const x=qs[i],sel=ck.a[i]??(x.type==="Multi-select"?[]:null);return `<div class="cq"><div class="lbl">${esc(L==="ES"?x.es:x.t)}${x.req?"":` <span class="dim sm">· ${X.opt}</span>`}</div><div class="big ${x.type==="Multi-select"?"multi":""}">${x.o.map((o,j)=>{const on=x.type==="Multi-select"?sel.includes(j):sel===j;return `<button class="${on?"on":""}" ${live?`onclick="ckTap(${i},${j})"`:""}>${esc(L==="ES"?o[1]:o[0])}</button>`}).join("")}</div></div>`};
 const ready=ck.a[0]!=null&&ck.a[1]!=null;
 return `<div class="phone2"><div class="sbar"><span>9:41</span><span>●●● ▮</span></div><div class="abar"><span class="back">‹</span><b>${X.t}</b>${tg}</div>
 <div class="ascroll"><div class="mf"><div><div class="b" style="font-size:20px">${X.hi}</div><div class="dim sm">${X.sub} · Q4 2026</div><div class="prog" style="margin-top:8px"><span style="width:${pct(Object.keys(ck.a).length+(ck.note?1:0),4)}%"></span></div></div>
 ${q(0)}${q(1)}${q(2)}
 <div class="cq"><div class="lbl">${X.n} <span class="dim sm">· ${X.opt}</span></div><button class="micbtn ${ck.rec?"rec":""}" ${live?`onclick="ckRec()"`:""}>🎤 ${ck.rec?X.lis:X.tap}</button>${ck.note?`<div class="tx">“${esc(ck.note)}”</div>`:""}</div>
 </div></div><div class="abot"><button class="btn p" style="width:100%;justify-content:center;height:52px;font-size:16px" ${live?(ready?`onclick="S.ck.step='done';log(PK(D.packets.find(p=>p.cid==='c1'&&p.eid===EN('Miguel Torres').id).id),'Self check-in submitted from phone','g','Miguel Torres');render()"`:'aria-disabled="true" onclick="toast(\'Tap an answer for the first two questions.\')"'):""}>${X.send}</button></div></div>`}
function ckTap(i,j){const x=TPLQ.t1[0].qs[i];if(x.type==="Multi-select"){const a=S.ck.a[i]=S.ck.a[i]||[];const k=a.indexOf(j);k<0?a.push(j):a.splice(k,1)}else S.ck.a[i]=j;render()}
function ckRec(){S.ck.rec=true;render();setTimeout(()=>{S.ck.rec=false;S.ck.note=S.ckLang==="ES"?"Necesitamos más arneses en Maple Ridge. Quiero aprender a manejar el boom lift.":"We need more harnesses on Maple Ridge. I want to learn the boom lift.";render()},1800)}
V.checkin=()=>`<div class="phonewrap"><div class="pdesc"><h1 style="font-size:24px;margin:0 0 8px">Worker micro check-in</h1><p class="dim">What Miguel sees after tapping the text link. No app login, no password.</p><ul class="plain"><li>3 one-tap questions, big targets</li><li>Full English / Spanish toggle (top right)</li><li>Hold-to-talk voice note, typed out automatically</li><li>About 2 minutes. Only the first two answers are required</li></ul><p class="dim sm">Replaces the 8-question self review with written answers.</p></div>${checkinPhone(true)}</div>`;
const _prevTpl=previewTpl;
previewTpl=function(id){if(id!=="t1")return _prevTpl(id);S.pv=S.pv||{lang:"EN"};openDrawer({title:"Preview · Worker Micro Check-in",sub:"4 questions · ~2 min · opened from a text link in the Lumber app",w:640,body:`<div class="row" style="justify-content:space-between"><span class="dim sm">Tap EN / ES on the phone to switch language.</span><button class="btn s" onclick="closeLayer();S.role='worker';nav('checkin')">Try it as Miguel</button></div>${checkinPhone(false)}`,foot:`<button class="btn" onclick="closeLayer()">Close</button><button class="btn p" onclick="closeLayer();openBuilder('t1')">Edit questionnaire</button>`})};

/* --- OUTLIER CHECK (optional lightweight calibration) --- */
function outliers(){if(!D.packets)return[];const pool=D.packets.filter(p=>["c1","c2"].includes(p.cid)&&p.rating&&["Manager submitted","In calibration","Manager in progress"].includes(p.st)&&p.mgr.st==="Submitted");
 const avg=pool.reduce((a,p)=>a+p.rating,0)/Math.max(1,pool.length);const by={};pool.forEach(p=>{(by[p.mgr.by]=by[p.mgr.by]||[]).push(p.rating)});
 const fav=f=>by[f].reduce((a,b)=>a+b,0)/by[f].length;S.oc=S.oc||{};
 return pool.map(p=>{const b=(p.ans||{}).batch,why=[];if(p.rating<=2)why.push(`Rated ${p.rating} · ${D.settings.levels[p.rating-1]}`);if(b&&b.s==="nw")why.push("Safety marked Needs work");if(by[p.mgr.by].length>1&&Math.abs(fav(p.mgr.by)-avg)>=0.7)why.push(`${p.mgr.by.split(" ")[0]} rates ${fav(p.mgr.by).toFixed(1)} vs company ${avg.toFixed(1)}`);if(p.rating===5)why.push("Standout across the board");return{p,why,done:S.oc[p.id]}}).filter(o=>o.why.length);}
function outlierPanel(scope){const all=outliers().filter(o=>!scope||o.p.cid===scope),open=all.filter(o=>!o.done);const pool=D.packets.filter(p=>(!scope||p.cid===scope)&&p.rating&&["Manager submitted","In calibration"].includes(p.st));
 return `<div class="note" style="margin-bottom:14px"><b>Optional.</b> Instead of comparing every rating, Lumber only flags the ones that look unusual: safety marked Needs work, very low or very high scores, or a foreman who rates far from the company norm. Everything else (${Math.max(0,pool.length-all.length)}) is cleared automatically.</div>
 <div class="card"><div class="hd"><h3>${open.length} to look at</h3>${open.length?`<button class="btn s p" onclick="outliers().forEach(o=>S.oc[o.p.id]='ok');D.packets.filter(p=>p.st==='In calibration'||p.st==='Manager submitted').forEach(p=>{if(p.mgr.st==='Submitted'&&p.rating)p.st='Approved'});render();toast('All checked. Ratings are ready to share.')">Looks right · confirm all</button>`:""}</div>
 ${all.length?all.map(o=>{const e=E(o.p.eid);return `<div class="att ${o.done?"odone":""}"><span class="sev ${o.why.some(w=>/Safety|Rated [12]/.test(w))?"r":"a"}"></span><div class="who grow" style="align-items:flex-start">${av(e.name,30)}<div><div class="t">${esc(e.name)} <span class="dim sm">· ${esc(o.p.mgr.by)} · ${cycOf(o.p).name.replace(" Field Crew Check-in","")}</span></div><div class="d">${o.why.join(" · ")}</div></div></div><span class="pill b">${o.p.adj||o.p.rating} · ${D.settings.levels[(o.p.adj||o.p.rating)-1]}</span>
  ${o.done?`<span class="pill ${o.done==="ok"?"g":"a"}">${o.done==="ok"?"Confirmed":o.done==="ask"?"Asked foreman":"Adjusted"}</span>`:`<div class="row acts"><button class="btn xs" onclick="S.oc[${o.p.id}]='ok';render()">Looks right</button><button class="btn xs" onclick="S.oc[${o.p.id}]='ask';render();toast('Asked ${esc(o.p.mgr.by.split(" ")[0])} to take another look. One tap for him to confirm or change.')">Ask foreman</button><button class="btn xs" onclick="adjustOne(${o.p.id})">Adjust</button></div>`}</div>`}).join(""):`<div class="empty"><b>Nothing unusual</b>All ratings are within the normal range.</div>`}</div>`}
function adjustOne(pid){const p=PK(pid);reasonModal({title:`Adjust ${E(p.eid).name}'s rating`,desc:"Both the foreman's rating and yours are kept. The foreman is told.",confirm:"Save",extra:`<div><label class="fl">New rating</label><select class="inp" id="adjv">${[1,2,3,4,5].map(r=>`<option value="${r}" ${r===p.rating?"selected":""}>${r} · ${D.settings.levels[r-1]}</option>`).join("")}</select></div>`,onOk:r=>{p.adj=+$("#adjv").value;p.adjReason=r;S.oc[pid]="adj";log(p,`Rating adjusted ${p.rating} → ${p.adj} · ${r}`,"a");closeModal();render()}})}
function cycCalibration(c,ps){return outlierPanel(c.id)}

/* --- SUPERINTENDENT --- */
V.crews=()=>{const fm=D.crews.map(c=>{const ps=D.packets.filter(p=>p.cid==="c1"&&p.exc!=="Removed"&&p.mgr.by===c.fm);const d=ps.filter(p=>p.mgr.st==="Submitted").length;return{c,ps,d}});
 return `<div class="ph"><div><h1>Crews</h1><div class="sub">Dana Whitfield · Superintendent · 4 foremen · Q4 2026 crew reviews due Oct 30</div></div><button class="btn" onclick="nav('outliers')">Outlier check${outliers().filter(o=>!o.done).length?` · ${outliers().filter(o=>!o.done).length}`:""}</button></div>
 <div class="card"><div class="tw"><table class="tbl"><thead><tr><th>Foreman</th><th>Crew</th><th>Reviews sent</th><th>Borrowed workers</th><th>Last activity</th><th></th></tr></thead><tbody>${fm.map(x=>`<tr><td><div class="who">${av(x.c.fm,30)}<b>${x.c.fm}</b></div></td><td>${x.c.name} · ${x.ps.length} people</td><td style="min-width:180px"><div class="row" style="flex-wrap:nowrap;gap:8px"><div class="bar grow"><span style="width:${pct(x.d,x.ps.length)}%"></span></div><span class="sm tab-num">${x.d}/${x.ps.length}</span></div></td><td>${x.c.fm===ME?"2":x.c.fm==="Tom Hayes"?"1":"0"}</td><td class="dim sm">${["Today 7:12 AM","Yesterday","Oct 27","Oct 24"][D.crews.indexOf(x.c)]}</td><td>${x.d<x.ps.length?`<button class="btn xs" onclick="toast('Text sent to ${x.c.fm}: ${x.ps.length-x.d} crew reviews left, about ${Math.ceil((x.ps.length-x.d)*0.6)} minutes.')">Nudge</button>`:'<span class="pill g">Done</span>'}</td></tr>`).join("")}</tbody></table></div></div>
 <div class="card" style="margin-top:16px"><div class="hd"><h3>Workers who rotated between crews</h3><span class="dim sm">Each foreman with 40+ hrs rates; weighted by hours</span></div><div class="bd">${D.emps.filter(e=>e.rot||e.sites.length>1).slice(0,5).map(e=>`<div class="form-row"><button class="link" onclick="openProfile(${e.id},'Performance & Skills')">${esc(e.name)}</button><span class="grow"></span>${hoursBySite(e).map(h=>`<span class="tag">${esc(h[2])} · ${h[1]} hrs</span>`).join(" ")}</div>`).join("")}</div></div>`};
V.outliers=()=>`<div class="ph"><div><h1>Outlier Check</h1><div class="sub">One pass before results are shared. Off by default; turned on per cycle.</div></div></div>${outlierPanel()}`;

/* --- HR: Automatic Reviews (no manual cycles) --- */
V.auto=()=>`<div class="ph"><div><h1>Automatic Reviews</h1><div class="sub">Rules start reviews on their own. Nobody creates a cycle for a 90-day or anniversary check.</div></div></div>
 <div class="grid2l"><div class="card"><div class="hd"><h3>Rules</h3></div>${D.rules.map(r=>`<div class="att"><label class="sw" title="On or off"><input type="checkbox" ${r.on?"checked":""} onchange="D.rules.find(x=>x.id==='${r.id}').on=this.checked;toast('${r.n} turned '+(this.checked?'on':'off')+'.')"><span></span></label><div class="grow"><div class="t">${r.n}</div><div class="d">${r.trig} → ${r.who} · ${r.form} · ${r.due}${r.note?`<br>${r.note}`:""}</div></div><button class="btn xs" onclick="toast('Edit drawer: trigger, reviewer, form and due date.')">Edit</button></div>`).join("")}</div>
 <div class="card"><div class="hd"><h3>Next 30 days</h3><span class="dim sm">Created automatically</span></div><div class="tw"><table class="tbl"><thead><tr><th>Worker</th><th>Review</th><th>Reviewer</th><th>Status</th></tr></thead><tbody>${D.auto.map(a=>`<tr><td>${esc(E(a.eid).name)}</td><td>${a.kind}<div class="dim sm">${a.sub}</div></td><td>${a.by}</td><td>${pill(a.merged?"Merged":a.st==="Submitted"?"Submitted":a.st==="Scheduled"?"Scheduled":"In progress")}</td></tr>`).join("")}</tbody></table></div></div></div>
 <div class="note" style="margin-top:14px"><b>Overlap rule:</b> if an automatic review falls inside an open crew review for the same person (like Eddie Morales' 5-year anniversary in Q4), it is merged into that review instead of creating a second one.</div>`;
PILL["Merged"]="v";PILL["Scheduled"]="b";

/* --- EMPLOYEE: Performance & Skills profile --- */
function tierIdx(e){return /Foreman/.test(e.title)?4:/Lead/.test(e.title)?3:/Apprentice|new hire/.test(e.title)?1:/Laborer/.test(e.title)?0:2}
function badgeFor(e,n){const c=e.certs.find(c=>c.n===n);if(c)return c;const h=(e.id*13+n.length)%5;return h===0?{n,s:"active",d:"03/31/2028"}:h===1&&n!=="OSHA 30"?{n,s:"active",d:"01/31/2027"}:null}
function openProfile(eid,tab){const e=E(eid);if(tab==="Performance")tab="Performance & Skills";S.prTab=tab||S.prTab||"Employee Info";
 const PT=["Employee Info","Manager & Reports","Credentials","Projects","Assignments","Performance & Skills"];
 const R=S.role||"admin",F=R==="foreman",mine=F?crewRows().filter(r=>r.eid===eid):[],inScope=!F||mine.length||e.mgr===ME||e.name===ME,showPay=R==="admin";
 const frow=(l,v)=>`<div class="frow"><label>${l}</label><input class="inp" value="${esc(v)}" readonly></div>`;
 let body;
 if(S.prTab==="Performance & Skills"){
  if(!inScope)body=`<div class="card"><div class="empty"><b>Performance details are private</b>Only ${esc(e.name.split(" ")[0])}'s reviewers, superintendent and HR can see them.</div></div>`;
  else{const ti=tierIdx(e),hist=["c6","c2","c1"].map(c=>D.packets.find(p=>p.eid===eid&&p.cid===c)).filter(p=>p&&p.rating);
   const nxt=TIERS[Math.min(ti+1,4)][0];const req=ti>=4?[]:[[`${ti>=2?"OSHA 30":"OSHA 10"}`,!!badgeFor(e,ti>=2?"OSHA 30":"OSHA 10")],["2 Standout crew reviews",hist.filter(p=>p.rating===5).length>=2],[`${[500,1000,2000,4000][ti]||2000}+ hrs in trade`,e.hrs*4>=([500,1000,2000,4000][ti]||2000)],[ti>=2?"First Aid / CPR":"Fall Protection",!!badgeFor(e,ti>=2?"First Aid / CPR":"Fall Protection")]];
   const comp=[["Safety / PPE",(eid%3)+1],["Quality / Rework",((eid+1)%3)+1],["Reliability",((eid+2)%3)+1],[e.trade==="Roofer"?"Tear-off & dry-in":"Layout & framing",2],[e.trade==="Roofer"?"Flashing & details":"Reading plans",(eid%2)+2]];
   body=(F&&mine.length?`<div class="card"><div class="bd row" style="justify-content:space-between"><div><b>Your Q4 review of ${esc(e.name.split(" ")[0])}</b><div class="dim sm">${mine[0].st==="Submitted"?"Sent":"Not sent yet"} · Crew Review</div></div><button class="btn p" onclick="closeLayer();nav('crew')">${mine[0].st==="Submitted"?"View in crew review":"Rate in crew review"}</button></div></div>`:"")
   +(typeof profReviews==="function"?profReviews(e,R):"")+`

   <div class="card"><div class="hd"><h3>Badges</h3><span class="dim sm">Used for dispatch. From credential management.</span></div><div class="bd badges">${BADGES.map(b=>{const c=badgeFor(e,b[0]);return `<div class="bdg ${c?c.s:"none"}"><div class="bi">${c?c.s==="expired"?"!":"✓":"+"}</div><div><b>${b[0]}</b><div class="dim sm">${c?(c.s==="active"?"Valid until ":c.s==="expired"?"Expired ":"Expires ")+c.d:"Not held · "+b[1]}</div></div></div>`}).join("")}</div></div>

`}
 }else if(S.prTab==="Employee Info")body=`<div class="card"><div class="bd"><div class="b" style="margin-bottom:10px">General Information</div>${frow("First Name",e.name.split(" ")[0])}${frow("Last Name",e.name.split(" ").slice(1).join(" "))}${frow("Employee ID",e.code)}${frow("Job Title",e.title)}${frow("Hire Date",e.hire)}${frow("Language",e.lang==="ES"?"Spanish":"English")}</div></div>`;
 else if(S.prTab==="Manager & Reports")body=`<div class="card"><div class="bd">${frow("Manager",e.mgr)}${frow("Crew",crewName(e.crew))}${frow("Department",e.dept)}</div></div>`;
 else if(S.prTab==="Credentials")body=`<div class="card"><div class="bd">${e.certs.map(x=>`<div class="form-row"><b class="grow">${x.n}</b><span class="pill ${x.s==="active"?"g":x.s==="expired"?"r":"a"}">${x.s==="active"?"Valid":x.s==="expired"?"Expired":"Expiring"} · ${x.d}</span></div>`).join("")||"None on file."}</div></div>`;
 else if(S.prTab==="Projects")body=`<div class="card"><div class="bd">${hoursBySite(e).map(h=>`<div class="form-row"><b class="grow">${esc(h[0])}</b><span class="dim">${h[1]} hrs · ${esc(h[2])}</span></div>`).join("")}</div></div>`;
 else body=`<div class="card"><div class="empty"><b>No open assignments</b>Onboarding and form tasks show here.</div></div>`;
 openDrawer({label:"Employee Details",avatar:initials(e.name),title:esc(e.name),sub:`${e.title} · ${crewName(e.crew)}`,w:1000,status:`<span class="dstat"><i></i>Enabled ▾</span>`,
  tabs:`<div class="dtabs">${PT.map(t=>`<button class="${S.prTab===t?"on":""}" onclick="openProfile(${eid},'${t}')">${t}${t==="Performance & Skills"?' <span class="new" style="margin-left:4px">NEW</span>':""}</button>`).join("")}</div>`,body,hist:"toast('Profile change history opens here.')",
  foot:`<button class="btn" onclick="closeLayer()">Cancel</button><button class="btn p" onclick="closeLayer();toast('Saved.')">Save</button>`});
}

/* --- foreman "All My Reviews": crew rows point to Crew Review --- */
const _myrev=V.myreviews;
V.myreviews=()=>_myrev().replace("Reviews you owe as a foreman. You can also write them from each person's profile.","Crew reviews are faster in Crew Review. Use this list for detailed reviews (office staff, PIPs) and history.");

init(false);render();
