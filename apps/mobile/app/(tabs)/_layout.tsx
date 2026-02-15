import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: 'rgba(10,10,10,0.95)',
                    borderTopColor: colors.separator,
                    borderTopWidth: 1,
                    paddingBottom: 20,
                    paddingTop: 8,
                    height: 85,
                },
                tabBarActiveTintColor: colors.gold,
                tabBarInactiveTintColor: colors.silver,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="today"
                options={{
                    title: 'Today',
                    tabBarIcon: ({ color, size }) => <Ionicons name="sunny" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="vault"
                options={{
                    title: 'Vault',
                    tabBarIcon: ({ color, size }) => <Ionicons name="cube" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="skills"
                options={{
                    title: 'Skills',
                    tabBarIcon: ({ color, size }) => <Ionicons name="flash" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="journal"
                options={{
                    title: 'Journal',
                    tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="domains"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}
