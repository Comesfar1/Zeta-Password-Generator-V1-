import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { Lock, ShieldAlert, Fingerprint, ChevronRight } from 'lucide-react';
import PasswordGenerator from "./components/PasswordGenerator";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Rust tarafındaki Windows Hello fonksiyonunu çağırıyoruz
      const authSuccess = await invoke<boolean>('authenticate_hello');
      
      if (authSuccess) {
        setIsAuthenticated(true);
      } else {
        setError('Kimlik doğrulama başarısız veya iptal edildi.');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 selection:bg-purple-500/30">
      {/* Arka plandaki genel siber aydınlatma */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {!isAuthenticated ? (
          /* ZETA GİRİŞ EKRANI (Ayrı dosya yerine buraya entegre edildi) */
          <div className="w-full bg-[#09090b] text-zinc-100 border border-purple-900/40 rounded-xl shadow-[0_0_40px_rgba(147,51,234,0.15)] overflow-hidden font-sans min-h-[400px] flex flex-col relative animate-in fade-in zoom-in-95 duration-500">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
              <div className="relative mb-8 group cursor-pointer" onClick={handleLogin}>
                <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="w-24 h-24 bg-[#0c0c10] border border-purple-500/30 rounded-2xl flex items-center justify-center relative shadow-inner rotate-3 group-hover:rotate-0 transition-all duration-300">
                  <Lock className="w-10 h-10 text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                </div>
              </div>

              <h1 className="text-xl font-bold tracking-widest text-zinc-100 mb-2 uppercase text-center">
                Zeta Password <br/><span className="text-purple-500">Generator</span>
              </h1>
              <p className="text-xs font-mono text-zinc-500 tracking-wider mb-8 text-center">
                SİSTEM KİLİDİNİ AÇIN.
              </p>

              {error && (
                <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-xs flex items-center gap-2 mb-6 font-mono">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full relative group overflow-hidden bg-[#0c0c10] border border-purple-600/40 hover:border-purple-500 text-purple-300 font-medium py-3.5 px-4 rounded-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                <div className="flex items-center justify-center gap-3 relative z-10">
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Fingerprint className="w-5 h-5" />
                  )}
                  <span className="text-sm tracking-widest uppercase">
                    {isLoading ? 'DOĞRULANIYOR...' : 'WİNDOWS HELLO'}
                  </span>
                  {!isLoading && <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                </div>
              </button>
            </div>
            <div className="py-3 text-center border-t border-purple-950/50 bg-[#050507] z-10">
              <span className="text-[10px] text-purple-900/80 font-mono tracking-widest">© 2026 ZETALABS</span>
            </div>
          </div>
        ) : (
          /* DOĞRULAMA BAŞARILIYSA ŞİFRE ÜRETİCİ EKRANINI GÖSTER */
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <PasswordGenerator />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
