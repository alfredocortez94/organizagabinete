import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useVisit, Visit, VisitStatus } from "../context/VisitContext";
import userService from "../services/user.service";
import { toast } from "sonner";

// UI Components
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface VisitFormProps {
  visitToEdit?: Visit;
  onSuccess?: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const VisitForm: React.FC<VisitFormProps> = ({ visitToEdit, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addVisit, updateVisitStatus } = useVisit();
  const [loading, setLoading] = useState(false);
  const [visitors, setVisitors] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    visitDate: "",
    visitTime: "",
    userId: "",
    purpose: "",
    status: "pending" as VisitStatus,
    notes: "",
  });

  // Carregar visitantes disponíveis
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await userService.getUsers();
        if (response.success) {
          // Filtrar apenas usuários com papel de visitante
          const visitorsList = response.data.filter(
            (user) => user.role === "visitante"
          );
          setVisitors(visitorsList);
        }
      } catch (error) {
        console.error("Erro ao carregar visitantes:", error);
        toast.error("Não foi possível carregar a lista de visitantes");
      }
    };

    fetchVisitors();
  }, []);

  // Preencher o formulário se estiver editando
  useEffect(() => {
    if (visitToEdit) {
      setFormData({
        visitDate: formatDateForInput(visitToEdit.visitDate),
        visitTime: visitToEdit.visitTime,
        userId: visitToEdit.userId,
        purpose: visitToEdit.purpose,
        status: visitToEdit.status,
        notes: visitToEdit.notes || "",
      });
    }
  }, [visitToEdit]);

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar dados
      if (!formData.visitDate || !formData.visitTime || !formData.userId || !formData.purpose) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // Formatar data para ISO
      const visitDate = new Date(formData.visitDate);
      visitDate.setHours(0, 0, 0, 0);

      const visitData = {
        ...formData,
        visitDate: visitDate.toISOString(),
      };

      if (visitToEdit) {
        // Atualizar visita existente
        await updateVisitStatus(
          visitToEdit.id,
          formData.status,
          formData.notes
        );
        toast.success("Visita atualizada com sucesso!");
      } else {
        // Criar nova visita
        const result = await addVisit(visitData);
        if (result) {
          toast.success("Visita agendada com sucesso!");
        }
      }

      // Callback de sucesso ou redirecionamento
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/visitas");
      }
    } catch (error) {
      console.error("Erro ao salvar visita:", error);
      toast.error("Ocorreu um erro ao salvar a visita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {visitToEdit ? "Editar Visita" : "Agendar Nova Visita"}
        </CardTitle>
        <CardDescription>
          {visitToEdit
            ? "Atualize os detalhes da visita"
            : "Preencha os dados para agendar uma visita"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visitDate">Data da Visita</Label>
              <Input
                id="visitDate"
                name="visitDate"
                type="date"
                value={formData.visitDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visitTime">Horário</Label>
              <Input
                id="visitTime"
                name="visitTime"
                type="time"
                value={formData.visitTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">Visitante</Label>
            <Select
              value={formData.userId}
              onValueChange={(value) => handleSelectChange("userId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o visitante" />
              </SelectTrigger>
              <SelectContent>
                {visitors.map((visitor) => (
                  <SelectItem key={visitor.id} value={visitor.id}>
                    {visitor.name} ({visitor.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Motivo da Visita</Label>
            <Textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </div>

          {visitToEdit && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleSelectChange("status", value as VisitStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovada</SelectItem>
                  <SelectItem value="completed">Realizada</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Observações adicionais sobre a visita"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Salvando..."
              : visitToEdit
              ? "Atualizar Visita"
              : "Agendar Visita"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VisitForm;
