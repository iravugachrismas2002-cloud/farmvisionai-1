export async function GET() {
  try {
    const suppliers = [
      {
        id: "sup-1",
        businessName: "Green Valley Feed Mills",
        description: "Locally milled layer and broiler rations, delivered weekly to farm gates across the district.",
        contactEmail: "sales@greenvalleyfeed.example",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 220 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
      {
        id: "sup-2",
        businessName: "AgriVet Supplies Ltd",
        description: "Veterinary medicines, vaccines and diagnostic consumables with cold-chain delivery.",
        contactEmail: "orders@agrivet.example",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 175 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      },
      {
        id: "sup-3",
        businessName: "Hilltop Seed House",
        description: "Certified seed varieties and soil testing kits for smallholder and commercial growers.",
        contactEmail: "info@hilltopseed.example",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 95 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "sup-4",
        businessName: "RapidGrow Agrochemicals",
        description: "Fertilisers and crop protection products. Currently suspended pending licence renewal.",
        contactEmail: "support@rapidgrow.example",
        status: "SUSPENDED",
        createdAt: new Date(Date.now() - 310 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
    ];

    return Response.json({ suppliers });
  } catch (error) {
    return Response.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}
