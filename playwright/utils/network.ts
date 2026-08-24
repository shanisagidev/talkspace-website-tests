import { type Page, expect } from '@playwright/test';

/**
 * Asserts that performing `action` does not trigger a POST request whose URL
 * contains `urlSubstring` within `timeout` ms.
 */
export async function expectNoRequestTo(
  page: Page,
  urlSubstring: string,
  action: () => Promise<void>,
  timeout = 3000
): Promise<void> {
  const response = page
    .waitForResponse(
      (r) => r.url().includes(urlSubstring) && r.request().method() === 'POST',
      { timeout }
    )
    .catch(() => null);
  await action();
  const result = await response;
  console.log(
    result === null
      ? `No POST request to "${urlSubstring}" fired, as expected`
      : `Unexpected POST request to "${urlSubstring}" fired with status ${result.status()}`
  );
  expect(result).toBeNull();
}
