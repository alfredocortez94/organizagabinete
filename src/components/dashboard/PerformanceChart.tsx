
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowUp } from "lucide-react";

// Sample data - in a real app, this would come from an API or context
const data = [
  { name: "Jan", visits: 4000, completedVisits: 2400 },
  { name: "Feb", visits: 3000, completedVisits: 1398 },
  { name: "Mar", visits: 2000, completedVisits: 9800 },
  { name: "Apr", visits: 2780, completedVisits: 3908 },
  { name: "May", visits: 1890, completedVisits: 4800 },
  { name: "Jun", visits: 2390, completedVisits: 3800 },
  { name: "Jul", visits: 3490, completedVisits: 4300 },
];

const chartConfig = {
  visits: {
    label: "Visitas Agendadas",
    theme: {
      light: "#0A84FF",
      dark: "#0A84FF",
    },
  },
  completedVisits: {
    label: "Visitas Completadas",
    theme: {
      light: "#30D158",
      dark: "#30D158",
    },
  },
};

const PerformanceChart = () => {
  return (
    <Card className="col-span-5 shadow-apple dark:shadow-apple-dark">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Desempenho de Visitas</CardTitle>
            <CardDescription>Visitas agendadas vs. completadas</CardDescription>
          </div>
          <div className="flex items-center text-sm font-medium text-green-500">
            <ArrowUp className="mr-1 h-4 w-4" />
            <span>12% aumento</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8E8E93' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8E8E93' }}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#0A84FF"
                  fillOpacity={0.2}
                  fill="#0A84FF"
                  strokeWidth={2}
                  name="Visitas Agendadas"
                />
                <Area
                  type="monotone"
                  dataKey="completedVisits"
                  stroke="#30D158"
                  fillOpacity={0.2}
                  fill="#30D158"
                  strokeWidth={2}
                  name="Visitas Completadas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
