import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius } from '../../theme/colors';
import { useEffect } from 'react';

export default function WelcomeScreen() {
    const breathe = useSharedValue(1);

    useEffect(() => {
        breathe.value = withRepeat(
            withTiming(1.1, { duration: 3000 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: breathe.value }],
    }));

    return (
        <View style={styles.container}>
            {/* K0RE Logo Ring */}
            <Animated.View style={[styles.logoRing, animatedStyle]}>
                <Text style={styles.logoText}>K</Text>
            </Animated.View>

            {/* Welcome Text */}
            <Text style={styles.title}>Welcome to K0RE</Text>
            <Text style={styles.subtitle}>Dreaming Reality™</Text>
            <Text style={styles.tagline}>Advanced Intelligence. Not Artificial.</Text>

            <Text style={styles.description}>
                Your Conscious Life Operating System. Transform across 6 life domains with Advanced Intelligence that actually knows you.
            </Text>

            {/* Progress Dots */}
            <View style={styles.dots}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
            </View>

            {/* CTA Button */}
            <Pressable style={styles.button}>
                <Link href="/(auth)/login" style={styles.buttonText}>
                    Start Your Transformation
                </Link>
            </Pressable>

            {/* Sign In Link */}
            <Text style={styles.signInText}>
                Already a member?{' '}
                <Link href="/(auth)/login" style={styles.signInLink}>
                    Sign In
                </Link>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xxxl,
    },
    logoRing: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: colors.gold,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xxxl,
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 32,
    },
    logoText: {
        fontSize: 36,
        fontWeight: typography.weights.light,
        color: colors.black,
    },
    title: {
        fontSize: typography.sizes.xxxl,
        fontWeight: typography.weights.bold,
        color: colors.white,
        marginBottom: spacing.md,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.regular,
        color: colors.silver,
        marginBottom: spacing.xs,
    },
    tagline: {
        fontSize: typography.sizes.base,
        color: colors.silver,
        marginBottom: spacing.md,
    },
    description: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.light,
        color: colors.silver,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 280,
        marginTop: spacing.md,
    },
    dots: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.xxxl,
        marginBottom: spacing.xxxl,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    dotActive: {
        width: 24,
        backgroundColor: colors.gold,
    },
    button: {
        width: '100%',
        backgroundColor: colors.gold,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        color: colors.black,
        letterSpacing: -0.2,
        width: '100%',
        textAlign: 'center',
    },
    signInText: {
        fontSize: typography.sizes.base,
        color: colors.silver,
        marginTop: spacing.lg,
        textAlign: 'center',
    },
    signInLink: {
        color: colors.gold,
        fontWeight: typography.weights.medium,
    },
});
