
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { useVisit } from "@/context/VisitContext";
import { validateCPF } from "@/lib/utils";

const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const formSchema = z.object({
  visitorName: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres",
  }),
  visitorCPF: z
    .string()
    .regex(cpfRegex, { message: "CPF inválido. Use o formato: 123.456.789-00" })
    .refine((cpf) => validateCPF(cpf.replace(/\D/g, "")), {
      message: "CPF inválido",
    }),
  visitorEmail: z.string().email({
    message: "E-mail inválido",
  }),
  visitorPhone: z.string().regex(phoneRegex, {
    message: "Telefone inválido. Use o formato: (11) 98765-4321",
  }),
  visitDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, { message: "A data da visita deve ser hoje ou uma data futura" }),
  visitTime: z.string(),
  purpose: z
    .string()
    .min(10, { message: "Por favor, descreva o motivo da visita com mais detalhes" })
    .max(500, { message: "A descrição não pode ultrapassar 500 caracteres" }),
});

type FormValues = z.infer<typeof formSchema>;

const VisitRequest = () => {
  const navigate = useNavigate();
  const { addVisit } = useVisit();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visitorName: "",
      visitorCPF: "",
      visitorEmail: "",
      visitorPhone: "",
      visitDate: "",
      visitTime: "",
      purpose: "",
    },
  });

  const formatCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      form.setValue("visitorCPF", value);
    }
  };

  const formatPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{4})$/, "$1-$2");
      form.setValue("visitorPhone", value);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const visitData = {
        visitorName: data.visitorName,
        visitorCPF: data.visitorCPF,
        visitorEmail: data.visitorEmail,
        visitorPhone: data.visitorPhone,
        visitDate: data.visitDate,
        visitTime: data.visitTime,
        purpose: data.purpose,
        requestDate: new Date().toISOString(),
        userId: "", // Preencha com o ID do usuário se disponível
        status: "pending" as const, // Ou outro status inicial conforme sua lógica
        notes: "", // Ou algum valor padrão
      };
      
      const newVisit = await addVisit(visitData);
      setIsSubmitting(false);
      
      if (newVisit?.id) {
        navigate(`/status/${newVisit.id}`);
      } else {
        console.error("Não foi possível obter o ID da nova visita");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Solicitar Visita</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Informações do Visitante</h2>
                <FormField
                  control={form.control}
                  name="visitorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visitorCPF"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123.456.789-00"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            formatCPF(e);
                          }}
                          maxLength={14}
                        />
                      </FormControl>
                      <FormDescription>
                        Seu CPF é necessário para identificação no dia da visita
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="visitorEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visitorPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(11) 98765-4321"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              formatPhone(e);
                            }}
                            maxLength={15}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-medium">Informações da Visita</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="visitDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Visita</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visitTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário Preferido</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} min="08:00" max="18:00" />
                        </FormControl>
                        <FormDescription>
                          Horário de atendimento: 8h às 18h
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo da Visita</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva brevemente o motivo da sua visita"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value.length}/500 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default VisitRequest;
