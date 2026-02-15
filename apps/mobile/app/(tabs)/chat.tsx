import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/colors';

export default function ChatScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>K0RE Chat</Text>
            <Text style={styles.subtext}>Coming soon...</Text>
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
    text: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
        color: colors.white,
        marginBottom: spacing.sm,
    },
    subtext: {
        fontSize: typography.sizes.md,
        color: colors.silver,
    },
});
