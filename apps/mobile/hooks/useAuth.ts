import { useState, useEffect } from 'react';
import { getCurrentUser, onAuthStateChange } from '@kore/api';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial user
        getCurrentUser()
            .then((currentUser) => {
                setUser(currentUser);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });

        // Listen for auth changes
        const { data } = onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    return { user, loading };
}
