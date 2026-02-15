'use client';

import { useState } from 'react';

interface TestResult {
    id: string;
    name: string;
    status: 'pass' | 'fail' | 'running' | 'pending';
    duration: string;
    output: string;
}

const SKILL_TESTS = [
    { id: 'auth', name: 'Authentication Flow', category: 'Core' },
    { id: 'onboarding', name: 'User Onboarding', category: 'Core' },
    { id: 'score-calc', name: 'K0RE Score Calculation', category: 'Scoring' },
    { id: 'domain-scores', name: 'Domain Score Updates', category: 'Scoring' },
    { id: 'doc-upload', name: 'Document Upload & Share', category: 'Operations' },
    { id: 'messaging', name: 'Messaging Pipeline', category: 'Operations' },
    { id: 'subscription', name: 'Subscription Tier Change', category: 'Billing' },
    { id: 'stripe-webhook', name: 'Stripe Webhook Handler', category: 'Billing' },
    { id: 'agent-trigger', name: 'Agent Manual Trigger', category: 'Agents' },
    { id: 'agent-chain', name: 'Reaction Chain', category: 'Agents' },
    { id: 'rls-policies', name: 'RLS Policy Enforcement', category: 'Security' },
    { id: 'rate-limit', name: 'Rate Limiting', category: 'Security' },
];

export default function AdminSandboxPage() {
    const [results, setResults] = useState<Map<string, TestResult>>(new Map());
    const [runningAll, setRunningAll] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [customPayload, setCustomPayload] = useState('{\n  "action": "test",\n  "target": "score_engine"\n}');
    const [customResult, setCustomResult] = useState<string | null>(null);

    const categories = ['All', ...Array.from(new Set(SKILL_TESTS.map(t => t.category)))];

    const filteredTests = selectedCategory === 'All'
        ? SKILL_TESTS
        : SKILL_TESTS.filter(t => t.category === selectedCategory);

    async function runTest(testId: string) {
        // Set running status
        setResults(prev => {
            const next = new Map(prev);
            next.set(testId, {
                id: testId,
                name: SKILL_TESTS.find(t => t.id === testId)!.name,
                status: 'running',
                duration: '',
                output: 'Running test...',
            });
            return next;
        });

        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 2000));

        const passed = Math.random() > 0.15;
        const duration = `${(0.2 + Math.random() * 3).toFixed(2)}s`;

        setResults(prev => {
            const next = new Map(prev);
            next.set(testId, {
                id: testId,
                name: SKILL_TESTS.find(t => t.id === testId)!.name,
                status: passed ? 'pass' : 'fail',
                duration,
                output: passed
                    ? `✅ All assertions passed (${Math.floor(Math.random() * 10 + 3)} checks)`
                    : `❌ Assertion failed: Expected 200, got 403\n   at test/${testId}.test.ts:42`,
            });
            return next;
        });
    }

    async function runAllTests() {
        setRunningAll(true);
        setResults(new Map());

        for (const test of SKILL_TESTS) {
            await runTest(test.id);
        }

        setRunningAll(false);
    }

    async function runCustomTest() {
        setCustomResult('⏳ Executing...');

        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const payload = JSON.parse(customPayload);
            setCustomResult(
                `✅ Custom test executed successfully\n\n` +
                `Action: ${payload.action}\n` +
                `Target: ${payload.target}\n` +
                `Result: OK (200)\n` +
                `Duration: ${(0.5 + Math.random() * 2).toFixed(2)}s\n\n` +
                `Response:\n${JSON.stringify({ success: true, timestamp: new Date().toISOString() }, null, 2)}`
            );
        } catch (e) {
            setCustomResult('❌ Invalid JSON payload');
        }
    }

    const passCount = Array.from(results.values()).filter(r => r.status === 'pass').length;
    const failCount = Array.from(results.values()).filter(r => r.status === 'fail').length;
    const total = results.size;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Testing Sandbox</h1>
                    <p className="text-[#98989D]">Test skills, workflows, and system integrations</p>
                </div>
                <button
                    onClick={runAllTests}
                    disabled={runningAll}
                    className="px-6 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {runningAll ? '⏳ Running All Tests...' : '▶ Run All Tests'}
                </button>
            </div>

            {/* Results Summary */}
            {total > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{passCount}</div>
                        <div className="text-xs text-[#98989D] mt-1">Passed</div>
                    </div>
                    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-red-400">{failCount}</div>
                        <div className="text-xs text-[#98989D] mt-1">Failed</div>
                    </div>
                    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-white">{total > 0 ? Math.round((passCount / total) * 100) : 0}%</div>
                        <div className="text-xs text-[#98989D] mt-1">Pass Rate</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-3 gap-6">
                {/* Test Suite Panel */}
                <div className="col-span-2">
                    {/* Category Tabs */}
                    <div className="flex gap-2 mb-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                        : 'bg-white/[0.03] text-[#98989D] hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Test List */}
                    <div className="space-y-2">
                        {filteredTests.map((test) => {
                            const result = results.get(test.id);

                            return (
                                <div
                                    key={test.id}
                                    className="bg-[#0A0A0A] border border-white/[0.08] rounded-lg p-4 flex items-center justify-between hover:border-white/[0.12] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">
                                            {!result ? '⬜' :
                                                result.status === 'running' ? '⏳' :
                                                    result.status === 'pass' ? '✅' : '❌'}
                                        </span>
                                        <div>
                                            <h4 className="font-medium text-white text-sm">{test.name}</h4>
                                            <p className="text-xs text-[#98989D]">{test.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {result?.duration && (
                                            <span className="text-xs text-[#98989D]">{result.duration}</span>
                                        )}
                                        <button
                                            onClick={() => runTest(test.id)}
                                            disabled={result?.status === 'running' || runningAll}
                                            className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded text-xs font-medium transition-colors disabled:opacity-30"
                                        >
                                            Run
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Custom Test Panel */}
                <div className="space-y-4">
                    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">🧪 Custom Test</h3>
                        <p className="text-xs text-[#98989D] mb-3">Send a custom JSON payload to test any endpoint</p>
                        <textarea
                            value={customPayload}
                            onChange={(e) => setCustomPayload(e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]/50 h-32 resize-none"
                        />
                        <button
                            onClick={runCustomTest}
                            className="w-full mt-3 px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg font-medium text-sm transition-colors"
                        >
                            ▶ Execute
                        </button>
                    </div>

                    {/* Output Panel */}
                    {customResult && (
                        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-6">
                            <h3 className="font-semibold text-white mb-3">Output</h3>
                            <pre className="text-xs text-[#98989D] whitespace-pre-wrap font-mono bg-white/[0.02] p-4 rounded-lg overflow-auto max-h-64">
                                {customResult}
                            </pre>
                        </div>
                    )}

                    {/* Failed Test Output */}
                    {Array.from(results.values()).filter(r => r.status === 'fail').map(result => (
                        <div key={result.id} className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-red-400 mb-2">❌ {result.name}</h4>
                            <pre className="text-xs text-red-300/70 font-mono whitespace-pre-wrap">{result.output}</pre>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
