import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithMagicLink, signInWithGoogle } from '@kore/api';
import { colors, spacing, typography, borderRadius } from '../../theme/colors';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleMagicLink = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        setLoading(true);
        try {
            await signInWithMagicLink(email);
            Alert.alert(
                'Check your email',
                'We sent you a magic link to sign in. Click the link in your email to continue.'
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send magic link');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            router.replace('/(tabs)/today');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Sign In to K0RE</Text>
                <Text style={styles.subtitle}>Dreaming Reality™</Text>
            </View>

            {/* Email Input */}
            <View style={styles.form}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor={colors.silver}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {/* Magic Link Button */}
                <Pressable
                    style={[styles.button, styles.buttonPrimary]}
                    onPress={handleMagicLink}
                    disabled={loading}
                >
                    <Text style={styles.buttonTextPrimary}>
                        {loading ? 'Sending...' : 'Send Magic Link'}
                    </Text>
                </Pressable>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Google Sign In */}
                <Pressable
                    style={[styles.button, styles.buttonOutline]}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                >
                    <Text style={styles.buttonTextOutline}>Continue with Google</Text>
                </Pressable>
            </View>

            {/* Back to Welcome */}
            <Pressable onPress={() => router.back()}>
                <Text style={styles.backText}>← Back to Welcome</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
        padding: spacing.xxxl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxxl,
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
        color: colors.white,
        marginBottom: spacing.xs,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: typography.sizes.md,
        color: colors.silver,
    },
    form: {
        marginBottom: spacing.xxxl,
    },
    label: {
        fontSize: typography.sizes.base,
        fontWeight: typography.weights.medium,
        color: colors.white,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        fontSize: typography.sizes.md,
        color: colors.white,
        marginBottom: spacing.lg,
    },
    button: {
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    buttonPrimary: {
        backgroundColor: colors.gold,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    buttonTextPrimary: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        color: colors.black,
    },
    buttonTextOutline: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        color: colors.white,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.separator,
    },
    dividerText: {
        fontSize: typography.sizes.sm,
        color: colors.silver,
        marginHorizontal: spacing.md,
    },
    backText: {
        fontSize: typography.sizes.md,
        color: colors.silver,
        textAlign: 'center',
    },
});
