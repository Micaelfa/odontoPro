"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"
import z from "zod"


const formSchema = z.object({
    description: z.string().min(1, "O id do lembrete é obrigatório")
})

type FormSchema = z.infer<typeof formSchema>

export async function createReminder(formData: FormSchema) {

    const session = await auth();

    if(!session?.user?.id){
        return {
            error: "Falha ao cadastrar lembrete"
        }
    }

    const schema = formSchema.safeParse(formData)

    if(!schema.success){
        return{
            error: schema.error.issues[0].message
        }
    }

    try{
        await prisma.reminder.create({
            data: {
                description:  formData.description,
                userId: session?.user?.id
            }
        })

        revalidatePath("/dashboard")

        return{
            data: "Lembrete cadastrado com sucesso!"
        }

    }catch(err){
        return{
            error: "Erro ao cadastrar lembrete!"
        }
    }

    

}


