// Birth date is typed as dd/mm/yyyy (slashes auto-inserted), invalid dates are rejected, calendar picker stays in sync.
const {chromium,devices}=require('playwright');const port=process.argv[2]||'8766';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7'],locale:'en-US'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(`http://localhost:${port}/`,{waitUntil:'networkidle'});await p.waitForTimeout(500);
console.log('placeholder:',await p.getAttribute('#datev-p1','placeholder'));
await p.click('#datev-p1');await p.keyboard.type('08082002');console.log('typed shows:',await p.inputValue('#datev-p1'));
await p.press('#datev-p1','Tab');await p.waitForTimeout(200);console.log('stored:',await p.evaluate(()=>window.__AF.state.people[0].date));
await p.fill('#datev-p2','31/02/2002');await p.press('#datev-p2','Tab');await p.waitForTimeout(200);console.log('invalid ->',await p.evaluate(()=>window.__AF.state.people[1].date||'(trống)'),'|',await p.textContent('#dw-p2'));
await p.fill('#datev-p2','');await p.click('#datev-p2');await p.keyboard.type('11/6/2002');await p.press('#datev-p2','Tab');await p.waitForTimeout(200);console.log('11/6/2002 ->',await p.evaluate(()=>window.__AF.state.people[1].date),'shows',await p.inputValue('#datev-p2'));
await p.$eval('#date-p2',el=>{el.value='2002-06-12';el.dispatchEvent(new Event('change',{bubbles:true}))});await p.waitForTimeout(200);console.log('calendar sync ->',await p.inputValue('#datev-p2'));
await p.screenshot({path:'/tmp/claude-0/-home-claude/89c2b02f-5cee-5739-af09-8403ffbcddb8/scratchpad/date.png',clip:{x:0,y:0,width:412,height:900}});
await p.reload();await p.waitForTimeout(400);console.log('after reload shows:',await p.inputValue('#datev-p1'));
console.log('ERRS',errs);await b.close()})();
