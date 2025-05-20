
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Visit, VisitStatus } from "@/context/VisitContext";

interface RecentVisitsTableProps {
  recentVisits: Visit[];
}

const RecentVisitsTable: React.FC<RecentVisitsTableProps> = ({ recentVisits }) => {
  return (
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
  );
};

export default RecentVisitsTable;
