import React from "react";
import { Calendar, MessageSquare, Clock, FileText, Users, Check } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="recursos" className="pt-0 pb-6 bg-white">
      <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Recursos Poderosos
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Tudo que você precisa para transformar o atendimento do seu gabinete
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col items-center space-y-2 border border-gray-100 p-6 rounded-lg hover:shadow-md transition-shadow">
            <Calendar className="h-12 w-12 text-blue-600" />
            <h3 className="text-xl font-bold">Agendamento Inteligente</h3>
            <p className="text-gray-500 text-center">
              Sistema intuitivo para marcação de visitas com verificação automática de disponibilidade.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-gray-100 p-6 rounded-lg hover:shadow-md transition-shadow">
            <MessageSquare className="h-12 w-12 text-blue-600" />
            <h3 className="text-xl font-bold">Comunicação Integrada</h3>
            <p className="text-gray-500 text-center">
              Envio automático de confirmações, lembretes e atualizações via WhatsApp.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-gray-100 p-6 rounded-lg hover:shadow-md transition-shadow">
            <Clock className="h-12 w-12 text-blue-600" />
            <h3 className="text-xl font-bold">Gestão de Tempo</h3>
            <p className="text-gray-500 text-center">
              Visualize sua agenda completa e otimize o tempo da equipe com alertas e notificações.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-gray-100 p-6 rounded-lg hover:shadow-md transition-shadow">
            <FileText className="h-12 w-12 text-blue-600" />
            <h3 className="text-xl font-bold">Relatórios Completos</h3>
            <p className="text-gray-500 text-center">
              Acesse dados estatísticos sobre atendimentos, visitas e desempenho da equipe.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-gray-100 p-6 rounded-lg hover:shadow-md transition-shadow">
            <Users className="h-12 w-12 text-blue-600" />
            <h3 className="text-xl font-bold">Gestão de Equipe</h3>
            <p className="text-gray-500 text-center">
              Atribua tarefas, monitore atividades e gerencie permissões de acesso para cada membro.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-gray-100 p-6 rounded-lg hover:shadow-md transition-shadow">
            <Check className="h-12 w-12 text-blue-600" />
            <h3 className="text-xl font-bold">Personalização Total</h3>
            <p className="text-gray-500 text-center">
              Adapte o sistema às necessidades específicas do seu gabinete com opções flexíveis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
