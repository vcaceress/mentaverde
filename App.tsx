
import React, { useState } from 'react';
import { AuthView, User, AppPermissions, SaleRecord, Seller, Customer, Service, Appointment } from './types';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { Dashboard } from './components/Dashboard';
import { DatabaseManager } from './components/DatabaseManager';
import { UsersList } from './components/UsersList';
import { PermissionsManager } from './components/PermissionsManager';
import { AIAssistant } from './components/AIAssistant';
import { SalesForm } from './components/SalesForm';
import { SellersManager } from './components/SellersManager';
import { CustomersManager } from './components/CustomersManager';
import { ServicesManager } from './components/ServicesManager';
import { CalendarManager } from './components/CalendarManager';

const INITIAL_PERMISSIONS: AppPermissions = {
  showDatabaseDesigner: true,
  showAIAssistant: true,
  showAnalytics: false,
  showSalesForm: true,
  showSellersManager: true,
  showCustomersManager: true,
  showServicesManager: true
};

const INITIAL_SERVICES: Service[] = [
  { id: '1', nombre: 'Limpieza Facial Profunda', precio: 850, descripcion: 'Tratamiento completo con exfoliación y mascarilla hidratante.', activo: true },
  { id: '2', nombre: 'Masaje Relajante 60min', precio: 1200, descripcion: 'Masaje corporal completo con aceites esenciales de menta.', activo: true }
];

const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@mentaverde.com',
    password: 'admin1234',
    nombre: 'Administrador',
    nombreCorto: 'Admin',
    apellidoPaterno: 'Principal',
    apellidoMaterno: 'Menta',
    fechaNacimiento: '1990-01-01',
    celular: '5512345678',
    isLoggedIn: true,
    role: 'ADMIN'
  }
];

const INITIAL_SELLERS: Seller[] = [
  { id: '1', nombre: 'Admin Principal', nombreCorto: 'Admin', usuario: 'admin_sales', password: '123', activo: true },
  { id: '2', nombre: 'Beatriz Solis', nombreCorto: 'Betty', usuario: 'betty_01', password: '123', activo: true }
];

