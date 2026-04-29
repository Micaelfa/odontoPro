"use server"

import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import prisma from "@/src/lib/prisma";

interface GetAnalyticsDataParams {
  userId: string;
  months?: number;
}

/**
 * Busca os dados brutos no banco e transforma em estruturas prontas para os gráficos.
 */
export async function getAnalyticsData({ userId, months = 6 }: GetAnalyticsDataParams) {
  const now = new Date();
  const from = startOfMonth(subMonths(now, months - 1));

  // Busca serviços e agendamentos do período em paralelo para melhor performance.
  const [services, appointments] = await Promise.all([
    prisma.service.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        price: true,
        appointment: {
          where: { appointmentDate: { gte: from } },
          select: { id: true, appointmentDate: true },
        },
      },
    }),
    prisma.appointment.findMany({
      where: { userId, appointmentDate: { gte: from } },
      select: { id: true, appointmentDate: true, serviceId: true },
      orderBy: { appointmentDate: "asc" },
    }),
  ]);

  const totalServices = services.length;
  const totalAppointments = appointments.length;

  const monthlyRevenueMap = new Map<string, number>();
  const monthlyAppointmentsMap = new Map<string, number>();

  // Inicializa os meses para não “sumir” mês sem movimentação.
  for (let i = 0; i < months; i++) {
    const date = subMonths(now, months - 1 - i);
    const key = format(date, "yyyy-MM");
    monthlyRevenueMap.set(key, 0);
    monthlyAppointmentsMap.set(key, 0);
  }

  const servicePriceMap = new Map(services.map((service) => [service.id, service.price]));

  // Agrega faturamento e quantidade por mês.
  appointments.forEach((appointment) => {
    const key = format(appointment.appointmentDate, "yyyy-MM");
    const servicePrice = servicePriceMap.get(appointment.serviceId) ?? 0;

    monthlyRevenueMap.set(key, (monthlyRevenueMap.get(key) ?? 0) + servicePrice);
    monthlyAppointmentsMap.set(key, (monthlyAppointmentsMap.get(key) ?? 0) + 1);
  });

  // Dados para gráfico de evolução mensal.
  const monthlyEvolution = Array.from(monthlyRevenueMap.entries()).map(([month, revenue]) => ({
    month,
    label: format(new Date(`${month}-01T00:00:00`), "MMM 'de' yy", { locale: ptBR }),
    revenue,
    appointments: monthlyAppointmentsMap.get(month) ?? 0,
  }));

  // Top serviços por receita.
  const topServices = services
    .map((service) => {
      const totalQtd = service.appointment.length;
      const revenue = totalQtd * service.price;

      return {
        name: service.name,
        quantity: totalQtd,
        revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);

  // Quantidade de atendimentos no mês atual.
  const currentMonthAppointments = appointments.filter(
    (appointment) =>
      appointment.appointmentDate >= currentMonthStart && appointment.appointmentDate <= currentMonthEnd,
  ).length;

  // Receita do mês atual.
  const currentMonthRevenue = appointments
    .filter(
      (appointment) =>
        appointment.appointmentDate >= currentMonthStart && appointment.appointmentDate <= currentMonthEnd,
    )
    .reduce((acc, appointment) => acc + (servicePriceMap.get(appointment.serviceId) ?? 0), 0);

  // Payload final para UI.
  return {
    summary: {
      totalServices,
      totalAppointments,
      monthlyRevenue: currentMonthRevenue,
      averageTicket: totalAppointments > 0 ? Math.round((appointments.reduce((acc, app) => acc + (servicePriceMap.get(app.serviceId) ?? 0), 0) / totalAppointments)) : 0,
      currentMonthAppointments,
    },
    monthlyEvolution,
    topServices,
  };
}