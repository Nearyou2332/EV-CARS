# Verification

Locally verified on October 19, 2026.

## Browser checks

Checked at viewport widths of 320, 390, 768, 1024, and 1440 CSS pixels. No horizontal document overflow or broken loaded images was observed. Representative mobile and desktop layouts were visually inspected.

Verified interactions:

- Navigation reaches the intended sections.
- Mobile menu expands and closes after selecting a destination.
- Charging details open in native dialogs; Escape closes the dialog and restores focus.
- Charging scenarios preselect a corresponding example AC power in the calculator.
- The default 75 kWh / 20–80% / 7.2 kW example shows 45.0 kWh and 6 h 57 m.
- A 100 kWh / 20–80% / 11 kW example shows 60.0 kWh and 6 h 04 m.
- A 75 kWh / 0–100% / 7.2 kW example shows 75.0 kWh and 11 h 35 m.
- Empty battery capacity and target charge below starting charge display errors and disable downloading.
- The longest supported example, 250 kWh / 0–100% / 3.6 kW, fits the 320 px layout and shows 77 h 10 m.
- Saving an estimate generates a readable text file.
- Gallery next/previous buttons and left/right arrow keys change views and captions.
- FAQ disclosures toggle by click and Enter.
- Privacy details open from the footer.

## Static checks

- `python3 scripts/check_site.py` passes.
- `node --check js/main.js` passes.
- Local resource paths, fragment destinations, labels, and ARIA references are checked.
- No JavaScript console warnings or errors were observed in the preview.
- Nine selected source images totalled 1,490,382 bytes; their WebP versions total 389,054 bytes, approximately 74% smaller. This is an asset-size comparison, not a measured speed score.

## Boundaries

The calculator is an AC planning model, with 90% efficiency and constant power. It is not a vehicle-specific charging curve or a charging guarantee. There is no live inventory, reservation, payment, backend submission, or live charger availability integration.

Testing used the connected Chromium-based browser. Physical devices, separate Safari/Firefox installations, and a screen reader were not tested. No Lighthouse score or full accessibility certification is claimed. Original imagery was retained from the repository; its provenance was not independently verified.
