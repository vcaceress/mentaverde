
import React, { useState } from 'react';
import { AuthView, User } from '../types';

interface Props {
  onSwitchView: (view: AuthView) => void;
  // Permitimos incluir password en el registro
  onRegister: (userData: Omit<User, 'id' | 'isLoggedIn' | 'username' | 'role'> & { password?: string }) => void;
}

export const RegisterForm: React.FC<Props> = ({ onSwitchView, onRegister }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    nombreCorto: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    celular: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onRegister(formData);
      onSwitchView(AuthView.LOGIN);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="glass rounded-3xl p-8 shadow-xl border border-zinc-200/50 animate-fade-in max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-zinc-800">Crear cuenta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Nombre(s)</label>
            <input 
              type="text" 
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Nombre Corto / Alias</label>
            <input 
              type="text" 
              name="nombreCorto"
              required
              value={formData.nombreCorto}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
              placeholder="Ej. Juan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Apellido Paterno</label>
            <input 
              type="text" 
              name="apellidoPaterno"
              required
              value={formData.apellidoPaterno}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
              placeholder="Primer apellido"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Apellido Materno</label>
            <input 
              type="text" 
              name="apellidoMaterno"
              required
              value={formData.apellidoMaterno}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
              placeholder="Segundo apellido"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Fecha de Nacimiento</label>
            <input 
              type="date" 
              name="fechaNacimiento"
              required
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Celular</label>
            <input 
              type="tel" 
              name="celular"
              required
              value={formData.celular}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
              placeholder="55 1234 5678"
            />
          </div>
        </div>

        <div className="pt-2 space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Correo Electrónico</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1 px-1">Contraseña</label>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 transition-all"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
        </div>
        
        <p className="text-[10px] text-zinc-400 px-1 pt-2 leading-relaxed">
          Al crear una cuenta, aceptas nuestros <span className="text-zinc-800 underline cursor-pointer font-bold">Términos de Servicio</span> y <span className="text-zinc-800 underline cursor-pointer font-bold">Política de Privacidad</span>.
        </p>

        <button 
          disabled={isLoading}
          className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Registrarse'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
        <p className="text-sm text-zinc-500">
          ¿Ya tienes una cuenta? {' '}
          <button 
            onClick={() => onSwitchView(AuthView.LOGIN)}
            className="text-zinc-800 hover:text-black transition-colors font-bold underline underline-offset-2"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};
