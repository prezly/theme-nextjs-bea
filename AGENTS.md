# Local environment

- T3 copies `.env` from the primary checkout after creating a worktree. It never overwrites an existing worktree file.
- Start containers only when a task needs a browser, live application, or cache test. Use the T3 development or production-like action, or run `scripts/bea-env up --development` or `scripts/bea-env up --production`.
- Read `ENVIRONMENT_URLS.md` after startup instead of guessing the worktree hostname or port.
- The request path is Caddy to nginx to Varnish to Next.js. The app must receive newsroom runtime configuration through nginx's `X-Prezly-Env` header. Never mount `.env` into the app or add it as the app service's `env_file`.
- Use `scripts/bea-env ps`, `scripts/bea-env logs [service]`, and `scripts/bea-env exec <service> <command...>` to inspect an environment.
- Stop preserves containers. Destroy removes the worktree Compose project, its volumes, generated header, and gateway route.
- Run `node scripts/test-render-prezly-env.mjs`, `scripts/test-bea-env`, and `scripts/test-varnish` after changing local environment behavior.
