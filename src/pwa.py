# Build the installable PWA into ./pwa from the offline single-file build.
# usage: python3 pwa.py <offline.html> <version label>
import sys, os, json, math, hashlib
from PIL import Image, ImageDraw
src, ver = sys.argv[1], sys.argv[2]
OUT = os.environ.get('OUT', 'pwa'); os.makedirs(OUT + '/icons', exist_ok=True)
html = open(src, encoding='utf-8').read()
stamp = hashlib.md5(html.encode()).hexdigest()[:10]

# ---------- icons ----------
def icon(size, maskable=False):
    S = size * 4  # supersample
    im = Image.new('RGB', (S, S), (17, 18, 42)); d = ImageDraw.Draw(im)
    c = S / 2; r = S * (0.36 if maskable else 0.44)
    gold = (224, 184, 103); lav = (169, 162, 242)
    w = max(2, int(S * 0.018))
    d.ellipse([c - r, c - r, c + r, c + r], outline=gold, width=w)
    ri = r * 0.78
    d.ellipse([c - ri, c - ri, c + ri, c + ri], outline=lav, width=max(1, w // 2))
    for i in range(12):  # zodiac ticks
        a = math.radians(i * 30)
        d.line([c + ri * math.cos(a), c + ri * math.sin(a), c + r * math.cos(a), c + r * math.sin(a)], fill=gold, width=max(1, w // 2))
    # hexagon (radar) inside
    rh = r * 0.5; pts = [(c + rh * math.cos(math.radians(60 * i - 90)), c + rh * math.sin(math.radians(60 * i - 90))) for i in range(6)]
    d.polygon(pts, outline=lav, width=max(1, w // 2))
    # filled radar shape + star
    vals = [0.95, 0.7, 0.85, 0.6, 0.9, 0.75]
    rp = [(c + rh * v * math.cos(math.radians(60 * i - 90)), c + rh * v * math.sin(math.radians(60 * i - 90))) for i, v in enumerate(vals)]
    d.polygon(rp, fill=(110, 100, 200))
    rs = r * 0.16; star = []
    for i in range(10):
        rr = rs if i % 2 == 0 else rs * 0.42; a = math.radians(i * 36 - 90)
        star.append((c + rr * math.cos(a), c + rr * math.sin(a)))
    d.polygon(star, fill=gold)
    return im.resize((size, size), Image.LANCZOS)
for s in (192, 512): icon(s).save(f'{OUT}/icons/icon-{s}.png')
icon(512, True).save(f'{OUT}/icons/maskable-512.png')
icon(180).save(f'{OUT}/icons/apple-touch-icon.png')
icon(32).save(f'{OUT}/icons/favicon-32.png')

# ---------- manifest ----------
json.dump({
  "name": "AstroFit Studio", "short_name": "AstroFit", "lang": "vi",
  "developer": {"name": "Hoàng Trung Đức"}, "description": "Bản đồ sao cá nhân, hợp đôi nhiều người và vận hạn, viết bằng lời dễ hiểu.",
  "id": "./", "start_url": "./", "scope": "./", "display": "standalone", "orientation": "portrait",
  "background_color": "#11122A", "theme_color": "#11122A",
  "icons": [
    {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
    {"src": "icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]
}, open(f'{OUT}/manifest.webmanifest', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ---------- service worker: network-first for the page (edits appear at once when online), cache fallback offline ----------
open(f'{OUT}/sw.js', 'w').write(f'''const C="astrofit-{stamp}";const CORE=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))}});
self.addEventListener("activate",e=>{{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))}});
self.addEventListener("fetch",e=>{{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(r.mode==="navigate"||(u.origin===location.origin&&u.pathname.endsWith(".html"))){{e.respondWith(fetch(r,{{cache:"no-store"}}).then(res=>{{const cp=res.clone();caches.open(C).then(c=>c.put("./index.html",cp));return res}}).catch(()=>caches.match("./index.html")));return}}
  if(u.origin===location.origin||u.host.endsWith("fonts.gstatic.com")||u.host.endsWith("fonts.googleapis.com")){{e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{{if(res.ok||res.type==="opaque"){{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}}return res}})))}}}});
''')

# ---------- page ----------
head = ('<meta name="author" content="Hoàng Trung Đức"><link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#11122A">'
        '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">'
        '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="AstroFit">'
        '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png"><link rel="icon" type="image/png" href="icons/favicon-32.png">')
foot = f'''<div id="pwaBar" style="text-align:center;font-size:12px;opacity:.65;padding:18px 0 4px">AstroFit Studio · {ver}<button id="pwaInstall" hidden style="margin-left:10px;font:inherit;padding:4px 12px;border-radius:999px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer">Cài app</button></div>
<div id="pwaToast" hidden style="position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:#1A1C3A;color:#ECEAF7;border:1px solid #33365C;border-radius:12px;padding:10px 14px;font-size:13px;z-index:99;box-shadow:0 6px 24px rgba(0,0,0,.3)">Đã có bản mới. <button id="pwaReload" style="font:inherit;margin-left:6px;padding:3px 10px;border-radius:8px;border:0;background:#E0B867;color:#11122A;cursor:pointer">Tải lại</button></div>
<script>(function(){{if(!("serviceWorker" in navigator))return;let dp=null;const b=document.getElementById("pwaInstall");
addEventListener("beforeinstallprompt",e=>{{e.preventDefault();dp=e;b.hidden=false}});b.onclick=async()=>{{if(!dp)return;dp.prompt();await dp.userChoice;dp=null;b.hidden=true}};
const had=!!navigator.serviceWorker.controller;navigator.serviceWorker.register("sw.js").then(r=>{{setInterval(()=>r.update().catch(()=>{{}}),3600000)}}).catch(()=>{{}});
navigator.serviceWorker.addEventListener("controllerchange",()=>{{if(had){{const t=document.getElementById("pwaToast");t.hidden=false;document.getElementById("pwaReload").onclick=()=>location.reload()}}}})}})();</script>'''
assert '</head>' in html and '</body>' in html
html = html.replace('</head>', head + '</head>', 1).replace('</body>', foot + '</body>', 1)
open(f'{OUT}/index.html', 'w', encoding='utf-8').write(html)
open(f'{OUT}/.nojekyll', 'w').write('')
open(f'{OUT}/README.md', 'w', encoding='utf-8').write(f'# AstroFit Studio\n\nỨng dụng bản đồ sao dạng PWA. Mở link trên điện thoại rồi chọn "Thêm vào màn hình chính".\n\nPhiên bản: {ver}\n\nNgười tạo: Hoàng Trung Đức\n')
print('pwa built', stamp, os.path.getsize(f'{OUT}/index.html'))
