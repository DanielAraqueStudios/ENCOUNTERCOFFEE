
import re
html = open('index.html', encoding='utf-8').read()
enc_match = re.search(r'<section class=.encounter-hero-section..*?</section>', html, re.DOTALL)
if enc_match: print('FOUND:', len(enc_match.group(0)))
else: print('NOT FOUND')

