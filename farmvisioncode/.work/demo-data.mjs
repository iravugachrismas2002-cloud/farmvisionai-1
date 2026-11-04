// Temporary demo data for visually checking the dashboard.
//   node .work/demo-data.mjs seed | clean
// Everything is tagged with the marker "ZZ-DEMO" and removed by `clean` (farm delete cascades).
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(new URL("../backend/package.json", import.meta.url));
require("dotenv").config({ path: fileURLToPath(new URL("../frontend/.env", import.meta.url)), quiet: true });
const { Client } = require("pg");

const db = new Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
const mode = process.argv[2];
const owner = (await db.query(`select id from "User" where email='admin@farmvision.local'`)).rows[0].id;

try {
  if (mode === "seed") {
    const farm = (await db.query(
      `insert into "Farm" (id,"ownerId",name,"locationLabel","updatedAt") values (gen_random_uuid(),$1,'ZZ-DEMO Green Valley Farm','Musanze',now()) returning id`, [owner])).rows[0].id;
    const mk = async (pid, name, minsAgo, state) => {
      const seen = minsAgo === null ? null : new Date(Date.now() - minsAgo * 60000);
      const id = (await db.query(
        `insert into "Device" (id,"farmId","publicId",name,"credentialHash",source,"lastSeenAt") values (gen_random_uuid(),$1,$2,$3,$4,'HARDWARE',$5) returning id`,
        [farm, pid, name, pid.padEnd(64, "0").slice(0, 64), seen])).rows[0].id;
      if (state) await db.query(
        `insert into "DeviceState" ("deviceId","observedAt",source,"temperatureC","humidityPercent","feedLevelPercent","waterLevelPercent","updatedAt") values ($1,$2,'HARDWARE',$3,$4,$5,$6,now())`,
        [id, seen, ...state]);
      return id;
    };
    const barn = await mk("zz-demo-barn", "ZZ-DEMO Barn A sensor", 3, [31.4, 68, 55, 82]);
    const tank = await mk("zz-demo-tank", "ZZ-DEMO Water tank", 240, [null, null, null, 14]);
    await mk("zz-demo-new", "ZZ-DEMO Spare device", null, null);
    const alert = (device, type, sev, status, title, reason, obs, thr, unit, mins) => db.query(
      `insert into "Alert" (id,"deviceId",type,severity,status,title,reason,"suggestedAction","observedValue","thresholdValue",unit,"firstTriggeredAt","lastTriggeredAt","updatedAt") values (gen_random_uuid(),$1,$2,$3,$4,$5,$6,'Check the device',$7,$8,$9,$10,$10,now())`,
      [device, type, sev, status, title, reason, obs, thr, unit, new Date(Date.now() - mins * 60000)]);
    await alert(barn, "HIGH_TEMPERATURE", "CRITICAL", "OPEN", "High temperature in Barn A", "Temperature 31.4 °C exceeds the 30 °C threshold.", 31.4, 30, "°C", 12);
    await alert(tank, "WATER_LOW", "WARNING", "OPEN", "Low water level", "Water level 14% is below the 20% threshold.", 14, 20, "%", 190);
    await alert(barn, "FEED_LOW", "INFO", "ACKNOWLEDGED", "Feed level getting low", "Feed level 55% is trending down.", 55, 60, "%", 600);
    console.log("seeded");
  } else if (mode === "clean") {
    const r = await db.query(`delete from "Farm" where name like 'ZZ-DEMO%' and "ownerId"=$1`, [owner]);
    console.log("removed farms:", r.rowCount);
  }
} finally {
  await db.end();
}
