'use client';

import { useEffect, useState } from 'react';
import { getSharedDocuments, type Document } from '@kore/api';

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        async function fetchDocuments() {
            try {
                // TODO: Get actual user ID from auth context
                const docs = await getSharedDocuments('current-user-id') as any;
                setDocuments(docs);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDocuments();
    }, []);

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return '📄';
        if (type.includes('image')) return '🖼️';
        if (type.includes('sheet') || type.includes('excel')) return '📊';
        if (type.includes('doc')) return '📝';
        return '📎';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-[#98989D]">Loading documents...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-white mb-2">Documents</h1>
                    <p className="text-[#98989D]">Files shared with you by your admin</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                : 'text-[#98989D] hover:bg-white/[0.03]'
                            }`}
                    >
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 rounded-lg transition-colors ${viewMode === 'list'
                                ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                : 'text-[#98989D] hover:bg-white/[0.03]'
                            }`}
                    >
                        List
                    </button>
                </div>
            </div>

            {/* Documents */}
            {documents.length === 0 ? (
                <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">📂</div>
                    <h3 className="text-xl font-medium text-white mb-2">No documents yet</h3>
                    <p className="text-[#98989D] mb-6">Your admin hasn't shared any documents with you.</p>
                    <button className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#D4AF37]/90 transition-colors">
                        Contact Admin
                    </button>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-2'}>
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className={`
                bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-4
                hover:border-[#D4AF37]/30 transition-all cursor-pointer
                ${viewMode === 'list' ? 'flex items-center gap-4' : ''}
              `}
                        >
                            <div className={`${viewMode === 'grid' ? 'text-center mb-3' : ''}`}>
                                <div className={`${viewMode === 'grid' ? 'text-5xl mb-2' : 'text-3xl'}`}>
                                    {getFileIcon(doc.type)}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-white truncate mb-1">{doc.title}</h3>
                                <p className="text-xs text-[#98989D]">
                                    {new Date(doc.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            {viewMode === 'list' && (
                                <button className="px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium rounded-lg hover:bg-[#D4AF37]/20 transition-colors">
                                    Download
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
