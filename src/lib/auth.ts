import NextAuth from "next-auth"
import prisma from "./prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

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
            allowDangerousEmailAccountLinking: true,

        })
    )
}

providers.push(
    Credentials({
        name: "credentials",
        credentials: {
            email: {
                label: "Email",
                type: "email",
            },
            password: {
                label: "Senha",
                type: "password",
            },
        },
        async authorize(credentials) {
            const email = credentials?.email
            const password = credentials?.password

            if (typeof email !== "string" || typeof password !== "string") {
                return null
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: email.trim().toLowerCase(),
                },
            })

            if (!user || !user.passwordHash) {
                return null
            }

            const isPasswordValid = await compare(password, user.passwordHash)

            if (!isPasswordValid) {
                return null
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                createdAt: user.createdAt,
            }
        },
    })
)

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    trustHost: true,

    session: {
        strategy: "jwt",
    },

    providers,

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id

                if ("createdAt" in user && user.createdAt) {
                    token.createdAt =
                        user.createdAt instanceof Date
                            ? user.createdAt.toISOString()
                            : String(user.createdAt)
                }
            }

            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string

                if (token.createdAt) {
                    session.user.createdAt = new Date(token.createdAt as string)
                }
            }

            return session
        },
    },
})