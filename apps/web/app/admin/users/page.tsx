'use client';

import { useState } from 'react';
import { UserTable } from './components/UserTable';
import { UserDetailModal } from './components/UserDetailModal';

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

export default function AdminUsersPage() {
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-[#98989D]">View and manage all customer accounts</p>
                </div>
            </div>

            <UserTable
                key={refreshKey}
                onUserClick={(user) => setSelectedUser(user)}
            />

            {selectedUser && (
                <UserDetailModal
                    userId={selectedUser.id}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={() => {
                        setRefreshKey(prev => prev + 1);
                    }}
                />
            )}
        </div>
    );
}
