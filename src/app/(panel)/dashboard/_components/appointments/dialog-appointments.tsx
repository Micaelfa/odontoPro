import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { AppointmentWithService } from "./appointments-list"
import {formatCurrency} from "@/src/utils/formatCurrency"

interface DialogAppointmentProps {
    appointment: AppointmentWithService | null
}
export function DialogAppointment({appointment} : DialogAppointmentProps){
    return(
        <DialogContent>
            <div className="flex justify-center items-center mt-8">
                <DialogHeader className="bg-gray-200 mt-3 p-3 w-80 text-2xl rounded-md flex justify-center items-center">
                    <DialogTitle>
                        Detalhes do agendamento
                    </DialogTitle>
                    <DialogDescription>
                        Veja todos os detalhes do agendamento:
                    </DialogDescription>
                </DialogHeader>
            </div>
            <div className="py-4">

                {appointment && (
                    <article>
                        <p><span className="font-semibold p-1">Horário agendado:</span>{appointment.time}</p>
                        <p className="mb-2"><span className="font-semibold p-1">Data do agendamento:</span>{new Intl.DateTimeFormat("pt-BR", {
                                timeZone: "UTC",
                                year: "numeric",
                                month:"2-digit",
                                day: "2-digit",
                            }).format(new Date(appointment.appointmentDate))}
                        </p>

                        <p><span className="font-semibold p-1">Nome:</span>{appointment.name}</p>
                        <p><span className="font-semibold p-1">Telefone:</span>{appointment.phone}</p>
                        <p><span className="font-semibold p-1">E-mail:</span>{appointment.email}</p>

                        <div className="flex justify-center items-center mt-8">
                            <section className="bg-emerald-100 w-80 rounded-md flex flex-col justify-center items-center">                            
                                <p className="text-xl text-emerald-600"><span className="font-bold  p-2">Serviço:</span>{appointment.service.name}</p>
                                <p className="text-xl text-emerald-500"><span className="font-bold p-2">Valor:</span>{formatCurrency((appointment.service.price / 100))}</p> 
                            </section>
                        </div>

                    </article>
                )}

            </div>
        </DialogContent>
    )
}