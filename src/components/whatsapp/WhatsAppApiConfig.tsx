
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface WhatsAppApiConfigProps {
  apiKey: string;
  setApiKey: (value: string) => void;
}

const WhatsAppApiConfig = ({ apiKey, setApiKey }: WhatsAppApiConfigProps) => {
  const { toast } = useToast();
  
  const saveApiKey = () => {
    if (apiKey) {
      toast({
        title: "API configurada",
        description: "Sua chave de API foi salva com sucesso",
      });
    } else {
      toast({
        title: "Erro",
        description: "Por favor, insira uma chave de API válida",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar API</CardTitle>
        <CardDescription>
          Configure sua chave de API do WhatsApp Business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              Chave de API
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Insira sua chave de API"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Você pode obter sua chave de API no painel do WhatsApp Business.
            </p>
          </div>
          
          <Button
            onClick={saveApiKey}
            variant="outline"
          >
            Salvar Configuração
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppApiConfig;