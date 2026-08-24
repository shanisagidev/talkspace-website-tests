import { test } from '../fixtures/page.fixture';
import { expect } from '@playwright/test';

const SIGNUPURL = 'https://app.canary.talkspace.com/signup/autoswitchpt';
const RESEND_ENDPOINT = 'clientapi.canary.talkspace.com/v2/auth/email-verification/otp/resend';
const VERIFY_ENDPOINT = 'clientapi.canary.talkspace.com/v2/auth/email-verification/otp';

const VALID_PASSWORD = 'Test13579!';
const VALID_NICKNAME = 'shanitest';
const VALID_STATE = 'California';

function uniqueEmail(label: string): string {
  return `shani.${label}.${Date.now()}@test.com`;
}

test.describe('Verify Talkspace signup flow - email verification', () => {
  // These tests hit the OTP/resend endpoints, which are rate-limited; run them
  // serially to avoid concurrent workers tripping that limit against each other.
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page, signupPage }, testInfo) => {
    const email = uniqueEmail(testInfo.title.replace(/\W+/g, '').slice(0, 20));
    console.log(`Registering ${email} to reach the email-verification screen`);

    await page.goto(SIGNUPURL, { waitUntil: 'domcontentloaded' });

    await signupPage.fillEmail(email);
    await signupPage.fillPassword(VALID_PASSWORD);
    await signupPage.fillNickname(VALID_NICKNAME);
    await signupPage.selectState(VALID_STATE);
    await signupPage.clickCreateAccount();
    await expect(page).toHaveURL(/\/email-verification\/otp/);
    console.log(`Landed on: ${page.url()}`);
  });

  test('lands on the correct verification screen with the registered email', async ({ page, emailVerificationPage }) => {
    const registeredEmail = new URL(page.url()).searchParams.get('email');
    console.log(`Verifying screen shows the registered email: ${registeredEmail}`);

    await expect(emailVerificationPage.heading).toBeVisible();
    await expect(page.getByText(`We sent a one-time code to ${registeredEmail}`)).toBeVisible();
    await expect(emailVerificationPage.codeInputs[0]).toBeVisible();
  });

  test('an invalid code shows a validation error', async ({ page, emailVerificationPage }) => {
    console.log('Entering invalid code: 123456');
    const verifyResponse = page.waitForResponse(
      (response) => response.url().includes(VERIFY_ENDPOINT) && response.request().method() !== 'GET'
    );
    await emailVerificationPage.enterCode('123456');
    const response = await verifyResponse;
    console.log(`Verify response status: ${response.status()}`);

    expect(response.status()).not.toBe(200);
    await expect(emailVerificationPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/\/email-verification\/otp/);
  });

  test('an incomplete code does not trigger a verification request', async ({ page, emailVerificationPage }) => {
    console.log('Entering incomplete code: 123');
    const verifyResponse = page
      .waitForResponse((response) => response.url().includes(VERIFY_ENDPOINT), { timeout: 3000 })
      .catch(() => null);
    await emailVerificationPage.enterCode('123');
    const response = await verifyResponse;
    console.log(response === null ? 'No verification request fired, as expected' : 'Unexpected verification request fired');

    expect(response).toBeNull();
  });

  test('Update email link navigates to the change-email screen', async ({ page, emailVerificationPage }) => {
    console.log('Clicking "Update email"');
    await emailVerificationPage.updateEmailLink.click();
    console.log(`Navigated to: ${page.url()}`);

    await expect(page).toHaveURL(/\/email-verification\/change-email/);
    await expect(page.getByText('Change email')).toBeVisible();
    await expect(page.getByTestId('newEmailInput')).toBeVisible();
    await expect(page.getByTestId('confirmNewEmailInput')).toBeVisible();
    await expect(page.getByTestId('saveAndResendEmailButton')).toBeVisible();
  });

});
