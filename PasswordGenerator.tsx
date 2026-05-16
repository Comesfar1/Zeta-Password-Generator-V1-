import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Shield, RefreshCw, Lock, Minus, Plus } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ text: 'ZAYIF', color: 'text-red-500', bg: 'bg-red-500/20' });

  const generatePassword = useCallback(() => {
    let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    let numberChars = '0123456789';
    let symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let allowedChars = '';
    let mandatoryChars: string[] = [];

    if (includeUppercase) {
      allowedChars += uppercaseChars;
      mandatoryChars.push(uppercaseChars[getRandomInt(uppercaseChars.length)]);
    }
    if (includeLowercase) {
      allowedChars += lowercaseChars;
      mandatoryChars.push(lowercaseChars[getRandomInt(lowercaseChars.length)]);
    }
    if (includeNumbers) {
      allowedChars += numberChars;
      mandatoryChars.push(numberChars[getRandomInt(numberChars.length)]);
    }
    if (includeSymbols) {
      allowedChars += symbolChars;
      mandatoryChars.push(symbolChars[getRandomInt(symbolChars.length)]);
    }

    if (allowedChars.length === 0) {
      setPassword('Seçim Yapınız!');
      return;
    }

    let generated: string[] = [...mandatoryChars];
    const remainingLength = length - mandatoryChars.length;

    const randomValues = new Uint32Array(remainingLength);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = randomValues[i] % allowedChars.length;
      generated.push(allowedChars[randomIndex]);
    }

    const shuffleValues = new Uint32Array(generated.length);
    window.crypto.getRandomValues(shuffleValues);
    for (let i = generated.length - 1; i > 0; i--) {
      const j = shuffleValues[i] % (i + 1);
      [generated[i], generated[j]] = [generated[j], generated[i]];
    }

    setPassword(generated.join(''));
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const getRandomInt = (max: number) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  };

  useEffect(() => {
    if (!password || password === 'Seçim Yapınız!') {
      setStrength({ text: 'GEÇERSİZ', color: 'text-zinc-500', bg: 'bg-zinc-500/20' });
      return;
    }
    
    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 20) score++;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSym = /[^A-Za-z0-9]/.test(password);
    
    const countTypes = [hasUpper, hasLower, hasNum, hasSym].filter(Boolean).length;
    score += countTypes;

    if (score <= 3) {
      setStrength({ text: 'ZAYIF', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30' });
    } else if (score === 4 || score === 5) {
      setStrength({ text: 'ORTA', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' });
    } else if (score === 6) {
      setStrength({ text: 'GÜÇLÜ', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/30' });
    } else {
      setStrength({ text: 'ZETA SHIELD', color: 'text-purple-400 font-bold tracking-wider animate-pulse', bg: 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]' });
    }
  }, [password]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = () => {
    if (password && password !== 'Seçim Yapınız!') {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const decreaseLength = () => setLength(prev => Math.max(8, prev - 1));
  const increaseLength = () => setLength(prev => Math.min(64, prev + 1));

  return (
    <div className="w-full max-w-md mx-auto bg-[#09090b] text-zinc-100 border border-purple-900/40 rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.1)] overflow-hidden font-sans">
      
      <div className="bg-[#0f0f13] px-6 py-4 border-b border-purple-950/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          <span className="font-semibold text-sm tracking-widest text-zinc-200 uppercase">Zeta Password Generator</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
          <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase">Lokal Mod</span>
        </div>
      </div>

      <div className="p-6 space-y-7">
        
        <div className="relative group">
          <div className="w-full bg-[#050507] border border-purple-950 px-4 py-3.5 pr-24 rounded-lg font-mono text-base text-purple-300 break-all select-all tracking-wide shadow-inner min-h-[54px] flex items-center">
            {password}
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button 
              onClick={generatePassword}
              className="p-2 hover:bg-purple-950/30 text-purple-400 rounded-md transition-all duration-200 active:scale-95"
              title="Yeniden Üret"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={copyToClipboard}
              className={`p-2 rounded-md transition-all duration-200 active:scale-95 flex items-center justify-center ${copied ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30' : 'hover:bg-purple-950/30 text-purple-400'}`}
              title="Kopyala"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm tracking-wider text-zinc-300 items-center">
            <span>Parola uzunluğu: <span className="font-mono text-purple-400 font-bold ml-1">{length}</span></span>
            
            <div className={`px-3 py-1 rounded-md border flex items-center gap-1.5 transition-all duration-300 ${strength.bg}`}>
               <Shield className={`w-3.5 h-3.5 ${strength.color}`} />
               <span className={`text-[10px] font-mono tracking-wider ${strength.color}`}>{strength.text}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={decreaseLength}
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border border-purple-900/50 hover:bg-purple-900/20 text-zinc-400 hover:text-purple-400 transition-all active:scale-90"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <input 
              type="range" 
              min="8" 
              max="64" 
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-purple-600 h-1.5 bg-zinc-900 rounded-lg cursor-pointer transition-all"
            />

            <button 
              onClick={increaseLength}
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border border-purple-900/50 hover:bg-purple-900/20 text-zinc-400 hover:text-purple-400 transition-all active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
          <span className="text-sm tracking-wider text-zinc-300 whitespace-nowrap">Kullanılan karakterler:</span>
          
          <div className="flex flex-wrap items-center gap-4">
            {[
              { id: 'upper', label: 'ABC', value: includeUppercase, setter: setIncludeUppercase },
              { id: 'lower', label: 'abc', value: includeLowercase, setter: setIncludeLowercase },
              { id: 'numbers', label: '123', value: includeNumbers, setter: setIncludeNumbers },
              { id: 'symbols', label: '#$&', value: includeSymbols, setter: setIncludeSymbols }
            ].map((item) => (
              <label 
                key={item.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={item.value} 
                    onChange={(e) => item.setter(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border border-purple-900 rounded bg-[#0c0c10] checked:bg-purple-600 checked:border-purple-500 transition-all cursor-pointer"
                  />
                  <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <span className={`text-sm font-medium tracking-wide transition-colors ${item.value ? 'text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
