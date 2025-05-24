
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Visit } from "@/context/VisitContext";

interface DashboardCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedDateVisits: Visit[];
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  date,
  setDate,
  selectedDateVisits,
}) => {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-5 mb-6 sm:mb-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Agenda</CardTitle>
          <CardDescription>Selecione uma data para ver as visitas agendadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="border rounded-md p-2 sm:p-3 max-w-full"
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Visitas para {date ? formatDate(date.toISOString()) : "Hoje"}
          </CardTitle>
          <CardDescription>
            {selectedDateVisits.length} visitas agendadas
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[350px] overflow-y-auto">
          {selectedDateVisits.length === 0 ? (
            <div className="text-center py-4 sm:py-6">
              <p className="text-gray-500 mb-3 sm:mb-4 text-sm">Nenhuma visita agendada para esta data</p>
              <Button asChild size="sm" className="sm:px-4">
                <Link to="/request">
                  Agendar nova visita <ArrowRight className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {selectedDateVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between border-b pb-2 sm:pb-3 last:border-0"
                >
                  <div>
                    <h3 className="text-sm sm:text-base font-medium">{visit.visitorName}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                      {visit.visitTime} -{" "}
                      <StatusBadge status={visit.status} className="ml-2" />
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild className="text-xs sm:text-sm h-7 sm:h-9">
                    <Link to={`/status/${visit.id}`}>Detalhes</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCalendar;
