
import { BookOpen, FileText, Video, Play, Clock, ArrowRight } from 'lucide-react';

const RESOURCES = [
    { id: 1, title: 'RedPaper 001: The Simulation Hypothesis', type: 'paper', author: 'K0RE Intelligence', readTime: '12 min', progress: 100 },
    { id: 2, title: 'Mastering Flow State', type: 'video', author: 'Steven Kotler', readTime: '45 min', progress: 65 },
    { id: 3, title: 'Protocol: Morning Optimization', type: 'guide', author: 'Huberman Lab', readTime: '5 min', progress: 0 },
    { id: 4, title: 'RedPaper 002: Digital Asceticism', type: 'paper', author: 'K0RE Intelligence', readTime: '15 min', progress: 0 },
    { id: 5, title: 'Financial Antifragility', type: 'paper', author: 'Nassim Taleb', readTime: '22 min', progress: 30 },
];

export default function Library() {
    return (
        <div className="animate-fade-in pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-medium text-white">Knowledge Library</h1>
                    <p className="text-xs text-silver mt-1">Curated intelligence for your operating system</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-gold-dim border border-gold/30 rounded-lg text-xs text-gold">
                        My List
                    </button>
                    <button className="px-3 py-1.5 bg-card border border-white/10 rounded-lg text-xs text-silver hover:text-white transition-colors">
                        Browse Catalog
                    </button>
                </div>
            </div>

            {/* Featured */}
            <div className="bg-gradient-to-r from-red-900/40 to-black border border-red-500/20 rounded-2xl p-8 mb-8 relative overflow-hidden group cursor-pointer">
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-red-500/10 to-transparent" />
                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">NEW RELEASE</div>
                        <span className="text-xs text-red-200">RedPaper 003</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">The Architecture of Will</h2>
                    <p className="text-sm text-silver mb-6 leading-relaxed">
                        A deep dive into the neuroscience of willpower and how to construct an environment that makes discipline automatic.
                    </p>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                        Read Now <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                <h3 className="text-xs font-semibold text-silver uppercase tracking-wider mb-4">Continue Learning</h3>
                {RESOURCES.map((item) => (
                    <div key={item.id} className="bg-card border border-white/10 rounded-xl p-4 flex gap-4 hover:border-white/20 transition-all cursor-pointer group">
                        {/* Cover Placeholder */}
                        <div className={`w-16 h-24 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'paper' ? 'bg-gradient-to-br from-red-900 to-red-950' :
                                item.type === 'video' ? 'bg-gradient-to-br from-blue-900 to-blue-950' :
                                    'bg-gradient-to-br from-gold/20 to-gold/5'
                            }`}>
                            {item.type === 'paper' ? <FileText className="text-red-400" size={24} /> :
                                item.type === 'video' ? <Play className="text-blue-400" size={24} /> :
                                    <BookOpen className="text-gold" size={24} />}
                        </div>

                        <div className="flex-1 py-1 flex flex-col justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-gold transition-colors">{item.title}</h4>
                                <p className="text-xs text-silver mt-1">{item.author}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-4 text-[10px] text-silver/70">
                                    <span className="flex items-center gap-1 uppercase tracking-wider">
                                        {item.type === 'paper' ? 'RedPaper' : item.type}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={10} />
                                        {item.readTime}
                                    </span>
                                    {item.progress > 0 && <span className="text-green">{item.progress}% Complete</span>}
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold rounded-full" style={{ width: `${item.progress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
