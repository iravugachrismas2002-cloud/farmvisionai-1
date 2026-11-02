export async function GET(request: Request) {
  try {
    const farms = [
      {
        id: "farm-1",
        publicId: "farm-main-001",
        name: "Main Farm",
        locationLabel: "Green Valley",
        deviceCount: 3,
        lastSeenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: "farm-2",
        publicId: "farm-north-002",
        name: "North Field",
        locationLabel: "North District",
        deviceCount: 2,
        lastSeenAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    return Response.json({ farms });
  } catch (error) {
    return Response.json({ error: "Failed to fetch farms" }, { status: 500 });
  }
}
