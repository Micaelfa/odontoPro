import { revalidatePath } from "next/cache";
import { Plan } from "../generated/prisma/enums";
import prisma from "../lib/prisma";
import { stripe } from "./stripe";

/**
 * Salvar, atualizar ou deletar informações das assinaturas (subscription) no banco de dado, sinconizando com a stripe.
 *
 * @async
 * @function manageSubscription
 * @param {string} subscriptionId - o ID da assinatura a ser gerenciada.
 * @param {string} customerId - o ID do cliente associado á assinatura.
 * @param {boolean} createAction - Indica se uma nova assinatura deve ser criada.
 * @param {boolean} deleteAction - Indica se uma assinatura deve ser deletada.
 * @param {Plan} [type] - o plano associado á assinatura.
 * @returns { Promise<Response | void> }
 */

export async function manageSubscription(
  subscriptionId: string,
  customerId: string,
  createAction: boolean,
  deleteAction: boolean,
  type?: Plan
) {
  const findUser = await prisma.user.findFirst({
    where: {
      stripe_customer_id: customerId,
    },
  });

  if (!findUser) {
    return Response.json(
      { error: "Falha ao realizar assinatura" },
      { status: 400 }
    );
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: findUser.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    plan: type ?? "BASIC",
  };

  if (subscriptionId && deleteAction) {
    await prisma.subscription.delete({
      where: {
        id: subscriptionId,
      },
    });

    revalidatePath("/dashboard/plans");
    return;
  }

  if (createAction) {
    try {
      await prisma.subscription.create({
        data: subscriptionData,
      });
    } catch {
      return Response.json(
        { error: "Falha ao criar assinatura" },
        { status: 400 }
      );
    }

    revalidatePath("/dashboard/plans");
  } else {
    try {
      const findSubscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
        },
      });

      if (!findSubscription) return;

      await prisma.subscription.update({
        where: {
          id: findSubscription.id,
        },
        data: {
          status: subscription.status,
          priceId: subscription.items.data[0].price.id,
        },
      });
    } catch {
      return Response.json(
        { error: "Falha ao atualizar o banco de dados" },
        { status: 400 }
      );
    }

    revalidatePath("/dashboard/plans");
  }
}