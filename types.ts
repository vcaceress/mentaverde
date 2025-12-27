
export enum AuthView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  DASHBOARD = 'DASHBOARD',
  DATABASE = 'DATABASE',
  USERS_LIST = 'USERS_LIST',
  PERMISSIONS = 'PERMISSIONS',
  SALES_FORM = 'SALES_FORM',
  SELLERS_MANAGER = 'SELLERS_MANAGER',
  CUSTOMERS_MANAGER = 'CUSTOMERS_MANAGER',
  SERVICES_MANAGER = 'SERVICES_MANAGER',
  CALENDAR = 'CALENDAR'
}

export type UserRole = 'ADMIN' | 'USER';

export interface AppPermissions {
  showDatabaseDesigner: boolean;
  showAIAssistant: boolean;
  showAnalytics: boolean;
  showSalesForm: boolean;
  showSellersManager: boolean;
  showCustomersManager: boolean;
  showServicesManager: boolean;
}

export interface Service {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  activo: boolean;
}

export interface ServiceLineItem {
  serviceId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Seller {
  id: string;
  nombre: string;
  nombreCorto: string;
  usuario: string;
  password?: string;
  activo: boolean;
}

export interface Customer {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  activo: boolean;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  serviceId: string;
  serviceName: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
  notes?: string;
}

export interface PagoDetalle {
  efectivo: number;
  transferencia: number;
  tarjeta: number;
}

export interface SaleRecord {
  id: string;
  folio: number;
  fecha: string;
  vendedor: string;
  vendedorShort: string;
  cliente?: string;
  importeBruto: number;
  importeTerminal: number;
  detallesPago: PagoDetalle;
  metodoPago: string; 
  servicios?: ServiceLineItem[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  nombre: string;
  nombreCorto: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  celular: string;
  isLoggedIn: boolean;
  role: UserRole;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface TableColumn {
  name: string;
  type: string;
  key?: 'PRI' | 'FOR';
  extra?: string;
}

export interface DBTable {
  name: string;
  columns: TableColumn[];
}
