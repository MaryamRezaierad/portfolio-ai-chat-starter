'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type AIChatProps = {
  endpoint?: string;
};

export function AIChat({ endpoint = '/api/chat' }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Check URL parameter to hide button
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('hideButton') === 'true') {
      setHideButton(true);
    }
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: newMessages,
        }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.message ?? 'No response received.',
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            "Sorry, something went wrong on my end. Mind trying that again in a bit?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button - only show if hideButton is false */}
      {!hideButton && (
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#2D466D] text-white shadow-lg flex items-center justify-center z-50 focus:outline-none focus:ring-2 focus:ring-white/60"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle chat"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </motion.button>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 w-96 max-w-[95vw] h-[520px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-neutral-200"
          >
            {/* Header */}
            <div className="bg-[#2D466D] text-white px-5 py-4">
              <h3 className="font-semibold text-sm">Get details on Maryam's work</h3>
              <p className="text-xs text-neutral-300">
                Powered by AI
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-neutral-50/60">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#2D466D] text-white'
                        : 'bg-white text-black border border-neutral-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-neutral-200 rounded-2xl px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-neutral-200 px-3 py-3 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question…"
                  className="flex-1 rounded-full border border-neutral-200 px-4 py-2 text-xs focus:outline-none focus:border-[#2D466D]"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9 rounded-full bg-[#2D466D] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
