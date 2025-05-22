
import React, { useState, useEffect } from 'react';

interface SimpleCaptchaProps {
  onVerify: (verified: boolean) => void;
}

const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  // Generate a random string for the CAPTCHA
  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
  };

  // Reset the CAPTCHA
  const resetCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setUserInput('');
    setError(false);
    setVerified(false);
    onVerify(false);
  };

  // Verify the CAPTCHA
  const verifyCaptcha = () => {
    if (userInput === captchaText) {
      setVerified(true);
      setError(false);
      onVerify(true);
    } else {
      setError(true);
      setVerified(false);
      onVerify(false);
      // Generate a new CAPTCHA if the verification fails
      setCaptchaText(generateCaptcha());
      setUserInput('');
    }
  };

  useEffect(() => {
    // Generate a CAPTCHA on component mount
    setCaptchaText(generateCaptcha());
  }, []);

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Verificação de Segurança</div>
      <div className="flex items-center">
        <div 
          className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 select-none font-mono tracking-wider"
          style={{ 
            letterSpacing: '0.25em',
            background: 'linear-gradient(45deg, #f3f4f6, #ffffff)',
            textShadow: '1px 1px 1px rgba(0,0,0,0.1)',
          }}
        >
          {captchaText}
        </div>
        <button 
          onClick={() => resetCaptcha()} 
          type="button"
          className="ml-2 p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          aria-label="Refresh CAPTCHA"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-2">
        <input 
          type="text" 
          value={userInput} 
          onChange={(e) => setUserInput(e.target.value)} 
          placeholder="Digite o código acima" 
          className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {error && <p className="text-xs text-red-500">Código incorreto. Tente novamente.</p>}
        {verified && <p className="text-xs text-green-500">Verificado com sucesso!</p>}
        
        {!verified && (
          <button 
            type="button" 
            onClick={verifyCaptcha} 
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Verificar
          </button>
        )}
      </div>
    </div>
  );
};

export default SimpleCaptcha;
