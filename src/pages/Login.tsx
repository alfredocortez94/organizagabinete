
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SimpleCaptcha from '@/components/login/SimpleCaptcha';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Usuário principal do sistema
  const adminUser = {
    email: 'admin@organizagabinete.com',
    password: 'admin123'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaVerified) {
      toast({
        title: "Verificação necessária",
        description: "Por favor, complete a verificação CAPTCHA",
        variant: "destructive",
      });
      return;
    }
    
    // Verificar se é o usuário principal
    if (formData.email === adminUser.email && formData.password === adminUser.password) {
      // Login bem-sucedido
      localStorage.setItem('currentUser', JSON.stringify({
        email: adminUser.email,
        role: 'admin',
        name: 'Administrador'
      }));
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema de gerenciamento!",
      });
      
      navigate('/dashboard');
    } else {
      // Login falhou
      toast({
        title: "Falha no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCaptchaVerify = (verified: boolean) => {
    setCaptchaVerified(verified);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 dark:bg-gray-900/80 shadow-xl border-0 transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="space-y-3 text-center pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Sistema de Agendamento
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base dark:text-gray-300">
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
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 transition-all duration-200 hover:border-blue-400 focus:border-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
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
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
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

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <SimpleCaptcha onVerify={handleCaptchaVerify} />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
              disabled={!captchaVerified}
            >
              Entrar
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Para o primeiro acesso, use:</p>
            <p className="font-medium">Email: admin@organizagabinete.com</p>
            <p className="font-medium">Senha: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
