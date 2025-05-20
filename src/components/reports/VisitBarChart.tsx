
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface BarChartData {
  date: string;
  visits: number;
}

interface VisitBarChartProps {
  barChartData: BarChartData[];
}

const VisitBarChart: React.FC<VisitBarChartProps> = ({ barChartData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
          Visitas por Dia
        </CardTitle>
        <CardDescription>
          Quantidade de visitas agendadas por dia no período
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visits" fill="#3B82F6" name="Visitas" />
              </BarChart>
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

export default VisitBarChart;
