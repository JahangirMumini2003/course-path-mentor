
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Course, Enrollment, User } from '../../types';

interface StudentManagementProps {
  students: User[];
  courses: Course[];
  enrollments: Enrollment[];
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  courses,
  enrollments
}) => {
  const getStudentEnrollments = (studentId: string) => {
    return enrollments.filter(e => e.userId === studentId);
  };

  return (
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
  );
};
