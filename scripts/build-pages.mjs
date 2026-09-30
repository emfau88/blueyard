import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Optional static target; the existing local Vinext/Worker workflow is unchanged.
const result = spawnSync(process.execPath, [
  require.resolve("next/dist/bin/next"), "build", "--webpack",
], {
  stdio: "inherit",
  env: { ...process.env, GITHUB_PAGES: "true", NEXT_TELEMETRY_DISABLED: "1",
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "/blueyard" },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
