# emfau — Web, Games & Labs

## Direkt testen

**[→ Website öffnen](https://emfau88.github.io/blueyard/)**  
[English version](https://emfau88.github.io/blueyard/en/) · [Build-/Deploy-Status](https://github.com/emfau88/blueyard/actions/workflows/pages.yml)

Öffentliche Entwicklungsvorschau, kein fertiger Kundenauftritt. Bei einem laufenden ersten Build bitte dessen Abschluss abwarten.

## Aktueller Stand

Landingpage für Webdesign, Games und Labs in Deutsch/Englisch. Eigene emfau-Inhalte und eigene Three.js-Effekte; BlueYard ist die visuelle Referenz. Dessen Quellcode und Assets wurden nicht übernommen.

- Durchgehende Scroll-Szene, Loader, Manifest und Bereichsauswahl.
- K2: getrennte Weltbilder und gemeinsame Eingabesteuerung.
- K3: Liquid-Übergang mit Bildverzerrung beider Welten; lokale Desktop- und Mobilprofilprüfung vorhanden.
- Als Nächstes K4 (lokale Partikelreaktion), danach Bulk 8 (räumliche Faserwelt). Genaue Referenz- und Bewegungsabnahme steht noch aus.
- Unterseiten und Kontakt sind teilweise Platzhalter.

[Roadmap mit Checkboxen](ROADMAP.md) · [K3-Prüfprotokoll](docs/correction-k3-verification.md) · [Referenz-Audit](docs/blueyard-reference-audit.md)

## Lokal entwickeln

Node.js 22.13 oder neuer, npm:

```sh
npm run install:ci
npm run dev
```

Die im Terminal ausgegebene lokale Adresse öffnen (Standardport 5173). Lokale Renderprüfung: `?renderDebug=1`; auf der öffentlichen Domain ist sie deaktiviert.

```sh
npm run lint
npm test
npm run build
npm run build:pages
```

`build` behält den vorhandenen Vinext/Worker-Build. `build:pages` erzeugt einen statischen Export in `.next-pages/`, einschließlich DE/EN-Unterseiten und des Basispfads `/blueyard`. Die Three.js-Szene läuft im Browser und benötigt keinen Server.

## GitHub Pages

Der Workflow `.github/workflows/pages.yml` prüft und baut jeden Push auf `main`, danach veröffentlicht er den Export auf GitHub Pages. Pull Requests werden geprüft, aber nicht veröffentlicht. Repository-Einstellung: **Settings → Pages → Source: GitHub Actions**.

Bei Umbenennung des Repositories `NEXT_PUBLIC_BASE_PATH` im Build anpassen und die Links oben aktualisieren. Der Workflow benötigt keine Tokens oder Secrets. Lokale Umgebungsdateien, Tool-Caches, Builds und visuelle BlueYard-Referenzaufnahmen werden nicht eingecheckt.


## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Use it as the durable user key; use email and name for display or contact purposes.

SIWC-authenticated workspace sites may also receive `oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty `name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by `oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use the returned `userId` as the stable user key for user-owned records; do not use email as a durable identifier.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send anonymous visitors through Sign in with ChatGPT.
- In a Server Component, start sign-in with `<a href={chatGPTSignInPath(returnTo)} target="_top">`. The auth helper module is server-only; do not import it into a Client Component.
- Do not use `fetch`, XHR, a client-side router, or a framework link that can prefetch the sign-in route. SIWC must start as a top-level navigation.
- Never request the AuthAPI authorization endpoint directly. The dispatch-owned `/signin-with-chatgpt` route must start the SIWC flow.
- Use `chatGPTSignOutPath(returnTo)` for browser sign-out links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the OAuth cookies, and identity header injection. Do not implement app routes for those reserved paths. Routes that do not import and call the helper remain anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the Sites hosting platform's access policy controls for workspace-wide restrictions, or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write actions tied to the current ChatGPT user. Leave public content anonymous.

## Local D1 migrations

For a D1-backed local preview, generate SQL with `npm run db:generate`. Build once through the Sites skill's build entrypoint (or `npm run build` for standalone use) to generate `dist/server/wrangler.json`, rebuilding if bindings change. From the project root, apply each pending migration in order:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_example.sql
```

Replace the filename with the pending migration and `DB` with your D1 binding name if different. Use `.wrangler/state`, not `.wrangler/state/v3`; Wrangler adds the versioned directories. Do not replay migrations already applied locally. This updates only the preview database; publishing applies production migrations separately.

## Diagnostic Commands

- `npm run install:ci`: perform the one locked dependency install
- `npm run dev`: start the Vite/Vinext development server
- `npm run build`: build the deployable Sites artifact
- `npm run start`: preview the built Worker locally with D1/R2 support
- `npm run db:generate`: generate Drizzle migrations after schema changes

When using the Sites plugin, follow its skill instructions for installation, builds, and publishing. These npm commands remain available for standalone use.

The portable build runs Vinext directly without a host `timeout` command. The managed-linux build uses `scripts/build-verified.sh` and its existing `SITES_BUILD_TIMEOUT` setting.

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
