
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Award } from 'lucide-react';
import { Course } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface CertificateModalProps {
  course: Course;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ course, onClose }) => {
  const { user } = useAuth();

  const handleDownload = () => {
    // Здесь будет логика генерации и скачивания сертификата
    console.log('Скачивание сертификата для курса:', course.title);
    // В реальном приложении здесь была бы генерация PDF
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-yellow-500" />
            <span>Сертификат об окончании курса</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Предварительный просмотр сертификата */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg border-2 border-blue-200 text-center">
            <div className="space-y-4">
              <Award className="w-16 h-16 text-yellow-500 mx-auto" />
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">СЕРТИФИКАТ</h2>
                <p className="text-lg text-gray-700">об успешном окончании курса</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">"{course.title}"</h3>
                <p className="text-gray-600">выдан</p>
                <p className="text-lg font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>

              <div className="flex justify-between items-end mt-8 pt-4 border-t border-blue-200">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Преподаватель:</p>
                  <p className="font-medium">{course.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Дата выдачи:</p>
                  <p className="font-medium">{new Date().toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">Поздравляем!</h4>
                <p className="text-sm text-green-700">
                  Вы успешно завершили курс "{course.title}". Сертификат подтверждает ваши знания и навыки.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Закрыть
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Скачать сертификат
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
