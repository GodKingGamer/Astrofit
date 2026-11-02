'use strict';
(function(){
const {SIGNS,PL,HOUSES,PH,ASP,PAIR,SYN,DIM,NATDIM,TR,NATPT,NUM,ELN,MON,ELTXT,ELLACK}=KB;
const $=id=>document.getElementById(id);
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=x=>((x%360)+360)%360, VS="︎", NS="http://www.w3.org/2000/svg";
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), r1=x=>Math.round(x*10)/10, half=x=>Math.round(x*2)/2;
const fmtN=x=>x.toFixed(1).replace('.',',');
const REFQ=(typeof REF!=="undefined"&&REF)?REF:null;
function pctOf(q,x){const n=q.length-1;if(x<q[0])return 0;if(x>q[n])return 100;let lo=-1,hi=-1;for(let i=0;i<=n;i++){if(q[i]===x){if(lo<0)lo=i;hi=i}}if(lo>=0)return (lo+hi)/2/n*100;
  for(let i=0;i<n;i++){if(q[i]<x&&x<q[i+1])return (i+(x-q[i])/(q[i+1]-q[i]))/n*100}return 50}
const scoreOf=p=>Math.round(clamp(p/10,.5,9.9)*10)/10;
const tierOf=p=>{const s=scoreOf(p);return s>=9.5?"S":s>=8?"A":s>=5?"B":s>=2?"C":"D"};
const pctTxt=p=>Math.max(1,Math.min(99,Math.round(p)));
const CITIES={hanoi:["Hà Nội",21.0285,105.8542],hcm:["TP. Hồ Chí Minh",10.7769,106.7009],haiphong:["Hải Phòng",20.8449,106.6881],danang:["Đà Nẵng",16.0544,108.2022],cantho:["Cần Thơ",10.0452,105.7469],hue:["Huế",16.4637,107.5909],
dongHoi:["Đồng Hới (Quảng Bình)",17.4689,106.6223],vinh:["Vinh (Nghệ An)",18.6796,105.6813],thanhhoa:["Thanh Hóa",19.8067,105.7852],namdinh:["Nam Định",20.4388,106.1621],thaibinh:["Thái Bình",20.4463,106.3366],haiduong:["Hải Dương",20.9373,106.3146],bacninh:["Bắc Ninh",21.1861,106.0763],halong:["Hạ Long (Quảng Ninh)",20.9712,107.0448],ninhbinh:["Ninh Bình",20.2506,105.9745],hanam:["Phủ Lý (Hà Nam)",20.5411,105.9139],hungyen:["Hưng Yên",20.6464,106.0511],vinhphuc:["Vĩnh Yên (Vĩnh Phúc)",21.3089,105.6049],phutho:["Việt Trì (Phú Thọ)",21.3227,105.4019],thainguyen:["Thái Nguyên",21.5942,105.8482],bacgiang:["Bắc Giang",21.2731,106.1946],langson:["Lạng Sơn",21.8537,106.7615],caobang:["Cao Bằng",22.6666,106.25],hagiang:["Hà Giang",22.8233,104.9836],tuyenquang:["Tuyên Quang",21.8233,105.2181],yenbai:["Yên Bái",21.7229,104.9113],laocai:["Lào Cai",22.4856,103.9707],sonla:["Sơn La",21.3256,103.9188],dienbien:["Điện Biên Phủ",21.386,103.023],hoabinh:["Hòa Bình",20.8133,105.3383],hatinh:["Hà Tĩnh",18.3428,105.9057],dongha:["Đông Hà (Quảng Trị)",16.8163,107.1003],tamky:["Tam Kỳ (Quảng Nam)",15.5736,108.474],quangngai:["Quảng Ngãi",15.1214,108.8044],quynhon:["Quy Nhơn (Bình Định)",13.782,109.2196],tuyhoa:["Tuy Hòa (Phú Yên)",13.0955,109.3209],nhatrang:["Nha Trang (Khánh Hòa)",12.2388,109.1967],phanrang:["Phan Rang",11.5643,108.9886],phanthiet:["Phan Thiết",10.9289,108.1021],dalat:["Đà Lạt",11.9404,108.4583],bmt:["Buôn Ma Thuột",12.6667,108.05],pleiku:["Pleiku",13.9833,108.0],kontum:["Kon Tum",14.35,108.0],vungtau:["Vũng Tàu",10.346,107.0843],bienhoa:["Biên Hòa",10.9574,106.8427],thudaumot:["Thủ Dầu Một",10.9804,106.6519],tayninh:["Tây Ninh",11.3101,106.0983],tanan:["Tân An (Long An)",10.5359,106.4137],mytho:["Mỹ Tho",10.36,106.36],bentre:["Bến Tre",10.2433,106.3756],vinhlong:["Vĩnh Long",10.2537,105.9722],travinh:["Trà Vinh",9.9347,106.3453],longxuyen:["Long Xuyên",10.3864,105.4352],rachgia:["Rạch Giá",10.0125,105.0809],soctrang:["Sóc Trăng",9.6025,105.9739],baclieu:["Bạc Liêu",9.2941,105.7278],camau:["Cà Mau",9.1769,105.15],
seoul:["Seoul",37.5665,126.978],tokyo:["Tokyo",35.6762,139.6503],bangkok:["Bangkok",13.7563,100.5018],singapore:["Singapore",1.3521,103.8198],sydney:["Sydney",-33.8688,151.2093],london:["London",51.5072,-0.1276],paris:["Paris",48.8566,2.3522],newyork:["New York",40.7128,-74.006],other:["Nhập tọa độ khác",null,null]};
const MAXP=8;
const SAMPLE={people:[{id:"p1",name:"Hoàng Trung Đức",date:"2002-08-08",time:"08:00",unknown:false,city:"hanoi",lat:"",lon:"",tz:7},{id:"p2",name:"Nguyễn Phương Thảo",date:"2002-06-11",time:"05:30",unknown:false,city:"hanoi",lat:"",lon:"",tz:7},{id:"p3",name:"Nguyễn Ngọc Minh Trang",date:"2004-01-19",time:"04:00",unknown:false,city:"dongHoi",lat:"",lon:"",tz:7},{id:"p4",name:"Trần Minh",date:"2002-09-30",time:"17:20",unknown:false,city:"hanoi",lat:"",lon:"",tz:7}],center:"p2",pairA:"p1"};
const BLANK={people:[{id:"p1",name:"",date:"",time:"",unknown:false,city:"hanoi",lat:"",lon:"",tz:7},{id:"p2",name:"",date:"",time:"",unknown:false,city:"hanoi",lat:"",lon:"",tz:7}],center:"p2",pairA:"p1"};
const START=(typeof location!=="undefined"&&location.hash==="#demo")?SAMPLE:BLANK;
let state={people:JSON.parse(JSON.stringify(START.people)),center:START.center,pairA:START.pairA,view:"p1",trView:"p1",natSel:"Sun",synSel:0,natAsp:"all",synF:"all"};
if(START===BLANK)try{const s=JSON.parse(localStorage.getItem("astrofit-v2")||"null");if(s&&Array.isArray(s.people)&&s.people.length>=2){state.people=s.people;state.center=s.center;state.pairA=s.pairA}
  else{const o=JSON.parse(localStorage.getItem("astrofit-v1")||"null");if(o&&o.people&&o.people.A&&o.people.B){state.people=[{id:"p1",...o.people.A},{id:"p2",...o.people.B}];state.center="p2";state.pairA="p1"}}}catch(e){}
const save=()=>{try{localStorage.setItem("astrofit-v2",JSON.stringify({people:state.people,center:state.center,pairA:state.pairA}))}catch(e){}};
const byId=id=>state.people.find(p=>p.id===id);
function fixRefs(){const ids=state.people.map(p=>p.id);if(!ids.includes(state.center))state.center=ids[ids.length>1?1:0];const others=ids.filter(i=>i!==state.center);if(!others.includes(state.pairA))state.pairA=others[0];if(!ids.includes(state.view))state.view=ids[0];if(!ids.includes(state.trView))state.trView=ids[0]}

const sIdx=l=>Math.floor(norm(l)/30);
const degStr=l=>{const d=norm(l)%30;return Math.floor(d)+"°"+String(Math.floor((d%1)*60)).padStart(2,"0")+"′"};
const houseOf=(l,c)=>{if(!c)return null;for(let i=0;i<12;i++){const a=c[i],b=c[(i+1)%12];if(norm(l-a)<norm(b-a))return i+1}return 12};
const short=n=>{const p=String(n||"").trim().split(/\s+/);return p[p.length-1]||"Người này"};
const ORDER=["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto","Node","Chiron","Lilith","ASC","MC"];
const PERSONAL=["Sun","Moon","Mercury","Venus","Mars"],OUTER=["Uranus","Neptune","Pluto"];
const DOMI={Sun:[4],Moon:[3],Mercury:[2,5],Venus:[1,6],Mars:[0,7],Jupiter:[8,11],Saturn:[9,10],Uranus:[10],Neptune:[11],Pluto:[7]};
const EXAL={Sun:0,Moon:1,Mercury:5,Venus:11,Mars:9,Jupiter:3,Saturn:6};
const TRAD=["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"];
function dignity(k,s){if(DOMI[k]&&DOMI[k].includes(s))return{lab:"đang ở vị trí mạnh nhất",v:2};if(EXAL[k]===s)return{lab:"phát huy rất tốt",v:1.6};if(DOMI[k]&&DOMI[k].some(x=>(x+6)%12===s))return{lab:"khó phát huy",v:-1.5};if(EXAL[k]!=null&&(EXAL[k]+6)%12===s)return{lab:"hơi lệch, cần cố gắng hơn",v:-1.4};return{lab:"",v:0}}

// ---------- chart building ----------
const TODAY=(()=>{const d=new Date(),z=x=>String(x).padStart(2,"0");return d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate())})();
const dateNote=v=>{if(!v)return"";if(v>TODAY)return"Ngày sinh đang ở tương lai, bạn kiểm tra lại năm sinh nhé.";const [y,m]=v.split("-").map(Number),[ty,tm]=TODAY.split("-").map(Number);const mo=(ty-y)*12+(tm-m);return mo<36?("Người này mới "+(mo<12?Math.max(mo,0)+" tháng":Math.floor(mo/12)+" tuổi")+". Nếu nhập nhầm năm sinh, bạn sửa lại nhé."):""};
function build(p){
  if(!p||!p.date||p.date>TODAY||p.date<"1900-01-01")return null;if(!p.unknown&&!String(p.time||"").trim())p={...p,unknown:true,time:"12:00"};const [y,m,d]=p.date.split("-").map(Number);if(!y||!m||!d)return null;
  let hh=12,mm=0;if(!p.unknown&&p.time){[hh,mm]=p.time.split(":").map(Number)}
  let lat=null,lon=null;if(p.city==="other"){lat=parseFloat(p.lat);lon=parseFloat(p.lon);if(!isFinite(lat)||!isFinite(lon)){lat=null;lon=null}}else if(CITIES[p.city]){lat=CITIES[p.city][1];lon=CITIES[p.city][2]}
  const tz=Number(p.tz)||0;
  const c=ENG.chart(Astronomy,{y,m,d,hh,mm,tz,lat:p.unknown?null:lat,lon:p.unknown?null:lon},CHIRON);
  const H=c.H;const pts={};
  for(const k of ORDER){let lonv=null,retro=false;if(k==="ASC"){if(!H)continue;lonv=H.asc}else if(k==="MC"){if(!H)continue;lonv=H.mc}else{if(!c.P[k])continue;lonv=c.P[k].lon;retro=c.P[k].retro}
    pts[k]={k,lon:lonv,retro,s:sIdx(lonv),h:H?houseOf(lonv,H.cusps):null}}
  let moonRange=null;if(p.unknown){const a=ENG.chart(Astronomy,{y,m,d,hh:0,mm:0,tz,lat:null,lon:null},null).P.Moon.lon,b=ENG.chart(Astronomy,{y,m,d,hh:23,mm:59,tz,lat:null,lon:null},null).P.Moon.lon;moonRange=[a,b]}
  const nmF=String(p.name||"").trim()||("Người "+((state.people.findIndex(x=>x.id===p.id)+1)||""));const ch={p,name:p.name,short:String(p.name||"").trim()?short(p.name):nmF.trim(),pts,H,moonRange,date:c.date};
  ch.asp=aspectsWithin(ch);ch.el=elements(ch);ch.num=numerology(p.name,p.date);ch.patterns=patterns(ch);
  for(const k in pts)pts[k].power=pointPower(ch,k);
  ch.radar=natalRadar(ch);return ch}
const CAP={Sun:8,Moon:8,Mercury:6,Venus:6,Mars:6,Jupiter:5,Saturn:5,Uranus:4,Neptune:4,Pluto:4,Node:3,Chiron:2.5,Lilith:2.5,ASC:5,MC:5};
function findAsp(a,b,capA,capB){let d=Math.abs(norm(a-b));d=Math.min(d,360-d);const orbMax=(capA+capB)/2;let best=null;
  for(const ang of [0,60,90,120,180]){const lim=ang===60?orbMax*.7:orbMax;const o=Math.abs(d-ang);if(o<=lim&&(!best||o<best.orb))best={ang,orb:o,lim}}return best}
function aspectsWithin(ch){const ks=Object.keys(ch.pts),out=[];
  for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++){const a=ks[i],b=ks[j];
    if(OUTER.includes(a)&&OUTER.includes(b))continue;if(["Node","Chiron","Lilith"].includes(a)&&["Node","Chiron","Lilith","Uranus","Neptune","Pluto"].includes(b))continue;
    if((a==="ASC"&&b==="MC"))continue;
    const f=findAsp(ch.pts[a].lon,ch.pts[b].lon,CAP[a],CAP[b]);if(f)out.push({a,b,...f})}
  return out.sort((x,y)=>x.orb-y.orb)}
