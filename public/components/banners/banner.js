/* ===== Feedback banner (Figma: Prince's Cauldron · "Feedkack Banners" 7722:20392)
   banner(type, content, opts?) → HTML string
     type     "info" | "warning" | "error" | "gray"
     content  HTML string (escape user data yourself)
     opts.cls extra class names · opts.id element id · opts.live true = announce to screen readers when it appears
   See README.md in this folder. ===== */
const BANNER_TYPES={
 info:{icon:"info-blue.svg",role:"note"},
 warning:{icon:"alert-warning.svg",role:"alert"},
 error:{icon:"alert-error.svg",role:"alert"},
 gray:{icon:"info-gray.svg",role:"note"}};
function banner(type,content,opts={}){
 const t=BANNER_TYPES[type]||BANNER_TYPES.info,k=BANNER_TYPES[type]?type:"info";
 const role=opts.live?t.role:"note";
 return `<div class="lb-banner lb-banner--${k}${opts.cls?" "+opts.cls:""}"${opts.id?` id="${opts.id}"`:""} role="${role}">`+
  `<span class="lb-banner__icon"><img src="/components/banners/icons/${t.icon}" width="16" height="16" alt=""></span>`+
  `<p class="lb-banner__text">${content}</p></div>`}
