import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DownloadQueue: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'downloading' | 'completed' | 'error'>('all')
  
  // Mock download data
  const mockDownloads = [
    {
      id: '1',
      url: 'https://youtube.com/watch?v=sample1',
      title: 'Sample YouTube Video 1',
      platform: 'YouTube',
      format: 'mp4',
      quality: '720p',
      status: 'downloading' as const,
      progress: 45,
      size: '28.7 MB',
      duration: '3:45',
      thumbnail: 'https://via.placeholder.com/320x180/3b82f6/ffffff?text=Video+1',
      createdAt: new Date(Date.now() - 1000000)
    },
    {
      id: '2',
      url: 'https://spotify.com/track/sample2',
      title: 'Sample Spotify Track',
      platform: 'Spotify',
      format: 'mp3',
      quality: '320kbps',
      status: 'completed' as const,
      progress: 100,
      size: '8.9 MB',
      duration: '2:30',
      thumbnail: 'https://via.placeholder.com/320x180/1db954/ffffff?text=Audio+1',
      createdAt: new Date(Date.now() - 2000000),
      completedAt: new Date(Date.now() - 500000)
    },
    {
      id: '3',
      url: 'https://instagram.com/p/sample3',
      title: 'Sample Instagram Video',
      platform: 'Instagram',
      format: 'mp4',
      quality: '480p',
      status: 'error' as const,
      progress: 0,
      size: '15.2 MB',
      duration: '1:15',
      thumbnail: 'https://via.placeholder.com/320x180/e4405f/ffffff?text=Video+2',
      error: 'Network timeout',
      createdAt: new Date(Date.now() - 3000000)
    }
  ]

  const filteredDownloads = mockDownloads.filter(download => {
    if (filter === 'all') return true
    return download.status === filter
  })

  const handleRemove = (id: string) => {
    alert(`Download ${id} removed from queue`)
  }

  const handleClearCompleted = () => {
    alert('Completed downloads cleared')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="w-5 h-5 text-green-500">✓</span>
      case 'error':
        return <span className="w-5 h-5 text-red-500">✗</span>
      case 'downloading':
        return <span className="w-5 h-5 text-blue-500 animate-bounce">↓</span>
      case 'paused':
        return <span className="w-5 h-5 text-yellow-500">⏸</span>
      default:
        return <span className="w-5 h-5 text-secondary-400">⏱</span>
    }
  }

  const getFormatIcon = (format: string) => {
    if (format.includes('audio') || format.includes('mp3') || format.includes('aac')) {
      return <span className="w-4 h-4 text-purple-500">🎵</span>
    }
    return <span className="w-4 h-4 text-blue-500">🎬</span>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'downloading':
        return 'bg-blue-100 text-blue-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-secondary-100 text-secondary-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Download Queue</h2>
          <p className="text-secondary-600">
            {mockDownloads.length} total • {mockDownloads.filter(d => d.status === 'downloading').length}/5 active
          </p>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="input-field w-auto"
          >
            <option value="all">All Downloads</option>
            <option value="downloading">Downloading</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
          </select>
          
          {mockDownloads.some(d => d.status === 'completed') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearCompleted}
              className="btn-secondary"
            >
              Clear Completed
            </motion.button>
          )}
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: mockDownloads.length, color: 'bg-secondary-500' },
          { label: 'Downloading', count: mockDownloads.filter(d => d.status === 'downloading').length, color: 'bg-blue-500' },
          { label: 'Completed', count: mockDownloads.filter(d => d.status === 'completed').length, color: 'bg-green-500' },
          { label: 'Error', count: mockDownloads.filter(d => d.status === 'error').length, color: 'bg-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stat.count}</p>
                <p className="text-sm text-secondary-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Downloads List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredDownloads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-12 h-12 mx-auto text-secondary-400 mb-4">📥</div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No downloads</h3>
              <p className="text-secondary-600">
                {filter === 'all' 
                  ? 'Start downloading videos to see them here'
                  : `No ${filter} downloads found`
                }
              </p>
            </motion.div>
          ) : (
            filteredDownloads.map((download) => (
              <motion.div
                key={download.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* Thumbnail */}
                  {download.thumbnail && (
                    <img
                      src={download.thumbnail}
                      alt={download.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-secondary-900 truncate">
                          {download.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-secondary-600">
                          <span className="flex items-center space-x-1">
                            {getFormatIcon(download.format)}
                            <span>{download.format.toUpperCase()}</span>
                          </span>
                          <span>{download.quality}</span>
                          <span>{download.platform}</span>
                          {download.duration && <span>{download.duration}</span>}
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(download.status)}`}>
                          {download.status}
                        </span>
                        {getStatusIcon(download.status)}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {download.status === 'downloading' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-secondary-600 mb-1">
                          <span>{download.progress}%</span>
                          <span>{download.size}</span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                          <motion.div
                            className="bg-primary-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${download.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {download.status === 'error' && download.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        {download.error}
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-secondary-500">
                        Added {download.createdAt.toLocaleString()}
                        {download.completedAt && (
                          <span> • Completed {download.completedAt.toLocaleString()}</span>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemove(download.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DownloadQueue 