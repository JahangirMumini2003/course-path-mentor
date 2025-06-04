
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  createdAt: string;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUserId,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Начните переписку</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
      <div className="space-y-4 pb-4">
        {messages.map((message) => {
          const isMyMessage = message.fromUserId === currentUserId;
          
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
    </ScrollArea>
  );
};
