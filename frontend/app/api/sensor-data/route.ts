export async function GET() {
  try {
    const now = Date.now();
    const sensorData = Array.from({ length: 12 }, (_, i) => {
      const at = new Date(now - (11 - i) * 15 * 60000).toISOString();
      return {
        id: `sd-${i + 1}`,
        deviceId: i % 3 === 0 ? "device-1" : i % 3 === 1 ? "device-2" : "device-3",
        timestamp: at,
        temperatureC: Number((24 + Math.sin(i / 2) * 3.5).toFixed(1)),
        humidityPercent: Number((68 + Math.cos(i / 3) * 8).toFixed(1)),
        feedLevelPercent: Number((72 - i * 1.4).toFixed(1)),
        waterLevelPercent: Number((81 - i * 1.1).toFixed(1)),
        feedWeightGrams: Number((1450 - i * 35).toFixed(0)),
        messageId: `msg-${9000 + i}`,
        source: i % 4 === 0 ? "HARDWARE" : "SIMULATOR",
      };
    });

    return Response.json({ sensorData });
  } catch (error) {
    return Response.json({ error: "Failed to fetch sensor data" }, { status: 500 });
  }
}
