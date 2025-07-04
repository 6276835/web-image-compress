import React from 'react'
import { Settings, Zap, Download } from 'lucide-react'

function CompressionSettings({ settings, onSettingsChange, onCompressAll, compressedCount, totalCount }) {
  const handleQualityChange = (value) => {
    onSettingsChange({ ...settings, quality: parseFloat(value) })
  }

  const handleMaxWidthChange = (value) => {
    onSettingsChange({ ...settings, maxWidth: parseInt(value) })
  }

  const handleMaxHeightChange = (value) => {
    onSettingsChange({ ...settings, maxHeight: parseInt(value) })
  }

  const handleWebWorkerChange = (checked) => {
    onSettingsChange({ ...settings, useWebWorker: checked })
  }

  const getQualityLabel = (quality) => {
    if (quality >= 0.9) return '高质量'
    if (quality >= 0.7) return '平衡'
    if (quality >= 0.5) return '压缩'
    return '高压缩'
  }

  const getQualityColor = (quality) => {
    if (quality >= 0.9) return 'text-apple-green'
    if (quality >= 0.7) return 'text-apple-blue'
    if (quality >= 0.5) return 'text-apple-orange'
    return 'text-apple-red'
  }

  return (
    <div className="apple-card p-6 bg-white/60 backdrop-blur-glass border border-white/30 rounded-2xl shadow-apple-glass">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-apple-gray-600" />
          <h3 className="text-lg font-semibold text-apple-gray-900">压缩设置</h3>
        </div>
        
        <button
          onClick={onCompressAll}
          disabled={compressedCount === totalCount}
          className="apple-button-primary inline-flex items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <Zap className="w-4 h-4" />
          压缩全部 ({compressedCount}/{totalCount})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 质量设置 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-apple-gray-700">
            压缩质量
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.quality}
              onChange={(e) => handleQualityChange(e.target.value)}
              className="w-full h-2 bg-apple-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-apple-gray-500">
              <span>高压缩</span>
              <span>高质量</span>
            </div>
            <div className={`text-sm font-medium ${getQualityColor(settings.quality)}`}>
              {getQualityLabel(settings.quality)} ({Math.round(settings.quality * 100)}%)
            </div>
          </div>
        </div>

        {/* 最大宽度 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-apple-gray-700">
            最大宽度
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="800"
              max="3840"
              step="160"
              value={settings.maxWidth}
              onChange={(e) => handleMaxWidthChange(e.target.value)}
              className="w-full h-2 bg-apple-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-apple-gray-500">
              <span>800px</span>
              <span>3840px</span>
            </div>
            <div className="text-sm font-medium text-apple-blue">
              {settings.maxWidth}px
            </div>
          </div>
        </div>

        {/* 最大高度 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-apple-gray-700">
            最大高度
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="600"
              max="2160"
              step="120"
              value={settings.maxHeight}
              onChange={(e) => handleMaxHeightChange(e.target.value)}
              className="w-full h-2 bg-apple-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-apple-gray-500">
              <span>600px</span>
              <span>2160px</span>
            </div>
            <div className="text-sm font-medium text-apple-blue">
              {settings.maxHeight}px
            </div>
          </div>
        </div>

        {/* Web Worker 设置 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-apple-gray-700">
            性能优化
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.useWebWorker}
                onChange={(e) => handleWebWorkerChange(e.target.checked)}
                className="w-4 h-4 text-apple-blue bg-apple-gray-100 border-apple-gray-300 rounded focus:ring-apple-blue/50"
              />
              <span className="text-sm text-apple-gray-700">使用 Web Worker</span>
            </label>
            <p className="text-xs text-apple-gray-500">
              使用后台线程处理，避免界面卡顿
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #007AFF;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #007AFF;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3);
        }
      `}</style>
    </div>
  )
}

export default CompressionSettings 