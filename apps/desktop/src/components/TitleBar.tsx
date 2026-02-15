
import { useEffect, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window';

export default function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const checkMaximized = async () => {
            setIsMaximized(await appWindow.isMaximized());
        };
        checkMaximized();

        // Listen for maximize events if possible, or just poll/check on resize
        const unlisten = appWindow.onResized(checkMaximized);
        return () => {
            unlisten.then(f => f());
        };
    }, []);

    return (
        <div
            data-tauri-drag-region
            className="h-11 bg-card border-b border-white/[0.08] flex items-center justify-center select-none fixed top-0 left-0 right-0 z-50"
        >
            {/* Traffic lights are handled by the OS/Tauri overlay, we just provide the space */}
            <div className="absolute left-0 top-0 h-full w-[80px]" data-tauri-drag-region />

            <div className="text-xs font-medium text-silver/50 tracking-wider uppercase pointer-events-none">
                K0RE
            </div>
        </div>
    );
}
