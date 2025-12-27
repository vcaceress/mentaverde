
import React, { useState } from 'react';
import { Customer } from '../types';

interface Props {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onToggleCustomer: (id: string) => void;
  onBack: () => void;
}

export const CustomersManager: React.FC<Props> = ({ 
  customers, 
  onAddCustomer, 
  onUpdateCustomer, 
  onToggleCustomer, 
  onBack 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    activo: true
  });

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(c => 
    c.telefono.includes(searchTerm) ||
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    onAddCustomer(formData);
    setFormData({ nombre: '', email: '', telefono: '', direccion: '', fechaNacimiento: '', activo: true });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer && editingCustomer.nombre.trim()) {
      onUpdateCustomer(editingCustomer);
      setEditingCustomer(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingCustomer) {
      setEditingCustomer({ ...editingCustomer, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-zinc-200/50 animate-fade-in w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-800" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-zinc-900">Catálogo de Clientes</h2>
        </div>
        <div className="relative w-full md:w-auto">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Buscar por teléfono o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-zinc-100/50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-zinc-800/10 outline-none w-full md:w-80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Registro lateral */}
        <div className="lg:col-span-4 bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm h-fit">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Nuevo Cliente</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 px-1">Nombre / Razón Social</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-800/10" placeholder="Ej. Nexus Soft S.A." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 px-1">Teléfono</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-800/10" placeholder="5512345678" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 px-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-800/10" placeholder="cliente@mail.com" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 px-1">Fecha de Nacimiento</label>
              <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-800/10" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 px-1">Dirección Física</label>
              <textarea name="direccion" value={formData.direccion} onChange={handleChange} rows={2} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-800/10 resize-none" placeholder="Calle, Número, Colonia..." />
            </div>
            <button type="submit" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]">
              Registrar Cliente
            </button>
          </form>
        </div>

        {/* Tabla principal */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 sticky top-0 z-10">
                  <tr>
                    <th className="py-4 px-4 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Teléfono / Nombre</th>
                    <th className="py-4 px-4 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Contacto / Info</th>
                    <th className="py-4 px-4 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-zinc-400 text-xs italic">No se encontraron clientes</td>
                    </tr>
                  ) : (
                    filteredCustomers.map(customer => (
                      <tr key={customer.id} className={`hover:bg-zinc-50/50 transition-colors ${!customer.activo ? 'opacity-50' : ''}`}>
                        <td className="py-4 px-4">
                          <p className="text-xs font-bold text-zinc-900">{customer.telefono}</p>
                          <p className="text-[10px] text-zinc-500">{customer.nombre}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-[10px] text-zinc-600 font-medium">{customer.email}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {customer.fechaNacimiento && (
                              <div className="flex items-center gap-1 text-[9px] text-zinc-400 bg-zinc-100 px-1.5 rounded-full border border-zinc-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                {customer.fechaNacimiento}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setEditingCustomer(customer)}
                              className="text-[9px] font-bold px-2 py-1 rounded bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => onToggleCustomer(customer.id)}
                              className={`text-[9px] font-bold px-2 py-1 rounded border transition-all ${
                                customer.activo ? 'border-zinc-200 text-zinc-400 hover:text-red-500' : 'bg-green-50 text-green-600 border-green-100'
                              }`}
                            >
                              {customer.activo ? 'Baja' : 'Alta'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edición */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-zinc-200 w-full max-w-lg animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Actualizar Información</h3>
              <button onClick={() => setEditingCustomer(null)} className="text-zinc-400 hover:text-zinc-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Nombre / Razón Social</label>
                <input name="nombre" value={editingCustomer.nombre} onChange={handleEditChange} required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-800/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Teléfono</label>
                  <input name="telefono" value={editingCustomer.telefono} onChange={handleEditChange} required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-800/10" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">F. Nacimiento</label>
                  <input type="date" name="fechaNacimiento" value={editingCustomer.fechaNacimiento} onChange={handleEditChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-800/10" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Email</label>
                <input type="email" name="email" value={editingCustomer.email} onChange={handleEditChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-800/10" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Dirección Completa</label>
                <textarea name="direccion" value={editingCustomer.direccion} onChange={handleEditChange} rows={3} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-800/10 resize-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingCustomer(null)} className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-600 font-bold hover:bg-zinc-200">Cancelar</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 shadow-lg">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
