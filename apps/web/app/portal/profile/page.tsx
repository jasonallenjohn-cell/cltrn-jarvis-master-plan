'use client';

export default function ProfilePage() {
    // TODO: Get from user profile
    const user = {
        name: 'User Name',
        email: 'user@example.com',
        avatar: null,
        koreScore: 72,
        tier: 'observer',
        streak: 14,
        referralCode: 'KORE-ABC123',
        nextPayment: '2026-03-14',
    };

    const handleManageBilling = async () => {
        // TODO: Implement Stripe Customer Portal redirect
        console.log('Redirecting to Stripe Customer Portal...');
    };

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-semibold text-white mb-2">Profile & Settings</h1>
                <p className="text-[#98989D]">Manage your account and preferences</p>
            </div>

            {/* Profile Section */}
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                <h2 className="text-xl font-medium text-white mb-6">Profile</h2>
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-3xl font-bold text-[#D4AF37]">
                            {user.name.charAt(0)}
                        </div>
                        <button className="mt-3 text-sm text-[#D4AF37] hover:underline">
                            Change Photo
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="text-sm text-[#98989D] mb-1 block">Full Name</label>
                            <input
                                type="text"
                                value={user.name}
                                className="w-full bg-[#2C2C2E] border border-white/[0.08] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-[#98989D] mb-1 block">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full bg-[#2C2C2E] border border-white/[0.08] rounded-lg px-4 py-2 text-[#98989D] cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex-shrink-0 space-y-3">
                        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg px-4 py-2 text-center">
                            <div className="text-2xl font-bold text-[#D4AF37]">{user.koreScore}</div>
                            <div className="text-xs text-[#98989D]">K0RE Score</div>
                        </div>
                        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg px-4 py-2 text-center">
                            <div className="text-2xl">🔥</div>
                            <div className="text-xs text-[#98989D]">{user.streak} days</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription & Billing */}
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                <h2 className="text-xl font-medium text-white mb-6">Subscription & Billing</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-medium capitalize">{user.tier} Plan</div>
                            <div className="text-sm text-[#98989D]">Next payment: {user.nextPayment}</div>
                        </div>
                        <button
                            onClick={handleManageBilling}
                            className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#D4AF37]/90 transition-colors"
                        >
                            Manage Billing
                        </button>
                    </div>
                    <div className="pt-4 border-t border-white/[0.06]">
                        <button className="text-sm text-[#D4AF37] hover:underline">
                            Upgrade to Operator →
                        </button>
                    </div>
                </div>
            </div>

            {/* Referral */}
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                <h2 className="text-xl font-medium text-white mb-6">Referral Program</h2>
                <p className="text-sm text-[#98989D] mb-4">
                    Share K0RE with friends and earn rewards
                </p>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={user.referralCode}
                        readOnly
                        className="flex-1 bg-[#2C2C2E] border border-white/[0.08] rounded-lg px-4 py-2 text-white"
                    />
                    <button className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#D4AF37]/90 transition-colors">
                        Copy Code
                    </button>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                <h2 className="text-xl font-medium text-white mb-6">Notifications</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-medium">Email Notifications</div>
                            <div className="text-sm text-[#98989D]">Receive updates via email</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-[#2C2C2E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-medium">Daily Digest</div>
                            <div className="text-sm text-[#98989D]">Summary of your day at 8 PM</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-[#2C2C2E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-xl p-6">
                <h2 className="text-xl font-medium text-white mb-6">Account</h2>
                <div className="space-y-3">
                    <button className="text-sm text-[#D4AF37] hover:underline">
                        Change Password
                    </button>
                    <br />
                    <button className="text-sm text-[#D4AF37] hover:underline">
                        Export My Data
                    </button>
                    <br />
                    <button className="text-sm text-red-500 hover:underline">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
