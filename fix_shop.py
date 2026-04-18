import sys

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# get everything before <body
html_head = text[:text.find('<body')]

# get <body class="...">
body_open = text[text.find('<body'):(text.find('>', text.find('<body')) + 1)] 

main_open = '\n        <main>\n'

# get navbar block
nav_block = text[text.find('<nav '):text.find('</nav>')+6]

# get offcanvas block
offc_end = text.find('</svg>\n            </div>') + len('</svg>\n            </div>')
offcanvas_block_str = text[text.find('<div class="offcanvas '):offc_end]

iframe_block = '''
            <div class="iframe-container" style="width: 100%; height: calc(100vh - 100px); padding: 0; margin: 0; display: block; overflow: hidden;">
                <iframe src="https://www.encountercolombiancoffee.ca/store/" style="width: 100%; height: 100%; border: none; margin: 0; padding: 0;"></iframe>
            </div>
'''
main_close = '\n        </main>\n\n'

# get footer
footer_block = text[text.find('<footer'):]

new_html = html_head + body_open + main_open + nav_block + '\n' + offcanvas_block_str + iframe_block + main_close + footer_block

with open('shop.html', 'w', encoding='utf-8') as out:
    out.write(new_html)

print("shop.html generated successfully!")
