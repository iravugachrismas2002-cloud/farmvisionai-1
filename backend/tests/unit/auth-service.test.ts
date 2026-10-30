import { beforeEach, describe, expect, it, vi } from "vitest";

const { createUserRecord } = vi.hoisted(() => ({
  createUserRecord: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("../../src/server/db/prisma", () => ({
  getPrismaClient: () => ({ user: { create: createUserRecord } }),
}));

import { ApprovalStatus, FarmVisionRole } from "../../src/generated/prisma/enums";
import { createUser } from "../../src/server/auth/service";

describe("createUser", () => {
  beforeEach(() => {
    createUserRecord.mockReset();
    createUserRecord.mockResolvedValue({
      id: "user-1",
      email: "farmer@example.com",
      name: "Jane Farmer",
      approvalStatus: ApprovalStatus.APPROVED,
      emailVerified: new Date(),
      roles: [{ role: FarmVisionRole.FARMER }],
    });
  });

  it("creates an immediately usable account without a verification token", async () => {
    const user = await createUser({
      email: " Farmer@Example.com ",
      password: "a-secure-password",
      firstName: "Jane",
      lastName: "Farmer",
      role: FarmVisionRole.FARMER,
    });

    expect(createUserRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "farmer@example.com",
          approvalStatus: ApprovalStatus.APPROVED,
          emailVerified: expect.any(Date),
          verificationToken: null,
          verificationExpiresAt: null,
        }),
      }),
    );
    expect(user.email).toBe("farmer@example.com");
    expect(user).not.toHaveProperty("verificationToken");
  });
});
