import os

files = ['index-es.html', 'shop-es.html', 'what-we-do-es.html']

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update internal links
    content = content.replace('href="index.html"', 'href="index-es.html"')
    content = content.replace('href="shop.html"', 'href="shop-es.html"')
    content = content.replace('href="what-we-do.html"', 'href="what-we-do-es.html"')

    # Update iframe links and store links
    content = content.replace('https://www.encountercolombiancoffee.ca/store/', 'https://www.encountercolombiancoffee.com/tienda/')
    
    # Translate navbar English text to Spanish
    content = content.replace('Home</a', 'Inicio</a')
    content = content.replace('What we do?', '¿Qué hacemos?')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
