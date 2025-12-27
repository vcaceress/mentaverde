
import React, { useState } from 'react';
import { Appointment, Customer, Service } from '../types';

interface Props {
  appointments: Appointment[];
  customers: Customer[];
  services: Service[];
  onAddAppointment: (appt: Appointment) => void;
  onUpdateAppointment: (appt: Appointment) => void;
  onBack: () => void;
}

export const CalendarManager: React.FC<Props> = ({ 
  appointments, 
  customers, 
  services, 
  onAddAppointment, 
  onUpdateAppointment, 
  onBack 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    phone: '',
    time: '09:00',
    serviceId: services[0]?.id || '',
    notes: ''
  });

  const filteredCustomers = customers.filter(c => 
    c.nombre.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.telefono.includes(customerSearch)
  ).slice(0, 5);

  const appointmentsForSelectedDate = appointments.filter(a => a.date === selectedDate);

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleSelectCustomer = (c: Customer) => {
    setFormData({
      ...formData,
      customerId: c.id,
      customerName: c.nombre,
      phone: c.telefono
    });
    setCustomerSearch(c.nombre);
    setShowCustomerResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.serviceId) return;

    const service = services.find(s => s.id === formData.serviceId);
    
    onAddAppointment({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      date: selectedDate,
      serviceName: service?.nombre || 'Servicio desconocido',
      status: 'PENDIENTE'
    });

    setFormData({ ...formData, customerId: '', customerName: '', phone: '', time: '09:00', notes: '' });
    setCustomerSearch('');
    setIsAdding(false);
  };

  const sendWhatsAppReminder = (appt: Appointment) => {
    const message = `Hola ${appt.customerName}, te recordamos tu cita en Menta Verde el día ${appt.date} a las ${appt.time} para el servicio de ${appt.serviceName}. ¡Te esperamos!`;
    const phone = appt.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Basic Calendar Logic
  const renderCalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
      <div className="grid grid-cols-7 gap-2">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
          <div key={d} className="text-center text-[10px] font-black text-zinc-400 py-2 uppercase tracking-widest">{d}</div>
        ))}
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="h-14"></div>;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          const hasAppts = appointments.some(a => a.date === dateStr);
          
          return (
            <button
              key={day}
              onClick={() => handleDayClick(dateStr)}
              className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all border ${
                isSelected 
                ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-105 z-10' 
                : 'bg-white border-zinc-100 hover:border-zinc-300 text-zinc-800'
              }`}
            >
              <span className="text-xs font-black">{day}</span>
              {hasAppts && <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-emerald-400' : 'bg-emerald-500'}`}></div>}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-zinc-200/50 animate-fade-in w-full max-w-6xl mx-auto min-h-[750px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-3 bg-zinc-100 hover:bg-zinc-200 rounded-2xl transition-all border border-zinc-200 shadow-sm group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-800 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Agenda de Citas</h2>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Vista para {selectedDate}</p>
          </div>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-xl active:scale-95 flex items-center gap-2 uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Calendar Grid */}
        <div className="lg:col-span-5 bg-zinc-50/50 p-6 rounded-[2.5rem] border border-zinc-100">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-sm font-black text-zinc-800 uppercase tracking-widest">
              {new Date().toLocaleString('es-MX', { month: 'long', year: 'numeric' })}
            </h3>
          </div>
          {renderCalendar()}
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
            Citas Programadas
            <span className="bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">{appointmentsForSelectedDate.length}</span>
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {appointmentsForSelectedDate.length === 0 ? (
              <div className="py-20 text-center bg-white border border-dashed border-zinc-200 rounded-[2.5rem]">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Sin citas para hoy</p>
              </div>
            ) : (
              appointmentsForSelectedDate.map(appt => (
                <div key={appt.id} className="bg-white border border-zinc-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-zinc-200 transition-all group flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex flex-col items-center justify-center border border-zinc-100">
                      <span className="text-lg font-black text-zinc-900 leading-none">{appt.time}</span>
                      <span className="text-[8px] font-bold text-zinc-400 uppercase mt-1">Hora</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900">{appt.customerName}</h4>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight mt-0.5">{appt.serviceName}</p>
                      <p className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.505 5.505l.773-1.548a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                        {appt.phone}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => sendWhatsAppReminder(appt)}
                    className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-100 group-hover:scale-105 active:scale-95"
                    title="Enviar Recordatorio WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 448 512">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18s-8.8-2.8-12.4 2.8-14.1 18-17.3 21.6-6.5 4.1-12 1.3c-5.5-2.8-23.4-8.6-44.5-27.4-16.4-14.6-27.5-32.7-30.7-38.2-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.6 5.5-6.4 8.2-9.6 2.8-3.2 3.7-5.5 5.5-9.1 1.8-3.7.9-6.9-.5-9.6-1.4-2.8-12.4-29.8-17-41.1-4.5-10.9-9.1-9.4-12.4-9.6-3.2-.1-6.9-.2-10.5-.2-3.7 0-9.6 1.4-14.7 6.9-5.1 5.5-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.3 4.6-13 4.6-24.1 3.2-26.3-1.3-2.3-5-3.6-10.5-6.5z"/>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-white w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">Agendar Cita</h3>
                <p className="text-zinc-500 mt-2 font-medium">Completa los datos del paciente y servicio.</p>
              </div>
              <button 
                onClick={() => setIsAdding(false)} 
                className="p-4 bg-zinc-50 text-zinc-400 hover:text-zinc-900 rounded-[1.5rem] transition-all border border-zinc-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l18 18" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Search */}
              <div className="space-y-3 relative">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Buscar Cliente</label>
                <input 
                  type="text" 
                  value={customerSearch}
                  onChange={(e) => {setCustomerSearch(e.target.value); setShowCustomerResults(true);}}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4.5 text-base font-bold outline-none focus:border-zinc-900 transition-all shadow-sm"
                  placeholder="Nombre o teléfono..."
                />
                {showCustomerResults && customerSearch.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-[1.5rem] shadow-2xl z-[50] overflow-hidden">
                    {filteredCustomers.map(c => (
                      <button key={c.id} type="button" onClick={() => handleSelectCustomer(c)} className="w-full text-left p-4 hover:bg-zinc-50 border-b border-zinc-50 last:border-0 flex items-center gap-3 transition-colors">
                        <div className="w-7 h-7 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-[10px] text-zinc-400">{c.nombre[0]}</div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900">{c.nombre}</p>
                          <p className="text-[10px] text-zinc-400">{c.telefono}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-1">Hora</label>
                  <input 
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4.5 text-base font-bold outline-none focus:border-zinc-900 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-1">Fecha</label>
                  <input 
                    type="date"
                    disabled
                    value={selectedDate}
                    className="w-full bg-zinc-100 border-2 border-zinc-100 rounded-2xl px-6 py-4.5 text-base font-bold text-zinc-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-1">Servicio</label>
                <select 
                  value={formData.serviceId}
                  onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4.5 text-base font-bold outline-none focus:border-zinc-900 transition-all shadow-sm"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-1">Notas Adicionales</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-zinc-900 transition-all resize-none shadow-sm"
                  placeholder="Ej. Alérgico a ciertos productos..."
                  rows={2}
                />
              </div>

              <div className="pt-8 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)} 
                  className="flex-1 py-5 rounded-[1.5rem] bg-zinc-100 text-zinc-600 font-black hover:bg-zinc-200 transition-all text-xs uppercase tracking-widest"
                >
                  Cerrar
                </button>
                <button 
                  type="submit" 
                  disabled={!formData.customerId}
                  className="flex-1 py-5 rounded-[1.5rem] bg-zinc-900 text-white font-black hover:bg-zinc-800 transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed text-xs uppercase tracking-widest active:scale-95"
                >
                  Registrar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
