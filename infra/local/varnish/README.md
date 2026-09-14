# Local Varnish policy

`default.vcl` supplies the local Docker backend and loads `policy.vcl`. The policy mirrors the production newsroom VCL: it removes cookies, assigns a seven-day default TTL, keys objects by hostname and URL, tags them by newsroom UUID and theme, and supports the production `BAN` and `PURGE` contract.

Application response headers still apply. In particular, Varnish's built-in policy turns `private`, `no-cache`, and `no-store` responses into hit-for-miss objects after the production policy sets its TTL. This local setup preserves that behavior so it can expose differences between the VCL's intended TTL and what a theme actually allows Varnish to store.

Validate the policy without the application or a live API:

```sh
scripts/test-varnish
```
