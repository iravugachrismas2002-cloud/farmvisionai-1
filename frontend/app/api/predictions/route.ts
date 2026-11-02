export async function GET() {
  try {
    const predictions = [
      {
        id: "pred-1",
        deviceId: "device-1",
        type: "FEED_DEPLETION",
        severity: "CRITICAL",
        predictedAt: new Date(Date.now() + 6 * 3600000).toISOString(),
        message: "Feed trough projected to empty within 6 hours at the current consumption rate.",
        confidence: 0.92,
      },
      {
        id: "pred-2",
        deviceId: "device-3",
        type: "WATER_DEPLETION",
        severity: "WARNING",
        predictedAt: new Date(Date.now() + 14 * 3600000).toISOString(),
        message: "Water reservoir likely to drop below the refill threshold overnight.",
        confidence: 0.78,
      },
      {
        id: "pred-3",
        deviceId: "device-2",
        type: "TEMPERATURE_EXTREME",
        severity: "WARNING",
        predictedAt: new Date(Date.now() + 3 * 3600000).toISOString(),
        message: "Afternoon temperature expected to exceed the 31°C upper threshold.",
        confidence: 0.85,
      },
      {
        id: "pred-4",
        deviceId: "device-1",
        type: "HUMIDITY_ISSUE",
        severity: "INFO",
        predictedAt: new Date(Date.now() + 20 * 3600000).toISOString(),
        message: "Humidity forecast to settle back inside the baseline band by morning.",
        confidence: 0.64,
      },
    ];

    return Response.json({ predictions });
  } catch (error) {
    return Response.json({ error: "Failed to fetch predictions" }, { status: 500 });
  }
}
