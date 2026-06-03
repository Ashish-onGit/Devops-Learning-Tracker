import React, { createContext, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import useToast from '../hooks/useToast';

export const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const toast = useToast();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your **DevOps Learning Assistant**. Ask me anything about Linux permissions, Docker networks, Kubernetes Ingress controllers, or Terraform states!'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  
  // Track last prompt for regeneration
  const lastPromptRef = useRef('');
  const lastContextRef = useRef('');

  const clearConversation = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation history cleared. Ask me anything about the DevOps roadmap!'
      }
    ]);
    setStreamingContent('');
    lastPromptRef.current = '';
    lastContextRef.current = '';
    toast.info('Conversation history cleared');
  }, [toast]);

  // Simulate typing stream effect
  const typeWriterEffect = useCallback((text, onComplete) => {
    let index = 0;
    setStreamingContent('');
    
    const interval = setInterval(() => {
      setStreamingContent((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        onComplete(text);
      }
    }, 15); // Adjust typing speed here
  }, []);

  const sendMessage = useCallback(async (promptText, pageContext = '') => {
    if (!promptText.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    lastPromptRef.current = promptText;
    lastContextRef.current = pageContext;

    const loadToastId = toast.loading('Tutor is thinking...');

    try {
      // Query our backend API
      const res = await axios.post('/api/v1/ai/chat', {
        prompt: promptText,
        context: pageContext
      });

      toast.dismiss(loadToastId);

      const replyText = res.data.data;

      // Animate streaming response on the client
      typeWriterEffect(replyText, (finalText) => {
        setMessages((prev) => [...prev, { role: 'assistant', content: finalText }]);
        setStreamingContent('');
      });

    } catch (e) {
      console.error('AI assistant chat failed', e);
      toast.dismiss(loadToastId);
      toast.error('Failed to generate tutor response');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '✕ **API Error**: Could not connect to the DevOps Assistant service. Please verify your server is running.' }
      ]);
    } finally {
      setLoading(false);
    }
  }, [toast, typeWriterEffect]);

  const regenerateResponse = useCallback(() => {
    if (lastPromptRef.current) {
      sendMessage(lastPromptRef.current, lastContextRef.current);
    }
  }, [sendMessage]);

  return (
    <AIContext.Provider value={{
      messages,
      loading,
      streamingContent,
      sendMessage,
      clearConversation,
      regenerateResponse
    }}>
      {children}
    </AIContext.Provider>
  );
};

export default AIProvider;
