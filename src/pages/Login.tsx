import { useAuth } from "../context/AuthContext";
import SimpleCaptcha from "@/components/login/SimpleCaptcha";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, user, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Redirecionar somente se o usuário for obtido do contexto de autenticação
  // (isto significa que o token foi validado pelo AuthProvider)
  useEffect(() => {
    // Foco automático no campo de e-mail
    emailInputRef.current?.focus();
    if (user) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) {
      toast({
        title: "Valide o captcha",
        description: "Por favor, complete o captcha para prosseguir.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.email || !formData.password) {
      toast({
        title: "Preencha todos os campos",
        description: "Email e senha são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema!"
      });
      // Navegação para dashboard será feita pelo useEffect quando user for definido
    } catch (err) {
      toast({
        title: "Falha no login",
        description: error || "Email ou senha incorretos",
        variant: "destructive"
      });
    }
  };

  // Submit com Enter em qualquer campo
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCaptchaVerify = (verified: boolean) => {
    setCaptchaVerified(verified);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 shadow-xl border-0 transition-all duration-500 hover:shadow-2xl animate-fade-in">
        <CardHeader className="space-y-3 text-center pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Sistema de Agendamento
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    ref={emailInputRef}
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="username"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={loading}
                    aria-label="Email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    className="pl-10 transition-all duration-200 hover:border-blue-400 focus:border-blue-500"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    disabled={loading}
                    aria-label="Senha"
                  />
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <SimpleCaptcha onVerify={handleCaptchaVerify} />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 animate-bounce-if-loading"
              disabled={!captchaVerified || loading || !formData.email || !formData.password}
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
