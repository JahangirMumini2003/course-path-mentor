
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash } from 'lucide-react';
import { Course } from '../../types';
import { CourseForm } from './CourseForm';

interface CourseManagementProps {
  courses: Course[];
  onAddCourse: (courseData: any) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const CourseManagement: React.FC<CourseManagementProps> = ({
  courses,
  onAddCourse,
  onDeleteCourse
}) => {
  const [showAddCourse, setShowAddCourse] = useState(false);

  const handleAddCourse = (courseData: any) => {
    onAddCourse(courseData);
    setShowAddCourse(false);
  };

  return (
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
          <CourseForm
            onSubmit={handleAddCourse}
            onCancel={() => setShowAddCourse(false)}
          />
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
                      onClick={() => onDeleteCourse(course.id)}
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
  );
};
