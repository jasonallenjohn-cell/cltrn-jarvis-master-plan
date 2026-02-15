'use client';

import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Store references that won't be null
        const c = canvas;
        const context = ctx;

        // Set canvas size
        const resizeCanvas = () => {
            c.width = window.innerWidth;
            c.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle system
        const particleCount = window.innerWidth > 768 ? 100 : 30;
        const particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * c.width;
                this.y = Math.random() * c.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = c.width;
                if (this.x > c.width) this.x = 0;
                if (this.y < 0) this.y = c.height;
                if (this.y > c.height) this.y = 0;
            }

            draw() {
                context.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                context.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        let animationId: number;
        const animate = () => {
            context.fillStyle = 'rgba(10, 10, 10, 0.02)';
            context.fillRect(0, 0, c.width, c.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none"
        />
    );
}
