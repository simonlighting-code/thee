const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const { RateLimiterMemory } = require('rate-limiter-flexible')
const WebSocket = require('ws')
const path = require('path')
const { spawn } = require('child_process')

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
})

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip)
    next()
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many requests' })
  }
})

// Middleware
app.use(compression())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://theedownloader.com'] 
    : ['http://localhost:3000'],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ noServer: true })

wss.on('connection', (ws) => {
  console.log('WebSocket client connected')
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      console.log('Received:', data)
      
      // Handle different message types
      switch (data.type) {
        case 'download_progress':
          // Broadcast progress to all clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(data))
            }
          })
          break
        case 'download_complete':
          // Handle download completion
          break
        default:
          console.log('Unknown message type:', data.type)
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
    }
  })
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected')
  })
})

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Get video info
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }
    
    // Validate URL
    const urlPattern = /^https?:\/\/.+/i
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid URL format' })
    }
    
    // Use yt-dlp to get video info
    const ytDlpProcess = spawn('yt-dlp', [
      '--dump-json',
      '--no-playlist',
      url
    ])
    
    let output = ''
    let error = ''
    
    ytDlpProcess.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    ytDlpProcess.stderr.on('data', (data) => {
      error += data.toString()
    })
    
    ytDlpProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const videoInfo = JSON.parse(output)
          res.json({
            success: true,
            data: {
              title: videoInfo.title,
              duration: videoInfo.duration_string,
              thumbnail: videoInfo.thumbnail,
              formats: videoInfo.formats.map(format => ({
                format_id: format.format_id,
                ext: format.ext,
                resolution: format.resolution,
                filesize: format.filesize,
                vcodec: format.vcodec,
                acodec: format.acodec
              })),
              platform: detectPlatform(url)
            }
          })
        } catch (parseError) {
          res.status(500).json({ error: 'Failed to parse video info' })
        }
      } else {
        res.status(500).json({ 
          error: 'Failed to analyze video',
          details: error
        })
      }
    })
    
  } catch (error) {
    console.error('Analyze error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Start download
app.post('/api/download', async (req, res) => {
  try {
    const { url, format, quality } = req.body
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }
    
    // Generate unique download ID
    const downloadId = generateDownloadId()
    
    // Start download process
    const downloadProcess = spawn('yt-dlp', [
      '-f', `${format}+bestaudio/best`,
      '-o', `downloads/${downloadId}.%(ext)s`,
      '--progress',
      url
    ])
    
    let progress = 0
    
    downloadProcess.stderr.on('data', (data) => {
      const output = data.toString()
      
      // Parse progress from yt-dlp output
      const progressMatch = output.match(/(\d+\.?\d*)%/)
      if (progressMatch) {
        progress = parseFloat(progressMatch[1])
        
        // Send progress via WebSocket
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'download_progress',
              downloadId,
              progress
            }))
          }
        })
      }
    })
    
    downloadProcess.on('close', (code) => {
      if (code === 0) {
        // Download completed
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'download_complete',
              downloadId,
              success: true
            }))
          }
        })
      } else {
        // Download failed
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'download_complete',
              downloadId,
              success: false,
              error: 'Download failed'
            }))
          }
        })
      }
    })
    
    res.json({ 
      success: true, 
      downloadId,
      message: 'Download started'
    })
    
  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get download status
app.get('/api/download/:id/status', (req, res) => {
  const { id } = req.params
  
  // In a real app, you'd store download status in a database
  // For now, return mock status
  res.json({
    downloadId: id,
    status: 'downloading',
    progress: Math.floor(Math.random() * 100)
  })
})

// Batch download
app.post('/api/download/batch', async (req, res) => {
  try {
    const { urls, format, quality } = req.body
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'URLs array is required' })
    }
    
    const batchId = generateDownloadId()
    const downloadPromises = urls.map((url, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate batch download
          resolve({ url, index, success: true })
        }, index * 1000) // Stagger downloads
      })
    })
    
    Promise.all(downloadPromises).then((results) => {
      res.json({
        success: true,
        batchId,
        results,
        message: `Started batch download of ${urls.length} items`
      })
    })
    
  } catch (error) {
    console.error('Batch download error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Anti-block system endpoints
app.get('/api/proxy/rotate', (req, res) => {
  const proxies = [
    'https://proxy1.theedownloader.com',
    'https://proxy2.theedownloader.com',
    'https://proxy3.theedownloader.com',
    'https://proxy4.theedownloader.com',
    'https://proxy5.theedownloader.com'
  ]
  
  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)]
  res.json({ proxy: randomProxy })
})

app.get('/api/user-agent/rotate', (req, res) => {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0'
  ]
  
  const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)]
  res.json({ userAgent: randomUA })
})

// Utility functions
function detectPlatform(url) {
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

function generateDownloadId() {
  return 'dl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`🚀 Thee Downloader Server running on port ${PORT}`)
  console.log(`📡 WebSocket server ready`)
  console.log(`🔒 Rate limiting enabled`)
  console.log(`🛡️ Security headers configured`)
})

// Attach WebSocket server to HTTP server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request)
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

module.exports = app 