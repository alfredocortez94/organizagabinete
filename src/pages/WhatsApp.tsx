import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useVisit, Visit } from "@/context/VisitContext";

import { 
    MessageSquare, 
    Users, 
    History, 
    Settings
  } from "lucide-react";
  import { Contact } from "@/tipos/whatsapp";  

  // Components
  import WhatsAppMessages from "@/components/whatsapp/WhatsAppMessages";
  import WhatsAppApiConfig from "@/components/whatsapp/WhatsAppApiConfig";
  import ContactList from "@/components/whatsapp/ContactList";
  import AddContact from "@/components/whatsapp/AddContact";
  import ImportContacts from "@/components/whatsapp/ImportContacts";
  import PlaceholderCard from "@/components/whatsapp/PlaceHolderCard";


const WhatsApp = () => {
    const { toast } = useToast();
    const { visits } = useVisit();
    const [apiKey, setApiKey] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
 
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

      // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };
  
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
        source: 'visit' as const,
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
  
    // Add a new contact manually
    const addContact = (contactData: Omit<Contact, "id" | "createdAt">) => {
  
      // Check if phone number already exists
      if (contacts.some(c => c.phone === contactData.phone)) {
        toast({
          title: "Contato já existe",
          description: "Este número de telefone já está cadastrado",
          variant: "destructive",
        });
        return;
      }
  
      const contact: Contact = {
        id: generateId(),
        ...contactData,
        createdAt: new Date().toISOString()
      };
  
      setContacts(prevContacts => [...prevContacts, contact]);
      toast({
        title: "Contato adicionado",
        description: `Contato ${contact.name} foi adicionado com sucesso`,
      });
    };
  
    // Handle import from file (CSV/Excel)
    const handleImport = async (importFile: File) => {
      try {
        const text = await importFile.text();
        const rows = text.split('\n');
        
        // Skip header row
        const dataRows = rows.slice(1);
        
        const importedContacts: (Contact | null)[] = dataRows
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
                email: email || undefined,
                source: 'import' as const,
                createdAt: new Date().toISOString()
              };
            }
            return null;
        });
      
        // Filter out null values with a type guard
        const validContacts: Contact[] = importedContacts.filter((contact): contact is Contact => contact !== null);
        
        // Merge with existing contacts without duplicates
        const updatedContacts = [...contacts];
        let newCount = 0;
        
        validContacts.forEach(newContact => {
          if (!contacts.some(c => c.phone === newContact.phone)) {
            updatedContacts.push(newContact);
            newCount++;
          }
        });
        
        setContacts(updatedContacts);
        
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
        throw error;
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
          <WhatsAppMessages 
              apiKey={apiKey} 
              selectedContactIds={selectedContactIds} 
            />
          </TabsContent>
          
          <TabsContent value="contacts">
          <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
              <ContactList 
                  contacts={contacts}
                  selectedContactIds={selectedContactIds}
                  toggleContactSelection={toggleContactSelection}
                  importVisitsAsContacts={importVisitsAsContacts}
                />
              </div>
              
              <div className="space-y-8">
              <AddContact addContact={addContact} />
              <ImportContacts handleImport={handleImport} />
                
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
          <PlaceholderCard 
              title="Histórico de Mensagens" 
              description="Visualize seu histórico de mensagens enviadas" 
            /> 
          </TabsContent>
          
          <TabsContent value="settings">
          <WhatsAppApiConfig apiKey={apiKey} setApiKey={setApiKey} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WhatsApp;
