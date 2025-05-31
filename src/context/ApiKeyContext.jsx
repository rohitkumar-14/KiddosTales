import React, { createContext, useContext, useState, useEffect } from 'react';

const ApiKeyContext = createContext();

export const useApiKey = () => useContext(ApiKeyContext);

export const ApiKeyProvider = ({ children }) => {
  const [apiKeys, setApiKeys] = useState(() => {
    const savedKeys = localStorage.getItem('aiApiKeys');
    return savedKeys ? JSON.parse(savedKeys) : {
      provider: 'gemini',
      keys: {
        gemini: '',
        openai: '',
        anthropic: '',
        grok: ''
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('aiApiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const updateApiKey = (provider, key) => {
    setApiKeys(prev => ({
      ...prev,
      keys: {
        ...prev.keys,
        [provider]: key
      }
    }));
  };

  const setActiveProvider = (provider) => {
    setApiKeys(prev => ({
      ...prev,
      provider
    }));
  };

  return (
    <ApiKeyContext.Provider value={{ 
      apiKeys, 
      updateApiKey, 
      setActiveProvider,
      activeKey: apiKeys.keys[apiKeys.provider],
      activeProvider: apiKeys.provider
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
};