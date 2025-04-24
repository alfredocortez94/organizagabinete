
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Visit } from "@/context/VisitContext";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";

interface VisitCardProps {
  visit: Visit;
  actionButton?: React.ReactNode;
}

const VisitCard: React.FC<VisitCardProps> = ({ visit, actionButton }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{visit.visitorName}</CardTitle>
          <StatusBadge status={visit.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-3">
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-2 text-blue-500" />
            <span>CPF: {visit.visitorCPF}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>Data: {formatDate(visit.visitDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            <span>Horário: {visit.visitTime}</span>
          </div>
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-700">Motivo da visita:</h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{visit.purpose}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" asChild>
          <Link to={`/status/${visit.id}`}>Ver detalhes</Link>
        </Button>
        {actionButton}
      </CardFooter>
    </Card>
  );
};

export default VisitCard;
