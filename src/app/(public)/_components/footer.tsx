export function Footer() {
    return(
        <footer className="py-6 text-center text-gray-500 text-sm md:text-base">
            <p>
                Todos os direitos reservados a ©️ {new Date().getFullYear()} - 
                <a 
                    className="text-gray-500 hover:text-emerald-500 duration-300"
                    href="https://www.instagram.com/micael_farias7/" 
                    target="_blank"
                    rel="noopener noreferrer" 
                > 
                    @micaelPikaDasGalaxias
                </a>
            </p>
        </footer>
    )
}