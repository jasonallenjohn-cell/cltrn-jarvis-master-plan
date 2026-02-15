
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TitleBar from './TitleBar';

export default function Layout() {
    return (
        <div className="h-screen w-screen flex bg-background text-foreground overflow-hidden rounded-xl border border-white/[0.08] shadow-2xl">
            <TitleBar />

            <Sidebar />

            <main className="flex-1 pt-11 bg-card relative overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
