import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Professinals } from "./_components/profetionals";
import { getProfessionals } from "./_data-access/get-professionals";

export const revalidate = 120;

export default async function Home() {

  const professionals = await getProfessionals();

  return(
    <div>
      <Header />
      
      <div>
        <Hero/>
        
        <Professinals professionals={ professionals || [] }/>

        <Footer />
      </div>
    </div>
  )
}