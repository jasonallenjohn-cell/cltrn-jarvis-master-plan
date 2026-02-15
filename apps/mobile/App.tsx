import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>K0RE Mobile</Text>
            <Text style={styles.subtext}>Dreaming Reality™</Text>
            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#C9A84C',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtext: {
        color: '#A8A9AD',
        fontSize: 16,
        marginTop: 8,
    }
});
