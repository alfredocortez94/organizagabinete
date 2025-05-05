
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Calendar, 
  Mail, 
  MessageSquare, 
  Settings as SettingsIcon,
  Save
} from "lucide-react";
import GoogleCalendarConfigComponent from "@/components/google-calendar/GoogleCalendarConfig";
import { GoogleCalendarConfig } from "@/tipos/whatsapp";
import { useVisit } from "@/context/VisitContext";
import { syncVisitWithGoogleCalendar } from "@/utils/googleCalendar";

const Settings = () => {
  const { toast } = useToast();
  const { visits, updateVisitGoogleEventId } = useVisit();
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailConfirmation: true,
    emailReminder: true,
    emailStatus: true,
    smsConfirmation: false,
    smsReminder: false,
    smsStatus: false,
    whatsappConfirmation: true,
    whatsappReminder: true,
    whatsappStatus: true,
  });

  const [webhookSettings, setWebhookSettings] = useState({
    zapierUrl: "",
    n8nUrl: "",
    googleCalendarEnabled: true,
  });


  const [googleCalendarConfig, setGoogleCalendarConfig] = useState<GoogleCalendarConfig>(() => {
    const savedConfig = localStorage.getItem("googleCalendarConfig");
    return savedConfig 
      ? JSON.parse(savedConfig) 
      : { enabled: false };
  });

  useEffect(() => {
    localStorage.setItem("googleCalendarConfig", JSON.stringify(googleCalendarConfig));
  }, [googleCalendarConfig]);
  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };

  const saveNotificationSettings = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de notificação foram atualizadas com sucesso.",
    });
  };

  const handleSaveGoogleCalendarConfig = async (newConfig: GoogleCalendarConfig) => {
    setGoogleCalendarConfig(newConfig);
    
    // Se a integração foi ativada, tenta sincronizar as visitas aprovadas
    if (newConfig.enabled && newConfig.authToken && newConfig.calendarId) {
      const approvedVisits = visits.filter(visit => visit.status === "approved" && !visit.googleEventId);
      
      if (approvedVisits.length > 0) {
        toast({
          title: "Sincronização iniciada",
          description: `Sincronizando ${approvedVisits.length} visitas aprovadas com o Google Calendar...`,
        });
        
        let syncCount = 0;
        
        // Sincroniza cada visita aprovada
        for (const visit of approvedVisits) {
          const eventId = await syncVisitWithGoogleCalendar(visit, newConfig);
          if (eventId) {
            updateVisitGoogleEventId(visit.id, eventId);
            syncCount++;
          }
        }
        
        toast({
          title: "Sincronização concluída",
          description: `${syncCount} visitas foram sincronizadas com sucesso.`,
        });
      }
    }
  };

  const saveWebhookSettings = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de integração foram atualizadas com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="container max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        <Tabs defaultValue="notifications">
          <TabsList className="mb-6">
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Calendar className="h-4 w-4 mr-2" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="system">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificação</CardTitle>
                <CardDescription>
                  Configure como e quando os usuários receberão notificações sobre suas visitas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    <Mail className="h-5 w-5 inline-block mr-2 text-blue-500" />
                    E-mail
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailConfirmation" className="font-medium">
                          Confirmação de solicitação
                        </Label>
                        <p className="text-sm text-gray-500">
                          Enviar e-mail quando uma nova solicitação for recebida
                        </p>
                      </div>
                      <Switch
                        id="emailConfirmation"
                        checked={notificationSettings.emailConfirmation}
                        onCheckedChange={() => handleNotificationChange("emailConfirmation")}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailReminder" className="font-medium">
                          Lembrete de visita
                        </Label>
                        <p className="text-sm text-gray-500">
                          Enviar lembrete por e-mail um dia antes da visita
                        </p>
                      </div>
                      <Switch
                        id="emailReminder"
                        checked={notificationSettings.emailReminder}
                        onCheckedChange={() => handleNotificationChange("emailReminder")}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailStatus" className="font-medium">
                          Atualizações de status
                        </Label>
                        <p className="text-sm text-gray-500">
                          Enviar e-mail quando o status da visita mudar
                        </p>
                      </div>
                      <Switch
                        id="emailStatus"
                        checked={notificationSettings.emailStatus}
                        onCheckedChange={() => handleNotificationChange("emailStatus")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    <MessageSquare className="h-5 w-5 inline-block mr-2 text-green-500" />
                    SMS
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsConfirmation" className="font-medium">
                          Confirmação de solicitação
                        </Label>
                        <p className="text-sm text-gray-500">
                          Enviar SMS quando uma nova solicitação for recebida
                        </p>
                      </div>
                      <Switch
                        id="smsConfirmation"
                        checked={notificationSettings.smsConfirmation}
                        onCheckedChange={() => handleNotificationChange("smsConfirmation")}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsReminder" className="font-medium">
                          Lembrete de visita
                        </Label>
                        <p className="text-sm text-gray-500">
                          Enviar lembrete por SMS um dia antes da visita
                        </p>
                      </div>
                      <Switch
                        id="smsReminder"
                        checked={notificationSettings.smsReminder}
                        onCheckedChange={() => handleNotificationChange("smsReminder")}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsStatus" className="font-medium">
                          Atualizações de status
                        </Label>
                        <p className="text-sm text-gray-500">
                          Enviar SMS quando o status da visita mudar
                        </p>
                      </div>
                      <Switch
                        id="smsStatus"
                        checked={notificationSettings.smsStatus}
                        onCheckedChange={() => handleNotificationChange("smsStatus")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    <MessageSquare className="h-5 w-5 inline-block mr-2 text-green-500" />
                    WhatsApp
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="whatsappConfirmation" className="font-medium">
                          Confirmação de solicitação
                        </Label>
                        <p className="text-sm text-gray-500">
                          Enviar mensagem quando uma nova solicitação for recebida
                        </p>
                      </div>
                      <Switch
                        id="whatsappConfirmation"
                        checked={notificationSettings.whatsappConfirmation}
                        onCheckedChange={() => handleNotificationChange("whatsappConfirmation")}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="whatsappReminder" className="font-medium">
                          Lembrete de visita
                        </Label>
                        <p className="text-sm text-gray-500">
                          Enviar lembrete um dia antes da visita
                        </p>
                      </div>
                      <Switch
                        id="whatsappReminder"
                        checked={notificationSettings.whatsappReminder}
                        onCheckedChange={() => handleNotificationChange("whatsappReminder")}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="whatsappStatus" className="font-medium">
                          Atualizações de status
                        </Label>
                        <p className="text-sm text-gray-500">
                          Enviar mensagem quando o status da visita mudar
                        </p>
                      </div>
                      <Switch
                        id="whatsappStatus"
                        checked={notificationSettings.whatsappStatus}
                        onCheckedChange={() => handleNotificationChange("whatsappStatus")}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveNotificationSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
          <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integrações</CardTitle>
                  <CardDescription>
                    Configure integrações com outras ferramentas e serviços.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Webhooks</h3>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="zapierUrl">URL do Webhook do Zapier</Label>
                        <Input
                          id="zapierUrl"
                          placeholder="https://hooks.zapier.com/hooks/catch/..."
                          value={webhookSettings.zapierUrl}
                          onChange={(e) =>
                            setWebhookSettings({
                              ...webhookSettings,
                              zapierUrl: e.target.value,
                            })
                          }
                        />
                        <p className="text-sm text-gray-500">
                          Integre com o Zapier para automatizar fluxos de trabalho
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="n8nUrl">URL do Webhook do n8n</Label>
                        <Input
                          id="n8nUrl"
                          placeholder="https://your-n8n-instance.com/webhook/..."
                          value={webhookSettings.n8nUrl}
                          onChange={(e) =>
                            setWebhookSettings({
                              ...webhookSettings,
                              n8nUrl: e.target.value,
                            })
                          }
                        />
                        <p className="text-sm text-gray-500">
                          Use o n8n para automações avançadas e integrações com outros sistemas
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <GoogleCalendarConfigComponent 
                    config={googleCalendarConfig}
                    onSave={handleSaveGoogleCalendarConfig}
                  />

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Exemplo de Configuração do n8n</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm mb-2">Pseudocódigo para automação no n8n:</p>
                      <pre className="text-xs bg-black text-white p-3 rounded overflow-x-auto">
{`// Exemplo de fluxo no n8n para enviar notificações WhatsApp

// 1. Webhook Trigger para receber eventos do sistema
[Webhook] → {
  method: POST,
  path: /visit-status-changed,
  responseMode: lastNode
}

// 2. Switch para diferentes status
[Switch] → {
  rules: [
    {
      condition: data.status === "approved",
      output: "Aprovado"
    },
    {
      condition: data.status === "rejected",
      output: "Rejeitado"
    }
  ]
}

// 3. Enviar mensagem WhatsApp via Venom-Bot ou API
[HTTP Request] → {
  method: POST,
  url: "https://seu-servidor-whatsapp.com/send",
  body: {
    phone: "{{$node.Webhook.json.visitorPhone}}",
    message: "Olá {{$node.Webhook.json.visitorName}}, sua visita foi {{$node.Switch.output}}"
  }
}

// 4. Se aprovada, adicionar ao Google Calendar
[Google Calendar] → {
  authentication: "OAuth2",
  operation: "create",
  calendarId: "primary",
  event: {
    summary: "Visita: {{$node.Webhook.json.visitorName}}",
    description: "{{$node.Webhook.json.purpose}}",
    start: {
      dateTime: "{{$node.Webhook.json.visitDate}}T{{$node.Webhook.json.visitTime}}:00"
    },
    end: {
      dateTime: "{{dateAdd($node.Webhook.json.visitDate+'T'+$node.Webhook.json.visitTime+':00', 1, 'hours')}}"
    }
  }
}`}
                     </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>       
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configure detalhes gerais do sistema de marcação de visitas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="systemName">Nome do Sistema</Label>
                  <Input id="systemName" placeholder="Sistema de Marcação de Visitas" defaultValue="VisitTracker" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
                  <Textarea
                    id="welcomeMessage"
                    placeholder="Mensagem exibida na página inicial"
                    defaultValue="Bem-vindo ao Sistema de Marcação de Visitas. Agende sua visita de forma rápida e segura."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmationMessage">Mensagem de Confirmação</Label>
                  <Textarea
                    id="confirmationMessage"
                    placeholder="Mensagem enviada após confirmação da visita"
                    defaultValue="Sua visita foi confirmada. Por favor, chegue 15 minutos antes do horário marcado e apresente o QR Code na recepção."
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Horários de Atendimento</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startTime">Horário de Início</Label>
                      <Input id="startTime" type="time" defaultValue="08:00" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endTime">Horário de Término</Label>
                      <Input id="endTime" type="time" defaultValue="18:00" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Políticas de Aprovação</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoApproval" className="font-medium">
                          Aprovação Automática
                        </Label>
                        <p className="text-sm text-gray-500">
                          Aprovar automaticamente visitas se o dia tiver vagas disponíveis
                        </p>
                      </div>
                      <Switch id="autoApproval" defaultChecked={false} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxVisitsPerDay">Máximo de Visitas por Dia</Label>
                      <Input id="maxVisitsPerDay" type="number" defaultValue="15" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
