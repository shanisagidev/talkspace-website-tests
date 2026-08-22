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

  /**
   * Fills the email field.
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fills the password field.
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Fills the nickname field.
   */
  async fillNickname(nickname: string): Promise<void> {
    await this.nicknameInput.fill(nickname);
  }

  /**
   * Selects a state from the state dropdown by typing its name and confirming the filtered match.
   */
  async selectState(state: string): Promise<void> {
    await this.stateDropdown.click();
    await this.page.keyboard.type(state);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Clicks the "Create account" button.
   */
  async clickCreateAccount(): Promise<void> {
    await this.createAccountButton.click();
  }
}
