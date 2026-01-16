"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/prisma"
import z from "zod"
import { revalidatePath } from "next/cache"


const formSchema = z.object({
    name: z.string().min(1, {message: "O nome do serviço é obrigatório"}),
    price: z.number(),
    duration: z.number(),
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewService(formData : FormSchema){
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: "Falha ao cadastrar serviço",
        }
    }

    const schema = formSchema.safeParse(formData);

    if(!schema.success) {
        return {
            error: schema.error.issues[0].message
        }
    }

    try{

        const newService = await prisma.service.create({
            data:{
                name: formData.name,
                price: formData.price,
                duration: formData.duration,
                userId: session?.user?.id
            }
        })

        revalidatePath("/dashboard/service")


        return {
            data: newService
        }
    }catch(err){
        console.log(err);
        return {
            error: "Falha ao cadastrar serviço",
        }
    }
    
}