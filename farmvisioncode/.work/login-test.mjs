import { chromium } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/login");
await page.fill("#email", "admin@farmvision.local");
await page.fill("#password", "gSmV25ciYisf-Fv1");
await page.click("button[type=submit]");
await page.waitForURL("**/dashboard", { timeout: 15000 });
await page.waitForTimeout(2000);
console.log("landed on", page.url());
const cookies = await page.context().cookies();
console.log("session cookie set:", cookies.some((c) => c.httpOnly));
await browser.close();
