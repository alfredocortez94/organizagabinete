
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Import } from "lucide-react";

interface ImportContactsProps {
  handleImport: (file: File) => Promise<void>;
}

const ImportContacts = ({ handleImport }: ImportContactsProps) => {
  const { toast } = useToast();
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const onImportClick = async () => {
    if (!importFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para importar",
        variant: "destructive",
      });
      return;
    }
    
    setIsImporting(true);
    try {
      await handleImport(importFile);
      setImportFile(null);
    } catch (error) {
      console.error("Error importing contacts:", error);
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Contatos</CardTitle>
        <CardDescription>Importe contatos de um arquivo CSV</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="importFile" className="text-sm font-medium">Arquivo CSV</label>
            <Input 
              id="importFile" 
              type="file"
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Formato: nome,telefone,email (com cabeçalho)
            </p>
          </div>
          <Button onClick={onImportClick} className="w-full" disabled={!importFile || isImporting}>
            <Import className="mr-2 h-4 w-4" />
            {isImporting ? "Importando..." : "Importar Contatos"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportContacts;
