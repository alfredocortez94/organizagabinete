
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleCalendarConfigComponent from "@/components/google-calendar/GoogleCalendarConfig";
import type { GoogleCalendarConfig } from "@/tipos/whatsapp";
import { useToast } from "@/components/ui/use-toast";
import { syncVisitWithGoogleCalendar } from "@/utils/googleCalendar";
import { useVisit } from "@/context/VisitContext";

const Settings = () => {
  const { toast } = useToast();
  const { visits, updateVisitGoogleEventId } = useVisit();
  const [googleCalendarConfig, setGoogleCalendarConfig] = useState<GoogleCalendarConfig>(() => {
    const savedConfig = localStorage.getItem("googleCalendarConfig");
    return savedConfig
      ? JSON.parse(savedConfig)
      : {
          enabled: false,
          calendarId: undefined,
          authToken: undefined,
          lastSyncedAt: undefined,
        };
  });

  const handleSaveGoogleCalendarConfig = async (config: GoogleCalendarConfig) => {
    setGoogleCalendarConfig(config);
    localStorage.setItem("googleCalendarConfig", JSON.stringify(config));
  
    // If enabled, attempt to sync approved visits
    if (config.enabled && config.calendarId && config.authToken) {
      const approvedVisits = visits.filter(visit => 
        visit.status === "approved" && !visit.googleEventId);
      
      if (approvedVisits.length > 0) {
        toast({
          title: "Sincronizando visitas",
          description: `${approvedVisits.length} visitas serão sincronizadas com o Google Calendar.`,
        });
  
        for (const visit of approvedVisits) {
          try {
            const eventId = await syncVisitWithGoogleCalendar(visit, config);
            if (eventId) {
              updateVisitGoogleEventId(visit.id, eventId);
              toast({
                title: "Visita sincronizada",
                description: `A visita de ${visit.visitorName} foi sincronizada com sucesso.`,
              });
            }
          } catch (error) {
            console.error("Erro ao sincronizar visita:", error);
          }
        }
      }
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        
        <Tabs defaultValue="google-calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="google-calendar">Google Calendar</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="general">Geral</TabsTrigger>
          </TabsList>
          
          <TabsContent value="google-calendar" className="space-y-4">
            <GoogleCalendarConfigComponent 
              config={googleCalendarConfig}
              onSave={handleSaveGoogleCalendarConfig}
            />
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Configurações de notificações serão adicionadas em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Configurações gerais serão adicionadas em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
