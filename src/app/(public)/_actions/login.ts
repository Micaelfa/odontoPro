"use server"

import { signIn } from "@/src/lib/auth"

export async function handleRegister(provider:string) {
    await signIn(provider,{redirectTo: "/dashboard"})

}

export async function handleProviderLogin(formData: FormData) {
    const provider = formData.get("provider")

    if (typeof provider !== "string") return

    await signIn(provider, { redirectTo: "/dashboard" })
}

export async function handleCredentialsLogin(formData: FormData) {
    const email = formData.get("email")
    const password = formData.get("password")

    if (typeof email !== "string" || typeof password !== "string") return

    await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard",
    })
}
