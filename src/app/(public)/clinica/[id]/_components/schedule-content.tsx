"use client";

import Image from "next/image";
import ImgTeste from "@/public/foto1.png";
import { MapPin } from "lucide-react";
import { Prisma } from "@/src/generated/prisma/client";
import { AppointmentFormData, useAppointmentForm } from "./schedule-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { formatPhone } from "@/src/utils/formatedPhone";
import { DateTimePicker } from "./date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { Label } from "@/src/components/ui/label";
import { ScheduleTimeList } from "./schedule-time-list";
import { createNewAppointment } from "../_actions/create-appointment";
import { toast } from "sonner";

type userWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
    services: true;
  };
}>;

interface ScheduleContentProps {
  clinic: userWithServiceAndSubscription;
}

export interface TimeSlot {
  time: string;
  available: boolean; 
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppointmentForm();
  const { watch } = form;

  const selectedDate = watch("date");
  const selectedServiceId = watch("serviceId");

  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvaliableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  const normalizeTime = (t: string) => (t ?? "").trim().slice(0, 5);

const fetchBlockedTimes = useCallback(
  async (date: Date): Promise<string[]> => {
    setLoadingSlots(true);

    try {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const dateString = `${year}-${month}-${day}`;

          // ✅ use rota relativa (evita NEXT_PUBLIC_URL undefined)
          const response = await fetch(
            `/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`
          );

          if (!response.ok) {
            console.log("get-appointments not ok:", response.status);
            return [];
          }

          const json = await response.json();

          // ✅ aceita vários formatos e normaliza tudo pra "HH:MM"
          const raw =
            Array.isArray(json) ? json :
            Array.isArray(json?.blockedTimes) ? json.blockedTimes :
            Array.isArray(json?.data) ? json.data :
            [];

          const blocked = raw
            .map((item: any) => (typeof item === "string" ? item : item?.time))
            .filter(Boolean)
            .map(normalizeTime);

          // DEBUG (tira depois):
          console.log("blockedTimes", dateString, blocked);

          return blocked;
        } catch (err) {
          console.log(err);
          return [];
        } finally {
          setLoadingSlots(false);
        }
      },
      [clinic.id]
    );


  useEffect(() => {
  if (selectedDate) {
    const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate as any);

    fetchBlockedTimes(dateObj).then((blocked) => {
      const blockedNormalized = blocked.map((t) => t.trim().slice(0, 5));
      setBlockedTimes(blockedNormalized);

      const times = (clinic.times || []).map((t) => t.trim().slice(0, 5));

      const finalSlots: TimeSlot[] = times.map((time) => ({
        time,
        available: !blockedNormalized.includes(time),
      }));

      setAvaliableTimeSlots(finalSlots);

      const stillAvailable = finalSlots.find(
        (slot) => slot.time === selectedTime && slot.available
      );

      if (!stillAvailable) {
        setSelectedTime("");
      }
    });
  }
}, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime]);


  async function handleRegisterAppointmnent(formData: AppointmentFormData) {
    if (!selectedTime) {
        return;
    }
    const response = await createNewAppointment({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        time: selectedTime,
        date: formData.date,
        serviceId: formData.serviceId,
        clinicId: clinic.id
    })

    if(response.error){
        toast.error(response.error)
        return;
    }

    toast.success("Consulta agendada com sucesso!")
    form.reset();
    setSelectedTime("")

  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-emerald-500" />

      <section className="container mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-emerald-400 mb-8">
              <Image
                src={clinic.image ? clinic.image : ImgTeste}
                alt="Foto da clinica"
                className="object-cover"
                fill
              />
            </div>

            <h1 className="text-2xl font-bold mb-2">{clinic.name}</h1>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5" />
              <span> {clinic.address ? clinic.address : "Endereço não informado"} </span>
            </div>
          </article>
        </div>
      </section>

      <section className="max-w-2xl mx-auto w-full mt-6">
        <Form {...form}>
          <form
            className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm"
            onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Nome Completo:</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="Digite seu nome completo..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Email:</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="Digite seu email..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Telefone:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Digite seu numero..."
                      onChange={(e) => {
                        const formattedValue = formatPhone(e.target.value);
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-1">
                  <FormLabel className="font-semibold">Data do agendamento:</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      initialDate={new Date()}
                      className="w-full rounded border p-2"
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="font-semibold">Serviço:</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {Math.floor(service.duration / 60)}h {service.duration % 60}min
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {selectedServiceId && (
              <div className="space-y-2">
                <Label className="font-semibold">Horários disponiveis</Label>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {loadingSlots ? (
                    <p>Carregando horários...</p>
                  ) : availableTimeSlots.length === 0 ? (
                    <p>Nenhum horário disponivel</p>
                  ) : (
                    <ScheduleTimeList 
                        clinicTimes={clinic.times}
                        blockedTimes={blockedTimes}
                        availableTimeSlots={availableTimeSlots}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onSelectTime={ (time) => setSelectedTime(time)}
                        requiredSlots={
                            clinic.services.find(service => service.id ===selectedServiceId) ? Math.ceil(clinic.services.find(service =>
                                service.id === selectedServiceId)!.duration / 30) : 1
                        }
                    />
                  )}
                </div>
              </div>
            )}

            {clinic.status ? (
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400"
                disabled={!watch("name") || !watch("email") || !watch("phone") || !watch("date")}
              >
                Realizar agendamento
              </Button>
            ) : (
              <p className="bg-red-500 text-white rounded-md text-center px-4 py-2">
                A clinica está fechada nesse momento.
              </p>
            )}
          </form>
        </Form>
      </section>
    </div>
  );
}
