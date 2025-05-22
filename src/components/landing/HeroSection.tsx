
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex flex-col justify-center overflow-hidden bg-gray-950">
      {/* Imagem de fundo com efeito de blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
          alt="Organiza Gabinete" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-indigo-900/70 to-gray-900/90"></div>
      </div>
      
      {/* Conteúdo sobre a imagem */}
      <div className="container px-6 md:px-8 relative z-10 mx-auto text-white py-16 md:py-24">
        <div className="flex flex-col max-w-[800px] mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 animate-fade-in">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
              Organiza Gabinete
            </span>
          </h1>
          
          <p className="text-blue-100 mx-auto max-w-[700px] text-base sm:text-lg md:text-xl mb-8 font-light animate-fade-in opacity-0" style={{animationDelay: '0.2s'}}>
            Simplifique o agendamento de visitas e transforme a gestão do seu gabinete com uma 
            plataforma intuitiva inspirada nos melhores padrões de usabilidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 animate-fade-in opacity-0" style={{animationDelay: '0.4s'}}>
            <Button 
              onClick={() => navigate("/request")}
              className="bg-white text-blue-600 hover:bg-white/90 px-6 py-6 rounded-full text-base sm:text-lg font-medium transition-all"
              size="lg"
            >
              Começar agora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/contact")}
              size="lg"
              className="border-white border-2 text-white hover:bg-white/10 px-6 py-6 rounded-full transition-all"
            >
              Saiba mais
            </Button>
          </div>
        </div>
      </div>
      
      {/* Gradiente na parte inferior para transição suave - minimizado */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent dark:from-[#000000]/5"></div>
    </section>
  );
};

export default HeroSection;
