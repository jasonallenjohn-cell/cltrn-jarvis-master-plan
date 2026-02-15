'use client';

import { useState, useEffect } from 'react';
import { ScoreRing } from '../components/ScoreRing';
import { getCurrentScore, KoreScore } from '@kore/api';

interface DomainScore {
    name: string;
    key: keyof KoreScore;
    icon: string;
    color: string;
}

const DOMAIN_CONFIG: DomainScore[] = [
    { name: 'Financial', key: 'financial_mastery', icon: '💰', color: '#F59E0B' },
    { name: 'Business', key: 'business_growth', icon: '📈', color: '#3B82F6' },
    { name: 'Physical', key: 'health_vitality', icon: '💪', color: '#10B981' },
    { name: 'Relational', key: 'relationships', icon: '🤝', color: '#06B6D4' },
    { name: 'Personal', key: 'personal_development', icon: '📚', color: '#EC4899' },
    { name: 'Spiritual', key: 'spiritual_alignment', icon: '✨', color: '#8B5CF6' },
];

const RECENT_ACTIVITIES = [
    { type: 'journal', text: 'Completed morning gratitude journal', time: '2 hours ago', icon: '📝' },
    { type: 'task', text: 'Finished meditation session', time: '4 hours ago', icon: '✅' },
    { type: 'goal', text: 'Updated financial goals', time: '1 day ago', icon: '🎯' },
    { type: 'insight', text: 'K0RE AI generated new insight', time: '1 day ago', icon: '💡' },
];

const PERFECT_DAY_BLOCKS = [
    { time: '6:00 AM', activity: 'Morning Routine', completed: true },
    { time: '7:00 AM', activity: 'Meditation & Journaling', completed: true },
    { time: '8:00 AM', activity: 'Deep Work Block 1', completed: true },
    { time: '12:00 PM', activity: 'Lunch & Walk', completed: false },
    { time: '2:00 PM', activity: 'Deep Work Block 2', completed: false },
    { time: '6:00 PM', activity: 'Exercise', completed: false },
    { time: '8:00 PM', activity: 'Family Time', completed: false },
    { time: '10:00 PM', activity: 'Evening Reflection', completed: false },
];

export default function DashboardPage() {
    const [score, setScore] = useState<KoreScore | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadScore();
    }, []);

    async function loadScore() {
        try {
            const data = await getCurrentScore();
            setScore(data);
        } catch (e) {
            console.error('Failed to load score:', e);
        } finally {
            setLoading(false);
        }
    }

    // Default scores if no data yet (for demo/onboarding)
    const currentScore = score || {
        overall_score: 0,
        financial_mastery: 0,
        business_growth: 0,
        health_vitality: 0,
        relationships: 0,
        personal_development: 0,
        spiritual_alignment: 0,
    } as KoreScore;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-semibold text-white mb-2">Dashboard</h1>
                <p className="text-[#98989D]">Welcome back! Here's your K0RE overview.</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Activity Feed */}
                <div className="col-span-3 space-y-4">
                    <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                        <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {RECENT_ACTIVITIES.map((activity, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                                        <span className="text-sm">{activity.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{activity.text}</p>
                                        <p className="text-xs text-[#98989D]">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center Column - K0RE Score */}
                <div className="col-span-6 space-y-6">
                    {/* Main Score Ring */}
                    <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-8 flex flex-col items-center">
                        {loading ? (
                            <div className="w-[240px] h-[240px] rounded-full border-4 border-white/[0.05] animate-pulse" />
                        ) : (
                            <ScoreRing score={currentScore.overall_score} size={240} strokeWidth={12} />
                        )}
                        <div className="mt-6 flex items-center gap-2">
                            <span className="text-[#30D158] text-sm font-medium">+5 today</span>
                            <span className="text-[#98989D] text-sm">• 14-day streak 🔥</span>
                        </div>
                    </div>

                    {/* 6 Domain Scores */}
                    <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                        <h2 className="text-lg font-medium text-white mb-4">Domain Scores</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {DOMAIN_CONFIG.map((domain) => {
                                const val = currentScore[domain.key] as number || 0;
                                return (
                                    <div
                                        key={domain.name}
                                        className="bg-[#0A0A0A] border border-white/[0.06] rounded-lg p-4 hover:border-[#D4AF37]/30 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">{domain.icon}</span>
                                            <span className="text-sm font-medium text-white">{domain.name}</span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-[#D4AF37]">{val}</span>
                                            <span className="text-xs text-[#98989D]">/100</span>
                                        </div>
                                        {/* Mini progress bar */}
                                        <div className="mt-2 h-1 bg-white/[0.1] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#D4AF37] rounded-full transition-all duration-1000"
                                                style={{ width: `${val}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column - Perfect Day Timeline */}
                <div className="col-span-3 space-y-4">
                    <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                        <h2 className="text-lg font-medium text-white mb-4">Perfect Day</h2>
                        <div className="space-y-3">
                            {PERFECT_DAY_BLOCKS.map((block, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-16 text-xs text-[#98989D] pt-1">
                                        {block.time}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-sm ${block.completed ? 'text-[#98989D] line-through' : 'text-white'}`}>
                                            {block.activity}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {block.completed ? (
                                            <div className="w-5 h-5 rounded-full bg-[#30D158] flex items-center justify-center">
                                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-white/[0.2]" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
