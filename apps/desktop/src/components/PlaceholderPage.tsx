
export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            <p className="text-silver text-sm max-w-md mx-auto">
                This module is currently under development. Check back soon for updates.
            </p>
        </div>
    );
}
