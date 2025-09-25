'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Phone, MessageCircle, Edit, Trash2, Plus } from 'lucide-react'
import { Appointment, Service } from '@/lib/types'
import { whatsappUtils } from '@/lib/whatsapp'

interface AppointmentManagerProps {
  appointments: Appointment[]
  services: Service[]
  userType: 'client' | 'therapist'
  onAppointmentUpdate: (appointment: Appointment) => void
  onAppointmentDelete: (appointmentId: string) => void
  onAppointmentCreate: (appointment: Omit<Appointment, 'id'>) => void
}

export default function AppointmentManager({
  appointments,
  services,
  userType,
  onAppointmentUpdate,
  onAppointmentDelete,
  onAppointmentCreate
}: AppointmentManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    client: '',
    clientId: '',
    service: '',
    price: 0,
    notes: ''
  })

  const handleCreateAppointment = () => {
    if (!newAppointment.date || !newAppointment.time || !newAppointment.client || !newAppointment.service) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const appointment: Omit<Appointment, 'id'> = {
      ...newAppointment,
      status: 'scheduled'
    }

    onAppointmentCreate(appointment)
    setNewAppointment({
      date: '',
      time: '',
      client: '',
      clientId: '',
      service: '',
      price: 0,
      notes: ''
    })
    setShowCreateForm(false)
  }

  const handleReschedule = (appointment: Appointment) => {
    const message = whatsappUtils.templates.rescheduleRequest(appointment)
    whatsappUtils.sendToClinic(message)
  }

  const handleConfirmAppointment = (appointment: Appointment) => {
    const message = whatsappUtils.templates.appointmentConfirmation(appointment)
    whatsappUtils.sendToClinic(message)
  }

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'rescheduled': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'Agendado'
      case 'completed': return 'Concluído'
      case 'cancelled': return 'Cancelado'
      case 'rescheduled': return 'Reagendado'
      default: return 'Desconhecido'
    }
  }

  const filteredAppointments = appointments.filter(apt => 
    selectedDate ? apt.date === selectedDate : true
  )

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-amber-600" />
          Agendamentos
        </h2>
        
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          
          {userType === 'therapist' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Consulta
            </button>
          )}
        </div>
      </div>

      {/* Formulário de criação */}
      {showCreateForm && userType === 'therapist' && (
        <div className="mb-6 p-4 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50">
          <h3 className="font-semibold text-gray-800 mb-4">Nova Consulta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <input
                type="text"
                value={newAppointment.client}
                onChange={(e) => setNewAppointment({...newAppointment, client: e.target.value})}
                placeholder="Nome do cliente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
              <select
                value={newAppointment.service}
                onChange={(e) => {
                  const selectedService = services.find(s => s.name === e.target.value)
                  setNewAppointment({
                    ...newAppointment, 
                    service: e.target.value,
                    price: selectedService?.price || 0
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Selecione um serviço</option>
                {services.map(service => (
                  <option key={service.id} value={service.name}>
                    {service.name} - R$ {service.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                placeholder="Observações sobre a consulta"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateAppointment}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Criar Consulta
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de agendamentos */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum agendamento encontrado para esta data</p>
          </div>
        ) : (
          filteredAppointments.map(appointment => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{appointment.client}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p><strong>Serviço:</strong> {appointment.service}</p>
                    <p><strong>Valor:</strong> R$ {appointment.price.toFixed(2)}</p>
                    {appointment.notes && <p><strong>Observações:</strong> {appointment.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {userType === 'client' && appointment.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => handleReschedule(appointment)}
                        className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                        title="Reagendar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleConfirmAppointment(appointment)}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        title="Enviar para WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {userType === 'therapist' && (
                    <>
                      <button
                        onClick={() => {
                          const message = whatsappUtils.templates.appointmentConfirmation(appointment)
                          whatsappUtils.sendMessage('11999999999', message) // Número do cliente
                        }}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        title="Confirmar via WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const phone = '11999999999' // Número do cliente
                          whatsappUtils.sendMessage(phone, `Olá ${appointment.client}! Ligando para confirmar sua consulta.`)
                        }}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Ligar"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingAppointment(appointment)}
                        className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
                            onAppointmentDelete(appointment.id)
                          }
                        }}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Cancelar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}