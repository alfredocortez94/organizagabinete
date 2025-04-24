
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart2, User, Check, Clock, X } from "lucide-react";
import Layout from "@/components/Layout";
import { useVisit, VisitStatus } from "@/context/VisitContext";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const Reports = () => {
  const { visits } = useVisit();
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // Filter visits by date range
  const filteredVisits = visits.filter((visit) => {
    const visitDate = new Date(visit.visitDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return visitDate >= start && visitDate <= end;
  });

  // Count visits by status
  const statusCounts = {
    pending: filteredVisits.filter((visit) => visit.status === "pending").length,
    approved: filteredVisits.filter((visit) => visit.status === "approved").length,
    completed: filteredVisits.filter((visit) => visit.status === "completed").length,
    rejected: filteredVisits.filter((visit) => visit.status === "rejected").length,
    cancelled: filteredVisits.filter((visit) => visit.status === "cancelled").length,
  };

  // Prepare data for the pie chart
  const pieData = [
    { name: "Pendentes", value: statusCounts.pending, color: "#FFC107" },
    { name: "Aprovadas", value: statusCounts.approved, color: "#4CAF50" },
    { name: "Concluídas", value: statusCounts.completed, color: "#2196F3" },
    { name: "Rejeitadas", value: statusCounts.rejected, color: "#F44336" },
    { name: "Canceladas", value: statusCounts.cancelled, color: "#9E9E9E" },
  ].filter((item) => item.value > 0);

  // Group visits by date for the bar chart
  const visitsByDate = filteredVisits.reduce<Record<string, number>>((acc, visit) => {
    const date = format(parseISO(visit.visitDate), "dd/MM");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(visitsByDate).map(([date, count]) => ({
    date,
    visits: count,
  }));

  // Get stats for the cards
  const totalVisits = filteredVisits.length;
  const approvalRate = totalVisits
    ? ((statusCounts.approved + statusCounts.completed) / totalVisits) * 100
    : 0;
  const rejectionRate = totalVisits
    ? ((statusCounts.rejected + statusCounts.cancelled) / totalVisits) * 100
    : 0;

  // Get most recent visits for the list
  const recentVisits = [...visits]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Layout>
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">Relatórios e Estatísticas</h1>

        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <h2 className="text-lg font-medium mb-3">Filtrar por período</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="grid gap-1.5">
              <label htmlFor="startDate" className="text-sm font-medium">
                Data inicial
              </label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="endDate" className="text-sm font-medium">
                Data final
              </label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full sm:w-auto">Aplicar Filtro</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Total de Visitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVisits}</div>
              <p className="text-sm text-gray-500 mt-1">No período selecionado</p>
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
              <div className="text-3xl font-bold">{statusCounts.pending}</div>
              <p className="text-sm text-gray-500 mt-1">Aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-500" />
                Taxa de Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{approvalRate.toFixed(1)}%</div>
              <p className="text-sm text-gray-500 mt-1">
                {statusCounts.approved + statusCounts.completed} aprovadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <X className="h-5 w-5 mr-2 text-red-500" />
                Taxa de Rejeição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rejectionRate.toFixed(1)}%</div>
              <p className="text-sm text-gray-500 mt-1">
                {statusCounts.rejected + statusCounts.cancelled} rejeitadas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                Visitas por Dia
              </CardTitle>
              <CardDescription>
                Quantidade de visitas agendadas por dia no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="visits" fill="#3B82F6" name="Visitas" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Sem dados para exibir</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-blue-500" />
                Distribuição por Status
              </CardTitle>
              <CardDescription>
                Visitas agrupadas por status no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} visitas`, "Quantidade"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Sem dados para exibir</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              Visitas Recentes
            </CardTitle>
            <CardDescription>
              Últimas solicitações recebidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2">Visitante</th>
                    <th className="text-left font-medium p-2">Data</th>
                    <th className="text-left font-medium p-2">Status</th>
                    <th className="text-left font-medium p-2">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisits.map((visit) => (
                    <tr key={visit.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-2">{visit.visitorName}</td>
                      <td className="p-2">{format(parseISO(visit.visitDate), "dd/MM/yyyy")}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            visit.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : visit.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : visit.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : visit.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {visit.status === "pending"
                            ? "Pendente"
                            : visit.status === "approved"
                            ? "Aprovado"
                            : visit.status === "completed"
                            ? "Concluído"
                            : visit.status === "rejected"
                            ? "Rejeitado"
                            : "Cancelado"}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="truncate max-w-[200px]">{visit.purpose}</div>
                      </td>
                    </tr>
                  ))}
                  {recentVisits.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center">
                        Nenhuma visita encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
