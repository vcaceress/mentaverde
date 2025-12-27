
import React from 'react';
import { AppPermissions } from '../types';

interface Props {
  permissions: AppPermissions;
  onUpdatePermissions: (p: AppPermissions) => void;
  onBack: () => void;
}

export const PermissionsManager: React.FC<Props> = ({ permissions, onUpdatePermissions, onBack }) => {
  const togglePermission = (key: keyof AppPermissions) => {
    onUpdatePermissions({
      ...permissions,
      [key]: !permissions[key]
    });
  };

  const permissionItems = [
    {
      key: 'showSalesForm' as const,
      title: 'Registro de Ventas y Folios',
      description: 'Habilitar captura de ventas con folios secuenciales para usuarios estándar.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      key: 'showServicesManager' as const,
      title: 'Catálogo de Servicios',
      description: 'Permitir que usuarios estándar consulten y administren la lista de servicios.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      key: 'showCustomersManager' as const,
      title: 'Catálogo de Clientes',
      description: 'Permitir que usuarios estándar administren la cartera de clientes.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      key: 'showSellersManager' as const,
      title: 'Catálogo de Vendedores',
      description: 'Permitir que usuarios estándar administren el catálogo de personal de ventas.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      key: 'showDatabaseDesigner' as const,
      title: 'Diseñador de Base de Datos',
      description: 'Permitir a usuarios estándar crear y exportar esquemas MySQL.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      )
    },
    {
      key: 'showAIAssistant' as const,
      title: 'Asistente IA (Menta Verde)',
      description: 'Habilitar el chat de asistencia con Gemini para todos los usuarios.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    }
  ];

  return (
    <div className="glass rounded-3xl p-8 shadow-xl border border-zinc-200/50 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-800" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Configuración de Funciones</h2>
          <p className="text-xs text-zinc-500">Administra qué módulos puede ver el nivel USER.</p>
        </div>
      </div>

      <div className="space-y-4">
        {permissionItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-5 bg-zinc-50 border border-zinc-200 rounded-2xl transition-all hover:border-zinc-300">
            <div className="flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200 text-zinc-800 shadow-sm">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">{item.title}</h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed max-w-sm">{item.description}</p>
              </div>
            </div>
            
            <button 
              onClick={() => togglePermission(item.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-800/20 ${
                permissions[item.key] ? 'bg-zinc-800' : 'bg-zinc-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  permissions[item.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
