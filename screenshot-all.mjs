import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5175', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('Taking screenshots of each section...\n');

  // Full page screenshot
  await page.screenshot({
    path: 'screenshots/full-page.png',
    fullPage: true
  });
  console.log('✓ Full page screenshot saved');

  // Hero section
  await page.screenshot({
    path: 'screenshots/hero.png',
    clip: { x: 0, y: 0, width: 1920, height: 1080 }
  });
  console.log('✓ Hero section screenshot saved');

  // Scroll and capture other sections
  const sections = [
    { name: 'projects', scroll: 1000 },
    { name: 'workflow', scroll: 2500 },
    { name: 'mcp-architecture', scroll: 4500 },
    { name: 'voice-biomarker', scroll: 6000 },
    { name: 'clinical-dashboard', scroll: 7500 },
    { name: 'roi-calculator', scroll: 9000 }
  ];

  for (const section of sections) {
    await page.evaluate((y) => window.scrollTo(0, y), section.scroll);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `screenshots/${section.name}.png`,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    console.log(`✓ ${section.name} screenshot saved`);
  }

  console.log('\nAll screenshots saved to screenshots/ directory');
  await browser.close();
})();
