# Local worktree environment

The local environment runs a Next.js origin behind Varnish and nginx. A shared Caddy gateway provides HTTPS hostnames for this repository and the main Prezly repository.

```text
browser -> Caddy -> nginx -> Varnish -> Next.js
```

Only nginx publishes a worktree-specific HTTP port. Caddy reaches nginx through the shared `prezly-gateway` Docker network. Varnish and Next.js have no published ports.

## Requirements

The scripts support Linux with Docker Engine and macOS with OrbStack. They require Git, curl, Docker Compose v2, and a running Docker-compatible engine. Every image used by the stack supports both AMD64 and ARM64.

On macOS, install and start OrbStack:

```sh
brew install orbstack
docker context use orbstack
docker info
```

OrbStack supplies the Docker and Compose commands. Run all commands below from the macOS terminal or a T3 action, not from an OrbStack Linux machine.

Check the environment before the first start:

```sh
scripts/bea-env doctor
```

## Configuration boundary

Create `.env` in the primary checkout from `.env.example` and provide at least:

```dotenv
PREZLY_ACCESS_TOKEN=...
PREZLY_NEWSROOM_UUID=...
PREZLY_THEME_UUID=73015107-ac86-418b-9120-4ffa439d5c0f
```

The short-lived `env-renderer` container reads this file and writes a base64 data URI for nginx. nginx replaces every incoming `X-Prezly-Env` header with that value. It also replaces `X-Newsroom-Uuid` and `X-Newsroom-Theme` with trusted values used by the production Varnish cache and purge contract. The Node container does not receive `.env`, `PREZLY_ACCESS_TOKEN`, or `PREZLY_NEWSROOM_UUID` through its filesystem or process environment.

Do not add `.env` as an app `env_file` or mount the repository root into the development container. Either change would let Next.js load the file directly and would break parity with production.

T3 copies the primary checkout's `.env` into each new worktree. It never overwrites a worktree that already has one. The infrastructure options described below belong in the same ignored file.

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
scripts/bea-env test-cache /
scripts/bea-env purge
scripts/bea-env stop
scripts/bea-env destroy
```

T3 exposes separate start actions for both modes. Its automatic create action copies `.env` from the primary checkout without overwriting an existing worktree file.

The available T3 actions are:

- Start Development Environment
- Start Production-like Environment
- Stop Worktree Environment
- Destroy Worktree Environment
- Show Worktree URLs

After startup, read `ENVIRONMENT_URLS.md` for the exact hostname and direct HTTP port. Do not assume that two worktrees use the same port.

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

The command adds the CA to the macOS login keychain or a common Linux trust store. macOS may ask for keychain confirmation. Restart open browsers after it completes.

## Tailnet-accessible hostnames

Set these values in `.env` to use a public base domain routed to this machine's Tailscale address:

```dotenv
BEA_ENV_BASE_DOMAIN=app.homer.prezly.dev
BEA_ENV_ACME_EMAIL=developer@example.com
```

If `tailscale` is available in `PATH`, `bea-env` uses the first address from `tailscale ip -4` as `BEA_GATEWAY_BIND`. Otherwise add it explicitly:

```dotenv
BEA_GATEWAY_BIND=100.x.y.z
```

The Prezly development domain already provides the required `*.bea.app.homer.prezly.dev` DNS record. When using another base domain, create its `*.bea` wildcard record and point it to the Tailscale address. Store a Cloudflare DNS token at:

```text
~/.local/state/prezly-env/gateway/cloudflare.token
```

The shared gateway builds Caddy with the Cloudflare DNS module and obtains certificates through DNS-01. Access still depends on the machine's Tailscale connectivity and tailnet ACLs.

On OrbStack, leave port forwarding enabled. For access from another Tailnet device, also enable **Expose ports to LAN** in OrbStack's Network settings. OrbStack publishes Caddy's ports directly on the selected Tailscale address.

Run `scripts/bea-env doctor` again after adding the public hostname settings. It reports the selected bind address without printing the Cloudflare token or newsroom credentials.

## Cache behavior

Public HTML and React Server Component responses are stored by Varnish. The key contains the hostname and complete URL, including Next.js's `_rsc` parameter. Varnish honors Next.js's `Vary` response header for router-state variants.

Editor preview requests and secret story links bypass the page cache. A newsroom purge clears its HTML and RSC variants together:

```sh
scripts/bea-env test-cache /
scripts/bea-env purge
```

## Checks

```sh
node scripts/test-render-prezly-env.mjs
scripts/test-bea-env
scripts/test-varnish
scripts/bea-env config --development
scripts/bea-env config --production
```

`scripts/bea-env config` deliberately leaves service env files unresolved so it cannot print the newsroom token.
