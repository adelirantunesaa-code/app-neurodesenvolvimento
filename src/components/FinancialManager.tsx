'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, FileText, AlertCircle, Plus, Eye, MessageCircle } from 'lucide-react'
import { Invoice, Expense, DashboardStats } from '@/lib/types'
import { whatsappUtils } from '@/lib/whatsapp'

interface FinancialManagerProps {
  invoices: Invoice[]
  expenses: Expense[]
  stats: DashboardStats
  userType: 'client' | 'therapist'
  onInvoiceUpdate: (invoice: Invoice) => void
  onExpenseCreate: (expense: Omit<Expense, 'id'>) => void
  onExpenseUpdate: (expense: Expense) => void
}

export default function FinancialManager({
  invoices,
  expenses,
  stats,
  userType,
  onInvoiceUpdate,
  onExpenseCreate,
  onExpenseUpdate
}: FinancialManagerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'expenses'>('overview')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    category: 'other' as Expense['category'],
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    recurring: false
  })

  const handleCreateExpense = () => {
    if (!newExpense.description || newExpense.amount <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const expense: Omit<Expense, 'id'> = {
      ...newExpense,
      status: 'pending'
    }

    onExpenseCreate(expense)
    setNewExpense({
      description: '',
      amount: 0,
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      recurring: false
    })
    setShowExpenseForm(false)
  }

  const handleSendInvoiceReminder = (invoice: Invoice) => {
    const message = whatsappUtils.templates.invoiceReminder(invoice)
    whatsappUtils.sendMessage('11999999999', message) // Número do cliente
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'overdue': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'pending': return 'Pendente'
      case 'overdue': return 'Vencido'
      default: return 'Desconhecido'
    }
  }

  const getCategoryIcon = (category: Expense['category']) => {
    switch (category) {
      case 'rent': return '🏠'
      case 'utilities': return '⚡'
      case 'supplies': return '📦'
      case 'equipment': return '🔧'
      default: return '📄'
    }
  }

  const getCategoryName = (category: Expense['category']) => {
    switch (category) {
      case 'rent': return 'Aluguel'
      case 'utilities': return 'Utilidades'
      case 'supplies': return 'Materiais'
      case 'equipment': return 'Equipamentos'
      default: return 'Outros'
    }
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Receita Hoje</p>
              <p className="text-2xl font-bold">R$ {stats.todayRevenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Receita Mensal</p>
              <p className="text-2xl font-bold">R$ {stats.monthlyRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Consultas Mês</p>
              <p className="text-2xl font-bold">{stats.monthlyAppointments}</p>
            </div>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Faturas Pendentes</p>
              <p className="text-2xl font-bold">{stats.pendingInvoices}</p>
            </div>
            <AlertCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Faturas Recentes</h3>
          <div className="space-y-3">
            {invoices.slice(0, 5).map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{invoice.description}</p>
                  <p className="text-xs text-gray-600">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">R$ {invoice.amount.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {userType === 'therapist' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-4">Despesas Próximas</h3>
            <div className="space-y-3">
              {expenses
                .filter(expense => expense.status === 'pending')
                .slice(0, 5)
                .map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                      <div>
                        <p className="font-medium text-sm">{expense.description}</p>
                        <p className="text-xs text-gray-600">Vence em: {expense.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">R$ {expense.amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(expense.status)}`}>
                        {getStatusText(expense.status)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const InvoicesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Faturas</h3>
        {userType === 'therapist' && (
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300">
            Nova Fatura
          </button>
        )}
      </div>

      <div className="space-y-3">
        {invoices.map(invoice => (
          <div key={invoice.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-semibold">{invoice.description}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Data: {invoice.date} | Vencimento: {invoice.dueDate}</p>
                  <p className="font-semibold text-lg text-gray-800">R$ {invoice.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedInvoice(invoice)}
                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Ver detalhes"
                >
                  <Eye className="w-4 h-4" />
                </button>
                
                {userType === 'therapist' && invoice.status !== 'paid' && (
                  <button
                    onClick={() => handleSendInvoiceReminder(invoice)}
                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    title="Enviar lembrete"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}

                {userType === 'client' && invoice.status === 'pending' && (
                  <button
                    onClick={() => {
                      const message = `Gostaria de quitar a fatura: ${invoice.description} - R$ ${invoice.amount.toFixed(2)}`
                      whatsappUtils.sendToClinic(message)
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Pagar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const ExpensesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Despesas da Clínica</h3>
        <button
          onClick={() => setShowExpenseForm(true)}
          className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Despesa
        </button>
      </div>

      {/* Formulário de nova despesa */}
      {showExpenseForm && (
        <div className="bg-red-50 border-2 border-dashed border-red-300 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Nova Despesa</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                placeholder="Descrição da despesa"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                placeholder="0.00"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value as Expense['category']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="rent">Aluguel</option>
                <option value="utilities">Utilidades</option>
                <option value="supplies">Materiais</option>
                <option value="equipment">Equipamentos</option>
                <option value="other">Outros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vencimento</label>
              <input
                type="date"
                value={newExpense.dueDate}
                onChange={(e) => setNewExpense({...newExpense, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newExpense.recurring}
                onChange={(e) => setNewExpense({...newExpense, recurring: e.target.checked})}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Despesa recorrente</span>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateExpense}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Adicionar Despesa
            </button>
            <button
              onClick={() => setShowExpenseForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {expenses.map(expense => (
          <div key={expense.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{expense.description}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {getCategoryName(expense.category)}
                    </span>
                    {expense.recurring && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        Recorrente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Vencimento: {expense.dueDate}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-lg text-red-600">R$ {expense.amount.toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(expense.status)}`}>
                  {getStatusText(expense.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          Gestão Financeira
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'invoices'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Faturas
        </button>
        {userType === 'therapist' && (
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'expenses'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Despesas
          </button>
        )}
      </div>

      {/* Conteúdo das tabs */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'invoices' && <InvoicesTab />}
      {activeTab === 'expenses' && userType === 'therapist' && <ExpensesTab />}
    </div>
  )
}