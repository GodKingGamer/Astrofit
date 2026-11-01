const {JSDOM}=require('jsdom');const fs=require('fs');
const dom=new JSDOM(fs.readFileSync(process.argv[2],'utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/#demo'});
const w=dom.window,d=w.document;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
const T=el=>{let s='';el.querySelectorAll('h3,h4,p,li,.ex,.banner,td').forEach(x=>{if(!x.closest('li')||x.tagName==='LI')s+='\n'+x.textContent});return s};
setTimeout(()=>{console.log('=== NATAL ===',T(d.getElementById('natReading')));console.log('\n=== SYN ===',T(d.getElementById('synReading')));console.log('ERRS',errs)},2000);
