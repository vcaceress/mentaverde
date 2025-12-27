
import React, { useState } from 'react';
import { AuthView } from '../types';

interface Props {
  onSwitchView: (view: AuthView) => void;
}

export const ForgotPasswordForm: React.FC<Props> = ({ onSwitchView }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsSent(true);
      setIsLoading(false);
    }, 1500);
  };

  if (isSent) {
    return (
      <div className="glass rounded-3xl p-8 shadow-xl border border-zinc-200/50 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 mb-6 border border-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-zinc-800">¡Correo Enviado!</h2>
        <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
          Si existe una cuenta para <span className="text-zinc-900 font-semibold">{email}</span>, recibirás instrucciones para restablecer tu contraseña pronto.
        </p>
        <button 
          onClick={() => onSwitchView(AuthView.LOGIN)}
          className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold py-3 rounded-xl transition-all border border-zinc-200"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8 shadow-xl border border-zinc-200/50 animate-fade-in">
      <h2 className="text-xl font-semibold mb-2 text-zinc-800">Restablecer contraseña</h2>
      <p className="text-sm text-zinc-500 mb-6">Ingresa tu correo y te enviaremos las instrucciones.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Correo Electrónico</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
            placeholder="nombre@empresa.com"
          />
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
          ) : 'Enviar Enlace'}
        </button>

        <button 
          type="button"
          onClick={() => onSwitchView(AuthView.LOGIN)}
          className="w-full text-center text-xs text-zinc-400 hover:text-zinc-700 transition-colors uppercase tracking-widest font-bold"
        >
          No importa, ya me acordé
        </button>
      </form>
    </div>
  );
};
