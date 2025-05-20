
import React, { useState, useRef } from "react";
import { format, subDays, parseISO } from "date-fns";
import Layout from "@/components/Layout";
import { useVisit } from "@/context/VisitContext";
import { exportToPDF, exportToExcel } from "@/utils/exportUtils";

// Import components
import DateFilter from "@/components/reports/DateFilter";
import StatsCards from "@/components/reports/StatsCards";
import VisitBarChart from "@/components/reports/VisitBarChart";
import StatusPieChart from "@/components/reports/StatusPieChart";
import RecentVisitsTable from "@/components/reports/RecentVisitsTable";
import ExportButtons from "@/components/reports/ExportButtons";

const Reports = () => {
  const { visits } = useVisit();
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const reportRef = useRef(null);

  // Filter visits by date range
  const filteredVisits = visits.filter((visit) => {
    const visitDate = new Date(visit.visitDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return visitDate >= start && visitDate <= end;
  });

  // Count visits by status
  const statusCounts = {
    pending: filteredVisits.filter((visit) => visit.status === "pending").length,
    approved: filteredVisits.filter((visit) => visit.status === "approved").length,
    completed: filteredVisits.filter((visit) => visit.status === "completed").length,
    rejected: filteredVisits.filter((visit) => visit.status === "rejected").length,
    cancelled: filteredVisits.filter((visit) => visit.status === "cancelled").length,
  };

  // Prepare data for the pie chart
  const pieData = [
    { name: "Pendentes", value: statusCounts.pending, color: "#FFC107" },
    { name: "Aprovadas", value: statusCounts.approved, color: "#4CAF50" },
    { name: "Concluídas", value: statusCounts.completed, color: "#2196F3" },
    { name: "Rejeitadas", value: statusCounts.rejected, color: "#F44336" },
    { name: "Canceladas", value: statusCounts.cancelled, color: "#9E9E9E" },
  ].filter((item) => item.value > 0);

  // Group visits by date for the bar chart
  const visitsByDate = filteredVisits.reduce<Record<string, number>>((acc, visit) => {
    const date = format(parseISO(visit.visitDate), "dd/MM");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(visitsByDate).map(([date, count]) => ({
    date,
    visits: count,
  }));

  // Get stats for the cards
  const totalVisits = filteredVisits.length;
  const approvalRate = totalVisits
    ? ((statusCounts.approved + statusCounts.completed) / totalVisits) * 100
    : 0;
  const rejectionRate = totalVisits
    ? ((statusCounts.rejected + statusCounts.cancelled) / totalVisits) * 100
    : 0;

  // Get most recent visits for the list
  const recentVisits = [...visits]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Handle export functions
  const handleExportToPDF = () => {
    exportToPDF(filteredVisits, startDate, endDate);
  };

  const handleExportToExcel = () => {
    exportToExcel(filteredVisits, startDate, endDate);
  };

  return (
    <Layout>
      <div className="container" ref={reportRef}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Relatórios e Estatísticas</h1>
          <ExportButtons 
            onExportPDF={handleExportToPDF} 
            onExportExcel={handleExportToExcel} 
          />
        </div>

        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApplyFilter={() => {}}
        />

        <StatsCards
          totalVisits={totalVisits}
          pendingVisits={statusCounts.pending}
          approvalRate={approvalRate}
          rejectionRate={rejectionRate}
          approvedCount={statusCounts.approved + statusCounts.completed}
          rejectedCount={statusCounts.rejected + statusCounts.cancelled}
        />

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <VisitBarChart barChartData={barChartData} />
          <StatusPieChart pieData={pieData} />
        </div>

        <RecentVisitsTable recentVisits={recentVisits} />
      </div>
    </Layout>
  );
};

export default Reports;
