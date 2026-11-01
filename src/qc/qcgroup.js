// Tapping any name in the group table/legend opens that person's detailed reading with the main person.
const {chromium,devices}=require('playwright');const port=process.argv[2]||'8766';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(`http://localhost:${port}/#demo`,{waitUntil:'networkidle'});await p.waitForTimeout(600);await p.click('[data-tab="hop-doi"]');await p.waitForTimeout(300);
const rows=await p.$$eval('table.grp tbody tr',t=>t.map(r=>r.querySelector('b').textContent));console.log('rows:',rows.join(' | '));
for(let i=0;i<rows.length;i++){await p.click(`table.grp tbody tr:nth-child(${i+1}) td:nth-child(2) b`);await p.waitForTimeout(250);
  const title=await p.textContent('#synTitle'),rd=(await p.textContent('#synReading'));const short=rows[i].trim().split(/\s+/).pop();
  console.log(`tap "${rows[i]}" -> title "${title}" | reading mentions: ${rd.includes(short)} | row marked: ${await p.$eval(`table.grp tbody tr:nth-child(${i+1})`,r=>r.classList.contains('sel'))}`)}
await p.click('#grpLegend button:last-child');await p.waitForTimeout(250);console.log('legend tap ->',await p.textContent('#synTitle'));
await p.screenshot({path:'/tmp/claude-0/-home-claude/89c2b02f-5cee-5739-af09-8403ffbcddb8/scratchpad/grp.png'});
console.log('ERRS',errs);await b.close()})();
