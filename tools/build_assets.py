#!/usr/bin/env python3
"""Builds app/src/main/assets/index.html from the book app, offline: no outside font links."""
import json, re, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
page = (root / 'tools/paper-kite-books.html').read_text(encoding='utf8')
shim = (root / 'tools/native-shim.js').read_text(encoding='utf8')
seed = json.loads((root / 'tools/sample-book.json').read_text(encoding='utf8'))
seed['id'] = 'sample-tiko-kite'
page = re.sub(r'<link rel="(preconnect|stylesheet)"[^>]*>\n?', '', page)
page = page.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
head = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'
out = head + '<script>' + shim + '\nwindow.SEED_BOOK=' + json.dumps(seed).replace('</', '<\\/') + ';</script>' + page + '</body></html>'
(root / 'app/src/main/assets').mkdir(parents=True, exist_ok=True)
(root / 'app/src/main/assets/index.html').write_text(out, encoding='utf8')
print('index.html', len(out))
