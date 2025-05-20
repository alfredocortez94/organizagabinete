
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Settings, Calendar, BarChart2, MessageSquare, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

// Navigation items
const navItems = [
  {
    label: "Início",
    icon: <Home className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    label: "Visitas",
    icon: <Calendar className="h-5 w-5" />,
    href: "/manage",
  },
  {
    label: "WhatsApp",
    icon: <MessageSquare className="h-5 w-5" />,
    href: "/whatsapp",
  },
  {
    label: "Relatórios",
    icon: <BarChart2 className="h-5 w-5" />,
    href: "/reports",
  },
  {
    label: "Configurações",
    icon: <Settings className="h-5 w-5" />,
    href: "/settings",
  },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if current path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar for desktop */}
      <header className="sticky top-0 z-30 border-b bg-white/75 backdrop-blur-lg dark:bg-gray-900/75 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 gap-6 sm:gap-8">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-menu"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 sm:w-72 md:hidden">
                <nav className="grid gap-6 p-4">
                  <div className="grid gap-3 p-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                          isActive(item.href)
                            ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">
              <Link to="/dashboard" className="flex items-center gap-2">
                <span className="hidden sm:inline-block">Organiza Gabinete</span>
                <span className="sm:hidden">OG</span>
              </Link>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-2 md:gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-1 px-2 py-2 text-sm font-medium rounded-md transition-colors lg:gap-2",
                  isActive(item.href)
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                )}
              >
                {item.icon}
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full overflow-hidden"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">OG</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 py-6">{children}</main>
      
      {/* Footer */}
      <footer className="border-t py-4 bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Organiza Gabinete. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
