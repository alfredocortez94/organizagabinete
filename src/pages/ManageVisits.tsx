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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
// Corrigida a importação para usar o tipo do arquivo correto
import { GoogleCalendarConfig } from "@/tipos/googleCalendar";
import { syncVisitWithGoogleCalendar } from "@/utils/googleCalendar";
import AdvancedFilters, { FilterOptions } from "@/components/visits/AdvancedFilters";
import { startOfDay, endOfDay, parseISO, isAfter, isBefore, isEqual } from "date-fns";

const ManageVisits = () => {
  const { visits, updateVisitStatus, updateVisitGoogleEventId } = useVisit();
  const { toast } = useToast();
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [newStatus, setNewStatus] = useState<VisitStatus>("approved");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  
  // Estado para os filtros avançados
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    status: [],
    startDate: undefined,
    endDate: undefined,
    sortBy: "visitDate",
    sortOrder: "desc",
  });
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
      // Combinando assignedTo e notes em um único campo de notas
      const combinedNotes = assignedTo 
        ? `Responsável: ${assignedTo}${notes ? `\n\n${notes}` : ''}` 
        : notes;
      
      updateVisitStatus(selectedVisit.id, newStatus, combinedNotes);
      
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

  // Função para aplicar todos os filtros às visitas
  const applyFilters = (visits: Visit[]) => {
    return visits
      .filter(visit => {
        // Filtro por status (se nenhum status selecionado, mostra todos)
        if (filters.status.length > 0 && !filters.status.includes(visit.status)) {
          return false;
        }
        
        // Filtro por termo de busca
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          const nameMatch = visit.visitorName.toLowerCase().includes(searchLower);
          const cpfMatch = visit.visitorCPF.includes(filters.searchTerm);
          const idMatch = visit.id.toLowerCase().includes(searchLower);
          const purposeMatch = visit.purpose?.toLowerCase().includes(searchLower);
          
          if (!nameMatch && !cpfMatch && !idMatch && !purposeMatch) {
            return false;
          }
        }
        
        // Filtro por data inicial
        if (filters.startDate) {
          const visitDate = typeof visit.visitDate === 'string' 
            ? parseISO(visit.visitDate) 
            : visit.visitDate;
          
          if (visitDate && !isAfter(visitDate, startOfDay(filters.startDate)) && 
              !isEqual(visitDate, startOfDay(filters.startDate))) {
            return false;
          }
        }
        
        // Filtro por data final
        if (filters.endDate) {
          const visitDate = typeof visit.visitDate === 'string' 
            ? parseISO(visit.visitDate) 
            : visit.visitDate;
          
          if (visitDate && !isBefore(visitDate, endOfDay(filters.endDate)) && 
              !isEqual(visitDate, endOfDay(filters.endDate))) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        // Ordenação
        if (filters.sortBy === "visitDate") {
          const dateA = new Date(a.visitDate).getTime();
          const dateB = new Date(b.visitDate).getTime();
          return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (filters.sortBy === "createdAt") {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (filters.sortBy === "visitorName") {
          return filters.sortOrder === "asc" 
            ? a.visitorName.localeCompare(b.visitorName) 
            : b.visitorName.localeCompare(a.visitorName);
        }
        return 0;
      });
  };
  
  // Função para obter visitas filtradas por status
  const getVisitsByStatus = (statusList: string[]) => {
    return applyFilters(visits.filter(visit => statusList.includes(visit.status)));
  };
  
  // Função para limpar todos os filtros
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      status: [],
      startDate: undefined,
      endDate: undefined,
      sortBy: "visitDate",
      sortOrder: "desc",
    });
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

        <div className="mb-4">
          <AdvancedFilters 
            filters={filters} 
            onFilterChange={setFilters} 
            onClearFilters={clearFilters} 
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CPF ou número da solicitação"
              className="pl-10"
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
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
              {getVisitsByStatus(["pending"]).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {getVisitsByStatus(["pending"]).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Aprovadas</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
            <TabsTrigger value="all">Todas</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {getVisitsByStatus(["pending"]).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Nenhuma solicitação pendente encontrada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getVisitsByStatus(["pending"]).map((visit) => (
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
            {getVisitsByStatus(["approved"]).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Nenhuma visita aprovada encontrada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getVisitsByStatus(["approved"]).map((visit) => (
                  <VisitCard
                    key={visit.id}
                    visit={visit}
                    actionButton={
                      <>
                        <Button
                          variant="outline"
                          onClick={() => openStatusDialog(visit)}
                          className="mr-2"
                        >
                          Atualizar
                        </Button>
                        {googleCalendarConfig.enabled && !visit.googleEventId && (
                          <Button
                            variant="outline"
                            onClick={() => syncVisitToGoogleCalendar(visit)}
                            className="flex items-center"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Sincronizar
                          </Button>
                        )}
                      </>
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {getVisitsByStatus(["completed", "rejected", "cancelled"]).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Nenhuma visita concluída encontrada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getVisitsByStatus(["completed", "rejected", "cancelled"]).map((visit) => (
                  <VisitCard key={visit.id} visit={visit} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {getVisitsByStatus(["pending", "approved", "completed", "rejected", "cancelled"]).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Nenhuma visita encontrada.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getVisitsByStatus(["pending", "approved", "completed", "rejected", "cancelled"]).map((visit) => (
                  <VisitCard
                    key={visit.id}
                    visit={visit}
                    actionButton={renderActionButtons(visit)}
                  />
                ))}
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
