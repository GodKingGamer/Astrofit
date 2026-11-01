const {JSDOM}=require('jsdom');const fs=require('fs');const crypto=require('crypto');
const file=process.argv[2];
const dom=new JSDOM(fs.readFileSync(file,'utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/#demo'});
const w=dom.window;let errs=[];w.addEventListener('error',e=>errs.push(e.message));
setTimeout(()=>{const AF=w.__AF;const P={duc:{name:"Hoàng Trung Đức",date:"2002-08-08",time:"08:00",unknown:false,city:"hanoi",lat:"",lon:"",tz:7},thao:{name:"Nguyễn Phương Thảo",date:"2002-06-11",time:"05:30",unknown:false,city:"hanoi",lat:"",lon:"",tz:7},trang:{name:"Nguyễn Ngọc Minh Trang",date:"2004-01-19",time:"04:00",unknown:false,city:"dongHoi",lat:"",lon:"",tz:7},minh:{name:"Trần Minh",date:"2002-09-30",time:"17:20",unknown:false,city:"hanoi",lat:"",lon:"",tz:7}};
 const out={};const C={};for(const k in P){C[k]=AF.build(P[k]);out[k]={pts:Object.fromEntries(Object.entries(C[k].pts).map(([a,b])=>[a,b.lon.toFixed(4)+'/'+b.h])),radar:C[k].radar.map(r=>r[1])}}
 for(const [a,b] of [['duc','thao'],['thao','duc'],['trang','minh'],['minh','trang'],['duc','trang'],['thao','minh']]){const S=AF.synastry(C[a],C[b]);out[a+'-'+b]=[S.total,S.tier,S.radar.map(r=>r[1]).join(',')]}
 const d=w.document;const ui=d.getElementById('synMetrics').textContent+d.getElementById('natReading').textContent+d.getElementById('synReading').textContent;
 out.uiHash=crypto.createHash('md5').update(ui).digest('hex');out.errs=errs;
 console.log(JSON.stringify(out));},2000);
