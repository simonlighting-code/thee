export function detectPlatform(url: string): string {
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
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) {
    return 'Facebook'
  }
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return 'Twitter'
  }
  if (urlLower.includes('vimeo.com')) {
    return 'Vimeo'
  }
  if (urlLower.includes('dailymotion.com')) {
    return 'Dailymotion'
  }
  if (urlLower.includes('twitch.tv')) {
    return 'Twitch'
  }
  if (urlLower.includes('reddit.com')) {
    return 'Reddit'
  }
  if (urlLower.includes('linkedin.com')) {
    return 'LinkedIn'
  }
  if (urlLower.includes('pinterest.com')) {
    return 'Pinterest'
  }
  if (urlLower.includes('snapchat.com')) {
    return 'Snapchat'
  }
  
  return 'Unknown'
}

export function getAvailableFormats(formats: any[]): any[] {
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

export function getSupportedPlatforms(): string[] {
  return [
    'YouTube',
    'Spotify', 
    'SoundCloud',
    'Instagram',
    'TikTok',
    'Facebook',
    'Twitter',
    'Vimeo',
    'Dailymotion',
    'Twitch',
    'Reddit',
    'LinkedIn',
    'Pinterest',
    'Snapchat',
    'Tumblr'
  ]
}

export function isAudioPlatform(platform: string): boolean {
  const audioPlatforms = ['Spotify', 'SoundCloud']
  return audioPlatforms.includes(platform)
}

export function isVideoPlatform(platform: string): boolean {
  const videoPlatforms = ['YouTube', 'Instagram', 'TikTok', 'Facebook', 'Twitter', 'Vimeo', 'Dailymotion', 'Twitch']
  return videoPlatforms.includes(platform)
}

export function getDefaultFormat(platform: string): string {
  if (isAudioPlatform(platform)) {
    return 'mp3'
  }
  return 'mp4'
}

export function getDefaultQuality(platform: string): string {
  if (isAudioPlatform(platform)) {
    return 'best'
  }
  return '720p'
} 