import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchMemories, addMemory } from '@kore/api';

export default function VaultScreen() {
    const [query, setQuery] = useState('');
    const [memories, setMemories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [newMemory, setNewMemory] = useState('');
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<'search' | 'add'>('search');

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const results = await searchMemories(query);
            setMemories(results);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!newMemory.trim()) return;
        setSaving(true);
        try {
            await addMemory(newMemory, 'explicit');
            setNewMemory('');
            setMode('search');
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Memory Vault</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setMode(mode === 'search' ? 'add' : 'search')}
                >
                    <Ionicons name={mode === 'search' ? "add" : "search"} size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {mode === 'search' ? (
                <>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search memories..."
                            placeholderTextColor="#666"
                            value={query}
                            onChangeText={setQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                    </View>

                    {loading ? (
                        <ActivityIndicator color="#D4AF37" style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={memories}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContent}
                            renderItem={({ item }) => (
                                <View style={styles.memoryCard}>
                                    <Text style={styles.memoryText}>{item.content}</Text>
                                    <View style={styles.memoryFooter}>
                                        <Text style={styles.memoryMeta}>
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </Text>
                                        {item.similarity && (
                                            <Text style={styles.memoryMatch}>
                                                {(item.similarity * 100).toFixed(0)}% Match
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No memories found</Text>
                            }
                        />
                    )}
                </>
            ) : (
                <View style={styles.addContent}>
                    <TextInput
                        style={styles.addInput}
                        multiline
                        placeholder="Record a new memory..."
                        placeholderTextColor="#666"
                        value={newMemory}
                        onChangeText={setNewMemory}
                    />
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save to Vault</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D4AF37',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        margin: 24,
        padding: 12,
        borderRadius: 12,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    listContent: {
        padding: 24,
        paddingTop: 0,
        gap: 16,
    },
    memoryCard: {
        backgroundColor: '#1C1C1E',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    memoryText: {
        color: '#fff',
        fontSize: 15,
        marginBottom: 8,
        lineHeight: 22,
    },
    memoryFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    memoryMeta: {
        color: '#666',
        fontSize: 12,
    },
    memoryMatch: {
        color: '#D4AF37',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 40,
    },
    addContent: {
        padding: 24,
        gap: 16,
    },
    addInput: {
        backgroundColor: '#1C1C1E',
        color: '#fff',
        height: 200,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#D4AF37',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
});
