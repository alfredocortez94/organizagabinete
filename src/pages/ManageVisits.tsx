
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Calendar } from "lucide-react";
import Layout from "@/components/Layout";
import { useVisit, Visit, VisitStatus } from "@/context/VisitContext";
import VisitCard from "@/components/VisitCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { GoogleCalendarConfig } from "@/tipos/whatsapp";
import { syncVisitWithGoogleCalendar } from "@/utils/googleCalendar";

const ManageVisits = () => {
  const { visits, updateVisitStatus, updateVisitGoogleEventId } = useVisit();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [newStatus, setNewStatus] = useState<VisitStatus>("approved");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [googleCalendarConfig, setGoogleCalendarConfig] = useState<GoogleCalendarConfig>(() => {
    const savedConfig = localStorage.getItem("googleCalendarConfig");
    return savedConfig 
      ? JSON.parse(savedConfig) 
      : { enabled: false };
  });

  // Carregar as configurações do Google Calendar
  useEffect(() => {
    const savedConfig = localStorage.getItem("googleCalendarConfig");
    if (savedConfig) {
      setGoogleCalendarConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleUpdateStatus = async () => {
    if (selectedVisit) {
      updateVisitStatus(selectedVisit.id, newStatus, assignedTo, notes);
      
      // Se a visita foi aprovada e a sincronização com o Google Calendar está ativada
      if (newStatus === "approved" && googleCalendarConfig.enabled && 
          googleCalendarConfig.authToken && googleCalendarConfig.calendarId) {
        try {
          // Cria um objeto de visita atualizado com o novo status
          const updatedVisit = {
            ...selectedVisit,
            status: newStatus,
            assignedTo: assignedTo || selectedVisit.assignedTo,
            notes: notes || selectedVisit.notes
          };
          
          toast({
            title: "Sincronizando",
            description: "Adicionando visita ao Google Calendar...",
          });
          
          const eventId = await syncVisitWithGoogleCalendar(updatedVisit, googleCalendarConfig);
          
          if (eventId) {
            updateVisitGoogleEventId(selectedVisit.id, eventId);
            toast({
              title: "Sincronização concluída",
              description: "Visita adicionada com sucesso ao Google Calendar.",
            });
          } else {
            toast({
              title: "Erro na sincronização",
              description: "Não foi possível adicionar a visita ao Google Calendar.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Erro ao sincronizar com o Google Calendar:", error);
          toast({
            title: "Erro na sincronização",
            description: "Ocorreu um erro ao sincronizar com o Google Calendar.",
            variant: "destructive",
          });
        }
      }
      
      setDialogOpen(false);
    }
  };

  const pendingVisits = visits.filter((visit) => visit.status === "pending");
  const approvedVisits = visits.filter((visit) => visit.status === "approved");
  const completedVisits = visits.filter(
    (visit) => visit.status === "completed" || visit.status === "rejected" || visit.status === "cancelled"
  );

  const filteredVisits = (statusList: string[]) => {
    return visits
      .filter((visit) => statusList.includes(visit.status))
      .filter(
        (visit) =>
          visit.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.visitorCPF.includes(searchTerm) ||
          visit.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const syncVisitToGoogleCalendar = async (visit: Visit) => {
    if (!googleCalendarConfig.enabled || !googleCalendarConfig.authToken || !googleCalendarConfig.calendarId) {
      toast({
        title: "Configuração incompleta",
        description: "Configure a integração com o Google Calendar nas configurações.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Sincronizando",
        description: "Adicionando visita ao Google Calendar...",
      });
      
      const eventId = await syncVisitWithGoogleCalendar(visit, googleCalendarConfig);
      
      if (eventId) {
        updateVisitGoogleEventId(visit.id, eventId);
        toast({
          title: "Sincronização concluída",
          description: "Visita adicionada com sucesso ao Google Calendar.",
        });
      } else {
        toast({
          title: "Erro na sincronização",
          description: "Não foi possível adicionar a visita ao Google Calendar.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao sincronizar com o Google Calendar:", error);
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um erro ao sincronizar com o Google Calendar.",
        variant: "destructive",
      });
    }
  };

  const renderActionButtons = (visit: Visit) => {
    const buttons = [];
    
    if (visit.status === "pending" || visit.status === "approved") {
      buttons.push(
        <Button
          key="update"
          variant={visit.status === "pending" ? "default" : "outline"}
          onClick={() => openStatusDialog(visit)}
          className="mr-2"
        >
          {visit.status === "pending" ? "Processar" : "Atualizar"}
        </Button>
      );
    }
    
    // Adiciona botão de sincronização para visitas aprovadas sem googleEventId
    if (visit.status === "approved" && googleCalendarConfig.enabled && !visit.googleEventId) {
      buttons.push(
        <Button
          key="sync"
          variant="outline"
          onClick={() => syncVisitToGoogleCalendar(visit)}
          className="flex items-center"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Sincronizar</span>
        </Button>
      );
    }
    
    return buttons.length > 0 ? buttons : undefined;
  };

  const openStatusDialog = (visit: Visit) => {
    setSelectedVisit(visit);
    setNewStatus("approved");
    setNotes(visit.notes || "");
    setAssignedTo(visit.assignedTo || "");
    setDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Visitas</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CPF ou número da solicitação"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-72">
            <Select defaultValue="today">
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="tomorrow">Amanhã</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="all">Todas as datas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pendentes
              {pendingVisits.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {pendingVisits.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Aprovadas</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
            <TabsTrigger value="all">Todas</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {filteredVisits(["pending"]).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Nenhuma solicitação pendente encontrada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVisits(["pending"]).map((visit) => (
                  <VisitCard
                    key={visit.id}
                    visit={visit}
                    actionButton={
                      <Button onClick={() => openStatusDialog(visit)}>
                        Processar
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {filteredVisits(["approved"]).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Nenhuma visita aprovada encontrada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVisits(["approved"]).map((visit) => (
                  <VisitCard
                    key={visit.id}
                    visit={visit}
                    actionButton={
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => openStatusDialog(visit)}
                        >
                          Atualizar
                        </Button>
                        {googleCalendarConfig.enabled && !visit.googleEventId && (
                          <Button
                            variant="outline"
                            onClick={() => syncVisitToGoogleCalendar(visit)}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Calendar
                          </Button>
                        )}
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredVisits(["completed", "rejected", "cancelled"]).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Nenhuma visita concluída encontrada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVisits(["completed", "rejected", "cancelled"]).map((visit) => (
                  <VisitCard key={visit.id} visit={visit} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {visits.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVisits(["pending", "approved", "completed", "rejected", "cancelled"]).map(
                  (visit) => (
                    <VisitCard
                      key={visit.id}
                      visit={visit}
                      actionButton={renderActionButtons(visit)}
                    />
                  )
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Atualizar Status da Visita</DialogTitle>
              <DialogDescription>
                {selectedVisit && (
                  <div className="text-sm text-gray-500 mt-1">
                    <p>
                      <strong>Visitante:</strong> {selectedVisit.visitorName}
                    </p>
                    <p>
                      <strong>Data:</strong> {formatDate(selectedVisit.visitDate)} às{" "}
                      {selectedVisit.visitTime}
                    </p>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newStatus}
                  onValueChange={(value: VisitStatus) => setNewStatus(value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Responsável</Label>
                <Input
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Nome do responsável pelo atendimento"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione observações ou instruções"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateStatus}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ManageVisits;
