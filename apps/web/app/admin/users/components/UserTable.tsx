'use client';

import { useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import { getAllUsers, type UserFilters } from '@kore/api';

type UserProfile = {
    id: string;
    email: string;
    full_name: string | null;
    kore_score: number | null;
    subscription_tier: string;
    onboarding_status: string;
    role: string | null;
    created_at: string;
    [key: string]: any;
};

export function UserTable({ onUserClick }: { onUserClick: (user: UserProfile) => void }) {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const columns: ColumnDef<UserProfile>[] = [
        {
            accessorKey: 'full_name',
            header: 'Name',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-white">{row.original.full_name || 'N/A'}</div>
                    <div className="text-xs text-[#98989D]">{row.original.email}</div>
                </div>
            ),
        },
        {
            accessorKey: 'subscription_tier',
            header: 'Tier',
            cell: ({ row }) => {
                const tier = row.original.subscription_tier;
                const colors: Record<string, string> = {
                    observer: 'bg-gray-500/20 text-gray-300',
                    operator: 'bg-blue-500/20 text-blue-300',
                    commander: 'bg-purple-500/20 text-purple-300',
                    architect: 'bg-[#D4AF37]/20 text-[#D4AF37]',
                    enterprise: 'bg-red-500/20 text-red-300',
                };
                return (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[tier] || colors.observer}`}>
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </span>
                );
            },
        },
        {
            accessorKey: 'kore_score',
            header: 'K0RE Score',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#D4AF37]">{row.original.kore_score || 0}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'onboarding_status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.onboarding_status;
                const colors: Record<string, string> = {
                    pending: 'bg-yellow-500/20 text-yellow-300',
                    in_progress: 'bg-blue-500/20 text-blue-300',
                    completed: 'bg-green-500/20 text-green-300',
                };
                return (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || colors.pending}`}>
                        {status.replace('_', ' ').toUpperCase()}
                    </span>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Joined',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <button
                    onClick={() => onUserClick(row.original)}
                    className="px-3 py-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded text-sm font-medium transition-colors"
                >
                    View
                </button>
            ),
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    useEffect(() => {
        loadUsers();
    }, [search, tierFilter, statusFilter]);

    async function loadUsers() {
        setLoading(true);
        try {
            const filters: UserFilters = {};
            if (search) filters.search = search;
            if (tierFilter) filters.tier = tierFilter;
            if (statusFilter) filters.status = statusFilter;

            const data = await getAllUsers(filters);
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#0A0A0A] border border-white/[0.08] rounded-lg text-white placeholder:text-[#98989D] focus:outline-none focus:border-[#D4AF37]/50"
                />
                <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="px-4 py-2 bg-[#0A0A0A] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50"
                >
                    <option value="">All Tiers</option>
                    <option value="observer">Observer</option>
                    <option value="operator">Operator</option>
                    <option value="commander">Commander</option>
                    <option value="architect">Architect</option>
                    <option value="enterprise">Enterprise</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-[#0A0A0A] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[#98989D]">Loading users...</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/[0.02] border-b border-white/[0.08]">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider cursor-pointer hover:text-[#D4AF37] transition-colors"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-white/[0.08]">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm text-[#98989D]">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && users.length === 0 && (
                    <div className="p-12 text-center text-[#98989D]">No users found</div>
                )}
            </div>

            {/* Stats */}
            <div className="text-sm text-[#98989D]">
                Showing {users.length} user{users.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
}
