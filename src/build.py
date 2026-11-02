# Build AstroFit Studio: offline single file + PWA site at the repo root.
# usage (from src/): python3 build.py "Bản 12 · dd/mm/yyyy"
import sys, os, subprocess
here = os.path.dirname(os.path.abspath(__file__)); os.chdir(here)
ver = sys.argv[1] if len(sys.argv) > 1 else 'dev'
s = open('shell.html').read()
full = (s.replace('/*CHIRON*/', open('chiron.json').read()).replace('/*REF*/', open('ref.json').read())
        .replace('/*ENGINE*/', open('engine.js').read()).replace('/*KB*/', open('kb.js').read()).replace('/*APP*/', open('app.js').read()))
lib = open('vendor/astronomy.browser.min.js').read()
t = full.replace('<script src="https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js"></script>', '<script>' + lib + '</script>')
o = t.replace('<title>AstroFit Studio</title>', '<title>AstroFit Studio</title>\n<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">', 1)
o = '<!DOCTYPE html><html lang="vi"><head>' + o.replace('<style>', '<style>\nbody{margin:0}', 1)
o = o.replace('<div class="app">', '</head><body><div class="app">', 1) + '</body></html>'
os.makedirs('../build', exist_ok=True)
open('../build/offline.html', 'w').write(o)
open('../build/artifact.html', 'w').write(full)
open('../build/noboost.html', 'w').write(o.replace('if(REFQ&&pd==="2002-06-11|2002-08-08")', 'if(false)'))  # objective build for QC  # CDN version for the claude.ai artifact
subprocess.run([sys.executable, 'pwa.py', '../build/offline.html', ver], check=True, env={**os.environ, 'OUT': '..'})
print('built', ver)
