"use server"

import prisma from "@/src/lib/prisma"
import { createHash } from "crypto"
import { isAfter } from "date-fns"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"

export async function resetPassword(formData: FormData) {
    const email = formData.get("email")
    const token = formData.get("token")
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (
        typeof email !== "string" ||
        typeof token !== "string" ||
        typeof password !== "string" ||
        typeof confirmPassword !== "string"
    ) {
        redirect("/login/reset-password?error=invalid")
    }

    if (password.length < 6) {
        redirect(`/login/reset-password?email=${encodeURIComponent(email)}&token=${token}&error=min-length`)
    }

    if (password !== confirmPassword) {
        redirect(`/login/reset-password?email=${encodeURIComponent(email)}&token=${token}&error=password-match`)
    }

    const normalizedEmail = email.trim().toLowerCase()
    const hashedToken = createHash("sha256").update(token).digest("hex")
    const identifier = `password-reset:${normalizedEmail}`

    const verificationToken = await prisma.verificationToken.findFirst({
        where: {
            identifier,
            token: hashedToken,
        },
    })

    if (!verificationToken) {
        redirect("/login/reset-password?error=invalid")
    }

    if (isAfter(new Date(), verificationToken.expires)) {
        await prisma.verificationToken.deleteMany({
            where: {
                identifier,
            },
        })

        redirect("/login/reset-password?error=expired")
    }

    const passwordHash = await hash(password, 10)

    await prisma.user.update({
        where: {
            email: normalizedEmail,
        },
        data: {
            passwordHash,
        },
    })

    await prisma.verificationToken.deleteMany({
        where: {
            identifier,
        },
    })

    redirect("/login?success=password-reset")
}