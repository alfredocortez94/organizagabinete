import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { User, ChevronRight, Calendar, MessageSquare, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();

  const recursos = [
    {
      title: "Agendamento",
      href: "#recursos",
      description: "Sistema completo de agendamento de visitas para gabinetes.",
      icon: <Calendar className="h-4 w-4" />
    },
    {
      title: "WhatsApp",
      href: "#recursos",
      description: "Integração com WhatsApp para comunicação direta.",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      title: "Relatórios",
      href: "#recursos",
      description: "Relatórios detalhados sobre suas visitas e estatísticas.",
      icon: <BarChart2 className="h-4 w-4" />
    },
    {
      title: "Configurações",
      href: "#recursos",
      description: "Personalize o sistema conforme suas necessidades.",
      icon: <Settings className="h-4 w-4" />
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container flex h-16 max-w-screen-xl items-center">
        <div className="mr-4 flex">
          <div className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
            <a href="/" className="flex items-center">Organiza Gabinete</a>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Recursos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="#recursos"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Organiza Gabinete
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Plataforma completa para gestão de visitas e agendamentos.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    {recursos.map((recurso) => (
                      <ListItem
                        key={recurso.title}
                        title={recurso.title}
                        href={recurso.href}
                        icon={recurso.icon}
                      >
                        {recurso.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#planos" className={navigationMenuTriggerStyle()}>
                  Planos
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#depoimentos" className={navigationMenuTriggerStyle()}>
                  Depoimentos
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  href="/contact" 
                  className={navigationMenuTriggerStyle()}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/contact");
                  }}
                >
                  Contato
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
});
ListItem.displayName = "ListItem";

export default Navbar;
