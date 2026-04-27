"use server";

import { Plan } from "@/src/generated/prisma/client";
import auth from "@/src/lib/getSession";
import prisma from "@/src/lib/prisma";
import { stripe } from "@/src/utils/stripe";

interface SubscriptionProps {
  type: Plan;
}

interface CreateSubscriptionResponse {
  sessionId: string;
  url: string;
  error?: string;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }

  return value;
}

export async function createSubscription({
  type,
}: SubscriptionProps): Promise<CreateSubscriptionResponse> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      sessionId: "",
      url: "",
      error: "Falha ao ativar plano.",
    };
  }

  const findUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!findUser) {
    return {
      sessionId: "",
      url: "",
      error: "Falha ao encontrar usuário.",
    };
  }

  let customerId = findUser.stripe_customer_id;

  if (!customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: findUser.email ?? undefined,
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripe_customer_id: stripeCustomer.id,
      },
    });

    customerId = stripeCustomer.id;
  }

  try {
    const basicPriceId = getRequiredEnv("STRIPE_PLAN_BASIC");
    const professionalPriceId = getRequiredEnv("STRIPE_PLAN_PROFISSIONAL");
    const successUrl = getRequiredEnv("STRIPE_SUCCESS_URL");
    const cancelUrl = getRequiredEnv("STRIPE_CANCEL_URL");

    const priceId = type === "BASIC" ? basicPriceId : professionalPriceId;

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        type,
      },
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!stripeCheckoutSession.url) {
      return {
        sessionId: "",
        url: "",
        error: "Não foi possível gerar a URL de pagamento.",
      };
    }

    return {
      sessionId: stripeCheckoutSession.id,
      url: stripeCheckoutSession.url,
    };
  } catch {
    return {
      sessionId: "",
      url: "",
      error: "Falha ao ativar plano.",
    };
  }
}