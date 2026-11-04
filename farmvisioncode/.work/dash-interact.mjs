import { chromium } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch({ channel: "msedge" });
const base = "http://localhost:3000";
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/login");
await page.fill("#email", "admin@farmvision.local");
await page.fill("#password", "gSmV25ciYisf-Fv1");
await page.click("button[type=submit]");
await page.waitForURL("**/dashboard");
await page.waitForTimeout(2000);

// user menu
await page.click("[data-sidebar=footer] button");
await page.waitForTimeout(500);
await page.screenshot({ path: ".work/shots/user-menu.png" });
await page.keyboard.press("Escape");

// collapse to icons
await page.click("[data-sidebar=trigger]");
await page.waitForTimeout(600);
await page.screenshot({ path: ".work/shots/collapsed.png" });

// mobile drawer
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.context().addCookies(await page.context().cookies());
await m.goto(base + "/dashboard");
await m.waitForTimeout(1500);
await m.screenshot({ path: ".work/shots/m-dash.png", fullPage: true });
await m.click("[data-sidebar=trigger]");
await m.waitForTimeout(600);
await m.screenshot({ path: ".work/shots/m-drawer.png" });

// sign out via the menu
await page.click("[data-sidebar=trigger]");
await page.click("[data-sidebar=footer] button");
await page.getByText("Sign out").click();
await page.waitForURL("**/login", { timeout: 10000 });
console.log("signed out ->", new URL(page.url()).pathname);
await page.goto(base + "/dashboard");
await page.waitForTimeout(1200);
console.log("after sign-out /dashboard ->", new URL(page.url()).pathname);
await browser.close();
