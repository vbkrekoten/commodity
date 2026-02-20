# Сайт Товарной биржи (MVP Monorepo)

Production-ready monorepo (MVP skeleton + working API/DB integration) на `pnpm workspaces`.

## Stack
- Frontend: Next.js App Router, TypeScript, Tailwind, shadcn-style UI, react-hook-form + zod
- Backend: NestJS, Prisma, Swagger
- DB: PostgreSQL
- Cache: Redis
- Storage: MinIO (S3)
- Dev Email: Mailhog
- Tests: Jest (api), Playwright smoke (web)
- CI: GitHub Actions (`lint + test + build`)

## Repo structure
- `apps/web` — SSR сайт + кабинет + админка
- `apps/api` — backend API `/api/v1`, swagger `/api/docs`
- `packages/ui` — общие UI-компоненты
- `packages/config` — base config
- `docker-compose.yml` — postgres/redis/minio/mailhog

## Quick start
1. Установить зависимости:
   ```bash
   pnpm install
   ```
2. Поднять инфраструктуру:
   ```bash
   docker compose up -d
   ```
3. Применить миграции и seed:
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```
4. Запустить web + api:
   ```bash
   pnpm dev
   ```

## Useful commands
```bash
pnpm build
pnpm lint
pnpm test
pnpm e2e
pnpm db:migrate
pnpm db:seed
```

## URLs
- Web: http://localhost:3000
- API: http://localhost:4000/api/v1
- Swagger: http://localhost:4000/api/docs
- Mailhog UI: http://localhost:8025
- MinIO API: http://localhost:9000
- MinIO Console: http://localhost:9001

## Demo accounts
- `admin@example.com / Admin123!`
- `owner@example.com / Admin123!`
- `trader@example.com / Admin123!`
- `compliance@example.com / Admin123!`
- `viewer@example.com / Admin123!`

## Реализовано в MVP
- Публичные SSR страницы: `/`, `/markets`, `/markets/[slug]`, `/prices`, `/indices`, `/indices/[slug]`, `/how-to-start`, `/docs`, `/support`, `/news`, `/news/[slug]`, `/about`, `/search`
- SEO: metadata, `sitemap.xml`, `robots.txt`
- Кабинет `/cabinet/*`: auth, dashboard, onboarding, org, users, otc, reports, api keys, notifications, tickets, audit
- Админка `/cabinet/admin/*`: organizations, markets, docs, news, tickets, audit
- Auth: register/login/logout/forgot/reset, JWT access+refresh cookies, RBAC
- Files: MinIO presign + confirm
- Search: `/api/v1/search`
- OTC: CRUD + import/export CSV
- Tickets: CRUD + messages
- API keys: create/list/revoke (hash-only storage)
- Audit log + Swagger

## Seed data
- 7 рынков: wheat, corn, soy, sunflower-meal, sunflower-seed, sunflower-oil, pork-half-carcass
- contract specs по каждому рынку
- 90 дней `price_points` и `index_points`
- 10 документов
- 10 новостей
- admin + demo org + users разных ролей

## Контент через админку
- Войти как `admin@example.com`
- Разделы:
  - `/cabinet/admin/markets` — создать рынок
  - `/cabinet/admin/docs` — создать документ/версию
  - `/cabinet/admin/news` — создать новость
  - `/cabinet/admin/organizations` — approve/reject компаний

## TODO для боевой интеграции
- Подключение реального торгового движка и клиринга
- ЭДО/КЭП, workflow юридически значимого документооборота
- Интеграции с внешними реестрами и санкционными проверками
- Продвинутый полнотекстовый поиск и ранжирование
- Отдельный worker/queue (BullMQ) для тяжёлых фоновых задач
- Real-time нотификации (websocket) и полноценный notification center
- Секреты/ротация ключей через vault
