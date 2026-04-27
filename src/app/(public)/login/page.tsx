import Link from "next/link"
import { Header } from "../_components/header"
import { Button } from "@/src/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"
import { handleCredentialsLogin, handleProviderLogin } from "../_actions/login"
import { Chrome, Github, KeyRound, LogIn, Mail, UserPlus } from "lucide-react"
import { hasValidOAuthConfig } from "@/src/lib/oauth-config"

interface LoginPageProps {
    searchParams: Promise<{
        error?: string
    }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams
    const error = params.error

    const githubEnabled = hasValidOAuthConfig("github")
    const googleEnabled = hasValidOAuthConfig("google")

    const hasCredentialsError = error === "credentials"

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-32 pb-16">
                <div className="container mx-auto px-4 max-w-xl">
                    <Card className="shadow-lg">
                        <CardHeader className="space-y-2 text-center">
                            <CardTitle className="text-2xl font-bold">
                                Bem vindo de volta
                            </CardTitle>
                            <CardDescription>
                                Escolha como deseja acessar sua conta
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {!githubEnabled && (
                                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    Login com GitHub indisponível no momento. Configure AUTH_GITHUB_ID e AUTH_GITHUB_SECRET no .env.local e reinicie o servidor.
                                </div>
                            )}

                            {error === "credentials" && (
                                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    E-mail ou senha inválidos. Verifique os dados e tente novamente.
                                </div>
                            )}

                            {error === "empty-fields" && (
                                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    Preencha o e-mail e a senha para continuar.
                                </div>
                            )}

                            {error === "invalid-fields" && (
                                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    Informe um e-mail e uma senha válidos para continuar.
                                </div>
                            )}

                            {error === "auth" && (
                                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    Não foi possível entrar agora. Tente novamente em instantes.
                                </div>
                            )}

                            <div className="grid gap-3">
                                <form action={handleProviderLogin}>
                                    <input type="hidden" name="provider" value="google" />
                                    <Button
                                        type="submit"
                                        disabled={!googleEnabled}
                                        className="w-full bg-white text-gray-800 border hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Chrome className="h-5 w-5 mr-2" />
                                        Entrar com Google
                                    </Button>
                                </form>

                                <form action={handleProviderLogin}>
                                    <input type="hidden" name="provider" value="github" />
                                    <Button
                                        type="submit"
                                        disabled={!githubEnabled}
                                        className="w-full bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Github className="h-5 w-5 mr-2" />
                                        Entrar com Github
                                    </Button>
                                </form>
                            </div>

                            <div className="relative text-center text-sm text-gray-500">
                                <span className="px-3 bg-gray-50 relative z-10">
                                    ou continue com seu email
                                </span>
                                <div className="absolute left-0 top-1/2 w-full border-t border-gray-200" />
                            </div>

                            <form action={handleCredentialsLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>

                                    <div
                                        className={`flex items-center gap-2 rounded-md border bg-white px-3 py-2 focus-within:ring-2 ${
                                            hasCredentialsError
                                                ? "border-red-300 focus-within:ring-red-400"
                                                : "border-gray-200 focus-within:ring-emerald-500"
                                        }`}
                                    >
                                        <Mail
                                            className={`h-4 w-4 ${
                                                hasCredentialsError ? "text-red-500" : "text-gray-500"
                                            }`}
                                        />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="Seu E-mail"
                                            className={`w-full border-0 p-0 focus-visible:outline-none ${
                                                hasCredentialsError ? "text-red-700" : ""
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="password"
                                    >
                                        Senha
                                    </label>

                                    <div
                                        className={`flex items-center gap-2 rounded-md border bg-white px-3 py-2 focus-within:ring-2 ${
                                            hasCredentialsError
                                                ? "border-red-300 focus-within:ring-red-400"
                                                : "border-gray-200 focus-within:ring-emerald-500"
                                        }`}
                                    >
                                        <KeyRound
                                            className={`h-4 w-4 ${
                                                hasCredentialsError ? "text-red-500" : "text-gray-500"
                                            }`}
                                        />
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="Sua senha"
                                            className={`w-full border-0 p-0 focus-visible:outline-none ${
                                                hasCredentialsError ? "text-red-700" : ""
                                            }`}
                                        />
                                    </div>

                                    {hasCredentialsError && (
                                        <p className="text-xs text-red-600">
                                            Confira se o e-mail e a senha foram digitados corretamente.
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                                >
                                    <LogInIcon />
                                    Entrar com email e senha
                                </Button>

                                <div className="flex items-center justify-between">
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="password"
                                    >
                                        Senha
                                    </label>

                                    <Link
                                        href="/login/recover-password"
                                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                    >
                                        Esqueci minha senha
                                    </Link>
                                </div>
                            </form>

                            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center space-y-3">
                                <p className="text-sm text-gray-600">
                                    Primeiro acesso ao sistema?
                                </p>

                                <Button
                                    asChild
                                    className="w-full bg-white text-gray-800 border hover:bg-gray-100"
                                >
                                    <Link href="/login/primary-access">
                                        <UserPlus className="h-5 w-5 mr-2" />
                                        Criar minha conta GRATUITA - 3 dias
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

function LogInIcon() {
    return <LogIn className="h-5 w-5 mr-2" />
}