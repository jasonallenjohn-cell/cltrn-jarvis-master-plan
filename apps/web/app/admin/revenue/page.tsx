'use client';

import { useEffect, useState } from 'react';
import { getRevenueMetrics } from '@kore/api';

interface Metrics {
    mrr: string;
    gmv: string;
    activeSubscribers: number;
    churnRate: string;
}

export default function RevenueDashboard() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getRevenueMetrics();
                setMetrics(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className="p-8 text-white">Loading Financials...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Revenue Command Center</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <MetricCard
                    title="Monthly Recurring Revenue"
                    value={`$${metrics?.mrr || '0.00'}`}
                    trend="+12%"
                    color="text-[#D4AF37]"
                />
                <MetricCard
                    title="Gross Merchandise Value"
                    value={`$${metrics?.gmv || '0.00'}`}
                    trend="+5%"
                    color="text-white"
                />
                <MetricCard
                    title="Active Subscribers"
                    value={metrics?.activeSubscribers.toString() || '0'}
                    trend="+8"
                    color="text-blue-400"
                />
                <MetricCard
                    title="Churn Rate"
                    value={`${metrics?.churnRate || '0.0'}%`}
                    trend="-0.5%"
                    color="text-red-400"
                    inverse
                />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6 h-96">
                    <h3 className="text-white font-bold mb-4">Revenue Trend</h3>
                    <div className="h-full flex items-center justify-center text-neutral-600">
                        Chart Placeholder (Recharts/Chart.js)
                    </div>
                </div>
                <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6 h-96">
                    <h3 className="text-white font-bold mb-4">Subscription Tiers</h3>
                    <div className="h-full flex items-center justify-center text-neutral-600">
                        Pie Chart Placeholder
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, color, inverse }: any) {
    return (
        <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
            <h3 className="text-neutral-400 text-sm font-medium mb-2">{title}</h3>
            <div className={`text-3xl font-bold mb-2 ${color}`}>{value}</div>
            <div className={`text-sm ${inverse ? 'text-green-400' : 'text-green-400'}`}>
                {trend} <span className="text-neutral-500">vs last month</span>
            </div>
        </div>
    );
}
