// Local preview without secrets: starts the Airtable stub, then `next dev`
// pointed at it. Usage: npm run dev:preview
import { spawn } from "node:child_process";
import "./dev-airtable-stub.mjs";

spawn("npx", ["next", "dev", "-p", process.env.PORT || "3000"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    AIRTABLE_API_ROOT: "http://localhost:4010/v0",
    AIRTABLE_PAT: "stub",
    AIRTABLE_BASE_ID: "stub",
  },
}).on("exit", (code) => process.exit(code ?? 0));
