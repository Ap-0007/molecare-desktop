# Contributing to MoleCare Desktop

Thanks for being here. This is a small Electron shell — about 700 lines of main
process code — so it is an approachable codebase.

## Electron security rules that are not negotiable

This app runs with access to the user's filesystem and OS keychain, and it
handles personal health data. A mistake here is worse than a mistake in a web
page, because the blast radius includes the machine.

**Do not weaken any of these:**

| Setting | Why |
|---|---|
| `contextIsolation: true` | Without it, page code can reach into Electron internals |
| `nodeIntegration: false` | Node in the renderer means a page script can read and write files |
| `webSecurity: true` | Disabling it turns off the same-origin policy |
| The CSP in `main.js` | Applied to every response; loosening it widens what a compromised page can reach |

**Do not add new IPC handlers that take a path from the renderer and act on it.**
That is the classic Electron path-traversal hole. If a feature genuinely needs
it, open an issue and let us work out the validation together.

**Keep the preload bridge narrow.** `preload.js` is the entire attack surface
between page code and the main process. Expose specific named functions, never
a whole module and never `ipcRenderer` itself.

External links must open through `shell.openExternal`, never in an app window.

## Health data rules

- Auth tokens go through `safeStorage` (macOS Keychain, Windows DPAPI). Never
  write them to plain disk, a log file, or `electron-store` unencrypted.
- **Never log user content.** `electron-log` writes to disk. Mole photographs,
  email addresses and tokens must not reach it.
- Never attach a real skin photograph or real account data to an issue or pull
  request. Use synthetic data or describe the problem.

## Nothing here gives medical advice

The desktop shell should not add health guidance of its own — no notification
copy that judges urgency, no tray tooltip that interprets a result. It renders
the web app and stays out of the way.

## Getting set up

```bash
git clone https://github.com/MoleCare/molecare-webapp.git
git clone https://github.com/MoleCare/molecare-desktop.git
cd molecare-desktop && npm install
npm run build:webapp
npm run dev
```

Node 20+. You do not need signing credentials to build or test — unsigned
builds work fine.

## Before opening a pull request

- [ ] `npm run pack` completes
- [ ] The app launches and loads the renderer
- [ ] No Electron security setting weakened
- [ ] No new IPC handler that trusts renderer-supplied paths
- [ ] Nothing added to `preload.js` beyond what the feature needs
- [ ] No user content written to logs
- [ ] No credentials, signing material, or real user data added

Say in the PR which platforms you tested on. Most contributors have one — that
is fine, just say which.

## Reporting security issues

Do **not** open a public issue. See [SECURITY.md](./SECURITY.md).

## Licence

By contributing you agree that your contributions are licensed under the
[Apache-2.0 licence](./LICENSE).
