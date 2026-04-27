"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/prisma";

export async function getPermissionUserToAnalytics() {
    const session = await auth();

    if(!session?.user?.id){
        return null;
    }

    const user = await prisma.user.findFirst({
        where:{
            id: session?.user?.id
        },
        include:{
            subscription:true,
        }
    })

    if(!user?.subscription || user.subscription.plan !== "PROFESSIONAL") {
        return null;
    }

    return user;
}