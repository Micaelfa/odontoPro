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
import { ArrowLeft, KeyRound, Mail, Phone, User, UserPlus } from "lucide-react"
import { handleFirstAccess } from "../../_actions/first-access"

export default function FirstAccessPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-32 pb-16">
                <div className="container mx-auto px-4 max-w-xl">
                    <Card className="shadow-lg">
                        <CardHeader className="space-y-2 text-center">
                            <CardTitle className="text-2xl font-bold">Primeiro acesso</CardTitle>
                            <CardDescription>
                                Crie sua conta para acessar o sistema no plano Trial
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form action={handleFirstAccess} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                                        Nome
                                    </label>
                                    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="Seu nome"
                                            className="w-full border-0 p-0 focus-visible:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                                        Email
                                    </label>
                                    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="Seu email"
                                            className="w-full border-0 p-0 focus-visible:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
                                        Telefone
                                    </label>
                                    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="text"
                                            placeholder="Seu telefone"
                                            className="w-full border-0 p-0 focus-visible:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                        Senha
                                    </label>
                                    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                                        <KeyRound className="h-4 w-4 text-gray-500" />
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="Crie uma senha"
                                            className="w-full border-0 p-0 focus-visible:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                                        Confirmar senha
                                    </label>
                                    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                                        <KeyRound className="h-4 w-4 text-gray-500" />
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            placeholder="Confirme sua senha"
                                            className="w-full border-0 p-0 focus-visible:outline-none"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">
                                    <UserPlus className="h-5 w-5 mr-2" />
                                    Criar minha conta
                                </Button>
                            </form>

                            <div className="text-center">
                                <Button asChild className="w-full bg-white text-gray-800 border hover:bg-gray-100">
                                    <Link href="/login">
                                        <ArrowLeft className="h-5 w-5 mr-2" />
                                        Já tenho conta
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