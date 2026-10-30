// Create (or reset) a verified + approved local user so you can sign in without email.
//
// Usage:
//   node scripts/dev-user.mjs <email> [--admin] [--name "First Last"] [--password <pw>]
//
// A strong password is generated and printed when --password is omitted.
// Writes to the database configured in frontend/.env. Intended for local development.
import { createRequire } from "node:module";
import { randomBytes, scrypt } from "node:crypto";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const require = createRequire(new URL("../backend/package.json", import.meta.url));
require("dotenv").config({ path: fileURLToPath(new URL("../frontend/.env", import.meta.url)), quiet: true });
const { Client } = require("pg");
const scryptAsync = promisify(scrypt);

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const email = args.find((a) => a.includes("@"))?.trim().toLowerCase();
if (!email) {
  console.error('Usage: node scripts/dev-user.mjs <email> [--admin] [--name "First Last"] [--password <pw>]');
  process.exit(1);
}
const isAdmin = args.includes("--admin");
const name = flag("--name") ?? (isAdmin ? "Local Admin" : "Local User");
const password = flag("--password") ?? randomBytes(9).toString("base64url") + "-Fv1";
if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const passwordHash = `${salt}:${(await scryptAsync(password, salt, 64)).toString("hex")}`;

const db = new Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
try {
  await db.query("begin");
  const existing = await db.query('select id from "User" where email = $1', [email]);
  let id = existing.rows[0]?.id;
  if (id) {
    await db.query(
      `update "User" set "passwordHash" = $2, "emailVerified" = now(), "approvalStatus" = 'APPROVED',
         "verificationToken" = null, "passwordResetToken" = null, "updatedAt" = now() where id = $1`,
      [id, passwordHash],
    );
  } else {
    id = (
      await db.query(
        `insert into "User" (id, "openId", name, email, "passwordHash", "emailVerified", "approvalStatus", "updatedAt")
         values (gen_random_uuid(), $1, $2, $3, $4, now(), 'APPROVED', now()) returning id`,
        [randomBytes(16).toString("hex"), name, email, passwordHash],
      )
    ).rows[0].id;
  }
  for (const role of isAdmin ? ["FARMER", "ADMINISTRATOR"] : ["FARMER"]) {
    await db.query(
      'insert into "UserRole" ("userId", role) values ($1, $2::"FarmVisionRole") on conflict do nothing',
      [id, role],
    );
  }
  await db.query("commit");
  console.log(`${existing.rows[0] ? "Updated" : "Created"} ${isAdmin ? "administrator" : "farmer"} account`);
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);
} catch (error) {
  await db.query("rollback");
  console.error("Failed:", error.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