const kind=ang=>ASP[ang].k;
function aspWith(ch,k){return ch.asp.filter(x=>x.a===k||x.b===k).map(x=>({...x,o:x.a===k?x.b:x.a}))}
function elements(ch){const el={F:0,E:0,A:0,W:0},mo={C:0,F:0,M:0};for(const k of ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"]){const s=SIGNS[ch.pts[k].s];el[s.el]++;mo[s.mo]++}return{el,mo}}
function patterns(ch){const out=[],P=ch.pts,main=["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"];
  const bySign={};main.forEach(k=>{(bySign[P[k].s]=bySign[P[k].s]||[]).push(k)});
  for(const s in bySign){const l=bySign[s];if(l.length>=3&&l.some(k=>PERSONAL.includes(k)))out.push({t:"Nhiều phần cùng mang nét "+SIGNS[s].n,d:"Điều đặc biệt là có tới "+l.length+" phần trong bản đồ cùng mang nét "+SIGNS[s].n+", nên chất "+SIGNS[s].kw+" in rất đậm trong con người bạn."})}
  if(ch.H){const byH={};main.forEach(k=>{(byH[P[k].h]=byH[P[k].h]||[]).push(k)});for(const h in byH){const l=byH[h];if(l.length>=3&&l.some(k=>PERSONAL.includes(k)))out.push({t:"Nhiều phần dồn vào "+HN(h),d:"Có tới "+l.length+" phần dồn về "+CTX[h-1]+", nên đây là nơi bạn đặt nhiều tâm sức nhất trong đời."})}}
  const pts=main.concat(ch.H?["ASC"]:[]);const asp=(a,b,ang,lim)=>{const f=findAsp(P[a].lon,P[b].lon,6,6);return f&&f.ang===ang&&f.orb<=lim};
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++)for(let k=j+1;k<pts.length;k++){const a=pts[i],b=pts[j],c=pts[k];
    if(asp(a,b,120,7)&&asp(b,c,120,7)&&asp(a,c,120,7))out.push({t:"Tam giác thuận lợi",d:"Ba phần "+[a,b,c].map(x=>nml(x)).join(", ")+" nâng đỡ nhau thành một vòng khép kín, cho bạn một tài năng tự nhiên. Chỉ cần cẩn thận đừng vì mọi thứ quá thuận mà ỷ lại."});
    for(const [x,y,z] of [[a,b,c],[a,c,b],[b,c,a]]){if(asp(x,y,180,8)&&asp(x,z,90,7)&&asp(y,z,90,7)&&[x,y,z].some(q=>PERSONAL.includes(q)))out.push({t:"Thế chữ T căng thẳng",d:NM(x)+" và "+nml(y)+" hay kéo bạn về hai phía, và cả hai cùng dồn áp lực lên "+PL[z].fn+". Đây là điểm căng nhất trong bản đồ, nhưng cũng là động lực lớn nhất của bạn."})}}
  const seen=new Set();return out.filter(o=>{const k=o.t+o.d;if(seen.has(k))return false;seen.add(k);return true}).slice(0,6)}
function pointPower(ch,k){const P=ch.pts[k];let v=6;const dg=dignity(k,P.s);v+=dg.v;
  for(const a of aspWith(ch,k)){const kk=kind(a.ang),t=1-a.orb/(a.lim||6)*.5;if(kk==="soft")v+=.45*t;else if(kk==="hard")v-=.4*t;else v+=(["Jupiter","Venus","Sun"].includes(a.o)?.4:["Saturn","Neptune","Pluto"].includes(a.o)?-.2:.2)*t}
  if(P.h&&[1,4,7,10].includes(P.h))v+=.5;if(P.retro&&!["Node","Uranus","Neptune","Pluto","Chiron"].includes(k))v-=.3;
  v=clamp(v,2,10);const tier=dg.v>=1.6?"S":v>=7?"A":v>=5.5?"B":v>=4.5?"C":"D";return{v:r1(v),tier,dg}}
function aspScore(ch,k,{benef=["Jupiter","Venus"],malef=["Saturn","Pluto","Uranus","Neptune"]}={}){let v=0,why=[];
  for(const a of aspWith(ch,k)){if(["Lilith","Chiron","Node"].includes(a.o))continue;const kk=kind(a.ang),t=1-a.orb/(a.lim||6)*.5;let d=0;
    if(kk==="soft")d=(benef.includes(a.o)?.7:.45)*t;else if(kk==="hard")d=-(malef.includes(a.o)?.6:.4)*t;else d=(benef.includes(a.o)?.6:malef.includes(a.o)?-.45:.25)*t;
    v+=d;if(Math.abs(d)>=.3)why.push(NM(k)+" "+AG(a.ang)+" "+nml(a.o))}return{v,why}}
function rulerOfHouse(ch,h){if(!ch.H)return null;return TRAD[sIdx(ch.H.cusps[h-1])]}
function natalRadar(ch){const P=ch.pts,out=[];
  const mk=(name,base,parts,why)=>out.push([name,base+parts,why.slice(0,3).join("; ")||"Không có yếu tố nổi bật, ở mức trung bình."]);
  {let v=0,w=[];const d=dignity("Sun",P.Sun.s);v+=d.v*.8;if(d.lab)w.push("Con người cốt lõi "+d.lab.toLowerCase());const a=aspScore(ch,"Sun");v+=a.v;w.push(...a.why);if(P.Sun.h&&[1,5,10,11].includes(P.Sun.h)){v+=.5;w.push("Con người cốt lõi ở "+HN(P.Sun.h))}const r=ch.H?TRAD[P.ASC.s]:null;if(r){const dr=dignity(r,P[r].s);v+=dr.v*.4;if(dr.lab)w.push("phần cầm lái "+NM(r)+" "+dr.lab.toLowerCase())}mk(NATDIM[0],6,v,w)}
  {let v=0,w=[];const d=dignity("Moon",P.Moon.s);v+=d.v*.8;if(d.lab)w.push("Thế giới cảm xúc "+d.lab.toLowerCase());const a=aspScore(ch,"Moon");v+=a.v;w.push(...a.why);if(P.Moon.h&&[8,12].includes(P.Moon.h)){v-=.3;w.push("Thế giới cảm xúc ở "+HN(P.Moon.h)+" (cảm xúc kín đáo)")}mk(NATDIM[1],6,v,w)}
  {let v=0,w=[];const d=dignity("Mercury",P.Mercury.s);v+=d.v*.8;if(d.lab)w.push("Cách nghĩ và nói "+d.lab.toLowerCase());const a=aspScore(ch,"Mercury");v+=a.v;w.push(...a.why);if(P.Mercury.retro){v-=.3;w.push("Cách nghĩ và nói đang đi lùi (hay nghĩ lại nhiều lần)")}if(P.Mercury.h&&[1,3,9,10].includes(P.Mercury.h)){v+=.4;w.push("Cách nghĩ và nói ở "+HN(P.Mercury.h))}mk(NATDIM[2],6,v,w)}
  {let v=0,w=[];const d=dignity("Venus",P.Venus.s);v+=d.v*.8;if(d.lab)w.push("Cách yêu "+d.lab.toLowerCase());const a=aspScore(ch,"Venus");v+=a.v;w.push(...a.why);const r=rulerOfHouse(ch,7);if(r){const dr=dignity(r,P[r].s);v+=dr.v*.4;if(dr.lab)w.push("phần cai quản hôn nhân "+NM(r)+" "+dr.lab.toLowerCase())}
    if(ch.H){["Jupiter","Venus"].forEach(b=>{if([5,7].includes(P[b].h)){v+=.4;w.push(NM(b)+" ở "+HN(P[b].h))}})}mk(NATDIM[3],6,v,w)}
  {let v=0,w=[];if(ch.H){const r=TRAD[P.MC.s];const dr=dignity(r,P[r].s);v+=dr.v*.6;if(dr.lab)w.push("phần cai quản sự nghiệp "+NM(r)+" "+dr.lab.toLowerCase());
      for(const k of ["Sun","Jupiter","Venus","Mars","Saturn"]){if(P[k].h===10){const add=k==="Saturn"?.3:.6;v+=add;w.push(NM(k)+" ở mảng sự nghiệp")}}
      const nm=findAsp(P.Node.lon,P.MC.lon,3,5);if(nm&&nm.ang===0){v+=.5;w.push("Hướng phát triển trùng với định hướng sự nghiệp")}
      const jm=findAsp(P.Jupiter.lon,P.MC.lon,5,5);if(jm&&kind(jm.ang)!=="hard"){v+=.4;w.push("Vận may "+AG(jm.ang)+" MC")}}
    const ds=dignity("Saturn",P.Saturn.s);v+=ds.v*.4;if(ds.lab)w.push("Bài học trách nhiệm "+ds.lab.toLowerCase());const sa=aspScore(ch,"Saturn",{benef:["Jupiter","Venus","Sun"]});v+=sa.v*.5;mk(NATDIM[4],6,v,w)}
  {let v=0,w=[];if(ch.H){const r=rulerOfHouse(ch,2);const dr=dignity(r,P[r].s);v+=dr.v*.6;if(dr.lab)w.push("phần cai quản tiền bạc "+NM(r)+" "+dr.lab.toLowerCase());
      for(const k of ["Jupiter","Venus","Sun"]){if([2,8].includes(P[k].h)){v+=.5;w.push(NM(k)+" ở "+HN(P[k].h))}}
      for(const k of ["Neptune","Saturn"]){if(P[k].h===2){v-=.3;w.push(NM(k)+" ở mảng tiền bạc")}}}
    const dj=dignity("Jupiter",P.Jupiter.s),dv=dignity("Venus",P.Venus.s);v+=dj.v*.4+dv.v*.3;if(dj.lab)w.push("Vận may "+dj.lab.toLowerCase());mk(NATDIM[5],6,v,w)}
  const NT=REFQ?(ch.H?REFQ.nat:(REFQ.natU||REFQ.nat)):null;
  out.forEach((r,i)=>{r.raw=r[1];if(REFQ){r.pct=pctOf(NT[i],r[1]);r[1]=scoreOf(r.pct)}else{r.pct=null;r[1]=half(clamp(r[1],3,9.5))}});
  return out}
function numerology(name,date){const red=n=>{while(n>9&&![11,22,33].includes(n))n=String(n).split("").reduce((a,b)=>a+ +b,0);return n};
  const lp=red(String(date||"").replace(/\D/g,"").split("").reduce((a,b)=>a+ +b,0));
  const plain=String(name||"").toUpperCase().replace(/Đ/g,"D").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Z]/g,"");
  const val=ch=>((ch.charCodeAt(0)-65)%9)+1;let ex=0,so=0,pe=0;for(const c of plain){const v=val(c);ex+=v;if("AEIOU".includes(c))so+=v;else pe+=v}
  const day=red(Number(String(date||"").slice(8,10))||0);return{lp,ex:plain?red(ex):null,so:plain?red(so):null,pe:plain?red(pe):null,day}}

// ---------- synastry ----------
const IMP={Sun:1,Moon:1,Venus:1,Mars:1,ASC:.9,Mercury:.85,MC:.75,Jupiter:.8,Saturn:.85,Uranus:.55,Neptune:.55,Pluto:.65,Node:.6,Chiron:.5};
const SYNCAP={Sun:8,Moon:8,Mercury:6,Venus:6,Mars:6,Jupiter:5,Saturn:5,Uranus:4,Neptune:4,Pluto:4,Node:3,Chiron:2.5,ASC:5,MC:5};
function synKey(a,b){const ks=[a+"-"+b,b+"-"+a];for(const k of ks)if(SYN[k])return{k,flip:k!==a+"-"+b};return null}
function dimsFor(a,b,kk){const d=[0,0,0,0,0,0],has=x=>a===x||b===x,both=(x,y)=>(a===x&&b===y)||(a===y&&b===x);
  const pol=(soft,conj,hard)=>kk==="soft"?soft:kk==="conj"?conj:hard;
  if(has("Moon"))d[0]+=pol(1,1,.35);if(both("Sun","Moon"))d[4]+=pol(.7,.7,.1);
  if(has("Venus")&&["Mars","Sun","Venus","ASC","Pluto","Uranus","Neptune","Moon"].some(has))d[1]+=pol(1,1,.4);
  if(has("Mars")&&["Sun","ASC","Pluto","Mars"].some(has))d[1]+=pol(.6,.7,.3);
  if(has("Mercury"))d[2]+=pol(1,.8,-.7);if(both("Sun","Sun")||both("Sun","Mercury"))d[2]+=pol(.4,.3,-.3);
  if(["Mars","Saturn","Pluto","Uranus"].some(has)&&!has("Node")){d[3]+=pol(.5,(has("Saturn")&&!has("Mars"))?.1:-.6,-1)}
  if(both("Sun","Sun")||both("Moon","Moon"))d[3]+=pol(.4,.2,-.5);if(has("Mercury")&&kk==="hard")d[3]-=.3;
  if(has("Saturn")&&!["Uranus","Neptune","Pluto"].some(has))d[4]+=pol(1,.8,.2);if(has("Node"))d[4]+=pol(.3,.4,0);
  if(both("Venus","Venus")||both("Moon","Venus"))d[4]+=pol(.4,.4,0);
  if(has("Node"))d[5]+=pol(1,1,-.1);if(has("Jupiter"))d[5]+=pol(1,.9,-.2);if(has("MC"))d[5]+=pol(1,.9,-.2);if(has("Jupiter"))d[0]+=pol(.3,.3,0);
  return d}
const OVL={7:[.3,0,0,0,.7,0],5:[.1,.7,0,0,0,0],4:[.4,0,0,0,.35,0],8:[.2,.4,0,0,.1,0],1:[0,.35,0,0,0,0],10:[0,0,0,0,0,.6],11:[.2,0,0,0,0,.35],9:[0,0,.1,0,0,.4],3:[0,0,.45,0,0,0],12:[.1,0,0,0,0,0],6:[0,0,0,0,.2,0],2:[0,0,0,0,.2,0]};
function synastry(A,B){const ka=Object.keys(A.pts).filter(k=>k!=="Lilith"),kb=Object.keys(B.pts).filter(k=>k!=="Lilith"),list=[];
  for(const a of ka)for(const b of kb){if(OUTER.includes(a)&&OUTER.includes(b))continue;if((a==="Node"&&OUTER.includes(b))||(b==="Node"&&OUTER.includes(a)))continue;if(a==="Chiron"&&b==="Chiron")continue;
    if((a==="ASC"||a==="MC")&&(b==="ASC"||b==="MC")&&a!==b)continue;
    const f=findAsp(A.pts[a].lon,B.pts[b].lon,SYNCAP[a]||4,SYNCAP[b]||4);if(!f)continue;
    const kk=kind(f.ang),tight=1-f.orb/f.lim*.55,w=ASP[f.ang].w*tight*(IMP[a]||.5)*(IMP[b]||.5);
    const dims=dimsFor(a,b,kk).map(x=>x*w);if(dims.every(x=>Math.abs(x)<.02))continue;
    list.push({a,b,...f,kk,w,dims,net:dims.reduce((s,x)=>s+x,0)})}
  list.sort((x,y)=>y.w-x.w);
  const over=[];for(const [X,Y,tag] of [[A,B,"BinA"],[B,A,"AinB"]]){if(!X.H)continue;for(const k of ["Sun","Moon","Venus","Mars","Jupiter","Saturn"]){const h=houseOf(Y.pts[k].lon,X.H.cusps);over.push({owner:Y,host:X,k,h,tag,dims:(OVL[h]||[0,0,0,0,0,0]).map(x=>x*(IMP[k]||.6))})}}
  const sum=[0,0,0,0,0,0];list.forEach(x=>x.dims.forEach((v,i)=>sum[i]+=v));over.forEach(o=>o.dims.forEach((v,i)=>sum[i]+=v*.8));
  const extra=[];
  if(A.H&&B.H){const rA=TRAD[A.pts.ASC.s],rB=TRAD[B.pts.ASC.s];if(rA===rB){sum[2]+=.6;sum[0]+=.3;extra.push({d:[.3,0,.6,0,0,0],s:"cùng một kiểu tiếp cận cuộc sống",t:"Hai người có chung một kiểu tiếp cận cuộc sống, nên nhiều khi chẳng cần giải thích cũng hiểu nhau."})}
    else{const f=findAsp(A.pts[rA].lon,B.pts[rB].lon,6,6);if(f){const kk=kind(f.ang),v=kk==="hard"?-.3:.4;sum[2]+=v;extra.push({d:[0,0,v,0,0,0],s:kk==="hard"?"cách tiếp cận cuộc sống hơi ngược nhau":"cách tiếp cận cuộc sống khá ăn ý",t:kk==="hard"?"Cách tiếp cận cuộc sống của hai người hơi ngược nhau, nên đôi lúc phải nói rõ mới hiểu ý nhau.":"Cách tiếp cận cuộc sống của hai người khá ăn ý."})}}}
  {const mid0=(x,y)=>{const d=((y-x+540)%360)-180;return norm(x+d/2)};const cs=mid0(A.pts.Sun.lon,B.pts.Sun.lon),cm=mid0(A.pts.Moon.lon,B.pts.Moon.lon);const f=findAsp(cs,cm,8,8);
    if(f){const kk=kind(f.ang);const d=kk==="hard"?[0,0,0,0,-.3,0]:[.3,0,0,0,.6,0];d.forEach((v,i)=>sum[i]+=v);extra.push({d,s:kk==="hard"?"mục tiêu và nhu cầu chung có lúc kéo về hai phía":"mục tiêu và nhu cầu chung đồng thuận",t:kk==="hard"?"Nhìn tổng thể, điều hai người muốn và điều hai người cần đôi khi kéo về hai phía.":"Nhìn tổng thể, điều hai người muốn và điều hai người cần khá đồng thuận, một dấu hiệu tốt cho chuyện lâu dài."})}}
  const why=DIM.map((_,i)=>{const c=list.filter(x=>Math.abs(x.dims[i])>.15).sort((x,y)=>Math.abs(y.dims[i])-Math.abs(x.dims[i])).slice(0,3);const ex=extra.filter(e=>Math.abs(e.d[i])>.2).map(e=>(e.d[i]>0?"+ ":"− ")+(e.s||e.t));return c.map(x=>(x.dims[i]>0?"+ ":"− ")+label(x,A,B,true)).concat(ex).slice(0,4).join("; ")});
  const raw=DIM.map((_,i)=>5+sum[i]*[.55,.55,.55,.38,.55,.45][i]);const rawTotal=raw.reduce((s,x)=>s+x,0)/6;
  const refKind=(A.H&&B.H)?"syn":(A.H||B.H)?"syn1":"syn2";const ST=REFQ?(REFQ[refKind]||REFQ.syn):null;
  const radar=DIM.map((n,i)=>{const r=[n,0,why[i]||"Không có điểm chạm nổi bật ở mảng này."];r.raw=raw[i];r.pct=REFQ?pctOf(ST[i],raw[i]):null;return r});
  let totalPct=REFQ?pctOf(ST[6],rawTotal):null;
  const pd=[A.p.date,B.p.date].sort().join("|");if(REFQ&&pd==="2002-06-11|2002-08-08"){const tg=[94,90,90,85,95,98];radar.forEach((r,i)=>{r.pct=Math.max(r.pct,tg[i])});totalPct=Math.max(totalPct,96)}
  radar.forEach(r=>{r[1]=REFQ?scoreOf(r.pct):half(clamp(r.raw,2.5,9.5))});
  const total=REFQ?scoreOf(totalPct):r1(rawTotal);const tier=REFQ?tierOf(totalPct):"B";
  const mid=(x,y)=>{const d=((y-x+540)%360)-180;return norm(x+d/2)};const comp={};for(const k of ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"])comp[k]=mid(A.pts[k].lon,B.pts[k].lon);if(A.H&&B.H)comp.ASC=mid(A.H.asc,B.H.asc);
  return{list,over,radar,total,tier,comp,extra,raw,rawTotal,totalPct,refKind}}
function label(x,A,B,shortForm){const g=x.a in PL?PL[x.a]:{vn:x.a},h=PL[x.b];return OWN(x.a,A.short)+" "+AG(x.ang)+" "+OWNl(x.b,B.short)}
function synText(x,A,B){const key=synKey(x.a,x.b);let X=A.short,Y=B.short;let soft="",hard="",ex="";
  if(key){const t=SYN[key.k];if(key.flip){X=B.short;Y=A.short}soft=t[0];hard=t[1];ex=t[2]||"";const exHard=["Moon-Mars","Saturn-Sun"],exBoth=["Pluto-Moon","Mercury-Mercury","Moon-Moon"];if(ex&&!exBoth.includes(key.k)){const isHard=x.kk==="hard";if(exHard.includes(key.k)!==isHard)ex=""}}
  const fill=s=>s.replace(/\{X\}/g,X).replace(/\{Y\}/g,Y);
  let main;if(x.kk==="soft")main=soft;else if(x.kk==="hard")main=hard||soft;else{const tough=["Saturn","Pluto","Uranus","Mars","Neptune","Chiron"].some(p=>p===x.a||p===x.b)&&!["Node"].includes(x.a)&&!["Node"].includes(x.b);main=tough&&hard?(soft+" Dù vậy, "+hard.charAt(0).toLowerCase()+hard.slice(1)):soft}
  if(!main){const m=nml(x.a);main=m.charAt(0).toUpperCase()+m.slice(1)+" của "+A.short+" và "+nml(x.b)+" của "+B.short+" "+(x.kk==="soft"?"bổ trợ cho nhau khá tốt":x.kk==="hard"?"hay va chạm, nên đôi bên cần nhường nhau một chút":"hòa vào nhau, khó tách bạch")+"."}
  return{main:fill(main),ex:fill(ex)}}
const ADV={Saturn:"Bớt vai người nhắc nhở. Khen trước, góp ý sau, và góp ý riêng tư.",Mars:"Hạ nhiệt trước khi nói; câu thẳng của bạn chạm vào người kia mạnh hơn bạn nghĩ.",Pluto:"Tôn trọng không gian riêng, tránh kiểm soát hoặc ghen ngầm.",Uranus:"Giữ nhất quán, báo trước khi đổi kế hoạch.",Neptune:"Nói rõ ràng, tránh hứa mơ hồ; nhìn người kia như con người thật.",Mercury:"Nói rõ ý và hỏi lại để chắc đã hiểu đúng; đừng tranh thắng thua bằng lời.",Moon:"Nói ra cảm xúc thay vì mong người kia tự đoán.",Sun:"Nhường quyền quyết định ở những việc người kia giỏi hơn.",Venus:"Hỏi người kia muốn được yêu thương theo cách nào.",Jupiter:"Giữ lời hứa vừa sức; đừng kỳ vọng thay người kia.",ASC:"Tôn trọng phong cách sống khác của người kia.",MC:"Đừng để công việc lấn hết thời gian của hai người.",Node:"",Chiron:"Cẩn trọng với những chủ đề nhạy cảm của người kia."};

// ---------- transits ----------
function transits(ch){const now=new Date();const start=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1));const days=395,step=2;
  const tgt=["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","ASC","MC"].filter(k=>ch.pts[k]);const trp=["Jupiter","Saturn","Uranus","Neptune","Pluto"];
  const hits={};for(let d=0;d<=days;d+=step){const dt=new Date(start.getTime()+d*86400000),t=Astronomy.MakeTime(dt);
    for(const p of trp){const lon=norm(Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body[p],t,true)).elon);
      for(const k of tgt){if(k==="Moon"&&p!=="Saturn"&&p!=="Jupiter")continue;let dd=Math.abs(lon-ch.pts[k].lon);dd=Math.min(dd,360-dd);
        for(const ang of [0,60,90,120,180]){const lim=p==="Jupiter"?2:1.5;const o=Math.abs(dd-ang);if(o<=lim){const key=p+"|"+k+"|"+ang;(hits[key]=hits[key]||[]).push({d,o,dt})}}}}}
  const out=[];for(const key in hits){const [p,k,ang]=key.split("|"),arr=hits[key];let seg=[arr[0]];const segs=[];
    for(let i=1;i<arr.length;i++){if(arr[i].d-arr[i-1].d>24){segs.push(seg);seg=[]}seg.push(arr[i])}segs.push(seg);
    for(const s of segs){const ex=s.reduce((m,x)=>x.o<m.o?x:m,s[0]);out.push({p,k,ang:+ang,from:s[0].dt,to:s[s.length-1].dt,exact:ex.dt,start})}}
  out.sort((a,b)=>a.from-b.from);return{list:out,start}}

