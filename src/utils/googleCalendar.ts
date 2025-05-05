
import { Visit } from "@/context/VisitContext";
import { GoogleCalendarConfig } from "@/tipos/whatsapp";

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

// Função para criar ou atualizar um evento no Google Calendar
export async function syncVisitWithGoogleCalendar(
  visit: Visit,
  config: GoogleCalendarConfig
): Promise<string | null> {
  // Verifica se a integração está ativa e se temos as informações necessárias
  if (!config.enabled || !config.authToken || !config.calendarId) {
    console.error("Configuração do Google Calendar incompleta");
    return null;
  }

  // Verifica se a visita está aprovada
  if (visit.status !== "approved") {
    console.log("Somente visitas aprovadas são sincronizadas com o Google Calendar");
    return null;
  }

  try {
    // Prepara os dados do evento
    const eventData = createEventDataFromVisit(visit);
    
    // Determina se é criação ou atualização
    let response;
    if (visit.googleEventId) {
      // Atualiza um evento existente
      response = await updateGoogleCalendarEvent(
        config.calendarId,
        visit.googleEventId,
        eventData,
        config.authToken
      );
    } else {
      // Cria um novo evento
      response = await createGoogleCalendarEvent(
        config.calendarId,
        eventData,
        config.authToken
      );
    }

    if (response && response.id) {
      console.log("Evento sincronizado com sucesso:", response.id);
      return response.id;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao sincronizar com o Google Calendar:", error);
    return null;
  }
}

// Função para criar os dados do evento a partir de uma visita
function createEventDataFromVisit(visit: Visit): GoogleCalendarEvent {
  // Criamos uma data para início e fim do evento
  const startDateTime = new Date(`${visit.visitDate}T${visit.visitTime}`);
  
  // Por padrão, definimos a duração do evento como 1 hora
  const endDateTime = new Date(startDateTime);
  endDateTime.setHours(endDateTime.getHours() + 1);
  
  return {
    summary: `Visita: ${visit.visitorName}`,
    description: `
Visitante: ${visit.visitorName}
CPF: ${visit.visitorCPF}
E-mail: ${visit.visitorEmail}
Telefone: ${visit.visitorPhone}
Objetivo: ${visit.purpose}
Responsável: ${visit.assignedTo || "Não atribuído"}
Observações: ${visit.notes || "Nenhuma"}
Código da visita: ${visit.ticketCode || "N/A"}
    `.trim(),
    location: "Local da visita",
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: "America/Sao_Paulo",
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "America/Sao_Paulo",
    },
  };
}

// Função para criar um novo evento no Google Calendar
async function createGoogleCalendarEvent(
  calendarId: string,
  eventData: GoogleCalendarEvent,
  authToken: string
): Promise<any> {
  // Em uma implementação real, aqui faria a chamada à API do Google Calendar
  // Para fins de demonstração, apenas simulamos a criação
  console.log(`Simulando criação de evento no calendário ${calendarId}`);
  console.log("Dados do evento:", eventData);
  
  // Retorna um ID simulado
  return {
    id: "event_" + Math.random().toString(36).substring(2, 9),
    htmlLink: "https://calendar.google.com/calendar/event?eid=exemplo",
    ...eventData
  };
}

// Função para atualizar um evento existente no Google Calendar
async function updateGoogleCalendarEvent(
  calendarId: string,
  eventId: string,
  eventData: GoogleCalendarEvent,
  authToken: string
): Promise<any> {
  // Em uma implementação real, aqui faria a chamada à API do Google Calendar
  // Para fins de demonstração, apenas simulamos a atualização
  console.log(`Simulando atualização do evento ${eventId} no calendário ${calendarId}`);
  console.log("Dados atualizados:", eventData);
  
  // Retorna os dados atualizados
  return {
    id: eventId,
    htmlLink: "https://calendar.google.com/calendar/event?eid=exemplo",
    ...eventData
  };
}