import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    // Exibe um indicador de carregamento enquanto verifica a autenticação
    return <div className="loading">Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se não houver restrição de papéis ou o usuário tiver o papel permitido
  if (allowedRoles.length === 0 || hasRole(allowedRoles)) {
    return <>{children}</>;
  }

  // Se o usuário não tiver permissão, redireciona para uma página de acesso negado
  return <Navigate to="/acesso-negado" replace />;
};

export default ProtectedRoute;