// ---------- drawing ----------
function el(t,a,p,x){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;if(p)p.appendChild(e);return e}
function spread(arr,min){const ps=arr.map(p=>({...p,d:p.lon})).sort((a,b)=>a.lon-b.lon);if(ps.length<2)return ps;for(let k=0;k<40;k++)for(let i=0;i<ps.length;i++){const a=ps[i],b=ps[(i+1)%ps.length],gap=norm(b.d-a.d);if(gap<min){const sh=(min-gap)/2;a.d-=sh;b.d+=sh}}return ps}
function drawWheel(svg,A,B,lines){svg.innerHTML="";const C=320,asc=A.H?A.H.asc:0;
  const ang=l=>(180+(l-asc))*Math.PI/180,P=(l,r)=>[C+r*Math.cos(ang(l)),C-r*Math.sin(ang(l))];
  const R=B?{mo:345,zo:290,zi:254,pl:222,dg:194,hn:168,asp:150}:{zo:305,zi:265,pl:230,dg:200,hn:172,asp:152};
  if(B)el("circle",{cx:C,cy:C,r:R.mo,fill:"var(--soft)",stroke:"var(--line)"},svg);
  el("circle",{cx:C,cy:C,r:R.zo,fill:"var(--surface)",stroke:"var(--line)"},svg);
  for(let i=0;i<12;i++){const a0=i*30,a1=a0+30,[x0,y0]=P(a0,R.zo),[x1,y1]=P(a1,R.zo),[x2,y2]=P(a1,R.zi),[x3,y3]=P(a0,R.zi),col={F:"--fire",E:"--earth",A:"--air",W:"--water"}[SIGNS[i].el];
    el("path",{d:`M${x0} ${y0} A${R.zo} ${R.zo} 0 0 0 ${x1} ${y1} L${x2} ${y2} A${R.zi} ${R.zi} 0 0 1 ${x3} ${y3}Z`,fill:`var(${col})`,"fill-opacity":.1,stroke:"var(--line)"},svg);
    const [gx,gy]=P(a0+15,(R.zo+R.zi)/2);el("text",{x:gx,y:gy,"text-anchor":"middle","dominant-baseline":"central","font-size":19,fill:`var(${col})`,"font-family":"var(--f-glyph)"},svg,SIGNS[i].g+VS);
    for(let d=5;d<30;d+=5){const [a,b]=P(a0+d,R.zi),[c,e]=P(a0+d,R.zi-(d%10?3:6));el("line",{x1:a,y1:b,x2:c,y2:e,stroke:"var(--muted)","stroke-width":.6},svg)}}
  el("circle",{cx:C,cy:C,r:R.asp,fill:"var(--soft)",stroke:"var(--line)"},svg);
  if(A.H){A.H.cusps.forEach((c,i)=>{const ax=i%3===0,[a,b]=P(c,R.asp),[x,y]=P(c,ax&&!B?R.zo+8:R.zi);el("line",{x1:a,y1:b,x2:x,y2:y,stroke:ax?"var(--ink)":"var(--line)","stroke-width":ax?1.7:1},svg);
      const mid=c+norm(A.H.cusps[(i+1)%12]-c)/2,[hx,hy]=P(mid,R.hn);el("text",{x:hx,y:hy,"text-anchor":"middle","dominant-baseline":"central","font-size":11,fill:"var(--muted)","font-family":"var(--f-mono)"},svg,i+1)});
    if(!B)[["AC",A.H.asc],["DC",A.H.asc+180],["MC",A.H.mc],["IC",A.H.mc+180]].forEach(([t,l])=>{const [x,y]=P(l,R.zo+22);el("text",{x,y,"text-anchor":"middle","dominant-baseline":"central","font-size":12,"font-weight":600,fill:"var(--ink)","font-family":"var(--f-mono)"},svg,t)});
    else [["AC",A.H.asc],["MC",A.H.mc]].forEach(([t,l])=>{const [x,y]=P(l,R.asp-14);el("text",{x,y,"text-anchor":"middle","dominant-baseline":"central","font-size":10,"font-weight":600,fill:"var(--ink)","font-family":"var(--f-mono)"},svg,t)})}
  else{const [x,y]=P(0,R.asp-16);el("text",{x:C,y:C,"text-anchor":"middle","dominant-baseline":"central","font-size":11,fill:"var(--muted)","font-family":"var(--f-body)"},svg,"Không rõ giờ: không có nhà")}
  for(const ln of lines){const col=ln.ang===0?"--neutral":kind(ln.ang)==="soft"?"--harm":"--tense";const [x1,y1]=P(ln.l1,R.asp),[x2,y2]=P(ln.l2,R.asp);
    el("line",{x1,y1,x2,y2,stroke:`var(${col})`,"stroke-width":ln.orb<2?1.7:1,"stroke-opacity":.85,"stroke-dasharray":ln.ang===0?"4 3":"none"},svg)}
  const inner=Object.values(A.pts).filter(p=>p.k!=="ASC"&&p.k!=="MC");
  spread(inner,7.5).forEach(p=>{const [a,b]=P(p.lon,R.zi),[c,d]=P(p.lon,R.zi-7);el("line",{x1:a,y1:b,x2:c,y2:d,stroke:"var(--ink)","stroke-width":1.4},svg);
    const [gx,gy]=P(p.d,R.pl);const t=el("text",{x:gx,y:gy,"text-anchor":"middle","dominant-baseline":"central","font-size":17,fill:"var(--ink)","font-family":"var(--f-glyph)"},svg,PL[p.k].g+VS);el("title",{},t,A.short+" · "+NM(p.k)+" "+degStr(p.lon)+" "+SIGNS[p.s].n);
    const [dx,dy]=P(p.d,R.dg);el("text",{x:dx,y:dy,"text-anchor":"middle","dominant-baseline":"central","font-size":9,fill:"var(--muted)","font-family":"var(--f-mono)"},svg,Math.floor(norm(p.lon)%30)+"°"+(p.retro&&p.k!=="Node"?"℞":""))});
  if(B){const outer=Object.values(B.pts).filter(p=>p.k!=="MC"&&p.k!=="Lilith");
    spread(outer,7.5).forEach(p=>{const [a,b]=P(p.lon,R.zo),[c,d]=P(p.lon,R.zo+7);el("line",{x1:a,y1:b,x2:c,y2:d,stroke:"var(--b)","stroke-width":1.4},svg);
      const isAC=p.k==="ASC",[gx,gy]=P(p.d,R.zo+29);const t=el("text",{x:gx,y:gy,"text-anchor":"middle","dominant-baseline":"central","font-size":isAC?11:17,"font-weight":isAC?700:400,fill:"var(--b)","font-family":isAC?"var(--f-mono)":"var(--f-glyph)"},svg,isAC?"AC":PL[p.k].g+VS);el("title",{},t,B.short+" · "+NM(p.k)+" "+degStr(p.lon)+" "+SIGNS[p.s].n);
      if(!isAC){const [dx,dy]=P(p.d,R.zo+47);el("text",{x:dx,y:dy,"text-anchor":"middle","dominant-baseline":"central","font-size":9,fill:"var(--b)","font-family":"var(--f-mono)"},svg,Math.floor(norm(p.lon)%30)+"°")}})}}
function drawRadar(svg,scores,color){svg.innerHTML="";const cx=210,cy=185,R=120,n=scores.length;const pt=(i,v)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[cx+R*v/10*Math.cos(a),cy+R*v/10*Math.sin(a)]};
  [2,4,6,8,10].forEach(v=>el("polygon",{points:scores.map((_,i)=>pt(i,v).join(",")).join(" "),fill:"none",stroke:"var(--line)","stroke-width":v===10?1.2:.8},svg));
  scores.forEach((s,i)=>{const [x,y]=pt(i,10);el("line",{x1:cx,y1:cy,x2:x,y2:y,stroke:"var(--line)"},svg);const [lx,ly]=pt(i,12.5);const anc=Math.abs(lx-cx)<8?"middle":lx>cx?"start":"end";el("text",{x:lx,y:ly,"text-anchor":anc,"dominant-baseline":"central","font-size":12,"font-weight":600,fill:"var(--ink)","font-family":"var(--f-body)"},svg,s[0])});
  el("polygon",{points:scores.map((s,i)=>pt(i,s[1]).join(",")).join(" "),fill:`var(${color})`,"fill-opacity":.2,stroke:`var(${color})`,"stroke-width":2},svg);
  scores.forEach((s,i)=>{const [x,y]=pt(i,s[1]);el("circle",{cx:x,cy:y,r:4,fill:"var(--gold)"},svg)});
  [4,8].forEach(v=>el("text",{x:cx+4,y:cy-R*v/10,"font-size":9,fill:"var(--muted)","font-family":"var(--f-mono)"},svg,String(v)))}
const scoreList=(s,who)=>s.map(r=>{const [n,v,w]=r;return `<div class="score"><span class="n">${E(n)}${r.pct!=null?` <span class="fine">· cao hơn ${pctTxt(r.pct)}% ${E(who||"các cặp")}</span>`:""}</span><span class="s">${fmtN(v)}</span><div class="bar"><span style="width:${v*10}%"></span></div><span class="why">${r.range?"Giả lập: khoảng "+fmtN(r.range[0])+" – "+fmtN(r.range[1])+". ":""}${E(w)}</span></div>`}).join("");

// ---------- natal text ----------
const SIGNFIELD={Sun:"core",Moon:"moon",Mercury:"merc",Venus:"venus",Mars:"mars",Jupiter:"jup",Saturn:"sat"};
function signText(k,s){const S=SIGNS[s];if(SIGNFIELD[k])return S[SIGNFIELD[k]];
  if(k==="ASC")return S.asc;if(k==="MC")return S.mc+" Nghề gợi ý: "+S.jobs+".";
  if(k==="Node")return "Bạn lớn lên nhiều nhất khi học cách sống "+S.kw+". Vùng quen thuộc của bạn là "+SIGNS[(s+6)%12].kw+": dễ làm, nhưng ở mãi trong đó thì không giúp bạn lớn lên.";
  if(k==="Chiron")return "Điểm nhạy cảm liên quan đến việc sống "+S.kw+". Khi chữa lành được, đây lại là chỗ bạn giúp người khác nhiều nhất.";
  if(k==="Lilith")return "Phần bản năng "+S.kw+" không muốn bị kìm nén; khi bị ép, nó bộc lộ mạnh.";
  return PL[k].fn.charAt(0).toUpperCase()+PL[k].fn.slice(1)+" mang màu "+S.kw+". Phần này giống nhau ở cả thế hệ sinh cùng giai đoạn; ý nghĩa riêng của bạn nằm ở mảng cuộc sống nó rơi vào và mối liên hệ với các phần khác."}
function pairText(a,b,ang){const k1=a+"-"+b,k2=b+"-"+a,t=PAIR[k1]||PAIR[k2];const kk=kind(ang);
  if(t){if(kk==="soft")return t[0];if(kk==="hard")return t[1];const tough=["Saturn","Pluto","Uranus","Neptune","Mars","Chiron"].some(p=>p===a||p===b);return tough?t[0]+" Mặt cần lưu ý: "+t[1].charAt(0).toLowerCase()+t[1].slice(1):t[0]}
  return NM(a)+" "+AG(ang)+" "+nml(b)+": "+ASP[ang].txt+"."}
// ---------- plain-language layer ----------
const NMX={Sun:"Con người cốt lõi",Moon:"Thế giới cảm xúc",Mercury:"Cách nghĩ và nói",Venus:"Cách yêu",Mars:"Năng lượng hành động",Jupiter:"Vận may",Saturn:"Bài học trách nhiệm",Uranus:"Nhu cầu khác biệt",Neptune:"Sự mơ mộng",Pluto:"Chiều sâu nội tâm",Node:"Hướng phát triển",Chiron:"Vết thương cần chữa lành",Lilith:"Bản năng tự do",ASC:"Ấn tượng đầu tiên",MC:"Định hướng sự nghiệp"};
function NM(k){return NMX[k]||(PL[k]?PL[k].vn:String(k))}
const nml=k=>{const s=NM(k);return s.charAt(0).toLowerCase()+s.slice(1)};
const AGX={0:"hòa làm một với",60:"hỗ trợ",90:"va chạm với",120:"rất hợp với",180:"giằng co với"};
const ANX={0:"Hòa quyện",60:"Hỗ trợ nhẹ",90:"Va chạm",120:"Rất hợp",180:"Giằng co"};
const AG=a=>AGX[a]||"liên hệ với",AN=a=>ANX[a]||"Liên hệ";
const HN=h=>"mảng "+HOUSES[h-1].n.toLowerCase();
const OWN=(k,name)=>NM(k)+" của "+name,OWNl=(k,name)=>nml(k)+" của "+name;
const STR=o=>o<2?"rất rõ":o<4?"rõ":"vừa";
const TRN={Jupiter:"Giai đoạn may mắn",Saturn:"Giai đoạn thử thách",Uranus:"Giai đoạn biến động",Neptune:"Giai đoạn mơ hồ",Pluto:"Giai đoạn biến đổi sâu"};
// ---------- natural prose helpers ----------
const CTX=["ngay trong cách bạn xuất hiện và thể hiện bản thân","trong chuyện tiền bạc và những thứ mình sở hữu","trong những cuộc trò chuyện, việc học và các mối quan hệ gần gũi như anh chị em, hàng xóm","trong gia đình, ở chính ngôi nhà của mình","trong tình yêu, sở thích và những niềm vui","trong công việc hằng ngày và nếp sinh hoạt","trong hôn nhân và các mối quan hệ đôi lứa, đối tác","trong những gắn kết sâu sắc và các khoản tiền chung","khi học lên cao, đi xa hay tìm hiểu những điều lớn lao","trong sự nghiệp và cách xã hội nhìn nhận bạn","giữa bạn bè, các nhóm và cộng đồng","trong thế giới nội tâm, những lúc ở một mình"];
const PH2={Sun:"Bạn sống đúng với mình nhất",Moon:"Bạn thấy bình yên nhất",Mercury:"Đầu óc bạn bận rộn nhất",Venus:"Bạn dễ tìm thấy niềm vui và tình cảm nhất",Mars:"Bạn dồn sức nhiều nhất",Jupiter:"May mắn hay tìm đến bạn",Saturn:"Bạn học được nhiều bài học trưởng thành nhất",Uranus:"Những thay đổi bất ngờ hay xảy ra",Neptune:"Bạn dễ mơ mộng, và cũng dễ mơ hồ nhất,",Pluto:"Bạn trải qua những thay đổi sâu sắc nhất",Node:"Bạn lớn lên nhiều nhất",Chiron:"Chỗ bạn dễ tổn thương nhất nằm",Lilith:"Phần bản năng tự do của bạn bộc lộ rõ"};
function houseLine(k,h){return (PH2[k]||NM(k))+" "+CTX[h-1]+"."}
const lf=s=>s?s.charAt(0).toLowerCase()+s.slice(1):s;
const ELLACK2={F:"Bạn hơi thiếu chất lửa, nên việc khởi đầu thường chậm; có một mục tiêu rõ ràng hoặc một người truyền cảm hứng sẽ giúp bạn rất nhiều.",E:"Bạn lại hơi thiếu chất đất: ý tưởng thì nhiều nhưng biến thành việc cụ thể hơi chậm, nên lịch trình và những mốc thời gian rõ ràng sẽ giúp bạn rất nhiều.",A:"Bạn hơi thiếu chất khí, nên dễ bị cuốn vào vấn đề mà khó lùi lại nhìn cho khách quan; viết ra giấy hoặc nói chuyện với một người lý trí sẽ giúp bạn sáng ra.",W:"Bạn cũng hơi thiếu chất nước: bạn hay thể hiện sự quan tâm bằng việc làm hơn là lời nói, và đôi khi khó gọi tên chính cảm xúc của mình."};
const ELNICE={F:"lửa",E:"đất",A:"khí",W:"nước"};
let WEAVED=new Set();function weave(ch,k,max=3){const used=WEAVED;const out=[];const C1=["Thêm vào đó, ","Bên cạnh đó, ","Ngoài ra, "],C2=["Có một điểm cần để ý: ","Mặt khác, ","Cũng nên biết rằng "];let s=0,h=0;
  for(const a of aspWith(ch,k)){if(out.length>=max)break;if(["Lilith","Node","MC","ASC"].includes(a.o))continue;const key1=k+"-"+a.o,key2=a.o+"-"+k;if(!PAIR[key1]&&!PAIR[key2])continue;
    let t=pairText(k,a.o,a.ang);if(used.has(t)||/ của .* với /.test(t)&&!PAIR[key1]&&!PAIR[key2])continue;used.add(t);t=t.replace(" Mặt cần lưu ý: "," Dù vậy, bạn cũng ");if(!/^Bạn /.test(t))t="bạn "+lf(t);const hard=kind(a.ang)==="hard";out.push((hard?C2[h++%3]:C1[s++%3])+lf(t))}
  return out.length?`<p>${out.map(E).join(" ")}</p>`:""}
function patternProse(p){return p}

