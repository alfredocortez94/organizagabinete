
import { Visit } from "@/context/VisitContext";
import { format } from "date-fns";

// Function to convert the visits to CSV format and download it as Excel file
export const exportToExcel = (visits: Visit[], startDate: string, endDate: string) => {
  // Header row
  const headers = [
    "Nome do Visitante", 
    "CPF", 
    "Email", 
    "Telefone", 
    "Data da Visita",
    "Horário",
    "Motivo",
    "Status",
    "Responsável"
  ].join(',');
  
  // Convert each visit to a CSV row
  const rows = visits.map(visit => {
    const status = getStatusLabel(visit.status);
    return [
      `"${visit.visitorName}"`,
      `"${visit.visitorCPF}"`,
      `"${visit.visitorEmail}"`,
      `"${visit.visitorPhone}"`,
      `"${format(new Date(visit.visitDate), "dd/MM/yyyy")}"`,
      `"${visit.visitTime}"`,
      `"${visit.purpose.replace(/"/g, '""')}"`,
      `"${status}"`,
      `"${visit.assignedTo || 'Não atribuído'}"`
    ].join(',');
  });
  
  // Combine headers and rows
  const csvContent = [headers, ...rows].join('\n');
  
  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create a link element and trigger a download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `visitas-${startDate}-ate-${endDate}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to create a PDF and trigger download
export const exportToPDF = (visits: Visit[], startDate: string, endDate: string) => {
  // This is a simple implementation that creates a basic PDF
  // In a real application, you might want to use a library like jsPDF or pdfmake
  
  // For now, we'll create a simple HTML table that gets printed as PDF
  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) {
    alert("Por favor, permita pop-ups para gerar o PDF.");
    return;
  }
  
  // Format the date range for display
  const startDateFormatted = format(new Date(startDate), "dd/MM/yyyy");
  const endDateFormatted = format(new Date(endDate), "dd/MM/yyyy");
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Relatório de Visitas</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
          }
          h1, h2 {
            color: #333;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 8px 12px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .info {
            margin-bottom: 20px;
            font-size: 14px;
          }
          .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .pending { background-color: #FFF3CD; color: #856404; }
          .approved { background-color: #D4EDDA; color: #155724; }
          .rejected { background-color: #F8D7DA; color: #721C24; }
          .completed { background-color: #CCE5FF; color: #004085; }
          .cancelled { background-color: #E2E3E5; color: #383D41; }
        </style>
      </head>
      <body>
        <h1>Relatório de Visitas</h1>
        <div class="info">
          <p><strong>Período:</strong> ${startDateFormatted} até ${endDateFormatted}</p>
          <p><strong>Total de visitas:</strong> ${visits.length}</p>
          <p><strong>Gerado em:</strong> ${format(new Date(), "dd/MM/yyyy HH:mm")}</p>
        </div>
        <h2>Lista de Visitas</h2>
        <table>
          <thead>
            <tr>
              <th>Visitante</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Motivo</th>
              <th>Status</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            ${visits.map(visit => `
              <tr>
                <td>${visit.visitorName}</td>
                <td>${format(new Date(visit.visitDate), "dd/MM/yyyy")}</td>
                <td>${visit.visitTime}</td>
                <td>${visit.purpose}</td>
                <td>
                  <span class="status ${visit.status}">
                    ${getStatusLabel(visit.status)}
                  </span>
                </td>
                <td>${visit.assignedTo || 'Não atribuído'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  // Print the window as PDF after a short delay to ensure content is loaded
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 1000);
};

// Helper function to get a user-friendly status label
function getStatusLabel(status: string): string {
  const statusMap: {[key: string]: string} = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
    completed: "Concluído",
    cancelled: "Cancelado"
  };
  return statusMap[status] || status;
}
