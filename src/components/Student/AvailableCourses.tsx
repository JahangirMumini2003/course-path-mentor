
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Course } from '../../types';
import { EnrollmentButton } from '../Enrollment/EnrollmentButton';

interface AvailableCoursesProps {
  courses: Course[];
  isEnrolled: (courseId: string) => boolean;
}

export const AvailableCourses: React.FC<AvailableCoursesProps> = ({ courses, isEnrolled }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
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
                <EnrollmentButton 
                  courseId={course.id}
                  isEnrolled={isEnrolled(course.id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
