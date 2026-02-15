
"use client";

import { useEffect, useState } from 'react';
import { createCommandCenterClient } from '@kore/api';
import { Loader2, Play, Activity, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

// Config
const AGENTS = [
    { name: 'Broker', slug: 'agent-broker', division: 'Trillium' },
    { name: 'Builder', slug: 'agent-builder', division: 'Trillium' },
    { name: 'Advisor', slug: 'agent-advisor', division: 'Trillium' },
    { name: 'Creator', slug: 'agent-creator', division: 'Trillium' },
    { name: 'Healer', slug: 'agent-healer', division: 'Trillium' },
    { name: 'Prospector', slug: 'agent-prospector', division: 'Arterial' },
    { name: 'Cadence', slug: 'agent-cadence', division: 'Arterial' },
    { name: 'Intel', slug: 'agent-intel', division: 'Arterial' },
    { name: 'Deal Closer', slug: 'agent-deal-closer', division: 'Arterial' },
    { name: 'Success', slug: 'agent-success', division: 'Arterial' },
    { name: 'Sales Ops', slug: 'agent-sales-ops', division: 'Arterial' },
    { name: 'Chief', slug: 'agent-chief', division: 'Cross' }
];

export default function CommandCenterPage() {
    const supabase = (createCommandCenterClient as any)();
    const [missions, setMissions] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [prompt, setPrompt] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // 1. Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const { data: missionsData } = await supabase
                .from('ops_missions')
                .select(`*, ops_mission_steps (*)`)
                .order('created_at', { ascending: false })
                .limit(10);

            const { data: eventsData } = await supabase
                .from('ops_events')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (missionsData) setMissions(missionsData);
            if (eventsData) setEvents(eventsData);
            setIsLoading(false);
        };

        fetchData();

        // 2. Realtime Subscription
        const channel = supabase
            .channel('command-center')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ops_missions' }, () => {
                fetchData();
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ops_events' }, (payload: any) => {
                setEvents((prev: any[]) => [payload.new, ...prev].slice(0, 50));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // 3. Trigger Proposal
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsSubmitting(true);
        setSubmitMessage(null);
        try {
            const { data, error } = await supabase.functions.invoke('proposal-service', {
                body: { title: prompt, description: prompt, source: 'user_dashboard' }
            });

            if (error) throw error;
            setSubmitMessage({ type: 'success', text: `Mission Initiated: Agent assigned → ${data?.assigned_agent || 'auto'}` });
            setPrompt('');
        } catch (error: any) {
            setSubmitMessage({ type: 'error', text: `Failed: ${error.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Command Center</h1>
                    <p className="text-gray-400 mt-1">Agent Orchestration & Mission Control</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border border-green-500/50 text-green-500 bg-green-500/10">
                        <Activity className="w-3 h-3" /> System Operational
                    </span>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-gray-900/50 backdrop-blur border border-white/10 rounded-xl">
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Describe a mission... (e.g., 'Run property assessment on 123 Main St')"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-500 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !prompt}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-medium text-sm rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Execute
                    </button>
                </form>
                {submitMessage && (
                    <div className={`mt-3 text-xs px-3 py-2 rounded ${submitMessage.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {submitMessage.text}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: '600px' }}>
                {/* Left: Active Missions */}
                <div className="lg:col-span-2 border border-white/10 bg-black/40 rounded-xl flex flex-col">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h2 className="font-semibold text-lg flex items-center gap-2 text-white">
                            <Terminal className="w-4 h-4 text-yellow-500" /> Active Missions
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="text-center py-10 text-gray-400">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading missions...
                                </div>
                            ) : missions.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">No active missions. Start one above.</div>
                            ) : (
                                missions.map((mission) => (
                                    <div key={mission.id} className="bg-gray-800/30 border border-white/5 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-medium text-white">{mission.name}</h3>
                                                <p className="text-xs text-gray-400 mt-0.5">ID: {mission.id.slice(0, 8)}</p>
                                            </div>
                                            <StatusBadge status={mission.status} />
                                        </div>
                                        <div className="space-y-2 pl-4 border-l-2 border-white/10 mt-4">
                                            {mission.ops_mission_steps?.sort((a: any, b: any) => a.step_order - b.step_order).map((step: any) => (
                                                <div key={step.id} className="text-sm flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${getAgentColor(step.agent_slug)}`} />
                                                        <span className="text-gray-300">{step.agent_slug}</span>
                                                        <span className="text-gray-500">→</span>
                                                        <span className="text-gray-300 font-mono text-xs">{step.action}</span>
                                                    </div>
                                                    <span className={`text-[10px] uppercase ${getStatusColor(step.status)}`}>{step.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Agent Stream / Events */}
                <div className="border border-white/10 bg-black/40 rounded-xl flex flex-col">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="font-semibold text-lg flex items-center gap-2 text-white">
                            <Activity className="w-4 h-4 text-green-500" /> Live Feed
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-3">
                            {events.map((event) => (
                                <div key={event.id} className="text-xs border-b border-white/5 pb-2 last:border-0 font-mono">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`font-bold ${getAgentTextColor(event.agent_slug)}`}>{event.agent_slug}</span>
                                        <span className="text-gray-600">{new Date(event.created_at).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-gray-400">{event.event_type}</div>
                                    <div className="text-gray-600 truncate mt-0.5">{JSON.stringify(event.payload)}</div>
                                </div>
                            ))}
                            {events.length === 0 && <div className="text-center text-gray-400 py-4">Waiting for signals...</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Agent Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10">
                {AGENTS.map(agent => (
                    <div key={agent.slug} className="bg-gray-800/20 border border-white/5 p-3 rounded flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <div>
                            <div className="text-xs font-medium text-white">{agent.name}</div>
                            <div className="text-[10px] text-gray-500">{agent.division}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        queued: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse',
        completed: 'bg-green-500/10 text-green-500 border-green-500/20',
        failed: 'bg-red-500/10 text-red-500 border-red-500/20',
        cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border capitalize ${colors[status] || colors.queued}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

function getStatusColor(status: string) {
    if (status === 'completed') return 'text-green-500';
    if (status === 'running') return 'text-blue-500';
    if (status === 'failed') return 'text-red-500';
    return 'text-gray-500';
}

function getAgentColor(slug: string) {
    if (slug?.includes('broker') || slug?.includes('deal')) return 'bg-yellow-500';
    if (slug?.includes('prospector') || slug?.includes('success')) return 'bg-blue-500';
    return 'bg-gray-500';
}

function getAgentTextColor(slug: string) {
    if (slug?.includes('broker') || slug?.includes('deal')) return 'text-yellow-500';
    if (slug?.includes('prospector') || slug?.includes('success')) return 'text-blue-500';
    return 'text-gray-400';
}
