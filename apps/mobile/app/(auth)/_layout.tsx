import { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function AuthLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // TODO: Add loading screen
    }

    if (user) {
        return <Redirect href="/(tabs)/today" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
        </Stack>
    );
}
