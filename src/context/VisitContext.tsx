
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import visitService, { Visit as ApiVisit, CreateVisitData } from "../services/visit.service";

// Define visit status types
export type VisitStatus = "pending" | "approved" | "rejected" | "completed" | "cancelled";

// Define visit interface
export interface Visit {
  id: string;
  visitorName: string;
  visitorCPF: string;
  visitorEmail: string;
  visitorPhone: string;
  visitDate: string;
  visitTime: string;
  purpose: string;
  status: VisitStatus;
  assignedTo?: string;
  notes?: string;
  ticketCode: string;
  createdAt: string;
  userId: string;
  googleEventId?: string; // ID do evento no Google Calendar
}

// Define context interface
interface VisitContextProps {
  visits: Visit[];
  loading: boolean;
  error: string | null;
  fetchVisits: () => Promise<void>;
  addVisit: (visit: CreateVisitData) => Promise<Visit | null>;
  updateVisitStatus: (id: string, status: VisitStatus, notes?: string) => Promise<void>;
  getVisitById: (id: string) => Visit | undefined;
  getVisitsByStatus: (status: VisitStatus) => Visit[];
  getVisitsByDate: (startDate: string, endDate: string) => Visit[];
  updateVisitGoogleEventId: (visitId: string, googleEventId: string) => Promise<void>;
  deleteVisit: (id: string) => Promise<void>;
}

// Create context
const VisitContext = createContext<VisitContextProps | undefined>(undefined);

// Create provider component
export const VisitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar visitas da API ao montar o componente
  useEffect(() => {
    fetchVisits();
  }, []);

  // Função para buscar visitas da API
  const fetchVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await visitService.getVisits();
      
      if (response.success) {
        setVisits(response.data as Visit[]);
      } else {
        setError(response.message);
        toast.error("Erro ao carregar visitas: " + response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao carregar visitas";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar uma nova visita
  const addVisit = async (visit: CreateVisitData): Promise<Visit | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await visitService.createVisit(visit);
      
      if (response.success) {
        const newVisit = response.data as Visit;
        setVisits((prev) => [...prev, newVisit]);
        toast.success("Solicitação de visita enviada com sucesso!");
        
        // Simulate notification being sent
        toast.info("Notificação enviada para o solicitante.");
        
        return newVisit;
      } else {
        setError(response.message);
        toast.error("Erro ao adicionar visita: " + response.message);
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao adicionar visita";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status de uma visita
  const updateVisitStatus = async (id: string, status: VisitStatus, notes?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Primeiro, obter a visita atual
      const currentVisit = visits.find(v => v.id === id);
      if (!currentVisit) {
        throw new Error("Visita não encontrada");
      }
      
      // Preparar dados para atualização
      const updateData = {
        visitDate: currentVisit.visitDate,
        visitTime: currentVisit.visitTime,
        userId: currentVisit.userId,
        status: status,
        notes: notes || currentVisit.notes || '',
        purpose: currentVisit.purpose
      };
      
      const response = await visitService.updateVisit(id, updateData);
      
      if (response.success) {
        setVisits((prev) =>
          prev.map((visit) =>
            visit.id === id
              ? {
                  ...visit,
                  status,
                  notes: notes || visit.notes,
                  updatedAt: new Date().toISOString(),
                }
              : visit
          )
        );
        toast.success(`Status da visita atualizado para ${getStatusLabel(status)}`);
      } else {
        setError(response.message);
        toast.error("Erro ao atualizar status da visita: " + response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao atualizar status da visita";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar ID do evento do Google Calendar via API
  const updateVisitGoogleEventId = async (visitId: string, googleEventId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Primeiro, obter a visita atual
      const currentVisit = visits.find(v => v.id === visitId);
      if (!currentVisit) {
        throw new Error("Visita não encontrada");
      }
      
      // Preparar dados para atualização
      const updateData = {
        visitDate: currentVisit.visitDate,
        visitTime: currentVisit.visitTime,
        userId: currentVisit.userId,
        status: currentVisit.status,
        notes: currentVisit.notes || '',
        purpose: currentVisit.purpose,
        googleEventId: googleEventId
      };
      
      const response = await visitService.updateVisit(visitId, updateData);
      
      if (response.success) {
        // Atualizar o estado local
        setVisits(prevVisits =>
          prevVisits.map(visit =>
            visit.id === visitId ? { ...visit, googleEventId } as Visit : visit
          )
        );
      } else {
        setError(response.message);
        toast.error("Erro ao atualizar evento do Google Calendar: " + response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao atualizar evento do Google Calendar";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Excluir uma visita
  const deleteVisit = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await visitService.deleteVisit(id);
      
      if (response.success) {
        // Remover do estado local
        setVisits(prevVisits => prevVisits.filter(visit => visit.id !== id));
        toast.success("Visita removida com sucesso!");
      } else {
        setError(response.message);
        toast.error("Erro ao remover visita: " + response.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao remover visita";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
    error,
    fetchVisits,
    addVisit,
    updateVisitStatus,
    getVisitById,
    getVisitsByStatus,
    getVisitsByDate,
    updateVisitGoogleEventId,
    deleteVisit
  };

  return (
    <VisitContext.Provider value={value}>
      {children}
    </VisitContext.Provider>
  );
};

// Create hook for using the context
export const useVisit = () => {
  const context = useContext(VisitContext);
  if (context === undefined) {
    throw new Error("useVisit must be used within a VisitProvider");
  }
  return context;
};
