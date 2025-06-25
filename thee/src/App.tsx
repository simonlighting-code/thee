import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import DownloadForm from './components/DownloadForm'
import DownloadQueue from './components/DownloadQueue'
import Settings from './components/Settings'

function App() {
  const [activeTab, setActiveTab] = useState<'download' | 'queue' | 'settings'>('download')
  const [showCopyrightModal, setShowCopyrightModal] = useState(false)

  useEffect(() => {
    // Show copyright modal on first visit
    const hasSeenModal = localStorage.getItem('copyright-modal-seen')
    if (!hasSeenModal) {
      setShowCopyrightModal(true)
    }
  }, [])

  const handleCopyrightAccept = () => {
    localStorage.setItem('copyright-modal-seen', 'true')
    setShowCopyrightModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {activeTab === 'download' && <DownloadForm />}
            {activeTab === 'queue' && <DownloadQueue />}
            {activeTab === 'settings' && <Settings />}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Copyright Modal */}
      {showCopyrightModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚠️</span>
                <h2 className="text-xl font-bold text-secondary-900">Copyright Notice</h2>
              </div>
              <button
                onClick={() => setShowCopyrightModal(false)}
                className="p-1 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <span className="text-lg">✕</span>
              </button>
            </div>

            <div className="space-y-4 text-sm text-secondary-700">
              <p>
                <strong>Important:</strong> This application is designed for downloading content that you have the legal right to access.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">DMCA Compliance</h3>
                <ul className="space-y-1 text-yellow-700">
                  <li>• Only download content you own or have permission to download</li>
                  <li>• Respect copyright laws and intellectual property rights</li>
                  <li>• Do not download copyrighted material without authorization</li>
                  <li>• This tool is for personal, non-commercial use only</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Legal Use Cases</h3>
                <ul className="space-y-1 text-blue-700">
                  <li>• Downloading your own content from platforms</li>
                  <li>• Educational content with proper permissions</li>
                  <li>• Public domain or Creative Commons licensed content</li>
                  <li>• Content you have explicit permission to download</li>
                </ul>
              </div>

              <p className="text-xs text-secondary-500">
                By using this application, you acknowledge that you will only download content that you have the legal right to access and download.
              </p>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCopyrightModal(false)}
                className="flex-1 btn-secondary"
              >
                Decline
              </button>
              <button
                onClick={handleCopyrightAccept}
                className="flex-1 btn-primary"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>✓</span>
                  <span>I Understand & Accept</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App 