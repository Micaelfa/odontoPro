import { Button } from "@/src/components/ui/button";
import Image from "next/image"
import doctorImg from "../../../../public/doctor-hero.png"

export function Hero() {
    return(
        <section className="bg-white">
            <div className="container mx-auto px-4 pt-20 sm:px-6 lg:px-8">
                <main className="flex items-center justify-center">
                    <article className="flex-2 space-y-8 max-w-3xl flex flex-col justify-center">
                        <h1 className="text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight">
                            Encontre os melhores profissionais em um único lugar!
                        </h1>
                        <p className="text-base md:text-lg text-gray-600">
                            Nós somos uma plataforma para profissionais da área da saúde com foco em agilzar seu atendimento de forma simplificada e organizada.
                        </p>

                        <Button className="bg-emerald-500 cursor-pointer hover:bg-emerald-400 w-fit px-6 font-semibold">
                            Encontre uma clinica
                        </Button>
                    </article>

                    <div className="hidden lg:block">
                        <Image 
                            src={doctorImg} 
                            alt="Foto ilustrativa"
                            width={340}
                            height={400}
                            className="object-contain"
                            quality={100}
                            priority
                        />
                    </div>
                </main>
            </div>
        </section>
    )
}