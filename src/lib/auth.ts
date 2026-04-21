import NextAuth from "next-auth"
import prisma from "./prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
 

const PLACEHOLDER_PATTERNS = [/^seu_/i, /^your_/i, /^insira/i, /^change[-_]?me/i]

function isValidProviderCredential(value: string | undefined): value is string {
    if (!value) return false

    const normalized = value.trim()

    if (!normalized) return false

    return !PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(normalized))
}

function firstValidEnv(...candidates: Array<string | undefined>) {
    for (const candidate of candidates) {
        if (isValidProviderCredential(candidate)) return candidate
    }

    return undefined
}

const githubId = firstValidEnv(process.env.AUTH_GITHUB_ID, process.env.GITHUB_ID)
const githubSecret = firstValidEnv(process.env.AUTH_GITHUB_SECRET, process.env.GITHUB_SECRET)
const googleId = firstValidEnv(process.env.AUTH_GOOGLE_ID, process.env.GOOGLE_ID, process.env.GOOGLE_CLIENT_ID)
const googleSecret = firstValidEnv(process.env.AUTH_GOOGLE_SECRET, process.env.GOOGLE_SECRET, process.env.GOOGLE_CLIENT_SECRET)

const providers = []

if (githubId && githubSecret) {
    providers.push(
        GitHub({
            clientId: githubId,
            clientSecret: githubSecret,
        })
    )
}

if (googleId && googleSecret) {
    providers.push(
        Google({
            clientId: googleId,
            clientSecret: googleSecret,
        })
    )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    trustHost: true,
    providers,
    pages: {
        signIn: "/login",
    },
})