'use client';

import { useEffect, useRef } from 'react';

interface ScoreRingProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    className?: string;
}

export function ScoreRing({
    score,
    size = 200,
    strokeWidth = 8,
    label = 'K0RE SCORE',
    className = '',
}: ScoreRingProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let currentProgress = 0;
        const targetProgress = score / 100;
        const duration = 1500; // 1.5 seconds
        const startTime = Date.now();

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            currentProgress = targetProgress * (1 - Math.pow(1 - progress, 3));

            // Clear canvas
            ctx!.clearRect(0, 0, size, size);

            // Draw background circle
            ctx!.beginPath();
            ctx!.arc(size / 2, size / 2, radius, 0, 2 * Math.PI);
            ctx!.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx!.lineWidth = strokeWidth;
            ctx!.stroke();

            // Draw progress arc
            ctx!.beginPath();
            ctx!.arc(
                size / 2,
                size / 2,
                radius,
                -Math.PI / 2,
                -Math.PI / 2 + 2 * Math.PI * currentProgress
            );
            ctx!.strokeStyle = '#D4AF37'; // Gold
            ctx!.lineWidth = strokeWidth;
            ctx!.lineCap = 'round';
            ctx!.stroke();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        animate();
    }, [score, size, strokeWidth, radius]);

    return (
        <div className={`relative inline-flex flex-col items-center ${className}`}>
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                className="drop-shadow-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white">{score}</span>
                <span className="text-xs text-[#98989D] tracking-wider mt-1">{label}</span>
            </div>
        </div>
    );
}
