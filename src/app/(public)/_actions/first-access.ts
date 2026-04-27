"use server"

import prisma from "@/src/lib/prisma"
import { signIn } from "@/src/lib/auth"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"

export async function handleFirstAccess(formData: FormData) {
    const name = formData.get("name")
    const email = formData.get("email")
    const phone = formData.get("phone")
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof confirmPassword !== "string"
    ) {
        return
    }

    if (password !== confirmPassword) {
        return
    }

    const normalizedEmail = email.trim().toLowerCase()

    const userAlreadyExists = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    })

    if (userAlreadyExists) {
        redirect("/login")
    }

    const passwordHash = await hash(password, 10)

    await prisma.user.create({
        data: {
            name: name.trim(),
            email: normalizedEmail,
            phone: typeof phone === "string" ? phone.trim() : "",
            passwordHash,
        },
    })

    await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirectTo: "/dashboard",
    })
}