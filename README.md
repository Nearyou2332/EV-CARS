# EV Voltedge

An automotive website that brings together electric vehicle design, everyday charging scenarios, and an interactive charging-time calculator.

Built with semantic HTML, responsive CSS, and vanilla JavaScript. No build step or external runtime dependencies.

## Features

- Responsive layouts with mobile navigation.
- Three charging scenarios with accessible detail dialogs.
- AC charging-time estimates with adjustable battery capacity, starting charge, target charge, and power.
- Validation that prevents misleading calculations from invalid inputs.
- Downloadable text estimates generated in the browser.
- An interior gallery with buttons, view selectors, and keyboard navigation.
- FAQ disclosures, reduced-motion support, visible focus indicators, and a skip link.
- Locally hosted Syne font and optimized WebP imagery.

## Run

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173`. The page can also be opened directly from `index.html` for a basic preview.

## Source

- `index.html` — page structure and content.
- `css/main.css` — design system, components, and breakpoints.
- `js/main.js` — navigation, dialogs, calculator, file download, and gallery.
- `img/optimized/` — imagery used by the page.
- `fonts/` — Syne variable font and its SIL Open Font License.
- `scripts/check_site.py` — static resource and markup checks.
- `docs/VERIFICATION.md` — browser checks and known integration boundaries.

Original assets and component styles are retained as source material. The page loads only the current stylesheet, script, local font, logo assets, and selected optimized images. Swiper and external font services are no longer required.

## Calculator model

Energy added to the battery = capacity × (target percentage − starting percentage) / 100.

Estimated time in hours = energy / (AC power × 0.9).

The model assumes constant power and 90% charging efficiency. Inputs are planning examples, not specifications for a particular vehicle. Actual charging time depends on the vehicle, equipment, supply, temperature, and charging behavior.

## Data and integrations

All calculations and downloads run locally. No calculator inputs are transmitted or persisted. There is no payment, inventory, live charger map, vehicle reservation, or booking backend. The page does not claim customer counts, verified vehicle range, or product availability.

Photography is retained from the existing project. Syne is distributed under the license included in `fonts/OFL-Syne.txt`.

## Check

```sh
python3 scripts/check_site.py
node --check js/main.js
```

## Preview

[Desktop](docs/desktop.jpg) · [Mobile](docs/mobile.jpg) · [Charging calculator](docs/calculator.jpg) · [Full page](docs/full-page.jpg)
