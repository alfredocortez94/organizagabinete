
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR })
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch (error) {
    console.error("Error formatting date time:", error)
    return dateString
  }
}

export function formatDateForInput(dateString: string): string {
  try {
    return format(parseISO(dateString), "yyyy-MM-dd")
  } catch (error) {
    console.error("Error formatting date for input:", error)
    return dateString
  }
}

export function validateCPF(cpf: string): boolean {
  // Remove non-numeric characters
  cpf = cpf.replace(/[^\d]/g, "")
  
  // Check if length is 11
  if (cpf.length !== 11) return false
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cpf)) return false
  
  // Validate first verification digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.charAt(9))) return false
  
  // Validate second verification digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.charAt(10))) return false
  
  return true
}

export function formatCPF(cpf: string): string {
  // Remove non-numeric characters
  cpf = cpf.replace(/[^\d]/g, "")
  
  // Format as XXX.XXX.XXX-XX
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export function formatPhone(phone: string): string {
  // Remove non-numeric characters
  phone = phone.replace(/[^\d]/g, "")
  
  // Format as (XX) XXXXX-XXXX
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}

export function generateQRCodeUrl(ticketCode: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketCode}`
}
