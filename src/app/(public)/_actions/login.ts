"use server"

import { signIn } from "@/src/lib/auth"
import { hasValidOAuthConfig, type OAuthProvider } from "@/src/lib/oauth-config"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

function isOAuthProvider(value: FormDataEntryValue | null): value is OAuthProvider {
    return value === "google" || value === "github"
}

export async function handleRegister(provider: OAuthProvider) {
    if (!hasValidOAuthConfig(provider)) return

    await signIn(provider, { redirectTo: "/dashboard" })
}

export async function handleProviderLogin(formData: FormData) {
    const provider = formData.get("provider")

    if (!isOAuthProvider(provider)) return
    if (!hasValidOAuthConfig(provider)) return

    await signIn(provider, { redirectTo: "/dashboard" })
}

export async function handleCredentialsLogin(formData: FormData) {
    const email = formData.get("email")
    const password = formData.get("password")

    if (typeof email !== "string" || typeof password !== "string") {
        redirect("/login?error=invalid-fields")
    }

    if (!email.trim() || !password.trim()) {
        redirect("/login?error=empty-fields")
    }

    try {
        await signIn("credentials", {
            email: email.trim().toLowerCase(),
            password,
            redirectTo: "/dashboard",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    redirect("/login?error=credentials")

                default:
                    redirect("/login?error=auth")
            }
        }

        throw error
    }
}