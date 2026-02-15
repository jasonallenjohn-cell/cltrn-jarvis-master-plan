import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function DebugPage() {
    const cookieStore = cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    let profileError = null;
    if (user) {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        profile = data;
        profileError = error;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono">
            <h1 className="text-2xl font-bold mb-6">🔍 Debug Info</h1>

            <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h2 className="font-bold mb-2 text-yellow-400">Auth User:</h2>
                    <p>ID: {user?.id || 'NOT AUTHENTICATED'}</p>
                    <p>Email: {user?.email || 'N/A'}</p>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h2 className="font-bold mb-2 text-yellow-400">Profile from DB:</h2>
                    {profileError && <p className="text-red-400">Error: {profileError.message}</p>}
                    {profile ? (
                        <>
                            <p>Role: <span className="text-green-400 font-bold">{profile.role}</span></p>
                            <p>Tier: {profile.subscription_tier}</p>
                            <p>Score: {profile.kore_score}</p>
                            <p>Name: {profile.full_name}</p>
                        </>
                    ) : (
                        <p className="text-red-400">No profile found</p>
                    )}
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h2 className="font-bold mb-2 text-yellow-400">Admin Check:</h2>
                    <p className="text-2xl">
                        {profile?.role === 'admin' ? '✅ IS ADMIN' : '❌ NOT ADMIN'}
                    </p>
                </div>
            </div>
        </div>
    );
}
