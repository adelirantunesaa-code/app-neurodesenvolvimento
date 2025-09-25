import { WhatsAppMessage, Appointment, Invoice } from './types'

// Número do WhatsApp da clínica (substitua pelo número real)
const CLINIC_WHATSAPP = '5511999999999'

export const whatsappUtils = {
  // Enviar mensagem direta para WhatsApp
  sendMessage: (phone: string, message: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  },

  // Enviar mensagem para a clínica
  sendToClinic: (message: string) => {
    const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  },

  // Templates de mensagens
  templates: {
    appointmentConfirmation: (appointment: Appointment) => 
      `🏥 *Caramelo Neurodesenvolvimento*\n\n` +
      `Olá! Confirmando sua consulta:\n\n` +
      `📅 *Data:* ${formatDate(appointment.date)}\n` +
      `⏰ *Horário:* ${appointment.time}\n` +
      `👩‍⚕️ *Serviço:* ${appointment.service}\n\n` +
      `Qualquer dúvida, entre em contato conosco!`,

    appointmentReminder: (appointment: Appointment) =>
      `🔔 *Lembrete - Caramelo Neuro*\n\n` +
      `Sua consulta é amanhã!\n\n` +
      `📅 ${formatDate(appointment.date)} às ${appointment.time}\n` +
      `👩‍⚕️ ${appointment.service}\n\n` +
      `Nos vemos em breve! 😊`,

    rescheduleRequest: (appointment: Appointment) =>
      `📞 *Solicitação de Reagendamento*\n\n` +
      `Gostaria de reagendar minha consulta:\n\n` +
      `📅 Data atual: ${formatDate(appointment.date)}\n` +
      `⏰ Horário atual: ${appointment.time}\n` +
      `👩‍⚕️ Serviço: ${appointment.service}\n\n` +
      `Por favor, me informe os horários disponíveis. Obrigado!`,

    invoiceReminder: (invoice: Invoice) =>
      `💰 *Lembrete de Pagamento*\n\n` +
      `Você tem uma fatura pendente:\n\n` +
      `📋 ${invoice.description}\n` +
      `💵 Valor: R$ ${invoice.amount.toFixed(2)}\n` +
      `📅 Vencimento: ${formatDate(invoice.dueDate)}\n\n` +
      `Para quitar, entre em contato conosco!`,

    paymentConfirmation: (invoice: Invoice) =>
      `✅ *Pagamento Confirmado*\n\n` +
      `Recebemos seu pagamento:\n\n` +
      `📋 ${invoice.description}\n` +
      `💵 Valor: R$ ${invoice.amount.toFixed(2)}\n` +
      `📅 Data: ${formatDate(invoice.date)}\n\n` +
      `Obrigado pela confiança! 🙏`,

    welcomeMessage: (clientName: string) =>
      `🎉 *Bem-vindo à Caramelo Neuro!*\n\n` +
      `Olá ${clientName}!\n\n` +
      `Seja bem-vindo(a) à nossa clínica de neurodesenvolvimento. ` +
      `Estamos aqui para cuidar de você com todo carinho e profissionalismo.\n\n` +
      `📱 Use nosso app para:\n` +
      `• Ver suas consultas\n` +
      `• Acompanhar faturas\n` +
      `• Reagendar atendimentos\n` +
      `• Receber lembretes\n\n` +
      `Qualquer dúvida, estamos aqui! 😊`,

    therapistNotification: (message: string) =>
      `🏥 *Caramelo Neuro - Sistema*\n\n${message}`,
  }
}

// Função auxiliar para formatar datas
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Função para validar número de telefone brasileiro
export function validateBrazilianPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length >= 10 && cleanPhone.length <= 11
}

// Função para formatar número de telefone
export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`
  } else if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`
  }
  
  return phone
}

// Integração com API do WhatsApp Business (para implementação futura)
export const whatsappAPI = {
  // Configuração da API (substitua pelas suas credenciais)
  config: {
    apiUrl: process.env.WHATSAPP_API_URL || '',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  },

  // Enviar mensagem via API (implementação futura)
  sendMessageAPI: async (to: string, message: string) => {
    // Implementar integração com WhatsApp Business API
    console.log('Enviando mensagem via API:', { to, message })
    
    // Exemplo de implementação:
    /*
    try {
      const response = await fetch(`${config.apiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw error
    }
    */
  },

  // Webhook para receber mensagens (implementação futura)
  handleWebhook: (data: any) => {
    console.log('Webhook recebido:', data)
    // Implementar lógica para processar mensagens recebidas
  }
}