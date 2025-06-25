import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'

export interface Settings {
  downloadPath: string
  maxConcurrentDownloads: number
  autoSelectFormat: boolean
  autoSelectQuality: boolean
  enableNotifications: boolean
  enableSound: boolean
  theme: 'light' | 'dark' | 'auto'
  language: string
  enableProxy: boolean
  proxyUrl: string
  enableThrottling: boolean
  throttleLimit: number
  enableCaching: boolean
  cacheSize: number
}

interface SettingsState {
  settings: Settings
  isLoaded: boolean
}

type SettingsAction =
  | { type: 'LOAD_SETTINGS'; payload: Settings }
  | { type: 'UPDATE_SETTING'; payload: { key: keyof Settings; value: any } }
  | { type: 'RESET_SETTINGS' }
  | { type: 'SET_LOADED'; payload: boolean }

const defaultSettings: Settings = {
  downloadPath: 'downloads',
  maxConcurrentDownloads: 5,
  autoSelectFormat: true,
  autoSelectQuality: true,
  enableNotifications: true,
  enableSound: true,
  theme: 'auto',
  language: 'en',
  enableProxy: false,
  proxyUrl: '',
  enableThrottling: true,
  throttleLimit: 1000,
  enableCaching: true,
  cacheSize: 100,
}

const initialState: SettingsState = {
  settings: defaultSettings,
  isLoaded: false,
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'LOAD_SETTINGS':
      return {
        ...state,
        settings: { ...defaultSettings, ...action.payload },
        isLoaded: true,
      }
    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value,
        },
      }
    case 'RESET_SETTINGS':
      return {
        ...state,
        settings: defaultSettings,
      }
    case 'SET_LOADED':
      return {
        ...state,
        isLoaded: action.payload,
      }
    default:
      return state
  }
}

interface SettingsContextType {
  state: SettingsState
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  resetSettings: () => void
  loadSettings: () => void
  saveSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState)

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('thee-downloader-settings')
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        dispatch({ type: 'LOAD_SETTINGS', payload: parsedSettings })
      } else {
        dispatch({ type: 'LOAD_SETTINGS', payload: defaultSettings })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      dispatch({ type: 'LOAD_SETTINGS', payload: defaultSettings })
    }
  }

  const saveSettings = () => {
    try {
      localStorage.setItem('thee-downloader-settings', JSON.stringify(state.settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    dispatch({ type: 'UPDATE_SETTING', payload: { key, value } })
  }

  const resetSettings = () => {
    dispatch({ type: 'RESET_SETTINGS' })
  }

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (state.isLoaded) {
      saveSettings()
    }
  }, [state.settings, state.isLoaded])

  const value: SettingsContextType = {
    state,
    updateSetting,
    resetSettings,
    loadSettings,
    saveSettings,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
} 