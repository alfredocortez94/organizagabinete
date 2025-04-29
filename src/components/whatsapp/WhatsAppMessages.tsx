
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Send, UserCheck } from "lucide-react";

interface WhatsAppMessagesProps {
  apiKey: string;
  selectedContactIds: string[];
}

const WhatsAppMessages = ({ apiKey, selectedContactIds }: WhatsAppMessagesProps) => {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      toast({
        title: "API Key necessária",
        description: "Por favor, insira uma chave de API válida para o WhatsApp Business",
        variant: "destructive",
      });
      return;
    }
    
    if ((!phoneNumber && selectedContactIds.length === 0) || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione pelo menos um contato e digite uma mensagem",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Determine which numbers to send to
      const recipientNumbers: string[] = [];
      
      // Add manually entered number if present
      if (phoneNumber) {
        recipientNumbers.push(phoneNumber);
      }
      
      // Add selected contact numbers (this would be handled by parent component passing contact info)
      
      // Simulate sending - here would be the integration with WhatsApp Business API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Mensagem enviada",
        description: `Mensagem enviada para ${recipientNumbers.length + selectedContactIds.length} contato(s)`,
      });
      
      setMessage("");
      setPhoneNumber("");
      
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao tentar enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Enviar Mensagem</CardTitle>
          <CardDescription>
            Envie mensagens para seus contatos via WhatsApp Business API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMessage} className="space-y-4">
            {selectedContactIds.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-md mb-3">
                <p className="text-sm font-medium text-blue-700">
                  <UserCheck className="inline-block mr-2 h-4 w-4" />
                  {selectedContactIds.length} contato(s) selecionado(s)
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium">
                Número do Telefone
              </label>
              <Input
                id="phoneNumber"
                placeholder="+5521999999999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Digite um número ou selecione contatos da lista
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Mensagem
              </label>
              <Textarea
                id="message"
                placeholder="Digite sua mensagem aqui..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
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
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-2">
                Você pode obter sua chave de API no painel do WhatsApp Business.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppMessages;