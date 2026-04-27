"use server";

import { Subscription } from "@/src/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import { Session } from "next-auth";
import { getPlan } from "./get-plans";
import { PLANS } from "../plans";
import { ResultPermissionProp } from "./canPermission";
import { checkSubscriptionExpired } from "./checkSubscriptionExpired";

export async function canCreateService(
  subscription: Subscription | null,
  session: Session
): Promise<ResultPermissionProp> {
  try {
    const serviceCount = await prisma.service.count({
      where: {
        userId: session?.user?.id,
      },
    });

    if (subscription && subscription.status === "active") {
      const plan = subscription.plan as keyof typeof PLANS;
      const planLimits = await getPlan(plan);

      return {
        hasPermission:
          planLimits.maxServices === null ||
          serviceCount <= planLimits.maxServices,
        planId: plan,
        expired: false,
        plan: PLANS[plan],
      };
    }

    const checkUserLimit = await checkSubscriptionExpired(session)

    return checkUserLimit
  } catch {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: false,
      plan: null,
    };
  }
}