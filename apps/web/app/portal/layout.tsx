import { PortalSidebar } from './components/PortalSidebar';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            <PortalSidebar />
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
