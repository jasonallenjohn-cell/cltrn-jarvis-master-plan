import * as React from "react";

export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="bg-kore-gold text-kore-black font-bold py-2 px-4 rounded hover:bg-opacity-90 transition-all active:scale-95"
            {...props}
        >
            {children}
        </button>
    );
}

export function Card({ title, children, href }: { title: string; children: React.ReactNode; href?: string }) {
    return (
        <a
            href={href}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-kore-gold/30 hover:bg-kore-black/50 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
            <h2 className={`mb-3 text-2xl font-semibold text-kore-gold`}>
                {title}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    -&gt;
                </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm text-kore-silver opacity-70`}>
                {children}
            </p>
        </a>
    );
}
