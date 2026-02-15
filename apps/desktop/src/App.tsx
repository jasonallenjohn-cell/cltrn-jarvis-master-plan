
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthProvider';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VoiceMode from './pages/VoiceMode';
import ChatMode from './pages/ChatMode';
import Marketplace from './pages/Marketplace';
import Library from './pages/Library';
import Ecosystem from './pages/Ecosystem';
import Revenue from './pages/Revenue';
import Login from './pages/Login';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="voice" element={<VoiceMode />} />
                <Route path="chat" element={<ChatMode />} />
                <Route path="skills" element={<Marketplace />} />
                <Route path="library" element={<Library />} />
                <Route path="ecosystem" element={<Ecosystem />} />
                <Route path="revenue" element={<Revenue />} />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
