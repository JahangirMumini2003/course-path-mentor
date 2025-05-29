
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentButtonProps {
  courseId: string;
  isEnrolled: boolean;
}

export const EnrollmentButton: React.FC<EnrollmentButtonProps> = ({ courseId, isEnrolled }) => {
  const { user } = useAuth();
  const { enrollStudent } = useData();
  const { toast } = useToast();

  const handleEnroll = () => {
    if (!user) return;

    enrollStudent(user.id, courseId);
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

  return (
    <Button onClick={handleEnroll} className="w-full">
      Записаться на курс
    </Button>
  );
};
