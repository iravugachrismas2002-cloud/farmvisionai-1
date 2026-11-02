export async function GET() {
  try {
    const baselines = [
      {
        id: "bl-1",
        farmId: "farm-1",
        parameter: "TEMPERATURE",
        baselineValue: 25.5,
        upperThreshold: 31,
        lowerThreshold: 19,
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "bl-2",
        farmId: "farm-1",
        parameter: "HUMIDITY",
        baselineValue: 68,
        upperThreshold: 80,
        lowerThreshold: 55,
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: "bl-3",
        farmId: "farm-1",
        parameter: "FEED_CONSUMPTION",
        baselineValue: 42,
        upperThreshold: 55,
        lowerThreshold: 30,
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: "bl-4",
        farmId: "farm-2",
        parameter: "WATER_CONSUMPTION",
        baselineValue: 61,
        upperThreshold: 78,
        lowerThreshold: 44,
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: "bl-5",
        farmId: "farm-2",
        parameter: "TEMPERATURE",
        baselineValue: 23.8,
        upperThreshold: 30,
        lowerThreshold: 18,
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
    ];

    return Response.json({ baselines });
  } catch (error) {
    return Response.json({ error: "Failed to fetch baselines" }, { status: 500 });
  }
}
