
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';
import { useToast } from '@/hooks/use-toast';
import { Payment } from '../../types';

interface PaymentComponentProps {
  paymentId: string;
  courseTitle: string;
  amount: number;
  paid: number;
  remaining: number;
  status: string;
}

export const PaymentComponent: React.FC<PaymentComponentProps> = ({
  paymentId,
  courseTitle,
  amount,
  paid,
  remaining,
  status
}) => {
  const { user } = useAuth();
  const { payments, setPayments } = useData();
  const { toast } = useToast();
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = () => {
    if (paymentAmount <= 0 || paymentAmount > remaining) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму для оплаты",
        variant: "destructive",
      });
      return;
    }

    const updatedPayments = payments.map(p => {
      if (p.id === paymentId) {
        const newPaid = p.paid + paymentAmount;
        const newRemaining = p.remaining - paymentAmount;
        const newStatus: Payment['status'] = newRemaining === 0 ? 'completed' : newRemaining < p.amount ? 'partial' : 'pending';
        
        return {
          ...p,
          paid: newPaid,
          remaining: newRemaining,
          status: newStatus
        };
      }
      return p;
    });

    setPayments(updatedPayments);
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
    setPaymentAmount(0);

    toast({
      title: "Платеж успешен!",
      description: `Оплачено ${formatPrice(paymentAmount)}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{courseTitle}</CardTitle>
        <CardDescription>Управление платежами</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Общая сумма</p>
              <p className="text-lg font-bold">{formatPrice(amount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Оплачено</p>
              <p className="text-lg font-bold text-green-600">{formatPrice(paid)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Осталось</p>
              <p className="text-lg font-bold text-red-600">{formatPrice(remaining)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Статус</p>
              <Badge variant={status === 'completed' ? 'default' : 'destructive'}>
                {status === 'completed' ? 'Оплачено' : 
                 status === 'partial' ? 'Частично' : 'Не оплачено'}
              </Badge>
            </div>
          </div>

          {remaining > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Доплатить</h4>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor={`payment-${paymentId}`}>Сумма к доплате</Label>
                  <Input
                    id={`payment-${paymentId}`}
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    placeholder="0"
                    max={remaining}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handlePayment} disabled={paymentAmount <= 0}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Оплатить
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Максимум: {formatPrice(remaining)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
