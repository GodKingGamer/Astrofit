const {JSDOM}=require('jsdom');const fs=require('fs');
const dom=new JSDOM(fs.readFileSync(process.argv[2],'utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/#demo'});
const w=dom.window,d=w.document;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
const fire=(id,v)=>{const el=d.getElementById(id);if(el.type==='checkbox')el.checked=v;else el.value=v;el.dispatchEvent(new w.Event('change',{bubbles:true}))};
setTimeout(()=>{const AF=w.__AF;
 // 1) UI: make Thảo (p2) unknown
 fire('unk-p2',true);console.log('sim fields visible:',!d.querySelector('[data-simf="p2"]').classList.contains('hidden'));
 d.querySelector('#segNat [data-person="p2"]').click();
 console.log('natSim panel:',d.getElementById('natSim').className,'|',d.getElementById('natSim').textContent.slice(0,260));
 console.log('group:',[...d.querySelectorAll('table.grp tbody tr')].map(r=>r.children[1].querySelector('b').textContent+'='+r.children[2].textContent.replace(/\s+/g,' ')).join(' | '));
 console.log('synWarn:',d.getElementById('synWarn').textContent.slice(0,200));console.log('bac foot:',d.querySelectorAll('#synMetrics .metric')[1].textContent);
 // narrow window + asc
 fire('win-p2','sang');console.log('after sáng window: n=',AF.simSamples(AF.state.people.find(p=>p.id==='p2')).keep.length);
 const ascBtn=d.querySelector('.ascrow');const s0=ascBtn.dataset.asc;ascBtn.click();console.log('asc click set',AF.state.people.find(p=>p.id==='p2').ascKnown===s0,'n=',AF.simSamples(AF.state.people.find(p=>p.id==='p2')).keep.length);
 fire('win-p2','custom');fire('sf-p2','22:00');fire('st-p2','02:00');const ss=AF.simSamples(AF.state.people.find(p=>p.id==='p2'));console.log('custom wrap window label',ss.label,'kept',ss.keep.length,'(asc filter may empty) empty panel msg:',d.getElementById('natSim').textContent.includes('Không có giờ nào'));
 d.querySelector('[data-asc="-1"][data-pid="p2"]')?.click();
 console.log('ERRS',JSON.stringify(errs));
 // 2) bias check: random pairs, one person simulated
 let seed=555;const rnd=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648};const pad=n=>String(n).padStart(2,'0');
 const per=u=>{const y=1960+Math.floor(rnd()*51),m=1+Math.floor(rnd()*12),dd=1+Math.floor(rnd()*28);return {id:'z',name:"X",date:`${y}-${pad(m)}-${pad(dd)}`,time:`${pad(Math.floor(rnd()*24))}:${pad(Math.floor(rnd()*60))}`,unknown:u,city:"hanoi",lat:"",lon:"",tz:7,simWin:'all',ascKnown:''}};
 const pc=[],cover=[];for(let i=0;i<120;i++){const known=per(false),b=AF.build(known),uk={...known,unknown:true};const ub=AF.build(uk);const a=AF.build(per(false));const sim=AF.simPair(a,ub);pc.push(sim.totalPct);const truth=AF.synastry(a,b).total;cover.push(truth>=sim.lo-0.05&&truth<=sim.hi+0.05)}
 pc.sort((x,y)=>x-y);console.log('sim one-unknown median percentile',pc[60].toFixed(1),'| true score inside sim 10-90% range:',(cover.filter(Boolean).length/cover.length*100).toFixed(0)+'%');
},2500);
