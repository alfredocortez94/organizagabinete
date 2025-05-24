
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Visit } from "@/context/VisitContext";

interface DashboardCardsProps {
  todayVisits: Visit[];
  pendingVisits: Visit[];
  thisWeekVisits: Visit[];
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  todayVisits,
  pendingVisits,
  thisWeekVisits,
}) => {
  return (
    <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6 sm:mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <CalendarIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 text-blue-500" />
            Visitas Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">{todayVisits.length}</div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Agendadas para hoje</p>
          <Button variant="link" asChild className="p-0 mt-1 sm:mt-2 h-auto">
            <Link to="/manage">Ver detalhes</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Clock className="h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 text-yellow-500" />
            Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">{pendingVisits.length}</div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Aguardando aprovação</p>
          <Button variant="link" asChild className="p-0 mt-1 sm:mt-2 h-auto">
            <Link to="/manage">Ver pendentes</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <User className="h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 text-green-500" />
            Esta Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">{thisWeekVisits.length}</div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Visitas confirmadas</p>
          <Button variant="link" asChild className="p-0 mt-1 sm:mt-2 h-auto">
            <Link to="/manage">Ver agenda</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
