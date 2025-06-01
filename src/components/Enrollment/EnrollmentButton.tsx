
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';
import { useToast } from '@/hooks/use-toast';
import { PaymentModal } from '../Payment/PaymentModal';
import { PaymentSuccessModal } from '../Payment/PaymentSuccessModal';
import { Course } from '../../types';

interface EnrollmentButtonProps {
  courseId: string;
  isEnrolled: boolean;
}

export const EnrollmentButton: React.FC<EnrollmentButtonProps> = ({ courseId, isEnrolled }) => {
  const { user } = useAuth();
  const { enrollStudent, courses } = useData();
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const course = courses.find(c => c.id === courseId);

  const handleEnrollClick = () => {
    if (!user || !course) return;
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    if (!user || !course) return;

    enrollStudent(user.id, courseId);
    setShowSuccessModal(true);
    
    toast({
      title: "Успешная запись!",
      description: "Вы успешно записались на курс",
    });
  };

  if (isEnrolled) {
    return (
      <Button disabled className="w-full">
        Уже записаны
      </Button>
    );
  }

  if (!course) {
    return (
      <Button disabled className="w-full">
        Курс не найден
      </Button>
    );
  }

  return (
    <>
      <Button onClick={handleEnrollClick} className="w-full">
        Записаться на курс
      </Button>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        courseName={course.title}
        coursePrice={course.price}
      />

      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        courseName={course.title}
        coursePrice={course.price}
      />
    </>
  );
};
