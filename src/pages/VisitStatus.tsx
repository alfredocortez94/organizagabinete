
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, Calendar, User, Mail, Phone, FileText, ArrowLeft, X } from "lucide-react";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { useVisit } from "@/context/VisitContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate, formatDateTime, generateQRCodeUrl } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const VisitStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVisitById } = useVisit();

  const visit = getVisitById(id || "");

  if (!visit) {
    return (
      <Layout>
        <div className="container max-w-3xl">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Solicitação não encontrada</AlertTitle>
            <AlertDescription>
              A solicitação de visita que você está procurando não existe ou foi removida.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
      </Layout>
    );
  }

  const isApproved = visit.status === "approved";

  return (
    <Layout>
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
          <StatusBadge status={visit.status} className="px-3 py-1 text-sm" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Detalhes da Solicitação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Número da Solicitação</h3>
                  <p className="mt-1 font-medium">{visit.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data da Solicitação</h3>
                  <p className="mt-1">{formatDateTime(visit.createdAt)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Informações do Visitante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{visit.visitorName}</p>
                      <p className="text-sm text-gray-500">{visit.visitorCPF}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">E-mail</p>
                      <p className="text-sm text-gray-500">{visit.visitorEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-sm text-gray-500">{visit.visitorPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Detalhes da Visita</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Data da Visita</p>
                      <p className="text-sm text-gray-500">{formatDate(visit.visitDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Horário</p>
                      <p className="text-sm text-gray-500">{visit.visitTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  <FileText className="h-5 w-5 mr-2 text-gray-400 inline align-text-bottom" />
                  Motivo da Visita
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{visit.purpose}</p>
              </div>

              {visit.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Observações</h3>
                    <p className="text-gray-700 whitespace-pre-line">{visit.notes}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {isApproved && visit.ticketCode && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-green-800">
                <Check className="h-5 w-5 mr-2 inline-block" />
                Visita Confirmada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-green-800 mb-1">
                    Sua visita foi <strong>aprovada</strong>. Apresente o QR Code no dia da visita.
                  </p>
                  <p className="text-green-700 text-sm">
                    Código: <strong>{visit.ticketCode}</strong>
                  </p>
                </div>
                <div className="border p-2 bg-white rounded">
                  <img
                    src={generateQRCodeUrl(visit.ticketCode)}
                    alt="QR Code"
                    className="w-32 h-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-blue-800 font-medium flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Status da Solicitação
          </h3>
          <div className="mt-3">
            <div className="relative">
              <div className="flex items-center mb-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center z-10 bg-green-500 text-white"
                >
                  <Check className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Solicitação Recebida</p>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(visit.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    visit.status !== "pending"
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {visit.status !== "pending" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">
                    {visit.status === "pending"
                      ? "Em Análise"
                      : visit.status === "rejected"
                      ? "Solicitação Analisada"
                      : "Solicitação Aprovada"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {visit.status === "pending"
                      ? "Sua solicitação está sendo analisada"
                      : `Última atualização: ${formatDateTime(visit.updatedAt)}`}
                  </p>
                </div>
              </div>

              {visit.status === "approved" && (
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      "bg-green-500 text-white"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Visita Confirmada</p>
                    <p className="text-sm text-gray-600">
                      Pronto para visitar no dia {formatDate(visit.visitDate)} às{" "}
                      {visit.visitTime}
                    </p>
                  </div>
                </div>
              )}

              {visit.status === "rejected" && (
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center z-10">
                    <X className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Solicitação Rejeitada</p>
                    <p className="text-sm text-gray-600">
                      Sua solicitação não foi aprovada
                    </p>
                  </div>
                </div>
              )}

              <div
                className={`absolute left-4 top-8 h-[calc(100%-40px)] w-0.5 bg-gray-200 -z-10 ${
                  visit.status === "rejected" ? "bottom-12" : ""
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início
            </Link>
          </Button>
          <Button asChild>
            <Link to="/request">Nova Solicitação</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default VisitStatus;
