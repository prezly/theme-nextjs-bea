# Local Varnish policy

`default.vcl` supplies the local Docker backend and loads `policy.vcl`. The policy models the newsroom cache behavior needed by Bea, including the `public-story-404-v1` response contract described in `docs/PUBLIC_NOT_FOUND_CACHE.md`.

This is intentionally a repository-owned local policy, not a claim that the legacy VCL currently checked into the infrastructure repositories is byte-for-byte identical. When the deployed newsroom VCL changes, compare its request normalization, bypass rules, hash inputs, TTLs, invalidation, and delivery-header handling with `policy.vcl`. Keep the local backend definition in `default.vcl`.

Validate the policy without the application or a live API:

```sh
scripts/test-varnish
```
