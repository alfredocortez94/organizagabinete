
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SimpleCaptcha from '@/components/login/SimpleCaptcha';
import { useLoading } from '@/hooks/useLoading';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, withLoading } = useLoading();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaVerified) {
      toast({
        title: "Verificação necessária",
        description: "Por favor, complete a verificação CAPTCHA",
        variant: "destructive",
      });
      return;
    }
    
    await withLoading(async () => {
      // Simular delay de login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCaptchaVerify = (verified: boolean) => {
    setCaptchaVerified(verified);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-card/90 shadow-xl border transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="space-y-3 text-center pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
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
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
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
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <SimpleCaptcha onVerify={handleCaptchaVerify} />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={!captchaVerified || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
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
