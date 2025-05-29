
import React from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../components/Auth/AuthForm';
import { StudentDashboard } from '../components/Student/StudentDashboard';
import { AdminDashboard } from '../components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <AuthForm />;
  }

  if (user.role === 'student') {
    return <StudentDashboard />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Неизвестная роль</h1>
        <p className="text-xl text-gray-600">Обратитесь к администратору!</p>
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
