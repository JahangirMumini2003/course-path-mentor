
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface ChatHeaderProps {
  selectedUser: ChatUser | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser }) => {
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!selectedUser) {
    return (
      <CardHeader className="flex-shrink-0">
        <CardTitle>Чат</CardTitle>
        <CardDescription>Выберите собеседника из списка контактов</CardDescription>
      </CardHeader>
    );
  }

  return (
    <CardHeader className="flex-shrink-0">
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-blue-500 text-white">
            {getUserInitials(selectedUser.firstName, selectedUser.lastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">
            {selectedUser.firstName} {selectedUser.lastName}
          </CardTitle>
          <CardDescription>
            {selectedUser.role === 'admin' ? 'Администратор' : 'Студент'}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
};
