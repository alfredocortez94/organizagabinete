
import { GoogleCalendarConfig } from "./googleCalendar";

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
  notes?: string;
  assignedTo?: string;
  ticketCode?: string;
  googleEventId?: string;
}

export type VisitStatus = "pending" | "approved" | "completed" | "rejected" | "cancelled";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: 'manual' | 'import' | 'visit';
  createdAt: string;
}

// Re-export GoogleCalendarConfig para manter compatibilidade com os arquivos existentes
export type { GoogleCalendarConfig } from "./googleCalendar";
