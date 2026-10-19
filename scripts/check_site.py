"""Check the static page without installing dependencies. Run from any directory."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.elements = []
        self.text = []

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def handle_data(self, data):
        self.text.append(data)

page = Page()
page.feed((ROOT / 'index.html').read_text())
errors = []
ids = Counter(attrs['id'] for _, attrs in page.elements if 'id' in attrs)
errors.extend(f'Duplicate ID: {key}' for key, count in ids.items() if count > 1)
assert next(attrs for tag, attrs in page.elements if tag == 'html')['lang'] == 'en'
assert sum(tag == 'h1' for tag, _ in page.elements) == 1
assert not re.search(r'[А-Яа-яЁё]', ''.join(page.text)), 'Unexpected page text'

for tag, attrs in page.elements:
    for key in ('src', 'href'):
        if key not in attrs:
            continue
        value = attrs[key]
        parsed = urlsplit(value)
        if parsed.scheme or parsed.netloc:
            continue
        if value in ('#', '#!', ''):
            errors.append(f'Placeholder {key}: {tag}')
        elif parsed.path and not (ROOT / unquote(parsed.path)).is_file():
            errors.append(f'Missing asset: {parsed.path}')
        elif parsed.fragment and parsed.fragment not in ids:
            errors.append(f'Unknown fragment: {parsed.fragment}')
    for key in ('aria-controls', 'aria-labelledby', 'aria-describedby'):
        for target in attrs.get(key, '').split():
            if target not in ids:
                errors.append(f'Unknown {key} target: {target}')
    if tag == 'img' and 'alt' not in attrs:
        errors.append('Image without alt text')
    if tag == 'label' and attrs.get('for') not in ids:
        errors.append(f'Label without control: {attrs}')
    if tag == 'a' and attrs.get('target') == '_blank' and 'noopener' not in attrs.get('rel', ''):
        errors.append('External tab link missing noopener')

css = ROOT / 'css/main.css'
for value in re.findall(r'url\([\'\"]?([^\)\'\"]+)', css.read_text()):
    if not (css.parent / value).is_file():
        errors.append(f'Missing CSS resource: {value}')

if errors:
    raise SystemExit('\n'.join(errors))
print('PASS: local HTML/CSS resources, fragment links, unique IDs, ARIA references, labels, page content, and external-link attributes')
