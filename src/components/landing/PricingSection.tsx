import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle } from "lucide-react";

const PricingSection = () => {
  const navigate = useNavigate();
  const [includeWhatsApp, setIncludeWhatsApp] = useState(true);

  const planosBase = [
    {
      titulo: "Mensal",
      preco: "R$ 149,90",
      periodo: "/mês",
      destaque: false,
      recursos: [
        "Acesso a todas as funcionalidades",
        "Suporte por e-mail",
        "Até 5 usuários",
        "1000 agendamentos mensais"
      ]
    },
    {
      titulo: "Semestral",
      preco: "R$ 119,90",
      periodo: "/mês",
      destaque: true,
      desconto: "Economize 20%",
      recursos: [
        "Acesso a todas as funcionalidades",
        "Suporte prioritário",
        "Até 10 usuários",
        "Agendamentos ilimitados",
        "Exportação de relatórios"
      ]
    },
    {
      titulo: "Anual",
      preco: "R$ 99,90",
      periodo: "/mês",
      destaque: false,
      desconto: "Economize 33%",
      recursos: [
        "Acesso a todas as funcionalidades",
        "Suporte VIP",
        "Usuários ilimitados",
        "Agendamentos ilimitados",
        "Relatórios avançados",
        "Treinamento personalizado"
      ]
    }
  ];

  const planosComWhatsApp = planosBase.map(plano => ({
    ...plano,
    preco: plano.titulo === "Mensal" ? "R$ 179,90" : 
           plano.titulo === "Semestral" ? "R$ 149,90" : "R$ 129,90",
    recursos: [...plano.recursos, "Integração completa com WhatsApp", "Envio automático de mensagens", "Gestão de contatos WhatsApp"]
  }));

  const planos = includeWhatsApp ? planosComWhatsApp : planosBase;

  return (
    <section id="planos" className="py-20 bg-gray-50">
      <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Escolha o Plano Ideal
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Opções flexíveis para gabinetes de todos os tamanhos
            </p>
          </div>
        </div>

        {/* Toggle para selecionar tipo de plano */}
        <div className="flex justify-center mt-8 mb-12">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex space-x-1">
              <button
                onClick={() => setIncludeWhatsApp(true)}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ease-out flex items-center gap-3 ${
                  includeWhatsApp 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/40'
                }`}
              >
                <MessageCircle className="h-5 w-5" />
                Com WhatsApp
              </button>
              <button
                onClick={() => setIncludeWhatsApp(false)}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ease-out ${
                  !includeWhatsApp 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/40'
                }`}
              >
                Planos Básicos
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planos.map((plano, index) => (
            <Card key={index} className={`relative ${plano.destaque ? 'border-blue-500 shadow-lg' : ''}`}>
              {plano.destaque && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle>{plano.titulo}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plano.preco}</span>
                  <span className="text-gray-500 ml-1">{plano.periodo}</span>
                </div>
                {plano.desconto && (
                  <p className="text-green-600 font-medium mt-2">{plano.desconto}</p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plano.recursos.map((recurso, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className={idx >= planosBase[index].recursos.length ? 'text-blue-600 font-medium' : ''}>{recurso}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${plano.destaque ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : ''}`} 
                  variant={plano.destaque ? "default" : "outline"}
                  onClick={() => navigate("/")}
                >
                  Selecionar plano
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
