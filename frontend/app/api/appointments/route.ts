export async function GET() {
  try {
    const appointments = [
      {
        id: "appt-1",
        vetId: "vet-1",
        farmerId: "farmer-1",
        farmId: "farm-1",
        title: "Routine herd health check",
        description: "Quarterly inspection of the dairy herd, including body condition scoring and vaccination review.",
        scheduledAt: new Date(Date.now() + 2 * 86400000).toISOString(),
        durationMinutes: 60,
        status: "CONFIRMED",
        reason: "Scheduled preventive visit",
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: "appt-2",
        vetId: "vet-2",
        farmerId: "farmer-1",
        farmId: "farm-1",
        title: "Poultry flock respiratory assessment",
        description: "Investigate increased sneezing and reduced feed intake in shed B.",
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 45,
        status: "PENDING",
        reason: "Farmer-reported respiratory signs",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: "appt-3",
        vetId: "vet-1",
        farmerId: "farmer-2",
        farmId: "farm-2",
        title: "Lameness follow-up",
        description: "Recheck of the treated hind limb and review of bedding changes.",
        scheduledAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        durationMinutes: 30,
        status: "COMPLETED",
        reason: "Post-treatment follow-up",
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: "appt-4",
        vetId: "vet-4",
        farmerId: "farmer-2",
        farmId: "farm-2",
        title: "Vaccination round — nursery pigs",
        description: "Second dose of the scheduled programme for the nursery pen.",
        scheduledAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        durationMinutes: 90,
        status: "CANCELLED",
        reason: "Postponed due to transport delay",
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 13 * 86400000).toISOString(),
      },
    ];

    return Response.json({ appointments });
  } catch (error) {
    return Response.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}
