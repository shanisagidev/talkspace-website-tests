import { test } from '../fixtures/page.fixture';
import { expect } from '@playwright/test';

const SIGNUPURL = 'https://app.canary.talkspace.com/signup/autoswitchpt';
const EMAILADRESS = `shani.${Date.now()}@test.com`;
const PASSWORD = 'Test13579!';
const NICKNAME = 'shanitest';
const COUNTRY = 'United States';
const STATE = 'California';

test.describe('Verify TalksSpace signup flow', () => {
  test('should open the signup page', async ({ page, signupPage }) => {
    // --- Login ---
    await page.goto(SIGNUPURL, { waitUntil: 'domcontentloaded' });
    expect (page.url()).toBe(SIGNUPURL);

    await signupPage.fillEmail(EMAILADRESS);
    await signupPage.fillPassword(PASSWORD);
    await signupPage.fillNickname(NICKNAME);
    await signupPage.selectCountry(COUNTRY);
    await signupPage.selectState(STATE);

    const registrationResponse = page.waitForResponse(
      (response) =>
        response.url().includes('clientapi.canary.talkspace.com/v2/registration') &&
        response.request().method() === 'POST'
    );
    await signupPage.clickCreateAccount();
    expect((await registrationResponse).status()).toBe(201);

    await expect(page).toHaveURL(/\/email-verification\/otp/);
  });
});
