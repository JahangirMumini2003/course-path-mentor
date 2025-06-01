
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { Course, Enrollment } from '../../types';

interface MyCoursesProps {
  courses: Course[];
  enrollments: Enrollment[];
}

export const MyCourses: React.FC<MyCoursesProps> = ({ courses, enrollments }) => {
  const navigate = useNavigate();

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const enrollment = enrollments.find(e => e.courseId === course.id);
          return (
            <Card 
              key={course.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCourseClick(course.id)}
            >
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
      {courses.length === 0 && (
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
    </div>
  );
};
