
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { User, ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center">
        <div className="mr-4 flex">
          <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text dark:from-blue-400 dark:to-indigo-400">Organiza Gabinete</div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex">
              <NavigationMenuItem>
                <a href="#recursos" className={navigationMenuTriggerStyle() + " hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"}>
                  Recursos
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#planos" className={navigationMenuTriggerStyle() + " hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"}>
                  Planos
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#depoimentos" className={navigationMenuTriggerStyle() + " hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"}>
                  Depoimentos
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="/contact" className={navigationMenuTriggerStyle() + " hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"}>
                  Contato
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2">
            <div className="flex items-center mr-2 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
              <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-300 mr-1" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="data-[state=checked]:bg-blue-600"
              />
              <Moon className="h-4 w-4 text-blue-700 dark:text-blue-400 ml-1" />
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="hidden sm:flex border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
            <Button 
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Cadastre-se
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
