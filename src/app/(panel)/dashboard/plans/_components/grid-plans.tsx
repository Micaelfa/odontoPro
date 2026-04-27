import { Card, CardContent } from "@/src/components/ui/card";
import { subscriptionPlans } from "@/src/utils/plans";
import { SubscriptionButton } from "./subscription-button";

export function GridPlans() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 items-stretch">
      {subscriptionPlans.map((plan) => {
        const isProfessional = plan.name.toLowerCase() === "professional";
        const buttonType = isProfessional ? "PROFESSIONAL" : "BASIC";

        return (
          <Card
            key={plan.id}
            className="h-full border border-emerald-400 rounded-2xl overflow-hidden flex flex-col"
          >
            {isProfessional && (
              <div className="bg-emerald-500 text-white text-center font-semibold py-4">
                PROMOÇÃO EXCLUSIVA
              </div>
            )}

            <CardContent className="p-6 flex flex-col h-full">
              <div>
                <h2 className="text-3xl font-bold">{plan.name}</h2>
                <p className="text-muted-foreground mt-2">
                  {plan.desciption}
                </p>

                <ul className="mt-8 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>

                <div className="mt-8">
                    <div className="flex items-baseline gap-1.5">
                    <p className="line-through text-muted-foreground">
                        {plan.oldPrice}
                    </p>
                    <p className="text-muted-foreground"> - 40% de <span className="text-xl text-red-500">desconto</span></p>
                  </div>
                  <h3 className="text-4xl font-bold">{plan.price}</h3>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <SubscriptionButton type={buttonType} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}