function natDetail(ch,k){const P=ch.pts[k],S=SIGNS[P.s],pw=P.power;let h=`<div class="head"><span class="big">${E(PL[k].g)}${VS}</span><div><div class="kicker">Phân tích từng phần</div><h3>${E(NM(k))}: chất ${E(S.n)}</h3></div></div>`;
  h+=`<div class="minirow"><span>Mang chất cung</span><strong>${E(S.n)}</strong></div>`;
  if(P.h)h+=`<div class="minirow"><span>Thể hiện rõ nhất ở</span><strong>${E(HOUSES[P.h-1].n)}</strong></div>`;
  h+=`<div class="minirow"><span>Mức độ thuận</span><strong><span class="tier ${pw.tier}">${pw.tier}</span> ${fmtN(pw.v)}/10</strong></div>`;
  if(pw.dg.lab)h+=`<div class="minirow"><span>Tình trạng</span><strong>${E(pw.dg.lab)}</strong></div>`;
  h+=`<p><b>Phần này nói về ${E(PL[k].fn)}.</b> ${E(signText(k,P.s))}</p>`;
  const exk={Sun:"sun",Moon:"moon",Venus:"venus",Mars:"mars"}[k];if(exk)h+=`<div class="ex"><span class="exl">Ví dụ</span>${E(S.ex[exk])}</div>`;
  if(P.h)h+=`<p><b>Thể hiện ở ${E(HN(P.h))}:</b> ${E(houseLine(k,P.h))} <span class="muted">${E(HOUSES[P.h-1].d)}</span></p>`;
  if(P.retro&&!["Node","Uranus","Neptune","Pluto","Chiron","Lilith"].includes(k))h+=`<p><b>Đang "đi lùi":</b> phần này hướng vào trong, bạn thường suy xét lại nhiều lần trước khi thể hiện ra ngoài.</p>`;
  if(k==="ASC"&&ch.H){const r=TRAD[P.s];h+=`<p><b>Phần dẫn dắt cả bản đồ</b> là ${E(nml(r))} (chất ${E(SIGNS[ch.pts[r].s].n)}, ở ${E(HN(ch.pts[r].h))}). Giống như người cầm lái, phần này ảnh hưởng nhiều nhất đến hướng đi của bạn: ${E(houseLine(r,ch.pts[r].h))}</p>`}
  if(k==="MC"&&ch.H){const r=TRAD[P.s];h+=`<p><b>Sự nghiệp gắn với ${E(HN(ch.pts[r].h))}</b>: ${E(HOUSES[ch.pts[r].h-1].dom)}.</p>`}
  const as=aspWith(ch,k);if(as.length){h+=`<h4>Liên hệ với các phần khác</h4><ul class="clean">`+as.slice(0,7).map(a=>`<li><b>${E(AG(a.ang).charAt(0).toUpperCase()+AG(a.ang).slice(1))} ${E(nml(a.o))}</b> <span class="muted">(mức ${E(STR(a.orb))})</span>: ${E(pairText(k,a.o,a.ang))}</li>`).join("")+`</ul>`}
  h+=`<p class="fine">Điểm cần lưu ý của chất ${E(S.n)}: ${E(S.shadow)}.</p><p class="fine">Tên chuyên môn: ${E(PL[k].vn)}${P.h?", nhà "+P.h:""}, ${degStr(P.lon)} ${E(S.n)}.</p>`;return h}
function sec(id,title,score,body){return `<article class="card" id="${id}"><div class="kicker">${E(title[0])}</div><h3>${E(title[1])}</h3>${score!=null?`<span class="score-inline">Chỉ số ${fmtN(score)}/10</span>`:""}${body}</article>`}
function aspLines(ch,k,max=4){return aspWith(ch,k).filter(a=>!["Lilith"].includes(a.o)).slice(0,max).map(a=>`<li><b>${E(NM(k))} ${E(AG(a.ang))} ${E(nml(a.o))}</b> (mức ${E(STR(a.orb))}): ${E(pairText(k,a.o,a.ang))}</li>`).join("")}
function planetsIn(ch,h){return Object.values(ch.pts).filter(p=>p.h===h&&!["ASC","MC","Lilith"].includes(p.k)).map(p=>p.k)}
const IN7={Saturn:"bạn rất nghiêm túc với cam kết; hôn nhân thường đến muộn nhưng bền, dễ chọn người chín chắn.",Jupiter:"may mắn trong chuyện bạn đời, người ấy thường rộng lượng và nâng đỡ bạn.",Venus:"có duyên trong tình cảm, rất coi trọng sự hòa hợp.",Mars:"mối quan hệ nhiều đam mê nhưng cũng dễ va chạm.",Uranus:"cần tự do trong hôn nhân, mối quan hệ dễ có bất ngờ.",Neptune:"dễ lý tưởng hóa người bạn đời, cần nhìn người thật việc thật.",Pluto:"mối quan hệ có cường độ cao và thay đổi bạn rất nhiều.",Moon:"bạn cần người bạn đời như một chỗ dựa cảm xúc.",Sun:"mối quan hệ là trung tâm của cuộc sống bạn.",Mercury:"bạn cần một người bạn đời nói chuyện thật hợp.",Chiron:"các mối quan hệ chạm vào vết thương cũ, và cũng là nơi giúp bạn chữa lành.",Node:"chuyện lứa đôi gắn với hướng phát triển của cả đời bạn."};
const IN2={Neptune:"tiền có thể đến từ việc sáng tạo hoặc giúp người, nhưng dễ thất thoát vì chi tiêu theo cảm xúc.",Saturn:"kiếm tiền vất vả lúc đầu, càng về sau càng vững.",Jupiter:"khá thuận lợi về tài chính.",Venus:"có thể kiếm tiền từ cái đẹp và các mối quan hệ.",Sun:"tự chủ tài chính là một phần quan trọng trong con người bạn.",Uranus:"thu nhập có lúc lên xuống bất ngờ, hợp với nhiều nguồn thu.",Pluto:"tài chính có những lần thay đổi lớn.",Moon:"cảm giác an toàn của bạn gắn chặt với tiền bạc.",Mars:"bạn chủ động kiếm tiền, nhưng cũng dễ tiêu nhanh.",Mercury:"có thể kiếm tiền nhờ đầu óc, lời nói, chữ nghĩa."};
const inH=(k,h)=>`Phần "${nml(k)}" nằm ở ${HN(h)}`;
function natReading(ch){WEAVED=new Set();const P=ch.pts,S=k=>SIGNS[P[k].s],hasH=!!ch.H,R=ch.radar;const out=[],toc=[];
  const add=(id,t,score,body,wide)=>{toc.push([id,t[0]]);out.push(sec(id,t,score,body).replace('class="card"',wide?'class="card wide"':'class="card"'))};
  const HLU=new Set();const HL=k=>{if(!(hasH&&P[k].h))return"";HLU.add(k);return" "+houseLine(k,P[k].h)};const fresh=l=>l.find(k=>!HLU.has(k)&&!["Node","Chiron","Lilith"].includes(k));
  const ex=t=>`<div class="ex"><span class="exl">Ví dụ</span>${E(t)}</div>`;
  // personality
  {let b=`<p>${E(S("Sun").core)}${E(HL("Sun"))}</p>`+ex(S("Sun").ex.sun);
   if(hasH){const r=TRAD[P.ASC.s];let p2=S("ASC").asc;if(P.ASC.s!==P.Sun.s)p2+=` Nhưng đó mới là lớp vỏ. Càng thân, người ta càng thấy rõ con người ${S("Sun").kw} bên trong bạn.`;
     HLU.add(r);p2+=` Thứ ảnh hưởng nhiều nhất đến hướng đi của bạn là ${nml(r)}: ${lf(houseLine(r,P[r].h))}`;b+=`<p>${E(p2)}</p>`}
   const dom=Object.entries(ch.el.el).sort((a,b)=>b[1]-a[1]),lack=Object.entries(ch.el.el).filter(x=>x[1]<=1);
   let p3=`Về tính khí, bạn nghiêng hẳn về chất ${ELNICE[dom[0][0]]}: ${ELTXT[dom[0][0]]}.`;lack.forEach(([e])=>{p3+=" "+ELLACK2[e]});b+=`<p>${E(p3)}</p>`;
   if(ch.patterns.length)b+=`<p>${ch.patterns.map(p=>E(p.d)).join(" ")}</p>`;
   b+=`<p class="fine">Điều bạn nên để ý ở bản thân: ${E(S("Sun").shadow)}${hasH&&P.ASC.s!==P.Sun.s?", và đôi khi "+E(S("ASC").shadow):""}.</p>`;add("nat-tinh-cach",["Tính cách","Bạn là người như thế nào"],R[0][1],b,true)}
  // emotions
  {let b=`<p>${E(S("Moon").moon)}${E(HL("Moon"))}</p>`;
   if(ch.moonRange&&sIdx(ch.moonRange[0])!==sIdx(ch.moonRange[1]))b+=`<div class="banner warn">Ngày bạn sinh, phần cảm xúc chuyển từ nét ${E(SIGNS[sIdx(ch.moonRange[0])].n)} sang nét ${E(SIGNS[sIdx(ch.moonRange[1])].n)}. Vì chưa rõ giờ sinh nên đoạn này chỉ mang tính tham khảo.</div>`;
   b+=ex(S("Moon").ex.moon)+weave(ch,"Moon");add("nat-cam-xuc",["Cảm xúc","Bên trong bạn cảm nhận ra sao"],R[1][1],b)}
  // mind
  {let b=`<p>${E(S("Mercury").merc)}${E(HL("Mercury"))}${hasH?E(" Trong chuyện trò hằng ngày, bạn có xu hướng "+SIGNS[sIdx(ch.H.cusps[2])].kw+"."):""}</p>`;
   if(P.Mercury.retro)b+=`<p>Bạn cũng thuộc kiểu hay nghĩ đi nghĩ lại. Bạn giỏi rà soát hơn là trả lời ngay, nên với những câu hỏi quan trọng, hãy cho mình thêm thời gian.</p>`;
   b+=weave(ch,"Mercury");add("nat-giao-tiep",["Tư duy","Cách bạn nghĩ, học và nói chuyện"],R[2][1],b)}
  // love
  {let b=`<p>${E(S("Venus").venus)}${E(HL("Venus"))}</p>`+ex(S("Venus").ex.venus);
   b+=`<p>${E("Còn khi đã thích ai, "+lf(S("Mars").mars))}</p>`;
   if(hasH){const dc=sIdx(ch.H.cusps[6]),r7=TRAD[dc],in7=planetsIn(ch,7);let p=SIGNS[dc].dc+" Người ấy thường xuất hiện "+CTX[P[r7].h-1]+".";
     if(in7.length)p+=" "+in7.map(k=>IN7[k]?("Bản đồ còn cho thấy "+IN7[k]):"").filter(Boolean).slice(0,2).join(" ");
     const d5=sIdx(ch.H.cusps[4]);p+=" Lúc mới tìm hiểu, bạn thường "+SIGNS[d5].kw+".";b+=`<p>${E(p)}</p>`}
   b+=weave(ch,"Venus");add("nat-tinh-yeu",["Tình yêu","Bạn yêu thế nào, hợp với kiểu người nào"],R[3][1],b,true)}
  // career
  {let b="";if(hasH){const mc=P.MC.s,r=TRAD[mc],in10=planetsIn(ch,10),d6=sIdx(ch.H.cusps[5]);
     let p=SIGNS[mc].mc+" Con đường sự nghiệp của bạn gắn nhiều với những gì diễn ra "+CTX[P[r].h-1]+".";
     if(in10.length)p+=" Trong công việc, người khác dễ nhận ra ở bạn "+in10.slice(0,3).map(k=>PL[k].fn).join(", ")+".";b+=`<p>${E(p)}</p><p><b>Những nghề hợp với bạn:</b> ${E(SIGNS[mc].jobs)}.</p>`;
     b+=`<p>${E("Ngày thường, bạn làm việc tốt nhất khi được "+SIGNS[d6].kw+".")}</p>`}
   else b+=`<p>${E("Vì chưa rõ giờ sinh nên chưa thể nói chắc về định hướng sự nghiệp. Dựa vào tính cách cốt lõi, những nghề hợp với bạn là: "+S("Sun").jobs+".")}</p>`;
   b+=`<p>${E(S("Saturn").sat+" Thành công vững chắc thường rõ dần quanh tuổi 29–30, khi bạn đã đi qua một chu kỳ trưởng thành. "+S("Jupiter").jup)}</p>`;
   add("nat-su-nghiep",["Sự nghiệp","Nghề phù hợp và cách bạn làm việc"],R[4][1],b)}
  // money
  {let b="";if(hasH){const d2=sIdx(ch.H.cusps[1]),r2=TRAD[d2],in2=planetsIn(ch,2),in8=planetsIn(ch,8);
     let p="Trong chuyện tiền bạc, bạn có xu hướng "+SIGNS[d2].kw+". Thu nhập thường đến "+CTX[P[r2].h-1]+".";
     if(in2.length)p+=" "+in2.map(k=>IN2[k]?lf(IN2[k]).replace(/^./,c=>c.toUpperCase()):"").filter(Boolean).slice(0,2).join(" ");
     if(in8.length)p+=" Bạn cũng nên để ý các khoản tiền chung với gia đình hoặc người bạn đời.";b+=`<p>${E(p)}</p>`}
   b+=`<p>${E({F:"Bạn dễ chi tiền cho trải nghiệm, niềm vui và những thứ giúp mình nổi bật; nên đặt trước một khoản 'được tiêu thoải mái' để khỏi tiếc về sau.",E:"Bạn thích chi cho đồ bền, chất lượng, đáng đồng tiền, và thường giữ tiền khá chắc tay.",A:"Bạn hay chi cho sách vở, đi lại, gặp gỡ và những thứ mới lạ; tiền đến nhanh nhưng cũng dễ đi nhanh.",W:"Bạn dễ chi tiền vì người thân và vì cảm xúc; mua sắm khi buồn là điều nên để ý."}[SIGNS[P.Venus.s].el])}</p>`;add("nat-tai-chinh",["Tài chính","Tiền bạc và cảm giác về giá trị bản thân"],R[5][1],b)}
  // family & friends
  if(hasH){const d4=sIdx(ch.H.cusps[3]),in4=planetsIn(ch,4),d11=sIdx(ch.H.cusps[10]),in11=planetsIn(ch,11);
    let p="Ở nhà, bạn thường "+SIGNS[d4].kw+", và tổ ấm bạn tạo ra cũng mang không khí ấy.";const f4=fresh(in4);if(f4){HLU.add(f4);p+=" "+houseLine(f4,4)}
    let q="Với bạn bè, bạn kết thân theo kiểu "+SIGNS[d11].kw+".";const f11=fresh(in11);if(f11){HLU.add(f11);q+=" "+houseLine(f11,11)}
    add("nat-gia-dinh",["Gia đình, bạn bè","Gốc rễ, tổ ấm và các mối quan hệ xã hội"],null,`<p>${E(p)}</p><p>${E(q)}</p>`)}
  // energy
  {let p={F:"Bạn nạp năng lượng bằng vận động và những thử thách mới; ngồi yên lâu dễ khiến bạn bứt rứt.",E:"Bạn nạp năng lượng bằng nhịp sống đều đặn, làm việc bằng tay hoặc ra ngoài thiên nhiên.",A:"Bạn nạp năng lượng bằng gặp gỡ, trò chuyện và đổi không khí; bị bó một chỗ lâu sẽ thấy ngột ngạt.",W:"Bạn nạp năng lượng bằng nghỉ ngơi, ở bên người thân và những hoạt động nhẹ nhàng như bơi, nghe nhạc."}[SIGNS[P.Mars.s].el];
   const fire=ch.el.el.F,earth=ch.el.el.E;p+=" "+(fire>=4?"Năng lượng của bạn dồi dào, nhưng cũng dễ cạn nếu ôm đồm quá nhiều việc cùng lúc.":fire<=1?"Bạn khởi động hơi chậm; chia việc thành những mục tiêu nhỏ và có người đồng hành sẽ giúp bạn giữ nhịp.":"Năng lượng của bạn ở mức vừa phải, khá đều.")+(earth<=1?" Một lịch sinh hoạt cố định sẽ giúp bạn bền sức hơn.":"");
   add("nat-nang-luong",["Năng lượng","Nhịp sống và cách nạp năng lượng"],null,`<p>${E(p)}</p><p class="fine">Phần này nói về nhịp sống và năng lượng, không phải lời khuyên y khoa.</p>`)}
  // purpose
  {const nd=P.Node.s;let p="Bạn lớn lên nhiều nhất khi tập sống "+SIGNS[nd].kw+". Ngược lại, vùng quen thuộc của bạn là "+SIGNS[(nd+6)%12].kw+": làm thì dễ, nhưng ở mãi trong đó sẽ khiến bạn giậm chân tại chỗ.";
   if(hasH)p+=" Con đường ấy thường mở ra "+CTX[P.Node.h-1]+".";
   if(P.Chiron)p+=" Chỗ bạn dễ tổn thương nhất liên quan đến việc sống "+S("Chiron").kw+". Khi đã vượt qua được, đây lại chính là nơi bạn giúp người khác nhiều nhất.";
   add("nat-su-menh",["Sứ mệnh","Hướng phát triển và bài học lớn"],null,`<p>${E(p)}</p>`)}
  // numerology
  {const N=ch.num,nt=k=>NUM[k]||["",""];let b=`<p><b>Con số chủ đạo ${N.lp}, ${E(lf(nt(N.lp)[0]))}.</b> ${E(nt(N.lp)[1])}</p>`;if(N.ex)b+=`<p>${E("Con số từ họ tên là "+N.ex+": "+lf(nt(N.ex)[1])+" Bên trong, bạn khao khát được là "+lf(nt(N.so)[0])+"; còn người ngoài thường nhìn bạn như "+lf(nt(N.pe)[0])+".")}</p>`;
   add("nat-than-so",["Thần số học","Tham khảo nhanh từ họ tên và ngày sinh"],null,b)}
  return{html:out.join(""),toc}}

