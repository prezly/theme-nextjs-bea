# Local worktree environment

The local environment runs a Next.js origin behind Varnish and nginx. A shared Caddy gateway provides HTTPS hostnames for this repository and the main Prezly repository.

```text
browser -> Caddy -> nginx -> Varnish -> Next.js
```

Only nginx publishes a worktree-specific HTTP port. Caddy reaches nginx through the shared `prezly-gateway` Docker network. Varnish and Next.js have no published ports.

## Configuration boundary

Create `.env` from `.env.example` and provide at least:

```dotenv
PREZLY_ACCESS_TOKEN=...
PREZLY_NEWSROOM_UUID=...
PREZLY_THEME_UUID=73015107-ac86-418b-9120-4ffa439d5c0f
```

The short-lived `env-renderer` container reads this file and writes a base64 data URI for nginx. nginx replaces every incoming `X-Prezly-Env` header with that value. The Node container does not receive `.env`, `PREZLY_ACCESS_TOKEN`, or `PREZLY_NEWSROOM_UUID` through its filesystem or process environment.

Do not add `.env` as an app `env_file` or mount the repository root into the development container. Either change would let Next.js load the file directly and would break parity with production.

## Starting and stopping

Development mode uses `next dev` with source mounts and polling:

```sh
scripts/bea-env up --development
```

Production-like mode builds the worktree and uses `next start`:

```sh
scripts/bea-env up --production
```

The proxy chain and hostname do not change when switching modes.

```sh
scripts/bea-env ps
scripts/bea-env logs app
scripts/bea-env stop
scripts/bea-env destroy
```

T3 exposes separate start actions for both modes. Its automatic create action copies `.env` from the primary checkout without overwriting an existing worktree file.

## Hostnames

With the default `BEA_ENV_BASE_DOMAIN=app.localhost`, an environment named `t3code-12345678` gets URLs similar to:

```text
http://t3code-12345678.bea.app.localhost:18432
https://t3code-12345678.bea.app.localhost
```

Run the following command once to trust the shared Caddy CA:

```sh
scripts/bea-env host-setup
```

The command supports the macOS login keychain and common Linux trust stores.

## Tailnet-accessible hostnames

Set these values in `.env` to use a public base domain routed to this machine's Tailscale address:

```dotenv
BEA_ENV_BASE_DOMAIN=dev.example.com
BEA_GATEWAY_BIND=100.x.y.z
BEA_ENV_ACME_EMAIL=developer@example.com
```

Create a wildcard DNS record for `*.bea.dev.example.com` that points to the Tailscale address. Store a Cloudflare DNS token at:

```text
~/.local/state/prezly-env/gateway/cloudflare.token
```

The shared gateway builds Caddy with the Cloudflare DNS module and obtains certificates through DNS-01. Access still depends on the machine's Tailscale connectivity and tailnet ACLs.

## Checks

```sh
node scripts/test-render-prezly-env.mjs
scripts/test-bea-env
scripts/test-varnish
scripts/bea-env config --development
scripts/bea-env config --production
```

`scripts/bea-env config` deliberately leaves service env files unresolved so it cannot print the newsroom token.
