import getSession from "@/src/lib/getSession";
import { redirect } from "next/navigation";
import { AnalyticsContent } from "./_components/analytics-content";
import { getPermissionUserToAnalytics } from "./_data-access/get-permission-analitcs";

export default async function Analytics() {
  const session = await getSession();

  // Redireciona se o usuário não estiver autenticado.
  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await getPermissionUserToAnalytics();

  // Bloqueia acesso para quem não tem plano Professional.
  if (!user) {
    return <p className="p-6 text-sm text-muted-foreground">Sem permissão: disponível apenas no plano Professional.</p>;
  }

  // Renderiza o conteúdo principal do analytics.
  return <AnalyticsContent userId={session.user.id} />;
}