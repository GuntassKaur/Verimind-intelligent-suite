import { Route, Switch } from 'wouter';
import { Navbar } from './components/Navbar';
import Landing from './pages/Landing';
import Generate from './pages/Generate';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import About from './pages/About';
import Plagiarism from './pages/Plagiarism';
import Humanize from './pages/Humanizer';
import TypingLab from './pages/TypingLab';
import Login from './pages/Login';
import { GlobalTypingTracker } from './components/GlobalTypingTracker';
import { Logo } from './components/Logo';
import './App.css';

function App() {
  return (
    <div className="app-frame font-sans">
      {/* Premium Background Animation */}
      <div className="bg-animate">
        <div className="bg-dot bg-dot-1" />
        <div className="bg-dot bg-dot-2" />
        <div className="bg-dot bg-dot-3" />
      </div>

      <Navbar />

      <main className="flex-grow relative z-10 w-full">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/generate" component={Generate} />
          <Route path="/analyze" component={Dashboard} />
          <Route path="/plagiarism" component={Plagiarism} />
          <Route path="/humanize" component={Humanize} />
          <Route path="/typing" component={TypingLab} />
          <Route path="/history" component={History} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />

          <Route>
            <div className="h-[80vh] flex flex-col items-center justify-center text-center">
              <h1 className="text-6xl font-black text-white/5 mb-4">404</h1>
              <p className="text-xl text-slate-500 font-medium italic">Page Not Found</p>
            </div>
          </Route>
        </Switch>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-10 text-center bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="mb-4">
            <Logo variant="full" className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-xs text-slate-600 font-medium">Advanced content verification and generation · 2026</p>
        </div>
      </footer>

      <GlobalTypingTracker />
    </div>
  );
}

export default App;

