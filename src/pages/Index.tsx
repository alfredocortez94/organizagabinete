
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, BarChart2, ArrowRight } from "lucide-react";
import { useVisit } from "@/context/VisitContext";
import StatusBadge from "@/components/StatusBadge";

const Index = () => {
  const { visits, getVisitsByStatus } = useVisit();
  
  const pendingVisits = getVisitsByStatus("pending");
  const approvedVisits = getVisitsByStatus("approved");
  const todayVisits = visits.filter(visit => {
    const today = new Date().toISOString().split('T')[0];
    return visit.visitDate === today && (visit.status === "approved" || visit.status === "pending");
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Sistema de Marcação de Visitas
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Agende, acompanhe e gerencie visitas ao gabinete com facilidade e transparência.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle>Solicitar Visita</CardTitle>
            <CardDescription className="text-blue-100">
              Agende uma visita ao gabinete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Calendar className="h-12 w-12 opacity-80" />
              <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
                <Link to="/request">
                  Solicitar <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle>Consultar Solicitação</CardTitle>
            <CardDescription className="text-purple-100">
              Verifique o status da sua visita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <User className="h-12 w-12 opacity-80" />
              <Button asChild className="bg-white text-purple-600 hover:bg-purple-50">
                <Link to="/manage">
                  Consultar <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription className="text-green-100">
              Consulte relatórios e estatísticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <BarChart2 className="h-12 w-12 opacity-80" />
              <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                <Link to="/reports">
                  Relatórios <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visitas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{pendingVisits.length}</div>
            <p className="text-sm text-gray-500 mt-1">Aguardando aprovação</p>
            {pendingVisits.length > 0 && (
              <Button variant="link" asChild className="p-0 mt-2">
                <Link to="/manage">Ver solicitações</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visitas Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{approvedVisits.length}</div>
            <p className="text-sm text-gray-500 mt-1">Confirmadas</p>
            {approvedVisits.length > 0 && (
              <Button variant="link" asChild className="p-0 mt-2">
                <Link to="/manage">Ver aprovadas</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visitas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{todayVisits.length}</div>
            <p className="text-sm text-gray-500 mt-1">Agendadas para hoje</p>
            {todayVisits.length > 0 && (
              <Button variant="link" asChild className="p-0 mt-2">
                <Link to="/manage">Ver agenda do dia</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {visits.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Últimas solicitações</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Visitante</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Data</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visits.slice(0, 5).map((visit) => (
                    <tr key={visit.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{visit.visitorName}</td>
                      <td className="px-4 py-3 text-gray-500">{visit.visitDate}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={visit.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/status/${visit.id}`}>Detalhes</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
