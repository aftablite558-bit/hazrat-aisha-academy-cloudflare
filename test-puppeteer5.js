import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({ 
    executablePath: '/root/.cache/puppeteer/chrome/linux-151.0.7922.34/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR LOG:', msg.text());
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('erp_user', JSON.stringify({
      id: '1', role: 'owner', email: 'owner@example.com', name: 'Owner'
    }));
  });
  
  // Go to dashboard index first
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  console.log('At dashboard. Current URL:', page.url());
  
  // Click on the Achievements link
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const link = links.find(l => l.href.includes('/achievements'));
    if (link) link.click();
  });
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 2000));
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log('TEXT AFTER CLICK:', text.substring(0, 100));
  
  await browser.close();
})();
