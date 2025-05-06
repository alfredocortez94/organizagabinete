
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

// Função para criar um novo evento no Google Calendar (implementação real)
async function createGoogleCalendarEvent(
  calendarId: string,
  eventData: GoogleCalendarEvent,
  authToken: string
): Promise<any> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erro na API do Google Calendar:', errorData);
    throw new Error(`Erro ao criar evento: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Função para atualizar um evento existente no Google Calendar (implementação real)
async function updateGoogleCalendarEvent(
  calendarId: string,
  eventId: string,
  eventData: GoogleCalendarEvent,
  authToken: string
): Promise<any> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erro na API do Google Calendar:', errorData);
    throw new Error(`Erro ao atualizar evento: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Função para excluir um evento do Google Calendar
export async function deleteGoogleCalendarEvent(
  calendarId: string,
  eventId: string,
  authToken: string
): Promise<boolean> {
  try {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na API do Google Calendar:', errorData);
      throw new Error(`Erro ao excluir evento: ${response.status} ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir evento do Google Calendar:', error);
    return false;
  }
}
