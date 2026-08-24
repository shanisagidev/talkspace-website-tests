# Talkspace Website Tests

This repository contains end-to-end browser tests for the Talkspace signup flow using Playwright. The suite covers both happy-path and negative cases, including form validation, email verification steps, footer link validation, and sign-up submission behavior.

## What this repo includes

- Playwright configuration and test setup
- Page object models for the signup and email verification screens
- Tests for signup validation and successful registration
- Negative case coverage for invalid inputs and blocked submissions
- Utility helpers for request interception and browser navigation

## Prerequisites

Before running the tests, make sure you have:

- Node.js installed
- npm installed
- Dependencies installed from the project root

## Install dependencies

From the project root, run:

```bash
npm install
```

## Run the test suite

Run all Playwright tests:

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test playwright/tests/signup-positive.spec.ts
```

Run a single test by name:

```bash
npx playwright test playwright/tests/signup-negative.spec.ts --grep "weak password blocks submission"
```

Open the Playwright HTML report after a test run:

```bash
npx playwright show-report
```

## Project structure

```text
.
├── playwright/
│   ├── fixtures/
│   ├── pages/
│   ├── tests/
│   └── utils/
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## Notes

- The signup tests target the Talkspace Canary environment.
- Some flows, such as email verification and OTP resend, may be rate-limited, so tests that hit those endpoints are intentionally handled carefully.
- The Playwright config sets the default test ID attribute to `data-qa`, so tests can use `getByTestId(...)` selectors.

## Useful commands

```bash
npx playwright test --headed
npx playwright test --ui
npx playwright test --project=chromium
```

This repo is designed to validate the Talkspace signup experience automatically and catch regressions early in the browser.
