
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const TestimonialsSection = () => {
  const depoimentos = [
    {
      nome: "Maria Silva",
      cargo: "Chefe de Gabinete",
      depoimento: "O Organiza Gabinete transformou completamente nossa rotina. Conseguimos reduzir o tempo gasto com agendamentos em 70%!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      nome: "Carlos Mendes",
      cargo: "Assessor Parlamentar",
      depoimento: "A facilidade de gerenciar as visitas e a integração com WhatsApp fizeram toda a diferença no nosso atendimento ao público.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      nome: "Ana Paula Rocha",
      cargo: "Secretária Executiva",
      depoimento: "Impressionante como conseguimos organizar melhor nosso tempo e prioridades com esta ferramenta. Recomendo fortemente!",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <section id="depoimentos" className="py-20 bg-white">
      <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Depoimentos de quem já transformou seu gabinete
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {depoimentos.map((depoimento, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-16 h-16 mb-4 overflow-hidden rounded-full">
                    <img
                      src={depoimento.avatar}
                      alt={depoimento.nome}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold">{depoimento.nome}</h4>
                    <p className="text-sm text-gray-500">{depoimento.cargo}</p>
                  </div>
                </div>
                <p className="italic text-gray-600">"{depoimento.depoimento}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
