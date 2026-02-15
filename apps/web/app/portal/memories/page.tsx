'use client';

import { useState } from 'react';
import { addMemory, searchMemories, Memory } from '@kore/api';

export default function MemoriesPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(false);
    const [newMemory, setNewMemory] = useState('');
    const [saving, setSaving] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const data = await searchMemories(query);
            setResults(data);
        } catch (e) {
            console.error('Search failed:', e);
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveMemory() {
        if (!newMemory.trim()) return;

        setSaving(true);
        try {
            await addMemory(newMemory, 'explicit');
            setNewMemory('');
            // Optionally refresh list or specific area
        } catch (e) {
            console.error('Save failed:', e);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-white mb-2">Memory Vault</h1>
                <p className="text-[#98989D]">Your persistent context and insights</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Search Column */}
                <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                    <h2 className="text-lg font-medium text-white mb-4">Semantic Search</h2>
                    <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search memories..."
                            className="flex-1 px-4 py-2 bg-[#2C2C2E] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? '...' : 'Search'}
                        </button>
                    </form>

                    <div className="space-y-4">
                        {results.map((mem) => (
                            <div key={mem.id} className="p-4 bg-[#2C2C2E] rounded-lg border border-white/[0.05]">
                                <p className="text-white mb-2">{mem.content}</p>
                                <div className="flex items-center justify-between text-xs text-[#98989D]">
                                    <span className="capitalize">{mem.type}</span>
                                    {mem.similarity && <span>{(mem.similarity * 100).toFixed(1)}% Match</span>}
                                    <span>{new Date(mem.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                        {results.length === 0 && !loading && (
                            <div className="text-center text-[#98989D] py-8">
                                No results found
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Memory Column */}
                <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6 h-fit">
                    <h2 className="text-lg font-medium text-white mb-4">Add Memory</h2>
                    <textarea
                        value={newMemory}
                        onChange={(e) => setNewMemory(e.target.value)}
                        placeholder="What's on your mind? (e.g. 'I want to focus on meditation this week')"
                        className="w-full h-32 px-4 py-3 bg-[#2C2C2E] border border-white/[0.08] rounded-lg text-white resize-none focus:outline-none focus:border-[#D4AF37] mb-4"
                    />
                    <button
                        onClick={handleSaveMemory}
                        disabled={saving || !newMemory.trim()}
                        className="w-full py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save to Vault'}
                    </button>
                </div>
            </div>
        </div>
    );
}
