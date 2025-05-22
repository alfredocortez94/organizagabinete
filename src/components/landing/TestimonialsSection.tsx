
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
    <section id="depoimentos" className="py-24 bg-white dark:bg-[#000000]">
      <div className="container px-6 md:px-8 max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-apple-blue to-apple-purple dark:from-apple-blue dark:to-apple-purple">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="mx-auto max-w-[600px] text-gray-600 dark:text-gray-300 md:text-xl">
            Depoimentos de quem já transformou seu gabinete
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {depoimentos.map((depoimento, index) => (
            <Card key={index} className="apple-card group">
              <CardContent className="p-8">
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-5 overflow-hidden rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={depoimento.avatar}
                      alt={depoimento.nome}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-semibold tracking-tight">{depoimento.nome}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{depoimento.cargo}</p>
                  </div>
                  <p className="italic text-gray-600 dark:text-gray-300 text-center">
                    "{depoimento.depoimento}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
