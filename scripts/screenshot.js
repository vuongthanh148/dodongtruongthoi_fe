// eslint-disable-next-line @typescript-eslint/no-require-imports
const puppeteer = require('puppeteer');

(async () => {
  const url = 'http://localhost:3000';
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: './.screenshots/home-desktop.png', fullPage: true });

    await page.setViewport({ width: 375, height: 812 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: './.screenshots/home-mobile.png', fullPage: true });

    console.log('Screenshots saved to ./.screenshots/');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
