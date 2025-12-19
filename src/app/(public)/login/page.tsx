import { Header } from "../_components/header";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { handleCredentialsLogin, handleProviderLogin } from "../_actions/login";
import { Chrome, Github, KeyRound, LogIn, Mail } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-32 pb-16">
                <div className="container mx-auto px-4 max-w-xl">
                    <Card className="shadow-lg">
                        <CardHeader className="space-y-2 text-center">
                            <CardTitle className="text-2xl font-bold">Bem vindo de volta</CardTitle>
                            <CardDescription>Escolha como deseja acessar sua conta</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid gap-3">
                                <form action={handleProviderLogin}>
                                    <input type="hidden" name="provider" value="google" />
                                    <Button
                                        type="submit"
                                        className="w-full bg-white text-gray-800 border hover:bg-gray-100 cursor-pointer"
                                    >
                                        <Chrome className="h-5 w-5 mr-2" />
                                        Entrar com Google
                                    </Button>
                                </form>

                                <form action={handleProviderLogin}>
                                    <input type="hidden" name="provider" value="github" />
                                    <Button
                                        type="submit"
                                        className="w-full bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer"
                                    >
                                        <Github className="h-5 w-5 mr-2" />
                                        Entrar com Github
                                    </Button>
                                </form>
                            </div>

                            <div className="relative text-center text-sm text-gray-500">
                                <span className="px-3 bg-gray-50 relative z-10">ou continue com seu email</span>
                                <div className="absolute left-0 top-1/2 w-full border-t border-gray-200" />
                            </div>

                            <form action={handleCredentialsLogin} className="space-y-4">
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
                                            placeholder="Seu E-mail"
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
                                            placeholder="Sua senha"
                                            className="w-full border-0 p-0 focus-visible:outline-none"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">
                                    <LogInIcon />
                                    Entrar com email e senha
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

function LogInIcon() {
    return <LogIn className="h-5 w-5 mr-2" />
}
