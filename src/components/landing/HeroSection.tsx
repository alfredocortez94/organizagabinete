
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] md:h-screen flex flex-col justify-center overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
          alt="Organiza Gabinete" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
      </div>
      
      {/* Conteúdo sobre a imagem */}
      <div className="container px-4 md:px-6 relative z-10 mx-auto text-white py-12 md:py-20">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                <span className="text-white">
                  Organiza Gabinete
                </span>
              </h1>
              <p className="text-blue-100 max-w-[700px] text-base sm:text-lg md:text-xl/relaxed">
                Simplifique o agendamento de visitas e transforme a gestão do seu gabinete com nossa plataforma intuitiva.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button 
                onClick={() => navigate("/login")}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 sm:px-8 sm:py-6 rounded-md text-base sm:text-lg w-full sm:w-auto font-medium"
                size="lg"
              >
                Começar agora
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/contact")}
                size="lg"
                className="border-white border-2 text-white hover:bg-white/10 w-full sm:w-auto font-medium"
              >
                Saiba mais
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradiente na parte inferior para transição suave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-50 to-transparent dark:from-gray-900"></div>
    </section>
  );
};

export default HeroSection;
