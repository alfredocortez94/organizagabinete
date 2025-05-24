
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] lg:min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Fundo com gradiente */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-950/80 via-indigo-950/70 to-gray-950"></div>
      
      {/* Conteúdo principal */}
      <div className="container px-4 sm:px-6 md:px-8 relative z-10 mx-auto text-white py-12 md:py-16 lg:py-24">
        <div className="flex flex-col max-w-[900px] mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter mb-6 animate-fade-in">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
              Conduza seu gabinete com tecnologia, estratégia e resultados
            </span>
          </h1>
          
          {/* Frase principal impactante */}
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 sm:mb-10 font-medium animate-fade-in opacity-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-blue-200" style={{animationDelay: '0.1s'}}>
            Simplifique o agendamento de visitas e transforme a gestão do seu gabinete.
          </p>
          
          {/* <p className="text-blue-100 mx-auto max-w-[700px] text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 font-light animate-fade-in opacity-0" style={{animationDelay: '0.3s'}}>
            Simplifique o agendamento de visitas e transforme a gestão do seu gabinete com uma 
            plataforma intuitiva inspirada nos melhores padrões de usabilidade.
          </p> */}
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-2 sm:mt-6 animate-fade-in opacity-0" style={{animationDelay: '0.5s'}}>
            <Button 
              onClick={() => navigate("/request")}
              className="bg-white text-blue-600 hover:bg-white/90 px-4 sm:px-6 py-5 sm:py-6 rounded-full text-sm sm:text-base md:text-lg font-medium transition-all"
              size="lg"
            >
              Começar agora
              <ChevronRight className="ml-1 sm:ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/contact")}
              size="lg"
              className="border-white border-2 text-white hover:bg-white/10 px-4 sm:px-6 py-5 sm:py-6 rounded-full transition-all text-sm sm:text-base"
            >
              Saiba mais
            </Button>
          </div>
        </div>
      </div>
      
      {/* Gradiente na parte inferior para transição suave */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-white to-transparent dark:from-[#000000]/5"></div> */}
    </section>
  );
};

export default HeroSection;
