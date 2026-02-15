
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

const MRR_DATA = [
    { month: 'Sep', value: 1200 }, { month: 'Oct', value: 2100 },
    { month: 'Nov', value: 3400 }, { month: 'Dec', value: 4800 },
    { month: 'Jan', value: 6200 }, { month: 'Feb', value: 8500 },
];

const CHURN_DATA = [
    { month: 'Sep', value: 2.1 }, { month: 'Oct', value: 1.8 },
    { month: 'Nov', value: 2.4 }, { month: 'Dec', value: 1.2 },
    { month: 'Jan', value: 0.8 }, { month: 'Feb', value: 0.5 },
];

export default function Revenue() {
    return (
        <div className="animate-fade-in pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-medium text-white">Revenue Intelligence</h1>
                    <p className="text-xs text-silver mt-1">Platform financial performance</p>
                </div>
                <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-green/10 text-green rounded border border-green/20">+12% vs last month</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-white/10 rounded-xl p-4">
                    <div className="text-[10px] text-silver uppercase tracking-wider mb-2">MRR</div>
                    <div className="text-2xl font-bold text-white">$8,500</div>
                </div>
                <div className="bg-card border border-white/10 rounded-xl p-4">
                    <div className="text-[10px] text-silver uppercase tracking-wider mb-2">Active Subs</div>
                    <div className="text-2xl font-bold text-gold">142</div>
                </div>
                <div className="bg-card border border-white/10 rounded-xl p-4">
                    <div className="text-[10px] text-silver uppercase tracking-wider mb-2">Churn Rate</div>
                    <div className="text-2xl font-bold text-green">0.5%</div>
                </div>
                <div className="bg-card border border-white/10 rounded-xl p-4">
                    <div className="text-[10px] text-silver uppercase tracking-wider mb-2">LTV</div>
                    <div className="text-2xl font-bold text-white">$420</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-card border border-white/10 rounded-xl p-6">
                    <h3 className="text-xs font-semibold text-silver uppercase tracking-wider mb-6">Monthly Recurring Revenue</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MRR_DATA}>
                                <defs>
                                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="month" stroke="#98989D" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#98989D" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1C1C1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#D4AF37' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#D4AF37" fillOpacity={1} fill="url(#colorMrr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-white/10 rounded-xl p-6">
                    <h3 className="text-xs font-semibold text-silver uppercase tracking-wider mb-6">Churn Rate (%)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={CHURN_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="month" stroke="#98989D" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#98989D" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1C1C1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#30D158' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#30D158" strokeWidth={2} dot={{ fill: '#30D158', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
