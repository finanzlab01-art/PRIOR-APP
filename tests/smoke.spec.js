import { test, expect } from '@playwright/test';

async function installSupabaseStub(page, { authenticated = false, failFirstDiagnostic = false } = {}) {
  const user = { id: '00000000-0000-4000-8000-000000000001', email: 'prueba@prior.test' };
  const session = authenticated ? { user } : null;
  const source = `
    window.__priorDb = { attempts: [], successes: [] };
    window.supabase = {
      createClient: () => ({
        auth: {
          getSession: async () => ({ data: { session: ${JSON.stringify(session)} }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
          signOut: async () => ({ error: null })
        },
        from: (table) => ({
          insert: async (payload) => {
            window.__priorDb.attempts.push({ table, payload });
            const count = window.__priorDb.attempts.filter(x => x.table === table).length;
            if (${failFirstDiagnostic} && table === 'diagnostico_resultados' && count === 1) {
              return { error: { message: 'temporary test failure' } };
            }
            window.__priorDb.successes.push({ table, payload });
            return { error: null };
          }
        })
      })
    };
  `;
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js',
    route => route.fulfill({ status: 200, contentType: 'application/javascript', body: source }));
}

async function completeCurrentDiagnostic(page) {
  await page.goto('/');
  await page.locator('.saltar').click();
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();

  for (const answer of ['25 a 34', 'Bolívares', 'No cuento con uno']) {
    await page.locator('.opcion').first().waitFor({ state: 'visible' });
    await page.getByRole('button', { name: answer, exact: true }).click();
  }

  await expect(page.locator('.escala-item')).toHaveCount(11);
  for (let i = 0; i < 11; i++) {
    await page.locator('.escala-item').nth(i).locator('.escala-punto').first().click();
  }
  await page.getByRole('button', { name: 'Ver mi resultado', exact: true }).click();
  await expect(page.locator('h1')).toContainText('Tu ruta empieza por');
}

test('el diagnóstico v6 llega al resultado y guarda con reintento', async ({ page }) => {
  await installSupabaseStub(page, { authenticated: true, failFirstDiagnostic: true });
  await completeCurrentDiagnostic(page);

  await page.getByRole('button', { name: 'Empezar mi primera lección' }).click();
  await expect(page.getByRole('heading', { name: 'Tu primera lección: Tasas, bancos y tu bolívar' })).toBeVisible();

  await expect.poll(async () => page.evaluate(() =>
    window.__priorDb.successes.filter(x => x.table === 'diagnostico_resultados').length
  )).toBe(1);
  const attempts = await page.evaluate(() =>
    window.__priorDb.attempts.filter(x => x.table === 'diagnostico_resultados').length
  );
  expect(attempts).toBe(2);
});

test('la portada cabe en el viewport móvil sin desplazamiento horizontal', async ({ page }) => {
  await installSupabaseStub(page);
  await page.goto('/');
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  await expect(page.locator('h1')).toHaveText('El futuro se practica.');
});
