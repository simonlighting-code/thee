import React from 'react'
import { motion } from 'framer-motion'

interface HeaderProps {
  activeTab: 'download' | 'queue' | 'settings'
  onTabChange: (tab: 'download' | 'queue' | 'settings') => void
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'download', label: 'Download', icon: '📥' },
    { id: 'queue', label: 'Queue', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ] as const

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">⚡</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Thee Downloader</h1>
              <p className="text-xs text-secondary-500">Advanced Video & Music Downloader</p>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              )
            })}
          </nav>

          {/* Performance Indicator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-2 text-sm text-secondary-600"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>3x Faster</span>
          </motion.div>
        </div>
      </div>
    </header>
  )
}

export default Header 