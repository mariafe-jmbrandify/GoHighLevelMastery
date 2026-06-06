const puppeteer = require('puppeteer');
const path = 'file://' + process.cwd() + '/ghl-roadmap.html';

(async () => {
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  try {
    await page.goto(path, {waitUntil: 'networkidle2'});
    await page.waitForSelector('.checkbox');

    const boxes = await page.$$('.checkbox');
    console.log('found checkboxes:', boxes.length);
    if (boxes.length < 2) {
      console.error('Not enough checkboxes to test.');
      await browser.close();
      process.exit(2);
    }

    // Click first two checkboxes
    await boxes[0].click();
    await boxes[1].click();

    // allow time for save
    await page.waitForTimeout(600);

    const stored = await page.evaluate(() => localStorage.getItem('ghlRoadmapProgress'));
    console.log('localStorage raw:', stored);
    if (!stored) {
      console.error('No progress saved in localStorage.');
      await browser.close();
      process.exit(3);
    }

    const parsed = JSON.parse(stored);
    const keys = Object.keys(parsed);
    console.log('saved keys count:', keys.length);
    if (keys.length === 0) {
      console.error('Saved object is empty.');
      await browser.close();
      process.exit(4);
    }

    // Verify first two saved items are true
    if (!parsed[keys[0]] || !parsed[keys[1]]) {
      console.error('First two saved states are not true.');
      await browser.close();
      process.exit(5);
    }

    // Reload and verify checkbox UI persists
    await page.reload({waitUntil: 'domcontentloaded'});
    await page.waitForSelector('.checkbox');
    const checkedStates = await page.evaluate(() => Array.from(document.querySelectorAll('.checkbox')).slice(0,2).map(cb=>cb.classList.contains('checked')));
    console.log('checkedStates after reload:', checkedStates);
    if (!checkedStates[0] || !checkedStates[1]) {
      console.error('Checkbox UI did not persist after reload.');
      await browser.close();
      process.exit(6);
    }

    // Test reset button
    const resetExists = await page.$('#resetProgressBtn');
    if (!resetExists) {
      console.error('Reset button not found.');
      await browser.close();
      process.exit(7);
    }
    await page.click('#resetProgressBtn');
    await page.waitForTimeout(300);
    const afterReset = await page.evaluate(() => localStorage.getItem('ghlRoadmapProgress'));
    console.log('localStorage after reset:', afterReset);
    if (afterReset !== null) {
      console.error('Reset did not clear localStorage.');
      await browser.close();
      process.exit(8);
    }

    console.log('SANITY CHECK: OK');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    await browser.close();
    process.exit(1);
  }
})();