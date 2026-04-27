import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LoginModal } from './LoginModal';

export default function Layout() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const location = useLocation();

    // Check if we are on landing to hide sidebar
    const isLanding = location.pathname === '/';

    return (
        <div className="min-h-screen bg-[#0b0f1a] text-[#f8fafc] flex flex-col font-main selection:bg-purple-500/30">
            {/* Ambient Animated Mesh Background */}
            <div className="bg-mesh-container fixed inset-0">
                <div className="bg-mesh" />
            </div>

            {/* Glowing Effects */}
            <div className="glowing-orb glow-purple w-[800px] h-[800px] -top-96 -left-96 opacity-40" />
            <div className="glowing-orb glow-blue w-[600px] h-[600px] bottom-0 right-0 opacity-20" />

            <Navbar onLoginClick={() => setIsLoginOpen(true)} />
            
            {!isLanding && <Sidebar />}

            <main className={`flex-1 transition-all duration-500 relative z-10 
                ${!isLanding ? 'lg:pl-64' : ''} 
                pt-24 pb-12
            `}>
                <div className={`mx-auto ${!isLanding ? 'max-w-6xl px-6' : 'w-full'}`}>
                    <Outlet context={{ openLoginModal: () => setIsLoginOpen(true) }} />
                </div>
            </main>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            {isLanding && (
                <footer className="py-20 border-t border-white/5 text-center bg-[#0b0f1a] relative z-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">© 2026 VerifyAI Neural Suite • Research Phase 4</p>
                        <div className="flex justify-center gap-10 mt-10">
                            <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">Matrix Protocols</a>
                            <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">Neural Privacy</a>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
