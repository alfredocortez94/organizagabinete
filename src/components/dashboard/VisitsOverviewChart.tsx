
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useVisit } from "@/context/VisitContext";

const VisitsOverviewChart = () => {
  const { visits } = useVisit();

  // Generate data for the last 7 days
  const generateChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      
      const dayVisits = visits.filter(visit => visit.visitDate === dateString);
      const approved = dayVisits.filter(visit => visit.status === "approved").length;
      const pending = dayVisits.filter(visit => visit.status === "pending").length;
      
      data.push({
        date: date.toLocaleDateString("pt-BR", { weekday: "short" }),
        aprovadas: approved,
        pendentes: pending,
        total: approved + pending,
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
              Visitas nos Últimos 7 Dias
            </CardTitle>
            <CardDescription>Evolução das visitas aprovadas e pendentes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8E8E93' }}
                fontSize={12}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8E8E93' }}
                fontSize={12}
                width={30}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="aprovadas"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                name="Aprovadas"
              />
              <Line
                type="monotone"
                dataKey="pendentes"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                name="Pendentes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitsOverviewChart;
