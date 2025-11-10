import { test, expect, Page, Locator } from '@playwright/test';

async function goToStudentsAndEnterDemo(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Studerende/i }).click();
  await expect(page.getByRole('heading', { level: 2, name: /Studerende/i })).toBeVisible();
  const input = page.getByPlaceholder('Skriv her...');
  await input.fill('ch-demo');
  await page.getByRole('button', { name: /^Send$/ }).click();
}

async function answerMultipleChoice(page: Page, answerText: string) {
  const option = page.locator('button.stud-btn-option', { hasText: answerText }).first();
  await expect(option).toBeVisible();
  await option.click();
  await expect(page.getByText(/Korrekt!/i)).toBeVisible();
}

async function answerInput(page: Page, value: string) {
  const input = page.getByPlaceholder('Dit svar...');
  await input.fill(value);
  await page.getByRole('button', { name: /^Tjek$/ }).click();
  await expect(page.getByText(/Korrekt!/i)).toBeVisible();
}

async function answerProgressive(page: Page, steps: string[], final: string) {
  // Fill each step input in order (placeholders are 'Svar...')
  for (let i = 0; i < steps.length; i++) {
    const field = page.getByPlaceholder('Svar...').nth(i);
    await field.fill(steps[i]);
  }
  // Final answer input
  const finalInput = page.getByPlaceholder('Endeligt svar...');
  await finalInput.fill(final);
  // Auto-validates; wait until 'Alle svar er korrekte!' appears OR next button becomes enabled
  const nextBtn = page.getByRole('button', { name: 'Næste' });
  await expect(nextBtn).toBeEnabled();
}

async function reorderListTo(page: Page, expectedLabels: string[]) {
  // Items are rendered in an <ol> where each <li> contains: '#n', label, ↑ ↓ buttons
  const items = page.locator('ol >> li');
  const upButton = (idx: number) => items.nth(idx).getByRole('button', { name: '↑' });
  const downButton = (idx: number) => items.nth(idx).getByRole('button', { name: '↓' });

  const getCurrent = async (): Promise<string[]> => {
    const count = await items.count();
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      const txt = await items.nth(i).innerText();
      const cleaned = txt.replace(/^#\d+\s*/, '').replace(/[↑↓]/g, '').trim();
      labels.push(cleaned);
    }
    return labels;
  };

  // Limit iterations to avoid infinite loops if DOM changes
  for (let guard = 0; guard < 50; guard++) {
    const current = await getCurrent();
    if (current.length !== expectedLabels.length) {
      throw new Error(`Unexpected list length. expected=${expectedLabels.length} got=${current.length}`);
    }
    if (current.every((l, i) => l === expectedLabels[i])) break;

    // Find first mismatch and move the needed item toward that index
    let i = current.findIndex((l, idx) => l !== expectedLabels[idx]);
    if (i === -1) break;
    const want = expectedLabels[i];
    const j = current.findIndex(l => l === want);
    if (j === -1) throw new Error(`Label '${want}' not found in current list`);

    if (j > i) {
      // Move item up (j - i) times
      for (let k = 0; k < j - i; k++) {
        await upButton(j - k).click();
      }
    } else if (j < i) {
      // Move item down (i - j) times
      for (let k = 0; k < i - j; k++) {
        await downButton(j + k).click();
      }
    }
  }
}

async function answerDragAndDropByArrows(page: Page, expectedLabels: string[]) {
  await reorderListTo(page, expectedLabels);
  await page.getByRole('button', { name: /^Check$/ }).click();
  await expect(page.getByText(/Korrekt rækkefølge!/i)).toBeVisible();
}

async function goNext(page: Page) {
  const next = page.getByRole('button', { name: 'Næste' });
  await expect(next).toBeEnabled();
  await next.click();
}

// Utility: wait for a UI cue that the question screen is ready. We prefer
// interaction elements over static headings to avoid brittle assertions.
async function waitForQuestionReady(page: Page, cue: 'mc' | 'input' | 'progressive' | 'dnd') {
  switch (cue) {
    case 'mc':
      // Wait for at least one option button to be visible
      await expect(page.locator('button.stud-btn-option').first()).toBeVisible();
      break;
    case 'input':
      await expect(page.getByPlaceholder('Dit svar...')).toBeVisible();
      break;
    case 'progressive':
      await expect(page.getByPlaceholder('Svar...').first()).toBeVisible();
      break;
    case 'dnd':
      await expect(page.getByText('Arrange the items in the correct order:')).toBeVisible();
      break;
  }
}

// Full walkthrough of the built-in DEMO room (src/data/questions.json)
// Relies on known correct answers for that dataset.

test('demo room walkthrough – student flow to completion', async ({ page }) => {
  await goToStudentsAndEnterDemo(page);

  // 1) multipleChoice – "Hvad er det kemiske symbol for vand?" => H2O
  await waitForQuestionReady(page, 'mc');
  await answerMultipleChoice(page, 'H2O');
  await goNext(page);

  // 2) inputAnswer – "Hvad er atomnummeret for kulstof?" => 6
  await waitForQuestionReady(page, 'input');
  await answerInput(page, '6');
  await goNext(page);

  // 3) multipleChoice – "Hvilken af disse er en ædelgas?" => Neon
  await waitForQuestionReady(page, 'mc');
  await answerMultipleChoice(page, 'Neon');
  await goNext(page);

  // 4) inputAnswer – "pH-værdien af rent vand" => 7
  await waitForQuestionReady(page, 'input');
  await answerInput(page, '7');
  await goNext(page);

  // 5) progressiveQuestions – Build NaCl: steps [N, a, C, l], final NaCl
  await waitForQuestionReady(page, 'progressive');
  await answerProgressive(page, ['N', 'a', 'C', 'l'], 'NaCl');
  await goNext(page);

  // 6) dragAndDrop – Order by atomic number: Hydrogen, Helium, Lithium, Beryllium
  await waitForQuestionReady(page, 'dnd');
  await answerDragAndDropByArrows(page, [
    'Hydrogen (H)',
    'Helium (He)',
    'Lithium (Li)',
    'Beryllium (Be)'
  ]);
  await goNext(page);

  // 7) multipleChoice – "Hvilken syre findes i eddike?" => Eddikesyre
  await waitForQuestionReady(page, 'mc');
  await answerMultipleChoice(page, 'Eddikesyre');
  await goNext(page);

  // 8) inputAnswer – "mest udbredt i Jordens atmosfære" => Nitrogen
  await waitForQuestionReady(page, 'input');
  await answerInput(page, 'Nitrogen');
  await goNext(page);

  // 9) progressiveQuestions – Glucose: steps [C, 6, O, 6], final C6H12O6
  await waitForQuestionReady(page, 'progressive');
  await answerProgressive(page, ['C', '6', 'O', '6'], 'C6H12O6');
  await goNext(page);

  // 10) dragAndDrop – Sequence of process
  await waitForQuestionReady(page, 'dnd');
  await answerDragAndDropByArrows(page, [
    'Reaktanter blandes',
    'Reaktionen sker',
    'Produkter dannes',
    'Observation registreres'
  ]);
  await goNext(page);

  // Completion summary
  await expect(page.getByRole('heading', { level: 2, name: /Rummet er fuldført!/i })).toBeVisible();
});
