import React from 'react';
import { MessageCircle } from 'lucide-react';

interface SplashScreenProps {
  isVisible: boolean;
}

export default function SplashScreen({ isVisible }: SplashScreenProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
            <MessageCircle className="w-10 h-10 text-blue-500" />
          </div>
          <div className="absolute -inset-4 bg-white/20 rounded-3xl animate-ping"></div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">KoNo</h1>
        <p className="text-blue-100 text-lg">Professional Communication</p>
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}