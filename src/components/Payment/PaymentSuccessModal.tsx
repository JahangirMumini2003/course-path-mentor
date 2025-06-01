
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Calendar } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  coursePrice: number;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  courseName,
  coursePrice
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Вычисляем дату начала курса (через неделю)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 7);
  const formattedStartDate = startDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            Оплата прошла успешно!
          </DialogTitle>
          <DialogDescription>
            Вы успешно записались на курс "{courseName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-green-800">
                Оплачено: {formatPrice(coursePrice)}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Курс начнется:</p>
                <p className="text-gray-600">{formattedStartDate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Приглашение отправлено:</p>
                <p className="text-gray-600">Проверьте вашу электронную почту</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={onClose} className="w-full">
              Отлично!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
