'use client';

import { useState, useEffect } from 'react';
import { getAdminUserProfile, updateAdminUserProfile, getScoreHistory, type ScoreHistoryEntry } from '@kore/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type UserProfile = {
    id: string;
    email: string;
    full_name: string | null;
    kore_score: number | null;
    subscription_tier: string;
    role: string | null;
    created_at: string;
    [key: string]: any;
};

interface UserDetailModalProps {
    userId: string;
    onClose: () => void;
    onUpdate: () => void;
}

export function UserDetailModal({ userId, onClose, onUpdate }: UserDetailModalProps) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [scoreHistory, setScoreHistory] = useState<ScoreHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        kore_score: 0,
        subscription_tier: 'observer',
        role: 'customer',
    });

    useEffect(() => {
        loadUser();
    }, [userId]);

    async function loadUser() {
        setLoading(true);
        try {
            const [userData, history] = await Promise.all([
                getAdminUserProfile(userId as any),
                getScoreHistory(userId as any),
            ]);

            if (userData) {
                setUser(userData);
                setFormData({
                    full_name: userData.full_name || '',
                    kore_score: userData.kore_score || 0,
                    subscription_tier: userData.subscription_tier,
                    role: userData.role || 'customer',
                });
            }
            setScoreHistory(history as any);
        } catch (error) {
            console.error('Failed to load user:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!user) return;

        setSaving(true);
        try {
            await updateAdminUserProfile(userId as any, formData as any);
            setEditMode(false);
            onUpdate();
            await loadUser();
        } catch (error) {
            console.error('Failed to update user:', error);
            alert('Failed to update user');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-8 max-w-4xl w-full mx-4">
                    <div className="text-center text-[#98989D]">Loading user details...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-8 max-w-4xl w-full my-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">User Details</h2>
                    <div className="flex gap-2">
                        {editMode ? (
                            <>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg font-medium transition-colors"
                            >
                                Edit
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* User Info Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-xs font-semibold text-[#98989D] uppercase mb-2">Full Name</label>
                        {editMode ? (
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50"
                            />
                        ) : (
                            <p className="text-white">{user.full_name || 'N/A'}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#98989D] uppercase mb-2">Email</label>
                        <p className="text-white">{user.email}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#98989D] uppercase mb-2">K0RE Score</label>
                        {editMode ? (
                            <input
                                type="number"
                                value={formData.kore_score}
                                onChange={(e) => setFormData({ ...formData, kore_score: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50"
                            />
                        ) : (
                            <p className="text-[#D4AF37] text-2xl font-bold">{user.kore_score || 0}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#98989D] uppercase mb-2">Subscription Tier</label>
                        {editMode ? (
                            <select
                                value={formData.subscription_tier}
                                onChange={(e) => setFormData({ ...formData, subscription_tier: e.target.value as any })}
                                className="w-full px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50"
                            >
                                <option value="observer">Observer</option>
                                <option value="operator">Operator</option>
                                <option value="commander">Commander</option>
                                <option value="architect">Architect</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        ) : (
                            <p className="text-white capitalize">{user.subscription_tier}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#98989D] uppercase mb-2">Role</label>
                        {editMode ? (
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                className="w-full px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50"
                            >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                            </select>
                        ) : (
                            <p className="text-white capitalize">{user.role || 'customer'}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#98989D] uppercase mb-2">Joined</label>
                        <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* K0RE Score History Chart */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">K0RE Score History (Last 30 Days)</h3>
                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-6">
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={scoreHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#98989D"
                                    tick={{ fill: '#98989D', fontSize: 12 }}
                                />
                                <YAxis
                                    stroke="#98989D"
                                    tick={{ fill: '#98989D', fontSize: 12 }}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0A0A0A',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#D4AF37"
                                    strokeWidth={2}
                                    dot={{ fill: '#D4AF37', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
