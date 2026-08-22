import { test as base } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';

type Fixtures = {
  signupPage: SignupPage;
};

export const test = base.extend<Fixtures>({
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
});

export { expect } from '@playwright/test';
