import React, { useState } from 'react';
import { X, Palette, Type, Monitor, Sun, Moon, Settings } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  isDarkMode: boolean;
  colorPalette: string;
  onToggleDarkMode: () => void;
}

export default function SettingsPanel({ 
  isVisible, 
  onClose, 
  settings, 
  onSettingsChange, 
  isDarkMode, 
  colorPalette,
  onToggleDarkMode 
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('appearance');

  const getColorPalette = () => {
    const palettes = {
      blue: { primary: '#3B82F6', secondary: '#DBEAFE', light: '#EFF6FF' },
      green: { primary: '#10B981', secondary: '#D1FAE5', light: '#ECFDF5' },
      purple: { primary: '#8B5CF6', secondary: '#EDE9FE', light: '#F5F3FF' },
      orange: { primary: '#F59E0B', secondary: '#FEF3C7', light: '#FFFBEB' },
    };
    return palettes[colorPalette as keyof typeof palettes] || palettes.blue;
  };

  const colors = getColorPalette();

  if (!isVisible) return null;

  const colorPalettes = [
    { id: 'blue', name: 'Ocean Blue', primary: '#3B82F6', secondary: '#DBEAFE' },
    { id: 'green', name: 'Forest Green', primary: '#10B981', secondary: '#D1FAE5' },
    { id: 'purple', name: 'Royal Purple', primary: '#8B5CF6', secondary: '#EDE9FE' },
    { id: 'orange', name: 'Sunset Orange', primary: '#F59E0B', secondary: '#FEF3C7' },
  ];

  const fontSizes = [
    { id: 'small', name: 'Small', preview: 'text-sm' },
    { id: 'medium', name: 'Medium', preview: 'text-base' },
    { id: 'large', name: 'Large', preview: 'text-lg' },
  ];

  const fontStyles = [
    { id: 'inter', name: 'Inter', preview: 'font-sans' },
    { id: 'roboto', name: 'Roboto', preview: 'font-mono' },
    { id: 'system', name: 'System', preview: 'font-serif' },
  ];

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'typography', name: 'Typography', icon: Type },
    { id: 'themes', name: 'Themes', icon: Monitor },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[600px] flex flex-col lg:flex-row`}>
        {/* Header */}
        <div className={`p-4 lg:p-6 border-b lg:border-b-0 lg:border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex lg:hidden items-center justify-between`}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Sidebar */}
          <div className={`w-full lg:w-48 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4`}>
            <div className="hidden lg:flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>
            <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 lg:w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  style={activeTab === tab.id ? { backgroundColor: colors.primary } : {}}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium lg:inline hidden">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Theme Mode
                  </h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={onToggleDarkMode}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all ${
                        settings.theme === 'light'
                          ? 'border-blue-500'
                          : isDarkMode
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={settings.theme === 'light' ? { 
                        borderColor: colors.primary, 
                        backgroundColor: isDarkMode ? colors.primary + '20' : colors.light 
                      } : {}}
                    >
                      <Sun className="w-5 h-5" />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Light</span>
                    </button>
                    <button
                      onClick={onToggleDarkMode}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all ${
                        settings.theme === 'dark'
                          ? ''
                          : isDarkMode
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={settings.theme === 'dark' ? { 
                        borderColor: colors.primary, 
                        backgroundColor: isDarkMode ? colors.primary + '20' : colors.light 
                      } : {}}
                    >
                      <Moon className="w-5 h-5" />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Color Palette
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {colorPalettes.map((palette) => (
                      <button
                        key={palette.id}
                        onClick={() => onSettingsChange({ ...settings, colorPalette: palette.id as any })}
                        className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all ${
                          settings.colorPalette === palette.id
                            ? ''
                            : isDarkMode
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          borderColor: settings.colorPalette === palette.id ? palette.primary : undefined,
                          backgroundColor: settings.colorPalette === palette.id ? (isDarkMode ? palette.primary + '20' : palette.secondary) : undefined
                        }}
                      >
                        <div className="flex space-x-1">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.primary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.secondary }}></div>
                        </div>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {palette.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Font Size
                  </h3>
                  <div className="space-y-3">
                    {fontSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => onSettingsChange({ ...settings, fontSize: size.id as any })}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          settings.fontSize === size.id
                            ? ''
                            : isDarkMode
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={settings.fontSize === size.id ? {
                          borderColor: colors.primary,
                          backgroundColor: isDarkMode ? colors.primary + '20' : colors.light
                        } : {}}
                      >
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {size.name}
                        </span>
                        <span className={`${size.preview} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Sample text
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Font Style
                  </h3>
                  <div className="space-y-3">
                    {fontStyles.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => onSettingsChange({ ...settings, fontStyle: font.id as any })}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          settings.fontStyle === font.id
                            ? ''
                            : isDarkMode
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={settings.fontStyle === font.id ? {
                          borderColor: colors.primary,
                          backgroundColor: isDarkMode ? colors.primary + '20' : colors.light
                        } : {}}
                      >
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {font.name}
                        </span>
                        <span className={`${font.preview} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Sample text
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'themes' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Custom Themes
                  </h3>
                  <div className={`p-6 rounded-xl border-2 border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} text-center`}>
                    <Monitor className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Custom theme creation coming soon
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}