import Link from "next/link"
import { Header } from "../../_components/header"
import { Button } from "@/src/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"
import { ArrowLeft, KeyRound } from "lucide-react"
import { resetPassword } from "./_actions/reset-password"

interface ResetPasswordPageProps {
    searchParams: Promise<{
        email?: string
        token?: string
        error?: string
    }>
}

export default async function ResetPasswordPage({
    searchParams,
}: ResetPasswordPageProps) {
    const params = await searchParams
    const email = params.email
    const token = params.token
    const error = params.error

    const isInvalidLink = !email || !token

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-32 pb-16">
                <div className="container mx-auto px-4 max-w-xl">
                    <Card className="shadow-lg">
                        <CardHeader className="space-y-2 text-center">
                            <CardTitle className="text-2xl font-bold">
                                Redefinir senha
                            </CardTitle>
                            <CardDescription>
                                Crie uma nova senha para acessar sua conta
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {isInvalidLink && (
                                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    Link de recuperação inválido. Solicite um novo link para continuar.
                                </div>
                            )}

                            {error === "invalid" && (
                                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    Link inválido ou já utilizado. Solicite uma nova recuperação de senha.
                                </div>
                            )}

                            {error === "expired" && (
                                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    Este link expirou. Solicite uma nova recuperação de senha.
                                </div>
                            )}

                            {error === "min-length" && (
                                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    A senha precisa ter pelo menos 6 caracteres.
                                </div>
                            )}

                            {error === "password-match" && (
                                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    As senhas não coincidem.
                                </div>
                            )}

                            {!isInvalidLink && (
                                <form action={resetPassword} className="space-y-4">
                                    <input type="hidden" name="email" value={email} />
                                    <input type="hidden" name="token" value={token} />

                                    <div className="space-y-2">
                                        <label
                                            className="block text-sm font-medium text-gray-700"
                                            htmlFor="password"
                                        >
                                            Nova senha
                                        </label>

                                        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                                            <KeyRound className="h-4 w-4 text-gray-500" />
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                placeholder="Digite sua nova senha"
                                                className="w-full border-0 p-0 focus-visible:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            className="block text-sm font-medium text-gray-700"
                                            htmlFor="confirmPassword"
                                        >
                                            Confirmar nova senha
                                        </label>

                                        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                                            <KeyRound className="h-4 w-4 text-gray-500" />
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                placeholder="Confirme sua nova senha"
                                                className="w-full border-0 p-0 focus-visible:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-500 hover:bg-emerald-600"
                                    >
                                        Salvar nova senha
                                    </Button>
                                </form>
                            )}

                            <Button
                                asChild
                                className="w-full bg-white text-gray-800 border hover:bg-gray-100"
                            >
                                <Link href="/login">
                                    <ArrowLeft className="h-5 w-5 mr-2" />
                                    Voltar para o login
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}