import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Save } from "lucide-react";
import { GoogleCalendarConfig } from "@/tipos/googleCalendar";

interface GoogleCalendarConfigProps {
  config: GoogleCalendarConfig;
  onSave: (config: GoogleCalendarConfig) => void;
}

const GoogleCalendarConfigComponent: React.FC<GoogleCalendarConfigProps> = ({ config, onSave }) => {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(config.enabled);
  const [calendarId, setCalendarId] = useState(config.calendarId || "");
  const [authToken, setAuthToken] = useState(config.authToken || "");

  useEffect(() => {
    setEnabled(config.enabled);
    setCalendarId(config.calendarId || "");
    setAuthToken(config.authToken || "");
  }, [config]);

  const handleSave = () => {
    const updatedConfig: GoogleCalendarConfig = {
      enabled,
      calendarId: calendarId.trim(),
      authToken: authToken.trim(),
      lastSyncedAt: enabled ? new Date().toISOString() : config.lastSyncedAt
    };

    onSave(updatedConfig);
    
    toast({
      title: "Configurações salvas",
      description: "Configurações do Google Calendar foram atualizadas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
          Integração com Google Calendar
        </CardTitle>
        <CardDescription>
          Configure a integração para sincronizar visitas aprovadas com seu Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="gcalEnabled" className="font-medium">
              Ativar sincronização
            </Label>
            <p className="text-sm text-gray-500">
              Sincronizar automaticamente as visitas aprovadas com o Google Calendar
            </p>
          </div>
          <Switch
            id="gcalEnabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="calendarId">ID do Calendário</Label>
              <Input
                id="calendarId"
                placeholder="primary ou email@gmail.com"
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Use "primary" para o calendário principal ou o endereço de email completo do calendário específico
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="authToken">Token de Autenticação</Label>
              <Input
                id="authToken"
                type="password"
                placeholder="Seu token de autenticação do Google"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Token de autenticação obtido através do Google Cloud Console
              </p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <strong>Nota:</strong> Em um ambiente de produção, recomenda-se usar o fluxo completo de OAuth2 para autenticação. Esta implementação simplificada é apenas para demonstração.
              </p>
            </div>

            {config.lastSyncedAt && (
              <p className="text-xs text-gray-500">
                Última sincronização: {new Date(config.lastSyncedAt).toLocaleString()}
              </p>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoogleCalendarConfigComponent;
