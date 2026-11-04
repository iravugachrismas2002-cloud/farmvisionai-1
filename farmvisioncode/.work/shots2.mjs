import { chromium } from "../node_modules/playwright/index.mjs";

const browser = await chromium.launch({ channel: "msedge" });
const base = "http://localhost:3000";
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const route of ["dashboard", "farms", "livestock", "alerts"]) {
  const res = await page.goto(`${base}/${route}`);
  await page.waitForTimeout(1800);
  console.log(route, res?.status(), page.url());
  await page.screenshot({ path: `.work/shots/${route}.png` });
}
await browser.close();
