
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Check, X } from "lucide-react";

interface StatsCardsProps {
  totalVisits: number;
  pendingVisits: number;
  approvalRate: number;
  rejectionRate: number;
  approvedCount: number;
  rejectedCount: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalVisits,
  pendingVisits,
  approvalRate,
  rejectionRate,
  approvedCount,
  rejectedCount,
}) => {
  return (
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
          <div className="text-3xl font-bold">{pendingVisits}</div>
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
            {approvedCount} aprovadas
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
            {rejectedCount} rejeitadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
