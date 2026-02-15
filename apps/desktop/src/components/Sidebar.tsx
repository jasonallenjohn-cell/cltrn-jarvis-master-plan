
import {
    LayoutDashboard,
    Mic,
    MessageSquare,
    Zap,
    Library,
    Network,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Voice Mode', icon: Mic, path: '/voice' },
    { label: 'AI Chat', icon: MessageSquare, path: '/chat' },
    { label: 'Skills', icon: Zap, path: '/skills' },
    { label: 'Library', icon: Library, path: '/library' },
    { label: 'Ecosystem', icon: Network, path: '/ecosystem' },
    // Admin only
    { label: 'Revenue', icon: BarChart3, path: '/revenue', admin: true },
];

export default function Sidebar() {
    return (
        <div className="w-[220px] bg-sidebar border-r border-white/[0.08] flex flex-col h-full pt-14 pb-4">
            <div className="px-5 mb-6">
                <div className="text-lg font-bold text-gold tracking-tight">K0RE</div>
                <div className="text-[10px] text-silver tracking-[2px] uppercase">Life OS</div>
            </div>

            <nav className="flex-1 px-2 space-y-0.5">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200",
                            isActive
                                ? "bg-gold-dim text-gold border-l-2 border-gold"
                                : "text-silver hover:text-white hover:bg-white/[0.03] border-l-2 border-transparent"
                        )}
                    >
                        <item.icon size={16} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto px-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-[#b8860b] flex items-center justify-center text-[10px] text-black font-bold">
                        JA
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">Jason Allen</div>
                        <div className="text-[10px] text-gold font-semibold tracking-wide uppercase">Architect</div>
                    </div>
                    <button className="text-silver hover:text-white transition-colors">
                        <Settings size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
