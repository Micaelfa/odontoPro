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
import { ArrowLeft, Mail } from "lucide-react"
import { requestPasswordReset } from "./_actions/request-password-reset"

interface RecoverPasswordPageProps {
    searchParams: Promise<{
        success?: string
        error?: string
    }>
}

export default async function RecoverPasswordPage({
    searchParams,
}: RecoverPasswordPageProps) {
    const params = await searchParams
    const success = params.success
    const error = params.error

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-32 pb-16">
                <div className="container mx-auto px-4 max-w-xl">
                    <Card className="shadow-lg">
                        <CardHeader className="space-y-2 text-center">
                            <CardTitle className="text-2xl font-bold">
                                Recuperar senha
                            </CardTitle>
                            <CardDescription>
                                Informe seu e-mail para receber o link de redefinição de senha
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {success === "sent" && (
                                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.
                                </div>
                            )}

                            {error === "invalid-email" && (
                                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    Informe um e-mail válido para continuar.
                                </div>
                            )}

                            {error === "email-service" && (
                                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    Não foi possível enviar o e-mail de recuperação agora. Tente novamente em instantes.
                                </div>
                            )}

                            <form action={requestPasswordReset} className="space-y-4">
                                <div className="space-y-2">
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="email"
                                    >
                                        E-mail
                                    </label>

                                    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="Seu e-mail cadastrado"
                                            className="w-full border-0 p-0 focus-visible:outline-none"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                                >
                                    Enviar link de recuperação
                                </Button>
                            </form>

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