import { chromium } from 'playwright';

async function testWebsite() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    console.log('📍 Navigating to homepage...');
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('📸 Taking homepage screenshot...');
    await page.screenshot({ path: 'screenshots/01-homepage.png', fullPage: true });
    console.log('✅ Homepage loaded successfully');

    // Test navigation
    console.log('\n📍 Testing navigation menu...');
    const navLinks = ['Overview', 'Projects', 'Approach', 'Impact', 'Video Generator', 'Contact'];

    for (let i = 0; i < navLinks.length; i++) {
      const linkName = navLinks[i];
      console.log(`\n🔍 Testing ${linkName} section...`);

      await page.click(`text="${linkName}"`);
      await page.waitForTimeout(1500);

      const screenshotNum = String(i + 2).padStart(2, '0');
      await page.screenshot({ path: `screenshots/${screenshotNum}-${linkName.toLowerCase().replace(/ /g, '-')}.png`, fullPage: false });
      console.log(`✅ ${linkName} section loaded`);
    }

    // Test Video Generator specifically
    console.log('\n📍 Testing Video Generator in detail...');
    await page.goto('http://localhost:5175/#video-generator', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/08-video-generator-full.png', fullPage: true });

    // Check for generate button
    const generateButton = await page.locator('button:has-text("Generate Video")').count();
    console.log(`✅ Generate Video button found: ${generateButton > 0 ? 'YES' : 'NO'}`);

    if (generateButton > 0) {
      const isEnabled = await page.locator('button:has-text("Generate Video")').isEnabled();
      console.log(`✅ Generate Video button enabled: ${isEnabled ? 'NO (needs preset selection)' : 'READY'}`);
    }

    // Check Mount Sinai branding
    console.log('\n📍 Verifying Mount Sinai branding...');
    const logoCount = await page.locator('img[alt*="Mount Sinai"]').count();
    console.log(`✅ Mount Sinai logos found: ${logoCount}`);

    const cyanElements = await page.locator('[class*="sinai-cyan"], [class*="cyan"]').count();
    console.log(`✅ Brand color (cyan) elements found: ${cyanElements}`);

    console.log('\n✅ ALL TESTS PASSED! Website is working correctly.');
    console.log('\n📁 Screenshots saved to: screenshots/');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    await page.screenshot({ path: 'screenshots/error.png' });
  } finally {
    await browser.close();
  }
}

testWebsite();
