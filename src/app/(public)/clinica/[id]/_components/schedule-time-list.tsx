"use client";

import { Button } from "@/src/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from "@/src/lib/utils";
import { isSlotInThePast, isSlotSequenceAvaliable, isToday } from "./schedule-utils";
import { toast } from "sonner";

interface ScheduleTimeListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredSlots: number;
  blockedTimes: string[];
  availableTimeSlots: TimeSlot[];
  clinicTimes: string[];
  onSelectTime: (time: string) => void;
}

export function ScheduleTimeList({
  selectedDate,
  selectedTime,
  requiredSlots,
  blockedTimes,
  availableTimeSlots,
  clinicTimes,
  onSelectTime,
}: ScheduleTimeListProps) {
  const dateIsToday = isToday(selectedDate);

  const normalizeTime = (t: string) => (t ?? "").trim().slice(0, 5);
  const blockedSet = new Set(blockedTimes.map(normalizeTime));

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {availableTimeSlots.map((slot) => {
        const slotTime = normalizeTime(slot.time);

        const isBlocked = blockedSet.has(slotTime);
        const slotIsPast = dateIsToday && isSlotInThePast(slotTime);

        const sequenceOk = isSlotSequenceAvaliable(
          slotTime,
          requiredSlots,
          clinicTimes.map(normalizeTime),
          Array.from(blockedSet)
        );

        const slotEnabled = slot.available && sequenceOk && !isBlocked && !slotIsPast;

        function handleClick() {
          if (slotEnabled) {
            onSelectTime(slotTime);
            return;
          }

          if (isBlocked) {
            toast.error("Esse horário já está agendado. Escolha outro.");
            return;
          }

          if (slotIsPast) {
            toast.error("Esse horário já passou. Escolha outro.");
            return;
          }

          if (!sequenceOk) {
            toast.error("Esse horário não comporta a duração do serviço.");
            return;
          }

          toast.error("Horário indisponível.");
        }

        return (
          <Button
            onClick={handleClick}
            type="button"
            variant="outline"
            key={slot.time}
            className={cn(
              "h-10 select-none",
              selectedTime === slotTime && "border-2 border-emerald-500 text-primary",
              !slotEnabled && "opacity-50 cursor-not-allowed",
              isBlocked && "line-through"
            )}
            // ⚠️ não usar disabled aqui, senão não captura click e não mostra toast
            title={
              isBlocked
                ? "Horário já agendado"
                : slotIsPast
                ? "Horário já passou"
                : !sequenceOk
                ? "Tempo insuficiente para esse serviço"
                : ""
            }
          >
            {slotTime}
          </Button>
        );
      })}
    </div>
  );
}
