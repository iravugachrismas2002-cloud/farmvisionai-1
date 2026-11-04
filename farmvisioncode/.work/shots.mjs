import { chromium } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch({ channel: "msedge" });
const base = "http://localhost:3000";

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto(base + "/login");
await desktop.fill("#email", "nobody@example.com");
await desktop.fill("#password", "wrong-password");
await desktop.click("button[type=submit]");
await desktop.waitForSelector("[data-slot=alert]");
await desktop.screenshot({ path: ".work/shots/login-error.png" });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(base + "/register");
await mobile.waitForTimeout(1500);
await mobile.screenshot({ path: ".work/shots/register-mobile.png", fullPage: true });
await mobile.goto(base + "/");
await mobile.waitForTimeout(1500);
await mobile.screenshot({ path: ".work/shots/home-mobile.png", fullPage: true });

await desktop.goto(base + "/");
await desktop.waitForTimeout(1500);
await desktop.screenshot({ path: ".work/shots/home2.png" });
await browser.close();
