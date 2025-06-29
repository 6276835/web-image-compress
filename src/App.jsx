import React, { useState, useCallback } from 'react'
import { Upload, Download, Trash2, Image, Settings, CheckCircle } from 'lucide-react'
import ImageCompressor from './components/ImageCompressor'
import ImagePreview from './components/ImagePreview'
import CompressionSettings from './components/CompressionSettings'
import Header from './components/Header'

function App() {
  const [images, setImages] = useState([])
  const [compressionSettings, setCompressionSettings] = useState({
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    useWebWorker: true
  })

  const handleFileUpload = useCallback((files) => {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      originalFile: file,
      originalSize: file.size,
      originalUrl: URL.createObjectURL(file),
      compressedFile: null,
      compressedSize: null,
      compressedUrl: null,
      isCompressing: false,
      isCompressed: false,
      error: null
    }))
    
    setImages(prev => [...prev, ...newImages])
  }, [])

  const handleCompressImage = useCallback(async (imageId) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isCompressing: true, error: null } : img
    ))

    try {
      const image = images.find(img => img.id === imageId)
      const compressedFile = await ImageCompressor.compress(image.originalFile, compressionSettings)
      
      setImages(prev => prev.map(img => 
        img.id === imageId ? {
          ...img,
          compressedFile,
          compressedSize: compressedFile.size,
          compressedUrl: URL.createObjectURL(compressedFile),
          isCompressing: false,
          isCompressed: true
        } : img
      ))
    } catch (error) {
      setImages(prev => prev.map(img => 
        img.id === imageId ? {
          ...img,
          isCompressing: false,
          error: error.message
        } : img
      ))
    }
  }, [images, compressionSettings])

  const handleCompressAll = useCallback(async () => {
    const uncompressedImages = images.filter(img => !img.isCompressed && !img.isCompressing)
    
    for (const image of uncompressedImages) {
      await handleCompressImage(image.id)
    }
  }, [images, handleCompressImage])

  const handleRemoveImage = useCallback((imageId) => {
    setImages(prev => {
      const image = prev.find(img => img.id === imageId)
      if (image) {
        URL.revokeObjectURL(image.originalUrl)
        if (image.compressedUrl) {
          URL.revokeObjectURL(image.compressedUrl)
        }
      }
      return prev.filter(img => img.id !== imageId)
    })
  }, [])

  const handleDownload = useCallback((image) => {
    if (!image.compressedFile) return
    
    const link = document.createElement('a')
    link.href = image.compressedUrl
    link.download = `compressed_${image.originalFile.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const handleDownloadAll = useCallback(() => {
    const compressedImages = images.filter(img => img.isCompressed)
    
    compressedImages.forEach(image => {
      setTimeout(() => handleDownload(image), 100)
    })
  }, [images, handleDownload])

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0)
  const totalCompressedSize = images.reduce((sum, img) => sum + (img.compressedSize || 0), 0)
  const compressionRatio = totalOriginalSize > 0 ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-apple-gray-50 to-apple-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 上传区域 */}
        <div className="mb-8">
          <div className="apple-card p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
                图片压缩工具
              </h2>
              <p className="text-apple-gray-600">
                支持 PNG、JPG 等格式，快速压缩图片文件大小
              </p>
            </div>
            
            <ImageCompressor 
              onFileUpload={handleFileUpload}
              disabled={images.length >= 10}
            />
          </div>
        </div>

        {/* 压缩设置 */}
        {images.length > 0 && (
          <div className="mb-8">
            <CompressionSettings
              settings={compressionSettings}
              onSettingsChange={setCompressionSettings}
              onCompressAll={handleCompressAll}
              compressedCount={images.filter(img => img.isCompressed).length}
              totalCount={images.length}
            />
          </div>
        )}

        {/* 统计信息 */}
        {images.length > 0 && (
          <div className="mb-8">
            <div className="apple-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-apple-gray-900">
                    {images.length}
                  </div>
                  <div className="text-sm text-apple-gray-600">总图片数</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-apple-blue">
                    {images.filter(img => img.isCompressed).length}
                  </div>
                  <div className="text-sm text-apple-gray-600">已压缩</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-apple-green">
                    {compressionRatio}%
                  </div>
                  <div className="text-sm text-apple-gray-600">压缩率</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-apple-orange">
                    {(totalOriginalSize / 1024 / 1024).toFixed(1)}MB
                  </div>
                  <div className="text-sm text-apple-gray-600">节省空间</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 图片列表 */}
        {images.length > 0 && (
          <div className="space-y-6">
            {images.map((image) => (
              <ImagePreview
                key={image.id}
                image={image}
                onCompress={() => handleCompressImage(image.id)}
                onRemove={() => handleRemoveImage(image.id)}
                onDownload={() => handleDownload(image)}
                settings={compressionSettings}
              />
            ))}
          </div>
        )}

        {/* 批量下载按钮 */}
        {images.filter(img => img.isCompressed).length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleDownloadAll}
              className="apple-button-primary inline-flex items-center gap-2"
            >
              <Download size={20} />
              下载所有压缩图片
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App 