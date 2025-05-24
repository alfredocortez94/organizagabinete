
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { useVisit } from "@/context/VisitContext";

const StatusDistributionChart = () => {
  const { visits } = useVisit();

  // Generate pie chart data
  const generatePieData = () => {
    const approved = visits.filter(visit => visit.status === "approved").length;
    const pending = visits.filter(visit => visit.status === "pending").length;
    const rejected = visits.filter(visit => visit.status === "rejected").length;

    return [
      { name: "Aprovadas", value: approved, color: "#10B981" },
      { name: "Pendentes", value: pending, color: "#F59E0B" },
      { name: "Rejeitadas", value: rejected, color: "#EF4444" },
    ].filter(item => item.value > 0);
  };

  const pieData = generatePieData();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <PieChartIcon className="mr-2 h-5 w-5 text-blue-500" />
          Distribuição por Status
        </CardTitle>
        <CardDescription>
          Proporção de visitas por status atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => 
                    percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} visitas`, name]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Sem dados para exibir</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDistributionChart;
