FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

ARG NEXT_PUBLIC_API_URL=https://commodity-api.onrender.com/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm --filter @apps/web build

EXPOSE 10000
CMD ["pnpm", "--filter", "@apps/web", "start"]
