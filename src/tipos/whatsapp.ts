
// WhatsApp contact types
export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  groups: string[];
  notes?: string;
  lastMessage?: Date;
}

export interface WhatsAppGroup {
  id: string;
  name: string;
  members: string[];
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

export interface WhatsAppApiConfig {
  apiKey?: string;
  instanceId?: string;
  phoneNumberId?: string;
  authType: 'token' | 'oauth2';
  baseUrl?: string;
  enabled: boolean;
  provider: 'whatsapp-api' | 'twilio' | 'callmebot' | 'chat-api';
}

export interface WhatsAppMessage {
  id: string;
  contactId: string;
  contactName: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  direction: 'inbound' | 'outbound';
}

export interface GoogleCalendarConfig {
  enabled: boolean;
  calendarId?: string;
  authToken?: string;
  lastSyncedAt?: string;
}
