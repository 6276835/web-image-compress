import React from 'react'
import { Image, Sparkles } from 'lucide-react'

function Header() {
  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-white/20">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-apple-blue to-apple-purple rounded-2xl flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-apple-gray-900">
                图片压缩工具
              </h1>
              <p className="text-sm text-apple-gray-600">
                高效压缩，保持质量
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-apple-gray-600">
            <Sparkles className="w-4 h-4" />
            <span>免费在线工具</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 