
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Save, Edit, X } from 'lucide-react';

export const EditableStudentProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные успешно сохранены",
    });
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Личные данные</CardTitle>
              <CardDescription>
                Управляйте своим профилем и настройками аккаунта
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Имя</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Фамилия</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                readOnly={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
            <div>
              <Label htmlFor="role">Роль</Label>
              <Input 
                id="role" 
                value={user?.role === 'student' ? 'Студент' : 'Администратор'} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
