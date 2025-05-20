
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { User, ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Toggle } from "@/components/ui/toggle";

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
                <a href="#recursos" className={navigationMenuTriggerStyle()}>
                  Recursos
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#planos" className={navigationMenuTriggerStyle()}>
                  Planos
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#depoimentos" className={navigationMenuTriggerStyle()}>
                  Depoimentos
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="/contact" className={navigationMenuTriggerStyle()}>
                  Contato
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2">
            <Toggle
              aria-label="Alternar tema"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-2"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Toggle>
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="hidden sm:flex"
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
