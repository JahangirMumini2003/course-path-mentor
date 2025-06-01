
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';
import { ChatComponent } from '../Chat/ChatComponent';
import { AdminStats } from './AdminStats';
import { CourseManagement } from './CourseManagement';
import { LessonManagement } from './LessonManagement';
import { TestManagement } from './TestManagement';
import { StudentManagement } from './StudentManagement';
import { FinanceManagement } from './FinanceManagement';
import { Course, User } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { courses, enrollments, payments, messages, setCourses } = useData();
  const [activeTab, setActiveTab] = useState('courses');

  // Получаем всех студентов
  const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const students = allUsers.filter((u: User) => u.role === 'student');

  const handleAddCourse = (courseData: any) => {
    const course: Course = {
      id: Date.now().toString(),
      ...courseData,
      createdAt: new Date().toISOString(),
    };

    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
  };

  const handleDeleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(c => c.id !== courseId);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
              <p className="text-gray-600">Добро пожаловать, {user?.firstName} {user?.lastName}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <AdminStats courses={courses} students={students} payments={payments} />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">Курсы</TabsTrigger>
            <TabsTrigger value="lessons">Уроки</TabsTrigger>
            <TabsTrigger value="tests">Тесты</TabsTrigger>
            <TabsTrigger value="students">Студенты</TabsTrigger>
            <TabsTrigger value="finances">Финансы</TabsTrigger>
            <TabsTrigger value="messages">Сообщения</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <CourseManagement
              courses={courses}
              onAddCourse={handleAddCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <LessonManagement courses={courses} />
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <TestManagement courses={courses} />
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <StudentManagement
              students={students}
              courses={courses}
              enrollments={enrollments}
            />
          </TabsContent>

          <TabsContent value="finances" className="space-y-4">
            <FinanceManagement
              payments={payments}
              students={students}
              courses={courses}
            />
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <ChatComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
