## What does this change?

## Related issue

<!-- Fixes #123 -->

## Checklist

- [ ] `npm run pack` completes
- [ ] The app launches and loads the renderer
- [ ] No Electron security setting weakened (contextIsolation, nodeIntegration, webSecurity, CSP)
- [ ] No new IPC handler that trusts a renderer-supplied path
- [ ] Nothing added to `preload.js` beyond what this needs
- [ ] No user content written to logs
- [ ] No credentials, signing material, or real user data added

## Platforms tested

<!-- macOS / Windows / Linux — one is fine, just say which -->
