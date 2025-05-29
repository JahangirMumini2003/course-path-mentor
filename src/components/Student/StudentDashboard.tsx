
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, DollarSign, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { courses, enrollments, payments, messages } = useData();
  const [activeTab, setActiveTab] = useState('my-courses');

  const myEnrollments = enrollments.filter(e => e.userId === user?.id);
  const myCourses = courses.filter(c => myEnrollments.some(e => e.courseId === c.id));
  const availableCourses = courses.filter(c => !myEnrollments.some(e => e.courseId === c.id));
  const myPayments = payments.filter(p => p.userId === user?.id);
  const myMessages = messages.filter(m => m.toUserId === user?.id || m.fromUserId === user?.id);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Образовательная платформа
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {user?.firstName}!
          </h2>
          <p className="text-gray-600">
            Продолжайте обучение и достигайте новых высот
          </p>
        </div>

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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myCourses.map((course) => {
                const enrollment = myEnrollments.find(e => e.courseId === course.id);
                return (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant={enrollment?.status === 'completed' ? 'default' : 'secondary'}>
                          {enrollment?.status === 'completed' ? 'Завершен' : 
                           enrollment?.status === 'active' ? 'В процессе' : 'Приостановлен'}
                        </Badge>
                        <p className="text-sm text-gray-600">{course.description}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span>Прогресс: {enrollment?.progress || 0}%</span>
                          <span>{course.duration}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${enrollment?.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {myCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  У вас пока нет курсов
                </h3>
                <p className="text-gray-600">
                  Перейдите в раздел "Доступные курсы" для записи на обучение
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="available-courses" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Badge variant="outline">{course.level}</Badge>
                      <p className="text-sm text-gray-600">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(course.price)}
                        </span>
                        <span className="text-sm text-gray-500">{course.duration}</span>
                      </div>
                      <Button className="w-full">
                        Записаться на курс
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finances" className="space-y-6">
            <div className="grid gap-6">
              {myPayments.map((payment) => {
                const course = courses.find(c => c.id === payment.courseId);
                return (
                  <Card key={payment.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{course?.title}</CardTitle>
                      <CardDescription>Информация об оплате</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Общая сумма</p>
                          <p className="text-lg font-bold">{formatPrice(payment.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Оплачено</p>
                          <p className="text-lg font-bold text-green-600">{formatPrice(payment.paid)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Осталось</p>
                          <p className="text-lg font-bold text-red-600">{formatPrice(payment.remaining)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Статус</p>
                          <Badge variant={payment.status === 'completed' ? 'default' : 'destructive'}>
                            {payment.status === 'completed' ? 'Оплачено' : 
                             payment.status === 'partial' ? 'Частично' : 'Не оплачено'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {myPayments.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Нет платежных данных
                </h3>
                <p className="text-gray-600">
                  Запишитесь на курс, чтобы увидеть информацию об оплате
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Сообщения с преподавателями</CardTitle>
                <CardDescription>
                  Общайтесь с преподавателями для получения помощи и консультаций
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Пока нет сообщений
                  </h3>
                  <p className="text-gray-600">
                    Здесь будут отображаться ваши сообщения с преподавателями
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Личные данные</CardTitle>
                <CardDescription>
                  Управляйте своим профилем и настройками аккаунта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Имя</Label>
                      <Input id="firstName" value={user?.firstName || ''} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input id="lastName" value={user?.lastName || ''} readOnly />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user?.email || ''} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="role">Роль</Label>
                    <Input id="role" value={user?.role === 'student' ? 'Студент' : 'Администратор'} readOnly />
                  </div>
                  <Button variant="outline">
                    Редактировать профиль
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
