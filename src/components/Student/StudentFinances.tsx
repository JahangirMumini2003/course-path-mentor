
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Course, Payment } from '../../types';
import { PaymentComponent } from '../Finance/PaymentComponent';

interface StudentFinancesProps {
  payments: Payment[];
  courses: Course[];
}

export const StudentFinances: React.FC<StudentFinancesProps> = ({ payments, courses }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {payments.map((payment) => {
          const course = courses.find(c => c.id === payment.courseId);
          return (
            <PaymentComponent
              key={payment.id}
              paymentId={payment.id}
              courseTitle={course?.title || 'Неизвестный курс'}
              amount={payment.amount}
              paid={payment.paid}
              remaining={payment.remaining}
              status={payment.status}
            />
          );
        })}
      </div>
      {payments.length === 0 && (
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
    </div>
  );
};
