import { type Page, type Locator } from '@playwright/test';

/**
 * Page object for the Talkspace signup page.
 * Encapsulates the signup page's URL and locators for interacting with it.
 */
export class SignupPage {
  readonly page: Page;
  readonly url: string;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly nicknameInput: Locator;
  readonly countryDropdown: Locator;
  readonly stateDropdown: Locator;
  readonly createAccountButton: Locator;
  readonly telemedicineLink: Locator;
  readonly cancellationPolicyLink: Locator;
  readonly termsLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly noticeOfUsStatePrivacyRightsLink: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = 'https://app.canary.talkspace.com/signup/autoswitchpt';

    this.emailInput = page.getByTestId('emailInput');
    this.passwordInput = page.getByTestId('createAccountPasswordInput');
    this.nicknameInput = page.getByTestId('nicknameInput');
    this.countryDropdown = page.getByTestId('countryDropdown');
    this.stateDropdown = page.getByTestId('stateDropdown');
    this.createAccountButton = page.getByTestId('createAccountSubmitButton');
    this.telemedicineLink = page.getByTestId('telemedicineLink');
    this.cancellationPolicyLink = page.getByTestId('createAccountCancellationLink');
    this.termsLink = page.getByTestId('createAccountTermsLink');
    this.privacyPolicyLink = page.getByTestId('createAccountPrivacyLink');
    this.noticeOfUsStatePrivacyRightsLink = page.getByTestId('createAccountNoticeOfUSStatePrivacyRightsLink');
    this.loginLink = page.getByTestId('loginLink');
  }

  /**
   * Navigates to the signup page and waits for the page to be ready.
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Returns the current page title.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
