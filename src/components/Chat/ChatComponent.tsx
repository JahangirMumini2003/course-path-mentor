
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';

export const ChatComponent: React.FC = () => {
  const { user } = useAuth();
  const { messages, sendMessage } = useData();
  const [newMessage, setNewMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  // Получаем всех пользователей для выбора получателя
  const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const otherUsers = allUsers.filter((u: any) => u.id !== user?.id);

  const userMessages = messages.filter(m => 
    m.fromUserId === user?.id || m.toUserId === user?.id
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUserId || !user) return;

    sendMessage(user.id, selectedUserId, newMessage);
    setNewMessage('');
  };

  const getOtherUser = (message: any) => {
    const otherUserId = message.fromUserId === user?.id ? message.toUserId : message.fromUserId;
    return allUsers.find((u: any) => u.id === otherUserId);
  };

  return (
    <div className="space-y-6">
      {/* Отправка сообщения */}
      <Card>
        <CardHeader>
          <CardTitle>Отправить сообщение</CardTitle>
          <CardDescription>Написать сообщение преподавателю или администратору</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="recipient">Получатель</Label>
            <select
              id="recipient"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Выберите получателя</option>
              {otherUsers.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.role === 'admin' ? 'Администратор' : 'Студент'})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="message">Сообщение</Label>
            <Input
              id="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите ваше сообщение..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </div>
          <Button onClick={handleSendMessage} disabled={!newMessage.trim() || !selectedUserId}>
            <Send className="w-4 h-4 mr-2" />
            Отправить
          </Button>
        </CardContent>
      </Card>

      {/* История сообщений */}
      <Card>
        <CardHeader>
          <CardTitle>История сообщений</CardTitle>
          <CardDescription>Ваши сообщения и ответы</CardDescription>
        </CardHeader>
        <CardContent>
          {userMessages.length > 0 ? (
            <ScrollArea className="h-96 pr-4">
              <div className="space-y-4">
                {userMessages.map((message) => {
                  const otherUser = getOtherUser(message);
                  const isMyMessage = message.fromUserId === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMyMessage
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="text-xs opacity-75 mb-1">
                          {isMyMessage ? 'Вы' : `${otherUser?.firstName} ${otherUser?.lastName}`}
                        </div>
                        <div>{message.content}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {new Date(message.createdAt).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Пока нет сообщений</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
