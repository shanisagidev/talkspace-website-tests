import { test as base } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { EmailVerificationPage } from '../pages/EmailVerificationPage';

type Fixtures = {
  signupPage: SignupPage;
  emailVerificationPage: EmailVerificationPage;
};

export const test = base.extend<Fixtures>({
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  emailVerificationPage: async ({ page }, use) => {
    await use(new EmailVerificationPage(page));
  },
});

export { expect } from '@playwright/test';
