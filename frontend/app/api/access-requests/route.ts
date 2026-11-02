export async function GET() {
  try {
    const requests = [
      {
        id: "req-1",
        farmId: "farm-1",
        agronomistId: "agro-1",
        farmerId: "farmer-1",
        status: "PENDING",
        requestedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        message: "Please review irrigation scheduling for the greenhouse block.",
      },
      {
        id: "req-2",
        farmId: "farm-2",
        agronomistId: "agro-1",
        farmerId: "farmer-1",
        status: "APPROVED",
        requestedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        decidedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        message: "Access granted for the north field crop rotation plan.",
      },
      {
        id: "req-3",
        farmId: "farm-3",
        agronomistId: "agro-1",
        farmerId: "farmer-2",
        status: "DECLINED",
        requestedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
        decidedAt: new Date(Date.now() - 19 * 86400000).toISOString(),
        message: "Farm already advised by another agronomist.",
      },
    ];

    return Response.json({ requests });
  } catch (error) {
    return Response.json({ error: "Failed to fetch access requests" }, { status: 500 });
  }
}
