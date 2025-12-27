
import React, { useState } from 'react';
import { Seller } from '../types';

interface Props {
  sellers: Seller[];
  onAddSeller: (nombre: string, nombreCorto: string, usuario: string, password?: string) => void;
  onUpdateSeller: (seller: Seller) => void;
  onToggleSeller: (id: string) => void;
  onBack: () => void;
}

export const SellersManager: React.FC<Props> = ({ 
  sellers, 
  onAddSeller, 
  onUpdateSeller, 
  onToggleSeller, 
  onBack 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    nombreCorto: '',
    usuario: '',
    password: ''
  });

  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.nombreCorto.trim() || !formData.usuario.trim()) return;
    onAddSeller(formData.nombre.trim(), formData.nombreCorto.trim(), formData.usuario.trim(), formData.password.trim() || undefined);
    setFormData({ nombre: '', nombreCorto: '', usuario: '', password: '' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSeller && editingSeller.nombre.trim() && editingSeller.nombreCorto.trim() && editingSeller.usuario.trim()) {
      onUpdateSeller(editingSeller);
      setEditingSeller(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingSeller) {
      setEditingSeller({ ...editingSeller, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-zinc-200/50 animate-fade-in w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-800" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-zinc-900">Gestión de Vendedores</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Formulario de Registro */}
        <div className="md:col-span-4">
          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Registrar Nuevo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 px-1">Nombre Completo</label>
                <input 
                  type="text" 
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800/10 transition-all"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 px-1">Nombre Corto / Alias</label>
                <input 
                  type="text" 
                  name="nombreCorto"
                  required
                  value={formData.nombreCorto}
                  onChange={handleChange}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800/10 transition-all"
                  placeholder="Juan"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 px-1">Nombre de Usuario</label>
                <input 
                  type="text" 
                  name="usuario"
                  required
                  value={formData.usuario}
                  onChange={handleChange}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800/10 transition-all"
                  placeholder="juan_ventas"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 px-1">Contraseña</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Agregar Vendedor
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Vendedores */}
        <div className="md:col-span-8">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 px-1">Personal Registrado</p>
          <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="py-3 px-6 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Nombre / Alias</th>
                  <th className="py-3 px-6 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Estado</th>
                  <th className="py-3 px-6 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {sellers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-zinc-400 text-xs italic">No hay vendedores registrados</td>
                  </tr>
                ) : (
                  sellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="text-sm font-semibold text-zinc-800">{seller.nombre}</p>
                        <p className="text-[10px] text-zinc-400 italic">Alias: {seller.nombreCorto} | @{seller.usuario}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${seller.activo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {seller.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setEditingSeller(seller)}
                            className="text-[10px] font-bold px-3 py-1 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => onToggleSeller(seller.id)}
                            className={`text-[10px] font-bold px-3 py-1 rounded-lg border transition-all ${
                              seller.activo 
                              ? 'bg-transparent text-zinc-400 border-zinc-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100' 
                              : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                            }`}
                          >
                            {seller.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[9px] text-zinc-400 mt-4 px-1 italic">Solo los vendedores en estado "Activo" aparecerán en el formulario de ventas.</p>
        </div>
      </div>

      {/* Modal de Edición */}
      {editingSeller && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-zinc-200 w-full max-w-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Editar Vendedor</h3>
              <button onClick={() => setEditingSeller(null)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1 px-1">Nombre Completo</label>
                <input 
                  name="nombre" 
                  value={editingSeller.nombre} 
                  onChange={handleEditChange} 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none text-zinc-900"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1 px-1">Nombre Corto / Alias</label>
                <input 
                  name="nombreCorto" 
                  value={editingSeller.nombreCorto} 
                  onChange={handleEditChange} 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none text-zinc-900"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1 px-1">Usuario</label>
                <input 
                  name="usuario" 
                  value={editingSeller.usuario} 
                  onChange={handleEditChange} 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none text-zinc-900"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1 px-1">Contraseña</label>
                <input 
                  type="password"
                  name="password" 
                  value={editingSeller.password || ''} 
                  onChange={handleEditChange} 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none text-zinc-900"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingSeller(null)} 
                  className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-600 font-bold hover:bg-zinc-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors shadow-lg shadow-zinc-200"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
