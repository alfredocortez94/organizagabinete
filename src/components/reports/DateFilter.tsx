
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApplyFilter: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border mb-6">
      <h2 className="text-lg font-medium mb-3">Filtrar por período</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="startDate" className="text-sm font-medium">
            Data inicial
          </label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="endDate" className="text-sm font-medium">
            Data final
          </label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button className="w-full sm:w-auto" onClick={onApplyFilter}>
            Aplicar Filtro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateFilter;
