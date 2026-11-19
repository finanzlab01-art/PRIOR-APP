import { test, expect } from '@playwright/test';

test('diagnóstico v5 y guardado local de un concepto', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('El futuro se practica.');
  await page.locator('.saltar').click();
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();

  // Mini perfil: edad, moneda y fondo de emergencia.
  for (const respuesta of ['25 a 34', 'Bolívares', 'No cuento con uno']) {
    await page.locator('.opcion').first().waitFor({ state: 'visible' });
    await page.getByRole('button', { name: respuesta, exact: true }).click();
  }

  // Las once situaciones del diagnóstico v5.
  for (let i = 0; i < 11; i++) {
    const opcion = page.locator('.opcion').first();
    await opcion.waitFor({ state: 'visible' });
    await opcion.click();
    if (i < 10) {
      await expect(opcion).toBeDisabled();
      await expect(opcion).not.toBeAttached({ timeout: 20000 });
      await page.locator('.opcion').first().waitFor({ state: 'visible', timeout: 20000 });
    } else {
      await expect(page.getByText('¿Qué nivel de seguridad tienes sobre tu respuesta?')).toBeVisible({ timeout: 20000 });
      await page.locator('.opcion:not(:disabled)').last().click();
    }
  }
  await expect(page.locator('h1')).toContainText('Tu ruta empieza por', { timeout: 15000 });
  await page.getByRole('button', { name: 'Empezar mi primera lección' }).click();
  await page.locator('.saltar').click();
  await page.getByRole('button', { name: 'Empezar la lección' }).click();

  // Primera decisión y predicción; se llega al concepto de la segunda pantalla.
  await page.locator('.saltar').click();
  await page.locator('.opcion').first().click();
  await expect(page.getByText(/En tres meses/)).toBeVisible({ timeout: 20000 });
  await page.locator('.opcion').first().click();
  await expect(page.getByRole('heading', { name: 'Ilusión monetaria' })).toBeVisible({ timeout: 20000 });
  await page.getByRole('button', { name: 'Guardar en mi biblioteca' }).click();
  await page.getByRole('button', { name: 'Ver mi biblioteca' }).click();
  await expect(page.getByRole('heading', { name: 'Mi biblioteca' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ilusión monetaria' })).toBeVisible();
});

test('la portada cabe en el viewport sin desplazamiento horizontal', async ({ page }) => {
  await page.goto('/');
  const dimensiones = await page.evaluate(() => ({
    anchoDocumento: document.documentElement.scrollWidth,
    anchoViewport: document.documentElement.clientWidth
  }));
  expect(dimensiones.anchoDocumento).toBeLessThanOrEqual(dimensiones.anchoViewport);
  await expect(page.locator('h1')).toHaveText('El futuro se practica.');
});
