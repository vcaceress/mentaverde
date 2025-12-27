
import React, { useState } from 'react';
import { Service } from '../types';

interface Props {
  services: Service[];
  onAddService: (service: Omit<Service, 'id'>) => void;
  onUpdateService: (service: Service) => void;
  onToggleService: (id: string) => void;
  onBack: () => void;
}

export const ServicesManager: React.FC<Props> = ({ 
  services, 
  onAddService, 
  onUpdateService, 
  onToggleService, 
  onBack 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingService, setIsAddingService] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    descripcion: '',
    activo: true
  });

  const [editingService, setEditingService] = useState<Service | null>(null);

  const filteredServices = services.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || formData.precio <= 0) return;
    onAddService(formData);
    setFormData({ nombre: '', precio: 0, descripcion: '', activo: true });
    setIsAddingService(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService && editingService.nombre.trim()) {
      onUpdateService(editingService);
      setEditingService(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'precio' ? parseFloat(value) || 0 : value 
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingService) {
      const { name, value } = e.target;
      setEditingService({ 
        ...editingService, 
        [name]: name === 'precio' ? parseFloat(value) || 0 : value 
      });
    }
  };

  return (
    <div className="glass rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-zinc-200/50 animate-fade-in w-full max-w-6xl mx-auto min-h-[700px] flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-3 bg-zinc-100 hover:bg-zinc-200 rounded-2xl transition-all border border-zinc-200/50 shadow-sm group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-800 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Catálogo de Servicios</h2>
            <p className="text-zinc-500 text-xs font-medium">Gestiona y edita los precios de tus tratamientos.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Filtrar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsAddingService(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nuevo Servicio
          </button>
        </div>
      </div>

      {/* List / Grid Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-zinc-50 p-8 rounded-full mb-4 border border-zinc-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-800">No hay servicios que mostrar</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-2">Prueba cambiando los términos de búsqueda o añade un nuevo servicio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filteredServices.map(service => (
              <div 
                key={service.id} 
                className={`group relative bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col ${!service.activo ? 'opacity-60 bg-zinc-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${service.activo ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-100 text-zinc-400 border-zinc-200'}`}>
                    {service.activo ? 'Vigente' : 'Inactivo'}
                  </span>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                    <button 
                      onClick={() => setEditingService(service)}
                      className="p-2 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onToggleService(service.id)}
                      className={`p-2 rounded-xl transition-all shadow-sm ${service.activo ? 'bg-zinc-100 text-zinc-400 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                    >
                      {service.activo ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.366zm1.414-1.414L6.525 5.11a6 6 0 018.366 8.367zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-base font-bold text-zinc-900 mb-1 group-hover:text-zinc-800 transition-colors line-clamp-1">{service.nombre}</h4>
                  <p className="text-zinc-400 text-[10px] leading-relaxed line-clamp-2 mb-4 font-medium italic">
                    {service.descripcion || "Servicio profesional sin descripción."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-0.5">Precio de Venta</span>
                    <span className="text-xl font-black text-zinc-900 tracking-tight">
                      <span className="text-sm mr-0.5 text-zinc-400 font-bold">$</span>
                      {service.precio.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button 
                    onClick={() => setEditingService(service)}
                    className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-2xl group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300 border border-zinc-100 group-hover:border-zinc-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals for Add/Edit */}
      {(isAddingService || editingService) && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-white w-full max-w-xl animate-fade-in my-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">{editingService ? 'Editar' : 'Nuevo'} Servicio</h3>
                <p className="text-zinc-500 text-xs font-medium mt-1">Configura los detalles de facturación y descripción.</p>
              </div>
              <button 
                onClick={() => { setIsAddingService(false); setEditingService(null); }} 
                className="p-3 bg-zinc-50 text-zinc-400 hover:text-zinc-900 rounded-2xl transition-all border border-zinc-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={editingService ? handleEditSubmit : handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 px-1">Nombre Comercial</label>
                <input 
                  name="nombre" 
                  value={editingService ? editingService.nombre : formData.nombre} 
                  onChange={editingService ? handleEditChange : handleChange} 
                  required 
                  autoFocus
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-zinc-900 transition-all shadow-sm" 
                  placeholder="Ej. Corte de Cabello Estilo" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 px-1">Precio</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 font-black text-lg">$</span>
                  <input 
                    type="number" 
                    name="precio" 
                    value={editingService ? editingService.precio : (formData.precio || '')} 
                    onChange={editingService ? handleEditChange : handleChange} 
                    required 
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl pl-10 pr-5 py-4 text-base font-black outline-none focus:border-zinc-900 transition-all shadow-sm" 
                    placeholder="0.00" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 px-1">Descripción</label>
                <textarea 
                  name="descripcion" 
                  value={editingService ? editingService.descripcion : formData.descripcion} 
                  onChange={editingService ? handleEditChange : handleChange} 
                  rows={3} 
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-zinc-900 transition-all resize-none shadow-sm" 
                  placeholder="Detalles sobre el servicio..." 
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => { setIsAddingService(false); setEditingService(null); }} 
                  className="flex-1 py-4 rounded-2xl bg-zinc-100 text-zinc-600 font-bold hover:bg-zinc-200 transition-all text-xs uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all shadow-xl text-xs uppercase tracking-widest active:scale-95"
                >
                  {editingService ? 'Guardar Cambios' : 'Registrar Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