const INITIAL_CUSTOMERS: Customer[] = [
  { 
    id: '1', 
    nombre: 'Tecnologías Globales S.A.', 
    email: 'contacto@tglobals.com', 
    telefono: '5544332211', 
    direccion: 'Av. Reforma 100, CDMX', 
    fechaNacimiento: '1985-05-15',
    activo: true 
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<AuthView>(AuthView.DASHBOARD);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(INITIAL_USERS);
  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [systemPermissions, setSystemPermissions] = useState<AppPermissions>(INITIAL_PERMISSIONS);
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([]);
  const [nextFolio, setNextFolio] = useState<number>(1);

  const handleLogin = (username: string, password?: string): boolean => {
    const existingUser = registeredUsers.find(u => u.username === username || u.email === username);
    if (existingUser && existingUser.password === password) {
      setCurrentUser({ ...existingUser, isLoggedIn: true });
      setView(AuthView.DASHBOARD);
      return true;
    }
    return false;
  };

  const handleAddAppointment = (appt: Appointment) => {
    setAppointments([...appointments, appt]);
  };

  const handleUpdateAppointment = (updatedAppt: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updatedAppt.id ? updatedAppt : a));
  };

  const handleAddSale = (sale: Omit<SaleRecord, 'id'>) => {
    const newSale: SaleRecord = { ...sale, id: Math.random().toString(36).substr(2, 9) };
    setSalesHistory([newSale, ...salesHistory]);
    setNextFolio(sale.folio + 1);
  };

  const renderView = () => {
    if (!currentUser && view !== AuthView.REGISTER && view !== AuthView.FORGOT_PASSWORD) {
      return <LoginForm onLogin={handleLogin} onSwitchView={setView} />;
    }

    const isAdmin = currentUser?.role === 'ADMIN';

    switch (view) {
      case AuthView.DASHBOARD:
        return <Dashboard user={currentUser!} onLogout={() => { setCurrentUser(null); setView(AuthView.LOGIN); }} onSwitchView={setView} permissions={systemPermissions} salesHistory={salesHistory} />;
      case AuthView.CALENDAR:
        return <CalendarManager 
          appointments={appointments} 
          customers={customers} 
          services={services} 
          onAddAppointment={handleAddAppointment} 
          onUpdateAppointment={handleUpdateAppointment}
          onBack={() => setView(AuthView.DASHBOARD)} 
        />;
      case AuthView.REGISTER:
        return <RegisterForm onSwitchView={setView} onRegister={(u) => setRegisteredUsers([...registeredUsers, { ...u, id: Date.now().toString(), username: u.email.split('@')[0], isLoggedIn: false, role: 'USER' } as User])} />;
      case AuthView.FORGOT_PASSWORD:
        return <ForgotPasswordForm onSwitchView={setView} />;
      case AuthView.USERS_LIST:
        return isAdmin ? <UsersList users={registeredUsers} onBack={() => setView(AuthView.DASHBOARD)} onUpdateUser={(u) => setRegisteredUsers(registeredUsers.map(x => x.id === u.id ? u : x))} onAddUser={(u) => setRegisteredUsers([...registeredUsers, { ...u, id: Date.now().toString(), isLoggedIn: false } as User])} isAdmin={true} /> : <Dashboard user={currentUser!} onLogout={() => {}} onSwitchView={setView} permissions={systemPermissions} salesHistory={salesHistory} />;
      case AuthView.SALES_FORM:
        return <SalesForm currentUser={currentUser!} nextFolio={nextFolio} onSetFolio={setNextFolio} onAddSale={handleAddSale} onUpdateSale={() => {}} salesHistory={salesHistory} sellers={sellers.filter(s => s.activo)} customers={customers.filter(c => c.activo)} services={services.filter(s => s.activo)} onBack={() => setView(AuthView.DASHBOARD)} onAddSeller={() => {}} onAddCustomer={(c) => { const nc = { ...c, id: Date.now().toString() }; setCustomers([...customers, nc]); return nc; }} />;
      case AuthView.SELLERS_MANAGER:
        return <SellersManager sellers={sellers} onAddSeller={(n, nc, u, p) => setSellers([...sellers, { id: Date.now().toString(), nombre: n, nombreCorto: nc, usuario: u, password: p, activo: true }])} onUpdateSeller={(s) => setSellers(sellers.map(x => x.id === s.id ? s : x))} onToggleSeller={(id) => setSellers(sellers.map(x => x.id === id ? { ...x, activo: !x.activo } : x))} onBack={() => setView(AuthView.DASHBOARD)} />;
      case AuthView.CUSTOMERS_MANAGER:
        return <CustomersManager customers={customers} onAddCustomer={(c) => setCustomers([...customers, { ...c, id: Date.now().toString() }])} onUpdateCustomer={(c) => setCustomers(customers.map(x => x.id === c.id ? c : x))} onToggleCustomer={(id) => setCustomers(customers.map(x => x.id === id ? { ...x, activo: !x.activo } : x))} onBack={() => setView(AuthView.DASHBOARD)} />;
      case AuthView.SERVICES_MANAGER:
        return <ServicesManager services={services} onAddService={(s) => setServices([...services, { ...s, id: Date.now().toString() }])} onUpdateService={(s) => setServices(services.map(x => x.id === s.id ? s : x))} onToggleService={(id) => setServices(services.map(x => x.id === id ? { ...x, activo: !x.activo } : x))} onBack={() => setView(AuthView.DASHBOARD)} />;
      default:
        return <LoginForm onLogin={handleLogin} onSwitchView={setView} />;
    }
  };

  const isWideView = [AuthView.DATABASE, AuthView.USERS_LIST, AuthView.PERMISSIONS, AuthView.SALES_FORM, AuthView.SELLERS_MANAGER, AuthView.CUSTOMERS_MANAGER, AuthView.SERVICES_MANAGER, AuthView.CALENDAR].includes(view);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-zinc-800 selection:text-white">
      <div className={`w-full ${isWideView ? 'max-w-6xl' : 'max-w-4xl'} transition-all duration-500`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-800" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.9L10 1.154l7.834 3.746v2.857c0 4.786-3.233 9.27-7.834 10.334-4.601-1.064-7.834-5.548-7.834-10.334V4.9zM10 6.641a1.67 1.67 0 000 3.34 1.67 1.67 0 000-3.34z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Menta Verde</h1>
          <p className="text-zinc-500 text-sm">Administración</p>
        </div>
        <div className="flex justify-center w-full">{renderView()}</div>
      </div>
      {(systemPermissions.showAIAssistant || currentUser?.role === 'ADMIN') && <AIAssistant />}
    </div>
  );
};
export default App;
