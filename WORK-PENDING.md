# Work Pending

## Bugs

(none known)

## Fixes Needed

- No test framework configured (no unit, integration, or e2e tests)
- No linter/formatter configured (consider Biome — single tool for both)
- MockDataStore is in-memory only; data resets on every page load/server restart
- No authentication or authorization (all routes are public)
- No real-time updates — queue positions require manual refresh or polling
- No error boundaries in Preact components (runtime errors crash the island)
- Pre-commit hook only runs `astro check`; full build verification not gated

## Planned Features

(none scheduled)
