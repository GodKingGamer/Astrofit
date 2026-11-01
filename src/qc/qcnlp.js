const {JSDOM}=require('jsdom');const fs=require('fs');
const dom=new JSDOM(fs.readFileSync(process.argv[2],'utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/'});
const w=dom.window;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
setTimeout(()=>{const P=w.__AF.parseLocal;
const T=[
["So sánh Lan (12/3/1999 7h30 sáng, Hà Nội), Minh (2/11/1998 9h tối, Đà Nẵng) và Hùng (5/5/2000, không rõ giờ, Huế) với Thảo (11/6/2002 5h30, Hà Nội)",
 [["Lan","1999-03-12","07:30",false,"hanoi"],["Minh","1998-11-02","21:00",false,"danang"],["Hùng","2000-05-05",null,true,"hue"],["Thảo","2002-06-11","05:30",false,"hanoi"]],3],
["so sánh 3 người A (8/8/2002 8h Hà Nội), B (19/1/2004 4h Đồng Hới), C (30/9/2002 17h20 Hà Nội) với người D (11/6/2002 5h30 Hà Nội)",
 [["A","2002-08-08","08:00",false,"hanoi"],["B","2004-01-19","04:00",false,"dongHoi"],["C","2002-09-30","17:20",false,"hanoi"],["D","2002-06-11","05:30",false,"hanoi"]],3],
["Hoàng Trung Đức sinh 08/08/2002 lúc 8 giờ sáng tại Hà Nội; Nguyễn Phương Thảo sinh ngày 11 tháng 6 năm 2002 lúc 5h30 ở Hà Nội",
 [["Hoàng Trung Đức","2002-08-08","08:00",false,"hanoi"],["Nguyễn Phương Thảo","2002-06-11","05:30",false,"hanoi"]],null],
["Lan 12/3/1999 7h Hà Nội, Minh 2/11/1998 21h15 Sài Gòn",[["Lan","1999-03-12","07:00",false,"hanoi"],["Minh","1998-11-02","21:15",false,"hcm"]],null],
["Lan 12/3/1999, Hà Nội 7h, Minh 2/11/1998, 21h, Vũng Tàu",[["Lan","1999-03-12","07:00",false,"hanoi"],["Minh","1998-11-02","21:00",false,"vungtau"]],null],
["so sánh Vinh (1/1/2000 6h Nghệ An) với Hà (2/2/2001 11h đêm, Quảng Ninh)",[["Vinh","2000-01-01","06:00",false,"vinh"],["Hà","2001-02-02","23:00",false,"halong"]],1],
["Bố (15/4/1965 2h chiều, Sài Gòn) và mẹ (3/9/1968, TP HCM)",[["Bố","1965-04-15","14:00",false,"hcm"],["mẹ","1968-09-03",null,true,"hcm"]],null],
["So sánh Tuấn (31/2/2000 8h Hà Nội) với Mai (1/1/2001 25h Huế)",[["Tuấn",null,"08:00",false,"hanoi"],["Mai","2001-01-01",null,true,"hue"]],1],
["Kim (2000-07-21 12h trưa, Seoul) với Ji (21/07/2000 1h trưa, Tokyo)",[["Kim","2000-07-21","12:00",false,"seoul"],["Ji","2000-07-21","13:00",false,"tokyo"]],1],
["Anh Nam (5/6/97 10h Cần Thơ)",[["Nam","1997-06-05","10:00",false,"cantho"]],null],
];
let pass=0,fail=0;for(const [txt,exp,ec] of T){const r=P(txt);let ok=r.people.length===exp.length;
 exp.forEach((e,i)=>{const p=r.people[i];if(!p){ok=false;return}const [n,d,t,u,c]=e;if(p.name!==n||p.date!==d||(t!==null&&p.time!==t)||p.unknown!==u||p.city!==c){ok=false;console.log('   got',JSON.stringify({n:p.name,d:p.date,t:p.time,u:p.unknown,c:p.city}),'exp',JSON.stringify(e))}});
 if(r.center!==ec){ok=false;console.log('   center',r.center,'exp',ec)}
 console.log(ok?'PASS':'FAIL',txt.slice(0,70));ok?pass++:fail++;
 if(txt.includes('Sài Gòn, 1965')||txt.startsWith('Bố'))console.log('   warns',JSON.stringify(r.people.map(p=>p.warn)));}
console.log('parser',pass,'/',T.length);
// UI flow
const d=w.document;d.getElementById('aiText').value=T[1][0];d.getElementById('aiParse').click();
setTimeout(()=>{console.log('preview rows',d.querySelectorAll('.aitbl tbody tr').length,'apply enabled',!d.getElementById('aiApply').disabled);
 d.getElementById('aiApply').click();const st=w.__AF.state;console.log('applied people',st.people.map(p=>p.name+'/'+p.date+'/'+p.time+'/'+p.city).join(' | '),'center',st.center);
 console.log('active tab hop-doi',d.getElementById('hop-doi').classList.contains('active'),'group rows',d.querySelectorAll('table.grp tbody tr').length,[...d.querySelectorAll('table.grp tbody tr')].map(r=>r.children[1].querySelector('b').textContent+'='+r.children[2].textContent).join(' | '));
 d.getElementById('aiText').value='so sánh với';d.getElementById('aiParse').click();setTimeout(()=>{console.log('bad input msg:',d.getElementById('aiPreview').textContent.slice(0,100));console.log('ERRS',JSON.stringify(errs))},300);
},300);
},2000);
