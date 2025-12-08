"use server"
import prisma from "@/src/lib/prisma";

interface GetUserDataProps {
  userId: string; // use "string" em vez de "String"
}

// tipando o retorno (ajuste o tipo conforme o modelo do Prisma)
export async function getUserData(
  { userId }: GetUserDataProps
) {
  try {
    if (!userId) {
      return null;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        subscription: true
      }
    });

    if (!user) {
      return null;
    }

    // AQUI você retorna o usuário de fato
    return user;
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    return null;
  }
}
