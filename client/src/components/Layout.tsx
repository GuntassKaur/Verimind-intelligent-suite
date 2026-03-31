import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { LoginModal } from './LoginModal';

export default function Layout() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleLoginOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoginOpen(true);
    };

    // Navbar is used ONLY here globally
    return (
        <div className="min-h-screen flex flex-col bg-[#0B0F19] text-[#E2E8F0]">
            <Navbar onLoginClick={handleLoginOpen} />
            
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            <main className="flex-1 pt-24 pb-12 relative z-10">
                <Outlet context={{ openLoginModal: () => setIsLoginOpen(true) }} />
            </main>

            <footer className="py-12 border-t border-white/5 text-center bg-[#0B0F19] relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">© 2026 VeriMind Neural Suite v1.0</p>
                    <div className="flex justify-center gap-6 mt-4 opacity-40 hover:opacity-100 transition-opacity">
                        <a href="#" className="text-xs font-medium hover:text-indigo-400">Terms</a>
                        <a href="#" className="text-xs font-medium hover:text-indigo-400">Privacy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
