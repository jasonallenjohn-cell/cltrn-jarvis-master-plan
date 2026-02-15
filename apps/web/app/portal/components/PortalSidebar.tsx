'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUnreadCount } from '@kore/api';

interface NavItem {
    icon: string;
    label: string;
    href: string;
    badge?: number;
}

export function PortalSidebar() {
    const pathname = usePathname();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Fetch unread message count
        async function fetchUnread() {
            try {
                const count = await getUnreadCount('current-user-id'); // TODO: Get from auth context
                setUnreadCount(count);
            } catch (error) {
                console.error('Failed to fetch unread count:', error);
            }
        }
        fetchUnread();
    }, []);

    const navItems: NavItem[] = [
        { icon: '📊', label: 'Dashboard', href: '/portal/dashboard' },
        { icon: '📄', label: 'Documents', href: '/portal/documents' },
        { icon: '💬', label: 'Messages', href: '/portal/messages', badge: unreadCount },
        { icon: '⚡', label: 'My Skills', href: '/portal/skills' },
        { icon: '👤', label: 'Profile', href: '/portal/profile' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1C1C1E] border-r border-white/[0.08] flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/[0.06]">
                <h1 className="text-2xl font-semibold text-[#D4AF37] tracking-wider">K0RE</h1>
                <p className="text-xs text-[#98989D] mt-1 italic">Dreaming Reality™</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive
                                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]'
                                    : 'text-[#98989D] hover:bg-white/[0.03] hover:text-[#D4AF37]'
                                }
              `}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-sm font-medium flex-1">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                                <span className="bg-[#D4AF37] text-black text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                        <span className="text-[#D4AF37] font-semibold">U</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-white">User Name</p>
                        <p className="text-xs text-[#98989D]">Observer</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
