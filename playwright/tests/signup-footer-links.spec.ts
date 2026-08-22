import { test } from '../fixtures/page.fixture';
import { expect, type Locator } from '@playwright/test';

const SIGNUPURL = 'https://app.canary.talkspace.com/signup/autoswitchpt';
const TELEMEDICINE_URL = 'https://www.talkspace.com/public/informed-consent';
const TERMS_URL = 'https://www.talkspace.com/public/terms';
const PRIVACY_POLICY_URL = 'https://www.talkspace.com/public/privacy-policy';
const STATE_PRIVACY_RIGHTS_URL = 'https://www.talkspace.com/public/notice-of-us-state-privacy-rights';
const LOGIN_URL = 'https://app.canary.talkspace.com/login';

async function expectOpensInNewTab(context: import('@playwright/test').BrowserContext, link: Locator, expectedUrl: string) {
  const [newPage] = await Promise.all([context.waitForEvent('page'), link.click()]);
  await newPage.waitForLoadState('domcontentloaded');
  await expect(newPage).toHaveURL(expectedUrl);
  await newPage.close();
}

test.describe('Verify Talkspace signup flow - footer links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SIGNUPURL, { waitUntil: 'domcontentloaded' });
  });

  test('Telemedicine link opens in a new tab', async ({ context, signupPage }) => {
    await expectOpensInNewTab(context, signupPage.telemedicineLink, TELEMEDICINE_URL);
  });

  test('Terms of use link opens in a new tab', async ({ context, signupPage }) => {
    await expectOpensInNewTab(context, signupPage.termsLink, TERMS_URL);
  });

  test('Privacy policy link opens in a new tab', async ({ context, signupPage }) => {
    await expectOpensInNewTab(context, signupPage.privacyPolicyLink, PRIVACY_POLICY_URL);
  });

  test('Notice of US State Privacy Rights link opens in a new tab', async ({ context, signupPage }) => {
    await expectOpensInNewTab(
      context,
      signupPage.noticeOfUsStatePrivacyRightsLink,
      STATE_PRIVACY_RIGHTS_URL
    );
  });

  test('Log in link navigates to the login page', async ({ page, signupPage }) => {
    await signupPage.loginLink.click();
    await expect(page).toHaveURL(LOGIN_URL);
  });
});
