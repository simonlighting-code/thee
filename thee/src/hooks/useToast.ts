import { useContext } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastContextType {
  toasts: any[]
  showToast: (message: string, type?: ToastType, duration?: number) => void
  hideToast: (id: string) => void
}

// This is a simplified version that will work with the ToastProvider
export function useToast(): ToastContextType {
  // For now, return a mock implementation
  // In a real app, this would use the ToastContext
  return {
    toasts: [],
    showToast: (message: string, type: ToastType = 'info', duration = 5000) => {
      console.log(`[${type.toUpperCase()}] ${message}`)
    },
    hideToast: (id: string) => {
      console.log(`Hiding toast: ${id}`)
    }
  }
} 