'use client';

import { useState, useEffect, useRef } from 'react';
import { createCommandCenterClient } from '@kore/api';

interface Conversation {
    userId: string;
    userName: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    priority: boolean;
}

interface Message {
    id: string;
    sender_id: string;
    recipient_id: string;
    content: string;
    read_at: string | null;
    created_at: string;
}

export default function AdminMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [broadcastMode, setBroadcastMode] = useState(false);
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation);
        }
    }, [selectedConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function loadConversations() {
        setLoading(true);
        try {
            const supabase = createCommandCenterClient() as any;

            // Get all messages grouped by user
            const { data: allMessages } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (allMessages) {
                const convMap = new Map<string, Conversation>();

                for (const msg of allMessages) {
                    const otherUserId = msg.sender_id === 'admin' ? msg.recipient_id : msg.sender_id;

                    if (!convMap.has(otherUserId)) {
                        convMap.set(otherUserId, {
                            userId: otherUserId,
                            userName: otherUserId.substring(0, 8) + '...',
                            lastMessage: msg.content,
                            lastMessageAt: msg.created_at,
                            unreadCount: 0,
                            priority: false,
                        });
                    }

                    if (!msg.read_at && msg.sender_id !== 'admin') {
                        const conv = convMap.get(otherUserId)!;
                        conv.unreadCount++;
                    }
                }

                setConversations(Array.from(convMap.values()));
            }
        } catch (e) {
            console.error('Failed to load conversations:', e);
        } finally {
            setLoading(false);
        }
    }

    async function loadMessages(userId: string) {
        try {
            const supabase = createCommandCenterClient() as any;
            const { data } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
                .order('created_at', { ascending: true });

            if (data) setMessages(data);
        } catch (e) {
            console.error('Failed to load messages:', e);
        }
    }

    async function sendMessageToUser() {
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const supabase = createCommandCenterClient() as any;
            await supabase.from('messages').insert({
                sender_id: 'admin',
                recipient_id: selectedConversation,
                content: newMessage.trim(),
            });

            setNewMessage('');
            await loadMessages(selectedConversation);
        } catch (e) {
            console.error('Failed to send message:', e);
        }
    }

    async function sendBroadcast() {
        if (!broadcastMessage.trim()) return;

        try {
            const supabase = createCommandCenterClient() as any;
            const { data: users } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('role', 'customer');

            if (users) {
                const inserts = users.map((u: any) => ({
                    sender_id: 'admin',
                    recipient_id: u.id,
                    content: broadcastMessage.trim(),
                }));

                await supabase.from('messages').insert(inserts);
            }

            setBroadcastMode(false);
            setBroadcastMessage('');
            await loadConversations();
        } catch (e) {
            console.error('Broadcast failed:', e);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Communication Hub</h1>
                    <p className="text-[#98989D]">Message customers directly or broadcast to all</p>
                </div>
                <button
                    onClick={() => setBroadcastMode(true)}
                    className="px-6 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-lg font-medium transition-colors"
                >
                    📢 Broadcast Message
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Conversation List */}
                <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/[0.08]">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder:text-[#98989D] text-sm focus:outline-none focus:border-[#D4AF37]/50"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
                        {loading ? (
                            <div className="p-8 text-center text-[#98989D]">Loading...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center text-[#98989D]">
                                <div className="text-3xl mb-2">💬</div>
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <button
                                    key={conv.userId}
                                    onClick={() => setSelectedConversation(conv.userId)}
                                    className={`w-full text-left p-4 transition-colors ${selectedConversation === conv.userId
                                        ? 'bg-[#D4AF37]/10'
                                        : 'hover:bg-white/[0.02]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-white text-sm">
                                            {conv.priority && <span className="text-red-400 mr-1">🔴</span>}
                                            {conv.userName}
                                        </span>
                                        {conv.unreadCount > 0 && (
                                            <span className="bg-[#D4AF37] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[#98989D] truncate">{conv.lastMessage}</p>
                                    <p className="text-xs text-[#98989D]/50 mt-1">
                                        {new Date(conv.lastMessageAt).toLocaleString()}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="col-span-2 bg-[#0A0A0A] border border-white/[0.08] rounded-xl overflow-hidden flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-white">
                                        {conversations.find(c => c.userId === selectedConversation)?.userName || selectedConversation}
                                    </h3>
                                    <p className="text-xs text-[#98989D]">Direct message</p>
                                </div>
                                <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
                                    🚩 Flag Priority
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender_id === 'admin' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.sender_id === 'admin'
                                                ? 'bg-[#D4AF37] text-black rounded-br-md'
                                                : 'bg-white/[0.08] text-white rounded-bl-md'
                                                }`}
                                        >
                                            <p>{msg.content}</p>
                                            <p className={`text-xs mt-1 ${msg.sender_id === 'admin' ? 'text-black/50' : 'text-[#98989D]'
                                                }`}>
                                                {new Date(msg.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-white/[0.08]">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessageToUser()}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder:text-[#98989D] focus:outline-none focus:border-[#D4AF37]/50"
                                    />
                                    <button
                                        onClick={sendMessageToUser}
                                        className="px-6 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-lg font-medium transition-colors"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[#98989D]">
                            <div className="text-center">
                                <div className="text-5xl mb-4">💬</div>
                                <p className="text-lg font-medium">Select a conversation</p>
                                <p className="text-sm mt-1">Choose from the left panel to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Broadcast Modal */}
            {broadcastMode && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-8 max-w-lg w-full mx-4">
                        <h3 className="text-xl font-bold text-white mb-4">📢 Broadcast Message</h3>
                        <p className="text-[#98989D] text-sm mb-4">This message will be sent to all customers.</p>
                        <textarea
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                            placeholder="Type your broadcast message..."
                            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder:text-[#98989D] focus:outline-none focus:border-[#D4AF37]/50 h-32 resize-none"
                        />
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={sendBroadcast}
                                disabled={!broadcastMessage.trim()}
                                className="flex-1 px-4 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Send to All Customers
                            </button>
                            <button
                                onClick={() => { setBroadcastMode(false); setBroadcastMessage(''); }}
                                className="px-4 py-3 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
