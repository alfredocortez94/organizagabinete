
import React, { useState } from "react";
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
import { Search } from "lucide-react";
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

const ManageVisits = () => {
  const { visits, updateVisitStatus } = useVisit();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [newStatus, setNewStatus] = useState<VisitStatus>("approved");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUpdateStatus = () => {
    if (selectedVisit) {
      updateVisitStatus(selectedVisit.id, newStatus, assignedTo, notes);
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

  const openStatusDialog = (visit: Visit) => {
    setSelectedVisit(visit);
    setNewStatus("approved");
    setNotes("");
    setAssignedTo("");
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
                      <Button
                        variant="outline"
                        onClick={() => openStatusDialog(visit)}
                      >
                        Atualizar
                      </Button>
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
                      actionButton={
                        visit.status === "pending" || visit.status === "approved" ? (
                          <Button
                            variant={visit.status === "pending" ? "default" : "outline"}
                            onClick={() => openStatusDialog(visit)}
                          >
                            {visit.status === "pending" ? "Processar" : "Atualizar"}
                          </Button>
                        ) : undefined
                      }
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
