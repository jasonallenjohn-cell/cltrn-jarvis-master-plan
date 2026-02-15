import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { executeSkill } from '@kore/api';

const SKILLS = [
    { id: 'sentiment-analysis', name: 'Sentiment Analysis', icon: 'heart-circle', desc: 'Detailed emotional analysis' },
    { id: 'summarize', name: 'Summarizer', icon: 'document-text', desc: 'Condense articles or notes' },
];

export default function SkillsScreen() {
    const [selectedSkill, setSelectedSkill] = useState(SKILLS[0]);
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const data = await executeSkill(selectedSkill.id, { text: input });
            setResult(data);
        } catch (e: any) {
            console.error(e);
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Skill Station</Text>

            <View style={styles.skillSelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.skillList}>
                    {SKILLS.map(skill => (
                        <TouchableOpacity
                            key={skill.id}
                            style={[
                                styles.skillChip,
                                selectedSkill.id === skill.id && styles.skillChipActive
                            ]}
                            onPress={() => {
                                setSelectedSkill(skill);
                                setResult(null);
                            }}
                        >
                            <Ionicons
                                name={skill.icon as any}
                                size={20}
                                color={selectedSkill.id === skill.id ? '#000' : '#888'}
                            />
                            <Text style={[
                                styles.skillText,
                                selectedSkill.id === skill.id && styles.skillTextActive
                            ]}>{skill.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.label}>Input</Text>
                    <TextInput
                        style={styles.input}
                        multiline
                        placeholder={`Enter text for ${selectedSkill.name}...`}
                        placeholderTextColor="#666"
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity
                        style={styles.runButton}
                        onPress={handleRun}
                        disabled={loading || !input.trim()}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.runButtonText}>Execute Skill</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {(result || loading) && (
                    <View style={[styles.card, loading && { opacity: 0.5 }]}>
                        <Text style={styles.label}>Output</Text>
                        <View style={styles.outputBox}>
                            <Text style={styles.outputCode}>
                                {result ? JSON.stringify(result, null, 2) : 'Processing...'}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 24,
    },
    skillSelector: {
        marginBottom: 24,
    },
    skillList: {
        gap: 12,
    },
    skillChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    skillChipActive: {
        backgroundColor: '#D4AF37',
        borderColor: '#D4AF37',
    },
    skillText: {
        color: '#888',
        fontWeight: '500',
    },
    skillTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    content: {
        gap: 24,
    },
    card: {
        backgroundColor: '#1C1C1E',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    label: {
        color: '#888',
        fontSize: 12,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        color: '#fff',
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    runButton: {
        backgroundColor: '#D4AF37',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    runButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    outputBox: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 12,
    },
    outputCode: {
        color: '#30D158',
        fontFamily: 'Courier', // Will fallback on Android but works on iOS
        fontSize: 13,
    },
});
