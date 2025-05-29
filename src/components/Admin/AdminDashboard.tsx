import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Users, DollarSign, MessageCircle, LogOut, Plus, Edit, Trash } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';
import { ChatComponent } from '../Chat/ChatComponent';
import { Course, User } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { courses, enrollments, payments, messages, setCourses, setPayments } = useData();
  const [activeTab, setActiveTab] = useState('courses');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    instructor: '',
    price: 0,
    duration: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  });

  // Получаем всех студентов
  const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const students = allUsers.filter((u: User) => u.role === 'student');

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.instructor) return;

    const course: Course = {
      id: Date.now().toString(),
      ...newCourse,
      createdAt: new Date().toISOString(),
    };

    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));

    setNewCourse({
      title: '',
      description: '',
      instructor: '',
      price: 0,
      duration: '',
      level: 'beginner',
    });
    setShowAddCourse(false);
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;

    const updatedCourses = courses.map(c => 
      c.id === editingCourse.id ? editingCourse : c
    );
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(c => c.id !== courseId);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
  };

  const getStudentEnrollments = (studentId: string) => {
    return enrollments.filter(e => e.userId === studentId);
  };

  const getStudentPayments = (studentId: string) => {
    return payments.filter(p => p.userId === studentId);
  };

  const getTotalRevenue = () => {
    return payments.reduce((total, payment) => total + payment.paid, 0);
  };

  const getPendingPayments = () => {
    return payments.reduce((total, payment) => total + payment.remaining, 0);
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего курсов</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Студентов</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Получено</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalRevenue().toLocaleString()} ₽</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">К доплате</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getPendingPayments().toLocaleString()} ₽</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">Курсы</TabsTrigger>
            <TabsTrigger value="students">Студенты</TabsTrigger>
            <TabsTrigger value="finances">Финансы</TabsTrigger>
            <TabsTrigger value="messages">Сообщения</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Управление курсами</CardTitle>
                    <CardDescription>Создавайте и редактируйте курсы</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddCourse(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить курс
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddCourse && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Новый курс</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Название курса</Label>
                          <Input
                            id="title"
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                            placeholder="Введите название курса"
                          />
                        </div>
                        <div>
                          <Label htmlFor="instructor">Преподаватель</Label>
                          <Input
                            id="instructor"
                            value={newCourse.instructor}
                            onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                            placeholder="Имя преподавателя"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Описание</Label>
                        <Input
                          id="description"
                          value={newCourse.description}
                          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                          placeholder="Описание курса"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="price">Цена (₽)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newCourse.price}
                            onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Длительность</Label>
                          <Input
                            id="duration"
                            value={newCourse.duration}
                            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                            placeholder="8 недель"
                          />
                        </div>
                        <div>
                          <Label htmlFor="level">Уровень</Label>
                          <select
                            id="level"
                            value={newCourse.level}
                            onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="beginner">Начальный</option>
                            <option value="intermediate">Средний</option>
                            <option value="advanced">Продвинутый</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleAddCourse}>Создать курс</Button>
                        <Button variant="outline" onClick={() => setShowAddCourse(false)}>
                          Отмена
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Курс</TableHead>
                      <TableHead>Преподаватель</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Уровень</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-gray-500">{course.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{course.instructor}</TableCell>
                        <TableCell>{course.price.toLocaleString()} ₽</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {course.level === 'beginner' && 'Начальный'}
                            {course.level === 'intermediate' && 'Средний'}
                            {course.level === 'advanced' && 'Продвинутый'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCourse(course)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление студентами</CardTitle>
                <CardDescription>Просмотр студентов и их прогресса</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Студент</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Курсы</TableHead>
                      <TableHead>Прогресс</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const studentEnrollments = getStudentEnrollments(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="font-medium">
                              {student.firstName} {student.lastName}
                            </div>
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{studentEnrollments.length}</TableCell>
                          <TableCell>
                            {studentEnrollments.map((enrollment) => {
                              const course = courses.find(c => c.id === enrollment.courseId);
                              return (
                                <div key={enrollment.id} className="mb-1">
                                  <Badge 
                                    variant={enrollment.status === 'completed' ? 'default' : 'secondary'}
                                  >
                                    {course?.title} - {enrollment.progress}%
                                  </Badge>
                                </div>
                              );
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finances" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Финансы</CardTitle>
                <CardDescription>Управление платежами и доходами</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Студент</TableHead>
                      <TableHead>Курс</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Оплачено</TableHead>
                      <TableHead>Осталось</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => {
                      const student = students.find(s => s.id === payment.userId);
                      const course = courses.find(c => c.id === payment.courseId);
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {student?.firstName} {student?.lastName}
                          </TableCell>
                          <TableCell>{course?.title}</TableCell>
                          <TableCell>{payment.amount.toLocaleString()} ₽</TableCell>
                          <TableCell>{payment.paid.toLocaleString()} ₽</TableCell>
                          <TableCell>{payment.remaining.toLocaleString()} ₽</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                payment.status === 'completed' ? 'default' :
                                payment.status === 'partial' ? 'secondary' : 'outline'
                              }
                            >
                              {payment.status === 'completed' && 'Оплачено'}
                              {payment.status === 'partial' && 'Частично'}
                              {payment.status === 'pending' && 'Не оплачено'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Сообщения</CardTitle>
                <CardDescription>Общение со студентами</CardDescription>
              </CardHeader>
              <CardContent>
                <ChatComponent />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
