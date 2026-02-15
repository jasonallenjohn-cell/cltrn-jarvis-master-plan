'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
    icon: string;
    label: string;
    href: string;
    badge?: number;
}

const navItems: NavItem[] = [
    { icon: '🚀', label: 'Command Center', href: '/admin/command-center' },
    { icon: '👥', label: 'User Management', href: '/admin/users' },
    { icon: '📄', label: 'Document Center', href: '/admin/documents' },
    { icon: '💬', label: 'Communication Hub', href: '/admin/messages' },
    { icon: '📊', label: 'Analytics', href: '/admin/analytics' },
    { icon: '📚', label: 'Content & Learning', href: '/admin/learning' },
    { icon: '🤖', label: 'Agent Monitor', href: '/admin/agents' },
    { icon: '🧪', label: 'Testing Sandbox', href: '/admin/sandbox' },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0A0A0A] border-r border-white/[0.08] flex flex-col z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-white/[0.08]">
                <Link href="/admin/dashboard" className="block">
                    <h1 className="text-2xl font-bold tracking-tighter text-white">
                        K0RE <span className="text-[#D4AF37] text-sm font-normal ml-1">ADMIN</span>
                    </h1>
                    <p className="text-[10px] text-[#98989D] tracking-widest uppercase mt-1">
                        Command & Control
                    </p>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="mb-4 px-4 text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                    Main Modules
                </div>
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                ${isActive
                                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]'
                                    : 'text-[#98989D] hover:bg-white/[0.03] hover:text-[#D4AF37]'
                                }
              `}
                        >
                            <span className={`text-xl ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                                {item.icon}
                            </span>
                            <span className="text-sm font-medium flex-1">{item.label}</span>
                            {item.badge ? (
                                <span className="bg-[#FF3B30] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Info */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0A0A0A]">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/30">
                        <span className="text-[#D4AF37] font-bold">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Administrator</p>
                        <p className="text-xs text-[#98989D] truncate">admin@kore.app</p>
                    </div>
                    <button className="text-[#98989D] hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
}
