
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
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-[#000000]">
      {/* Navbar for desktop */}
      <header className="sticky top-0 z-30 border-b glass-effect">
        <div className="container flex items-center justify-between h-16 gap-6 sm:gap-8">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 md:hidden text-apple-blue dark:text-apple-blue">
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
              <SheetContent side="left" className="w-[280px] sm:w-[320px] md:hidden">
                <div className="py-4">
                  <div className="text-xl font-semibold mb-6 px-2">Organiza Gabinete</div>
                  <nav className="space-y-1.5 px-2 mt-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-full px-4 py-2.5 transition-all",
                          isActive(item.href)
                            ? "bg-apple-blue text-white"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold">
              <Link to="/dashboard" className="flex items-center gap-2 tracking-tight">
                <span className="hidden sm:inline-block">Organiza Gabinete</span>
                <span className="sm:hidden">OG</span>
              </Link>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-full transition-all lg:px-4",
                  isActive(item.href)
                    ? "bg-apple-blue text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
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
              className="rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-800 transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-[1.3rem] w-[1.3rem] text-yellow-400" />
              ) : (
                <Moon className="h-[1.3rem] w-[1.3rem] text-slate-700" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full overflow-hidden focus-visible:ring-offset-0 focus-visible:ring-0"
                >
                  <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-base bg-apple-blue text-white">OG</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 p-1.5">
                <div className="flex flex-col p-2 mb-1">
                  <span className="text-sm font-medium">Usuário</span>
                  <span className="text-xs text-muted-foreground">admin@gabinete.org</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-md cursor-pointer py-1.5 px-2">
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-md cursor-pointer py-1.5 px-2" asChild>
                  <Link to="/settings">Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-md cursor-pointer text-red-600 py-1.5 px-2">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 py-6 container px-4 md:px-6">{children}</main>
      
      {/* Footer */}
      <footer className="border-t py-6 bg-white/60 dark:bg-[#1C1C1E]/60 dark:border-gray-800 backdrop-blur-sm">
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
