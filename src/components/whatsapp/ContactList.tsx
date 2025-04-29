
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Phone, Mail, Users } from "lucide-react";
import { Contact } from "@/tipos/whatsapp";

interface ContactListProps {
  contacts: Contact[];
  selectedContactIds: string[];
  toggleContactSelection: (id: string) => void;
  importVisitsAsContacts: () => void;
}

const ContactList = ({ 
  contacts, 
  selectedContactIds, 
  toggleContactSelection,
  importVisitsAsContacts 
}: ContactListProps) => {
  return (
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
  );
};

export default ContactList;