
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../contexts/AuthContext';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Личные данные</CardTitle>
          <CardDescription>
            Управляйте своим профилем и настройками аккаунта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Имя</Label>
                <Input id="firstName" value={user?.firstName || ''} readOnly />
              </div>
              <div>
                <Label htmlFor="lastName">Фамилия</Label>
                <Input id="lastName" value={user?.lastName || ''} readOnly />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="role">Роль</Label>
              <Input id="role" value={user?.role === 'student' ? 'Студент' : 'Администратор'} readOnly />
            </div>
            <Button variant="outline">
              Редактировать профиль
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
