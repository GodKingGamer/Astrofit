const {JSDOM}=require('jsdom');const fs=require('fs');
const N=+process.argv[3]||1000,MODE=process.argv[2];
const dom=new JSDOM(fs.readFileSync(''+require('path').join(__dirname,'../../build/noboost.html')+'','utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/#demo'});
setTimeout(()=>{const AF=dom.window.__AF;let seed={A:101,B:202,C:303,D:404}[MODE];const rnd=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648};const pad=n=>String(n).padStart(2,'0');
 const cities=["hanoi","hcm","danang","hue","dongHoi"].filter(c=>1);
 const per=(hLo=0,hHi=24)=>{const y=1960+Math.floor(rnd()*51),m=1+Math.floor(rnd()*12),dd=1+Math.floor(rnd()*28);const mins=Math.floor(hLo*60+rnd()*(hHi-hLo)*60);
   return {id:'z',name:"X",date:`${y}-${pad(m)}-${pad(dd)}`,time:`${pad(Math.floor(mins/60))}:${pad(mins%60)}`,unknown:false,city:"hanoi",lat:"",lon:"",tz:7,simWin:'all',ascKnown:''}};
 const out={mode:MODE,n:0,cover:0,absErr:[],noonErr:[],pctSim:[],pctTrue:[],signed:[],width:[],tierHit:0,tierNoon:0};const t0=Date.now();
 for(let i=0;i<N;i++){let pa,pb;
   if(MODE==='C'){pa=per();pb=per(5,11)}else{pa=per();pb=per()}
   const a=AF.build(pa),b=AF.build(pb);const truth=AF.synastry(a,b);
   let ua=a,ub;const mkU=(p,extra={})=>AF.build({...p,unknown:true,...extra});
   if(MODE==='A')ub=mkU(pb);
   if(MODE==='B'){ua=mkU(pa);ub=mkU(pb)}
   if(MODE==='C')ub=mkU(pb,{simWin:'sang'});
   if(MODE==='D')ub=mkU(pb,{ascKnown:String(b.pts.ASC.s)});
   const sim=AF.simPair(ua,ub);if(!sim||sim.empty)continue;
   // naive baseline: assume 12:00 for unknown person(s)
   const nA=MODE==='B'?AF.build({...pa,time:'12:00'}):a,nB=AF.build({...pb,time:'12:00'});const noon=AF.synastry(nA,nB);
   out.n++;if(truth.total>=sim.lo-0.05&&truth.total<=sim.hi+0.05)out.cover++;
   out.absErr.push(Math.abs(sim.total-truth.total));out.noonErr.push(Math.abs(noon.total-truth.total));out.signed.push(sim.total-truth.total);
   out.pctSim.push(sim.totalPct);out.pctTrue.push(truth.totalPct);out.width.push(sim.hi-sim.lo);if(sim.tier===truth.tier)out.tierHit++;if(noon.tier===truth.tier)out.tierNoon++}
 const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)]},mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
 const p=out.cover/out.n,se=Math.sqrt(p*(1-p)/out.n);
 console.log(JSON.stringify({mode:MODE,n:out.n,coverage:(p*100).toFixed(1),ci95:[((p-1.96*se)*100).toFixed(1),((p+1.96*se)*100).toFixed(1)],medianPctSim:med(out.pctSim).toFixed(1),medianPctTrue:med(out.pctTrue).toFixed(1),meanSigned:mean(out.signed).toFixed(2),maeSim:mean(out.absErr).toFixed(2),maeNoon:mean(out.noonErr).toFixed(2),tierSim:(out.tierHit/out.n*100).toFixed(1),tierNoon:(out.tierNoon/out.n*100).toFixed(1),medWidth:med(out.width).toFixed(2),sec:((Date.now()-t0)/1000).toFixed(0)}))},1500);
