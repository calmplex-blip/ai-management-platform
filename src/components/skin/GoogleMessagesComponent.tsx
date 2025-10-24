'use client';

import { useState } from 'react';
import { GoogleMessagesComponentProps } from '@/types/skin';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

export function GoogleMessagesComponent(props: GoogleMessagesComponentProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(props.conversationId || null);
  const [messageInput, setMessageInput] = useState('');

  const mockConversations: Conversation[] = [
    { id: '1', name: 'Sarah Johnson', lastMessage: 'Thank you for the interview opportunity!', timestamp: '10:30 AM', unread: 1, avatar: '👩' },
    { id: '2', name: 'Michael Chen', lastMessage: 'Looking forward to the next round', timestamp: 'Yesterday', unread: 0, avatar: '👨' },
    { id: '3', name: 'Emily Rodriguez', lastMessage: 'When can we schedule a call?', timestamp: '2 days ago', unread: 2, avatar: '👩' },
  ];

  const mockMessages: Record<string, Message[]> = {
    '1': [
      { id: '1', sender: 'You', content: 'Hi Sarah! Thanks for applying to the Senior React Developer position.', timestamp: '9:45 AM', isOutgoing: true },
      { id: '2', sender: 'Sarah Johnson', content: 'Thank you for reaching out! I\'m very excited about this opportunity.', timestamp: '10:15 AM', isOutgoing: false },
      { id: '3', sender: 'You', content: 'Would you be available for an interview next week?', timestamp: '10:20 AM', isOutgoing: true },
      { id: '4', sender: 'Sarah Johnson', content: 'Thank you for the interview opportunity!', timestamp: '10:30 AM', isOutgoing: false },
    ],
    '2': [
      { id: '1', sender: 'Michael Chen', content: 'Hello! I submitted my application for the Full Stack Engineer role.', timestamp: '2:30 PM', isOutgoing: false },
      { id: '2', sender: 'You', content: 'Thanks for applying! We\'ve received your application and will review it shortly.', timestamp: '3:00 PM', isOutgoing: true },
      { id: '3', sender: 'Michael Chen', content: 'Looking forward to the next round', timestamp: '3:15 PM', isOutgoing: false },
    ],
    '3': [
      { id: '1', sender: 'Emily Rodriguez', content: 'Hi! I had some questions about the Frontend Developer position.', timestamp: '11:00 AM', isOutgoing: false },
      { id: '2', sender: 'You', content: 'Of course! What would you like to know?', timestamp: '11:30 AM', isOutgoing: true },
      { id: '3', sender: 'Emily Rodriguez', content: 'When can we schedule a call?', timestamp: '12:00 PM', isOutgoing: false },
    ],
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    // In real implementation, this would send the message
    setMessageInput('');
  };

  const currentMessages = selectedConversation ? mockMessages[selectedConversation] || [] : [];

  return (
    <div className="h-full flex bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Messages</h3>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {mockConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                selectedConversation === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="text-2xl">{conversation.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {conversation.name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full flex-shrink-0">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Thread Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <div className="text-2xl">{mockConversations.find((c) => c.id === selectedConversation)?.avatar}</div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {mockConversations.find((c) => c.id === selectedConversation)?.name}
                </h3>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.isOutgoing ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block px-3 py-2 rounded-lg ${
                        message.isOutgoing
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!messageInput.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm">Select a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
