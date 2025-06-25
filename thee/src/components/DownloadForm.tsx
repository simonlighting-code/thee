import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DownloadForm: React.FC = () => {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [videoInfo, setVideoInfo] = useState<any>(null)
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedQuality, setSelectedQuality] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [batchUrls, setBatchUrls] = useState<string[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const detectPlatform = (url: string): string => {
    const urlLower = url.toLowerCase()
    
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
      return 'YouTube'
    }
    if (urlLower.includes('spotify.com')) {
      return 'Spotify'
    }
    if (urlLower.includes('soundcloud.com')) {
      return 'SoundCloud'
    }
    if (urlLower.includes('instagram.com')) {
      return 'Instagram'
    }
    if (urlLower.includes('tiktok.com')) {
      return 'TikTok'
    }
    
    return 'Unknown'
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    if (videoInfo) {
      setVideoInfo(null)
      setSelectedFormat('')
      setSelectedQuality('')
    }
  }

  const handleAnalyze = async () => {
    if (!url.trim()) {
      alert('Please enter a valid URL')
      return
    }

    setIsAnalyzing(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const platform = detectPlatform(url)
      const mockInfo = {
        title: `Sample ${platform} Video - ${Date.now()}`,
        duration: '3:45',
        thumbnail: 'https://via.placeholder.com/320x180/3b82f6/ffffff?text=Video+Thumbnail',
        platform,
        formats: [
          { format: 'mp4', quality: '1080p', filesize: '45.2 MB', description: 'High Quality Video' },
          { format: 'mp4', quality: '720p', filesize: '28.7 MB', description: 'Standard Quality Video' },
          { format: 'mp4', quality: '480p', filesize: '18.3 MB', description: 'Medium Quality Video' },
          { format: 'mp3', quality: '320kbps', filesize: '8.9 MB', description: 'High Quality Audio' },
          { format: 'mp3', quality: '192kbps', filesize: '5.4 MB', description: 'Standard Quality Audio' },
          { format: 'aac', quality: '256kbps', filesize: '7.2 MB', description: 'AAC Audio Format' },
          { format: 'opus', quality: '128kbps', filesize: '3.8 MB', description: 'Opus Audio Format' },
          { format: 'webm', quality: '720p', filesize: '22.1 MB', description: 'WebM Video Format' },
          { format: 'm4a', quality: '256kbps', filesize: '6.8 MB', description: 'M4A Audio Format' },
          { format: 'flv', quality: '480p', filesize: '15.6 MB', description: 'FLV Video Format' },
          { format: '3gp', quality: '360p', filesize: '12.3 MB', description: '3GP Mobile Format' },
          { format: 'wav', quality: '44.1kHz', filesize: '25.7 MB', description: 'WAV Audio Format' }
        ]
      }
      
      setVideoInfo(mockInfo)
      setSelectedFormat(mockInfo.formats[0]?.format || '')
      setSelectedQuality(mockInfo.formats[0]?.quality || '')
      
      alert(`Analyzed ${platform} video successfully`)
    } catch (error) {
      alert('Failed to analyze video. Please check the URL.')
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDownload = async () => {
    if (!videoInfo || !selectedFormat || !selectedQuality) {
      alert('Please analyze the video and select format/quality')
      return
    }

    try {
      const platform = detectPlatform(url)
      
      alert(`Download started for ${platform} video in ${selectedFormat} format at ${selectedQuality} quality`)
      
      // Reset form
      setUrl('')
      setVideoInfo(null)
      setSelectedFormat('')
      setSelectedQuality('')
    } catch (error) {
      alert('Failed to start download')
      console.error('Download error:', error)
    }
  }

  const handleBatchDownload = async () => {
    if (batchUrls.length === 0) {
      alert('Please add URLs to batch download')
      return
    }

    alert(`Started batch download of ${batchUrls.length} items`)
    setBatchUrls([])
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedUrls = Array.from(e.dataTransfer.files)
      .filter(file => file.type === 'text/plain')
      .map(file => file.name)
    
    if (droppedUrls.length > 0) {
      setBatchUrls(prev => [...prev, ...droppedUrls])
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const urls = Array.from(files)
        .filter(file => file.type === 'text/plain')
        .map(file => file.name)
      setBatchUrls(prev => [...prev, ...urls])
    }
  }

  const getAvailableFormats = (formats: any[]): any[] => {
    const uniqueFormats = new Map()
    
    formats.forEach(format => {
      if (!uniqueFormats.has(format.format)) {
        uniqueFormats.set(format.format, {
          format: format.format,
          description: format.description || `${format.format.toUpperCase()} format`,
          quality: format.quality,
          filesize: format.filesize
        })
      }
    })
    
    return Array.from(uniqueFormats.values())
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold text-gradient">
          Download Videos & Music from 15+ Platforms
        </h2>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Lightning-fast downloads with smart format detection. Support for YouTube, Spotify, 
          SoundCloud, Instagram, TikTok and many more platforms.
        </p>
        
        {/* Platform Icons */}
        <div className="flex justify-center space-x-4 mt-6">
          {['YouTube', 'Spotify', 'SoundCloud', 'Instagram', 'TikTok'].map((platform) => (
            <motion.div
              key={platform}
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center"
            >
              <span className="text-xs font-medium text-secondary-700">{platform}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Download Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        {/* URL Input */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="Paste video URL here (YouTube, Spotify, SoundCloud, etc.)"
                className="input-field"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing || !url.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Analyze</span>
                </div>
              )}
            </motion.button>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-secondary-300 hover:border-secondary-400'
            }`}
          >
            <div className="w-8 h-8 mx-auto mb-2 text-secondary-400">📁</div>
            <p className="text-secondary-600">
              Drag & drop URL files here or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                browse files
              </button>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.url"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Video Info & Format Selection */}
        <AnimatePresence>
          {videoInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-lg">
                {videoInfo.thumbnail && (
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-secondary-900">{videoInfo.title}</h3>
                  <p className="text-sm text-secondary-600">
                    Duration: {videoInfo.duration} • Platform: {videoInfo.platform}
                  </p>
                </div>
              </div>

              {/* Format Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Format
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select format</option>
                    {getAvailableFormats(videoInfo.formats).map((format) => (
                      <option key={format.format} value={format.format}>
                        {format.format.toUpperCase()} - {format.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Quality
                  </label>
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="input-field"
                    disabled={!selectedFormat}
                  >
                    <option value="">Select quality</option>
                    {videoInfo.formats
                      .filter((f: any) => f.format === selectedFormat)
                      .map((format: any) => (
                        <option key={format.quality} value={format.quality}>
                          {format.quality} ({format.filesize})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Download Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                disabled={!selectedFormat || !selectedQuality}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Start Download</span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Batch Download Section */}
      {batchUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4">Batch Download ({batchUrls.length} URLs)</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {batchUrls.map((url, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                <span className="text-sm text-secondary-700 truncate">{url}</span>
                <button
                  onClick={() => setBatchUrls(prev => prev.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBatchDownload}
            className="w-full btn-primary mt-4"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>Start Batch Download</span>
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default DownloadForm 