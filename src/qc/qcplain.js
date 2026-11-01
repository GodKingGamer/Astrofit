const {JSDOM}=require('jsdom');const fs=require('fs');
const dom=new JSDOM(fs.readFileSync(process.argv[2],'utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/'});
const w=dom.window,d=w.document;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
setTimeout(()=>{
 const grab=()=>{let t='';for(const id of ['natSub','natMetrics','natScores','natList','natDetail','natReading','natAspTable','grpBody','synMetrics','synScores','synList','synDetail','synReading','synWarn'])t+=' '+d.getElementById(id).textContent;return t};
 d.querySelector('[data-tab="van-han"]').click();
 let txt=grab()+' '+d.getElementById('trList').textContent+' '+d.getElementById('trGantt').textContent;
 const J=['Mặt Trời','Mặt Trăng','Thủy Tinh','Kim Tinh','Hỏa Tinh','Mộc Tinh','Thổ Tinh','Thiên Vương','Hải Vương','Diêm Vương','Thiên Đỉnh','chủ tinh','chủ nhà','góc chiếu','Góc chiếu','nghịch hành','Nút Bắc','Nút Nam','hợp nhất','tam hợp','lục hợp','stellium','Placidus','Chiron','Lilith',' nhà 1',' nhà 2',' nhà 3',' nhà 4',' nhà 5',' nhà 6',' nhà 7',' nhà 8',' nhà 9','☌','△','□','☍','⚹','lệch '];
 const hits=J.map(j=>[j,(txt.split(j).length-1)]).filter(x=>x[1]);console.log('jargon hits (Tên chuyên môn line is intentional):',JSON.stringify(hits));
 const tc=(d.getElementById('natDetail').textContent.match(/Tên chuyên môn[^.]*\./)||[''])[0];console.log('expert line:',tc);
 // simulate unknown time to cover sim panel
 const fire=(id,v)=>{const el=d.getElementById(id);if(el.type==='checkbox')el.checked=v;else el.value=v;el.dispatchEvent(new w.Event('change',{bubbles:true}))};
 fire('unk-p1',true);d.querySelector('[data-tab="ca-nhan"]').click();const st=d.getElementById('natSim').textContent+d.getElementById('natWarn').textContent;
 console.log('sim jargon:',JSON.stringify(J.map(j=>[j,(st.split(j).length-1)]).filter(x=>x[1])));
 console.log('sample reading:',d.getElementById('natReading').textContent.slice(0,700));
 console.log('sample syn item:',d.getElementById('synReading').querySelector('li')?.textContent.slice(0,300));
 console.log('sample radar why:',d.getElementById('natScores').textContent.slice(0,300));
 console.log('ERRS',JSON.stringify(errs));
},2500);
