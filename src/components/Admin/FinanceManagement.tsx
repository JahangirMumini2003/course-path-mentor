
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Course, Payment, User } from '../../types';

interface FinanceManagementProps {
  payments: Payment[];
  students: User[];
  courses: Course[];
}

export const FinanceManagement: React.FC<FinanceManagementProps> = ({
  payments,
  students,
  courses
}) => {
  return (
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
  );
};
