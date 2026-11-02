export async function GET() {
  try {
    const reviews = [
      {
        id: "review-1",
        recommendationId: "rec-1",
        agronomistId: "agro-1",
        farmerId: "farmer-1",
        status: "PENDING",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        message: "Please confirm the suggested feed adjustment before it is sent to the farmer.",
      },
      {
        id: "review-2",
        recommendationId: "rec-2",
        agronomistId: "agro-1",
        farmerId: "farmer-1",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        message: "Water top-up guidance looks correct for this climate zone.",
      },
      {
        id: "review-3",
        recommendationId: "rec-3",
        agronomistId: "agro-1",
        farmerId: "farmer-2",
        status: "CHANGES_REQUESTED",
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        message: "Threshold appears too aggressive; resample the sensor before advising.",
      },
      {
        id: "review-4",
        recommendationId: "rec-4",
        agronomistId: "agro-1",
        farmerId: "farmer-2",
        status: "ACCEPTED_BY_FARMER",
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 18 * 86400000).toISOString(),
        message: "Farmer accepted the ventilation change and reported improved readings.",
      },
    ];

    return Response.json({ reviews });
  } catch (error) {
    return Response.json({ error: "Failed to fetch recommendation reviews" }, { status: 500 });
  }
}
