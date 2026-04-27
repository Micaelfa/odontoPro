"use server";

import prisma from "@/src/lib/prisma";
import { Prisma } from "@/src/generated/prisma/client";

export type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
  };
}>;

export async function getProfessionals(): Promise<UserWithSubscription[]> {
  try {
    return await prisma.user.findMany({
      where: {
        status: true,
      },
      include: {
        subscription: true,
      },
    });
  } catch {
    return [];
  }
}