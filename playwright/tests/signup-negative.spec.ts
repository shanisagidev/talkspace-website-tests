import { test } from '../fixtures/page.fixture';
import { expect } from '@playwright/test';
import { expectNoRequestTo } from '../utils/network';

const SIGNUPURL = 'https://app.canary.talkspace.com/signup/autoswitchpt';
const REGISTRATION_ENDPOINT = 'clientapi.canary.talkspace.com/v2/registration';

const VALID_PASSWORD = 'Test13579!';
const VALID_NICKNAME = 'shanitest';
const VALID_STATE = 'California';

function uniqueEmail(label: string): string {
  return `shani.${label}.${Date.now()}@test.com`;
}

test.describe('Verify Talkspace signup flow - negative cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SIGNUPURL, { waitUntil: 'domcontentloaded' });
  });

  test('invalid email format blocks submission', async ({ page, signupPage }) => {
    console.log('Filling email with invalid format: notanemail');
    await signupPage.fillEmail('notanemail');
    await signupPage.fillPassword(VALID_PASSWORD);
    await signupPage.fillNickname(VALID_NICKNAME);
    await signupPage.selectState(VALID_STATE);

    await expectNoRequestTo(page, REGISTRATION_ENDPOINT, () => signupPage.clickCreateAccount());

    const isEmailValid = await signupPage.emailInput.evaluate((el) => (el as HTMLInputElement).validity.valid);
    console.log(`Email input validity.valid: ${isEmailValid}`);
    expect(isEmailValid).toBe(false);
    await expect(page).toHaveURL(SIGNUPURL);
  });

  test('weak password blocks submission', async ({ page, signupPage }) => {
    const email = uniqueEmail('weakpw');
    console.log(`Using email: ${email}, weak password: Test13579`);
    await signupPage.fillEmail(email);
    await signupPage.fillPassword('Test13579');
    await signupPage.fillNickname(VALID_NICKNAME);
    await signupPage.selectState(VALID_STATE);

    await expectNoRequestTo(page, REGISTRATION_ENDPOINT, () => signupPage.clickCreateAccount());

    const errorText = await page.getByTestId('createAccountPasswordInput-error').textContent();
    console.log(`Password error shown: "${errorText}"`);
    await expect(page.getByTestId('createAccountPasswordInput-error')).toHaveText(
      "Password not secure enough. Try adding symbols or words, and don't use repeat characters."
    );
    await expect(page).toHaveURL(SIGNUPURL);
  });

  test('nickname with spaces blocks submission', async ({ page, signupPage }) => {
    const email = uniqueEmail('badnick');
    console.log(`Using email: ${email}, nickname with space: "shani test"`);
    await signupPage.fillEmail(email);
    await signupPage.fillPassword(VALID_PASSWORD);
    await signupPage.fillNickname('shani test');
    await signupPage.selectState(VALID_STATE);

    await expectNoRequestTo(page, REGISTRATION_ENDPOINT, () => signupPage.clickCreateAccount());

    const errorText = await page.getByTestId('nicknameInput-error').textContent();
    console.log(`Nickname error shown: "${errorText}"`);
    await expect(page.getByTestId('nicknameInput-error')).toHaveText(
      "Can't contain special characters or spaces."
    );
    await expect(page).toHaveURL(SIGNUPURL);
  });

  test('missing state blocks submission', async ({ page, signupPage }) => {
    const email = uniqueEmail('nostate');
    console.log(`Using email: ${email}, deliberately leaving state unselected`);
    await signupPage.fillEmail(email);
    await signupPage.fillPassword(VALID_PASSWORD);
    await signupPage.fillNickname(VALID_NICKNAME);
    // deliberately not selecting a state

    await expectNoRequestTo(page, REGISTRATION_ENDPOINT, () => signupPage.clickCreateAccount());

    await expect(page).toHaveURL(SIGNUPURL);
  });

  test('empty form submission blocks submission', async ({ page, signupPage }) => {
    console.log('Submitting the form with all fields empty');
    await expectNoRequestTo(page, REGISTRATION_ENDPOINT, () => signupPage.clickCreateAccount());

    const emailError = await page.getByTestId('emailInput-error').textContent();
    const passwordError = await page.getByTestId('createAccountPasswordInput-error').textContent();
    const nicknameError = await page.getByTestId('nicknameInput-error').textContent();
    console.log(`Errors shown - email: "${emailError}", password: "${passwordError}", nickname: "${nicknameError}"`);

    await expect(page.getByTestId('emailInput-error')).toHaveText('Please enter an email.');
    await expect(page.getByTestId('createAccountPasswordInput-error')).toHaveText(
      'Please enter a password.'
    );
    await expect(page.getByTestId('nicknameInput-error')).toHaveText('Please enter a nickname.');
    await expect(page).toHaveURL(SIGNUPURL);
  });
});
