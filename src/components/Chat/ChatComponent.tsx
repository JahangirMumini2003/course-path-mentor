
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';

export const ChatComponent: React.FC = () => {
  const { user } = useAuth();
  const { messages, sendMessage } = useData();
  const [newMessage, setNewMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversationMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUserId || !user) return;

    sendMessage(user.id, selectedUserId, newMessage);
    setNewMessage('');
  };

  const selectedUser = allUsers.find((u: any) => u.id === selectedUserId);

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Список контактов */}
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
              {otherUsers.map((contact: any) => (
                <div
                  key={contact.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUserId === contact.id 
                      ? 'bg-blue-100 border-blue-300' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedUserId(contact.id)}
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

      {/* Чат */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader className="flex-shrink-0">
          {selectedUser ? (
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
          ) : (
            <>
              <CardTitle>Чат</CardTitle>
              <CardDescription>Выберите собеседника из списка контактов</CardDescription>
            </>
          )}
        </CardHeader>

        {selectedUser ? (
          <>
            {/* Сообщения */}
            <CardContent className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                {conversationMessages.length > 0 ? (
                  <div className="space-y-4 pb-4">
                    {conversationMessages.map((message) => {
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
                            <div className="break-words">{message.content}</div>
                            <div className={`text-xs mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(message.createdAt).toLocaleString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Начните переписку</p>
                    </div>
                  </div>
                )}
              </ScrollArea>

              {/* Поле ввода */}
              <div className="flex space-x-2 mt-4 pt-4 border-t">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
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
