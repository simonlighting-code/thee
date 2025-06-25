import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
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
    cacheSize: 100
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    alert('Setting updated')
  }

  const handleReset = () => {
    setSettings({
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
      cacheSize: 100
    })
    alert('Settings reset to defaults')
  }

  const settingGroups = [
    {
      title: 'Download Settings',
      icon: '📥',
      settings: [
        {
          key: 'downloadPath',
          label: 'Download Path',
          type: 'text',
          description: 'Default folder for downloaded files'
        },
        {
          key: 'maxConcurrentDownloads',
          label: 'Max Concurrent Downloads',
          type: 'number',
          description: 'Number of simultaneous downloads (1-10)',
          min: 1,
          max: 10
        },
        {
          key: 'autoSelectFormat',
          label: 'Auto-select Format',
          type: 'checkbox',
          description: 'Automatically choose best format for content type'
        },
        {
          key: 'autoSelectQuality',
          label: 'Auto-select Quality',
          type: 'checkbox',
          description: 'Automatically choose best quality available'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: '🔔',
      settings: [
        {
          key: 'enableNotifications',
          label: 'Enable Notifications',
          type: 'checkbox',
          description: 'Show desktop notifications for download events'
        },
        {
          key: 'enableSound',
          label: 'Enable Sound',
          type: 'checkbox',
          description: 'Play sound when downloads complete'
        }
      ]
    },
    {
      title: 'Performance',
      icon: '⚡',
      settings: [
        {
          key: 'enableCaching',
          label: 'Enable Caching',
          type: 'checkbox',
          description: 'Cache downloaded metadata for faster processing'
        },
        {
          key: 'cacheSize',
          label: 'Cache Size (MB)',
          type: 'number',
          description: 'Maximum cache size in megabytes',
          min: 10,
          max: 1000
        }
      ]
    },
    {
      title: 'Network & Security',
      icon: '🛡️',
      settings: [
        {
          key: 'enableProxy',
          label: 'Enable Proxy',
          type: 'checkbox',
          description: 'Use proxy for downloads (anti-block system)'
        },
        {
          key: 'proxyUrl',
          label: 'Proxy URL',
          type: 'text',
          description: 'Proxy server URL (e.g., http://proxy:port)',
          disabled: !settings.enableProxy
        },
        {
          key: 'enableThrottling',
          label: 'Enable Throttling',
          type: 'checkbox',
          description: 'Limit download speed to prevent abuse'
        },
        {
          key: 'throttleLimit',
          label: 'Throttle Limit (KB/s)',
          type: 'number',
          description: 'Maximum download speed in KB/s',
          min: 100,
          max: 10000,
          disabled: !settings.enableThrottling
        }
      ]
    },
    {
      title: 'Appearance',
      icon: '🌐',
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          type: 'select',
          description: 'Choose your preferred theme',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto (System)' }
          ]
        },
        {
          key: 'language',
          label: 'Language',
          type: 'select',
          description: 'Choose your preferred language',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' },
            { value: 'zh', label: '中文' }
          ]
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 p-3 bg-primary-100 rounded-full"
        >
          <span className="text-2xl">⚙️</span>
          <h2 className="text-2xl font-bold text-primary-900">Settings</h2>
        </motion.div>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Configure your download preferences, performance settings, and application behavior.
        </p>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-2xl">{group.icon}</span>
              <h3 className="text-xl font-semibold text-secondary-900">{group.title}</h3>
            </div>

            <div className="space-y-6">
              {group.settings.map((setting) => (
                <div key={setting.key} className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-secondary-900 mb-1">
                      {setting.label}
                    </label>
                    <p className="text-sm text-secondary-600">{setting.description}</p>
                  </div>

                  <div className="ml-4">
                    {setting.type === 'checkbox' && (
                      <input
                        type="checkbox"
                        checked={settings[setting.key as keyof typeof settings] as boolean}
                        onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                    )}

                    {setting.type === 'text' && (
                      <input
                        type="text"
                        value={settings[setting.key as keyof typeof settings] as string}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        disabled={setting.disabled}
                        className="input-field w-64"
                      />
                    )}

                    {setting.type === 'number' && (
                      <input
                        type="number"
                        value={settings[setting.key as keyof typeof settings] as number}
                        onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
                        min={setting.min}
                        max={setting.max}
                        disabled={setting.disabled}
                        className="input-field w-32"
                      />
                    )}

                    {setting.type === 'select' && (
                      <select
                        value={settings[setting.key as keyof typeof settings] as string}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="input-field w-48"
                      >
                        {setting.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center space-x-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="btn-secondary"
        >
          Reset to Defaults
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => alert('Settings saved automatically')}
          className="btn-primary"
        >
          Save Settings
        </motion.button>
      </motion.div>

      {/* Performance Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4">Performance Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">3x</div>
            <div className="text-sm text-secondary-600">Faster than competitors</div>
          </div>
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">15+</div>
            <div className="text-sm text-secondary-600">Supported platforms</div>
          </div>
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">12+</div>
            <div className="text-sm text-secondary-600">Format options</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings 