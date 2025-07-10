
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const ContactHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container flex h-16 max-w-screen-xl items-center">
        <div className="mr-4 flex">
          <div className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
            <a href="/" className="flex items-center">Organiza Gabinete</a>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
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

export default ContactHeader;
