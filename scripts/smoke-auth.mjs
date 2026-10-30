// Local smoke test: register -> verify -> approve -> login -> cleanup.
// Requires the dev server running (npm run dev) and frontend/.env configured.
// Creates a throwaway user in the configured database and deletes it afterwards.
import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

const require = createRequire(new URL("../backend/package.json", import.meta.url));
require("dotenv").config({ path: fileURLToPath(new URL("../frontend/.env", import.meta.url)), quiet: true });
const { Client } = require("pg");

const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const headers = { "content-type": "application/json", origin: base };
const email = `smoke-${randomBytes(4).toString("hex")}@example.test`;
const password = `Smoke-${randomBytes(8).toString("hex")}`;

const db = new Client({ connectionString: process.env.DATABASE_URL });
await db.connect();

const post = async (path, body) => {
  const res = await fetch(base + path, { method: "POST", headers, body: JSON.stringify(body) });
  return { status: res.status, body: await res.json().catch(() => ({})) };
};
const step = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` - ${detail}` : ""}`);
  if (!ok) process.exitCode = 1;
  return ok;
};

try {
  const reg = await post("/api/auth/register", { firstName: "Smoke", lastName: "Test", email, password });
  if (!step("register", reg.status === 201, `status ${reg.status}`)) throw new Error(JSON.stringify(reg.body));

  const early = await post("/api/auth/login", { email, password });
  step("login blocked before verification/approval", early.status >= 400, `status ${early.status}`);

  const token = reg.body.verificationToken
    ?? (await db.query('select "verificationToken" t from "User" where email=$1', [email])).rows[0].t;
  const ver = await post("/api/auth/verify-email", { token });
  step("verify email", ver.status === 200, `status ${ver.status}`);

  await db.query('update "User" set "approvalStatus"=$1 where email=$2', ["APPROVED", email]);
  const login = await post("/api/auth/login", { email, password });
  step("login after approval", login.status === 200, `status ${login.status}`);
} catch (error) {
  step("smoke test", false, String(error?.message ?? error));
} finally {
  await db.query('delete from "User" where email=$1', [email]);
  await db.end();
  console.log("cleanup done");
}
