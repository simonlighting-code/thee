import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface DownloadItem {
  id: string
  url: string
  title: string
  platform: string
  format: string
  quality: string
  status: 'pending' | 'downloading' | 'completed' | 'error' | 'paused'
  progress: number
  size?: string
  duration?: string
  thumbnail?: string
  error?: string
  createdAt: Date
  completedAt?: Date
}

interface DownloadState {
  downloads: DownloadItem[]
  isProcessing: boolean
  concurrentDownloads: number
  maxConcurrentDownloads: number
}

type DownloadAction =
  | { type: 'ADD_DOWNLOAD'; payload: DownloadItem }
  | { type: 'UPDATE_DOWNLOAD'; payload: { id: string; updates: Partial<DownloadItem> } }
  | { type: 'REMOVE_DOWNLOAD'; payload: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_CONCURRENT_DOWNLOADS'; payload: number }

const initialState: DownloadState = {
  downloads: [],
  isProcessing: false,
  concurrentDownloads: 0,
  maxConcurrentDownloads: 5,
}

function downloadReducer(state: DownloadState, action: DownloadAction): DownloadState {
  switch (action.type) {
    case 'ADD_DOWNLOAD':
      return {
        ...state,
        downloads: [...state.downloads, action.payload],
      }
    case 'UPDATE_DOWNLOAD':
      return {
        ...state,
        downloads: state.downloads.map(download =>
          download.id === action.payload.id
            ? { ...download, ...action.payload.updates }
            : download
        ),
      }
    case 'REMOVE_DOWNLOAD':
      return {
        ...state,
        downloads: state.downloads.filter(download => download.id !== action.payload),
      }
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        downloads: state.downloads.filter(download => download.status !== 'completed'),
      }
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
      }
    case 'SET_CONCURRENT_DOWNLOADS':
      return {
        ...state,
        concurrentDownloads: action.payload,
      }
    default:
      return state
  }
}

interface DownloadContextType {
  state: DownloadState
  addDownload: (download: Omit<DownloadItem, 'id' | 'createdAt'>) => void
  updateDownload: (id: string, updates: Partial<DownloadItem>) => void
  removeDownload: (id: string) => void
  clearCompleted: () => void
  setProcessing: (processing: boolean) => void
  setConcurrentDownloads: (count: number) => void
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined)

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(downloadReducer, initialState)

  const addDownload = (download: Omit<DownloadItem, 'id' | 'createdAt'>) => {
    const newDownload: DownloadItem = {
      ...download,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    dispatch({ type: 'ADD_DOWNLOAD', payload: newDownload })
  }

  const updateDownload = (id: string, updates: Partial<DownloadItem>) => {
    dispatch({ type: 'UPDATE_DOWNLOAD', payload: { id, updates } })
  }

  const removeDownload = (id: string) => {
    dispatch({ type: 'REMOVE_DOWNLOAD', payload: id })
  }

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' })
  }

  const setProcessing = (processing: boolean) => {
    dispatch({ type: 'SET_PROCESSING', payload: processing })
  }

  const setConcurrentDownloads = (count: number) => {
    dispatch({ type: 'SET_CONCURRENT_DOWNLOADS', payload: count })
  }

  const value: DownloadContextType = {
    state,
    addDownload,
    updateDownload,
    removeDownload,
    clearCompleted,
    setProcessing,
    setConcurrentDownloads,
  }

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  )
}

export function useDownload() {
  const context = useContext(DownloadContext)
  if (context === undefined) {
    throw new Error('useDownload must be used within a DownloadProvider')
  }
  return context
} 