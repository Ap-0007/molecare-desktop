# Security Policy

## Reporting a vulnerability

**Do not open a public GitHub issue.** Email **info@molecare.co.uk** with what
the issue is, how to reproduce it, and what an attacker could do with it. You
should get an acknowledgement within **3 working days**, and credit in the
release notes unless you would rather not have it.

## Why this repository matters more than a web app

A desktop app runs with the user's own privileges. A renderer escape here does
not stop at the browser tab — it reaches the filesystem and, potentially, the
OS keychain where auth tokens live.

Vulnerabilities we are particularly interested in:

- **Renderer-to-main escapes** — anything that lets page code reach Electron or
  Node APIs it should not
- **IPC handlers that trust the renderer** — path traversal through a
  filename passed over IPC is the classic case
- **Preload bridge over-exposure** — a function in `preload.js` that hands the
  renderer more capability than intended
- **CSP bypasses** in the policy applied by `main.js`
- **Token exposure** — anything that puts a `safeStorage` value into a log
  file, crash dump, or plain-text store
- **Update channel weaknesses** — anything that could get an unsigned or
  substituted update installed

## Out of scope

- Missing code signing on a locally built artefact. Unsigned local builds are
  expected; release builds are signed separately.
- Findings that require an attacker to already have local access to an
  unlocked machine.

Issues in the web front end itself belong with
[molecare-webapp](https://github.com/MoleCare/molecare-webapp), though we are
happy to route them.

## Data safety

Never attach a real skin photograph, real account data, or a token to a report.
If you need to demonstrate an issue involving user content, describe it or use
obviously synthetic data.
