import React, { useState } from 'react'
import { Download, Trash2, Image, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

function ImagePreview({ image, onCompress, onRemove, onDownload, settings }) {
  const [isOriginalExpanded, setIsOriginalExpanded] = useState(false)
  const [isCompressedExpanded, setIsCompressedExpanded] = useState(false)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getCompressionRatio = () => {
    if (!image.compressedSize) return 0
    return ((image.originalSize - image.compressedSize) / image.originalSize * 100).toFixed(1)
  }

  const getCompressionColor = (ratio) => {
    if (ratio >= 50) return 'text-apple-green'
    if (ratio >= 30) return 'text-apple-blue'
    if (ratio >= 10) return 'text-apple-orange'
    return 'text-apple-gray-500'
  }

  return (
    <div className="apple-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-apple-gray-900 truncate">
            {image.originalFile.name}
          </h4>
          <p className="text-sm text-apple-gray-600">
            {image.originalFile.type.toUpperCase()} • {formatFileSize(image.originalSize)}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {image.isCompressed && (
            <button
              onClick={onDownload}
              className="apple-button-secondary inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              下载
            </button>
          )}
          
          {!image.isCompressed && !image.isCompressing && (
            <button
              onClick={onCompress}
              className="apple-button-primary inline-flex items-center gap-2"
            >
              <Image className="w-4 h-4" />
              压缩
            </button>
          )}
          
          {image.isCompressing && (
            <div className="flex items-center gap-2 text-apple-blue">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">压缩中...</span>
            </div>
          )}
          
          {image.isCompressed && (
            <div className="flex items-center gap-2 text-apple-green">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">已完成</span>
            </div>
          )}
          
          <button
            onClick={onRemove}
            className="p-2 text-apple-gray-400 hover:text-apple-red hover:bg-apple-red/10 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {image.error && (
        <div className="flex items-center gap-2 p-3 bg-apple-red/10 border border-apple-red/20 rounded-2xl text-apple-red mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{image.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 原图预览 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-apple-gray-900">原图</h5>
            <span className="text-sm text-apple-gray-600">
              {formatFileSize(image.originalSize)}
            </span>
          </div>
          
          <div className="relative group">
            <img
              src={image.originalUrl}
              alt="原图"
              className="w-full rounded-2xl border border-apple-gray-200 transition-all duration-300 cursor-zoom-in hover:scale-105 hover:shadow-apple-lg"
              onClick={() => setIsOriginalExpanded(true)}
            />
            {isOriginalExpanded && (
              <div
                className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center animate-fade-in"
                onClick={() => setIsOriginalExpanded(false)}
              >
                <img
                  src={image.originalUrl}
                  alt="原图放大预览"
                  className="max-w-3xl max-h-[90vh] rounded-2xl shadow-apple-xl transition-transform duration-300"
                  onClick={e => e.stopPropagation()}
                />
                <button
                  className="absolute top-8 right-8 text-white text-2xl bg-black/40 rounded-full px-3 py-1 hover:bg-black/70 transition"
                  onClick={() => setIsOriginalExpanded(false)}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 压缩后预览 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-apple-gray-900">压缩后</h5>
            {image.isCompressed ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-apple-gray-600">
                  {formatFileSize(image.compressedSize)}
                </span>
                <span className={`text-sm font-medium ${getCompressionColor(getCompressionRatio())}`}>
                  -{getCompressionRatio()}%
                </span>
              </div>
            ) : (
              <span className="text-sm text-apple-gray-400">未压缩</span>
            )}
          </div>
          
          <div className="relative group">
            {image.isCompressed ? (
              <>
                <img
                  src={image.compressedUrl}
                  alt="压缩后"
                  className={`w-full rounded-2xl border border-apple-gray-200 transition-all duration-300 ${
                    isCompressedExpanded ? 'cursor-zoom-out scale-110' : 'cursor-zoom-in hover:scale-105 hover:shadow-apple-lg'
                  }`}
                  onClick={() => setIsCompressedExpanded(true)}
                />
                {isCompressedExpanded && (
                  <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center animate-fade-in"
                    onClick={() => setIsCompressedExpanded(false)}
                  >
                    <img
                      src={image.compressedUrl}
                      alt="放大预览"
                      className="max-w-3xl max-h-[90vh] rounded-2xl shadow-apple-xl transition-transform duration-300"
                      onClick={e => e.stopPropagation()}
                    />
                    <button
                      className="absolute top-8 right-8 text-white text-2xl bg-black/40 rounded-full px-3 py-1 hover:bg-black/70 transition"
                      onClick={() => setIsCompressedExpanded(false)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-48 bg-apple-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center text-apple-gray-400">
                  <Image className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">点击压缩按钮开始处理</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 压缩信息 */}
      {image.isCompressed && (
        <div className="mt-6 p-4 bg-apple-gray-50 rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-apple-gray-600">原始大小</div>
              <div className="font-semibold text-apple-gray-900">
                {formatFileSize(image.originalSize)}
              </div>
            </div>
            <div>
              <div className="text-sm text-apple-gray-600">压缩后大小</div>
              <div className="font-semibold text-apple-green">
                {formatFileSize(image.compressedSize)}
              </div>
            </div>
            <div>
              <div className="text-sm text-apple-gray-600">压缩率</div>
              <div className={`font-semibold ${getCompressionColor(getCompressionRatio())}`}>
                {getCompressionRatio()}%
              </div>
            </div>
            <div>
              <div className="text-sm text-apple-gray-600">节省空间</div>
              <div className="font-semibold text-apple-orange">
                {formatFileSize(image.originalSize - image.compressedSize)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImagePreview 