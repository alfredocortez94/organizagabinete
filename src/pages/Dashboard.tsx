
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { useVisit } from "@/context/VisitContext";
import DashboardCards from "@/components/dashboard/DashboardCards";
import VisitsOverviewChart from "@/components/dashboard/VisitsOverviewChart";
import StatusDistributionChart from "@/components/dashboard/StatusDistributionChart";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import VisitTabsContent from "@/components/dashboard/VisitTabsContent";

const Dashboard = () => {
  console.log('Dashboard component is rendering');
  
  const { visits } = useVisit();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  console.log('Visits data:', visits);

  // Get today's visits
  const todayString = new Date().toISOString().split("T")[0];
  const todayVisits = visits.filter(
    (visit) => visit.visitDate === todayString && visit.status === "approved"
  );

  // Get this week's visits
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

  const thisWeekVisits = visits.filter((visit) => {
    const visitDate = new Date(visit.visitDate);
    return visitDate >= startOfWeek && visitDate <= endOfWeek && visit.status === "approved";
  });

  // Get pending visits
  const pendingVisits = visits.filter((visit) => visit.status === "pending");

  // Get visits for selected date
  const selectedDateVisits = date
    ? visits.filter(
        (visit) =>
          visit.visitDate === date.toISOString().split("T")[0] &&
          (visit.status === "approved" || visit.status === "pending")
      )
    : [];

  console.log('Dashboard data calculated successfully');

  return (
    <Layout>
      <div className="container max-w-full px-2 sm:px-4 md:px-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <DashboardCards 
          todayVisits={todayVisits} 
          pendingVisits={pendingVisits} 
          thisWeekVisits={thisWeekVisits} 
        />

        {/* Charts Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-6 sm:mb-8">
          <VisitsOverviewChart />
          <StatusDistributionChart />
        </div>

        {/* Calendar and Selected Date Visits */}
        <DashboardCalendar 
          date={date}
          setDate={setDate}
          selectedDateVisits={selectedDateVisits}
        />

        {/* Tabs for Different Visit Types */}
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="overflow-x-auto flex whitespace-nowrap w-full justify-start sm:justify-center p-1">
            <TabsTrigger value="today" className="text-xs sm:text-sm">Hoje</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">Pendentes</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm">Próximas</TabsTrigger>
          </TabsList>

          <VisitTabsContent 
            todayVisits={todayVisits}
            pendingVisits={pendingVisits}
            thisWeekVisits={thisWeekVisits}
          />
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
