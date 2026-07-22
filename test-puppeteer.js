import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({ 
    executablePath: '/root/.cache/puppeteer/chrome/linux-151.0.7922.34/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  console.log('Navigating...');
  await page.goto('http://localhost:3000/dashboard/achievements', { waitUntil: 'networkidle0' });
  console.log('Done waiting. Checking content...');
  
  const content = await page.content();
  console.log(content.includes('Achievements management coming soon') ? 'Loaded successfully!' : 'Not loaded.');
  
  await browser.close();
})();
