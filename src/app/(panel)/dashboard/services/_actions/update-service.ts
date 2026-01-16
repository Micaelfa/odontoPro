"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/prisma"
import z from "zod"
import { revalidatePath } from "next/cache"


const formSchema = z.object({
    serviceId: z.string().min(1, "o id é obrigatorio"),
    name: z.string().min(1, {message: "O nome do serviço é obrigatório"}),
    price: z.number(),
    duration: z.number(),
})

type FormSchema = z.infer<typeof formSchema>


export async function updateService(formData: FormSchema) {
    const session = await auth();
    
        if (!session?.user?.id) {
            return {
                error: "Falha ao editar serviço",
            }
        }
    
        const schema = formSchema.safeParse(formData);
    
        if(!schema.success) {
            return {
                error: schema.error.issues[0].message
            }
        } 
    try{

            await prisma.service.update({
                where:{
                    id: formData.serviceId,
                    userId: session?.user?.id,
                },
                data: {
                    name: formData.name,
                    price: formData.price,
                    duration: formData.duration
                }
            })

            revalidatePath("/dashboard/service")

            return {
                data: "Serviço deletado com sucesso"
            }

        }catch(err) {
            return {
                error: "Falha ao deletar serviço"
            }
        }


    }