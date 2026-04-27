import { redirect } from "next/navigation"
import { GridPlans } from "./_components/grid-plans"
import { getSubscription } from "@/src/utils/get-subscriptions"
import { SubscriptionDetail } from "./_components/subscription-detail"
import { auth } from "@/src/lib/auth"
export default async function Plans() {

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/")
  }

  const userId = session.user.id
  const subscription = await getSubscription({ userId })

  return (
    <section>
      {subscription?.status !== "active" && <GridPlans />}

      {subscription?.status === "active" && (
        <SubscriptionDetail subscription={subscription!}/>
      )}
    </section>
  )
}