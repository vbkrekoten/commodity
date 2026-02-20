import { expect, test } from '@playwright/test';

test('register -> login -> create ticket -> create otc -> open reports', async ({ page }) => {
  const ts = Date.now();
  const email = `smoke-${ts}@example.com`;

  await page.goto('/cabinet/register');
  await page.getByPlaceholder('ФИО').fill('Smoke User');
  await page.getByPlaceholder('Организация').fill(`Smoke Org ${ts}`);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Пароль').fill('Admin123!');
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

  await page.goto('/cabinet/login');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Пароль').fill('Admin123!');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/cabinet/support/tickets');
  await page.getByPlaceholder('Тема').fill('Smoke ticket');
  await page.getByPlaceholder('Категория').fill('general');
  await page.getByPlaceholder('Сообщение').fill('Need support');
  await page.getByRole('button', { name: 'Создать тикет' }).click();

  await page.goto('/cabinet/otc-deals');
  await page.getByPlaceholder('Рынок').fill('wheat');
  await page.getByPlaceholder('Объем').fill('10');
  await page.getByPlaceholder('Цена').fill('12000');
  await page.locator('input[type="date"]').fill('2026-01-01');
  await page.getByRole('button', { name: 'Добавить сделку' }).click();

  await page.goto('/cabinet/reports');
  await expect(page.getByText('Отчеты')).toBeVisible();
});
