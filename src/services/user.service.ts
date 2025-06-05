import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'secretario' | 'visitante';
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'secretario' | 'visitante';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'secretario' | 'visitante';
}

export interface UserResponse {
  success: boolean;
  data: User;
  message: string;
  timestamp: string;
}

export interface UsersListResponse {
  success: boolean;
  data: User[];
  message: string;
  timestamp: string;
}

const userService = {
  // Listar todos os usuários
  getUsers: async (): Promise<UsersListResponse> => {
    const response = await api.get<UsersListResponse>('/users');
    return response.data;
  },

  // Obter detalhes de um usuário específico
  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  // Criar novo usuário
  createUser: async (userData: CreateUserData): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/users', userData);
    return response.data;
  },

  // Atualizar usuário
  updateUser: async (id: string, userData: UpdateUserData): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/users/${id}`, userData);
    return response.data;
  },

  // Excluir usuário
  deleteUser: async (id: string): Promise<UserResponse> => {
    const response = await api.delete<UserResponse>(`/users/${id}`);
    return response.data;
  },

  // Obter label para o papel do usuário
  getRoleLabel: (role: string): string => {
    const roleMap: Record<string, string> = {
      admin: 'Administrador',
      secretario: 'Secretário',
      visitante: 'Visitante'
    };
    return roleMap[role] || role;
  }
};

export default userService;
