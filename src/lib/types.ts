export interface User {
  id: string
  name: string
  email: string
  type: 'client' | 'therapist'
  phone?: string
  avatar?: string
}

export interface Appointment {
  id: string
  date: string
  time: string
  client: string
  clientId: string
  service: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  price: number
  notes?: string
  therapistId?: string
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  description: string
  clientId: string
  appointmentId?: string
  dueDate: string
}

export interface Notification {
  id: string
  message: string
  type: 'appointment' | 'payment' | 'reminder' | 'system'
  read: boolean
  date: string
  userId: string
  actionUrl?: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  category: 'rent' | 'utilities' | 'supplies' | 'equipment' | 'other'
  date: string
  dueDate: string
  status: 'paid' | 'pending' | 'overdue'
  recurring: boolean
}

export interface Service {
  id: string
  name: string
  duration: number // em minutos
  price: number
  description?: string
  active: boolean
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  address?: string
  medicalHistory?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: string
  active: boolean
}

export interface WhatsAppMessage {
  to: string
  message: string
  type: 'appointment' | 'reminder' | 'invoice' | 'general'
}

export interface DashboardStats {
  todayAppointments: number
  todayRevenue: number
  activeClients: number
  pendingInvoices: number
  monthlyRevenue: number
  monthlyAppointments: number
}