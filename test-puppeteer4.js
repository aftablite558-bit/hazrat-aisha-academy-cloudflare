import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({ 
    executablePath: '/root/.cache/puppeteer/chrome/linux-151.0.7922.34/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  page.on('response', response => {
    if (response.status() === 404) {
      console.log('404:', response.url());
    }
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('erp_user', JSON.stringify({
      id: '1', role: 'owner', email: 'owner@example.com', name: 'Owner'
    }));
  });
  
  await page.goto('http://localhost:3000/dashboard/achievements', { waitUntil: 'networkidle0' });
  
  await browser.close();
})();
