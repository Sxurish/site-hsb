"use client";

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import styles from './ChatWidget.module.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Olá! Sou o assistente da HSB Company. Como posso ajudar o seu negócio hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Endpoint that acts as a proxy to n8n
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'bot', text: data.reply || 'Recebemos sua mensagem. Em breve um consultor entrará em contato!' }]);
      } else {
        throw new Error('Falha na comunicação');
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Desculpe, tivemos um problema de conexão. Tente novamente mais tarde ou contate-nos via WhatsApp.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      {isOpen && (
        <div className={`${styles.chatWindow} glass-panel`}>
          <div className={styles.chatHeader}>
            <div>
              <h3>Assistente HSB</h3>
              <p>Online</p>
            </div>
            <button onClick={toggleChat} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.chatBody}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.botMsg}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.botMsg}`}>
                <span className={styles.typing}>...</span>
              </div>
            )}
          </div>
          
          <form onSubmit={sendMessage} className={styles.chatFooter}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Digite sua mensagem..." 
              className={styles.input}
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
      
      {!isOpen && (
        <button onClick={toggleChat} className={styles.fab}>
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}
