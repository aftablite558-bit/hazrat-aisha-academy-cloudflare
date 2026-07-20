import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({ 
    executablePath: '/root/.cache/puppeteer/chrome/linux-151.0.7922.34/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('erp_user', JSON.stringify({
      id: '1', role: 'owner', email: 'owner@example.com', name: 'Owner'
    }));
  });
  
  await page.goto('http://localhost:3000/dashboard/achievements', { waitUntil: 'networkidle0' });
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log('TEXT:', text);
  
  await browser.close();
})();
