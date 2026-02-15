'use client';

import { useState, useEffect } from 'react';
import { createCommandCenterClient } from '@kore/api';

interface LearningMaterial {
    id: string;
    title: string;
    type: 'study_material' | 'assessment';
    description: string;
    content: any;
    assigned_to: string[];
    created_at: string;
}

export default function AdminLearningPage() {
    const [materials, setMaterials] = useState<LearningMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newMaterial, setNewMaterial] = useState({
        title: '',
        type: 'study_material' as 'study_material' | 'assessment',
        description: '',
        content: '',
    });

    useEffect(() => {
        loadMaterials();
    }, []);

    async function loadMaterials() {
        setLoading(true);
        try {
            const supabase = createCommandCenterClient() as any;
            const { data } = await supabase
                .from('learning_materials')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setMaterials(data);
        } catch (e) {
            console.error('Failed to load materials:', e);
        } finally {
            setLoading(false);
        }
    }

    async function createMaterial() {
        if (!newMaterial.title.trim()) return;

        try {
            const supabase = createCommandCenterClient() as any;
            await supabase.from('learning_materials').insert({
                title: newMaterial.title,
                type: newMaterial.type,
                description: newMaterial.description,
                content: { body: newMaterial.content },
                assigned_to: [],
            });

            setShowCreateModal(false);
            setNewMaterial({ title: '', type: 'study_material', description: '', content: '' });
            await loadMaterials();
        } catch (e) {
            console.error('Failed to create material:', e);
        }
    }

    async function assignToAll(materialId: string) {
        try {
            const supabase = createCommandCenterClient() as any;
            const { data: users } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('role', 'customer');

            if (users) {
                await supabase
                    .from('learning_materials')
                    .update({ assigned_to: users.map((u: any) => u.id) })
                    .eq('id', materialId);
            }

            await loadMaterials();
        } catch (e) {
            console.error('Failed to assign:', e);
        }
    }

    async function deleteMaterial(id: string) {
        if (!confirm('Delete this material?')) return;

        try {
            const supabase = createCommandCenterClient() as any;
            await supabase.from('learning_materials').delete().eq('id', id);
            await loadMaterials();
        } catch (e) {
            console.error('Failed to delete:', e);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Content & Learning</h1>
                    <p className="text-[#98989D]">Create study materials and assessments for customers</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-lg font-medium transition-colors"
                >
                    + Create Material
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{materials.length}</div>
                    <div className="text-xs text-[#98989D] mt-1">Total Materials</div>
                </div>
                <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                        {materials.filter(m => m.type === 'study_material').length}
                    </div>
                    <div className="text-xs text-[#98989D] mt-1">Study Materials</div>
                </div>
                <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                        {materials.filter(m => m.type === 'assessment').length}
                    </div>
                    <div className="text-xs text-[#98989D] mt-1">Assessments</div>
                </div>
            </div>

            {/* Materials Grid */}
            {loading ? (
                <div className="text-center text-[#98989D] py-12">Loading materials...</div>
            ) : materials.length === 0 ? (
                <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-12 text-center">
                    <div className="text-4xl mb-3">📚</div>
                    <p className="text-lg text-white font-medium">No materials yet</p>
                    <p className="text-sm text-[#98989D] mt-1">Create your first study material or assessment</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {materials.map((material) => (
                        <div key={material.id} className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-6 hover:border-white/[0.15] transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {material.type === 'study_material' ? '📖' : '📝'}
                                    </span>
                                    <div>
                                        <h3 className="font-medium text-white">{material.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded ${material.type === 'study_material'
                                            ? 'bg-blue-500/20 text-blue-300'
                                            : 'bg-purple-500/20 text-purple-300'
                                            }`}>
                                            {material.type === 'study_material' ? 'Study Material' : 'Assessment'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {material.description && (
                                <p className="text-sm text-[#98989D] mb-4 line-clamp-2">{material.description}</p>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[#98989D]">
                                    Assigned to {material.assigned_to?.length || 0} users
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => assignToAll(material.id)}
                                        className="px-3 py-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded text-sm transition-colors"
                                    >
                                        Assign All
                                    </button>
                                    <button
                                        onClick={() => deleteMaterial(material.id)}
                                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-8 max-w-lg w-full mx-4">
                        <h3 className="text-xl font-bold text-white mb-6">Create Learning Material</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#98989D] uppercase mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newMaterial.title}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50"
                                    placeholder="Enter material title..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#98989D] uppercase mb-2">Type</label>
                                <select
                                    value={newMaterial.type}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as any })}
                                    className="w-full px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50"
                                >
                                    <option value="study_material">Study Material</option>
                                    <option value="assessment">Assessment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#98989D] uppercase mb-2">Description</label>
                                <input
                                    type="text"
                                    value={newMaterial.description}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50"
                                    placeholder="Brief description..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#98989D] uppercase mb-2">Content</label>
                                <textarea
                                    value={newMaterial.content}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, content: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50 h-32 resize-none"
                                    placeholder="Enter content or paste markdown..."
                                />
                            </div>
                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={createMaterial}
                                    disabled={!newMaterial.title.trim()}
                                    className="flex-1 px-4 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-3 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-lg transition-colors"
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
