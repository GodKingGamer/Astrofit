// "Sao chép tóm tắt" must contain each person's birth data so results can be reproduced.
const {JSDOM}=require('jsdom');const fs=require('fs');
const dom=new JSDOM(fs.readFileSync(process.argv[2],'utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/#demo'});
const w=dom.window,d=w.document;const errs=[];w.addEventListener('error',e=>errs.push(e.message));let copied='';
w.navigator.clipboard={writeText:async t=>{copied=t}};
setTimeout(async()=>{const AF=w.__AF;const p=AF.state.people.find(x=>x.id==='p3');p.unknown=true;p.ascKnown="8";
 d.querySelector('[data-tab="nhap"]').click();d.querySelector('[data-tab="hop-doi"]').click();
 d.getElementById('btnCopy').click();await new Promise(r=>setTimeout(r,200));console.log(copied);
 const ok=['sinh 08/08/2002 lúc 08:00, Hà Nội, UTC+7','sinh 11/06/2002 lúc 05:30','không rõ giờ, cung mọc Nhân Mã'].every(s=>copied.includes(s));console.log('HAS BIRTH DATA:',ok,'ERRS',errs)},1500);
