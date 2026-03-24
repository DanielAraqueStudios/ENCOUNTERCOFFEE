import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

sec1_pattern = r'(<!--\s*<section class="hero-section-new".*?</section>\s*-->|<section class="hero-section-new" id="section_1">.*?</section>)'
enc_pattern = r'<!-- New Hero Section: AN ENCOUNTER -->\s*<section class="encounter-hero-section".*?</section>'

sec1_match = re.search(sec1_pattern, html, re.DOTALL)
enc_match = re.search(enc_pattern, html, re.DOTALL)

sec1_html = sec1_match.group(0) if sec1_match else ""
enc_html = enc_match.group(0) if enc_match else ""

print("Sections found:", bool(sec1_html), bool(enc_html))

if enc_match:
    new_idx = html[:enc_match.start()] + html[enc_match.end():]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_idx)
    print("Fixed index.html: Removed encounter_hero.")

with open('what-we-do.html', 'r', encoding='utf-8') as f:
    wwd = f.read()

if sec1_html and enc_html:
    # Safest way to replace: take out ALL hero-section-new and insert encounter-hero-section
    parts = re.split(sec1_pattern, wwd, maxsplit=1, flags=re.DOTALL)
    if len(parts) == 3:
        new_wwd = parts[0] + "\n            " + enc_html + "\n" + parts[2]
        new_wwd = re.sub(sec1_pattern, '', new_wwd, flags=re.DOTALL)
        with open('what-we-do.html', 'w', encoding='utf-8') as f:
            f.write(new_wwd)
        print("Fixed what-we-do.html")