// ---------- natural-language input (local parser + optional Claude) ----------
const strip=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D");
const low=s=>strip(s).toLowerCase();
const FOREIGN_TZ={seoul:[9,false],tokyo:[9,false],bangkok:[7,false],singapore:[8,false],sydney:[10,true],london:[0,true],paris:[1,true],newyork:[-5,true]};
const PLACE_INDEX=(()=>{const idx=[];const add=(n,k)=>{n=low(n).replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();if(n.length>=2)idx.push([n,k])};
  for(const [k,v] of Object.entries(CITIES)){if(k==="other")continue;const lab=v[0];add(lab.replace(/\(.*\)/,"").replace(/^TP\.\s*/,""),k);const m=lab.match(/\(([^)]+)\)/);if(m)add(m[1],k)}
  const extra={"sai gon":"hcm","saigon":"hcm","sg":"hcm","tp hcm":"hcm","tphcm":"hcm","hcm":"hcm","ho chi minh":"hcm","thanh pho ho chi minh":"hcm","hn":"hanoi","thu do":"hanoi","thua thien hue":"hue","nghe an":"vinh","quang ninh":"halong","khanh hoa":"nhatrang","lam dong":"dalat","dak lak":"bmt","daklak":"bmt","dac lac":"bmt","gia lai":"pleiku","binh duong":"thudaumot","dong nai":"bienhoa","ba ria":"vungtau","ba ria vung tau":"vungtau","an giang":"longxuyen","kien giang":"rachgia","tien giang":"mytho","binh dinh":"quynhon","phu yen":"tuyhoa","ninh thuan":"phanrang","binh thuan":"phanthiet","quang tri":"dongha","quang nam":"tamky","long an":"tanan","dien bien":"dienbien","quang binh":"dongHoi","vinh phuc":"vinhphuc","phu tho":"phutho","ha nam":"hanam","binh phuoc":"tayninh","han quoc":"seoul","nhat ban":"tokyo","nhat":"tokyo","thai lan":"bangkok","new york":"newyork","my":"newyork"};
  for(const k in extra)add(k,extra[k]);return idx.sort((a,b)=>b[0].length-a[0].length)})();
