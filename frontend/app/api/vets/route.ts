export async function GET() {
  try {
    const vets = [
      {
        id: "vet-1",
        name: "Dr. Amara Nkusi",
        specialization: "LARGE_ANIMAL",
        yearsExperience: 12,
        farmId: "farm-1",
        isAvailable: true,
        rating: 4.8,
        totalConsultations: 214,
        createdAt: new Date(Date.now() - 200 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "vet-2",
        name: "Dr. Elias Habimana",
        specialization: "POULTRY",
        yearsExperience: 7,
        isAvailable: true,
        rating: 4.5,
        totalConsultations: 96,
        createdAt: new Date(Date.now() - 150 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: "vet-3",
        name: "Dr. Sarah Okafor",
        specialization: "PUBLIC_HEALTH",
        yearsExperience: 15,
        isAvailable: false,
        rating: 4.9,
        totalConsultations: 340,
        createdAt: new Date(Date.now() - 300 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: "vet-4",
        name: "Dr. Jean Baptiste",
        specialization: "SWINE",
        yearsExperience: 4,
        farmId: "farm-2",
        isAvailable: true,
        rating: 4.2,
        totalConsultations: 41,
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
    ];

    return Response.json({ vets });
  } catch (error) {
    return Response.json({ error: "Failed to fetch veterinarians" }, { status: 500 });
  }
}
