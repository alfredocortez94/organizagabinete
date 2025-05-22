
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MessageSquare, Clock } from "lucide-react";

const FeatureCards = () => {
  return (
    <section className="relative py-12 bg-gradient-to-b from-[#F5F5F7] to-white dark:from-[#1C1C1E] dark:to-[#121212]">
      <div className="container px-6 lg:px-8 max-w-[1200px] mx-auto -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <Card className="feature-card opacity-0 bg-white dark:bg-[#1C1C1E] hover:shadow-apple-hover dark:hover:shadow-apple-dark transition-all duration-500 transform hover:-translate-y-1 border-0 shadow-apple dark:shadow-apple-dark rounded-2xl overflow-hidden group">
            <CardHeader className="space-y-3 p-6">
              <div className="bg-apple-blue/10 dark:bg-apple-blue/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-apple-blue/15 dark:group-hover:bg-apple-blue/30 group-hover:scale-105">
                <Calendar className="h-8 w-8 text-apple-blue" />
              </div>
              <CardTitle className="text-xl tracking-tight">Agendamento Simplificado</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Organize visitas com poucos cliques em uma interface intuitiva
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="feature-card opacity-0 bg-white dark:bg-[#1C1C1E] hover:shadow-apple-hover dark:hover:shadow-apple-dark transition-all duration-500 transform hover:-translate-y-1 border-0 shadow-apple dark:shadow-apple-dark rounded-2xl overflow-hidden group">
            <CardHeader className="space-y-3 p-6">
              <div className="bg-apple-green/10 dark:bg-apple-green/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-apple-green/15 dark:group-hover:bg-apple-green/30 group-hover:scale-105">
                <MessageSquare className="h-8 w-8 text-apple-green" />
              </div>
              <CardTitle className="text-xl tracking-tight">Integração WhatsApp</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Comunicação facilitada com visitantes em tempo real
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="feature-card opacity-0 bg-white dark:bg-[#1C1C1E] hover:shadow-apple-hover dark:hover:shadow-apple-dark transition-all duration-500 transform hover:-translate-y-1 border-0 shadow-apple dark:shadow-apple-dark rounded-2xl overflow-hidden group">
            <CardHeader className="space-y-3 p-6">
              <div className="bg-apple-purple/10 dark:bg-apple-purple/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-apple-purple/15 dark:group-hover:bg-apple-purple/30 group-hover:scale-105">
                <Clock className="h-8 w-8 text-apple-purple" />
              </div>
              <CardTitle className="text-xl tracking-tight">Relatórios Detalhados</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Acompanhe métricas e desempenho com visualizações intuitivas
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
