// ===== Astro engine (shared by test + page) =====
const ENG=(function(){
const D2R=Math.PI/180,R2D=180/Math.PI,norm=x=>((x%360)+360)%360,sin=x=>Math.sin(x*D2R),cos=x=>Math.cos(x*D2R),tan=x=>Math.tan(x*D2R);
const atan2=(y,x)=>norm(Math.atan2(y,x)*R2D),asin=x=>Math.asin(Math.max(-1,Math.min(1,x)))*R2D;
function jdOf(date){return date.getTime()/86400000+2440587.5}
function nodeLilith(jd){const T=(jd-2451545)/36525;
  const D=norm(297.8501921+445267.1114034*T),M=norm(357.5291092+35999.0502909*T),Mp=norm(134.9633964+477198.8675055*T),F=norm(93.2720950+483202.0175233*T);
  const mean=norm(125.0445479-1934.1362891*T+0.0020754*T*T);
  const tr=norm(mean-1.4979*sin(2*(D-F))-0.15*sin(M)-0.1226*sin(2*D)+0.1176*sin(2*F)-0.0801*sin(2*(Mp-F)));
  const per=83.3532465+4069.0137287*T-0.0103200*T*T;return {node:tr,lilith:norm(per+180)}}
function chiron(jd,CH){if(!CH)return null;const i=(jd-CH.jd0)/CH.step,k=Math.floor(i);if(k<0||k+1>=CH.v.length)return null;
  const a=CH.v[k]/100,b=CH.v[k+1]/100;let d=b-a;if(d>180)d-=360;if(d<-180)d+=360;return norm(a+d*(i-k))}
function obliq(jd){const T=(jd-2451545)/36525;return 23.439291111-0.0130042*T-1.64e-7*T*T+5.04e-7*T*T*T}
function houses(ramc,lat,eps){
  const mc=atan2(sin(ramc),cos(ramc)*cos(eps));
  let asc=atan2(cos(ramc),-(sin(ramc)*cos(eps)+tan(lat)*sin(eps)));
  const ic=norm(mc+180);
  const ok=Math.abs(lat)<66;
  if(!ok){const c=[];const s=Math.floor(asc/30)*30;for(let i=0;i<12;i++)c.push(norm(s+30*i));return {cusps:c,asc,mc,system:"Whole Sign"}}
  const cusp=(f,above)=>{let ra=above?norm(ramc+f*90):norm(ramc+180-f*90),lam=atan2(sin(ra),cos(ra)*cos(eps));
    for(let it=0;it<60;it++){const dec=asin(sin(eps)*sin(lam));let x=tan(lat)*tan(dec);x=Math.max(-1,Math.min(1,x));const ad=asin(x);
      if(above){const dsa=90+ad;ra=norm(ramc+f*dsa)}else{const nsa=90-ad;ra=norm(ramc+180-f*nsa)}
      const nl=atan2(sin(ra),cos(ra)*cos(eps));if(Math.abs(nl-lam)<1e-7){lam=nl;break}lam=nl}return lam};
  const c11=cusp(1/3,true),c12=cusp(2/3,true),c2=cusp(2/3,false),c3=cusp(1/3,false);
  return {cusps:[asc,c2,c3,ic,norm(c11+180),norm(c12+180),norm(asc+180),norm(c2+180),norm(c3+180),mc,c11,c12],asc,mc,system:"Placidus"}}
function chart(A,{y,m,d,hh,mm,tz,lat,lon},CH){
  const date=new Date(Date.UTC(y,m-1,d,hh,mm)-tz*3600000),t=A.MakeTime(date),jd=jdOf(date);
  const L=(b,tt)=>b==='Sun'?A.SunPosition(tt).elon:b==='Moon'?A.EclipticGeoMoon(tt).lon:A.Ecliptic(A.GeoVector(A.Body[b],tt,true)).elon;
  const t2=A.MakeTime(new Date(date.getTime()+86400000));
  const P={};for(const b of ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto']){const a=L(b,t),c=L(b,t2);let dd=c-a;if(dd>180)dd-=360;if(dd<-180)dd+=360;P[b]={lon:norm(a),retro:dd<0,speed:dd}}
  const nl=nodeLilith(jd);P.Node={lon:nl.node,retro:true};P.Lilith={lon:nl.lilith,retro:false};
  const ch=chiron(jd,CH);if(ch!=null){const ch2=chiron(jd+1,CH);let dd=ch2-ch;if(dd>180)dd-=360;if(dd<-180)dd+=360;P.Chiron={lon:ch,retro:dd<0}}
  let H=null;if(lat!=null&&lon!=null){const gast=A.SiderealTime(t);const ramc=norm(gast*15+lon);H=houses(ramc,lat,obliq(jd))}
  return {P,H,jd,date}}
return {chart,norm,houses,nodeLilith,chiron,jdOf};
})();
if(typeof module!=='undefined')module.exports=ENG;
