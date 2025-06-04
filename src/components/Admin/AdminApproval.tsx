
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export const AdminApproval: React.FC = () => {
  const { user, approveAdmin, getPendingAdmins } = useAuth();
  const pendingAdmins = getPendingAdmins();

  const handleApprove = (userId: string, firstName: string, lastName: string) => {
    approveAdmin(userId);
    toast({
      title: "Администратор подтвержден",
      description: `${firstName} ${lastName} теперь может войти в систему`,
    });
  };

  // Показываем только главному админу
  if (user?.email !== 'admin@mail.ru') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5" />
          <span>Подтверждение администраторов</span>
        </CardTitle>
        <CardDescription>
          Управляйте доступом новых администраторов к системе
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingAdmins.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">
                    {admin.firstName} {admin.lastName}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {new Date(admin.createdAt).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(admin.id, admin.firstName, admin.lastName)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Подтвердить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет заявок на подтверждение
            </h3>
            <p className="text-gray-600">
              Все администраторы уже подтверждены
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
