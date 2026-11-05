/* ===== Review Cycles table: bulk selection.
   Row checkboxes + a header "select all" (indeterminate when only some are picked). Selecting shows the same
   bulk action bar as the cycle detail Employees table (bulkBar in layer 17). Actions depend on the tab.
   Selection lives in S.sel (cycle ids are strings, so they never clash with packet ids); nav() clears it on tab change. ===== */
function clBulkActs(tab,sel){const ids=sel.map(id=>`'${id}'`).join(","),cs=sel.map(C);
 if(tab==="Active"){const A=[];
  if(cs.some(c=>c.status==="Active"))A.push(["send","Send reminders",`clBulkRemind([${ids}])`]);
  if(cs.some(c=>c.status==="Active"))A.push(["pause","Pause",`clBulkPause([${ids}])`]);
  if(cs.some(c=>c.status==="Paused"))A.push(["play","Resume",`clBulkResume([${ids}])`]);
  A.push(["copy","Duplicate",`clBulkDup([${ids}])`]);return A}
 if(tab==="Scheduled")return [["copy","Duplicate",`clBulkDup([${ids}])`],["x","Cancel launch",`clBulkCancel([${ids}])`,1]];
 if(tab==="Drafts")return [["copy","Duplicate",`clBulkDup([${ids}])`],["x","Delete",`clBulkDelete([${ids}])`,1]];
 return [["copy","Duplicate",`clBulkDup([${ids}])`],["down","Archive",`clBulkArchive([${ids}])`]]}
const clN=n=>`${n} cycle${n===1?"":"s"}`;
const clDone=()=>{S.sel=new Set();S.menu=null;closeModal();render()};
function clBulkRemind(ids){const n=ids.filter(id=>C(id).status==="Active").length;S.sel=new Set();S.menu=null;render();toast(`Reminders sent for ${clN(n)}. Only people with an open review are reminded.`)}
function clBulkPause(ids){const cs=ids.map(C).filter(c=>c.status==="Active"),n=D.packets.filter(p=>cs.some(c=>c.id===p.cid)&&p.exc!=="Removed").length;
 reasonModal({title:`Pause ${clN(cs.length)}?`,affected:`${n} packets pause. Reminders stop. Drafts are kept.`,desc:"Reviewers can't edit while a cycle is paused.",confirm:"Pause",danger:true,
  onOk:()=>{cs.forEach(c=>{c.status="Paused";c._paused=true});clDone();toast(`${clN(cs.length)} paused.`,()=>{cs.forEach(c=>c.status="Active");render()})}})}
function clBulkResume(ids){const cs=ids.map(C).filter(c=>c.status==="Paused");cs.forEach(c=>c.status="Active");S.sel=new Set();S.menu=null;render();toast(`${clN(cs.length)} resumed.`)}
function clBulkDup(ids){const made=ids.map(C).map(c=>{const n={...JSON.parse(JSON.stringify(c)),id:"c"+Date.now()+Math.random().toString(36).slice(2,6),name:c.name+" (copy)",status:"Draft",draftStep:1,createdISO:null};
  (n.phases||[]).forEach(p=>p.st="");D.cycles.unshift(n);return n});
 S.sel=new Set();S.menu=null;render();toast(`${clN(made.length)} duplicated as drafts.`,()=>{D.cycles=D.cycles.filter(c=>!made.includes(c));render()})}
function clBulkCancel(ids){const cs=ids.map(C);
 reasonModal({title:`Cancel launch for ${clN(cs.length)}?`,desc:"These cycles won't start. No one has been sent a review yet. You can duplicate them later.",confirm:"Cancel launch",danger:true,
  onOk:r=>{cs.forEach(c=>{c.status="Closed";c.closed="Cancelled"});D.activity.unshift({t:"Today",txt:`Anshika R. cancelled ${clN(cs.length)} before launch · ${r}`,c:"a"});clDone();toast(`${clN(cs.length)} cancelled.`)}})}
function clBulkDelete(ids){const cs=ids.map(C);
 reasonModal({title:`Delete ${cs.length===1?"draft":cs.length+" drafts"}?`,desc:"Drafts are moved to Archived for 30 days, then deleted.",confirm:"Delete",danger:true,needReason:false,
  onOk:()=>{cs.forEach(c=>c.status="Archived");clDone();toast(`${cs.length===1?"Draft":cs.length+" drafts"} deleted.`,()=>{cs.forEach(c=>c.status="Draft");render()})}})}
function clBulkArchive(ids){const cs=ids.map(C);cs.forEach(c=>c.status="Archived");S.sel=new Set();S.menu=null;render();toast(`${clN(cs.length)} archived.`,()=>{cs.forEach(c=>c.status="Closed");render()})}