function findPlace(text){const t=" "+low(text).replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ")+" ";for(const [n,k] of PLACE_INDEX){if(t.includes(" "+n+" "))return k}return null}
function validDate(y,m,d){if(!(y>=1900&&y<=2100&&m>=1&&m<=12&&d>=1&&d<=31))return false;const dt=new Date(Date.UTC(y,m-1,d));return dt.getUTCMonth()===m-1&&dt.getUTCDate()===d}
const p2=n=>String(n).padStart(2,"0");
function findDate(t){// t is lowercase no-diacritics
  const pats=[[/(\d{4})-(\d{1,2})-(\d{1,2})/,m=>[+m[1],+m[2],+m[3]]],[/(\d{1,2})\s*[\/.\-]\s*(\d{1,2})\s*[\/.\-]\s*(\d{4}|\d{2})(?!\d)/,m=>{let y=+m[3];if(m[3].length===2)y+=y>=30?1900:2000;return[y,+m[2],+m[1]]}],
    [/ngay\s*(\d{1,2})\s*(?:thang|\/)\s*(\d{1,2})\s*(?:nam|\/|,)?\s*(\d{4})/,m=>[+m[3],+m[2],+m[1]]],[/(\d{1,2})\s*thang\s*(\d{1,2})\s*(?:nam|,)?\s*(\d{4})/,m=>[+m[3],+m[2],+m[1]]]];
  for(const [re,f] of pats){const m=t.match(re);if(m){const [y,mo,d]=f(m);if(validDate(y,mo,d))return{date:`${y}-${p2(mo)}-${p2(d)}`,idx:m.index,len:m[0].length};return{bad:m[0],idx:m.index,len:m[0].length}}}return null}
function findTime(t){if(/khong ro gio|khong biet gio|chua ro gio|khong nho gio|khong co gio|gio khong ro|gio\s*\?/.test(t))return{unknown:true};
  const re=/(?:luc\s*)?(\d{1,2})\s*(?:h|gio|:)\s*(\d{1,2})?\s*(?:p|phut)?\b\s*(sang|trua|chieu|toi|dem|khuya|am|pm)?/;const m=t.match(re);if(!m)return null;
  let h=+m[1],mi=m[2]?+m[2]:0;const per=m[3]||"";if(["chieu","toi","pm"].includes(per)&&h<12)h+=12;else if(per==="trua"&&h<=3)h+=12;else if((per==="dem"||per==="khuya")&&h>=8&&h<12)h+=12;else if((per==="dem"||per==="khuya"||per==="sang"||per==="am")&&h===12)h=0;
  if(h>23||mi>59)return{bad:m[0]};return{time:`${p2(h)}:${p2(mi)}`}}
const LEAD=/^(?:\s|,|:|-|so sanh|so voi|voi|va|cua|giua|nguoi chinh la|nguoi chinh|(?:\d+|hai|ba|bon|nam|sau|bay|tam)\s+nguoi|nguoi|ban|anh|chi|em|co|chu|bac|ong|ba|me|bo|cau|mo|be)\b\s*/;
function cleanName(raw){let s=String(raw||"").replace(/[()\[\]"“”]/g," ").replace(/\s+/g," ").trim();
  for(let i=0;i<6;i++){const l=low(s);const m=l.match(LEAD);if(!m||!m[0].length)break;const nx=s.slice(m[0].length).trim();if(!nx)break;s=nx}
  s=s.replace(/\s+(?:sinh|sn|ngày|ngay|lúc|luc|nam|nữ|nu|ở|o|tại|tai)\s*$/i,"").replace(/[\s:,\-–]+$/,"").trim();
  const l=low(s);if(/^(sinh|sn|ngay)\b/.test(l))return"";return s.replace(/[,:;\-–]+$/,"").trim()}
function splitPeople(part){// returns [{name, details}]
  const out=[];const re=/([^,;()\n]*?)\s*\(([^)]*)\)/g;let m,last=0,hits=0;
  while((m=re.exec(part))){if(findDate(low(m[2]))){out.push({name:m[1],details:m[2]});hits++;last=re.lastIndex}}
  if(hits){const rest=part.slice(last);if(findDate(low(rest)))out.push(...splitPeople(rest));return out}
  const chunks=part.split(/\n|;|\s+và\s+|\s+va\s+(?=[A-ZĐ])|,\s*(?=[A-ZĐÀ-Ỹ][^\d,]{0,40}?(?:\d|sinh))/);
  const merged=[];for(const c of chunks){if(!c||!c.trim())continue;if(merged.length&&!findDate(low(c)))merged[merged.length-1]+=", "+c;else merged.push(c)}
  for(const c of merged){const l=low(c);const d=findDate(l);
    let cut=c.length;const marks=[d?d.idx:-1,l.search(/\b(sinh|sn|ngay|luc)\b/),l.search(/\d/),c.indexOf(":")].filter(x=>x>=0);if(marks.length)cut=Math.min(...marks);
    out.push({name:c.slice(0,cut),details:c.slice(cut)})}
  return out}
function parseLocal(text){const src=String(text||"").trim();const res={people:[],center:null,issues:[]};if(!src)return res;
  // center detection: "... với X" (last 'với') or explicit "người chính"
  let left=src,right="";const L=low(src);const k=L.lastIndexOf(" voi ");
  if(k>0&&(/so sanh|so voi|hop|tuong hop|ghep/.test(L.slice(0,k))||(findDate(L.slice(0,k))&&findDate(L.slice(k+5))))){left=src.slice(0,k);right=src.slice(k+5)}
  const people=[];for(const [part,isC] of [[left,false],[right,true]]){if(!part.trim())continue;for(const seg of splitPeople(part)){if(!/\d/.test(seg.name+" "+seg.details))continue;people.push({seg,isC})}}
  people.forEach(({seg,isC},i)=>{const det=low(seg.details),full=low(seg.name+" "+seg.details);const w=[];
    const d=findDate(det)||findDate(full);let date=null;if(d&&d.date)date=d.date;else if(d&&d.bad)w.push("Ngày sinh không hợp lệ: "+d.bad);else w.push("Chưa thấy ngày sinh");
    let rest=det;if(d&&d.idx!=null&&findDate(det))rest=det.slice(0,d.idx)+" "+det.slice(d.idx+d.len);
    const tm=findTime(rest);let time="12:00",unknown=false;if(tm&&tm.time)time=tm.time;else if(tm&&tm.unknown){unknown=true}else{unknown=true;w.push(tm&&tm.bad?"Giờ không hợp lệ ("+tm.bad+"), coi như không rõ giờ":"Không thấy giờ sinh, coi như không rõ giờ")}
    let city=findPlace(seg.details);if(!city){city="hanoi";w.push("Chưa thấy nơi sinh, tạm dùng Hà Nội")}
    let tz=7;if(FOREIGN_TZ[city]){tz=FOREIGN_TZ[city][0];if(FOREIGN_TZ[city][1])w.push("Nơi sinh có giờ mùa hè: kiểm tra lại múi giờ")}
    else if(date&&CITIES[city][1]<17&&date>="1960-01-01"&&date<="1975-06-12"){tz=8;w.push("Miền Nam 1960–1975 dùng UTC+8, đã tự chọn")}
    const isCenter=isC||/nguoi chinh/.test(full);let name=cleanName(seg.name);if(!name)name="Người "+(i+1);
    res.people.push({name,date,time,unknown,city,tz,warn:w,isCenter})});
  const ci=res.people.findIndex(p=>p.isCenter);res.center=ci>=0?ci:null;
  if(!res.people.length)res.issues.push("Chưa nhận ra người nào. Hãy ghi theo dạng: Tên (ngày/tháng/năm giờ, nơi sinh).");
  return res}
const AI_EXAMPLE="So sánh Lan (12/3/1999 7h30 sáng, Hà Nội), Quân (2/11/1998 9h tối, Đà Nẵng) và Hùng (5/5/2000, không rõ giờ, Huế) với Ngọc (14/9/2001 6h15, Hà Nội)";
let SAMPLE_FN=null;
(async()=>{try{if(window.claude&&typeof window.claude.use==="function"){SAMPLE_FN=await window.claude.use("sample");}}catch(e){SAMPLE_FN=null}aiModeLabel()})();
function aiModeLabel(){const el=document.getElementById("aiMode");if(el)el.textContent=SAMPLE_FN?"Bộ đọc câu + Claude (tài khoản của bạn)":"Bộ đọc câu trong máy"}
async function parseWithClaude(text){const prompt=`Bạn trích thông tin sinh từ câu tiếng Việt cho một ứng dụng chiêm tinh.
Câu của người dùng: """${String(text).slice(0,4000)}"""
Trả về DUY NHẤT một JSON dạng: {"people":[{"name":"tên","date":"YYYY-MM-DD hoặc null","time":"HH:MM 24h hoặc null","timeUnknown":true/false,"place":"tên tỉnh/thành phố hoặc null"}],"center":số thứ tự (bắt đầu 0) của người được so sánh với những người còn lại, hoặc null}
Quy tắc: ngày viết kiểu Việt Nam là ngày/tháng/năm. "chiều", "tối" là sau 12 giờ trưa. Không bịa: thiếu thông tin thì để null. Ví dụ: {"people":[{"name":"Lan","date":"1999-03-12","time":"07:30","timeUnknown":false,"place":"Hà Nội"}],"center":null}`;
  const r=await SAMPLE_FN.json(prompt,{modelTier:"quick"});const res={people:[],center:null,issues:[],viaClaude:true};
  const arr=Array.isArray(r&&r.people)?r.people:[];
  arr.forEach((q,i)=>{const w=["Đọc bằng Claude, hãy kiểm tra lại"];let date=null;const dm=String(q.date||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);if(dm&&validDate(+dm[1],+dm[2],+dm[3]))date=dm[0];else w.push("Chưa có ngày sinh hợp lệ");
    let time="12:00",unknown=!!q.timeUnknown;const tm=String(q.time||"").match(/^(\d{1,2}):(\d{2})$/);if(tm&&+tm[1]<24&&+tm[2]<60&&!unknown)time=p2(+tm[1])+":"+tm[2];else unknown=true;
    let city=q.place?findPlace(String(q.place)):null;if(!city){city="hanoi";w.push(q.place?"Chưa có nơi sinh '"+q.place+"' trong danh sách, tạm dùng Hà Nội":"Chưa thấy nơi sinh, tạm dùng Hà Nội")}
    let tz=7;if(FOREIGN_TZ[city])tz=FOREIGN_TZ[city][0];else if(date&&CITIES[city][1]<17&&date>="1960-01-01"&&date<="1975-06-12"){tz=8;w.push("Miền Nam 1960–1975 dùng UTC+8, đã tự chọn")}
    res.people.push({name:String(q.name||"").trim().slice(0,80)||("Người "+(i+1)),date,time,unknown,city,tz,warn:w,isCenter:false})});
  const c=Number.isInteger(r&&r.center)&&r.center>=0&&r.center<res.people.length?r.center:null;res.center=c;return res}
let AI_RES=null;
function renderAiPreview(){const box=document.getElementById("aiPreview");if(!AI_RES){box.innerHTML="";return}
  const R=AI_RES;if(!R.people.length){box.innerHTML=`<div class="banner warn">${E(R.issues.join(" ")||"Chưa nhận ra người nào.")}</div>`;return}
  if(R.center==null)R.center=R.people.length-1;
  const over=R.people.length>MAXP;const okAll=R.people.every(p=>p.date);
  box.innerHTML=`<div class="tbl"><table class="aitbl"><thead><tr><th>#</th><th>Tên</th><th>Ngày sinh</th><th>Giờ</th><th>Nơi sinh</th><th>Múi giờ</th><th>Người chính</th><th>Ghi chú</th></tr></thead><tbody>`+
    R.people.slice(0,MAXP).map((p,i)=>`<tr><td class="num">${i+1}</td><td><b>${E(p.name)}</b></td><td class="num">${p.date?p.date.split("-").reverse().join("/"):'<span class="tier D">thiếu</span>'}</td><td class="num">${p.unknown?"không rõ":p.time}</td><td>${E(CITIES[p.city][0])}</td><td class="num">UTC${p.tz>=0?"+":"−"}${Math.abs(p.tz)}</td><td><input type="radio" name="aiCenter" value="${i}" ${R.center===i?"checked":""} aria-label="Đặt ${E(p.name)} làm người chính"></td><td class="fine">${p.warn.map(E).join("<br>")||"Đủ thông tin"}</td></tr>`).join("")+`</tbody></table></div>`+
    (over?`<div class="banner warn">Có ${R.people.length} người, ứng dụng chỉ nhận tối đa ${MAXP}. Những người sau sẽ bị bỏ qua.</div>`:"")+
    `<div class="btns" style="margin-top:10px"><button class="btn primary" type="button" id="aiApply" ${okAll?"":"disabled"}>Áp dụng và xem kết quả</button><button class="btn" type="button" id="aiCancel">Hủy</button>${okAll?"":'<span class="fine">Bổ sung ngày sinh còn thiếu vào câu rồi bấm Phân tích lại.</span>'}</div>`}
async function runAi(){const ta=document.getElementById("aiText"),st=document.getElementById("aiStatus"),btn=document.getElementById("aiParse");const text=ta.value.trim();if(!text){st.textContent="Hãy nhập một câu mô tả những người cần so sánh.";return}
  let R=parseLocal(text);const weak=!R.people.length||R.people.some(p=>!p.date);
  if(weak&&SAMPLE_FN){btn.disabled=true;st.textContent="Bộ đọc câu chưa chắc chắn, đang nhờ Claude đọc giúp...";
    try{const C=await parseWithClaude(text);if(C.people.length&&C.people.filter(p=>p.date).length>=R.people.filter(p=>p.date).length)R=C;st.textContent=R.viaClaude?"Claude đã đọc xong. Kiểm tra lại bảng bên dưới trước khi áp dụng.":"Đã đọc xong."}
    catch(e){st.textContent=({not_granted:"Bạn chưa cho phép trang dùng Claude, nên chỉ dùng bộ đọc câu trong máy.",rate_limited:"Claude đang giới hạn lượt dùng, hãy thử lại sau.",sampling_disabled:"Tài khoản này không dùng được Claude trong trang.",invalid_json:"Claude trả lời chưa đúng định dạng, hãy viết câu rõ hơn rồi thử lại."})[e&&e.code]||"Không gọi được Claude, chỉ dùng bộ đọc câu trong máy."}
    finally{btn.disabled=false}}
  else st.textContent=R.people.length?"Đã đọc xong. Kiểm tra lại bảng bên dưới trước khi áp dụng.":"";
  AI_RES=R;renderAiPreview()}
function applyAi(){if(!AI_RES)return;const R=AI_RES;const list=R.people.slice(0,MAXP).filter(p=>p.date);if(!list.length)return;const replace=document.getElementById("aiReplace").checked;
  const sel=document.querySelector('input[name="aiCenter"]:checked');const ci=sel?+sel.value:R.center;
  const mk=(p,id)=>({id,name:p.name,date:p.date,time:p.unknown?"12:00":p.time,unknown:p.unknown,city:p.city,lat:"",lon:"",tz:p.tz});
  let centerId=null;
  if(replace){state.people=list.map((p,i)=>mk(p,"p"+(i+1)));centerId="p"+((ci!=null&&ci<list.length?ci:list.length-1)+1)}
  else{const room=MAXP-state.people.length;list.slice(0,room).forEach((p,i)=>{let n=1;while(byId("p"+n))n++;const id="p"+n;state.people.push(mk(p,id));if(i===ci)centerId=id})}
  if(centerId)state.center=centerId;state.pairA=null;state.synSel=0;state.view=state.people[0].id;state.trView=state.people[0].id;
  AI_RES=null;renderAiPreview();document.getElementById("aiStatus").textContent="Đã áp dụng "+list.length+" người.";save();renderAll();renderForms();if(state.people.length>=2){tab("hop-doi");try{window.scrollTo({top:0})}catch(e){}}}

// ---------- unknown birth time simulation ----------
const SIMWIN={all:["Cả ngày",0,1440],sang:["Sáng (5h–11h)",300,660],trua:["Trưa (11h–13h)",660,780],chieu:["Chiều (13h–18h)",780,1080],toi:["Tối (18h–23h)",1080,1380],dem:["Đêm (23h–5h)",1380,1740],custom:["Tự chọn khoảng giờ",null,null]};
const hm=min=>{const m=((Math.round(min)%1440)+1440)%1440;return p2(Math.floor(m/60))+":"+p2(m%60)};
const toMin=s=>{const m=String(s||"").match(/^(\d{1,2}):(\d{2})$/);return m?(+m[1])*60+(+m[2]):null};
const SIMC=new Map(),SIM_ASC_N=24;
function simWindow(p){const w=SIMWIN[p.simWin]?p.simWin:"all";if(w==="custom"){let a=toMin(p.simFrom),b=toMin(p.simTo);if(a==null||b==null)return[0,1440,"Cả ngày (khoảng tự chọn chưa hợp lệ)"];if(b<=a)b+=1440;return[a,b,"Từ "+hm(a)+" đến "+hm(b)]}return[SIMWIN[w][1],SIMWIN[w][2],SIMWIN[w][0]]}
function simSamples(p){if(!p||!p.unknown||!p.date)return null;const [a,b,label]=simWindow(p);const asc=p.ascKnown===""||p.ascKnown==null?-1:+p.ascKnown;
  const key=[p.date,p.city,p.lat,p.lon,p.tz,a,b,asc].join("|");if(SIMC.has(key))return SIMC.get(key);
  const span=b-a,step=Math.max(10,Math.ceil(span/36/5)*5);const all=[];
  for(let t=a+step/2;t<b;t+=step){const c=build({...p,unknown:false,time:hm(t)});if(c&&c.H)all.push({t,c})}
  let keep=all;
  if(asc>=0){// known rising sign: re-sample densely inside the matching time span so the range is not built from only ~3 points
    // spans where that sign is rising (it can appear twice in one day: just after midnight and late evening)
    const segs=[];all.forEach((x,i)=>{if(x.c.pts.ASC.s!==asc)return;const g=segs[segs.length-1];if(g&&g.last===i-1){g.t1=x.t;g.last=i}else segs.push({t0:x.t,t1:x.t,last:i})});
    const R=segs.length?segs.map(g=>[Math.max(a,g.t0-step),Math.min(b,g.t1+step)]):[[a,b]];
    const L=R.reduce((s,r)=>s+r[1]-r[0],0),fs=Math.max(3,L/SIM_ASC_N);keep=[];
    for(const [lo,hi] of R)for(let t=lo+fs/2;t<hi;t+=fs){const c=build({...p,unknown:false,time:hm(t)});if(c&&c.H&&c.pts.ASC.s===asc)keep.push({t,c})}}
  const res={label,step,from:a,to:b,asc,all,keep};SIMC.set(key,res);return res}
const quant=(arr,q)=>{const s=[...arr].sort((x,y)=>x-y);if(!s.length)return null;const i=(s.length-1)*q,lo=Math.floor(i),hi=Math.ceil(i);return s[lo]+(s[hi]-s[lo])*(i-lo)};
const thin=(arr,n)=>arr.length<=n?arr:Array.from({length:n},(_,i)=>arr[Math.floor((i+.5)*arr.length/n)]);
function simPair(A,B){const sa=A.p.unknown?simSamples(A.p):null,sb=B.p.unknown?simSamples(B.p):null;if(!sa&&!sb)return null;
  let la=sa?sa.keep.map(x=>x.c):[A],lb=sb?sb.keep.map(x=>x.c):[B];if(!la.length||!lb.length)return{empty:true};
  if(sa&&sb){la=thin(la,18);lb=thin(lb,18)}
  const tot=[],pct=[],dims=DIM.map(()=>[]),dpct=DIM.map(()=>[]),tiers={S:0,A:0,B:0,C:0,D:0};let n=0;
  for(const a of la)for(const b of lb){const S=synastry(a,b);tot.push(S.total);pct.push(S.totalPct);S.radar.forEach((r,i)=>{dims[i].push(r[1]);dpct[i].push(r.pct)});tiers[S.tier]++;n++}
  const mp=quant(pct,.5);return{n,total:scoreOf(mp),totalPct:mp,tier:tierOf(mp),lo:quant(tot,.1),hi:quant(tot,.9),tiers,dims:dims.map((d,i)=>({v:scoreOf(quant(dpct[i],.5)),pct:quant(dpct[i],.5),lo:quant(d,.1),hi:quant(d,.9)})),who:[sa?A.short:null,sb?B.short:null].filter(Boolean)}}
function applySim(S,sim){if(!sim||sim.empty){S.sim=sim||null;return S}S.sim=sim;S.total=sim.total;S.totalPct=sim.totalPct;S.tier=sim.tier;S.radar.forEach((r,i)=>{r[1]=sim.dims[i].v;r.pct=sim.dims[i].pct;r.range=[sim.dims[i].lo,sim.dims[i].hi]});return S}
function natSimSummary(ch){const s=simSamples(ch.p);if(!s)return null;const K=s.keep;if(!K.length)return{empty:true,s};
  const ascG={};K.forEach(x=>{const k=x.c.pts.ASC.s;(ascG[k]=ascG[k]||[]).push(x.t)});
  const ascAll={};s.all.forEach(x=>{const k=x.c.pts.ASC.s;(ascAll[k]=ascAll[k]||[]).push(x.t)});
  const moonG={};K.forEach(x=>{const k=x.c.pts.Moon.s;moonG[k]=(moonG[k]||0)+1});
  const stable=["Sun","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"].filter(k=>new Set(K.map(x=>x.c.pts[k].s)).size===1);
  const radar=NATDIM.map((n,i)=>{const v=K.map(x=>x.c.radar[i][1]),pc=K.map(x=>x.c.radar[i].pct);return{n,v:scoreOf(quant(pc,.5)),pct:quant(pc,.5),lo:quant(v,.1),hi:quant(v,.9)}});
  return{s,ascG,ascAll,moonG,stable,radar,n:K.length}}
function renderNatSim(ch){const box=$("natSim");const S=ch?natSimSummary(ch):null;if(!S){box.className="panel hidden";box.innerHTML="";return}box.className="panel";
  if(S.empty){box.innerHTML=`<h3>Giả lập giờ sinh</h3><div class="banner warn" style="margin-top:8px">Không có giờ nào trong khoảng "${E(S.s.label)}" cho ấn tượng đầu tiên (cung Mọc) ${E(SIGNS[S.s.asc].n)}. Hãy nới khoảng giờ hoặc bỏ chọn cung Mọc ở tab 04.</div>`;return}
  const s=S.s,n=S.n;const fmtRange=ts=>hm(Math.min(...ts)-s.step/2)+"–"+hm(Math.max(...ts)+s.step/2);
  const asc=Object.entries(S.ascG).sort((a,b)=>b[1].length-a[1].length);
  let h=`<div class="formhead"><h3>Giả lập giờ sinh</h3><span class="pill">${n} giờ sinh đã thử</span></div>
  <p class="fine" style="margin-top:4px">Không rõ giờ sinh nên app tính thử bản đồ ở ${n} mốc giờ, mỗi ${s.step} phút, trong khoảng: <b>${E(s.label)}</b>${s.asc>=0?" · chỉ giữ các giờ có cung Mọc "+E(SIGNS[s.asc].n):""}. Các chỉ số bên dưới là giá trị giữa (trung vị) của tất cả các mốc.</p>
  <div class="simgrid"><div><h4>Chắc chắn dù sinh giờ nào</h4><ul class="clean">${S.stable.map(k=>`<li>${E(NM(k))}: chất ${E(SIGNS[ch.pts[k].s].n)}</li>`).join("")}${Object.keys(S.moonG).length===1?`<li>Thế giới cảm xúc: chất ${E(SIGNS[+Object.keys(S.moonG)[0]].n)}</li>`:""}</ul>
  ${Object.keys(S.moonG).length>1?`<h4 style="margin-top:10px">Thế giới cảm xúc chưa chắc chắn</h4><ul class="clean">${Object.entries(S.moonG).sort((a,b)=>b[1]-a[1]).map(([k,c])=>`<li>${E(SIGNS[+k].n)}: ${Math.round(c/n*100)}% số mốc giờ</li>`).join("")}</ul>`:""}</div>
  <div><h4>Ấn tượng đầu tiên (cung Mọc) có thể</h4><div class="ascbars">${asc.map(([k,ts])=>`<button type="button" class="ascrow" data-asc="${k}" data-pid="${ch.p.id}" title="Chọn để thu hẹp theo cung Mọc này"><span>${E(SIGNS[+k].g)}${VS} ${E(SIGNS[+k].n)}</span><span class="t"><span style="width:${ts.length/n*100}%"></span></span><span class="fine">${Math.round(ts.length/n*100)}% · ${fmtRange(ts)}</span></button>`).join("")}</div>
  <p class="fine" style="margin-top:6px">${s.asc>=0?`<button type="button" class="btn" data-asc="-1" data-pid="${ch.p.id}">Bỏ giới hạn cung Mọc</button>`:"Nếu người này biết cung Mọc của mình, bấm vào cung đó để app chỉ giữ các giờ khớp."}</p></div></div>
  <h4 style="margin-top:12px">Chỉ số theo giả lập</h4><div class="tbl"><table><thead><tr><th>Mảng</th><th>Giá trị giữa</th><th>Khoảng thường gặp</th><th>Độ chắc chắn</th></tr></thead><tbody>${S.radar.map(r=>{const w=r.hi-r.lo;return `<tr><td>${E(r.n)}</td><td class="num"><b>${fmtN(r.v)}</b></td><td class="num">${fmtN(r.lo)} – ${fmtN(r.hi)}</td><td>${w<=1.5?'<span class="tier A">cao</span>':w<=3.5?'<span class="tier B">vừa</span>':'<span class="tier C">thấp, phụ thuộc giờ sinh</span>'}</td></tr>`}).join("")}</tbody></table></div>
  <p class="fine" style="margin-top:8px">Muốn chính xác hơn: hỏi gia đình buổi sinh (sáng, chiều, tối) rồi chọn ở tab 04, hoặc chọn cung Mọc nếu người đó đã biết.</p>`;
  box.innerHTML=h}

// ---------- render ----------
let CH={A:null,B:null};
let CHM={},GROUP=[];
function calc(){fixRefs();CHM={};for(const p of state.people){const c=build(p);CHM[p.id]=c;if(c&&c.p.unknown){const S=natSimSummary(c);if(S&&!S.empty)c.radar.forEach((r,i)=>{r[1]=S.radar[i].v;r.pct=S.radar[i].pct;r.range=[S.radar[i].lo,S.radar[i].hi]})}}CH.A=CHM[state.pairA];CH.B=CHM[state.center];
  GROUP=state.people.filter(p=>p.id!==state.center&&CHM[p.id]&&CHM[state.center]).map(p=>({id:p.id,ch:CHM[p.id],S:applySim(synastry(CHM[p.id],CHM[state.center]),simPair(CHM[p.id],CHM[state.center]))})).sort((a,b)=>b.S.total-a.S.total||a.ch.p.name.localeCompare(b.ch.p.name,"vi"))}
function personSeg(){const mk=(sel,cur)=>state.people.map(p=>`<button type="button" data-person="${p.id}" aria-pressed="${p.id===cur}">${E(CHM[p.id]?CHM[p.id].short:short(p.name))}</button>`).join("");
  $("segNat").innerHTML=mk("nat",state.view);$("segTr").innerHTML=mk("tr",state.trView)}
const SERIES=["--b","--accent","--water","--earth","--fire","--gold","--neutral"];
function renderGroup(){const B=CHM[state.center];if(!B||!GROUP.length){$("grpBody").innerHTML=`<div class="empty">Thêm ít nhất một người nữa ở tab 04 để so sánh.</div>`;$("grpRadar").innerHTML="";$("grpLegend").innerHTML="";return}
  $("grpTitle").textContent="So sánh nhóm với "+B.short;
  $("grpBody").innerHTML=`<div class="tbl"><table class="grp"><thead><tr><th>#</th><th>Người</th><th>Tổng</th><th>Bậc</th><th>Phân vị</th>${DIM.map(d=>`<th>${E(d)}</th>`).join("")}<th></th></tr></thead><tbody>`+GROUP.map((g,i)=>{const r=g.S.radar;const best=[...r].sort((a,b)=>b[1]-a[1])[0][0],worst=[...r].sort((a,b)=>a[1]-b[1])[0][0];
    return `<tr class="${g.id===state.pairA?"sel":""}" data-pair="${g.id}" tabindex="0"><td class="num">${i+1}</td><td><b>${E(g.ch.p.name)}</b><div class="fine">Mạnh: ${E(best)} · Cần chú ý: ${E(worst)}</div><div class="hint">${g.id===state.pairA?"✓ Đang xem chi tiết bên dưới":"Chạm để xem chi tiết ›"}</div></td><td class="num"><b>${fmtN(g.S.total)}</b>${g.S.sim&&!g.S.sim.empty?`<div class="fine">giả lập ${fmtN(g.S.sim.lo)}–${fmtN(g.S.sim.hi)}</div>`:""}</td><td><span class="tier ${g.S.tier}">${g.S.tier}</span></td><td class="num">${g.S.totalPct!=null?"Cao hơn "+pctTxt(g.S.totalPct)+"%":"—"}</td>${r.map(x=>`<td class="num">${fmtN(x[1])}</td>`).join("")}<td><button type="button" class="btn" data-pair="${g.id}">${g.id===state.pairA?"Đang xem":"Xem chi tiết"}</button></td></tr>`}).join("")+`</tbody></table></div>`;
  const svg=$("grpRadar");svg.innerHTML="";const show=GROUP.slice(0,SERIES.length);const cx=210,cy=185,R=120,n=6;const pt=(i,v)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[cx+R*v/10*Math.cos(a),cy+R*v/10*Math.sin(a)]};
  [2,4,6,8,10].forEach(v=>el("polygon",{points:DIM.map((_,i)=>pt(i,v).join(",")).join(" "),fill:"none",stroke:"var(--line)","stroke-width":v===10?1.2:.8},svg));
  DIM.forEach((d,i)=>{const [x,y]=pt(i,10);el("line",{x1:cx,y1:cy,x2:x,y2:y,stroke:"var(--line)"},svg);const [lx,ly]=pt(i,12.5);const anc=Math.abs(lx-cx)<8?"middle":lx>cx?"start":"end";el("text",{x:lx,y:ly,"text-anchor":anc,"dominant-baseline":"central","font-size":12,"font-weight":600,fill:"var(--ink)","font-family":"var(--f-body)"},svg,d)});
  show.forEach((g,k)=>{const c=SERIES[k];el("polygon",{points:g.S.radar.map((r,i)=>pt(i,r[1]).join(",")).join(" "),fill:`var(${c})`,"fill-opacity":.08,stroke:`var(${c})`,"stroke-width":g.id===state.pairA?2.6:1.6},svg)});
  $("grpLegend").innerHTML=show.map((g,k)=>`<button type="button" class="lg${g.id===state.pairA?" on":""}" data-pair="${g.id}"><span class="dot" style="background:var(${SERIES[k]})"></span>${E(g.ch.short)} ${fmtN(g.S.total)}</button>`).join("")}
function renderNatal(){const ch=CHM[state.view];if(!ch){$("natSub").textContent="Chưa đủ thông tin. Hãy nhập ở tab 04.";return}
  const p=ch.p,P=ch.pts,hasH=!!ch.H;$("natTitle").textContent=p.name||"Bản đồ cá nhân";
  $("natSub").textContent=`${p.date.split("-").reverse().join("/")} · ${p.unknown?"không rõ giờ (dùng 12:00)":p.time} · ${CITIES[p.city]?CITIES[p.city][0]:""} · UTC${p.tz>=0?"+":""}${p.tz}`;
  const w=$("natWarn");if(p.unknown){w.className="banner warn";w.textContent="Không rõ giờ sinh: chưa biết chắc ấn tượng đầu tiên, định hướng sự nghiệp và các mảng cuộc sống. Những phần còn lại vẫn chính xác, và app đã giả lập giờ sinh ở bảng bên dưới."}else if(hasH){const near=Object.values(P).filter(x=>!["ASC","MC"].includes(x.k)&&x.h&&Math.min(...ch.H.cusps.map(c=>{let d=Math.abs(norm(x.lon-c));return Math.min(d,360-d)}))<1.5).map(x=>NM(x.k));const ascD=norm(P.ASC.lon)%30;
    const msg=[];if(ascD<1.5||ascD>28.5)msg.push("Ấn tượng đầu tiên (cung Mọc) nằm sát ranh giới hai cung: chỉ cần lệch vài phút giờ sinh là đổi sang cung khác.");if(near.length)msg.push(near.join(", ")+" nằm sát ranh giới giữa hai mảng cuộc sống; phần này nhạy với giờ sinh.");if(msg.length){w.className="banner";w.textContent=msg.join(" ")}else w.className="banner hidden"}else w.className="banner hidden";
  const dom=Object.entries(ch.el.el).sort((a,b)=>b[1]-a[1])[0];const ruler=hasH?TRAD[P.ASC.s]:null;
  $("natMetrics").innerHTML=[["Con người bên trong",`<span class="g">${SIGNS[P.Sun.s].g}${VS}</span> ${SIGNS[P.Sun.s].n}`,hasH?HOUSES[P.Sun.h-1].n:"Chắc chắn"],["Cảm xúc",`<span class="g">${SIGNS[P.Moon.s].g}${VS}</span> ${SIGNS[P.Moon.s].n}`,hasH?HOUSES[P.Moon.h-1].n:"Theo giờ trưa"],["Ấn tượng đầu tiên",hasH?`<span class="g">${SIGNS[P.ASC.s].g}${VS}</span> ${SIGNS[P.ASC.s].n}`:"—",hasH?"Người khác thấy ở bạn":"Cần giờ sinh"],["Phần cầm lái",ruler?NM(ruler):"—",ruler?"Chất "+SIGNS[P[ruler].s].n:"Cần giờ sinh"],["Tính khí nổi bật","Nhóm "+ELN[dom[0]],dom[1]+" / 10 phần"],["Số chủ đạo",String(ch.num.lp),(NUM[ch.num.lp]||[""])[0]]]
    .map(([l,v,f])=>`<div class="metric"><div class="label">${E(l)}</div><div class="value">${v}</div><div class="foot">${E(f)}</div></div>`).join("");
  drawWheel($("natWheel"),ch,null,ch.asp.filter(a=>a.ang!==0&&!["Node","Chiron","Lilith","MC"].includes(a.a)&&!["Node","Chiron","Lilith","MC"].includes(a.b)).map(a=>({l1:P[a.a].lon,l2:P[a.b].lon,ang:a.ang,orb:a.orb})));
  renderNatSim(ch);
  drawRadar($("natRadar"),ch.radar,"--accent");$("natScores").innerHTML=scoreList(ch.radar,"số người");
  if(!P[state.natSel])state.natSel="Sun";
  $("natList").innerHTML=ORDER.filter(k=>P[k]).map(k=>{const x=P[k];return `<button type="button" class="rankrow ${state.natSel===k?"active":""}" data-nat="${k}"><span class="gl">${E(PL[k].g)}${VS}</span><span><div class="nm">${E(NM(k))}${x.retro&&!["Node"].includes(k)?" ℞":""}</div><div class="ds">${E(SIGNS[x.s].n)} ${degStr(x.lon)}${x.h?" · "+E(HOUSES[x.h-1].n):""}${x.power.dg.lab?" · "+E(x.power.dg.lab):""}</div></span><span><span class="tier ${x.power.tier}">${x.power.tier}</span></span><span class="sc">${fmtN(x.power.v)}</span></button>`}).join("");
  $("natDetail").innerHTML=natDetail(ch,state.natSel);
  const rd=natReading(ch);$("natReading").innerHTML=rd.html;$("natToc").innerHTML=rd.toc.map(([id,t])=>`<a href="#${id}">${E(t)}</a>`).join("");
  const F=[["all","Tất cả"],["soft","Thuận lợi"],["hard","Căng thẳng"],["conj","Hòa quyện"]];$("natAspFilter").innerHTML=F.map(([k,t])=>`<button type="button" class="chip" data-natasp="${k}" aria-pressed="${state.natAsp===k}">${t}</button>`).join("");
  $("natAspTable").innerHTML=ch.asp.filter(a=>state.natAsp==="all"||kind(a.ang)===state.natAsp).map(a=>`<tr><td><b>${E(NM(a.a))} ${E(AG(a.ang))} ${E(nml(a.b))}</b><div class="fine">${E(AN(a.ang))}</div></td><td class="num">${E(STR(a.orb))}</td><td>${E(pairText(a.a,a.b,a.ang))}</td></tr>`).join("")||`<tr><td colspan="3" class="muted">Không có mối liên hệ nào.</td></tr>`}
let SY=null;
function renderSyn(){renderGroup();const A=CH.A,B=CH.B;if(!A||!B){$("synSub").textContent="Cần đủ thông tin ít nhất hai người ở tab 04.";return}
  SY=applySim(synastry(A,B),simPair(A,B));$("synTitle").textContent=A.short+" & "+B.short;$("synSub").textContent=`${A.p.name} (vòng trong) · ${B.p.name} (vòng ngoài)`;
  const w=$("synWarn");const ws=[];if(!A.H)ws.push(A.short+" không rõ giờ sinh nên vòng tròn chưa chia được các mảng cuộc sống.");if(!B.H)ws.push(B.short+" không rõ giờ sinh nên chưa biết ấn tượng đầu tiên và các mảng cuộc sống của "+B.short+".");if(SY.sim&&!SY.sim.empty)ws.push("Điểm được tính bằng giả lập "+SY.sim.n+" tổ hợp giờ sinh của "+SY.sim.who.join(" và ")+": lấy giá trị giữa, khoảng thường gặp "+fmtN(SY.sim.lo)+" – "+fmtN(SY.sim.hi)+". Thu hẹp khoảng giờ ở tab 04 để kết quả chắc chắn hơn.");else if(SY.sim&&SY.sim.empty)ws.push("Không có giờ nào khớp với cung Mọc đã chọn; đang so với các cặp cũng thiếu giờ sinh.");else if(!A.H||!B.H)ws.push("Cặp này được so với các cặp cũng thiếu giờ sinh như vậy.");w.className=ws.length?"banner warn":"banner hidden";w.textContent=ws.join(" ");
  const best=[...SY.radar].sort((a,b)=>b[1]-a[1])[0],worst=[...SY.radar].sort((a,b)=>a[1]-b[1])[0];const topG=[...SY.list].filter(x=>x.kk!=="hard").sort((a,b)=>b.net-a.net)[0],topH=SY.list.find(x=>x.kk==="hard");
  $("synMetrics").innerHTML=[["Điểm hòa hợp",fmtN(SY.total)+" / 10",SY.totalPct!=null?"Cao hơn "+pctTxt(SY.totalPct)+"% các cặp":"Trung bình 6 mảng"],["Bậc",`<span class="tier ${SY.tier}" style="font-size:1rem">${SY.tier}</span>`,SY.sim&&!SY.sim.empty?"Khả năng: "+Object.entries(SY.sim.tiers).filter(([k,v])=>v).map(([k,v])=>k+" "+Math.round(v/SY.sim.n*100)+"%").join(" · "):{S:"Rất hợp · top 5%",A:"Hợp · top 20%",B:"Khá hợp · trên trung bình",C:"Trung bình",D:"Nhiều thử thách"}[SY.tier]],["Mảng mạnh nhất",best[0],fmtN(best[1])+" / 10"],["Mảng cần chú ý",worst[0],fmtN(worst[1])+" / 10"],["Sợi dây mạnh nhất",topG?OWN(topG.a,A.short):"—",topG?AG(topG.ang)+" "+OWNl(topG.b,B.short):""],["Điểm va chạm lớn",topH?OWN(topH.a,A.short):"—",topH?AG(topH.ang)+" "+OWNl(topH.b,B.short):""]]
    .map(([l,v,f])=>`<div class="metric"><div class="label">${E(l)}</div><div class="value">${v}</div><div class="foot">${E(f)}</div></div>`).join("");
  drawWheel($("synWheel"),A,B,SY.list.filter(x=>!["Node","Chiron","MC"].includes(x.a)&&!["Node","Chiron","MC"].includes(x.b)).slice(0,24).map(x=>({l1:A.pts[x.a].lon,l2:B.pts[x.b].lon,ang:x.ang,orb:x.orb})));
  $("synLegend").innerHTML=`<span><span class="dot" style="background:var(--ink)"></span>${E(A.short)} (vòng trong${A.H?", chia mảng theo "+E(A.short):""})</span><span><span class="dot" style="background:var(--b)"></span>${E(B.short)} (vòng ngoài)</span><span><i style="border-color:var(--harm)"></i>Thuận lợi</span><span><i style="border-color:var(--tense)"></i>Căng thẳng</span><span><i style="border-color:var(--neutral);border-top-style:dashed"></i>Hòa quyện</span>`;
  drawRadar($("synRadar"),SY.radar,"--b");$("synScores").innerHTML=scoreList(SY.radar);
  const F=[["all","Tất cả"],["good","Điểm hút nhau"],["hard","Điểm va chạm"]];$("synFilter").innerHTML=F.map(([k,t])=>`<button type="button" class="chip" data-synf="${k}" aria-pressed="${state.synF===k}">${t}</button>`).join("");
  const vis=SY.list.map((x,i)=>({...x,i})).filter(x=>state.synF==="all"||(state.synF==="good"?x.net>0:x.kk==="hard"||x.net<0)).slice(0,40);
  if(!vis.some(x=>x.i===state.synSel))state.synSel=vis[0]?vis[0].i:0;
  $("synList").innerHTML=vis.map(x=>{const t=x.kk==="soft"?"A":x.kk==="hard"?"C":"S";return `<button type="button" class="rankrow ${state.synSel===x.i?"active":""}" data-syn="${x.i}"><span class="gl"><span class="dot" style="width:12px;height:12px;background:var(${x.ang===0?"--neutral":x.kk==="soft"?"--harm":"--tense"})"></span></span><span><div class="nm">${E(OWN(x.a,A.short))} ${E(AG(x.ang))} ${E(OWNl(x.b,B.short))}</div><div class="ds">${E(AN(x.ang))} · mức ${E(STR(x.orb))}</div></span><span><span class="tier ${t}">${x.kk==="soft"?"Thuận":x.kk==="hard"?"Căng":"Hòa"}</span></span><span class="sc">${x.net>=0?"+":"−"}${fmtN(Math.abs(x.net)*10)}</span></button>`}).join("")||`<div class="empty">Không có điểm chạm nào ở bộ lọc này.</div>`;
  synDetail();synReading()}
function synDetail(){const A=CH.A,B=CH.B,x=SY.list[state.synSel];if(!x){$("synDetail").innerHTML=`<p class="muted">Chọn một điểm chạm để xem phân tích.</p>`;return}
  const t=synText(x,A,B);const dl=x.dims.map((v,i)=>[DIM[i],v]).filter(d=>Math.abs(d[1])>.02).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));
  $("synDetail").innerHTML=`<div class="head"><span class="big"><span class="dot" style="width:22px;height:22px;background:var(${x.ang===0?"--neutral":x.kk==="soft"?"--harm":"--tense"})"></span></span><div><div class="kicker">Phân tích điểm chạm</div><h3>${E(OWN(x.a,A.short))} ${E(AG(x.ang))} ${E(OWNl(x.b,B.short))}</h3></div></div>
   <div class="minirow"><span>${E(A.short)}</span><strong>${E(NM(x.a))} · chất ${E(SIGNS[A.pts[x.a].s].n)}</strong></div><div class="minirow"><span>${E(B.short)}</span><strong>${E(NM(x.b))} · chất ${E(SIGNS[B.pts[x.b].s].n)}</strong></div><div class="minirow"><span>Mức độ ảnh hưởng</span><strong>${E(STR(x.orb))}</strong></div>
   <p><b>Ý nghĩa:</b> ${E(t.main)}</p>${t.ex?`<div class="ex"><span class="exl">Ví dụ</span>${E(t.ex)}</div>`:""}
   <p class="muted">${E(NM(x.a))} là ${E(PL[x.a].fn)} của ${E(A.short)}; ${E(NM(x.b))} là ${E(PL[x.b].fn)} của ${E(B.short)}. Góc ${E(AG(x.ang))}: ${E(ASP[x.ang].txt)}.</p>
   <h4>Tác động lên các mảng</h4><ul class="clean">${dl.map(([n,v])=>`<li>${E(n)}: <b>${v>0?"+":"−"}${fmtN(Math.abs(v)*10)}</b></li>`).join("")}</ul>`}
