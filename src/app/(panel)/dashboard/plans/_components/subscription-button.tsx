"use client";

import { Button } from "@/src/components/ui/button";
import { Plan } from "@/src/generated/prisma/client";
import { createSubscription } from "../_actions/create-subscription";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  type: Plan;
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {
  async function handleCreateBilling() {
    const { error, url } = await createSubscription({ type });

    if (error) {
      toast.error(error);
      return;
    }

    if (!url) {
      toast.error("Não foi possível redirecionar para o pagamento.");
      return;
    }

    window.location.href = url;
  }

  return (
    <Button
        className={`w-full ${
            type === "PROFESSIONAL"
            ? "bg-emerald-500 hover:bg-emerald-400"
            : "bg-black hover:bg-zinc-800"
          }`}
          onClick={handleCreateBilling}
        >
        Ativar assinatura
    </Button>
  );
}