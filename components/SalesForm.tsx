
import React, { useState, useEffect } from 'react';
import { User, SaleRecord, Seller, PagoDetalle, Customer, Service, ServiceLineItem } from '../types';

interface Props {
  currentUser: User;
  nextFolio: number;
  onSetFolio: (f: number) => void;
  onAddSale: (sale: Omit<SaleRecord, 'id'>) => void;
  onUpdateSale: (sale: SaleRecord) => void;
  onAddSeller: (nombre: string, nombreCorto: string, usuario: string, password?: string) => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  salesHistory: SaleRecord[];
  sellers: Seller[];
  customers: Customer[];
  services: Service[];
  onBack: () => void;
}

export const SalesForm: React.FC<Props> = ({ 
  currentUser, 
  nextFolio, 
  onSetFolio, 
  onAddSale, 
  onUpdateSale,
  onAddSeller,
  onAddCustomer,
  salesHistory,
  sellers,
  customers,
  services,
  onBack 
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [activeTab, setActiveTab] = useState<'NEW' | 'HISTORY'>('NEW');
  
  // States for new sale
  const [folioInput, setFolioInput] = useState(nextFolio);
  const [pagos, setPagos] = useState<PagoDetalle>({ efectivo: 0, transferencia: 0, tarjeta: 0 });
  const [formData, setFormData] = useState({ fecha: today, importeTerminal: '', vendedor: sellers.length > 0 ? sellers[0].nombre : '' });
  const [selectedServices, setSelectedServices] = useState<ServiceLineItem[]>([]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showResults, setShowResults] = useState(false);

  // States for Quick Add Customer
  const [showQuickCustomer, setShowQuickCustomer] = useState(false);
  const [quickCustomerData, setQuickCustomerData] = useState({ nombre: '', telefono: '', email: '' });

  // States for filters
  const [filterStartDate, setFilterStartDate] = useState(today);
  const [filterEndDate, setFilterEndDate] = useState(today);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setFolioInput(nextFolio);
  }, [nextFolio]);

  const subtotalServicios = selectedServices.reduce((acc, item) => acc + item.subtotal, 0);
  const totalPagado = (Object.values(pagos) as number[]).reduce((acc: number, val: number) => acc + val, 0);

  const filteredCustomers = customers.filter(c => 
    c.telefono.includes(customerSearch) || 
    c.nombre.toLowerCase().includes(customerSearch.toLowerCase())
  ).slice(0, 5);

  const filteredServices = services.filter(s => 
    s.nombre.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  // Filtering Logic for History
  const filteredSalesHistory = salesHistory.filter(sale => {
    const saleDate = sale.fecha;
    const matchesDate = (!filterStartDate || saleDate >= filterStartDate) && (!filterEndDate || saleDate <= filterEndDate);
    const matchesQuery = !filterQuery || 
      (sale.cliente?.toLowerCase().includes(filterQuery.toLowerCase())) ||
      (sale.vendedor.toLowerCase().includes(filterQuery.toLowerCase())) ||
      (sale.folio.toString().includes(filterQuery));
    return matchesDate && matchesQuery;
  });

  const totalHistoryAmount = filteredSalesHistory.reduce((acc, sale) => acc + sale.importeBruto, 0);

  const handlePagoChange = (metodo: keyof PagoDetalle, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPagos(prev => ({ ...prev, [metodo]: numValue }));
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch('');
    setShowResults(false);
  };

  const handleQuickCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCustomerData.nombre.trim() || !quickCustomerData.telefono.trim()) return;

    const newCustomer = onAddCustomer({
      nombre: quickCustomerData.nombre,
      telefono: quickCustomerData.telefono,
      email: quickCustomerData.email,
      direccion: '',
      fechaNacimiento: '',
      activo: true
    });

    setSelectedCustomer(newCustomer);
    setQuickCustomerData({ nombre: '', telefono: '', email: '' });
    setShowQuickCustomer(false);
  };

  const addServiceToSale = (service: Service) => {
    const existing = selectedServices.find(s => s.serviceId === service.id);
    if (existing) {
      setSelectedServices(selectedServices.map(s => 
        s.serviceId === service.id 
          ? { ...s, cantidad: s.cantidad + 1, subtotal: (s.cantidad + 1) * s.precioUnitario } 
          : s
      ));
    } else {
      setSelectedServices([...selectedServices, {
        serviceId: service.id,
        nombre: service.nombre,
        cantidad: 1,
        precioUnitario: service.precio,
        subtotal: service.precio
      }]);
    }
  };

  const updateServiceQuantity = (serviceId: string, qty: number) => {
    if (qty <= 0) {
      setSelectedServices(selectedServices.filter(s => s.serviceId !== serviceId));
    } else {
      setSelectedServices(selectedServices.map(s => 
        s.serviceId === serviceId 
          ? { ...s, cantidad: qty, subtotal: qty * s.precioUnitario } 
          : s
      ));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const terminal = parseFloat(formData.importeTerminal || '0');

    if (totalPagado <= 0 || !formData.vendedor) {
      alert("Error: Monto inválido o vendedor no seleccionado.");
      return;
    }

    const sellerObj = sellers.find(s => s.nombre === formData.vendedor);
    const sellerShort = sellerObj ? sellerObj.nombreCorto : formData.vendedor.split(' ')[0];

    const metodosActivos = (Object.entries(pagos) as [keyof PagoDetalle, number][]).filter(([_, val]) => val > 0);
    let etiquetaMetodo = metodosActivos.length > 1 ? "MIXTO" : (metodosActivos[0]?.[0].toUpperCase() || "OTRO");

    onAddSale({
      folio: folioInput,
      fecha: formData.fecha,
      vendedor: formData.vendedor,
      vendedorShort: sellerShort || formData.vendedor.split(' ')[0],
      cliente: selectedCustomer ? selectedCustomer.nombre : undefined,
      importeBruto: totalPagado,
      importeTerminal: terminal,
      detallesPago: { ...pagos },
      metodoPago: etiquetaMetodo,
      servicios: [...selectedServices]
    });

    setPagos({ efectivo: 0, transferencia: 0, tarjeta: 0 });
    setFormData({ ...formData, importeTerminal: '' });
    setSelectedCustomer(null);
    setSelectedServices([]);
    setServiceSearch('');
    alert("Venta registrada con éxito.");
  };

  return (
    <div className="glass rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-zinc-200/50 animate-fade-in w-full max-w-6xl mx-auto flex flex-col min-h-[750px]">
      {/* Header with Switch */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-3 bg-zinc-100 hover:bg-zinc-200 rounded-2xl transition-all border border-zinc-200 shadow-sm group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-800 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Registro de Ventas</h2>
            <p className="text-zinc-500 text-xs font-medium">Gestiona cobros y consulta el historial del día.</p>
          </div>
        </div>

        <div className="bg-zinc-100 p-1.5 rounded-[1.5rem] flex gap-1 shadow-inner border border-zinc-200">
          <button 
            onClick={() => setActiveTab('NEW')}
            className={`px-6 py-2.5 rounded-[1.25rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'NEW' ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Nueva Venta
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`px-6 py-2.5 rounded-[1.25rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'HISTORY' ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Historial
          </button>
        </div>
      </div>

      {activeTab === 'NEW' ? (
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Area (Left) */}
            <div className="lg:col-span-8 space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cliente selector */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Cliente / Paciente</label>
                  {selectedCustomer ? (
                    <div className="bg-zinc-900 text-white p-4 rounded-3xl border border-zinc-900 flex justify-between items-center shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs uppercase">{selectedCustomer.nombre[0]}</div>
                        <span className="text-sm font-bold truncate max-w-[150px]">{selectedCustomer.nombre}</span>
                      </div>
                      <button type="button" onClick={() => setSelectedCustomer(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          value={customerSearch}
                          onChange={(e) => {setCustomerSearch(e.target.value); setShowResults(true);}}
                          className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-zinc-900 transition-all shadow-sm"
                          placeholder="Buscar por nombre o celular..."
                        />
                        {showResults && customerSearch.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-[1.5rem] shadow-2xl z-[50] overflow-hidden">
                            {filteredCustomers.length === 0 ? (
                              <div className="p-6 text-center text-zinc-400 text-xs italic">Sin resultados</div>
                            ) : (
                              filteredCustomers.map(c => (
                                <button key={c.id} type="button" onClick={() => handleSelectCustomer(c)} className="w-full text-left p-4 hover:bg-zinc-50 border-b border-zinc-50 last:border-0 flex items-center gap-3 transition-colors">
                                  <div className="w-7 h-7 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-[10px] text-zinc-400">{c.nombre[0]}</div>
                                  <div>
                                    <p className="text-xs font-bold text-zinc-900">{c.nombre}</p>
                                    <p className="text-[10px] text-zinc-400">{c.telefono}</p>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setShowQuickCustomer(true)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white p-4 rounded-2xl shadow-lg transition-all active:scale-95"
                        title="Nuevo Cliente Rápido"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Fecha y Folio */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Folio</label>
                    <input type="number" value={folioInput} onChange={(e) => setFolioInput(parseInt(e.target.value) || 0)} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-5 py-3.5 text-sm font-black outline-none focus:border-zinc-900 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Fecha</label>
                    <input type="date" value={formData.fecha} onChange={(e) => setFormData({...formData, fecha: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-zinc-900 transition-all" />
                  </div>
                </div>
              </div>

              {/* Vendedor */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Atendido por</label>
                <div className="flex flex-wrap gap-2">
                  {sellers.map(s => (
                    <button 
                      key={s.id} 
                      type="button" 
                      onClick={() => setFormData({...formData, vendedor: s.nombre})}
                      className={`text-[10px] font-black px-4 py-2 rounded-xl border-2 transition-all ${formData.vendedor === s.nombre ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg scale-105' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                    >
                      {s.nombreCorto || s.nombre.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Añadir Servicios Area */}
              <div className="bg-zinc-50 rounded-[2.5rem] p-8 border border-zinc-200">
                <div className="flex items-center justify-between mb-6 px-1">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Búsqueda de Servicios</h3>
                  <div className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">{services.filter(s => s.activo).length} Tratamientos disponibles</div>
                </div>
                <div className="relative mb-8 max-w-lg">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    value={serviceSearch} 
                    onChange={(e) => setServiceSearch(e.target.value)} 
                    placeholder="Escribe para filtrar el catálogo..." 
                    className="w-full bg-white border-2 border-zinc-100 rounded-2xl pl-11 pr-5 py-4 text-sm font-bold outline-none focus:border-zinc-900 transition-all shadow-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
                  {filteredServices.length === 0 ? (
                    <div className="col-span-full py-16 text-center bg-white/40 rounded-3xl border border-dashed border-zinc-200">
                      <p className="text-[10px] text-zinc-400 italic font-medium uppercase tracking-widest">No hay resultados para "{serviceSearch}"</p>
                    </div>
                  ) : (
                    filteredServices.map(s => (
                      <button 
                        key={s.id} 
                        type="button"
                        onClick={() => addServiceToSale(s)}
                        className="text-left p-4 rounded-2xl border border-zinc-100 bg-white hover:border-zinc-900 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-between group shadow-sm"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-xs font-black text-zinc-900 truncate">{s.nombre}</p>
                          <p className="text-[10px] text-zinc-400 font-bold mt-1">${s.precio.toLocaleString()}</p>
                        </div>
                        <div className="bg-zinc-50 p-2.5 rounded-xl text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Area (Right) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Desglose de Cobro */}
              <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-200 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Desglose</h3>
                  <div className="bg-white px-3 py-1 rounded-full border border-zinc-200 text-[9px] font-black text-zinc-400 uppercase">Cobro</div>
                </div>
                
                <div className="flex flex-col gap-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">Efectivo</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 font-bold">$</span>
                      <input type="number" value={pagos.efectivo || ''} onChange={(e) => handlePagoChange('efectivo', e.target.value)} className="w-full bg-white border-2 border-zinc-100 rounded-2xl pl-8 pr-4 py-4 text-base font-black outline-none focus:border-emerald-500 transition-all shadow-sm" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Transferencia</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 font-bold">$</span>
                      <input type="number" value={pagos.transferencia || ''} onChange={(e) => handlePagoChange('transferencia', e.target.value)} className="w-full bg-white border-2 border-zinc-100 rounded-2xl pl-8 pr-4 py-4 text-base font-black outline-none focus:border-blue-500 transition-all shadow-sm" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">Tarjeta / Terminal</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 font-bold">$</span>
                      <input type="number" value={pagos.tarjeta || ''} onChange={(e) => handlePagoChange('tarjeta', e.target.value)} className="w-full bg-white border-2 border-zinc-100 rounded-2xl pl-8 pr-4 py-4 text-base font-black outline-none focus:border-indigo-500 transition-all shadow-sm" placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-200/50 space-y-4">
                  <div className="flex flex-col text-center">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Confirmado</span>
                    <span className="text-4xl font-black text-zinc-900 tracking-tighter">
                      <span className="text-xl mr-1 text-zinc-300">$</span>
                      {totalPagado.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest"
                  >
                    Finalizar Venta
                  </button>
                </div>
              </div>

              {/* Detalle de la Orden (Cart) */}
              {selectedServices.length > 0 ? (
                <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-2xl animate-fade-in ring-1 ring-white/10">
                  <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Carrito de Orden</h3>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] font-black">{selectedServices.length} items</span>
                  </div>
                  <div className="space-y-4 mb-8 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {selectedServices.map(item => (
                      <div key={item.serviceId} className="flex items-center justify-between text-xs py-3 border-b border-white/5 last:border-0 group">
                        <div className="flex-1 truncate pr-2">
                          <p className="font-bold truncate group-hover:text-zinc-200 transition-colors">{item.nombre}</p>
                          <p className="text-[9px] text-zinc-400 font-medium">{item.cantidad} x ${item.precioUnitario}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                            <button type="button" onClick={() => updateServiceQuantity(item.serviceId, item.cantidad - 1)} className="p-1.5 hover:bg-white/10 rounded-lg hover:text-rose-400 transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
                            <button type="button" onClick={() => updateServiceQuantity(item.serviceId, item.cantidad + 1)} className="p-1.5 hover:bg-white/10 rounded-lg hover:text-emerald-400 transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg></button>
                          </div>
                          <p className="font-black text-right min-w-[70px] text-zinc-100">${item.subtotal.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-5 border-t border-white/10">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Importe Servicios</span>
                    <span className="text-3xl font-black tracking-tighter text-white">${subtotalServicios.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-100/50 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-zinc-200">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-200 shadow-sm text-zinc-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-relaxed">Selecciona tratamientos para generar la orden</p>
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        /* History View */
        <div className="flex-1 flex flex-col space-y-8 animate-fade-in">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-zinc-50 p-6 rounded-[2rem] border border-zinc-200">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Desde</label>
              <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-zinc-900 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Hasta</label>
              <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-zinc-900 transition-all" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Buscar por Cliente o Vendedor</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
                <input 
                  type="text" 
                  value={filterQuery} 
                  onChange={(e) => setFilterQuery(e.target.value)} 
                  placeholder="Escribe nombre o folio..." 
                  className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none focus:border-zinc-900 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-zinc-50 p-6 rounded-[2rem] shadow-sm">
              <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">Total Ventas</p>
              <p className="text-2xl font-black text-zinc-900">{filteredSalesHistory.length}</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-[2rem] shadow-xl md:col-span-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Monto Total en Periodo</p>
              <p className="text-3xl font-black text-white tracking-tighter">${totalHistoryAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-zinc-100 rounded-[2.5rem] shadow-xl overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="py-5 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Folio / Fecha</th>
                    <th className="py-5 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Participantes</th>
                    <th className="py-5 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Metodo</th>
                    <th className="py-5 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredSalesHistory.length === 0 ? (
                    <tr><td colSpan={4} className="py-20 text-center text-zinc-300 italic font-medium">No se encontraron registros para los filtros seleccionados.</td></tr>
                  ) : (
                    filteredSalesHistory.map(sale => (
                      <tr key={sale.id} className="hover:bg-zinc-50 transition-all group">
                        <td className="py-5 px-8">
                          <p className="text-sm font-black text-zinc-900">#{sale.folio}</p>
                          <p className="text-[10px] text-zinc-400 font-bold">{sale.fecha}</p>
                        </td>
                        <td className="py-5 px-8">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-zinc-800">{sale.cliente || 'Publico General'}</span>
                            <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                              {sale.vendedorShort}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-center">
                          <span className="inline-block text-[9px] font-black px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200 uppercase tracking-tighter">
                            {sale.metodoPago}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-right font-black text-zinc-900 text-base">
                          ${sale.importeBruto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Customer Modal */}
      {showQuickCustomer && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-white w-full max-w-lg animate-fade-in">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">Registro Express</h3>
                <p className="text-zinc-500 mt-2 font-medium">Añade un cliente nuevo sin salir de la caja.</p>
              </div>
              <button 
                onClick={() => setShowQuickCustomer(false)} 
                className="p-4 bg-zinc-50 text-zinc-400 hover:text-zinc-900 rounded-[1.5rem] transition-all border border-zinc-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleQuickCustomerSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-1">Nombre Completo</label>
                <input 
                  autoFocus 
                  required 
                  value={quickCustomerData.nombre} 
                  onChange={(e) => setQuickCustomerData({...quickCustomerData, nombre: e.target.value})} 
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4.5 text-base font-bold outline-none focus:border-zinc-900 transition-all shadow-sm"
                  placeholder="Juan Pérez..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-1">Teléfono</label>
                  <input 
                    required 
                    type="tel"
                    value={quickCustomerData.telefono} 
                    onChange={(e) => setQuickCustomerData({...quickCustomerData, telefono: e.target.value})} 
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4.5 text-base font-bold outline-none focus:border-zinc-900 transition-all shadow-sm"
                    placeholder="55..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-1">Email (Opcional)</label>
                  <input 
                    type="email"
                    value={quickCustomerData.email} 
                    onChange={(e) => setQuickCustomerData({...quickCustomerData, email: e.target.value})} 
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4.5 text-base font-bold outline-none focus:border-zinc-900 transition-all shadow-sm"
                    placeholder="ejemplo@mail.com"
                  />
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowQuickCustomer(false)} 
                  className="flex-1 py-5 rounded-[1.5rem] bg-zinc-100 text-zinc-600 font-black hover:bg-zinc-200 transition-all text-xs uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-5 rounded-[1.5rem] bg-zinc-900 text-white font-black hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-300 text-xs uppercase tracking-widest active:scale-95"
                >
                  Confirmar y Usar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