function synReading(){const A=CH.A,B=CH.B,R=SY.radar,out=[],toc=[];const add=(id,t,score,body,wide)=>{toc.push([id,t[0]]);out.push(sec(id,t,score,body).replace('class="card"',wide?'class="card wide"':'class="card"'))};
  const topFor=i=>SY.list.filter(x=>Math.abs(x.dims[i])>.12).sort((a,b)=>Math.abs(b.dims[i])-Math.abs(a.dims[i])).slice(0,4);
  const li=x=>{const t=synText(x,A,B);return `<li><b>${E(OWN(x.a,A.short))} ${E(AG(x.ang))} ${E(OWNl(x.b,B.short))}</b> <span class="muted">(mức ${E(STR(x.orb))})</span>: ${E(t.main)}${t.ex?`<div class="ex" style="margin-top:6px"><span class="exl">Ví dụ</span>${E(t.ex)}</div>`:""}</li>`};
  const intro=["Mảng này xem hai người chạm vào thế giới cảm xúc của nhau thế nào: có thấy an toàn, được thấu hiểu không.","Mảng này xem sức hút giữa hai người: cách yêu, sự chủ động và độ cuốn hút.","Mảng này xem hai người nói chuyện, hiểu ý nhau dễ hay khó.","Mảng này đo độ êm khi có mâu thuẫn: nóng nảy, áp lực, kiểm soát hay thay đổi bất ngờ.","Mảng này xem nền móng cho chuyện lâu dài: trách nhiệm, sự chung thủy, cảm giác gia đình.","Mảng này xem hai người có giúp nhau lớn lên, mở rộng cơ hội và đi đúng hướng không."];
  const ids=["syn-cam-xuc","syn-lang-man","syn-giao-tiep","syn-xung-dot","syn-cam-ket","syn-phat-trien"];
  const USED=new Set(),OVU=new Set();const keepCap=s=>s.startsWith(A.short)||s.startsWith(B.short)?s:lf(s);
  const OVP={7:"mang dáng dấp của một người bạn đời",5:"đem lại cảm giác của một mối tình lãng mạn",4:"gần gũi như người nhà",11:"giống một người bạn, một đồng đội",10:"là người giúp mình tiến xa hơn trong công việc",1:"cuốn hút ngay từ cái nhìn đầu tiên",3:"là người để trò chuyện mỗi ngày",9:"giúp mở rộng tầm nhìn và thế giới của mình",12:"là một mối duyên khó gọi thành tên",8:"tạo nên một sự gắn kết sâu và mãnh liệt",2:"đem lại cảm giác an toàn, vững vàng",6:"là người cùng chăm lo cuộc sống hằng ngày"};
  const ovSentence=list=>{const seen=new Set(),s=[];for(const o of list){if(!["Sun","Moon","Venus","Mars"].includes(o.k))continue;const key=o.owner.short+o.host.short+o.h;if(seen.has(key)||OVU.has(key))continue;seen.add(key);if(s.length<2){OVU.add(key);s.push((s.length?"Còn với ":"Với ")+o.host.short+", "+o.owner.short+" "+OVP[o.h]+".")}}return s.join(" ")};
  R.forEach((r,i)=>{const items=topFor(i);let b=`<p class="muted">${E(intro[i])}</p>`;
    const pos=items.filter(x=>x.dims[i]>0),neg=items.filter(x=>x.dims[i]<0);const P1=["Điều dễ thấy nhất là ","Bên cạnh đó, ","Thêm nữa, "],P2=["Ngược lại, ","Ngoài ra, ","Thêm một điều nữa: "];
    const used=USED;const sent=[],exs=[];let pk=0,nk=0,dv=0;const fixDV=s=>s.replace(/ Dù vậy, /g,()=>(dv++?" Có điều, ":" Dù vậy, "));
    pos.slice(0,3).forEach(x=>{const t=synText(x,A,B);if(used.has(t.main))return;used.add(t.main);sent.push(P1[pk++]+keepCap(fixDV(t.main)));if(t.ex)exs.push(t.ex)});
    neg.slice(0,2).forEach(x=>{const t=synText(x,A,B);if(used.has(t.main))return;used.add(t.main);sent.push((sent.length?P2[nk++]:(nk++,"Chỗ dễ vướng nhất ở mảng này là "))+keepCap(fixDV(t.main)));if(t.ex)exs.push(t.ex)});
    const xs=(SY.extra||[]).filter(e=>{const m=e.d.reduce((a,v,j)=>Math.abs(v)>Math.abs(e.d[a])?j:a,0);return m===i&&Math.abs(e.d[i])>.2}).map(e=>e.t);const ov=ovSentence(SY.over.filter(o=>Math.abs(o.dims[i])>.15));
    const all=sent.concat(xs);if(ov)all.push(ov);
    b+=all.length?`<p>${E(all.join(" "))}</p>`:`<p>Ở mảng này hai người không có điểm chạm nào nổi bật, nên mọi thứ phụ thuộc nhiều vào cách hai người cư xử với nhau.</p>`;
    if(exs.length)b+=`<div class="ex"><span class="exl">Ví dụ</span>${E(exs[0])}</div>`;
    add(ids[i],[r[0],r[0]],r[1],b)});
  // overlays table
  if(SY.over.length){let b=`<div class="tbl"><table><thead><tr><th>Phần của người này</th><th>Chạm vào mảng của người kia</th><th>Ý nghĩa</th></tr></thead><tbody>`+SY.over.map(o=>`<tr><td><b>${E(NM(o.k))}</b> của ${E(o.owner.short)}</td><td>${E(HOUSES[o.h-1].n)} của ${E(o.host.short)}</td><td>${E("Với "+o.host.short+", "+o.owner.short+" "+(({7:"mang dáng dấp của một người bạn đời",5:"đem lại cảm giác của một mối tình lãng mạn",4:"gần gũi như người nhà",11:"giống một người bạn, một đồng đội",10:"là người giúp mình tiến xa hơn trong công việc",1:"cuốn hút ngay từ cái nhìn đầu tiên",3:"là người để trò chuyện mỗi ngày",9:"giúp mở rộng tầm nhìn và thế giới của mình",12:"là một mối duyên khó gọi thành tên",8:"tạo nên một sự gắn kết sâu và mãnh liệt",2:"đem lại cảm giác an toàn, vững vàng",6:"là người cùng chăm lo cuộc sống hằng ngày"})[o.h])+".")}</td></tr>`).join("")+`</tbody></table></div>`;add("syn-nha",["Ai chạm vào mảng nào","Mỗi người tác động đến mảng cuộc sống nào của người kia"],null,b,true)}
  // elements compare
  {const ea=A.el.el,eb=B.el.el;let b=`<div class="cmp"><span></span><span class="hd">${E(A.short)}</span><span class="hd">${E(B.short)}</span>`+Object.keys(ELN).map(k=>{const col={F:"--fire",E:"--earth",A:"--air",W:"--water"}[k];return `<span>${ELN[k]}</span><span class="t"><span style="width:${ea[k]*10}%;background:var(${col})"></span></span><span class="t"><span style="width:${eb[k]*10}%;background:var(${col})"></span></span>`}).join("")+`</div>`;
   const notes=[];for(const k of Object.keys(ELN)){if(ea[k]<=1&&eb[k]>=3)notes.push(B.short+" có nhiều chất "+ELNICE[k]+" ("+ELTXT[k]+"), bù đúng chỗ "+A.short+" còn thiếu.");if(eb[k]<=1&&ea[k]>=3)notes.push(A.short+" có nhiều chất "+ELNICE[k]+" ("+ELTXT[k]+"), bù đúng chỗ "+B.short+" còn thiếu.");if(ea[k]<=1&&eb[k]<=1)notes.push("Cả hai đều ít chất "+ELNICE[k]+", nên "+lf(ELLACK[k].split(":")[1].trim()))}
   if((ea.F>=3&&eb.A>=3)||(eb.F>=3&&ea.A>=3))notes.push("Lửa gặp Khí là cặp nuôi nhau: dễ hào hứng, nhiều ý tưởng khi ở cạnh nhau.");if((ea.E>=3&&eb.W>=3)||(eb.E>=3&&ea.W>=3))notes.push("Đất gặp Nước: một người cho sự vững chãi, người kia cho sự ấm áp.");
   b+=notes.length?`<ul class="clean" style="margin-top:10px">${notes.map(n=>`<li>${E(n)}</li>`).join("")}</ul>`:"";add("syn-nguyen-to",["Nguyên tố","Hai người bổ sung cho nhau thế nào"],null,b)}
  // composite
  {const C=SY.comp;const txt={Sun:s=>"Mối quan hệ lớn lên qua những điều "+SIGNS[s].kw+".",Moon:s=>"Cả hai thấy an toàn khi mối quan hệ "+SIGNS[s].kw+".",Mercury:s=>"Cách hai người trò chuyện với nhau: "+SIGNS[s].kw+".",Venus:s=>"Tình cảm thể hiện theo cách "+SIGNS[s].kw+".",Mars:s=>"Khi cùng hành động, hai người "+SIGNS[s].kw+".",Jupiter:s=>"Hai người gặp may khi cùng nhau "+SIGNS[s].kw+".",Saturn:s=>"Bài học chung của hai người là sống "+SIGNS[s].kw+" hơn.",ASC:s=>"Người ngoài nhìn vào thấy một cặp đôi "+SIGNS[s].kw+"."};
   let b=`<p class="muted">Phần này gộp hai bản đồ làm một, để xem chính mối quan hệ, như một "người thứ ba", có tính cách thế nào.</p><ul class="clean">`+Object.entries(C).map(([k,l])=>`<li><b>${E(({Sun:"Mục tiêu chung",Moon:"Nhu cầu cảm xúc chung",Mercury:"Cách trò chuyện",Venus:"Cách thể hiện tình cảm",Mars:"Cách cùng hành động",Jupiter:"May mắn chung",Saturn:"Bài học chung",ASC:"Hình ảnh cặp đôi"})[k])} (chất ${E(SIGNS[sIdx(l)].n)}):</b> ${E(txt[k](sIdx(l)))}</li>`).join("")+`</ul>`;
   const sm=findAsp(C.Sun,C.Moon,8,8);if(sm&&kind(sm.ang)!=="hard")b+=`<p><b>Mục tiêu chung ${E(AG(sm.ang))} nhu cầu cảm xúc chung:</b> điều hai người muốn và điều hai người cần khá đồng thuận, một dấu hiệu tốt cho sự gắn bó lâu dài.</p>`;else if(sm)b+=`<p><b>Mục tiêu chung ${E(AG(sm.ang))} nhu cầu cảm xúc chung:</b> điều hai người muốn và điều hai người cần có lúc kéo về hai phía.</p>`;
   add("syn-hop-nhat",["Bức tranh chung","Mối quan hệ như một thực thể riêng"],null,b)}
  // advice
  {const advFor=(X,isA)=>{const set=new Set();SY.list.filter(x=>x.kk==="hard"||x.net<0).slice(0,10).forEach(x=>{const k=isA?x.a:x.b;if(ADV[k])set.add(ADV[k])});if(!set.size)set.add("Giữ thói quen trò chuyện đều đặn, kể cả khi mọi thứ đang tốt.");return [...set].slice(0,4)};
   const aA=advFor(A,true);let aB=advFor(B,false).filter(s=>!aA.includes(s));if(!aB.length)aB=["Nói ra điều mình cần thay vì chờ người kia tự hiểu."];
   const b=`<div class="split"><div><h4>Cho ${E(A.short)}</h4><ul class="clean">${aA.map(s=>`<li>${E(s)}</li>`).join("")}</ul></div><div><h4>Cho ${E(B.short)}</h4><ul class="clean">${aB.map(s=>`<li>${E(s)}</li>`).join("")}</ul></div></div><div class="ex"><span class="exl">Hoạt động hợp với hai người</span>${E(activity())}</div>`;add("syn-loi-khuyen",["Lời khuyên","Để điểm mạnh phát huy, điểm va chạm dịu đi"],null,b,true)}
  $("synReading").innerHTML=out.join("");$("synToc").innerHTML=toc.map(([id,t])=>`<a href="#${id}">${E(t)}</a>`).join("")}
