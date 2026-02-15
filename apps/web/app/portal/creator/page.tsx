'use client';

import { useState } from 'react';
import { createConnectAccountLink } from '@kore/api';

export default function CreatorDashboard() {
    const [loading, setLoading] = useState(false);

    const handleOnboard = async () => {
        setLoading(true);
        try {
            const { url } = await createConnectAccountLink(window.location.href);
            if (url) window.location.href = url;
        } catch (e) {
            console.error(e);
            alert('Failed to start onboarding');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Creator Hub</h1>
            <p className="text-[#98989D] mb-8">Monetize your skills and wisdom on the K0RE Marketplace.</p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Onboarding Card */}
                <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Connect Payouts</h2>
                    <p className="text-[#98989D] text-sm mb-6">
                        Link your bank account via Stripe to receive payouts from skill sales.
                        You keep 70% of every sale.
                    </p>
                    <button
                        onClick={handleOnboard}
                        disabled={loading}
                        className="w-full py-3 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#b5952f] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Connecting...' : 'Setup Payouts'}
                    </button>
                </div>

                {/* Stats Placeholder */}
                <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-8 opacity-50">
                    <h2 className="text-xl font-bold text-white mb-4">Earnings</h2>
                    <div className="space-y-4">
                        <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
                        <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
                    </div>
                    <p className="text-center text-[#98989D] text-xs mt-4">
                        Connect your account to view earnings.
                    </p>
                </div>
            </div>
        </div>
    );
}
