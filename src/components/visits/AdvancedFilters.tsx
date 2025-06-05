import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface FilterOptions {
  searchTerm: string;
  status: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Contagem de filtros ativos (excluindo searchTerm que é mostrado separadamente)
  const activeFilterCount = [
    filters.status.length > 0,
    filters.startDate !== undefined,
    filters.endDate !== undefined,
    filters.sortBy !== "visitDate" || filters.sortOrder !== "desc",
  ].filter(Boolean).length;

  const handleStatusChange = (status: string) => {
    const newStatus = [...filters.status];
    const index = newStatus.indexOf(status);
    
    if (index === -1) {
      newStatus.push(status);
    } else {
      newStatus.splice(index, 1);
    }
    
    onFilterChange({ ...filters, status: newStatus });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    onFilterChange({
      ...filters,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    });
  };

  const handleClearFilters = () => {
    onClearFilters();
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nome, CPF ou código..."
            value={filters.searchTerm}
            onChange={(e) =>
              onFilterChange({ ...filters, searchTerm: e.target.value })
            }
            className="w-full pl-10"
          />
          <div className="absolute left-3 top-2.5">
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
              className="text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          {filters.searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => onFilterChange({ ...filters, searchTerm: "" })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Filtros Avançados</h4>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex flex-wrap gap-2">
                  {["pending", "approved", "completed", "rejected", "cancelled"].map(
                    (status) => (
                      <Badge
                        key={status}
                        variant={
                          filters.status.includes(status)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleStatusChange(status)}
                      >
                        {status === "pending" && "Pendente"}
                        {status === "approved" && "Aprovada"}
                        {status === "completed" && "Concluída"}
                        {status === "rejected" && "Rejeitada"}
                        {status === "cancelled" && "Cancelada"}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDate ? (
                          format(filters.startDate, "dd/MM/yyyy")
                        ) : (
                          <span>Selecionar</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.startDate}
                        onSelect={(date) =>
                          onFilterChange({ ...filters, startDate: date })
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDate ? (
                          format(filters.endDate, "dd/MM/yyyy")
                        ) : (
                          <span>Selecionar</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.endDate}
                        onSelect={(date) =>
                          onFilterChange({ ...filters, endDate: date })
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortBy">Ordenar por</Label>
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger id="sortBy">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visitDate-desc">Data da visita (mais recente)</SelectItem>
                    <SelectItem value="visitDate-asc">Data da visita (mais antiga)</SelectItem>
                    <SelectItem value="createdAt-desc">Data de criação (mais recente)</SelectItem>
                    <SelectItem value="createdAt-asc">Data de criação (mais antiga)</SelectItem>
                    <SelectItem value="visitorName-asc">Nome do visitante (A-Z)</SelectItem>
                    <SelectItem value="visitorName-desc">Nome do visitante (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Limpar Filtros
                </Button>
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Mostrar filtros ativos */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.status.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status.map(s => {
                const statusMap: Record<string, string> = {
                  pending: "Pendente",
                  approved: "Aprovada",
                  completed: "Concluída",
                  rejected: "Rejeitada",
                  cancelled: "Cancelada"
                };
                return statusMap[s];
              }).join(", ")}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => onFilterChange({ ...filters, status: [] })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.startDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              A partir de: {format(filters.startDate, "dd/MM/yyyy")}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => onFilterChange({ ...filters, startDate: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.endDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Até: {format(filters.endDate, "dd/MM/yyyy")}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => onFilterChange({ ...filters, endDate: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(filters.sortBy !== "visitDate" || filters.sortOrder !== "desc") && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Ordenado por: {
                filters.sortBy === "visitDate" 
                  ? `Data da visita (${filters.sortOrder === "asc" ? "mais antiga" : "mais recente"})` 
                  : filters.sortBy === "createdAt"
                    ? `Data de criação (${filters.sortOrder === "asc" ? "mais antiga" : "mais recente"})`
                    : `Nome do visitante (${filters.sortOrder === "asc" ? "A-Z" : "Z-A"})`
              }
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => onFilterChange({ ...filters, sortBy: "visitDate", sortOrder: "desc" })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {activeFilterCount > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleClearFilters}
            >
              Limpar todos
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
