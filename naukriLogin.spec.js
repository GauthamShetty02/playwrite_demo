require('dotenv').config();
const { test, expect } = require('@playwright/test');

const email = process.env.NAUKRI_EMAIL;
const password = process.env.NAUKRI_PASSWORD;

if (!email || !password) {
  console.error('❌ Missing NAUKRI_EMAIL or NAUKRI_PASSWORD in .env file');
  process.exit(1);
}

test('Login to Naukri.com and save Key Skills', async ({ page }) => {
  try {
    // 1️⃣ Open browser and go to Naukri homepage
    await page.goto('https://www.naukri.com/', { waitUntil: 'domcontentloaded' });
    console.log('🌐 Naukri homepage loaded');

    // 2️⃣ Click login link in header
    await page.click('a[data-ga-track="Main Navigation Login|Login Icon"]');
    console.log('🔐 Clicked on login link');

    // 3️⃣ Wait for login form inputs
    const passwordInput = await page.waitForSelector('input[placeholder="Enter your password"]', { timeout: 10000 });
    const userNameInput = await page.$('input[placeholder="Enter your active Email ID / Username"]');

    if (!passwordInput || !userNameInput) {
      console.error('❌ Input fields missing');
      await page.screenshot({ path: 'error-inputs.png', fullPage: true });
      return;
    }

    // 4️⃣ Fill credentials and login
    await userNameInput.fill(email);
    await passwordInput.fill(password);
    await page.click('button.loginButton');
    console.log('🔄 Submitted login credentials');

    // 5️⃣ Wait for dashboard/homepage redirect
    await page.waitForURL('**/mnjuser/homepage', { timeout: 15000 });

    const title = await page.title();
    if (title === 'Home | Mynaukri') {
      console.log('✅ Successfully logged in and landed on Home page');
    } else {
      throw new Error(`Unexpected page title: ${title}`);
    }

    // 6️⃣ Go to profile page
    const profileLink = 'div.view-profile-wrapper a[href="/mnjuser/profile"]';
    await page.waitForSelector(profileLink, { timeout: 5000, state: 'visible' });
    await page.click(profileLink);
    console.log('👤 Clicked on "View profile"');

    // 7️⃣ Edit Key Skills
    const editSkillsSelector = '#lazyKeySkills .edit.icon';
    await page.waitForSelector(editSkillsSelector, { timeout: 5000, state: 'visible' });
    await page.click(editSkillsSelector);
    console.log('✏️ Clicked on edit icon for Key Skills');

    // 8️⃣ Click Save button
    const saveButton = '#saveKeySkills';
    await page.waitForSelector(saveButton, { timeout: 5000, state: 'visible' });
    await page.click(saveButton);
    console.log('💾 Clicked on Save button');

    // 9️⃣ Confirm success message
    const successMsgSelector = 'p:text("Key Skills have been successfully saved.")';
    await page.waitForSelector(successMsgSelector, { timeout: 5000, state: 'visible' });
    console.log('✅ Success message confirmed: Key Skills saved');

  } catch (err) {
    await page.screenshot({ path: 'login-failed.png', fullPage: true });
    console.error('❌ Error during flow:', err.message || err);
    process.exit(1);
  }
});
