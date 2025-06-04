
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface ContactListProps {
  contacts: Contact[];
  selectedUserId: string;
  onSelectContact: (userId: string) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selectedUserId,
  onSelectContact,
}) => {
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Контакты</span>
        </CardTitle>
        <CardDescription>Выберите собеседника</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUserId === contact.id 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onSelectContact(contact.id)}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {getUserInitials(contact.firstName, contact.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {contact.role === 'admin' ? 'Администратор' : 'Студент'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
