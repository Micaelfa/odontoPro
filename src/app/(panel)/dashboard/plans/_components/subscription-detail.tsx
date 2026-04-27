"use client"

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Subscription } from "@/src/generated/prisma/client";
import { subscriptionPlans } from "@/src/utils/plans";
import { createPortalCustomer } from "../_actions/create-portal-client";
import { toast } from "sonner";


interface SubscriptionDetailProps{
    subscription: Subscription
}

export function SubscriptionDetail({ subscription } : SubscriptionDetailProps){

    const subscriptionInfo = subscriptionPlans.find( plan => plan.id === subscription.plan)

    async function handleManageSubscription() {

        const portal = await createPortalCustomer()

        if(portal.error){

            toast.error("Ocorreu um erro ao criar o portal de assinatura")
            return;
        }

        window.location.href = portal.sessionId;
        toast.success("Portal de assinatura criado com sucesso")
        
    }

    return(
        <Card className="w-full mx-auto">
            <CardHeader >
                <CardTitle className="text-2xl">Seu Plano Atual </CardTitle>
                    <CardDescription>
                        Sua assinatura está ativa!
                    </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg md:text:xl">
                        {subscription.plan ==="BASIC" ? "BASICO" : "PROFESSIONAL"}
                    </h3>

                    <div className="bg-green-500 text-white w-fit px-4 py-1 rounded-md ">
                        {subscription.status === "active" ? "ATIVO" : "INATIVO"}
                    </div>
                </div>

                <ul className="list-disc list-inside space-y-2 mt-5">
                    {subscriptionInfo && subscriptionInfo.features.map( features => (
                        <li key={features}>{features}</li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter>
                <Button 
                    onClick={handleManageSubscription}
                >
                    Gerenciar assinatura
                </Button>
            </CardFooter>
        </Card>
    )

}