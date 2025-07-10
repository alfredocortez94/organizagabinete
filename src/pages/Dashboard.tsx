
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, User, Check, X, ArrowRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Layout from "@/components/Layout";
import { useVisit } from "@/context/VisitContext";
import StatusBadge from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import PerformanceChart from "@/components/dashboard/PerformanceChart";

const Dashboard = () => {
  const { visits } = useVisit();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Get today's visits
  const todayString = new Date().toISOString().split("T")[0];
  const todayVisits = visits.filter(
    (visit) => visit.visitDate === todayString && visit.status === "approved"
  );

  // Get this week's visits
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

  const thisWeekVisits = visits.filter((visit) => {
    const visitDate = new Date(visit.visitDate);
    return visitDate >= startOfWeek && visitDate <= endOfWeek && visit.status === "approved";
  });

  // Get pending visits
  const pendingVisits = visits.filter((visit) => visit.status === "pending");

  // Get visits for selected date
  const selectedDateVisits = date
    ? visits.filter(
        (visit) =>
          visit.visitDate === date.toISOString().split("T")[0] &&
          (visit.status === "approved" || visit.status === "pending")
      )
    : [];

  return (
    <Layout>
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                Visitas Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todayVisits.length}</div>
              <p className="text-sm text-gray-500 mt-1">Agendadas para hoje</p>
              <Button variant="link" asChild className="p-0 mt-2">
                <Link to="/manage">Ver detalhes</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingVisits.length}</div>
              <p className="text-sm text-gray-500 mt-1">Aguardando aprovação</p>
              <Button variant="link" asChild className="p-0 mt-2">
                <Link to="/manage">Ver pendentes</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-green-500" />
                Esta Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{thisWeekVisits.length}</div>
              <p className="text-sm text-gray-500 mt-1">Visitas confirmadas</p>
              <Button variant="link" asChild className="p-0 mt-2">
                <Link to="/manage">Ver agenda</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* New Performance Chart */}
        <div className="mb-8">
          <PerformanceChart />
        </div>

        <div className="grid gap-6 lg:grid-cols-5 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Agenda</CardTitle>
              <CardDescription>Selecione uma data para ver as visitas agendadas</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md p-3"
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">
                Visitas para {date ? formatDate(date.toISOString()) : "Hoje"}
              </CardTitle>
              <CardDescription>
                {selectedDateVisits.length} visitas agendadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateVisits.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Nenhuma visita agendada para esta data</p>
                  <Button asChild>
                    <Link to="/request">
                      Agendar nova visita <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div>
                        <h3 className="font-medium">{visit.visitorName}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {visit.visitTime} -{" "}
                          <StatusBadge status={visit.status} className="ml-2" />
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/status/${visit.id}`}>Detalhes</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>Visitas de Hoje</CardTitle>
                <CardDescription>
                  Visitas agendadas para hoje - {new Date().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayVisits.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">Nenhuma visita agendada para hoje</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Horário</th>
                          <th className="text-left p-2 font-medium">Visitante</th>
                          <th className="text-left p-2 font-medium">Contato</th>
                          <th className="text-left p-2 font-medium">Motivo</th>
                          <th className="text-left p-2 font-medium">Status</th>
                          <th className="text-left p-2 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayVisits
                          .sort((a, b) => a.visitTime.localeCompare(b.visitTime))
                          .map((visit) => (
                            <tr key={visit.id} className="border-b last:border-0 hover:bg-gray-50">
                              <td className="p-2 font-medium">{visit.visitTime}</td>
                              <td className="p-2">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                                    {visit.visitorName.charAt(0)}
                                  </div>
                                  {visit.visitorName}
                                </div>
                              </td>
                              <td className="p-2">{visit.visitorPhone}</td>
                              <td className="p-2">
                                <div className="max-w-[150px] truncate" title={visit.purpose}>
                                  {visit.purpose}
                                </div>
                              </td>
                              <td className="p-2">
                                <StatusBadge status={visit.status} />
                              </td>
                              <td className="p-2">
                                <Button size="sm" variant="outline" asChild>
                                  <Link to={`/status/${visit.id}`}>Detalhes</Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações Pendentes</CardTitle>
                <CardDescription>
                  Visitas aguardando aprovação - {pendingVisits.length} pendentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingVisits.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">Não há solicitações pendentes no momento</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Data</th>
                          <th className="text-left p-2 font-medium">Visitante</th>
                          <th className="text-left p-2 font-medium">Contato</th>
                          <th className="text-left p-2 font-medium">Motivo</th>
                          <th className="text-left p-2 font-medium">Recebido em</th>
                          <th className="text-left p-2 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingVisits
                          .sort(
                            (a, b) =>
                              new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
                          )
                          .map((visit) => (
                            <tr key={visit.id} className="border-b last:border-0 hover:bg-gray-50">
                              <td className="p-2 font-medium whitespace-nowrap">
                                {formatDate(visit.visitDate)} às {visit.visitTime}
                              </td>
                              <td className="p-2">{visit.visitorName}</td>
                              <td className="p-2">{visit.visitorPhone}</td>
                              <td className="p-2">
                                <div className="max-w-[150px] truncate" title={visit.purpose}>
                                  {visit.purpose}
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                {new Date(visit.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" asChild>
                                    <Link to={`/status/${visit.id}`}>
                                      <ArrowRight className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Visitas</CardTitle>
                <CardDescription>
                  Visitas agendadas para os próximos dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                {thisWeekVisits.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">Nenhuma visita agendada para esta semana</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Data</th>
                          <th className="text-left p-2 font-medium">Horário</th>
                          <th className="text-left p-2 font-medium">Visitante</th>
                          <th className="text-left p-2 font-medium">Contato</th>
                          <th className="text-left p-2 font-medium">Motivo</th>
                          <th className="text-left p-2 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {thisWeekVisits
                          .sort(
                            (a, b) =>
                              new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime() ||
                              a.visitTime.localeCompare(b.visitTime)
                          )
                          .map((visit) => (
                            <tr key={visit.id} className="border-b last:border-0 hover:bg-gray-50">
                              <td className="p-2 font-medium">
                                {formatDate(visit.visitDate)}
                              </td>
                              <td className="p-2">{visit.visitTime}</td>
                              <td className="p-2">{visit.visitorName}</td>
                              <td className="p-2">{visit.visitorPhone}</td>
                              <td className="p-2">
                                <div className="max-w-[150px] truncate" title={visit.purpose}>
                                  {visit.purpose}
                                </div>
                              </td>
                              <td className="p-2">
                                <Button size="sm" variant="outline" asChild>
                                  <Link to={`/status/${visit.id}`}>Detalhes</Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
