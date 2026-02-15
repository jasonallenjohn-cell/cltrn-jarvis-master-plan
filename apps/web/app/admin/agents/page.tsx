'use client';

import { useState, useEffect } from 'react';
import { createCommandCenterClient } from '@kore/api';

interface Agent {
    id: string;
    agent_name: string;
    status: 'active' | 'idle' | 'error' | 'offline';
    active_mission: string | null;
    last_heartbeat: string;
    metadata: any;
}

interface AgentRun {
    id: string;
    agent_name: string;
    trigger_type: 'manual' | 'scheduled' | 'reaction';
    started_at: string;
    completed_at: string | null;
    status: 'running' | 'completed' | 'failed';
    result: any;
}

const AGENT_CONFIG = [
    { name: 'MERIDIAN', role: 'Central Orchestrator', icon: '🧠' },
    { name: 'NEXUS', role: 'Integration Hub', icon: '🔗' },
    { name: 'PRISM', role: 'Analytics Engine', icon: '📊' },
    { name: 'SENTINEL', role: 'Security Monitor', icon: '🛡️' },
    { name: 'FLUX', role: 'Workflow Automation', icon: '⚡' },
    { name: 'ECHO', role: 'Communication Agent', icon: '📡' },
    { name: 'CIPHER', role: 'Data Encryption', icon: '🔐' },
    { name: 'VECTOR', role: 'ML Pipeline', icon: '🎯' },
    { name: 'ATLAS', role: 'Knowledge Graph', icon: '🗺️' },
    { name: 'PULSE', role: 'Health Monitor', icon: '💓' },
    { name: 'CORTEX', role: 'Decision Engine', icon: '⚙️' },
    { name: 'AURORA', role: 'Score Calculator', icon: '✨' },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
    active: { color: 'text-green-400', bg: 'bg-green-400', label: 'Active' },
    idle: { color: 'text-yellow-400', bg: 'bg-yellow-400', label: 'Idle' },
    error: { color: 'text-red-400', bg: 'bg-red-400', label: 'Error' },
    offline: { color: 'text-gray-500', bg: 'bg-gray-500', label: 'Offline' },
};

export default function AdminAgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [runs, setRuns] = useState<AgentRun[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [triggeringAgent, setTriggeringAgent] = useState<string | null>(null);

    useEffect(() => {
        loadAgents();
    }, []);

    async function loadAgents() {
        setLoading(true);
        try {
            const supabase = createCommandCenterClient() as any;

            const { data: agentData } = await supabase
                .from('agent_statuses')
                .select('*');

            const { data: runData } = await supabase
                .from('agent_runs')
                .select('*')
                .order('started_at', { ascending: false })
                .limit(50);

            if (agentData) setAgents(agentData);
            if (runData) setRuns(runData);
        } catch (e) {
            console.error('Failed to load agents:', e);
        } finally {
            setLoading(false);
        }
    }

    function getAgentStatus(agentName: string): Agent | undefined {
        return agents.find(a => a.agent_name === agentName);
    }

    async function triggerAgent(agentName: string) {
        setTriggeringAgent(agentName);
        try {
            const supabase = createCommandCenterClient() as any;

            await supabase.from('agent_runs').insert({
                agent_name: agentName,
                trigger_type: 'manual',
                status: 'running',
            });

            // Simulate agent completing after a short delay
            setTimeout(async () => {
                setTriggeringAgent(null);
                await loadAgents();
            }, 2000);
        } catch (e) {
            console.error('Failed to trigger agent:', e);
            setTriggeringAgent(null);
        }
    }

    const agentRuns = selectedAgent
        ? runs.filter(r => r.agent_name === selectedAgent)
        : runs;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Agent Monitor</h1>
                    <p className="text-[#98989D]">Monitor and control the 12-agent constellation</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                        {agents.filter(a => a.status === 'active').length || AGENT_CONFIG.length} Active
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        {agents.filter(a => a.status === 'error').length} Error
                    </span>
                </div>
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {AGENT_CONFIG.map((agentDef) => {
                    const status = getAgentStatus(agentDef.name);
                    const statusInfo = STATUS_CONFIG[status?.status || 'idle'];
                    const isTriggering = triggeringAgent === agentDef.name;

                    return (
                        <div
                            key={agentDef.name}
                            onClick={() => setSelectedAgent(selectedAgent === agentDef.name ? null : agentDef.name)}
                            className={`bg-[#0A0A0A] border rounded-xl p-4 cursor-pointer transition-all hover:border-white/[0.15] ${selectedAgent === agentDef.name
                                ? 'border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/20'
                                : 'border-white/[0.08]'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl">{agentDef.icon}</span>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${statusInfo.bg} ${status?.status === 'active' ? 'animate-pulse' : ''}`} />
                                    <span className={`text-xs font-medium ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>
                            </div>
                            <h3 className="font-bold text-white text-sm">{agentDef.name}</h3>
                            <p className="text-xs text-[#98989D] mt-0.5">{agentDef.role}</p>
                            {status?.active_mission && (
                                <p className="text-xs text-[#D4AF37] mt-2 truncate">🎯 {status.active_mission}</p>
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); triggerAgent(agentDef.name); }}
                                disabled={isTriggering}
                                className="w-full mt-3 px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded text-xs font-medium transition-colors disabled:opacity-50"
                            >
                                {isTriggering ? '⚡ Running...' : '▶ Trigger'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Run History */}
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
                    <h3 className="font-semibold text-white">
                        {selectedAgent ? `${selectedAgent} Run History` : 'Recent Runs (All Agents)'}
                    </h3>
                    {selectedAgent && (
                        <button
                            onClick={() => setSelectedAgent(null)}
                            className="text-sm text-[#98989D] hover:text-white transition-colors"
                        >
                            Show All
                        </button>
                    )}
                </div>

                {agentRuns.length === 0 ? (
                    <div className="p-12 text-center text-[#98989D]">
                        <div className="text-3xl mb-2">🤖</div>
                        <p className="font-medium">No runs recorded</p>
                        <p className="text-sm mt-1">Trigger an agent to see run history here</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#98989D] uppercase">Agent</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#98989D] uppercase">Trigger</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#98989D] uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#98989D] uppercase">Started</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#98989D] uppercase">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {agentRuns.map((run) => (
                                <tr key={run.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3 text-sm text-white font-medium">{run.agent_name}</td>
                                    <td className="px-6 py-3 text-sm">
                                        <span className={`px-2 py-0.5 rounded text-xs ${run.trigger_type === 'manual' ? 'bg-blue-500/20 text-blue-300' :
                                            run.trigger_type === 'scheduled' ? 'bg-gray-500/20 text-gray-300' :
                                                'bg-purple-500/20 text-purple-300'
                                            }`}>
                                            {run.trigger_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-sm">
                                        <span className={`${run.status === 'completed' ? 'text-green-400' :
                                            run.status === 'running' ? 'text-yellow-400' :
                                                'text-red-400'
                                            }`}>
                                            {run.status === 'running' ? '⏳' : run.status === 'completed' ? '✅' : '❌'}
                                            {' '}{run.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-[#98989D]">
                                        {new Date(run.started_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-[#98989D]">
                                        {run.completed_at
                                            ? `${Math.round((new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()) / 1000)}s`
                                            : '—'
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
