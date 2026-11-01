// Typo guard: a birth year in the future shows a warning and is left out of scoring; fixing it brings the pair back.
const {chromium,devices}=require('playwright');const port=process.argv[2]||'8766';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(`http://localhost:${port}/`,{waitUntil:'networkidle'});await p.waitForTimeout(600);
const set=async(k,f,v)=>{await p.$eval(`[data-card="${k}"] [data-f="${f}"]`,(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))},v)};
await set('p1','name','Hoàng Trung Đức');await set('p1','date','2027-08-08');await set('p1','time','08:00');
await set('p2','name','Nguyễn Phương Thảo');await set('p2','date','2002-06-11');await set('p2','time','05:30');await p.waitForTimeout(400);
console.log('warning shown:',await p.isVisible('#dw-p1'),'|',await p.textContent('#dw-p1'));
await p.click('[data-tab="hop-doi"]');console.log('syn with typo:',(await p.textContent('#synSub')).slice(0,80));
await p.click('[data-tab="nhap"]');await set('p1','date','2002-08-08');await p.waitForTimeout(300);console.log('warning after fix:',await p.isVisible('#dw-p1'));
await p.click('[data-tab="hop-doi"]');console.log('syn fixed:',(await p.textContent('#synMetrics')).replace(/\s+/g,' ').slice(0,60));
console.log('ERRS',errs);await b.close()})();
