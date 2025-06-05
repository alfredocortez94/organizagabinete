
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ContactHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleRegisterClick = () => {
    toast({
      title: "Cadastro Temporariamente Indisponível",
      description: "O cadastro de novos usuários está temporariamente desabilitado. Entre em contato conosco para mais informações.",
      variant: "destructive",
    });
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center">
        <div className="mr-4 flex">
          <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            <a href="/" className="flex items-center">Organiza Gabinete</a>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="hidden sm:flex"
            >
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
            <Button 
              onClick={handleRegisterClick}
              disabled
              className="bg-gray-400 hover:bg-gray-400 cursor-not-allowed opacity-50"
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
