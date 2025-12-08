import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Profetionals } from "./_components/profetionals";

export default function Home() {
  return(
    <div>
      <Header />
      
      <div>
        <Hero/>
        
        <Profetionals />

        <Footer />
      </div>

      
    </div>
  )
}