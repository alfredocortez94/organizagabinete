
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-background to-muted">
      {/* Padrão geométrico sutil de fundo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)/0.05),transparent_50%),radial-gradient(circle_at_80%_20%,hsl(var(--primary)/0.08),transparent_50%),radial-gradient(circle_at_40%_40%,hsl(var(--muted)/0.05),transparent_50%)]" />
      </div>
      
      {/* Conteúdo */}
      <div className="container px-6 md:px-8 relative z-10 mx-auto text-foreground py-16 md:py-24">
        <div className="flex flex-col max-w-[800px] mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 animate-fade-in">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-primary/80">
              Organiza Gabinete
            </span>
          </h1>
          
          <p className="text-muted-foreground mx-auto max-w-[700px] text-base sm:text-lg md:text-xl mb-8 font-light animate-fade-in opacity-0" style={{animationDelay: '0.2s'}}>
            Simplifique o agendamento de visitas e transforme a gestão do seu gabinete com uma 
            plataforma intuitiva inspirada nos melhores padrões de usabilidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 animate-fade-in opacity-0" style={{animationDelay: '0.4s'}}>
            <Button 
              onClick={() => navigate("/request")}
              size="lg"
            >
              Começar agora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/contact")}
              size="lg"
            >
              Saiba mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
