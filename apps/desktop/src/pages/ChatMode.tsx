
import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, Cpu, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useMissions } from '../hooks/useMissions';

interface Message {
    id: number;
    role: 'ai' | 'user';
    content: string;
    missionId?: string;
}

export default function ChatMode() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: 'ai', content: 'Hello! I can help you orchestrate your life. Try asking me to schedule tasks, analyze data, or manage your domains.' },
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { missions } = useMissions();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsThinking(true);

        try {
            // Call proposal-service to create a mission
            const { data, error } = await supabase.functions.invoke('proposal-service', {
                body: { request: input },
            });

            setIsThinking(false);

            if (error) throw error;

            if (data?.success && data?.mission) {
                const aiMessage: Message = {
                    id: Date.now() + 1,
                    role: 'ai',
                    content: `I've created a mission: "${data.mission.name}". The agents are working on it now. I'll update you when it's complete.`,
                    missionId: data.mission.id,
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                throw new Error('Failed to create mission');
            }
        } catch (err: any) {
            setIsThinking(false);
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: 'ai',
                content: `Sorry, I encountered an error: ${err.message || 'Unknown error'}. Please try again.`,
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    // Find mission for a message
    const getMissionForMessage = (msg: Message) => {
        if (!msg.missionId) return null;
        return missions.find(m => m.id === msg.missionId);
    };

    return (
        <div className="h-full flex flex-col animate-fade-in relative">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 shrink-0">
                <div>
                    <h1 className="text-xl font-medium text-white">K0RE AI</h1>
                    <p className="text-xs text-silver mt-1">Orchestrating your life OS</p>
                </div>
                <div className="bg-card border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
                    <span className="text-xs text-silver">Online</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar pr-2 space-y-6">
                {messages.map((msg) => {
                    const mission = getMissionForMessage(msg);
                    return (
                        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'ai' && (
                                <div className="w-8 h-8 rounded-lg bg-card border border-white/10 flex items-center justify-center shrink-0">
                                    <Bot size={16} className="text-gold" />
                                </div>
                            )}

                            <div className={`max-w-[80%] space-y-2`}>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-gold text-black rounded-tr-sm'
                                    : 'bg-card border border-white/10 text-white rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>

                                {/* Mission Status (only for AI messages with missions) */}
                                {msg.role === 'ai' && mission && (
                                    <div className="flex items-center gap-2 text-[10px] text-silver overflow-hidden">
                                        <div className={`flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/5 ${mission.status === 'completed' ? 'text-green' :
                                            mission.status === 'failed' ? 'text-red' :
                                                mission.status === 'in_progress' ? 'text-gold' : 'text-silver'
                                            }`}>
                                            <Cpu size={10} />
                                            <span>{mission.name}</span>
                                        </div>
                                        <span className="text-[8px] uppercase">{mission.status}</span>
                                        {mission.status === 'completed' && mission.result_summary && (
                                            <span className="text-[8px] text-green">✓ {mission.result_summary}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-[#b8860b] flex items-center justify-center shrink-0 text-black text-xs font-bold">
                                    JA
                                </div>
                            )}
                        </div>
                    );
                })}

                {isThinking && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-card border border-white/10 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-gold" />
                        </div>
                        <div className="bg-card border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-card border border-white/10 rounded-xl p-4 shrink-0">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask K0RE to organize your life..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-4 pr-12 text-sm text-white placeholder:text-silver/50 focus:outline-none focus:border-gold/50 transition-colors"
                        disabled={isThinking}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button className="p-1.5 text-silver hover:text-white transition-colors">
                            <Paperclip size={16} />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isThinking}
                            className="p-1.5 bg-gold text-black rounded-md hover:bg-[#b8860b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
                <div className="flex justify-center mt-3 gap-4">
                    <button className="text-[10px] text-silver/70 hover:text-gold transition-colors flex items-center gap-1.5">
                        <Cpu size={10} />
                        Auto-Execute Mode
                    </button>
                    <button className="text-[10px] text-silver/70 hover:text-gold transition-colors flex items-center gap-1.5">
                        <Bot size={10} />
                        Deep Reasoning
                    </button>
                </div>
            </div>
        </div>
    );
}