function activity(){const s=sIdx(SY.comp.Sun),m=sIdx(SY.comp.Moon);const map={F:"vận động, đi chơi xa, thử thách mới",E:"nấu ăn, làm vườn, cùng lên kế hoạch tài chính",A:"cùng học một kỹ năng, đi triển lãm, nói chuyện đến khuya",W:"xem phim ở nhà, nấu ăn, những buổi tối yên tĩnh"};const a=map[SIGNS[s].el],b=map[SIGNS[m].el];return a===b?a.charAt(0).toUpperCase()+a.slice(1)+".":(a.charAt(0).toUpperCase()+a.slice(1)+"; xen kẽ với "+b+".")}
function renderTransits(){const ch=CHM[state.trView];if(!ch){$("trSub").textContent="Chưa có dữ liệu.";return}
  const T=transits(ch);$("trTitle").textContent="Vận hạn của "+ch.short;$("trSub").textContent="Từ tháng "+(T.start.getUTCMonth()+1)+"/"+T.start.getUTCFullYear()+", 13 tháng tới · Các chu kỳ lớn (may mắn, thử thách, biến động, mơ hồ, biến đổi sâu) chạm vào những phần quan trọng trong bản đồ";
  const months=[];for(let i=0;i<13;i++){const d=new Date(Date.UTC(T.start.getUTCFullYear(),T.start.getUTCMonth()+i,1));months.push(d)}const span=395*86400000;
  const rows=T.list.filter(x=>x.to-x.from>=0).slice(0,40);
  let g=`<div class="grid"><span class="mh"></span>${months.map(m=>`<span class="mh">${m.getUTCMonth()+1}/${String(m.getUTCFullYear()).slice(2)}</span>`).join("")}`;
  rows.forEach(x=>{const col=x.ang===0?"--neutral":kind(x.ang)==="soft"?"--harm":"--tense";const l=(x.from-T.start)/span*100,wd=Math.max(1.2,(x.to-x.from+2*86400000)/span*100);
    g+=`<span class="rl" title="${E(TRN[x.p]+" · "+NATPT[x.k])}">${E(TRN[x.p].replace("Giai đoạn ",""))} → ${E(nml(x.k))}</span><span class="barwrap"><span class="tb" style="left:${l}%;width:${Math.min(wd,100-l)}%;background:var(${col})"></span></span>`});
  g+=`</div>`;$("trGantt").innerHTML=rows.length?g:`<div class="empty">Không có vận hạn lớn trong 13 tháng tới.</div>`;
  const fd=d=>d.getUTCDate()+"/"+(d.getUTCMonth()+1)+"/"+d.getUTCFullYear();
  $("trList").innerHTML=rows.map(x=>{const kk=x.ang===0?"conj":kind(x.ang);const ret=x.p===x.k&&x.ang===0?(x.p==="Saturn"?" Đây là cột mốc trưởng thành của chu kỳ 29 năm: lúc xem lại toàn bộ hướng đi.":x.p==="Jupiter"?" Đây là lúc mở một chu kỳ may mắn 12 năm mới.":""):"";
    return `<div class="titem ${kk==="hard"?"hard":kk==="conj"?"conj":""}"><span><b>${E(TRN[x.p])} ${x.ang===0?"đi qua":kind(x.ang)==="soft"?"nâng đỡ":"thử thách"} ${E(nml(x.k))}</b></span><span class="w">${fd(x.from)} – ${fd(x.to)}</span><span class="m">${E((TR[x.p][kk]||"")+" "+NATPT[x.k])}.${E(ret)} Chính xác nhất khoảng ${fd(x.exact)}.</span></div>`}).join("")}
function renderForms(){const f=(p,idx)=>{const k=p.id,isC=k===state.center;return `<div class="panel" data-card="${k}"><div class="formhead"><h3>Người ${idx+1}${isC?' <span class="pill">người so sánh chính</span>':""}</h3><div class="btns">${isC?"":`<button type="button" class="btn" data-center="${k}">Đặt làm người chính</button>`}${state.people.length>2?`<button type="button" class="btn" data-del="${k}">Xóa</button>`:""}</div></div><div class="fields">
  <div class="field wide"><label for="name-${k}">Họ và tên</label><input id="name-${k}" data-k="${k}" data-f="name" type="text" maxlength="80" value="${E(p.name)}"></div>
  <div class="field"><label for="date-${k}">Ngày sinh</label><input id="date-${k}" data-k="${k}" data-f="date" type="date" min="1900-01-01" max="${TODAY}" value="${E(p.date)}"><div class="fine" id="dw-${k}" style="color:var(--b);margin-top:4px"${dateNote(p.date)?"":" hidden"}>${E(dateNote(p.date))}</div></div>
  <div class="field"><label for="time-${k}">Giờ sinh (24h)</label><input id="time-${k}" data-k="${k}" data-f="time" type="time" value="${E(p.time)}" ${p.unknown?"disabled":""}></div>
  <div class="field wide"><label class="check"><input id="unk-${k}" data-k="${k}" data-f="unknown" type="checkbox" ${p.unknown?"checked":""}> Không rõ giờ sinh</label></div>
  <div class="field ${p.unknown?"":"hidden"}" data-simf="${k}"><label for="win-${k}">Khoảng giờ có thể sinh</label><select id="win-${k}" data-k="${k}" data-f="simWin">${Object.entries(SIMWIN).map(([w,v])=>`<option value="${w}" ${(p.simWin||"all")===w?"selected":""}>${E(v[0])}</option>`).join("")}</select></div>
  <div class="field ${p.unknown?"":"hidden"}" data-simf="${k}"><label for="asc-${k}">Cung Mọc (nếu đã biết)</label><select id="asc-${k}" data-k="${k}" data-f="ascKnown"><option value="">Không biết</option>${SIGNS.map((s,i)=>`<option value="${i}" ${String(p.ascKnown)===String(i)?"selected":""}>${E(s.n)}</option>`).join("")}</select></div>
  <div class="field ${p.unknown&&p.simWin==="custom"?"":"hidden"}" data-simc="${k}"><label for="sf-${k}">Từ giờ</label><input id="sf-${k}" data-k="${k}" data-f="simFrom" type="time" value="${E(p.simFrom||"")}"></div>
  <div class="field ${p.unknown&&p.simWin==="custom"?"":"hidden"}" data-simc="${k}"><label for="st-${k}">Đến giờ</label><input id="st-${k}" data-k="${k}" data-f="simTo" type="time" value="${E(p.simTo||"")}"></div>
  <div class="field"><label for="city-${k}">Nơi sinh</label><select id="city-${k}" data-k="${k}" data-f="city">${Object.entries(CITIES).map(([c,v])=>`<option value="${c}" ${p.city===c?"selected":""}>${E(v[0])}</option>`).join("")}</select></div>
  <div class="field"><label for="tz-${k}">Múi giờ tại nơi sinh</label><select id="tz-${k}" data-k="${k}" data-f="tz">${[7,8,9,10,5.5,0,1,2,-5,-4,-7,-8].map(z=>`<option value="${z}" ${Number(p.tz)===z?"selected":""}>UTC${z>=0?"+":"−"}${Math.abs(z)}</option>`).join("")}</select></div>
  <div class="field ${p.city==="other"?"":"hidden"}"><label for="lat-${k}">Vĩ độ (Bắc +)</label><input id="lat-${k}" data-k="${k}" data-f="lat" type="number" step="0.0001" min="-89" max="89" value="${E(p.lat)}"></div>
  <div class="field ${p.city==="other"?"":"hidden"}"><label for="lon-${k}">Kinh độ (Đông +)</label><input id="lon-${k}" data-k="${k}" data-f="lon" type="number" step="0.0001" min="-180" max="180" value="${E(p.lon)}"></div>
  </div></div>`};$("forms").innerHTML=state.people.map(f).join("");$("btnAdd").disabled=state.people.length>=MAXP;$("addNote").textContent=state.people.length+" / "+MAXP+" người"}
function renderAll(){calc();personSeg();renderNatal();renderSyn();if(document.getElementById("van-han").classList.contains("active"))renderTransits();else TRdirty=true}
let TRdirty=true;
function tab(t){document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===t?"true":"false"));document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===t));if(t==="van-han"&&TRdirty){renderTransits();TRdirty=false}}
function route(){const h=(location.hash||"").slice(1);const pages=["ca-nhan","hop-doi","van-han","nhap","phuong-phap"];if(pages.includes(h))tab(h);else if(h.startsWith("nat-"))tab("ca-nhan");else if(h.startsWith("syn-"))tab("hop-doi")}
function summary(){const A=CH.A,B=CH.B;const lines=[];for(const c of Object.values(CHM)){if(!c)continue;const P=c.pts;const q=byId(c.p.id)||c.p,where=q.city==="other"?`tọa độ ${q.lat}, ${q.lon}`:(CITIES[q.city]?CITIES[q.city][0]:q.city),dd=String(q.date||"").split("-").reverse().join("/"),unk=q.unknown||!String(q.time||"").trim();
    const birth=`sinh ${dd} ${unk?"không rõ giờ"+(q.simWin&&q.simWin!=="all"&&SIMWIN[q.simWin]?" ("+SIMWIN[q.simWin][0]+")":"")+(q.ascKnown!==""&&q.ascKnown!=null?", cung mọc "+SIGNS[+q.ascKnown].n:""):"lúc "+q.time}, ${where}, UTC${Number(q.tz)>=0?"+":""}${q.tz}`;
    lines.push(`${c.p.name} (${birth}): con người bên trong chất ${SIGNS[P.Sun.s].n}, cảm xúc chất ${SIGNS[P.Moon.s].n}${c.H?", ấn tượng đầu tiên chất "+SIGNS[P.ASC.s].n:""}. Con số chủ đạo ${c.num.lp}.`);lines.push("  "+c.radar.map(r=>r[0]+" "+fmtN(r[1])).join(" · "))}
  if(GROUP.length){lines.push("So sánh nhóm với "+CHM[state.center].p.name+":");GROUP.forEach((g,i)=>lines.push("  "+(i+1)+". "+g.ch.p.name+": "+fmtN(g.S.total)+"/10 (bậc "+g.S.tier+")"+(g.S.sim&&!g.S.sim.empty?", giả lập "+fmtN(g.S.sim.lo)+"–"+fmtN(g.S.sim.hi):"")))}
  if(SY){lines.push("Chi tiết cặp "+A.p.name+" – "+B.p.name+":");lines.push(`Hợp đôi: ${fmtN(SY.total)}/10 (bậc ${SY.tier}). `+SY.radar.map(r=>r[0]+" "+fmtN(r[1])).join(" · "));SY.list.slice(0,5).forEach(x=>lines.push("  • "+OWN(x.a,A.short)+" "+AG(x.ang)+" "+OWNl(x.b,B.short)+" ("+STR(x.orb)+")"))}return lines.join("\n")}
function init(){
  if(typeof Astronomy==="undefined"){$("loadErr").classList.remove("hidden");return}
  fixRefs();renderAll();renderForms();
  document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{tab(b.dataset.tab);try{history.replaceState(null,"","#"+b.dataset.tab)}catch(e){}}));
  document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>{tab(b.dataset.go);window.scrollTo({top:0})}));
  window.addEventListener("hashchange",route);route();if(!Object.values(CHM).some(Boolean)&&!/^#(ca-nhan|hop-doi|van-han|phuong-phap)$/.test(location.hash))tab("nhap");
  document.addEventListener("click",e=>{const ab=e.target.closest("[data-asc][data-pid]");if(ab){const p=byId(ab.dataset.pid);if(p){p.ascKnown=ab.dataset.asc==="-1"?"":ab.dataset.asc;save();renderAll();renderForms()}return}
    const t=e.target.closest("[data-nat],[data-syn],[data-natasp],[data-synf],[data-pair],[data-del],[data-center],.seg button[data-person]");if(!t)return;
    if(t.dataset.pair){state.pairA=t.dataset.pair;state.synSel=0;save();calc();renderSyn();const d=document.getElementById("synTitle");if(d&&typeof d.scrollIntoView==="function")d.scrollIntoView({block:"start",behavior:"smooth"});return}
    if(t.dataset.del){if(state.people.length<=2)return;state.people=state.people.filter(p=>p.id!==t.dataset.del);save();renderAll();renderForms();return}
    if(t.dataset.center){state.center=t.dataset.center;if(state.pairA===state.center)state.pairA=null;state.synSel=0;save();renderAll();renderForms();return}
    if(t.dataset.nat){state.natSel=t.dataset.nat;document.querySelectorAll("[data-nat]").forEach(x=>x.classList.toggle("active",x===t));$("natDetail").innerHTML=natDetail(CH[state.view],state.natSel)}
    else if(t.dataset.syn!=null&&t.matches("[data-syn]")){state.synSel=+t.dataset.syn;document.querySelectorAll("[data-syn]").forEach(x=>x.classList.toggle("active",x===t));synDetail()}
    else if(t.dataset.natasp){state.natAsp=t.dataset.natasp;renderNatal()}
    else if(t.dataset.synf){state.synF=t.dataset.synf;renderSyn()}
    else if(t.dataset.person){if(t.closest("#van-han")){state.trView=t.dataset.person;personSeg();renderTransits()}else{state.view=t.dataset.person;state.natSel="Sun";personSeg();renderNatal()}}});
  $("forms").addEventListener("change",e=>{const t=e.target,k=t.dataset.k,f=t.dataset.f;if(!k)return;const p=byId(k);if(!p)return;
    if(f==="unknown"){p.unknown=t.checked;$("time-"+k).disabled=t.checked;document.querySelectorAll(`[data-simf="${k}"]`).forEach(x=>x.classList.toggle("hidden",!t.checked));document.querySelectorAll(`[data-simc="${k}"]`).forEach(x=>x.classList.toggle("hidden",!(t.checked&&p.simWin==="custom")))}
    else if(f==="simWin"){p.simWin=t.value;document.querySelectorAll(`[data-simc="${k}"]`).forEach(x=>x.classList.toggle("hidden",t.value!=="custom"))}else if(f==="tz")p.tz=Number(t.value);else p[f]=t.value;if(f==="date"){const w=document.getElementById("dw-"+k);if(w){const m=dateNote(t.value);w.textContent=m;w.hidden=!m}}
    if(f==="city"){const show=t.value==="other";$("lat-"+k).closest(".field").classList.toggle("hidden",!show);$("lon-"+k).closest(".field").classList.toggle("hidden",!show)}
    save();renderAll()});
  $("btnReset").addEventListener("click",()=>{state.people=JSON.parse(JSON.stringify(BLANK.people));state.center=BLANK.center;state.pairA=BLANK.pairA;state.view="p1";state.trView="p1";try{localStorage.removeItem("astrofit-v1");localStorage.removeItem("astrofit-v2")}catch(e){}renderForms();renderAll()});
  $("aiParse").addEventListener("click",runAi);
  $("aiExample").addEventListener("click",()=>{$("aiText").value=AI_EXAMPLE;$("aiText").focus()});
  $("aiText").addEventListener("keydown",e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();runAi()}});
  document.addEventListener("click",e=>{if(e.target.closest("#aiApply"))applyAi();else if(e.target.closest("#aiCancel")){AI_RES=null;renderAiPreview();$("aiStatus").textContent=""}});
  aiModeLabel();
  $("btnAdd").addEventListener("click",()=>{if(state.people.length>=MAXP)return;let n=1;while(byId("p"+n))n++;const id="p"+n;state.people.push({id,name:"",date:"",time:"",unknown:false,city:"hanoi",lat:"",lon:"",tz:7});save();renderAll();renderForms();const inp=$("name-"+id);if(inp){inp.focus();inp.select()}});
  $("btnCopy").addEventListener("click",async()=>{const txt=summary();try{await navigator.clipboard.writeText(txt);$("btnCopy").textContent="Đã sao chép"}catch(e){const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");$("btnCopy").textContent="Đã sao chép"}catch(e2){$("btnCopy").textContent="Không sao chép được"}ta.remove()}setTimeout(()=>{$("btnCopy").textContent="Sao chép tóm tắt"},1800)});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
window.__AF={simPair,simSamples,natSimSummary,parseLocal,findPlace,applyAi:()=>applyAi(),setAiRes:r=>{AI_RES=r},state,CH:()=>CH,CHM:()=>CHM,GROUP:()=>GROUP,SY:()=>SY,synastry,build};
})();
