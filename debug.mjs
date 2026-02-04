import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Listen to console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Listen to page errors
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('Navigating to http://localhost:5175...');

  try {
    await page.goto('http://localhost:5175', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('Page loaded successfully');

    // Get page content
    const content = await page.content();
    console.log('Page HTML length:', content.length);

    // Check if React root exists
    const rootExists = await page.$('#root');
    console.log('React root exists:', !!rootExists);

    // Get any visible text
    const bodyText = await page.textContent('body');
    console.log('Body text:', bodyText?.substring(0, 200));

  } catch (error) {
    console.error('Navigation error:', error.message);
  }

  await browser.close();
})();
