
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface Props {
  users: User[];
  onBack: () => void;
  onUpdateUser: (user: User) => void;
  onAddUser: (user: Omit<User, 'id' | 'isLoggedIn'>) => void;
  isAdmin: boolean;
}

export const UsersList: React.FC<Props> = ({ users, onBack, onUpdateUser, onAddUser, isAdmin }) => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  const [newUserFormData, setNewUserFormData] = useState<Omit<User, 'id' | 'isLoggedIn'>>({
    username: '',
    email: '',
    password: '',
    nombre: '',
    nombreCorto: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    celular: '',
    role: 'USER'
  });

  const handleEditClick = (user: User) => {
    if (!isAdmin) return;
    setEditingUser({ ...user });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(editingUser);
      setEditingUser(null);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserFormData.username || !newUserFormData.email || !newUserFormData.password) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    onAddUser(newUserFormData);
    setIsAddingUser(false);
    // Reset form
    setNewUserFormData({
      username: '',
      email: '',
      password: '',
      nombre: '',
      nombreCorto: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: '',
      celular: '',
      role: 'USER'
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    }
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUserFormData({ ...newUserFormData, [e.target.name]: e.target.value });
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-zinc-200/50 animate-fade-in w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-800" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
          </button>
          <h2 className="text-xl font-bold text-zinc-900">Directorio Corporativo</h2>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsAddingUser(true)}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nuevo Usuario
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nombre Completo</th>
              <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Alias</th>
              <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rol</th>
              <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Usuario / Email</th>
              <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Celular</th>
              {isAdmin && <th className="py-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-4">
                  <p className="text-sm font-semibold text-zinc-800">{user.nombre} {user.apellidoPaterno} {user.apellidoMaterno}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-xs text-zinc-600 font-medium">{user.nombreCorto}</p>
                </td>
                <td className="py-4 px-4">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${user.role === 'ADMIN' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <p className="text-xs text-zinc-500">@{user.username}</p>
                  <p className="text-[10px] text-zinc-400">{user.email}</p>
                </td>
                <td className="py-4 px-4 text-xs text-zinc-600">{user.celular}</td>
                {isAdmin && (
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => handleEditClick(user)}
                      className="text-xs font-bold text-zinc-800 hover:text-black underline underline-offset-4"
                    >
                      Gestionar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Añadir Usuario */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-zinc-200 w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Registrar Nuevo Usuario</h3>
              <button onClick={() => setIsAddingUser(false)} className="text-zinc-400 hover:text-zinc-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Nombre(s)</label>
                  <input name="nombre" required value={newUserFormData.nombre} onChange={handleNewUserChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none" placeholder="Nombre completo"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Alias / Nombre Corto</label>
                  <input name="nombreCorto" required value={newUserFormData.nombreCorto} onChange={handleNewUserChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none font-bold" placeholder="Ej. Alex"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Apellido Paterno</label>
                  <input name="apellidoPaterno" required value={newUserFormData.apellidoPaterno} onChange={handleNewUserChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none" placeholder="Apellido"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Apellido Materno</label>
                  <input name="apellidoMaterno" value={newUserFormData.apellidoMaterno} onChange={handleNewUserChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none" placeholder="Apellido"/>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Nombre de Usuario</label>
                    <input name="username" required value={newUserFormData.username} onChange={handleNewUserChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none font-bold" placeholder="usuario_123"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Contraseña</label>
                    <input type="password" name="password" required value={newUserFormData.password} onChange={handleNewUserChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none" placeholder="••••••••"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Correo Electrónico</label>
                    <input type="email" name="email" required value={newUserFormData.email} onChange={handleNewUserChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none" placeholder="ejemplo@mentaverde.com"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Celular</label>
                    <input name="celular" value={newUserFormData.celular} onChange={handleNewUserChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none" placeholder="55 1234 5678"/>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-100 pt-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Fecha Nacimiento</label>
                  <input type="date" name="fechaNacimiento" value={newUserFormData.fechaNacimiento} onChange={handleNewUserChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Nivel de Acceso</label>
                  <select 
                    name="role" 
                    value={newUserFormData.role} 
                    onChange={handleNewUserChange}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none font-bold"
                  >
                    <option value="USER">USER (Estándar)</option>
                    <option value="ADMIN">ADMIN (Total)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setIsAddingUser(false)} className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-600 font-bold hover:bg-zinc-200 transition-colors text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors shadow-lg text-sm">Crear Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edición de Usuario */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-zinc-200 w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Modificar Registro</h3>
              <button onClick={() => setEditingUser(null)} className="text-zinc-400 hover:text-zinc-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Nombre</label>
                    <input name="nombre" value={editingUser.nombre} onChange={handleEditChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Alias / Nombre Corto</label>
                    <input name="nombreCorto" value={editingUser.nombreCorto} onChange={handleEditChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none font-bold"/>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Nivel de Acceso</label>
                  <select 
                    name="role" 
                    value={editingUser.role} 
                    onChange={handleEditChange}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none font-bold"
                  >
                    <option value="USER">USER (Estándar)</option>
                    <option value="ADMIN">ADMIN (Total)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Correo Electrónico</label>
                  <input name="email" value={editingUser.email} onChange={handleEditChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Celular</label>
                    <input name="celular" value={editingUser.celular} onChange={handleEditChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Fecha Nacimiento</label>
                    <input type="date" name="fechaNacimiento" value={editingUser.fechaNacimiento} onChange={handleEditChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-800/10 outline-none"/>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-600 font-bold hover:bg-zinc-200 transition-colors text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors shadow-lg text-sm">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
