import { type Page, type Locator } from '@playwright/test';

const CODE_LENGTH = 6;

/**
 * Page object for the OTP email-verification screen shown right after signup
 * (e.g. https://app.canary.talkspace.com/email-verification/otp?email=...).
 */
export class EmailVerificationPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly codeInputs: Locator[];
  readonly errorMessage: Locator;
  readonly resendCodeButton: Locator;
  readonly updateEmailLink: Locator;
  readonly contactSupportLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByText('Before matching with a provider, verify your email');
    this.codeInputs = Array.from({ length: CODE_LENGTH }, (_, i) => page.getByTestId(`verificationCodeInput${i}`));
    this.errorMessage = page.getByText('Error validating OTP');
    this.resendCodeButton = page.getByTestId('otpEmailVerificationResendCodeButton');
    this.updateEmailLink = page.getByTestId('update-email-link');
    this.contactSupportLink = page.getByTestId('otpEmailVerificationContactSupportLink');
  }

  /**
   * Types a code across the individual digit inputs. The screen auto-submits
   * once all digits are filled, so a partial code (fewer than 6 digits)
   * never triggers a verification request.
   */
  async enterCode(code: string): Promise<void> {
    for (let i = 0; i < code.length && i < CODE_LENGTH; i++) {
      await this.codeInputs[i].pressSequentially(code[i]);
    }
  }
}
