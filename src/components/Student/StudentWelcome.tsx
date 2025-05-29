
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const StudentWelcome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Добро пожаловать, {user?.firstName}!
      </h2>
      <p className="text-gray-600">
        Продолжайте обучение и достигайте новых высот
      </p>
    </div>
  );
};
