import { AdminSidebar } from './components/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
            <AdminSidebar />
            <main className="ml-72 min-h-screen relative">
                {/* Top Header/Breadcrumb Area could go here */}
                <div className="p-8 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
