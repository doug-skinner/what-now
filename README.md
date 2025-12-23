# what-now

## Development tools

This project uses Biome for formatting and linting, and Lefthook to run formatting before commits and lint checks before pushes.

- **Format files**: `npm run format` (runs `biome format` and writes changes)
- **Run lint checks**: `npm run lint` (runs `biome check`)
- **Install git hooks locally**: `npx lefthook install`

Pre-commit will auto-run `biome format` on files under `src/` and rewrite them. Pre-push runs `biome check` to ensure linting passes before pushing.

If you need to bypass hooks for a commit, use `git commit --no-verify`.

A toolset designed to help developers decide what to work on next
