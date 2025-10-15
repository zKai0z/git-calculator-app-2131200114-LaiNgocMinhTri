# Calculator App (Pro Structure)

A cleanly organized Electron app with separated **main**, **preload**, **renderer**, and **shared** layers.

## Scripts
- `npm start` – run the app
- `npm test` – run unit tests (Jest)
- `npm run build` – package the app for macOS/Windows/Linux (electron-builder)

## Structure
```
src/
  main/       # Electron Main process
  preload/    # contextBridge: exposes safe APIs
  renderer/   # UI (DOM, CSS, HTML)
  shared/     # Pure logic (no DOM)
tests/         # Unit tests
assets/        # Static assets (icons, etc.)
```