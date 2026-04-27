"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/prisma"
import { compare, hash } from "bcryptjs"

export async function updatePassword({
    currentPassword,
    newPassword,
    confirmPassword,
}: {
    currentPassword?: string
    newPassword: string
    confirmPassword: string
}) {
    const session = await auth()

    if (!session?.user?.id) {
        return {
            error: "Usuário não autenticado.",
            data: null,
        }
    }

    if (!newPassword || !confirmPassword) {
        return {
            error: "Preencha a nova senha e a confirmação.",
            data: null,
        }
    }

    if (newPassword.length < 6) {
        return {
            error: "A nova senha precisa ter pelo menos 6 caracteres.",
            data: null,
        }
    }

    if (newPassword !== confirmPassword) {
        return {
            error: "As senhas não coincidem.",
            data: null,
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    })

    if (!user) {
        return {
            error: "Usuário não encontrado.",
            data: null,
        }
    }

    if (user.passwordHash) {
        if (!currentPassword) {
            return {
                error: "Informe sua senha atual.",
                data: null,
            }
        }

        const isCurrentPasswordValid = await compare(currentPassword, user.passwordHash)

        if (!isCurrentPasswordValid) {
            return {
                error: "Senha atual incorreta.",
                data: null,
            }
        }
    }

    const passwordHash = await hash(newPassword, 10)

    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            passwordHash,
        },
    })

    return {
        error: null,
        data: user.passwordHash
            ? "Senha alterada com sucesso."
            : "Senha cadastrada com sucesso.",
    }
}