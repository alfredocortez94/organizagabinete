
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useVisit, Visit } from "@/context/VisitContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  MessageSquare, 
  Send, 
  Users, 
  History, 
  Settings, 
  Import, 
  UserPlus,
  Phone,
  Mail,
  UserCheck
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: 'visit' | 'import' | 'manual';
  createdAt: string;
}


const WhatsApp = () => {
    const { toast } = useToast();
    const { visits } = useVisit();
    const [apiKey, setApiKey] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [newContact, setNewContact] = useState({
      name: "",
      phone: "",
      email: ""
    });
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
    const [importFile, setImportFile] = useState<File | null>(null);
  
    // Load contacts from localStorage on mount
    useEffect(() => {
      const storedContacts = localStorage.getItem("whatsapp_contacts");
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      } else {
        // Initialize with visitor contacts if none exist yet
        importVisitsAsContacts();
      }
    }, []);
  
    // Save contacts to localStorage when they change
    useEffect(() => {
      localStorage.setItem("whatsapp_contacts", JSON.stringify(contacts));
    }, [contacts]);
  
    // Import visitors as contacts
    const importVisitsAsContacts = () => {
      const uniqueVisitors = new Map<string, Visit>();
      
      // Get unique visitors by phone number
      visits.forEach(visit => {
        if (visit.visitorPhone && !uniqueVisitors.has(visit.visitorPhone)) {
          uniqueVisitors.set(visit.visitorPhone, visit);
        }
      });
      
      const newContacts: Contact[] = Array.from(uniqueVisitors.values()).map(visit => ({
        id: generateId(),
        name: visit.visitorName,
        phone: visit.visitorPhone,
        email: visit.visitorEmail,
        source: 'visit',
        createdAt: new Date().toISOString()
      }));
      
      // Merge with existing contacts without duplicates
      const updatedContacts = [...contacts];
      newContacts.forEach(newContact => {
        if (!contacts.some(c => c.phone === newContact.phone)) {
          updatedContacts.push(newContact);
        }
      });
      
      setContacts(updatedContacts);
      toast({
        title: "Contatos importados",
        description: `${newContacts.length} contatos importados das visitas`,
      });
    };
  
    // Generate a unique ID
    const generateId = () => {
      return Math.random().toString(36).substring(2, 9);
    };
  
    // Add a new contact manually
    const addContact = () => {
      if (!newContact.name || !newContact.phone) {
        toast({
          title: "Campos obrigatórios",
          description: "Nome e telefone são obrigatórios",
          variant: "destructive",
        });
        return;
      }
  
      // Check if phone number already exists
      if (contacts.some(c => c.phone === newContact.phone)) {
        toast({
          title: "Contato já existe",
          description: "Este número de telefone já está cadastrado",
          variant: "destructive",
        });
        return;
      }
  
      const contact: Contact = {
        id: generateId(),
        name: newContact.name,
        phone: newContact.phone,
        email: newContact.email,
        source: 'manual',
        createdAt: new Date().toISOString()
      };
  
      setContacts([...contacts, contact]);
      setNewContact({
        name: "",
        phone: "",
        email: ""
      });
      
      toast({
        title: "Contato adicionado",
        description: `Contato ${contact.name} foi adicionado com sucesso`,
      });
    };
  
    // Handle import from file (CSV/Excel)
    const handleImport = async () => {
      if (!importFile) {
        toast({
          title: "Nenhum arquivo selecionado",
          description: "Por favor, selecione um arquivo para importar",
          variant: "destructive",
        });
        return;
      }
  
      try {
        const text = await importFile.text();
        const rows = text.split('\n');
        
        // Skip header row
        const dataRows = rows.slice(1);
        
        const importedContacts: Contact[] = dataRows
          .filter(row => row.trim() !== '')
          .map(row => {
            const columns = row.split(',');
            const name = columns[0]?.trim();
            const phone = columns[1]?.trim();
            const email = columns[2]?.trim();
            
            if (name && phone) {
              return {
                id: generateId(),
                name,
                phone,
                email,
                source: 'import',
                createdAt: new Date().toISOString()
              };
            }
            return null;
          })
          .filter((contact): contact is Contact => contact !== null);
        
        // Merge with existing contacts without duplicates
        const updatedContacts = [...contacts];
        let newCount = 0;
        
        importedContacts.forEach(newContact => {
          if (!contacts.some(c => c.phone === newContact.phone)) {
            updatedContacts.push(newContact);
            newCount++;
          }
        });
        
        setContacts(updatedContacts);
        setImportFile(null);
        
        toast({
          title: "Importação concluída",
          description: `${newCount} novos contatos foram importados`,
        });
        
      } catch (error) {
        console.error("Erro na importação:", error);
        toast({
          title: "Erro na importação",
          description: "Ocorreu um erro ao importar os contatos. Verifique o formato do arquivo.",
          variant: "destructive",
        });
      }
    };
  
    // Toggle contact selection
    const toggleContactSelection = (id: string) => {
      setSelectedContactIds(prev => 
        prev.includes(id) ? 
        prev.filter(contactId => contactId !== id) : 
        [...prev, id]
      );
    };
  
    // Send message to selected contacts or individual

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
        
        // Add selected contact numbers
        if (selectedContactIds.length > 0) {
          const selectedContacts = contacts.filter(c => selectedContactIds.includes(c.id));
          selectedContacts.forEach(contact => {
            if (!recipientNumbers.includes(contact.phone)) {
              recipientNumbers.push(contact.phone);
            }
          });
        }
        
        // Simulate sending - here would be the integration with WhatsApp Business API
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        toast({
          title: "Mensagem enviada",
          description: `Mensagem enviada para ${recipientNumbers.length} contato(s)`,
        });
        
        setMessage("");
        setPhoneNumber("");
        setSelectedContactIds([]);
   
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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">WhatsApp Business</h1>
        
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger value="contacts">
              <Users className="mr-2 h-4 w-4" />
              Contatos
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Configuração
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages">
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
                        required
                      />
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
                        />
                        <p className="text-xs text-muted-foreground">
                          Digite um número ou selecione contatos da lista
                        </p>
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
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Você pode obter sua chave de API no painel do WhatsApp Business.
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => {
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
                      }}
                      variant="outline"
                    >
                      Salvar Configuração
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts">
          <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Contatos</CardTitle>
                      <CardDescription>Gerencie seus contatos do WhatsApp Business</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={importVisitsAsContacts}>
                        <Users className="mr-2 h-4 w-4" />
                        Importar Visitantes
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>E-mail</TableHead>
                            <TableHead>Origem</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contacts.length > 0 ? (
                            contacts.map((contact) => (
                              <TableRow key={contact.id} className="cursor-pointer" onClick={() => toggleContactSelection(contact.id)}>
                                <TableCell>
                                  <input 
                                    type="checkbox" 
                                    checked={selectedContactIds.includes(contact.id)}
                                    onChange={() => {}}
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{contact.name}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Phone className="mr-2 h-4 w-4 text-gray-400" />
                                    {contact.phone}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {contact.email && (
                                    <div className="flex items-center">
                                      <Mail className="mr-2 h-4 w-4 text-gray-400" />
                                      {contact.email}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    contact.source === 'visit' 
                                      ? 'bg-green-100 text-green-800' 
                                      : contact.source === 'import' 
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {contact.source === 'visit' ? 'Visita' : contact.source === 'import' ? 'Importado' : 'Manual'}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                Nenhum contato encontrado
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Adicionar Contato</CardTitle>
                    <CardDescription>Cadastre um novo contato manualmente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="text-sm font-medium">Nome</label>
                        <Input 
                          id="name" 
                          value={newContact.name}
                          onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                          placeholder="Nome do contato"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                        <Input 
                          id="phone" 
                          value={newContact.phone}
                          onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                          placeholder="+5521999999999"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-sm font-medium">E-mail (opcional)</label>
                        <Input 
                          id="email" 
                          type="email"
                          value={newContact.email}
                          onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      <Button onClick={addContact} className="w-full">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Adicionar Contato
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Importar Contatos</CardTitle>
                    <CardDescription>Importe contatos de um arquivo CSV</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="importFile" className="text-sm font-medium">Arquivo CSV</label>
                        <Input 
                          id="importFile" 
                          type="file"
                          accept=".csv"
                          onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Formato: nome,telefone,email (com cabeçalho)
                        </p>
                      </div>
                      <Button onClick={handleImport} className="w-full" disabled={!importFile}>
                        <Import className="mr-2 h-4 w-4" />
                        Importar Contatos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Mensagens</CardTitle>
                <CardDescription>Visualize seu histórico de mensagens enviadas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Histórico de mensagens em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>Configure opções avançadas do WhatsApp Business</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Configurações avançadas em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WhatsApp;
