/**
 * WhatsApp reminder - generates wa.me link with pre-filled message
 * Opens WhatsApp (web or app) - no API required, no cost
 * Phone format: remove spaces/dashes, use country code (e.g. 919876543210 for India)
 */
export function getWhatsAppReminderLink(phone, customerName, date, time) {
  const cleanPhone = phone.replace(/\D/g, '')
  const message = encodeURIComponent(
    `Hi ${customerName}! This is a reminder for your appointment on ${date} at ${time}. Please confirm or reschedule if needed.`
  )
  return `https://wa.me/${cleanPhone}?text=${message}`
}
