export async function GET() {
  try {
    const consents = [
      {
        id: "consent-1",
        farmerId: "farmer-1",
        vetId: "vet-1",
        scope: "MEDICAL_RECORDS",
        status: "GRANTED",
        grantedAt: new Date(Date.now() - 40 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      },
      {
        id: "consent-2",
        farmerId: "farmer-1",
        vetId: "vet-2",
        scope: "TELEMEDICINE",
        status: "PENDING",
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: "consent-3",
        farmerId: "farmer-2",
        vetId: "vet-1",
        scope: "DATA_SHARING",
        status: "WITHDRAWN",
        grantedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
        revokedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 95 * 86400000).toISOString(),
      },
      {
        id: "consent-4",
        farmerId: "farmer-2",
        vetId: "vet-4",
        scope: "CONSULTATION_NOTES",
        status: "GRANTED",
        grantedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
    ];

    return Response.json({ consents });
  } catch (error) {
    return Response.json({ error: "Failed to fetch consent records" }, { status: 500 });
  }
}
