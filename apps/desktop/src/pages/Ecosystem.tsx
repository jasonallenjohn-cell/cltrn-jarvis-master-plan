
import { motion } from 'framer-motion';
import { useScore } from '../hooks/useScore';
import { Loader2 } from 'lucide-react';

export default function Ecosystem() {
    const { score, loading } = useScore();

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!score) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-silver">No score data available</p>
            </div>
        );
    }

    // Calculate alignment (average of all domains)
    const alignment = Math.round(
        (score.personal_development +
            score.health_vitality +
            score.spiritual_alignment +
            score.business_growth +
            score.relationships +
            score.financial_mastery) / 6
    );

    // Find lowest domain for recommendation
    const domains = [
        { name: 'Mind', value: score.personal_development, key: 'personal_development' },
        { name: 'Body', value: score.health_vitality, key: 'health_vitality' },
        { name: 'Soul', value: score.spiritual_alignment, key: 'spiritual_alignment' },
        { name: 'Career', value: score.business_growth, key: 'business_growth' },
        { name: 'Relationships', value: score.relationships, key: 'relationships' },
        { name: 'Wealth', value: score.financial_mastery, key: 'financial_mastery' },
    ];
    const lowestDomain = domains.reduce((min, d) => (d.value < min.value ? d : min));

    const getColor = (value: number) => {
        if (value >= 80) return { border: 'border-green/50', bg: 'bg-green/5', hover: 'hover:bg-green/10', text: 'text-green' };
        if (value >= 60) return { border: 'border-gold/50', bg: 'bg-gold/5', hover: 'hover:bg-gold/10', text: 'text-gold' };
        return { border: 'border-red/50', bg: 'bg-red/5', hover: 'hover:bg-red/10', text: 'text-red' };
    };

    const getSize = (value: number) => {
        // Scale from 200px to 280px based on score
        const baseSize = 200;
        const maxSize = 280;
        return baseSize + ((value / 100) * (maxSize - baseSize));
    };

    const mindColors = getColor(score.personal_development);
    const bodyColors = getColor(score.health_vitality);
    const soulColors = getColor(score.spiritual_alignment);

    return (
        <div className="h-full flex flex-col animate-fade-in items-center justify-center relative">
            <div className="absolute top-0 left-0">
                <h1 className="text-xl font-medium text-white">Ecosystem</h1>
                <p className="text-xs text-silver mt-1">Balance across all dimensions</p>
            </div>

            <div className="relative w-[500px] h-[500px]">
                {/* Mind */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full border-2 ${mindColors.border} ${mindColors.bg} flex items-start justify-center pt-8 mix-blend-screen ${mindColors.hover} transition-colors cursor-pointer group`}
                    style={{ width: getSize(score.personal_development), height: getSize(score.personal_development) }}
                >
                    <div className="text-center">
                        <span className={`${mindColors.text} font-bold uppercase tracking-widest text-sm`}>Mind</span>
                        <div className={`text-2xl font-bold ${mindColors.text} mt-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                            {score.personal_development}
                        </div>
                    </div>
                </motion.div>

                {/* Body */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className={`absolute bottom-10 left-10 rounded-full border-2 ${bodyColors.border} ${bodyColors.bg} flex items-end justify-start pb-10 pl-10 mix-blend-screen ${bodyColors.hover} transition-colors cursor-pointer group`}
                    style={{ width: getSize(score.health_vitality), height: getSize(score.health_vitality) }}
                >
                    <div className="text-center">
                        <span className={`${bodyColors.text} font-bold uppercase tracking-widest text-sm`}>Body</span>
                        <div className={`text-2xl font-bold ${bodyColors.text} mt-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                            {score.health_vitality}
                        </div>
                    </div>
                </motion.div>

                {/* Soul */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className={`absolute bottom-10 right-10 rounded-full border-2 ${soulColors.border} ${soulColors.bg} flex items-end justify-end pb-10 pr-10 mix-blend-screen ${soulColors.hover} transition-colors cursor-pointer group`}
                    style={{ width: getSize(score.spiritual_alignment), height: getSize(score.spiritual_alignment) }}
                >
                    <div className="text-center">
                        <span className={`${soulColors.text} font-bold uppercase tracking-widest text-sm`}>Soul</span>
                        <div className={`text-2xl font-bold ${soulColors.text} mt-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                            {score.spiritual_alignment}
                        </div>
                    </div>
                </motion.div>

                {/* Center Core */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-32 h-32 rounded-full flex flex-col items-center justify-center text-center z-10"
                >
                    <div className="text-3xl font-bold text-white">K0RE</div>
                    <div className="text-[10px] text-silver uppercase tracking-wider mt-1">Alignment</div>
                </motion.div>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 pointer-events-none opacity-20">
                    <line x1="50%" y1="20%" x2="25%" y2="70%" stroke="white" strokeWidth="1" />
                    <line x1="50%" y1="20%" x2="75%" y2="70%" stroke="white" strokeWidth="1" />
                    <line x1="25%" y1="70%" x2="75%" y2="70%" stroke="white" strokeWidth="1" />
                </svg>
            </div>

            <div className="mt-8 text-center max-w-md">
                <p className="text-sm text-silver">
                    Your ecosystem is <span className={alignment >= 80 ? 'text-green' : alignment >= 60 ? 'text-gold' : 'text-red'}>{alignment}% aligned</span>.
                    {lowestDomain.value < 80 && (
                        <> Focus on <span className="text-gold">{lowestDomain.name}</span> to optimize performance.</>
                    )}
                </p>
            </div>
        </div>
    );
}
