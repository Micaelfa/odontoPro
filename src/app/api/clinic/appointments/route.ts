import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server"


export const GET = auth(async function GET(request) {
    if (!request.auth){
        return NextResponse.json({error: "Acesso não autorizado!!"}, {status: 401})
    }

    const seachParams = request.nextUrl.searchParams;
    const dateString = seachParams.get("date") as string;
    const clinicId = request.auth?.user?.id

    if(!dateString){
        return NextResponse.json({error: "Data não informada!"}, {status: 400})
    }

    if(!clinicId){
        return NextResponse.json({error: "Data não informada!"}, {status: 400})
    }

    try{
        const [year, month, day] = dateString.split("-").map(Number)

        const startDate = new Date(year, month -1, day, 0, 0, 0, 0)
        const endtDate = new Date(year, month -1, day, 23, 59, 59, 999)

        const appointments = await prisma.appointment.findMany({
            where:{
                userId: clinicId,
                appointmentDate:{
                    gte: startDate,
                    lte: endtDate
                }
            },
            include: {
                service: true,
            }
        })
        
        return NextResponse.json(appointments)

    }catch(err){
        return NextResponse.json({ error: "Falha ao buscar agendamentos"})
    }


}) 