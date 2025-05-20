
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ onExportPDF, onExportExcel }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        onClick={onExportPDF}
        className="flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M10 11h4"/>
          <path d="M10 15h4"/>
          <path d="M10 19h4"/>
        </svg>
        Exportar PDF
      </Button>
      <Button 
        variant="outline" 
        onClick={onExportExcel}
        className="flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M8 13h2"/>
          <path d="M8 17h2"/>
          <path d="M14 13h2"/>
          <path d="M14 17h2"/>
        </svg>
        Exportar Excel
      </Button>
    </div>
  );
};

export default ExportButtons;
