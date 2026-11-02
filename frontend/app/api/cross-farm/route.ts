export async function GET() {
  try {
    const comparisons = [
      {
        farmId: "farm-1",
        farmName: "Main Farm",
        parameter: "TEMPERATURE",
        currentValue: 27.4,
        farmAverage: 25.9,
        topFarm: "North Field",
        topValue: 23.1,
        percentile: 72,
      },
      {
        farmId: "farm-2",
        farmName: "North Field",
        parameter: "TEMPERATURE",
        currentValue: 23.1,
        farmAverage: 25.9,
        topFarm: "North Field",
        topValue: 23.1,
        percentile: 34,
      },
      {
        farmId: "farm-1",
        farmName: "Main Farm",
        parameter: "HUMIDITY",
        currentValue: 71,
        farmAverage: 67,
        topFarm: "River Plot",
        topValue: 64,
        percentile: 81,
      },
      {
        farmId: "farm-2",
        farmName: "North Field",
        parameter: "FEED",
        currentValue: 64,
        farmAverage: 69,
        topFarm: "Main Farm",
        topValue: 72,
        percentile: 41,
      },
      {
        farmId: "farm-1",
        farmName: "Main Farm",
        parameter: "WATER",
        currentValue: 76,
        farmAverage: 71,
        topFarm: "Main Farm",
        topValue: 76,
        percentile: 68,
      },
    ];

    return Response.json({ comparisons });
  } catch (error) {
    return Response.json({ error: "Failed to fetch cross-farm data" }, { status: 500 });
  }
}
