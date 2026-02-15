'use client';

import { useState } from 'react';
import { createPortalSession } from '@kore/api';

export default function BillingSettings() {
    const [loading, setLoading] = useState(false);

    const handleManage = async () => {
        setLoading(true);
        try {
            const { url } = await createPortalSession(window.location.href);
            if (url) window.location.href = url;
        } catch (e) {
            console.error(e);
            alert('Failed to load portal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Billing Settings</h1>

            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-medium text-white">Manage Subscription</h2>
                        <p className="text-[#98989D] text-sm">Update your payment method, view invoices, or change your plan.</p>
                    </div>
                    <button
                        onClick={handleManage}
                        disabled={loading}
                        className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#b5952f] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Open Customer Portal'}
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.08]">
                    <h3 className="text-white font-medium mb-4">Enterprise Invoicing</h3>
                    <p className="text-[#98989D] text-sm mb-4">
                        Need manual invoicing with NET-30 terms? Contact our enterprise support team.
                    </p>
                    <a href="mailto:enterprise@kore.com" className="text-[#D4AF37] hover:underline text-sm">Contact Support &rarr;</a>
                </div>
            </div>
        </div>
    );
}
