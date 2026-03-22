import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';

// Lazy load pages for performance
const Landing = lazy(() => import('./pages/Landing'));
const History = lazy(() => import('./pages/History'));
const Login = lazy(() => import('./pages/Login'));
const Workspace = lazy(() => import('./pages/Workspace'));
const Visualizer = lazy(() => import('./pages/Visualizer'));
const Research = lazy(() => import('./pages/Research'));
const Register = lazy(() => import('./pages/Register'));
const Generate = lazy(() => import('./pages/Generate'));
const Plagiarism = lazy(() => import('./pages/Plagiarism'));
const Humanizer = lazy(() => import('./pages/Humanizer'));
const Analyzer = lazy(() => import('./pages/Analyzer'));
const TypingLab = lazy(() => import('./pages/TypingLab'));
import { GlobalTypingTracker } from './components/GlobalTypingTracker';
import { Logo } from './components/Logo';
import { Loader2 } from 'lucide-react';
import api from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Add a safety timeout to avoid hanging on slow network/backend
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 5000);

      try {
        const { data } = await api.get('/api/auth/me');
        clearTimeout(timeout);
        if (data.id) {
          setUser(data);
          localStorage.setItem('user_name', data.name);
        } else {
          setUser(null);
          localStorage.removeItem('user_name');
        }
      } catch (err) {
        clearTimeout(timeout);
        console.error("Auth check failed:", err);
        setUser(null);
        localStorage.removeItem('user_name');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#05070a] relative overflow-hidden">
        {/* Glow effects for loading screen */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(79,70,229,0.3)] animate-bounce">
              <Logo variant="icon" className="w-10 h-10 text-white" />
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 text-white font-black uppercase tracking-[0.4em] text-xs">
                <Loader2 className="animate-spin text-indigo-400" size={18} />
                Establishing Secure Session
              </div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 animate-pulse">Initializing Truth Protocols v5.0</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
        <Suspense fallback={
            <div className="fixed inset-0 bg-[#05070a] flex flex-col items-center justify-center z-[100]">
                <div className="relative mb-8">
                    <div className="absolute inset-0 blur-3xl bg-indigo-500/20 animate-pulse rounded-full" />
                    <Logo variant="icon" className="h-12 w-12 text-indigo-500 relative animate-bounce" />
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
                    <Loader2 className="animate-spin text-indigo-400" size={16} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading Neural Workspace...</span>
                </div>
            </div>
        }>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Workspace />} />
                    <Route path="generator" element={<Generate />} />
                    <Route path="analyzer" element={<Analyzer />} />
                    <Route path="plagiarism" element={<Plagiarism />} />
                    <Route path="humanizer" element={<Humanizer />} />
                    <Route path="visualizer" element={<Visualizer />} />
                    <Route path="flowchart" element={<Visualizer />} />
                    <Route path="research" element={<Research />} />
                    <Route path="typing" element={<TypingLab />} />
                    <Route path="history" element={user ? <History /> : <Navigate to="/login" replace />} />
                </Route>
                <Route path="/overview" element={<Landing />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
        <GlobalTypingTracker />
    </div>
  );
}

export default App;
