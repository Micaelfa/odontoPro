"use server"

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";


const formSchema = z.object({
    name:z.string().trim().min(1, "O nome é obrigatório"),
    email:z.string().trim().email("O email é obrigatório"),
    phone:z.string().trim().min(1, "O telefone é obrigatório"),
    date:z.coerce.date(),
    serviceId:z.string().trim().min(1, "O serviço é obrigatorio é obrigatório"),
    time:z.string().trim().min(1, "O horário é obrigatório"),
    clinicId:z.string().trim().min(1, "O horário é obrigatório"),
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewAppointment(formData: FormSchema) {
    const schema = formSchema.safeParse(formData)

    if(!schema.success){
        return{
            error: schema.error.issues[0].message
        }
    }

    try{

        const selectedDate = new Date(schema.data.date)

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();

        const appointmentDate = new Date(year, month, day, 0,0,0,0)

        const newAppointment = await prisma.appointment.create({
            data: {
                name: schema.data.name,
                email: schema.data.email,
                phone: schema.data.phone,
                time: schema.data.time,
                appointmentDate: appointmentDate,
                serviceId: schema.data.serviceId,
                userId: schema.data.clinicId

            }
        })

        revalidatePath(`/clinica/${schema.data.clinicId}`)

        return{
            data: newAppointment
        }

    }catch(error){
        return {
            error: error instanceof Error ? error.message : "Erro ao cadastrar agendamento"
        }
    }
}
