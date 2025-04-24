
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define visit status types
export type VisitStatus = "pending" | "approved" | "rejected" | "completed" | "cancelled";

// Define visit interface
export interface Visit {
  id: string;
  visitorName: string;
  visitorCPF: string;
  visitorEmail: string;
  visitorPhone: string;
  requestDate: string;
  visitDate: string;
  visitTime: string;
  purpose: string;
  status: VisitStatus;
  assignedTo?: string;
  notes?: string;
  ticketCode?: string;
  createdAt: string;
  updatedAt: string;
}

// Define context interface
interface VisitContextProps {
  visits: Visit[];
  loading: boolean;
  addVisit: (visit: Omit<Visit, "id" | "status" | "createdAt" | "updatedAt" | "ticketCode">) => Visit;
  updateVisitStatus: (id: string, status: VisitStatus, assignedTo?: string, notes?: string) => void;
  getVisitById: (id: string) => Visit | undefined;
  getVisitsByStatus: (status: VisitStatus) => Visit[];
  getVisitsByDate: (startDate: string, endDate: string) => Visit[];
}

// Create context
const VisitContext = createContext<VisitContextProps | undefined>(undefined);

// Create provider component
export const VisitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load visits from localStorage on mount
  useEffect(() => {
    const storedVisits = localStorage.getItem("visits");
    if (storedVisits) {
      setVisits(JSON.parse(storedVisits));
    }
    setLoading(false);
  }, []);

  // Save visits to localStorage when they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("visits", JSON.stringify(visits));
    }
  }, [visits, loading]);

  // Add a new visit
  const addVisit = (
    visit: Omit<Visit, "id" | "status" | "createdAt" | "updatedAt" | "ticketCode">
  ): Visit => {
    const newVisit: Visit = {
      ...visit,
      id: generateVisitId(),
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ticketCode: generateTicketCode(),
    };

    setVisits((prev) => [...prev, newVisit]);
    toast.success("Solicitação de visita enviada com sucesso!");
    
    // Simulate notification being sent
    toast.info("Notificação enviada para o solicitante.");
    
    return newVisit;
  };

  // Update a visit status
  const updateVisitStatus = (id: string, status: VisitStatus, assignedTo?: string, notes?: string) => {
    setVisits((prev) =>
      prev.map((visit) =>
        visit.id === id
          ? {
              ...visit,
              status,
              assignedTo: assignedTo || visit.assignedTo,
              notes: notes || visit.notes,
              updatedAt: new Date().toISOString(),
            }
          : visit
      )
    );
    toast.success(`Status da visita atualizado para ${getStatusLabel(status)}`);
  };

  // Get a visit by ID
  const getVisitById = (id: string) => {
    return visits.find((visit) => visit.id === id);
  };

  // Get visits by status
  const getVisitsByStatus = (status: VisitStatus) => {
    return visits.filter((visit) => visit.status === status);
  };

  // Get visits by date range
  const getVisitsByDate = (startDate: string, endDate: string) => {
    return visits.filter((visit) => {
      const visitDate = new Date(visit.visitDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return visitDate >= start && visitDate <= end;
    });
  };

  // Helper functions
  const generateVisitId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const generateTicketCode = () => {
    return Math.random().toString(36).toUpperCase().substring(2, 10);
  };

  const getStatusLabel = (status: VisitStatus): string => {
    const statusMap = {
      pending: "Pendente",
      approved: "Aprovado",
      rejected: "Rejeitado",
      completed: "Concluído",
      cancelled: "Cancelado"
    };
    return statusMap[status];
  };

  const value = {
    visits,
    loading,
    addVisit,
    updateVisitStatus,
    getVisitById,
    getVisitsByStatus,
    getVisitsByDate,
  };

  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>;
};

// Create hook for using the context
export const useVisit = () => {
  const context = useContext(VisitContext);
  if (context === undefined) {
    throw new Error("useVisit must be used within a VisitProvider");
  }
  return context;
};
