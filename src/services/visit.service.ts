import api from './api';

export interface Visit {
  id: string;
  visitDate: string;
  visitTime: string;
  userId: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected' | 'cancelled';
  notes: string;
  purpose: string;
  ticketCode: string;
  createdAt: string;
}

export interface CreateVisitData {
  visitDate: string;
  visitTime: string;
  userId: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected' | 'cancelled';
  notes: string;
  purpose: string;
}

export interface UpdateVisitData extends CreateVisitData {}

export interface VisitResponse {
  success: boolean;
  data: Visit;
  message: string;
  timestamp: string;
}

export interface VisitsListResponse {
  success: boolean;
  data: Visit[];
  message: string;
  timestamp: string;
}

const visitService = {
  // Criar nova visita
  createVisit: async (visitData: CreateVisitData): Promise<VisitResponse> => {
    const response = await api.post<VisitResponse>('/visits', visitData);
    return response.data;
  },

  // Listar todas as visitas (ou apenas do usuário logado se for visitante)
  getVisits: async (): Promise<VisitsListResponse> => {
    const response = await api.get<VisitsListResponse>('/visits');
    return response.data;
  },

  // Obter detalhes de uma visita específica
  getVisitById: async (id: string): Promise<VisitResponse> => {
    const response = await api.get<VisitResponse>(`/visits/${id}`);
    return response.data;
  },

  // Atualizar visita
  updateVisit: async (id: string, visitData: UpdateVisitData): Promise<VisitResponse> => {
    const response = await api.put<VisitResponse>(`/visits/${id}`, visitData);
    return response.data;
  },

  // Excluir visita
  deleteVisit: async (id: string): Promise<VisitResponse> => {
    const response = await api.delete<VisitResponse>(`/visits/${id}`);
    return response.data;
  },

  // Formatar data para exibição
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  },

  // Obter status formatado em português
  getStatusLabel: (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      approved: 'Aprovada',
      completed: 'Realizada',
      rejected: 'Rejeitada',
      cancelled: 'Cancelada'
    };
    return statusMap[status] || status;
  },

  // Obter cor para o status
  getStatusColor: (status: string): string => {
    const colorMap: Record<string, string> = {
      pending: 'warning',
      approved: 'success',
      completed: 'info',
      rejected: 'error',
      cancelled: 'default'
    };
    return colorMap[status] || 'default';
  }
};

export default visitService;
