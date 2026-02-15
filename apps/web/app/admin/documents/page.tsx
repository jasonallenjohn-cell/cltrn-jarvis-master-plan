'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { createCommandCenterClient } from '@kore/api';

interface DocumentItem {
    id: string;
    title: string;
    type: string;
    file_url: string;
    shared_with: string[];
    created_by: string;
    created_at: string;
    status: string;
}

export default function AdminDocumentsPage() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [shareModalDoc, setShareModalDoc] = useState<DocumentItem | null>(null);
    const [shareTarget, setShareTarget] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {
        setLoading(true);
        try {
            const supabase = createCommandCenterClient() as any;
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) setDocuments(data);
        } catch (e) {
            console.error('Failed to load documents:', e);
        } finally {
            setLoading(false);
        }
    }

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) await uploadFiles(files);
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) await uploadFiles(files);
    };

    async function uploadFiles(files: File[]) {
        setUploading(true);
        try {
            const supabase = createCommandCenterClient() as any;

            for (const file of files) {
                const fileName = `${Date.now()}-${file.name}`;

                // Upload to storage
                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error('Upload failed:', uploadError);
                    continue;
                }

                // Create document record
                const { error: insertError } = await supabase
                    .from('documents')
                    .insert({
                        title: file.name,
                        type: file.type || 'application/octet-stream',
                        file_url: fileName,
                        shared_with: [],
                        created_by: 'admin',
                        status: 'active',
                    });

                if (insertError) console.error('Insert failed:', insertError);
            }

            await loadDocuments();
        } catch (e) {
            console.error('Upload error:', e);
        } finally {
            setUploading(false);
        }
    }

    async function shareDocument(docId: string, target: string) {
        try {
            const supabase = createCommandCenterClient() as any;

            if (target === 'all') {
                // Get all user IDs
                const { data: users } = await supabase
                    .from('user_profiles')
                    .select('id');

                const userIds = users?.map((u: any) => u.id) || [];

                await supabase
                    .from('documents')
                    .update({ shared_with: userIds })
                    .eq('id', docId);
            } else {
                // Share with specific user
                const doc = documents.find(d => d.id === docId);
                const updatedShared = [...(doc?.shared_with || []), target];

                await supabase
                    .from('documents')
                    .update({ shared_with: updatedShared })
                    .eq('id', docId);
            }

            setShareModalDoc(null);
            setShareTarget('');
            await loadDocuments();
        } catch (e) {
            console.error('Share failed:', e);
        }
    }

    async function deleteDocument(docId: string) {
        if (!confirm('Are you sure you want to delete this document?')) return;

        try {
            const supabase = createCommandCenterClient() as any;
            await supabase
                .from('documents')
                .update({ status: 'deleted' })
                .eq('id', docId);

            await loadDocuments();
        } catch (e) {
            console.error('Delete failed:', e);
        }
    }

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return '📕';
        if (type.includes('image')) return '🖼️';
        if (type.includes('video')) return '🎬';
        if (type.includes('sheet') || type.includes('csv')) return '📊';
        if (type.includes('doc') || type.includes('word')) return '📝';
        return '📄';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Document Center</h1>
                    <p className="text-[#98989D]">Upload, manage, and share documents with customers</p>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-lg font-medium transition-colors"
                >
                    + Upload Documents
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            {/* Drag & Drop Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-xl p-12 text-center transition-all mb-6
          ${dragOver
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                        : 'border-white/[0.08] hover:border-white/[0.15]'}
        `}
            >
                {uploading ? (
                    <div className="text-[#D4AF37]">
                        <div className="text-4xl mb-3 animate-pulse">⬆️</div>
                        <p className="text-lg font-medium">Uploading...</p>
                    </div>
                ) : (
                    <div className="text-[#98989D]">
                        <div className="text-4xl mb-3">📂</div>
                        <p className="text-lg font-medium mb-1">Drag & drop files here</p>
                        <p className="text-sm">or click "Upload Documents" above</p>
                    </div>
                )}
            </div>

            {/* Documents Table */}
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[#98989D]">Loading documents...</div>
                ) : documents.length === 0 ? (
                    <div className="p-12 text-center text-[#98989D]">
                        <div className="text-4xl mb-3">📂</div>
                        <p className="text-lg font-medium">No documents yet</p>
                        <p className="text-sm mt-1">Upload your first document to get started</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/[0.02] border-b border-white/[0.08]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">Document</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">Shared With</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">Uploaded</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.08]">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{getFileIcon(doc.type)}</span>
                                            <span className="text-white font-medium">{doc.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#98989D]">{doc.type.split('/').pop()}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="text-[#D4AF37]">{doc.shared_with?.length || 0} users</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#98989D]">
                                        {new Date(doc.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShareModalDoc(doc)}
                                                className="px-3 py-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded text-sm transition-colors"
                                            >
                                                Share
                                            </button>
                                            <button
                                                onClick={() => deleteDocument(doc.id)}
                                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Share Modal */}
            {shareModalDoc && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-8 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-white mb-4">Share "{shareModalDoc.title}"</h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => shareDocument(shareModalDoc.id, 'all')}
                                className="w-full px-4 py-3 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg font-medium transition-colors"
                            >
                                📢 Broadcast to All Customers
                            </button>
                            <div className="text-center text-[#98989D] text-sm">or share with a specific user</div>
                            <input
                                type="text"
                                placeholder="Enter user ID..."
                                value={shareTarget}
                                onChange={(e) => setShareTarget(e.target.value)}
                                className="w-full px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => shareDocument(shareModalDoc.id, shareTarget)}
                                    disabled={!shareTarget}
                                    className="flex-1 px-4 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    Share
                                </button>
                                <button
                                    onClick={() => { setShareModalDoc(null); setShareTarget(''); }}
                                    className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
