
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VisitStatus } from "@/context/VisitContext";

interface StatusBadgeProps {
  status: VisitStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    pending: {
      label: "Pendente",
      styles: "bg-blue-100 text-blue-800 border-blue-200",
    },
    approved: {
      label: "Aprovado",
      styles: "bg-green-100 text-green-800 border-green-200",
    },
    rejected: {
      label: "Rejeitado",
      styles: "bg-red-100 text-red-800 border-red-200",
    },
    completed: {
      label: "Concluído",
      styles: "bg-slate-100 text-slate-800 border-slate-200",
    },
    cancelled: {
      label: "Cancelado",
      styles: "bg-gray-100 text-gray-800 border-gray-200",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      className={cn(
        "font-medium border",
        config.styles,
        className
      )}
      variant="outline"
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
