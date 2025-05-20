
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MessageSquare, Clock } from "lucide-react";

const FeatureCards = () => {
  return (
    <section className="relative py-12 bg-blue-50">
      <div className="container px-4 md:px-6 max-w-screen-xl mx-auto -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white hover:shadow-lg transition-shadow animate-fade-in">
            <CardHeader>
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Agendamento Simplificado</CardTitle>
              <CardDescription>
                Organize visitas com poucos cliques
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white hover:shadow-lg transition-shadow animate-fade-in delay-100">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Integração WhatsApp</CardTitle>
              <CardDescription>
                Comunicação facilitada com visitantes
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white hover:shadow-lg transition-shadow animate-fade-in delay-200">
            <CardHeader>
              <Clock className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Relatórios Detalhados</CardTitle>
              <CardDescription>
                Acompanhe métricas e desempenho
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;