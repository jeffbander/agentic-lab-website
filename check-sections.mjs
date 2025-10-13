import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5175', { waitUntil: 'networkidle' });

  // Wait for content to load
  await page.waitForTimeout(3000);

  // Check for each section
  const sections = [
    'Hero',
    'ProjectsSection',
    'WorkflowDiagram',
    'MCPArchitecture',
    'VoiceBiomarkerFlow',
    'ClinicalImpactDashboard',
    'ROICalculator'
  ];

  console.log('\n=== Checking Sections ===\n');

  for (const section of sections) {
    // Try to find by text content or component markers
    const found = await page.locator(`text=${section}`).first().isVisible().catch(() => false);
    console.log(`${section}: ${found ? '✓ Visible' : '✗ Not found'}`);
  }

  // Check for specific text markers
  console.log('\n=== Checking Key Content ===\n');
  const markers = [
    'Healthcare Specialists',
    'Featured Projects',
    'Agentic Development Workflow',
    'MCP Architecture',
    'Voice Biomarker Detection',
    'Clinical Impact Dashboard',
    'ROI Calculator'
  ];

  for (const marker of markers) {
    const found = await page.locator(`text=${marker}`).first().isVisible().catch(() => false);
    console.log(`"${marker}": ${found ? '✓ Visible' : '✗ Not found'}`);
  }

  // Get page height
  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log(`\nPage height: ${height}px`);

  await browser.close();
})();
