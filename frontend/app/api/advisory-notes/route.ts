export async function GET() {
  try {
    const notes = [
      {
        id: "note-1",
        farmId: "farm-1",
        agronomistId: "agro-1",
        title: "Greenhouse humidity trending high",
        body: "Relative humidity has stayed above 80% for three consecutive nights. Increase ventilation cycles and check for standing water around the irrigation lines to reduce fungal pressure.",
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: "note-2",
        farmId: "farm-2",
        agronomistId: "agro-1",
        title: "North field nitrogen application plan",
        body: "Soil test results indicate a moderate nitrogen deficit. Split the application across two passes, with the first pass before the next rainfall window.",
        createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
      {
        id: "note-3",
        farmId: "farm-1",
        agronomistId: "agro-1",
        title: "Feed consumption observation",
        body: "Feed trough levels are declining faster than the seasonal average. Verify sensor calibration before adjusting the ration.",
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
    ];

    return Response.json({ notes });
  } catch (error) {
    return Response.json({ error: "Failed to fetch advisory notes" }, { status: 500 });
  }
}
