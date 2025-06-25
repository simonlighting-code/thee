import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, X } from 'lucide-react'

interface CopyrightModalProps {
  isOpen: boolean
  onAccept: () => void
  onClose: () => void
}

const CopyrightModal: React.FC<CopyrightModalProps> = ({ isOpen, onAccept, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-secondary-900">Copyright Notice</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-secondary-500" />
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
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                className="flex-1 btn-primary"
              >
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>I Understand & Accept</span>
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CopyrightModal 