const {JSDOM}=require('jsdom');const fs=require('fs');
const dom=new JSDOM(fs.readFileSync(''+require('path').join(__dirname,'../../build/noboost.html')+'','utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/#demo'});
setTimeout(()=>{const AF=dom.window.__AF;const P={Đức:{date:"2002-08-08",time:"08:00",city:"hanoi"},Thảo:{date:"2002-06-11",time:"05:30",city:"hanoi"},Minh:{date:"2002-09-30",time:"17:20",city:"hanoi"},Trang:{date:"2004-01-19",time:"04:00",city:"dongHoi"}};
const mk=(n,x={})=>AF.build({name:n,lat:"",lon:"",tz:7,unknown:false,...P[n],...x});
let rows=[],inA=0,inD=0,n=0,eA=0,eD=0,eN=0;
for(const h of ["Đức","Thảo","Minh"])for(const o of Object.keys(P)){if(o===h)continue;
 const truth=AF.synastry(mk(o),mk(h)).total;const ascS=mk(h).pts.ASC.s;
 const sA=AF.simPair(mk(o),mk(h,{unknown:true,time:""})),sD=AF.simPair(mk(o),mk(h,{unknown:true,time:"",ascKnown:String(ascS)}));const noon=AF.synastry(mk(o),mk(h,{time:"12:00"})).total;
 const ia=truth>=sA.lo-.05&&truth<=sA.hi+.05,id=truth>=sD.lo-.05&&truth<=sD.hi+.05;n++;inA+=ia;inD+=id;eA+=Math.abs(sA.total-truth);eD+=Math.abs(sD.total-truth);eN+=Math.abs(noon-truth);
 rows.push(`${o}–${h} (ẩn giờ ${h}) | thật ${truth} | cả ngày ${sA.total} [${sA.lo.toFixed(1)}–${sA.hi.toFixed(1)}] ${ia?"✓":"✗"} | biết cung mọc ${sD.total} [${sD.lo.toFixed(1)}–${sD.hi.toFixed(1)}] n=${sD.n} ${id?"✓":"✗"} | 12h ${noon}`)}
console.log(rows.join("\n"));console.log(`trong khoảng: cả ngày ${inA}/${n}, biết cung mọc ${inD}/${n} | sai lệch TB: cả ngày ${(eA/n).toFixed(2)}, cung mọc ${(eD/n).toFixed(2)}, 12h ${(eN/n).toFixed(2)}`)},1500);
