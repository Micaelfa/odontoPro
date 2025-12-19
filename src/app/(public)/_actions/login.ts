"use server"

import { signIn } from "@/src/lib/auth"

type OAuthProvider = "google" | "github"

function isOAuthProvider(value: FormDataEntryValue | null): value is OAuthProvider {
    return value === "google" || value === "github"
}

export async function handleRegister(provider: OAuthProvider) {
    await signIn(provider, { redirectTo: "/dashboard" })

}

export async function handleProviderLogin(formData: FormData) {
    const provider = formData.get("provider")

    if (!isOAuthProvider(provider)) return

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
