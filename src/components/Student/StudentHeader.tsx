
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const StudentHeader: React.FC = () => {
  const { user, logout } = useAuth();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="mfti-logo">
              МФТИ
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              МФТИ Learn
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 mfti-gradient rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user && getInitials(user.firstName, user.lastName)}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
