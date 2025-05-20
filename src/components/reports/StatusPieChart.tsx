
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface StatusPieChartProps {
  pieData: PieChartData[];
}

const StatusPieChart: React.FC<StatusPieChartProps> = ({ pieData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <PieChartIcon className="h-5 w-5 mr-2 text-blue-500" />
          Distribuição por Status
        </CardTitle>
        <CardDescription>
          Visitas agrupadas por status no período
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} visitas`, "Quantidade"]} />
                <Legend />
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

export default StatusPieChart;
