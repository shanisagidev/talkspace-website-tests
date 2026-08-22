import { test } from '../fixtures/page.fixture';
import { expect } from '@playwright/test';

const SIGNUPURL = 'https://app.canary.talkspace.com/signup/autoswitchpt';
const REGISTRATION_ENDPOINT = 'clientapi.canary.talkspace.com/v2/registration';

const VALID_PASSWORD = 'Test13579!';
const VALID_NICKNAME = 'shanitest';
const VALID_STATE = 'California';

function uniqueEmail(label: string): string {
  return `shani.${label}.${Date.now()}@test.com`;
}

async function expectNoRegistrationCall(page: import('@playwright/test').Page, action: () => Promise<void>) {
  const registrationResponse = page
    .waitForResponse(
      (response) => response.url().includes(REGISTRATION_ENDPOINT) && response.request().method() === 'POST',
      { timeout: 3000 }
    )
    .catch(() => null);
  await action();
  expect(await registrationResponse).toBeNull();
}

test.describe('Verify Talkspace signup flow - negative cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SIGNUPURL, { waitUntil: 'domcontentloaded' });
  });

  test('invalid email format blocks submission', async ({ page, signupPage }) => {
    await signupPage.fillEmail('notanemail');
    await signupPage.fillPassword(VALID_PASSWORD);
    await signupPage.fillNickname(VALID_NICKNAME);
    await signupPage.selectState(VALID_STATE);

    await expectNoRegistrationCall(page, () => signupPage.clickCreateAccount());

    const isEmailValid = await signupPage.emailInput.evaluate((el) => (el as HTMLInputElement).validity.valid);
    expect(isEmailValid).toBe(false);
    await expect(page).toHaveURL(SIGNUPURL);
  });

  test('weak password blocks submission', async ({ page, signupPage }) => {
    await signupPage.fillEmail(uniqueEmail('weakpw'));
    await signupPage.fillPassword('Test13579');
    await signupPage.fillNickname(VALID_NICKNAME);
    await signupPage.selectState(VALID_STATE);

    await expectNoRegistrationCall(page, () => signupPage.clickCreateAccount());

    await expect(page.locator('[data-qa="createAccountPasswordInput-error"]')).toHaveText(
      "Password not secure enough. Try adding symbols or words, and don't use repeat characters."
    );
    await expect(page).toHaveURL(SIGNUPURL);
  });

  test('nickname with spaces blocks submission', async ({ page, signupPage }) => {
    await signupPage.fillEmail(uniqueEmail('badnick'));
    await signupPage.fillPassword(VALID_PASSWORD);
    await signupPage.fillNickname('shani test');
    await signupPage.selectState(VALID_STATE);

    await expectNoRegistrationCall(page, () => signupPage.clickCreateAccount());

    await expect(page.locator('[data-qa="nicknameInput-error"]')).toHaveText(
      "Can't contain special characters or spaces."
    );
    await expect(page).toHaveURL(SIGNUPURL);
  });

  test('missing state blocks submission', async ({ page, signupPage }) => {
    await signupPage.fillEmail(uniqueEmail('nostate'));
    await signupPage.fillPassword(VALID_PASSWORD);
    await signupPage.fillNickname(VALID_NICKNAME);
    // deliberately not selecting a state

    await expectNoRegistrationCall(page, () => signupPage.clickCreateAccount());

    await expect(page).toHaveURL(SIGNUPURL);
  });

  test('empty form submission blocks submission', async ({ page, signupPage }) => {
    await expectNoRegistrationCall(page, () => signupPage.clickCreateAccount());

    await expect(page.locator('[data-qa="emailInput-error"]')).toHaveText('Please enter an email.');
    await expect(page.locator('[data-qa="createAccountPasswordInput-error"]')).toHaveText(
      'Please enter a password.'
    );
    await expect(page.locator('[data-qa="nicknameInput-error"]')).toHaveText('Please enter a nickname.');
    await expect(page).toHaveURL(SIGNUPURL);
  });
});
