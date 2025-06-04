
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  approveAdmin: (userId: string) => void;
  getPendingAdmins: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Создаем главного админа если его нет
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const mainAdmin = users.find((u: any) => u.email === 'admin@mail.ru');
    if (!mainAdmin) {
      const mainAdminUser = {
        id: 'main-admin',
        email: 'admin@mail.ru',
        password: '5555',
        firstName: 'Главный',
        lastName: 'Администратор',
        role: 'admin',
        isApproved: true,
        createdAt: new Date().toISOString(),
      };
      users.push(mainAdminUser);
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      // Проверяем, если это админ (не главный), то он должен быть подтвержден
      if (foundUser.role === 'admin' && foundUser.email !== 'admin@mail.ru' && !foundUser.isApproved) {
        return false; // Админ не подтвержден
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: any) => u.email === userData.email)) {
      return false;
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isApproved: userData.role === 'student' ? true : false, // Студенты подтверждаются автоматически
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Если это студент, сразу входим
    if (userData.role === 'student') {
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    }
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, ...userData } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const approveAdmin = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === userId ? { ...u, isApproved: true } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const getPendingAdmins = (): User[] => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter((u: any) => u.role === 'admin' && !u.isApproved);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUser, 
      approveAdmin, 
      getPendingAdmins 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
