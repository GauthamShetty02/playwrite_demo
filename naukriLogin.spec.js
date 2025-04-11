const { test, expect } = require('@playwright/test');

test('Login to Naukri.com', async ({ page }) => {
  const email = process.env.NAUKRI_EMAIL;
  const password = process.env.NAUKRI_PASSWORD;

  if (!email || !password) {
    console.error('❌ Missing credentials');
    process.exit(1);
  }

  try {
    await page.goto('https://www.naukri.com/mnjuser/homepage');

    await page.fill('input[type="text"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForURL('**/mnjuser/homepage', { timeout: 10000 });
    await expect(page.locator('text=My Naukri')).toBeVisible({ timeout: 5000 });

    console.log('✅ Login successful');
  } catch (err) {
    console.error('❌ Login failed:', err);
    process.exit(1);
  }
});
