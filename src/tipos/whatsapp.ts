export interface Contact {
    id: string;
    name: string;
    phone: string;
    email?: string;
    source: 'visit' | 'import' | 'manual';
    createdAt: string;
  }


export interface GoogleCalendarConfig {
  enabled: boolean;
  authToken?: string;
  calendarId?: string;
  lastSyncedAt?: string;
}