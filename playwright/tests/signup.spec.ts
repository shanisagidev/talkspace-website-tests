import { test, expect } from "../fixtures/pages.fixture";

const SIGNUPURL = 'https://app.canary.talkspace.com/signup/autoswitchpt';
const emailAdress = 'shani@test.com';
const password = 'Test13579';
const nickname = 'shani test';
const country = 'United States';
const state = 'California';

test.describe('Verify TalksSpace signup flow', () => {
  test('should open the signup page', async ({ page, signupPage }) => {
    // --- Login ---
    await page.goto(SIGNUPURL, { waitUntil: 'domcontentloaded' });
    expect (page.url()).toBe(SIGNUPURL);
    

  });
});
