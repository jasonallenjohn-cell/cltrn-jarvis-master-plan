'use client';

import { useEffect, useState, useRef } from 'react';
import { getMessages, sendMessage, subscribeToMessages, type Message } from '@kore/api';

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUserId = 'current-user-id'; // TODO: Get from auth context
    const adminId = 'admin-user-id'; // TODO: Get from API

    useEffect(() => {
        async function fetchMessages() {
            try {
                const msgs = await getMessages(currentUserId) as any;
                setMessages(msgs);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchMessages();

        // Subscribe to new messages
        const channel = subscribeToMessages(currentUserId, (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            channel.unsubscribe();
        };
    }, [currentUserId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        try {
            const message = await sendMessage(adminId, newMessage) as any;
            setMessages((prev) => [...prev, message]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-[#98989D]">Loading messages...</div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-white mb-2">Messages</h1>
                <p className="text-[#98989D]">Chat with your admin</p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 bg-[#1C1C1E] border border-white/[0.08] rounded-xl flex flex-col overflow-hidden">
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="text-6xl mb-4">💬</div>
                            <h3 className="text-xl font-medium text-white mb-2">No messages yet</h3>
                            <p className="text-[#98989D]">Start a conversation with your admin</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isCurrentUser = message.sender_id === currentUserId;
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${isCurrentUser
                                                ? 'bg-[#D4AF37] text-black'
                                                : 'bg-[#2C2C2E] text-white'
                                            }`}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-black/60' : 'text-[#98989D]'}`}>
                                            {new Date(message.created_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-white/[0.06] p-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 bg-[#2C2C2E] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-[#98989D] focus:outline-none focus:border-[#D4AF37]/50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            className="px-6 py-3 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#D4AF37]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
