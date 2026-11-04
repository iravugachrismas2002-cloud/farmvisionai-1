import { chromium } from "../node_modules/playwright/index.mjs";

const out = process.argv[2] ?? "dashboard";
const browser = await chromium.launch({ channel: "msedge" });
const base = "http://localhost:3000";

// 1) unauthenticated -> must redirect to /login
const anon = await browser.newPage();
await anon.goto(base + "/dashboard");
await anon.waitForTimeout(1500);
console.log("anonymous /dashboard ->", new URL(anon.url()).pathname);

// 2) sign in through the UI
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/login");
await page.fill("#email", "admin@farmvision.local");
await page.fill("#password", "gSmV25ciYisf-Fv1");
await page.click("button[type=submit]");
await page.waitForURL("**/dashboard", { timeout: 20000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: `.work/shots/${out}.png` });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.context().addCookies(await page.context().cookies());
await mobile.goto(base + "/dashboard");
await mobile.waitForTimeout(2000);
await mobile.screenshot({ path: `.work/shots/${out}-mobile.png`, fullPage: true });
await browser.close();
