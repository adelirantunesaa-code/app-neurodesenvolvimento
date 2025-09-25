'use client'

import { useState } from 'react'
import { User, Calendar, FileText, Bell, MessageCircle, Settings, Clock, DollarSign, Users, Phone, Menu, X } from 'lucide-react'
import AppointmentManager from '@/components/AppointmentManager'
import FinancialManager from '@/components/FinancialManager'
import { whatsappUtils } from '@/lib/whatsapp'
import { Appointment, Invoice, Expense, Service, Notification, DashboardStats } from '@/lib/types'

type UserType = 'client' | 'therapist' | null

export default function CarameloApp() {
  const [userType, setUserType] = useState<UserType>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  // Dados mockados mais completos
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', date: '2024-01-15', time: '09:00', client: 'Maria Silva', clientId: '1', service: 'Fisioterapia Neurológica', status: 'scheduled', price: 120, notes: 'Primeira consulta' },
    { id: '2', date: '2024-01-15', time: '10:30', client: 'João Santos', clientId: '2', service: 'Terapia Ocupacional', status: 'scheduled', price: 100 },
    { id: '3', date: '2024-01-16', time: '14:00', client: 'Ana Costa', clientId: '3', service: 'Fonoaudiologia', status: 'completed', price: 110 },
    { id: '4', date: '2024-01-17', time: '16:00', client: 'Pedro Lima', clientId: '4', service: 'Fisioterapia Neurológica', status: 'scheduled', price: 120 },
  ])

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: '1', date: '2024-01-10', amount: 120, status: 'paid', description: 'Consulta Fisioterapia', clientId: '1', dueDate: '2024-01-15' },
    { id: '2', date: '2024-01-05', amount: 100, status: 'pending', description: 'Terapia Ocupacional', clientId: '2', dueDate: '2024-01-20' },
    { id: '3', date: '2023-12-28', amount: 110, status: 'overdue', description: 'Fonoaudiologia', clientId: '3', dueDate: '2024-01-05' },
    { id: '4', date: '2024-01-12', amount: 120, status: 'pending', description: 'Fisioterapia Neurológica', clientId: '4', dueDate: '2024-01-25' },
  ])

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', description: 'Aluguel da Clínica', amount: 2500, category: 'rent', date: '2024-01-01', dueDate: '2024-01-15', status: 'pending', recurring: true },
    { id: '2', description: 'Energia Elétrica', amount: 350, category: 'utilities', date: '2024-01-01', dueDate: '2024-01-20', status: 'pending', recurring: true },
    { id: '3', description: 'Material Terapêutico', amount: 800, category: 'supplies', date: '2024-01-10', dueDate: '2024-01-10', status: 'paid', recurring: false },
    { id: '4', description: 'Equipamento Fisioterapia', amount: 1200, category: 'equipment', date: '2024-01-05', dueDate: '2024-01-30', status: 'pending', recurring: false },
  ])

  const services: Service[] = [
    { id: '1', name: 'Fisioterapia Neurológica', duration: 60, price: 120, description: 'Tratamento especializado em neurologia', active: true },
    { id: '2', name: 'Terapia Ocupacional', duration: 45, price: 100, description: 'Reabilitação ocupacional', active: true },
    { id: '3', name: 'Fonoaudiologia', duration: 50, price: 110, description: 'Tratamento da comunicação', active: true },
    { id: '4', name: 'Psicomotricidade', duration: 45, price: 95, description: 'Desenvolvimento psicomotor', active: true },
  ]

  const notifications: Notification[] = [
    { id: '1', message: 'Consulta agendada para amanhã às 09:00', type: 'appointment', read: false, date: '2024-01-14', userId: '1' },
    { id: '2', message: 'Fatura vencendo em 3 dias', type: 'payment', read: false, date: '2024-01-12', userId: '1' },
    { id: '3', message: 'Lembrete: Consulta em 1 hora', type: 'reminder', read: true, date: '2024-01-14', userId: '1' },
    { id: '4', message: 'Nova consulta agendada por Maria Silva', type: 'appointment', read: false, date: '2024-01-14', userId: 'therapist' },
  ]

  const stats: DashboardStats = {
    todayAppointments: 5,
    todayRevenue: 540,
    activeClients: 45,
    pendingInvoices: 3,
    monthlyRevenue: 12400,
    monthlyAppointments: 89
  }

  const handleAppointmentUpdate = (appointment: Appointment) => {
    setAppointments(prev => prev.map(apt => apt.id === appointment.id ? appointment : apt))
  }

  const handleAppointmentDelete = (appointmentId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId))
  }

  const handleAppointmentCreate = (newAppointment: Omit<Appointment, 'id'>) => {
    const appointment: Appointment = {
      ...newAppointment,
      id: Date.now().toString()
    }
    setAppointments(prev => [...prev, appointment])
  }

  const handleInvoiceUpdate = (invoice: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === invoice.id ? invoice : inv))
  }

  const handleExpenseCreate = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString()
    }
    setExpenses(prev => [...prev, expense])
  }

  const handleExpenseUpdate = (expense: Expense) => {
    setExpenses(prev => prev.map(exp => exp.id === expense.id ? expense : exp))
  }

  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo da Clínica */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="w-full h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-white font-bold text-2xl">CN</div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Caramelo</h1>
          <h2 className="text-xl font-semibold text-orange-600 mb-1">Neurodesenvolvimento</h2>
          <p className="text-gray-600 text-sm">Fisioterapia • Terapia Ocupacional • Fonoaudiologia</p>
        </div>

        {!showAdminLogin ? (
          <div className="space-y-4">
            <button
              onClick={() => {
                setUserType('client')
                setIsLoggedIn(true)
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Acesso do Paciente
            </button>
            
            <button
              onClick={() => {
                setUserType('therapist')
                setIsLoggedIn(true)
              }}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Acesso da Fisioterapeuta
            </button>

            <div className="text-center mt-6">
              <button
                onClick={() => setShowAdminLogin(true)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Acesso Administrativo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Acesso Administrativo</h3>
              <p className="text-sm text-gray-600">Selecione o tipo de usuário para gerenciar</p>
            </div>
            
            <button
              onClick={() => {
                setUserType('therapist')
                setIsLoggedIn(true)
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Gerenciar como Fisioterapeuta
            </button>
            
            <button
              onClick={() => {
                setUserType('client')
                setIsLoggedIn(true)
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Gerenciar como Paciente
            </button>

            <button
              onClick={() => setShowAdminLogin(false)}
              className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const ClientDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo, Maria!</h2>
        <p className="opacity-90">Sua próxima consulta é amanhã às 09:00</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Próximas Consultas</h3>
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div className="space-y-3">
            {appointments.filter(apt => apt.status === 'scheduled').slice(0, 2).map(apt => (
              <div key={apt.id} className="border-l-4 border-amber-500 pl-3">
                <p className="font-medium text-sm">{apt.service}</p>
                <p className="text-xs text-gray-600">{apt.date} às {apt.time}</p>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => whatsappUtils.sendToClinic(whatsappUtils.templates.rescheduleRequest(apt))}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    WhatsApp
                  </button>
                  <button className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-200 transition-colors">
                    Remarcar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Faturas</h3>
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <div className="space-y-3">
            {invoices.slice(0, 3).map(invoice => (
              <div key={invoice.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{invoice.description}</p>
                  <p className="text-xs text-gray-600">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">R$ {invoice.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                    invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {invoice.status === 'paid' ? 'Pago' : 
                     invoice.status === 'pending' ? 'Pendente' : 'Vencido'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Notificações</h3>
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div className="space-y-3">
            {notifications.filter(n => n.userId === '1').slice(0, 3).map(notification => (
              <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-amber-50'}`}>
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const TherapistDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Painel da Fisioterapeuta</h2>
        <p className="opacity-90">Você tem {stats.todayAppointments} consultas hoje</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.todayAppointments}</p>
              <p className="text-sm text-gray-600">Consultas Hoje</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">R$ {stats.todayRevenue}</p>
              <p className="text-sm text-gray-600">Receita Hoje</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.activeClients}</p>
              <p className="text-sm text-gray-600">Pacientes Ativos</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingInvoices}</p>
              <p className="text-sm text-gray-600">Pendências</p>
            </div>
            <Bell className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Agenda de Hoje</h3>
            <button 
              onClick={() => setActiveTab('appointments')}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors"
            >
              Ver Agenda
            </button>
          </div>
          <div className="space-y-3">
            {appointments.filter(apt => apt.status === 'scheduled').slice(0, 3).map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{apt.client}</p>
                  <p className="text-sm text-gray-600">{apt.service}</p>
                  <p className="text-xs text-gray-500">{apt.time}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => whatsappUtils.sendMessage('11999999999', whatsappUtils.templates.appointmentConfirmation(apt))}
                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Resumo Financeiro</h3>
            <button 
              onClick={() => setActiveTab('financial')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              Ver Detalhes
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Receita Mensal</span>
              <span className="font-bold text-green-600">R$ {stats.monthlyRevenue}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium">Faturas Pendentes</span>
              <span className="font-bold text-yellow-600">{stats.pendingInvoices}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium">Despesas Pendentes</span>
              <span className="font-bold text-red-600">{expenses.filter(e => e.status === 'pending').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const Navigation = () => (
    <nav className="bg-white shadow-lg rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
            <div className="text-white font-bold text-sm">CN</div>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Caramelo Neuro</h1>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-amber-100 text-amber-700' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'appointments' 
                ? 'bg-amber-100 text-amber-700' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Agendamentos
          </button>
          
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'financial' 
                ? 'bg-amber-100 text-amber-700' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Financeiro
          </button>

          <button
            onClick={() => whatsappUtils.sendToClinic('Olá! Preciso de ajuda com o sistema.')}
            className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
          
          <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => {
              setIsLoggedIn(false)
              setUserType(null)
              setActiveTab('dashboard')
              setShowAdminLogin(false)
            }}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('dashboard')
                setIsMobileMenuOpen(false)
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dashboard
            </button>
            
            <button
              onClick={() => {
                setActiveTab('appointments')
                setIsMobileMenuOpen(false)
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'appointments' 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Agendamentos
            </button>
            
            <button
              onClick={() => {
                setActiveTab('financial')
                setIsMobileMenuOpen(false)
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'financial' 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Financeiro
            </button>

            <button
              onClick={() => {
                whatsappUtils.sendToClinic('Olá! Preciso de ajuda com o sistema.')
                setIsMobileMenuOpen(false)
              }}
              className="w-full text-left flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            
            <button
              onClick={() => {
                setIsLoggedIn(false)
                setUserType(null)
                setActiveTab('dashboard')
                setIsMobileMenuOpen(false)
                setShowAdminLogin(false)
              }}
              className="w-full text-left bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  )

  if (!isLoggedIn) {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Navigation />
        
        {activeTab === 'dashboard' && (
          <>
            {userType === 'client' && <ClientDashboard />}
            {userType === 'therapist' && <TherapistDashboard />}
          </>
        )}
        
        {activeTab === 'appointments' && (
          <AppointmentManager
            appointments={appointments}
            services={services}
            userType={userType!}
            onAppointmentUpdate={handleAppointmentUpdate}
            onAppointmentDelete={handleAppointmentDelete}
            onAppointmentCreate={handleAppointmentCreate}
          />
        )}
        
        {activeTab === 'financial' && (
          <FinancialManager
            invoices={invoices}
            expenses={expenses}
            stats={stats}
            userType={userType!}
            onInvoiceUpdate={handleInvoiceUpdate}
            onExpenseCreate={handleExpenseCreate}
            onExpenseUpdate={handleExpenseUpdate}
          />
        )}
      </div>
    </div>
  )
}