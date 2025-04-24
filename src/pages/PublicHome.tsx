
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Clock } from "lucide-react";

const PublicHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Organiza Gabienete
          </h1>
          <p className="text-lg text-gray-600">
            Agende sua visita de forma rápida e simples
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white">
            <CardHeader>
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Agende sua Visita</CardTitle>
              <CardDescription>
                Escolha a data e horário mais conveniente para você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => navigate("/request")}
              >
                Solicitar Visita
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <Clock className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Acompanhamento</CardTitle>
              <CardDescription>
                Consulte o status da sua solicitação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/status")}
              >
                Verificar Status
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Informações</CardTitle>
              <CardDescription>
                Tire suas dúvidas sobre o processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/info")}
              >
                Saiba Mais
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Precisa de ajuda? Entre em contato com nossa equipe 
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicHome;