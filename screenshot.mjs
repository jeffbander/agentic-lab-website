import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the website
  await page.goto('http://localhost:5175', { waitUntil: 'networkidle' });

  // Wait a bit for animations
  await page.waitForTimeout(2000);

  // Take full page screenshot
  await page.screenshot({
    path: 'screenshot.png',
    fullPage: true
  });

  console.log('Screenshot saved to screenshot.png');

  await browser.close();
})();
