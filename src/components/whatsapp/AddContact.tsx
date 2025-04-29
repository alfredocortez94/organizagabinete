
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus } from "lucide-react";
import { Contact } from "@/tipos/whatsapp";

interface AddContactProps {
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => void;
}

const AddContact = ({ addContact }: AddContactProps) => {
  const { toast } = useToast();
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    addContact({
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email || undefined,
      source: "manual"
    });

    setNewContact({
      name: "",
      phone: "",
      email: ""
    });
  };

  return (
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
          <Button onClick={handleAddContact} className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Adicionar Contato
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddContact;