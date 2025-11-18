# Install dependencies only when needed
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm
RUN corepack prepare pnpm@9.15.4 --activate
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN corepack enable pnpm
RUN corepack prepare pnpm@9.15.4 --activate
RUN --mount=type=secret,id=NEXT_PUBLIC_HCAPTCHA_SITEKEY \
    --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    --mount=type=secret,id=NEXT_PUBLIC_SENTRY_DSN \
    export NEXT_PUBLIC_HCAPTCHA_SITEKEY=$(cat /run/secrets/NEXT_PUBLIC_HCAPTCHA_SITEKEY) && \
    export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) && \
    export NEXT_PUBLIC_SENTRY_DSN=$(cat /run/secrets/NEXT_PUBLIC_SENTRY_DSN) && \
    export NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=97775dfb0ac5a6446bce && \
    export NEXT_PUBLIC_UPLOADCARE_CUSTOM_CDN_DOMAIN=cdn.uc.assets.prezly.com && \
    export SENTRY_ORG="prezly" && \
    export SENTRY_PROJECT="themes-nextjs" && \
    pnpm build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=97775dfb0ac5a6446bce \
    NEXT_PUBLIC_UPLOADCARE_CUSTOM_CDN_DOMAIN=cdn.uc.assets.prezly.com \
    NODE_OPTIONS='-r next-logger'
# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/ .

RUN apk update \
    && apk upgrade \
    && rm -rf /var/cache/apk/*

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# RUN npx next telemetry disable

CMD ["node_modules/.bin/next", "start"]
