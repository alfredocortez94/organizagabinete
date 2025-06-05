
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie, Settings } from "lucide-react";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Sempre habilitado
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Verificar se o usuário já fez uma escolha sobre cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(cookieConsent);
      setPreferences(savedPreferences);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(necessaryOnly);
    localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly));
    setShowBanner(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handlePreferenceChange = (type: keyof typeof preferences) => {
    if (type === 'necessary') return; // Necessários não podem ser desabilitados
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl bg-white/95 backdrop-blur-sm shadow-lg border">
        <CardContent className="p-6">
          {!showPreferences ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Cookie className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Política de Cookies - LGPD</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Este site utiliza cookies para melhorar sua experiência de navegação, analisar o tráfego do site e personalizar conteúdo. 
                    Ao continuar navegando, você concorda com nossa política de cookies em conformidade com a Lei Geral de Proteção de Dados (LGPD).
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreferences(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Preferências
                </Button>
                <Button 
                  variant="outline" 
                  onClick={acceptNecessary}
                >
                  Apenas Necessários
                </Button>
                <Button 
                  onClick={acceptAll}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Aceitar Todos
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Preferências de Cookies</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowPreferences(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Cookies Necessários</h4>
                    <p className="text-sm text-gray-600">Essenciais para o funcionamento do site</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">Sempre Ativo</div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cookies de Analytics</h4>
                    <p className="text-sm text-gray-600">Nos ajudam a entender como você usa o site</p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => handlePreferenceChange('analytics')}
                      className="mr-2"
                    />
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cookies de Marketing</h4>
                    <p className="text-sm text-gray-600">Utilizados para personalizar anúncios</p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => handlePreferenceChange('marketing')}
                      className="mr-2"
                    />
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cookies Funcionais</h4>
                    <p className="text-sm text-gray-600">Melhoram a funcionalidade do site</p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={() => handlePreferenceChange('functional')}
                      className="mr-2"
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowPreferences(false)}>
                  Cancelar
                </Button>
                <Button onClick={savePreferences} className="bg-blue-600 hover:bg-blue-700">
                  Salvar Preferências
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieBanner;
