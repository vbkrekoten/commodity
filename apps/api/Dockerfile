FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm --filter @apps/api exec prisma generate
RUN pnpm --filter @apps/api build

EXPOSE 10000
CMD ["sh", "-c", "pnpm --filter @apps/api prisma:migrate && pnpm --filter @apps/api start"]
