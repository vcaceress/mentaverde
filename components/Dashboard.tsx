
import React from 'react';
import { User, AuthView, AppPermissions, SaleRecord } from '../types';

interface Props {
  user: User;
  onLogout: () => void;
  onSwitchView: (view: AuthView) => void;
  permissions: AppPermissions;
  salesHistory: SaleRecord[];
}

export const Dashboard: React.FC<Props> = ({ user, onLogout, onSwitchView, permissions, salesHistory }) => {
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-5xl mx-auto">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-zinc-200/50 text-center">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-3xl font-black text-zinc-900 mb-1 tracking-tight">Bienvenido, {user.nombre}</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-zinc-400 text-sm font-medium">@{user.username}</span>
            <span className={`text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-widest border ${isAdmin ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
              {user.role}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 text-left">
          {(isAdmin || permissions.showSalesForm) && (
            <button 
                onClick={() => onSwitchView(AuthView.SALES_FORM)}
                className="flex items-center gap-4 bg-zinc-900 p-5 rounded-[1.5rem] text-left hover:bg-zinc-800 transition-all group shadow-xl active:scale-95"
            >
              <div className="bg-white/10 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-white font-black uppercase tracking-widest">Nueva Venta</p>
                <p className="text-[10px] text-zinc-400 font-medium">Caja rápida</p>
              </div>
            </button>
          )}

          <button 
              onClick={() => onSwitchView(AuthView.CALENDAR)}
              className="flex items-center gap-4 bg-white border border-zinc-200 p-5 rounded-[1.5rem] text-left hover:bg-zinc-50 transition-all group shadow-sm active:scale-95"
          >
            <div className="bg-emerald-500 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-zinc-900 font-black uppercase tracking-widest">Calendario</p>
              <p className="text-[10px] text-zinc-400 font-medium">Citas y WhatsApp</p>
            </div>
          </button>

          {(isAdmin || permissions.showSellersManager) && (
            <button 
                onClick={() => onSwitchView(AuthView.SELLERS_MANAGER)}
                className="flex items-center gap-4 bg-white border border-zinc-200 p-5 rounded-[1.5rem] text-left hover:bg-zinc-50 transition-all group shadow-sm active:scale-95"
            >
              <div className="bg-zinc-900 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-zinc-900 font-black uppercase tracking-widest">Vendedores</p>
                <p className="text-[10px] text-zinc-400 font-medium">Personal</p>
              </div>
            </button>
          )}

          {(isAdmin || permissions.showServicesManager) && (
            <button 
                onClick={() => onSwitchView(AuthView.SERVICES_MANAGER)}
                className="flex items-center gap-4 bg-white border border-zinc-200 p-5 rounded-[1.5rem] text-left hover:bg-zinc-50 transition-all group shadow-sm active:scale-95"
            >
              <div className="bg-zinc-900 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-zinc-900 font-black uppercase tracking-widest">Servicios</p>
                <p className="text-[10px] text-zinc-400 font-medium">Tratamientos</p>
              </div>
            </button>
          )}

          {(isAdmin || permissions.showCustomersManager) && (
            <button 
                onClick={() => onSwitchView(AuthView.CUSTOMERS_MANAGER)}
                className="flex items-center gap-4 bg-white border border-zinc-200 p-5 rounded-[1.5rem] text-left hover:bg-zinc-50 transition-all group shadow-sm active:scale-95"
            >
              <div className="bg-zinc-900 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-zinc-900 font-black uppercase tracking-widest">Clientes</p>
                <p className="text-[10px] text-zinc-400 font-medium">Pacientes</p>
              </div>
            </button>
          )}

          {isAdmin && (
            <button 
                onClick={() => onSwitchView(AuthView.USERS_LIST)}
                className="flex items-center gap-4 bg-white border border-zinc-200 p-5 rounded-[1.5rem] text-left hover:bg-zinc-50 transition-all group shadow-sm active:scale-95"
            >
              <div className="bg-zinc-900 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-zinc-900 font-black uppercase tracking-widest">Usuarios</p>
                <p className="text-[10px] text-zinc-400 font-medium">Acceso sistema</p>
              </div>
            </button>
          )}
        </div>

        <button 
          onClick={onLogout}
          className="w-full py-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-all font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] border border-zinc-200 shadow-sm"
        >
          Cerrar Sesión Segura
        </button>
      </div>
    </div>
  );
};
