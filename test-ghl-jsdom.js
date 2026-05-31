const fs = require('fs');
const { JSDOM } = require('jsdom');

(async () => {
  const html = fs.readFileSync('ghl-roadmap.html', 'utf8');
  // Use an http origin so `localStorage` is available in jsdom
  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'http://localhost/' });
  const { window } = dom;

  await new Promise(resolve => {
    if (window.document.readyState === 'complete') return resolve();
    window.addEventListener('DOMContentLoaded', () => setTimeout(resolve, 50));
  });

  const document = window.document;
  const checkboxes = Array.from(document.querySelectorAll('.checkbox'));
  console.log('found checkboxes:', checkboxes.length);
  if (checkboxes.length < 2) {
    console.error('Not enough checkboxes for test');
    process.exit(2);
  }

  // click first two
  checkboxes[0].click();
  checkboxes[1].click();

  // allow any synchronous handlers to run
  await new Promise(r => setTimeout(r, 50));

  const raw = window.localStorage.getItem('ghlRoadmapProgress');
  console.log('localStorage raw after clicks:', raw ? raw.slice(0,200) + (raw.length>200? '...':'') : raw);
  if (!raw) { console.error('No data saved to localStorage'); process.exit(3); }

  const parsed = JSON.parse(raw);
  const keys = Object.keys(parsed);
  if (keys.length === 0) { console.error('Saved object empty'); process.exit(4); }
  if (!parsed[keys[0]] || !parsed[keys[1]]) { console.error('Saved values for first two keys are not true'); process.exit(5); }

  // simulate a reload: clear UI state then call loadProgress()
  checkboxes.forEach(cb => { cb.classList.remove('checked'); cb.textContent = ''; });
  if (typeof window.loadProgress !== 'function') { console.error('loadProgress() not found'); process.exit(6); }
  window.loadProgress();
  await new Promise(r => setTimeout(r, 50));

  const rechecked = Array.from(document.querySelectorAll('.checkbox')).slice(0,2).map(cb=>cb.classList.contains('checked'));
  console.log('checked states after loadProgress():', rechecked);
  if (!rechecked[0] || !rechecked[1]) { console.error('State did not restore correctly on loadProgress()'); process.exit(7); }

  // test resetProgress()
  if (typeof window.resetProgress !== 'function') { console.error('resetProgress() not found'); process.exit(8); }
  window.resetProgress();
  await new Promise(r => setTimeout(r, 50));
  const afterReset = window.localStorage.getItem('ghlRoadmapProgress');
  console.log('localStorage after reset:', afterReset);
  if (afterReset !== null) { console.error('Reset did not clear localStorage'); process.exit(9); }

  console.log('JS-DOM SANITY CHECK: OK');
  process.exit(0);
})();