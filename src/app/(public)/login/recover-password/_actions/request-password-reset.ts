"use server"

import prisma from "@/src/lib/prisma"
import { sendPasswordResetEmail } from "@/src/lib/mail"
import { randomBytes, createHash } from "crypto"
import { addHours } from "date-fns"
import { redirect } from "next/navigation"

export async function requestPasswordReset(formData: FormData): Promise<void> {
    const email = formData.get("email")

    if (typeof email !== "string" || !email.trim()) {
        redirect("/login/recover-password?error=invalid-email")
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    })

    if (!user) {
        redirect("/login/recover-password?success=sent")
    }

    const rawToken = randomBytes(32).toString("hex")
    const hashedToken = createHash("sha256").update(rawToken).digest("hex")
    const identifier = `password-reset:${normalizedEmail}`

    await prisma.verificationToken.deleteMany({
        where: {
            identifier,
        },
    })

    await prisma.verificationToken.create({
        data: {
            identifier,
            token: hashedToken,
            expires: addHours(new Date(), 1),
        },
    })

    const appUrl = process.env.APP_URL || "http://localhost:3000"

    const resetLink = `${appUrl}/login/reset-password?email=${encodeURIComponent(
        normalizedEmail
    )}&token=${rawToken}`

    const response = await sendPasswordResetEmail({
        to: normalizedEmail,
        resetLink,
    })

    if (response.error) {
        redirect("/login/recover-password?error=email-service")
    }

    redirect("/login/recover-password?success=sent")
}