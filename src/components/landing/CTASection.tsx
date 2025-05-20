
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Pronto para transformar seu gabinete?
            </h2>
            <p className="mx-auto max-w-[700px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Comece hoje mesmo e veja a diferença em seu atendimento
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
              size="lg"
              onClick={() => navigate("/contact")}
            >
              Teste grátis por 7 dias
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-blue-700 border-2 font-medium"
              size="lg"
              onClick={() => navigate("/contact")}
            >
              Fale com um consultor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
