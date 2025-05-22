
export interface GoogleCalendarConfig {
  enabled: boolean;
  calendarId: string;
  authToken: string;
  lastSyncedAt?: Date | string;
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
  }[];
}
