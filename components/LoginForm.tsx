
import React, { useState } from 'react';
import { AuthView } from '../types';

interface Props {
  onLogin: (username: string, password?: string) => boolean;
  onSwitchView: (view: AuthView) => void;
}

export const LoginForm: React.FC<Props> = ({ onLogin, onSwitchView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = onLogin(username, password);
      if (!success) {
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="glass rounded-3xl p-8 shadow-xl border border-zinc-200/50 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-zinc-800">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl animate-fade-in flex items-center gap-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Usuario o Email</label>
          <input 
            type="text" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
            placeholder="admin o admin@mentaverde.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Contraseña</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
            placeholder="••••••••"
          />
        </div>
        
        <div className="flex items-center justify-between py-2 px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 bg-white text-zinc-800 focus:ring-zinc-800/20 transition-all cursor-pointer" />
            <span className="text-xs text-zinc-500 group-hover:text-zinc-700 transition-colors">Recordarme</span>
          </label>
          <button 
            type="button"
            onClick={() => onSwitchView(AuthView.FORGOT_PASSWORD)}
            className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors font-medium underline underline-offset-2"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button 
          disabled={isLoading}
          className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Entrar'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
        <p className="text-sm text-zinc-500">
          ¿No tienes una cuenta? {' '}
          <button 
            onClick={() => onSwitchView(AuthView.REGISTER)}
            className="text-zinc-800 hover:text-black transition-colors font-bold underline underline-offset-2"
          >
            Crea una aquí
          </button>
        </p>
      </div>
    </div>
  );
};
