# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## App routes and navigation

This app now uses React Router for URL-based navigation, so the browser back/forward buttons work across views. Key routes:

- `/` – Home
- `/studerende` – Student page
- `/underviser/login` – Teacher login
- `/underviser` – Teacher dashboard
- `/underviser/pages` – Teacher page editor/manager

Deep links are supported in dev and production (Firebase Hosting is configured with a SPA rewrite to `/index.html`).

Dev server tip (from repo root):

```powershell
npm run dev --prefix my-react-app
```

## End-to-End (E2E) Testing with Playwright

Playwright is configured for automated browser tests.

### Folder Structure
```
my-react-app/
  playwright.config.ts
  tests/
    e2e/
      home.spec.ts
```

### Local Usage

Install browsers once (after dependency install):

```powershell
npx playwright install
```

Run tests headless:

```powershell
npm run e2e
```

Run tests in headed (visible) mode:

```powershell
npm run e2e:headed
```

View last HTML report:

```powershell
npm run e2e:report
```

The config starts a Vite preview server (build + `vite preview`) on port `4173`. Tests use `baseURL` so you can do `page.goto('/')` instead of a full URL.

### CI / GitHub Actions

A workflow at `.github/workflows/playwright.yml` runs Playwright on every push and pull request:
1. Checks out code
2. Sets up Node 20
3. Installs dependencies
4. Installs Playwright browsers
5. Runs `npm run e2e`
6. Uploads the HTML report as an artifact

### Adding New Tests
Create a new file under `tests/e2e/` ending with `.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('example', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

### Troubleshooting
- If TypeScript complains about `@playwright/test` types, ensure `@playwright/test` is in `devDependencies` and run `npm install`.
- If tests hang on CI, verify no other process is holding port 4173 and that build succeeds.
- Use `trace: 'on-first-retry'` (configured) and download the artifact to debug flaky tests.

### Future Enhancements
- Add data-testids for more resilient selectors.
- Parallel projects for mobile view snapshots.
- Integrate visual regression with `@playwright/test` screenshots.

