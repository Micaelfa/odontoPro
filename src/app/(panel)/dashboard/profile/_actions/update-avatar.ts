"use server";

import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfileAvatar({
  avatarUrl,
}: {
  avatarUrl: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Usuário não encontrado",
      data: null,
    };
  }

  if (!avatarUrl) {
    return {
      error: "Falha ao alterar imagem",
      data: null,
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: avatarUrl,
      },
    });

    revalidatePath("/dashboard/profile");

    return {
      error: null,
      data: "Imagem alterada com sucesso!",
    };
  } catch {
    return {
      error: "Falha ao alterar imagem",
      data: null,
    };
  }
}