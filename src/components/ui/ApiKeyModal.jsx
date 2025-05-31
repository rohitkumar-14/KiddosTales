import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Key, AlertCircle } from 'lucide-react';
import { useApiKey } from '../../context/ApiKeyContext';

const ApiKeyModal = ({ isOpen, onClose }) => {
  const { apiKeys, updateApiKey, setActiveProvider } = useApiKey();
  const [selectedProvider, setSelectedProvider] = useState(apiKeys.provider);
  const [inputValue, setInputValue] = useState(apiKeys.keys[apiKeys.provider] || '');

  const providers = [
    { 
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Google\'s most capable AI model',
      url: 'https://ai.google.dev/'
    },
    { 
      id: 'openai',
      name: 'OpenAI GPT-4',
      description: 'Advanced language and vision model',
      url: 'https://platform.openai.com/'
    },
    { 
      id: 'stability',
      name: 'Stability AI',
      description: 'Specialized in image generation with Stable Diffusion models',
      url: 'https://stability.ai/'
    }
  ];

  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId);
    setInputValue(apiKeys.keys[providerId] || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateApiKey(selectedProvider, inputValue.trim());
    setActiveProvider(selectedProvider);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden" style={{marginTop: "45rem"}}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <Key className="text-purple-500" size={20} />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              AI Provider Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Select your preferred AI provider and enter your API key. Your key will be stored locally and used for story generation.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {providers.map((provider) => (
                <label
                  key={provider.id}
                  className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedProvider === provider.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="provider"
                    value={provider.id}
                    checked={selectedProvider === provider.id}
                    onChange={() => handleProviderChange(provider.id)}
                    className="sr-only"
                  />
                  <span className="font-medium mb-1">{provider.name}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {provider.description}
                  </span>
                  {apiKeys.keys[provider.id] && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="apiKey" className="block text-sm font-medium">
                API Key for {providers.find(p => p.id === selectedProvider)?.name}
              </label>
              <input
                type="password"
                id="apiKey"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your API key"
                className="input-field font-mono"
                autoComplete="off"
              />
              <div className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p>
                  Get your API key from{' '}
                  <a
                    href={providers.find(p => p.id === selectedProvider)?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    {providers.find(p => p.id === selectedProvider)?.name}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save Settings
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ApiKeyModal;