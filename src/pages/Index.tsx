
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
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Sistema de Marcação de Visitas
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Agende, acompanhe e gerencie visitas ao gabinete com facilidade e transparência.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>Solicitar Visita</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Agende uma visita ao gabinete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Calendar className="h-12 w-12 opacity-80" />
              <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/request">
                  Solicitar <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>Consultar Solicitação</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Verifique o status da sua visita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <User className="h-12 w-12 opacity-80" />
              <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/manage">
                  Consultar <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent text-accent-foreground">
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription className="text-muted-foreground">
              Consulte relatórios e estatísticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <BarChart2 className="h-12 w-12 opacity-80" />
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
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
            <div className="text-3xl font-bold text-primary">{pendingVisits.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Aguardando aprovação</p>
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
            <div className="text-3xl font-bold text-primary">{approvedVisits.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Confirmadas</p>
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
            <div className="text-3xl font-bold text-primary">{todayVisits.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Agendadas para hoje</p>
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
          <div className="bg-card rounded-lg shadow overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Visitante</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Data</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visits.slice(0, 5).map((visit) => (
                    <tr key={visit.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-foreground">{visit.visitorName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{visit.visitDate}</td>
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
