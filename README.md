# what-now

## Development tools

This project uses Biome for formatting and linting, and Lefthook to run formatting before commits and lint checks before pushes.

- **Format files**: `npm run format` (runs `biome format` and writes changes)
- **Run lint checks**: `npm run lint` (runs `biome check`)
- **Install git hooks locally**: `npx lefthook install`

Pre-commit will auto-run `biome format` on files under `src/` and rewrite them. Pre-push runs `biome check` to ensure linting passes before pushing.

If you need to bypass hooks for a commit, use `git commit --no-verify`.

A toolset designed to help developers decide what to work on next

## Examples

Set your GitHub token (used for API requests):

```bash
what-now set-token <your_github_token>
```

Show the currently configured token:

```bash
what-now get-token
```

Set the repos the CLI will act against (comma-separated):

```bash
what-now set-repos username/repo-name,username/repo-name2
```

Show configured repos and parsed list:

```bash
what-now get-repos
```

## Output styling

Console messages are colorized with Chalk to make statuses easy to scan:

- Success confirmations appear in green.
- Informational details appear in cyan.
- Warnings appear in yellow.
- Errors appear in red.

Examples of valid repo strings:

- dougskinner/what-now
- octocat/hello-world,another-user/some-repo
