'use client';

import { useState } from 'react';
import { createCheckoutSession } from '@kore/api';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const router = useRouter();
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
    const [loading, setLoading] = useState<string | null>(null);

    const plans = [
        {
            name: 'Observer',
            price: { month: 0, year: 0 },
            features: ['Access to K0RE Portal', 'Basic Community Access', 'Daily Inspiration'],
            priceId: { month: '', year: '' },
        },
        {
            name: 'Operator',
            price: { month: 78, year: 58 },
            features: ['Core Engine Access', 'Basic Skills (3/mo)', 'K0RE Score Tracking'],
            popular: true,
            priceId: { month: 'price_operator_monthly', year: 'price_operator_annual' },
        },
        {
            name: 'Commander',
            price: { month: 198, year: 158 },
            features: ['Advanced Skills (Unlimited)', 'Priority Support', 'Full Memory Vault', 'Private Network'],
            priceId: { month: 'price_commander_monthly', year: 'price_commander_annual' },
        },
        {
            name: 'Architect',
            price: { month: 398, year: 318 },
            features: ['Full Platform Access', 'Stripe Connect (Sell Skills)', 'API Access', 'Enterprise Support'],
            priceId: { month: 'price_architect_monthly', year: 'price_architect_annual' },
        },
    ];

    async function handleSubscribe(planName: string, priceId: string) {
        if (!priceId) return; // Free plan logic or contact sales
        setLoading(planName);
        try {
            const { url } = await createCheckoutSession(priceId, window.location.origin + '/portal');
            if (url) window.location.href = url;
        } catch (e) {
            console.error(e);
            alert('Failed to start checkout');
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white py-24 px-6 relative overflow-hidden">
            {/* Background Particles (Simplified) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black -z-10" />

            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
                    Choose Your Reality
                </h1>
                <p className="text-neutral-400 text-lg mb-8">
                    Unlock the full potential of K0RE.
                </p>

                {/* Toggle */}
                <div className="flex items-center justify-center gap-4">
                    <span className={`text-sm ${billingInterval === 'month' ? 'text-white' : 'text-neutral-500'}`}>Monthly</span>
                    <button
                        onClick={() => setBillingInterval(prev => prev === 'month' ? 'year' : 'month')}
                        className="w-14 h-8 rounded-full bg-neutral-800 border border-neutral-700 relative transition-colors"
                    >
                        <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-[#D4AF37] transition-transform ${billingInterval === 'year' ? 'translate-x-6' : ''}`} />
                    </button>
                    <span className={`text-sm ${billingInterval === 'year' ? 'text-white' : 'text-neutral-500'}`}>
                        Annual <span className="text-[#D4AF37] text-xs ml-1">(Save 20%)</span>
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative p-8 rounded-2xl border ${plan.popular ? 'border-[#D4AF37] bg-neutral-900/50' : 'border-neutral-800 bg-neutral-900/30'
                            } backdrop-blur-sm hover:border-neutral-600 transition-colors`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full">
                                MOST POPULAR
                            </div>
                        )}
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">
                                ${billingInterval === 'month' ? plan.price.month : plan.price.year}
                            </span>
                            <span className="text-neutral-500">/mo</span>
                        </div>

                        <ul className="space-y-4 mb-8 min-h-[160px]">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                    <svg className="w-5 h-5 text-[#D4AF37] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSubscribe(plan.name, billingInterval === 'month' ? plan.priceId.month : plan.priceId.year)}
                            disabled={loading === plan.name || !plan.priceId.month}
                            className={`w-full py-3 rounded-lg font-medium transition-all ${plan.popular
                                    ? 'bg-[#D4AF37] text-black hover:bg-[#b5952f]'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading === plan.name ? 'Processing...' : plan.priceId.month ? 'Subscribe' : 'Current Plan'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
