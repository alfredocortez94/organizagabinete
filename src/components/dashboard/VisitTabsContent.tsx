
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TabsContent } from "@/components/ui/tabs";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Visit } from "@/context/VisitContext";

interface VisitTabsContentProps {
  todayVisits: Visit[];
  pendingVisits: Visit[];
  thisWeekVisits: Visit[];
}

const VisitTabsContent: React.FC<VisitTabsContentProps> = ({
  todayVisits,
  pendingVisits,
  thisWeekVisits,
}) => {
  return (
    <>
      <TabsContent value="today">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Visitas de Hoje</CardTitle>
            <CardDescription>
              Visitas agendadas para hoje - {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayVisits.length === 0 ? (
              <div className="text-center py-4 sm:py-6">
                <p className="text-gray-500 text-sm">Nenhuma visita agendada para hoje</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-1 sm:p-2 font-medium">Horário</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Visitante</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Contato</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Motivo</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Status</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayVisits
                      .sort((a, b) => a.visitTime.localeCompare(b.visitTime))
                      .map((visit) => (
                        <tr key={visit.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="p-1 sm:p-2 font-medium">{visit.visitTime}</td>
                          <td className="p-1 sm:p-2">
                            <div className="flex items-center">
                              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-1 sm:mr-2 text-xs sm:text-sm">
                                {visit.visitorName.charAt(0)}
                              </div>
                              <span className="hidden xs:inline">{visit.visitorName}</span>
                            </div>
                          </td>
                          <td className="p-1 sm:p-2">{visit.visitorPhone}</td>
                          <td className="p-1 sm:p-2">
                            <div className="max-w-[100px] sm:max-w-[150px] truncate" title={visit.purpose}>
                              {visit.purpose}
                            </div>
                          </td>
                          <td className="p-1 sm:p-2">
                            <StatusBadge status={visit.status} />
                          </td>
                          <td className="p-1 sm:p-2">
                            <Button size="sm" variant="outline" asChild className="text-xs h-7">
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
            <CardTitle className="text-base sm:text-lg">Solicitações Pendentes</CardTitle>
            <CardDescription>
              Visitas aguardando aprovação - {pendingVisits.length} pendentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingVisits.length === 0 ? (
              <div className="text-center py-4 sm:py-6">
                <p className="text-gray-500 text-sm">Não há solicitações pendentes no momento</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-1 sm:p-2 font-medium">Data</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Visitante</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Contato</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Motivo</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Recebido em</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Ações</th>
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
                          <td className="p-1 sm:p-2 font-medium whitespace-nowrap">
                            {formatDate(visit.visitDate)} às {visit.visitTime}
                          </td>
                          <td className="p-1 sm:p-2">{visit.visitorName}</td>
                          <td className="p-1 sm:p-2">{visit.visitorPhone}</td>
                          <td className="p-1 sm:p-2">
                            <div className="max-w-[80px] sm:max-w-[150px] truncate" title={visit.purpose}>
                              {visit.purpose}
                            </div>
                          </td>
                          <td className="p-1 sm:p-2 whitespace-nowrap">
                            {new Date(visit.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-1 sm:p-2 whitespace-nowrap">
                            <div className="flex space-x-1 sm:space-x-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 w-7 sm:h-8 sm:w-8 p-0">
                                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button size="sm" variant="outline" asChild className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                                <Link to={`/status/${visit.id}`}>
                                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
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
            <CardTitle className="text-base sm:text-lg">Próximas Visitas</CardTitle>
            <CardDescription>
              Visitas agendadas para os próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {thisWeekVisits.length === 0 ? (
              <div className="text-center py-4 sm:py-6">
                <p className="text-gray-500 text-sm">Nenhuma visita agendada para esta semana</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-1 sm:p-2 font-medium">Data</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Horário</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Visitante</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Contato</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Motivo</th>
                      <th className="text-left p-1 sm:p-2 font-medium">Ações</th>
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
                          <td className="p-1 sm:p-2 font-medium">
                            {formatDate(visit.visitDate)}
                          </td>
                          <td className="p-1 sm:p-2">{visit.visitTime}</td>
                          <td className="p-1 sm:p-2">{visit.visitorName}</td>
                          <td className="p-1 sm:p-2">{visit.visitorPhone}</td>
                          <td className="p-1 sm:p-2">
                            <div className="max-w-[80px] sm:max-w-[150px] truncate" title={visit.purpose}>
                              {visit.purpose}
                            </div>
                          </td>
                          <td className="p-1 sm:p-2">
                            <Button size="sm" variant="outline" asChild className="text-xs h-7">
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
    </>
  );
};

export default VisitTabsContent;
