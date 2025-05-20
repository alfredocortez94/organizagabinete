
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MessageSquare, Users } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-gray-500">contato@organizagabinete.com.br</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Telefone</h3>
              <p className="text-sm text-gray-500">(11) 4002-8922</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">WhatsApp</h3>
              <p className="text-sm text-gray-500">(11) 98765-4321</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Horário de Atendimento</h3>
              <p className="text-sm text-gray-500">Segunda a Sexta, 9h às 18h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;
