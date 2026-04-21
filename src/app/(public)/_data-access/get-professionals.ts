"use server"

import prisma from "@/src/lib/prisma"
import { User } from "@/src/generated/prisma/client"

export async function getProfessionals(): Promise<User[]> {
  try {
    return await prisma.user.findMany({
      where: {
        status: true,
      },
    })
  } catch {
    return []
  }
}