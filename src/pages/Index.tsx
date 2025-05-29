
import React from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../components/Auth/AuthForm';
import { StudentDashboard } from '../components/Student/StudentDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <AuthForm />;
  }

  if (user.role === 'student') {
    return <StudentDashboard />;
  }

  // TODO: Add AdminDashboard component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Админ-панель</h1>
        <p className="text-xl text-gray-600">Скоро будет доступна!</p>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
