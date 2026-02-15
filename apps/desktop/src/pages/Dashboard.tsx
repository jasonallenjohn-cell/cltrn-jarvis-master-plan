
import { Search, Zap, Mic, Play, Plus, Loader2 } from 'lucide-react';
import { useScore } from '../hooks/useScore';

// Map database fields to display names
const DOMAIN_MAP = {
    financial_mastery: { label: 'Wealth', key: 'financial_mastery' },
    business_growth: { label: 'Career', key: 'business_growth' },
    health_vitality: { label: 'Body', key: 'health_vitality' },
    relationships: { label: 'Relationships', key: 'relationships' },
    personal_development: { label: 'Mind', key: 'personal_development' },
    spiritual_alignment: { label: 'Soul', key: 'spiritual_alignment' },
} as const;

export default function Dashboard() {
    const { score, loading } = useScore();

    // Helper to get ring gradient based on score
    const getRing = (value: number) => {
        const degrees = (value / 100) * 360;
        const color = value >= 80 ? '#30D158' : value >= 60 ? '#D4AF37' : '#FF453A';
        return `conic-gradient(${color} ${degrees}deg, rgba(255,255,255,0.1) ${degrees}deg)`;
    };

    const getColor = (value: number) => {
        if (value >= 80) return 'text-green';
        if (value >= 60) return 'text-gold';
        return 'text-red';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!score) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-silver">No score data available</p>
                    <p className="text-xs text-silver/50 mt-2">Initialize your K0RE Score to get started</p>
                </div>
            </div>
        );
    }

    const domains = [
        { label: 'Mind', score: score.personal_development, key: 'personal_development' },
        { label: 'Body', score: score.health_vitality, key: 'health_vitality' },
        { label: 'Soul', score: score.spiritual_alignment, key: 'spiritual_alignment' },
        { label: 'Career', score: score.business_growth, key: 'business_growth' },
        { label: 'Relationships', score: score.relationships, key: 'relationships' },
        { label: 'Wealth', score: score.financial_mastery, key: 'financial_mastery' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-medium text-white">Good evening, Architect</h1>
                    <p className="text-xs text-silver mt-1">Your system is running optimally</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-silver focus:outline-none focus:border-gold/50 transition-colors w-64"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-silver hover:text-gold hover:border-gold/50 hover:bg-gold-dim transition-all">
                            <Mic size={18} />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-silver hover:text-gold hover:border-gold/50 hover:bg-gold-dim transition-all">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-8">
                {/* Main Score */}
                <div className="bg-card rounded-2xl p-8 border border-white/[0.08] flex flex-col items-center justify-center relative overflow-hidden group hover:border-white/[0.15] transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative w-48 h-48 mb-4">
                        <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: getRing(score.overall_score) }}>
                            <div className="w-[88%] h-[88%] bg-card rounded-full flex flex-col items-center justify-center">
                                <span className="text-6xl font-bold text-gold">{score.overall_score}</span>
                                <span className="text-xs text-silver uppercase tracking-widest mt-2">K0RE Score</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-2">
                        <div className="text-center">
                            <div className="text-xs text-silver uppercase tracking-wider mb-1">Updated</div>
                            <div className="text-sm font-medium text-white">
                                {new Date(score.updated_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Domains Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {domains.map((domain) => (
                        <div key={domain.key} className="bg-card rounded-xl p-4 border border-white/[0.08] flex flex-col items-center justify-center hover:border-white/[0.15] transition-colors">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: getRing(domain.score) }}>
                                <div className="w-[85%] h-[85%] bg-card rounded-full flex items-center justify-center">
                                    <span className={`text-lg font-bold ${getColor(domain.score)}`}>{domain.score}</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-silver uppercase tracking-wide">{domain.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-xs font-semibold text-silver uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Morning Routine', icon: Play, color: 'text-gold' },
                        { label: 'New Memory', icon: Plus, color: 'text-white' },
                        { label: 'Voice Note', icon: Mic, color: 'text-white' },
                        { label: 'Execute Skill', icon: Zap, color: 'text-gold' },
                    ].map((action) => (
                        <button key={action.label} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-gold-dim hover:border-gold/30 transition-all group">
                            <action.icon size={24} className={`${action.color} group-hover:scale-110 transition-transform`} />
                            <span className="text-xs font-medium text-silver group-hover:text-white transition-colors">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
