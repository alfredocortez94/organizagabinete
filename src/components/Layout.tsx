
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, Home, User, BarChart2, Settings, Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigation = [
    { name: "Início", path: "/", icon: Home },
    { name: "Solicitar Visita", path: "/request", icon: Calendar },
    { name: "Gerenciar Visitas", path: "/manage", icon: User },
    { name: "WhatsApp", path: "/whatsapp", icon: MessageSquare },
    { name: "Relatórios", path: "/reports", icon: BarChart2 },
    { name: "Configurações", path: "/settings", icon: Settings },
  ];

  const userRoles = ["Assessor", "Político", "Comunicação"];

  const handleRoleChange = (role: string) => {
    toast({
      title: "Perfil alterado",
      description: `Você está visualizando o sistema como ${role}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm lg:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-700">Organiza Gabinete</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside
          className={cn(
            "hidden fixed inset-y-0 z-50 flex-col bg-white border-r border-gray-200 pt-5 pb-4 w-64 lg:flex lg:relative transition-all duration-300",
          )}
        >
          <div className="px-7 mb-9">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-700">Organiza Gabinete</span>
            </Link>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      location.pathname === item.path
                        ? "text-blue-700"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="px-3 mt-6">
            <div className="p-3 mb-2 text-xs font-medium text-gray-500">Visualizar como:</div>
            <div className="space-y-2">
              {userRoles.map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleRoleChange(role)}
                >
                  <User className="mr-2 h-4 w-4" />
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <aside
          className={cn(
            "fixed inset-0 z-40 flex flex-col w-full bg-white pt-5 pb-4 lg:hidden transform transition-transform duration-300 ease-in-out",
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="px-6 mb-8 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-700">VisitTracker</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "group flex items-center px-3 py-3 text-base font-medium rounded-md",
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={toggleMenu}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      location.pathname === item.path
                        ? "text-blue-700"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="px-3 mt-6">
            <div className="p-3 mb-2 text-xs font-medium text-gray-500">Visualizar como:</div>
            <div className="space-y-2">
              {userRoles.map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    handleRoleChange(role);
                    toggleMenu();
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={cn(
            "flex-1 px-4 sm:px-6 lg:px-8 py-6"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
