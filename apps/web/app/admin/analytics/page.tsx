'use client';

import { useState, useEffect } from 'react';
import { createCommandCenterClient } from '@kore/api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';

const TIER_COLORS: Record<string, string> = {
    observer: '#6B7280',
    operator: '#3B82F6',
    commander: '#8B5CF6',
    architect: '#D4AF37',
    enterprise: '#EF4444',
};

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        pendingUsers: 0,
        avgScore: 0,
    });
    const [tierBreakdown, setTierBreakdown] = useState<{ name: string; value: number; color: string }[]>([]);
    const [scoreDistribution, setScoreDistribution] = useState<{ range: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    async function loadAnalytics() {
        setLoading(true);
        try {
            const supabase = createCommandCenterClient() as any;

            // Get all users
            const { data: users } = await supabase
                .from('user_profiles')
                .select('*');

            if (users && users.length > 0) {
                const active = users.filter((u: any) => u.onboarding_status === 'completed');
                const pending = users.filter((u: any) => u.onboarding_status === 'pending');
                const avgScore = Math.round(users.reduce((sum: any, u: any) => sum + (u.kore_score || 0), 0) / users.length);

                setStats({
                    totalUsers: users.length,
                    activeUsers: active.length,
                    pendingUsers: pending.length,
                    avgScore,
                });

                // Tier breakdown
                const tiers = ['observer', 'operator', 'commander', 'architect', 'enterprise'];
                const breakdown = tiers.map(tier => ({
                    name: tier.charAt(0).toUpperCase() + tier.slice(1),
                    value: users.filter((u: any) => u.subscription_tier === tier).length,
                    color: TIER_COLORS[tier],
                })).filter(t => t.value > 0);
                setTierBreakdown(breakdown);

                // Score distribution
                const ranges = [
                    { range: '0-20', min: 0, max: 20 },
                    { range: '21-40', min: 21, max: 40 },
                    { range: '41-60', min: 41, max: 60 },
                    { range: '61-80', min: 61, max: 80 },
                    { range: '81-100', min: 81, max: 100 },
                ];
                setScoreDistribution(ranges.map(r => ({
                    range: r.range,
                    count: users.filter((u: any) => (u.kore_score || 0) >= r.min && (u.kore_score || 0) <= r.max).length,
                })));
            } else {
                // Generate demo data for empty database
                setStats({ totalUsers: 47, activeUsers: 35, pendingUsers: 12, avgScore: 68 });
                setTierBreakdown([
                    { name: 'Observer', value: 18, color: TIER_COLORS.observer },
                    { name: 'Operator', value: 14, color: TIER_COLORS.operator },
                    { name: 'Commander', value: 9, color: TIER_COLORS.commander },
                    { name: 'Architect', value: 5, color: TIER_COLORS.architect },
                    { name: 'Enterprise', value: 1, color: TIER_COLORS.enterprise },
                ]);
                setScoreDistribution([
                    { range: '0-20', count: 3 },
                    { range: '21-40', count: 8 },
                    { range: '41-60', count: 12 },
                    { range: '61-80', count: 16 },
                    { range: '81-100', count: 8 },
                ]);
            }
        } catch (e) {
            console.error('Failed to load analytics:', e);
        } finally {
            setLoading(false);
        }
    }

    // Demo MRR data
    const mrrData = [
        { month: 'Sep', mrr: 1200 }, { month: 'Oct', mrr: 2100 },
        { month: 'Nov', mrr: 3400 }, { month: 'Dec', mrr: 4800 },
        { month: 'Jan', mrr: 6200 }, { month: 'Feb', mrr: 8500 },
    ];

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'text-white' },
        { label: 'Active Users', value: stats.activeUsers, icon: '✅', color: 'text-green-400' },
        { label: 'Avg K0RE Score', value: stats.avgScore, icon: '⚡', color: 'text-[#D4AF37]' },
        { label: 'MRR', value: '$8,500', icon: '💰', color: 'text-green-400' },
        { label: 'Churn Rate', value: '2.3%', icon: '📉', color: 'text-red-400' },
        { label: 'Pending', value: stats.pendingUsers, icon: '⏳', color: 'text-yellow-400' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96 text-[#98989D]">Loading analytics...</div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Analytics</h1>
                <p className="text-[#98989D]">Platform performance and user insights</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-6 gap-4 mb-8">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-4">
                        <div className="text-2xl mb-2">{card.icon}</div>
                        <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                        <div className="text-xs text-[#98989D] mt-1">{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* MRR Chart */}
                <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Monthly Recurring Revenue</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={mrrData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                            <XAxis dataKey="month" stroke="#98989D" tick={{ fill: '#98989D', fontSize: 12 }} />
                            <YAxis stroke="#98989D" tick={{ fill: '#98989D', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                                formatter={(value: any) => [`$${value}`, 'MRR'] as any}
                            />
                            <Line type="monotone" dataKey="mrr" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Tier Breakdown */}
                <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Subscription Breakdown</h3>
                    <div className="flex items-center gap-8">
                        <ResponsiveContainer width="50%" height={250}>
                            <PieChart>
                                <Pie
                                    data={tierBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {tierBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3">
                            {tierBreakdown.map((tier) => (
                                <div key={tier.name} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                                    <span className="text-sm text-[#98989D]">{tier.name}</span>
                                    <span className="text-sm text-white font-medium">{tier.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Score Distribution */}
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">K0RE Score Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={scoreDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                        <XAxis dataKey="range" stroke="#98989D" tick={{ fill: '#98989D', fontSize: 12 }} />
                        <YAxis stroke="#98989D" tick={{ fill: '#98989D', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                        />
                        <Bar dataKey="count" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
