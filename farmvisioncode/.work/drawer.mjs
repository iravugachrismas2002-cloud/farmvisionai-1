import { chromium } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch({ channel: "msedge" });
const base = "http://localhost:3000";
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(base + "/login");
await page.fill("#email", "admin@farmvision.local");
await page.fill("#password", "gSmV25ciYisf-Fv1");
await page.click("button[type=submit]");
await page.waitForURL("**/dashboard");
await page.waitForTimeout(2000);
await page.click("[data-sidebar=trigger]");
await page.waitForTimeout(1800);
const info = await page.evaluate(() => {
  const el = document.querySelector("[data-mobile=true]");
  if (!el) return "no mobile sidebar element";
  const cs = getComputedStyle(el);
  const root = getComputedStyle(document.documentElement);
  return {
    bg: cs.backgroundColor,
    hasBgSidebar: el.classList.contains("bg-sidebar"),
    varColorSidebar: root.getPropertyValue("--color-sidebar"),
    varSidebar: root.getPropertyValue("--sidebar"),
    cls: el.className.slice(150),
  };
});
console.log(JSON.stringify(info, null, 1));
await page.screenshot({ path: ".work/shots/m-drawer2.png" });
await browser.close();
