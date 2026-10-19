'use strict';

// All calculations and file generation stay in the browser.
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu(focus = false) {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
  if (focus) toggle.focus();
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const charging = {
  home: { title: 'Charging at home.', label: '01 / YOUR EVERYDAY ROUTINE', description: 'A dedicated charging setup can make plugging in part of your day. Start by understanding your parking, vehicle, and available electrical supply.', points: ['Check vehicle connector compatibility and AC charging limits.', 'Ask a qualified installer to assess the property and supply.', 'Consider where the cable will sit and how you access the charger.'], power: '7.2' },
  portable: { title: 'A flexible option.', label: '02 / WHEN YOU ARE ON THE MOVE', description: 'Portable equipment is an option to research for compatible locations. It is not a promise that every outlet or property can support EV charging.', points: ['Use equipment approved for your vehicle and power source.', 'Follow manufacturer guidance and have the supply suitability checked.', 'Lower available power generally means more time connected.'], power: '3.6' },
  destination: { title: 'Make a stop count.', label: '03 / CHARGE WHILE YOU STAY', description: 'Workplaces, hotels, and other destinations may offer charging. Plan around the equipment and access available at the location you intend to visit.', points: ['Check connector, access hours, availability, and operator terms.', 'Your vehicle can limit the power it accepts, regardless of the charger rating.', 'This website does not show live charger locations or availability.'], power: '11' }
};
const dialog = document.querySelector('#details-dialog');
let suggestedPower = '7.2';
function openDialog({ title, label, description, points }, showEstimate = true) {
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-eyebrow').textContent = label;
  document.querySelector('#dialog-copy').textContent = description;
  const list = document.querySelector('#dialog-list');
  list.replaceChildren();
  points.forEach(point => { const item = document.createElement('li'); item.textContent = point; list.append(item); });
  document.querySelector('#dialog-estimate').hidden = !showEstimate;
  document.body.classList.add('has-dialog');
  dialog.showModal();
}
document.querySelectorAll('[data-charging]').forEach(button => button.addEventListener('click', () => {
  const option = charging[button.dataset.charging];
  suggestedPower = option.power;
  openDialog(option);
}));
document.querySelector('.dialog__close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('has-dialog'));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
document.querySelector('#dialog-estimate').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#power').value = suggestedPower;
  dialog.close();
  updateEstimate();
  document.querySelector('#estimator').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  document.querySelector('#battery').focus({ preventScroll: true });
});
document.querySelector('#privacy-button').addEventListener('click', () => openDialog({
  title: 'Your data stays yours.', label: 'PRIVACY & DATA', description: 'The charging calculator runs locally in your browser. This website does not collect your calculator inputs, create an account, or submit a booking.', points: ['No analytics, advertising trackers, or third-party scripts are loaded by this page.', 'Saving an estimate creates a text file on your device.', 'The website host may process standard access logs under its own privacy terms.']
}, false));

const form = document.querySelector('#estimate-form');
const battery = document.querySelector('#battery');
const current = document.querySelector('#current');
const target = document.querySelector('#target');
const power = document.querySelector('#power');
const error = document.querySelector('#estimate-error');
const downloadButton = document.querySelector('#download-estimate');
let estimateText = '';
function updateEstimate(focusError = false) {
  const capacity = Number(battery.value);
  const from = Number(current.value);
  const to = Number(target.value);
  const kilowatts = Number(power.value);
  document.querySelector('#current-output').textContent = `${from}%`;
  document.querySelector('#target-output').textContent = `${to}%`;
  battery.removeAttribute('aria-invalid');
  target.removeAttribute('aria-invalid');
  let message = '';
  let invalidField = battery;
  if (!battery.value || !Number.isFinite(capacity) || capacity < 10 || capacity > 250 || !battery.validity.valid) {
    message = 'Enter a whole-number battery capacity between 10 and 250 kWh.';
  } else if (to <= from) {
    message = 'Set the target charge higher than the starting charge.';
    invalidField = target;
  }
  error.hidden = !message;
  error.textContent = message;
  downloadButton.disabled = Boolean(message);
  if (message) {
    invalidField.setAttribute('aria-invalid', 'true');
    document.querySelector('#hours').textContent = '—';
    document.querySelector('#minutes').textContent = '—';
    document.querySelector('#energy').textContent = 'Adjust your inputs';
    document.querySelector('#charge-window').textContent = `${from}% → ${to}%`;
    document.querySelector('#battery-fill').style.width = '0%';
    estimateText = '';
    if (focusError) invalidField.focus();
    return;
  }
  const energy = capacity * (to - from) / 100;
  const totalMinutes = Math.ceil(energy / (kilowatts * 0.9) * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  document.querySelector('#hours').textContent = String(hours);
  document.querySelector('#minutes').textContent = String(minutes).padStart(2, '0');
  document.querySelector('#energy').textContent = `${energy.toFixed(1)} kWh`;
  document.querySelector('#charge-window').textContent = `${from}% → ${to}%`;
  document.querySelector('#battery-fill').style.width = `${to - from}%`;
  document.querySelector('#download-status').textContent = '';
  estimateText = `EV VOLTEDGE — CHARGING ESTIMATE\n\nBattery capacity: ${capacity} kWh\nCharging window: ${from}% to ${to}%\nAC charging power: ${kilowatts} kW\nEnergy added to battery: ${energy.toFixed(1)} kWh\nApproximate time: ${hours}h ${minutes}m\n\nAssumptions: 90% charging efficiency and constant power.\nFormula: battery capacity × (target − start) / 100 / (power × 0.9).\nActual time depends on the vehicle, charging equipment, available supply, temperature, and charging behavior. These inputs are planning examples, not vehicle specifications.\n\nGenerated locally. No booking or request has been submitted.\n`;
}
form.addEventListener('submit', event => { event.preventDefault(); updateEstimate(true); });
form.querySelectorAll('input, select').forEach(input => input.addEventListener('input', () => updateEstimate()));
downloadButton.addEventListener('click', () => {
  if (!estimateText) return;
  const url = URL.createObjectURL(new Blob([estimateText], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ev-voltedge-charging-estimate.txt';
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#download-status').textContent = 'Your estimate download has started.';
});
updateEstimate();

const slides = [
  { image: 'img/optimized/interior-01.webp', alt: 'Open driver door showing light seats and a clean center console', caption: 'A calmer place to begin.' },
  { image: 'img/optimized/interior-02.webp', alt: 'View across a light dashboard and steering wheel through the windshield', caption: 'A fresh perspective ahead.' },
  { image: 'img/optimized/interior-03.webp', alt: 'Light-colored rear passenger seating in a spacious cabin', caption: 'Room for the everyday.' }
];
let slide = 0;
function showSlide(index) {
  slide = (index + slides.length) % slides.length;
  const item = slides[slide];
  const image = document.querySelector('#gallery-image'); image.src = item.image; image.alt = item.alt;
  document.querySelector('#gallery-caption').textContent = item.caption;
  document.querySelector('#gallery-count').textContent = `0${slide + 1} / 03`;
  document.querySelectorAll('[data-slide]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.slide) === slide)));
  document.querySelector('#gallery-status').textContent = `View ${slide + 1} of 3. ${item.caption}`;
}
document.querySelector('#previous-slide').addEventListener('click', () => showSlide(slide - 1));
document.querySelector('#next-slide').addEventListener('click', () => showSlide(slide + 1));
document.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.slide))));
document.querySelector('.gallery__figure').addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); showSlide(slide + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
