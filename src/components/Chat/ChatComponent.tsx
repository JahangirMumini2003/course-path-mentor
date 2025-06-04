
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';
import { ContactList } from './ContactList';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { MessageInput } from './MessageInput';

export const ChatComponent: React.FC = () => {
  const { user } = useAuth();
  const { messages, sendMessage } = useData();
  const [selectedUserId, setSelectedUserId] = useState('');

  // Получаем всех пользователей для выбора получателя
  const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const otherUsers = allUsers.filter((u: any) => u.id !== user?.id);

  // Получаем сообщения только с выбранным пользователем
  const conversationMessages = messages.filter(m => 
    selectedUserId && (
      (m.fromUserId === user?.id && m.toUserId === selectedUserId) ||
      (m.fromUserId === selectedUserId && m.toUserId === user?.id)
    )
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleSendMessage = (messageContent: string) => {
    if (!selectedUserId || !user) return;
    sendMessage(user.id, selectedUserId, messageContent);
  };

  const selectedUser = allUsers.find((u: any) => u.id === selectedUserId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      <ContactList
        contacts={otherUsers}
        selectedUserId={selectedUserId}
        onSelectContact={setSelectedUserId}
      />

      <Card className="lg:col-span-2 flex flex-col">
        <ChatHeader selectedUser={selectedUser} />

        {selectedUser ? (
          <>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <ChatMessages
                messages={conversationMessages}
                currentUserId={user?.id || ''}
              />
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!selectedUserId}
              />
            </CardContent>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Выберите собеседника</p>
              <p className="text-gray-500 text-sm">Кликните на контакт слева, чтобы начать переписку</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
