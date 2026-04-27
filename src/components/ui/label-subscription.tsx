import Link from "next/link";

export function LabelSubscription({expired}: {expired: boolean}){
    return(
        <div className="bg-red-400 text-white text-sm md:text-base px-3 py-2 my-2 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
                {expired ? (
                    <h2 className="font-semibold">Seu plano expirou ou você não possui um plano ativo!</h2>
                ): (
                
                    <h3 className="font-semibold">Você excedeu o limite do seu plano!</h3>

                )}

                <p className="text-sm text-gray-50">
                    Acesse o seu plano para verificar os detalhes
                </p>

            </div>

            <Link 
                href="/dashboard/plans"
                className="bg-zinc-900 text-white px-3 py-1 rounded-md w-fit"
            >
                Acessar Planos
            </Link>

        </div>
    )
}