// First-open test on a phone: blank inputs, lands on input tab, then fill two people (one unnamed) and check results render.
const {chromium,devices}=require('playwright');const port=process.argv[2]||'8766';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(`http://localhost:${port}/`,{waitUntil:'networkidle'});await p.waitForTimeout(800);
console.log('active tab:',await p.textContent('.tab[aria-selected="true"]'));
console.log('names blank:',await p.$$eval('[data-f="name"]',a=>a.map(i=>i.value)));
await p.screenshot({path:'/tmp/claude-0/-home-claude/89c2b02f-5cee-5739-af09-8403ffbcddb8/scratchpad/blank.png'});
const set=async(k,f,v)=>{await p.$eval(`[data-card="${k}"] [data-f="${f}"]`,(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))},v)};
await set('p1','name','Lan');await set('p1','date','1999-03-12');await set('p1','time','07:30');
await set('p2','date','2001-09-14');await set('p2','time','06:15');await p.waitForTimeout(500);
await p.click('[data-tab="hop-doi"]');await p.waitForTimeout(500);
console.log('syn:',(await p.textContent('#synMetrics')).replace(/\s+/g,' ').slice(0,110));
console.log('reading:',(await p.textContent('#synReading')).replace(/\s+/g,' ').slice(150,380));
await p.click('[data-tab="ca-nhan"]');console.log('natal title:',await p.textContent('#natTitle'));
await p.reload();await p.waitForTimeout(800);console.log('after reload keeps data:',await p.$$eval('[data-f="name"]',a=>a.map(i=>i.value)),'tab:',await p.textContent('.tab[aria-selected="true"]'));
p.on('dialog',d=>d.accept());await p.click('#btnReset');await p.waitForTimeout(300);console.log('after reset:',await p.$$eval('[data-f="name"]',a=>a.map(i=>i.value)));
console.log('ERRS',errs);await b.close()})();
