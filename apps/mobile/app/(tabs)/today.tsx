import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import { getCurrentScore, KoreScore } from '@kore/api';

const AnimatedCircle = ({ score, size = 200, strokeWidth = 12, color = '#D4AF37' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreValue}>{score}</Text>
                <Text style={styles.scoreLabel}>K0RE</Text>
            </View>
        </View>
    );
};

export default function TodayScreen() {
    const router = useRouter();
    const [score, setScore] = useState<KoreScore | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const data = await getCurrentScore();
            setScore(data);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [loadData]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const currentScore = score?.overall_score || 0;

    // Domain Mapping
    const domains = [
        { name: 'Financial', key: 'financial_mastery', icon: 'cash-outline', color: '#F59E0B' },
        { name: 'Business', key: 'business_growth', icon: 'trending-up-outline', color: '#3B82F6' },
        { name: 'Physical', key: 'health_vitality', icon: 'fitness-outline', color: '#10B981' },
        { name: 'Relational', key: 'relationships', icon: 'people-outline', color: '#06B6D4' },
        { name: 'Personal', key: 'personal_development', icon: 'book-outline', color: '#EC4899' },
        { name: 'Spiritual', key: 'spiritual_alignment', icon: 'star-outline', color: '#8B5CF6' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />
                }
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.date}>TODAY</Text>
                        <Text style={styles.greeting}>Good Evening</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
                        <Ionicons name="person-circle-outline" size={32} color="#D4AF37" />
                    </TouchableOpacity>
                </View>

                {/* Score Section */}
                <View style={styles.scoreSection}>
                    <AnimatedCircle score={currentScore} />
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="flame" size={16} color="#30D158" />
                            <Text style={styles.statText}>Streak: 14</Text>
                        </View>
                        <View style={styles.statSeparator} />
                        <View style={styles.statItem}>
                            <Ionicons name="trending-up" size={16} color="#30D158" />
                            <Text style={styles.statText}>+5 Today</Text>
                        </View>
                    </View>
                </View>

                {/* Domains Grid */}
                <Text style={styles.sectionTitle}>Life Domains</Text>
                <View style={styles.grid}>
                    {domains.map((domain, i) => (
                        <TouchableOpacity key={i} style={styles.card}>
                            <View style={[styles.iconContainer, { backgroundColor: `${domain.color}20` }]}>
                                <Ionicons name={domain.icon as any} size={20} color={domain.color} />
                            </View>
                            <Text style={styles.cardTitle}>{domain.name}</Text>
                            <Text style={[styles.cardScore, { color: domain.color }]}>
                                {score ? score[domain.key as keyof KoreScore] : 0}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    date: {
        color: '#8E8E93',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    greeting: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
    },
    profileButton: {
        padding: 4,
    },
    scoreSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    scoreTextContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        includeFontPadding: false,
    },
    scoreLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#D4AF37',
        marginTop: -4,
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        color: '#8E8E93',
        fontSize: 13,
        fontWeight: '500',
    },
    statSeparator: {
        width: 1,
        height: 12,
        backgroundColor: '#38383A',
        marginHorizontal: 12,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        width: '31%', // roughly 1/3 minus gap
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        color: '#8E8E93',
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 4,
    },
    cardScore: {
        fontSize: 18,
        fontWeight: '700',
    },
});
