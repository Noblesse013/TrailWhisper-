import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import botIcon from '../icon.svg';

const Chatbot: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState<{from: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check user count when component mounts
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get<{ count: number }>('/api/users/count');
        setUserCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch user count:', error);
      }
    };
    fetchUserCount();
  }, []);

  // Check if user has chatbot access (exclude admin on admin dashboard)
  const isAdminOnDashboard = user?.email === 'trailwhisper_admin' && location.pathname === '/admin';
  const hasWhispyAccess = isAuthenticated && user && userCount !== null && userCount <= 100 && !isAdminOnDashboard;

  // Render access denied state
  const renderAccessDenied = () => {
    if (!isAuthenticated) {
      return (
        <div className="fixed bottom-6 right-6 w-96 h-[300px] bg-white shadow-2xl rounded-xl border z-50 flex flex-col">
          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl">
            <img src={botIcon} alt="Bot" className="w-8 h-8 rounded-full mr-3 border-2 border-white" />
            <span className="font-semibold">Whispy</span>
            <button className="ml-auto text-white hover:text-gray-200" onClick={() => setOpen(false)} aria-label="Close chatbot">✕</button>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-6 py-8 text-center">
            <div>
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Authentication Required</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Hi there! I'm Whispy, your AI travel buddy. To chat with me, you'll need to sign up or log in to TrailWhisper.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (userCount !== null && userCount > 100) {
      return (
        <div className="fixed bottom-6 right-6 w-96 h-[300px] bg-white shadow-2xl rounded-xl border z-50 flex flex-col">
          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl">
            <img src={botIcon} alt="Bot" className="w-8 h-8 rounded-full mr-3 border-2 border-white" />
            <span className="font-semibold">Whispy</span>
            <button className="ml-auto text-white hover:text-gray-200" onClick={() => setOpen(false)} aria-label="Close chatbot">✕</button>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-6 py-8 text-center">
            <div>
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Limit Reached</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Thanks for your interest in Whispy! Unfortunately, we've reached our limit of 100 free members. 
              </p>
              <div className="mt-4">
                <p className="text-gray-500 text-xs">Stay tuned for future updates!</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Initialize with welcome message
  useEffect(() => {
    if (open && messages.length === 0 && hasWhispyAccess) {
      setMessages([{ from: 'bot', text: 'Hey there, adventurer! 🌍 I\'m Whispy, your friendly travel buddy! Ready to explore the world together? I\'m here to help you discover incredible destinations, plan amazing trips, and find hidden gems wherever you want to go!' }]);
    }
  }, [open, hasWhispyAccess]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput(''); // Clear input immediately
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setLoading(true);
    
    try {
      // Send conversation history for context (last 5 messages)
      const conversationHistory = messages.slice(-5).map(msg => 
        `${msg.from === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
      ).join('\n');
      
      const messageWithContext = conversationHistory 
        ? `Previous conversation:\n${conversationHistory}\n\nCurrent message: ${userMessage}`
        : userMessage;
        
      const res = await axios.post<{ reply: string }>('/api/chatbot/chat', { 
        message: messageWithContext 
      });
      // Format bot response: split into sentences and join with line breaks for better readability
      let formattedText = res.data.reply
        .replace(/[`*_>#\-]/g, '') // Remove markdown
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      // Add line breaks after sentences for better formatting
      formattedText = formattedText
        .replace(/\.\s+/g, '.\n\n') // Break after sentences
        .replace(/\?\s+/g, '?\n\n') // Break after questions
        .replace(/:\s+/g, ':\n') // Break after colons
        .replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove triple line breaks
      
      setMessages(prev => [...prev, { from: 'bot', text: formattedText }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, I could not get a response.' }]);
    }
    setLoading(false);
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Don't render chatbot at all for admin on dashboard
  if (isAdminOnDashboard) {
    return null;
  }

  // Mini circle preview
  if (!open) {
    return (
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-white flex items-center justify-center border z-50 hover:scale-105 transition-transform"
        onClick={() => setOpen(true)}
        aria-label="Open chatbot"
      >
        <img src={botIcon} alt="Bot" className="w-10 h-10 rounded-full" />
      </button>
    );
  }

  // Show access denied if user doesn't have access
  if (!hasWhispyAccess) {
    return renderAccessDenied();
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white shadow-2xl rounded-xl border z-50 flex flex-col">
      <div className="flex items-center px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-xl">
        <img src={botIcon} alt="Bot" className="w-8 h-8 rounded-full mr-3 border-2 border-white" />
        <span className="font-semibold">Whispy </span>
        <button className="ml-auto text-white hover:text-gray-200" onClick={() => setOpen(false)} aria-label="Close chatbot">✕</button>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500 text-center mt-8">Loading...</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-[85%] ${msg.from === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {msg.from === 'bot' && <img src={botIcon} alt="Bot" className="w-7 h-7 rounded-full mt-1" />}
              <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.from === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-md' 
                  : 'bg-white text-gray-800 border shadow-sm rounded-bl-md'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <img src={botIcon} alt="Bot" className="w-7 h-7 rounded-full mt-1" />
              <div className="bg-white border rounded-2xl rounded-bl-md px-4 py-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="flex p-4 bg-white border-t rounded-b-xl" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
        <input
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about destinations, planning, recommendations..."
          disabled={loading}
        />
        <button
          type="submit"
          className="ml-3 bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;