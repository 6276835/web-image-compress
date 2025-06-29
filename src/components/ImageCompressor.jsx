import React, { useRef, useState, useCallback } from 'react'
import { Upload, Image, FileText, AlertCircle } from 'lucide-react'
import imageCompression from 'browser-image-compression'

function ImageCompressor({ onFileUpload, disabled }) {
  const fileInputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState('')

  const validateFiles = (files) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 50 * 1024 * 1024 // 50MB
    
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        throw new Error(`不支持的文件格式: ${file.name}`)
      }
      if (file.size > maxSize) {
        throw new Error(`文件过大: ${file.name} (最大50MB)`)
      }
    }
  }

  const handleFiles = useCallback((files) => {
    try {
      setError('')
      validateFiles(files)
      onFileUpload(files)
    } catch (err) {
      setError(err.message)
    }
  }, [onFileUpload])

  const handleFileSelect = useCallback((event) => {
    const files = event.target.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleDragOver = useCallback((event) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((event) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const files = event.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  return (
    <div className="space-y-4">
      <div
        className={`drag-area p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragOver ? 'dragover' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-apple-blue/10 rounded-full flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-apple-blue" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-apple-gray-900 mb-2">
              拖拽图片到此处或点击上传
            </h3>
            <p className="text-apple-gray-600 mb-4">
              支持 PNG、JPG、WebP 格式，单个文件最大 50MB
            </p>
            
            <button
              type="button"
              className="apple-button-primary inline-flex items-center gap-2"
              disabled={disabled}
            >
              <Image className="w-5 h-5" />
              选择图片文件
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-apple-gray-500">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>PNG</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>JPG</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>WebP</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-apple-red/10 border border-apple-red/20 rounded-2xl text-apple-red">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}

// 导出压缩函数供其他组件使用
ImageCompressor.compress = async (file, options) => {
  const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: Math.max(options.maxWidth, options.maxHeight),
    useWebWorker: options.useWebWorker,
    fileType: file.type,
    quality: options.quality,
    alwaysKeepResolution: true
  }

  return await imageCompression(file, compressionOptions)
}

export default ImageCompressor 