
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, DollarSign, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';
import { ChatComponent } from '../Chat/ChatComponent';
import { StudentHeader } from './StudentHeader';
import { StudentWelcome } from './StudentWelcome';
import { MyCourses } from './MyCourses';
import { AvailableCourses } from './AvailableCourses';
import { StudentFinances } from './StudentFinances';
import { EditableStudentProfile } from './EditableStudentProfile';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses, enrollments, payments } = useData();
  const [activeTab, setActiveTab] = useState('my-courses');

  const myEnrollments = enrollments.filter(e => e.userId === user?.id);
  const myCourses = courses.filter(c => myEnrollments.some(e => e.courseId === c.id));
  const availableCourses = courses.filter(c => !myEnrollments.some(e => e.courseId === c.id));
  const myPayments = payments.filter(p => p.userId === user?.id);

  const isEnrolled = (courseId: string) => {
    return myEnrollments.some(e => e.courseId === courseId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StudentWelcome />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="my-courses" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Мои курсы</span>
            </TabsTrigger>
            <TabsTrigger value="available-courses" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Доступные курсы</span>
            </TabsTrigger>
            <TabsTrigger value="finances" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Финансы</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Чат</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-courses" className="space-y-6">
            <MyCourses courses={myCourses} enrollments={myEnrollments} />
          </TabsContent>

          <TabsContent value="available-courses" className="space-y-6">
            <AvailableCourses courses={availableCourses} isEnrolled={isEnrolled} />
          </TabsContent>

          <TabsContent value="finances" className="space-y-6">
            <StudentFinances payments={myPayments} courses={courses} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <ChatComponent />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <EditableStudentProfile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
