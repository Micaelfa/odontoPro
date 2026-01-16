"use client";

import { Button } from "@/src/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from "@/src/lib/utils";
import { isSlotInThePast, isSlotSequenceAvaliable, isToday } from "./schedule-utils";

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

  // ✅ normaliza pra evitar mismatch tipo "08:00:00" vs "08:00"
  const normalizeTime = (t: string) => (t ?? "").trim().slice(0, 5);

  // ✅ cria Set pra checagem rápida e confiável
  const blockedSet = new Set(blockedTimes.map(normalizeTime));

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {availableTimeSlots.map((slot) => {
        const slotTime = normalizeTime(slot.time);

        // ✅ 1) bloqueado se estiver no array de blockedTimes
        const isBlocked = blockedSet.has(slotTime);

        // ✅ 2) se hoje e passou do horário, bloqueia
        const slotIsPast = dateIsToday && isSlotInThePast(slotTime);

        // ✅ 3) valida sequência (ex: duração maior que 1 slot)
        const sequenceOk = isSlotSequenceAvaliable(
          slotTime,
          requiredSlots,
          clinicTimes.map(normalizeTime),
          Array.from(blockedSet)
        );

        // ✅ slotEnabled final (o que realmente manda)
        const slotEnabled = slot.available && sequenceOk && !isBlocked && !slotIsPast;

        return (
          <Button
            onClick={() => slotEnabled && onSelectTime(slotTime)}
            type="button"
            variant="outline"
            key={slot.time}
            className={cn(
              "h-10 select-none",
              selectedTime === slotTime && "border-2 border-emerald-500 text-primary",
              !slotEnabled && "opacity-50 cursor-not-allowed",
              isBlocked && "line-through" // ✅ visual: risca bloqueados
            )}
            disabled={!slotEnabled}
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
