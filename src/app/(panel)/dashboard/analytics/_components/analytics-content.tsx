import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getAnalyticsData } from "../_data-access/get-permission-data";

interface AnalyticsContentProps {
  userId: string;
}

function currency(value: number) {
  // Formata centavos para moeda BRL (pt-BR).
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

/**
 * Renderiza os cards de resumo e os blocos principais de visualização.
 */
export async function AnalyticsContent({ userId }: AnalyticsContentProps) {
  const analytics = await getAnalyticsData({ userId, months: 6 });

  const maxRevenue = Math.max(...analytics.monthlyEvolution.map((item) => item.revenue), 1);

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Dashboard Analítico</h1>
        <p className="text-muted-foreground">Visão geral de faturamento e desempenho dos atendimentos.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Serviços</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{analytics.summary.totalServices}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Atendimentos</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{analytics.summary.totalAppointments}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Faturamento mês</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{currency(analytics.summary.monthlyRevenue)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Ticket médio</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{currency(analytics.summary.averageTicket)}</CardContent></Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid h-64 grid-cols-6 items-end gap-3">
              {analytics.monthlyEvolution.map((item) => {
                // Calcula altura proporcional da barra no gráfico.
                const heightPercent = (item.revenue / maxRevenue) * 100;

                return (
                  <div key={item.month} className="flex flex-col items-center gap-2">
                    <div className="w-full rounded-md bg-primary/20" style={{ height: `${Math.max(heightPercent, 5)}%` }} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Serviços por Receita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.topServices.map((service) => (
              <div key={service.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{service.name}</span>
                  <span className="font-medium">{currency(service.revenue)}</span>
                </div>
                <div className="h-2 rounded bg-muted">
                  <div
                    className="h-2 rounded bg-primary"
                    // Barra relativa ao primeiro item (maior receita).
                    style={{ width: `${(service.revenue / Math.max(analytics.topServices[0]?.revenue ?? 1, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}