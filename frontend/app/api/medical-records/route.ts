export async function GET() {
  try {
    const records = [
      {
        id: "rec-1",
        appointmentId: "appt-3",
        vetId: "vet-1",
        farmerId: "farmer-2",
        farmId: "farm-2",
        title: "Hind limb lameness — treated",
        description: "Mild lameness in the left hind limb, attributed to bedding abrasion.",
        observations: "Animal is weight-bearing comfortably after treatment. No swelling detected.",
        diagnosedConditions: ["Lameness", "Pedal dermatitis"],
        recommendedActions: ["Deepen bedding", "Recheck in 7 days", "Hoof trim scheduled"],
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: "rec-2",
        appointmentId: "appt-3",
        vetId: "vet-1",
        farmerId: "farmer-1",
        farmId: "farm-1",
        title: "Quarterly herd health summary",
        description: "Routine check across the dairy herd with no acute findings.",
        observations: "Body condition scores stable. Vaccination records up to date.",
        diagnosedConditions: ["No acute findings"],
        recommendedActions: ["Continue current ration", "Maintain vaccination schedule"],
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: "rec-3",
        appointmentId: "appt-2",
        vetId: "vet-2",
        farmerId: "farmer-1",
        farmId: "farm-1",
        title: "Shed B respiratory workup",
        description: "Preliminary assessment pending laboratory confirmation.",
        observations: "Mild respiratory noise in a small number of birds; feed intake down roughly 8%.",
        diagnosedConditions: ["Suspected early respiratory infection"],
        recommendedActions: ["Improve ventilation", "Collect swabs", "Review stocking density"],
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ];

    return Response.json({ records });
  } catch (error) {
    return Response.json({ error: "Failed to fetch medical records" }, { status: 500 });
  }
}
