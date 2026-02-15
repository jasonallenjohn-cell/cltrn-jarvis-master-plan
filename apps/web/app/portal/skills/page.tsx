'use client';

import { useState } from 'react';
import { executeSkill } from '@kore/api';

const AVAILABLE_SKILLS = [
    {
        id: 'sentiment-analysis',
        name: 'Sentiment Analysis',
        description: 'Analyze the emotional tone of any text.',
        icon: '🎭',
        inputLabel: 'Text to analyze'
    },
    {
        id: 'summarize',
        name: 'Text Summarizer',
        description: 'Condense long text into a brief summary.',
        icon: '📝',
        inputLabel: 'Text to summarize'
    }
];

export default function SkillsPage() {
    const [selectedSkill, setSelectedSkill] = useState(AVAILABLE_SKILLS[0]);
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    async function handleExecute() {
        if (!input.trim()) return;

        setLoading(true);
        setResult(null);
        try {
            const data = await executeSkill(selectedSkill.id, { text: input });
            setResult(data);
        } catch (e: any) {
            console.error('Execution failed:', e);
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-white mb-2">Skill Station</h1>
                <p className="text-[#98989D]">Execute AI workflows and intelligent tasks.</p>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Skill Selector */}
                <div className="col-span-4 space-y-4">
                    <h2 className="text-lg font-medium text-white">Available Skills</h2>
                    <div className="space-y-3">
                        {AVAILABLE_SKILLS.map((skill) => (
                            <button
                                key={skill.id}
                                onClick={() => {
                                    setSelectedSkill(skill);
                                    setResult(null);
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedSkill.id === skill.id
                                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] ring-1 ring-[#D4AF37]'
                                        : 'bg-[#1C1C1E] border-white/[0.08] hover:bg-[#2C2C2E]'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{skill.icon}</span>
                                    <div>
                                        <h3 className="font-medium text-white">{skill.name}</h3>
                                        <p className="text-sm text-[#98989D]">{skill.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Execution Panel */}
                <div className="col-span-8 space-y-6">
                    <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                        <h2 className="text-lg font-medium text-white mb-4">Input</h2>
                        <div className="space-y-4">
                            <label className="block text-sm text-[#98989D]">{selectedSkill.inputLabel}</label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-32 px-4 py-3 bg-[#0A0A0A] border border-white/[0.1] rounded-lg text-white resize-none focus:outline-none focus:border-[#D4AF37]"
                                placeholder="Enter input data here..."
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleExecute}
                                    disabled={loading || !input.trim()}
                                    className="px-6 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? (
                                        'Executing...'
                                    ) : (
                                        <>
                                            <span>Run Skill</span>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    {(result || loading) && (
                        <div className={`bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
                            <h2 className="text-lg font-medium text-white mb-4">Output</h2>
                            <div className="bg-[#0A0A0A] rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                <pre className="text-[#30D158]">
                                    {result ? JSON.stringify(result, null, 2) : 'Processing...'}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
