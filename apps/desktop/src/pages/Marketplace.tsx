
import { useState } from 'react';
import { Search, Zap, Crown, BarChart2, MessageSquare, Briefcase, Filter, Star } from 'lucide-react';

const SKILLS = [
    { id: 1, name: 'Deep Work Orchestrator', category: 'Productivity', price: 29, rating: 4.9, creator: 'K0RE Labs', icon: Zap, description: 'Automatically blocks distractions and optimizes your environment for flow state.' },
    { id: 2, name: 'Executive Briefing', category: 'Business', price: 49, rating: 4.8, creator: 'Jason Calacanis', icon: Briefcase, description: 'Summarizes your entire company comms into a 5-minute daily audio brief.' },
    { id: 3, name: 'Sleep Architect', category: 'Health', price: 19, rating: 4.7, creator: 'Dr. Huberman', icon: Crown, description: 'Analyzes biometrics to construct the perfect pre-sleep and wake-up routine.' },
    { id: 4, name: 'Financial Forecaster', category: 'Finance', price: 99, rating: 5.0, creator: 'Ray Dalio', icon: BarChart2, description: 'Predictive modeling for your personal investment portfolio based on macro trends.' },
    { id: 5, name: 'Negotiation Coach', category: 'Communication', price: 39, rating: 4.6, creator: 'Chris Voss', icon: MessageSquare, description: 'Real-time analysis of negotiation transcripts with behavioral cues.' },
    { id: 6, name: 'Perfect Day Builder', category: 'Lifestyle', price: 0, rating: 4.9, creator: 'K0RE Labs', icon: Crown, description: 'The signature K0RE protocol for designing your ideal 24-hour cycle.' },
];

const CATEGORIES = ['All', 'Productivity', 'Business', 'Health', 'Finance', 'Lifestyle'];

export default function Marketplace() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredSkills = selectedCategory === 'All'
        ? SKILLS
        : SKILLS.filter(s => s.category === selectedCategory);

    return (
        <div className="animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-medium text-white">Skill Marketplace</h1>
                    <p className="text-xs text-silver mt-1">Expand your capabilities with premium skills</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver" />
                        <input
                            type="text"
                            placeholder="Search skills..."
                            className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-silver focus:outline-none focus:border-gold/50 transition-colors w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${selectedCategory === cat
                                ? 'bg-gold-dim border-gold text-gold'
                                : 'bg-transparent border-white/10 text-silver hover:border-white/30 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-6">
                {filteredSkills.map((skill) => (
                    <div key={skill.id} className="bg-card border border-white/10 rounded-xl p-6 group hover:border-gold/50 hover:shadow-2xl hover:shadow-gold/5 transition-all cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded">INSTALL</div>
                        </div>

                        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-gold mb-4 group-hover:bg-gold group-hover:text-black transition-colors">
                            <skill.icon size={24} />
                        </div>

                        <h3 className="text-sm font-bold text-white mb-1">{skill.name}</h3>
                        <p className="text-[10px] text-silver uppercase tracking-wide mb-3">{skill.creator}</p>

                        <p className="text-xs text-silver/80 line-clamp-2 mb-4 h-8 leading-relaxed">
                            {skill.description}
                        </p>

                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                            <div className="flex items-center gap-1 text-gold">
                                <Star size={12} fill="currentColor" />
                                <span className="text-xs font-medium">{skill.rating}</span>
                                <span className="text-[10px] text-silver/50 ml-1">(12k)</span>
                            </div>
                            <div className="text-sm font-bold text-white">
                                {skill.price === 0 ? 'Free' : `$${skill.price}`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
