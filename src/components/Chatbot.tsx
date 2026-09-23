"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import styles from "./Chatbot.module.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.chatbotContainer}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={styles.floatingButton}
          aria-label="Abrir chat"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.botIcon}>
                <Bot size={20} />
              </div>
              <div className={styles.headerText}>
                <h3>Asistente Nutrineri</h3>
                <p>En línea</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesArea}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <Bot size={40} style={{ opacity: 0.5 }} />
                <p>
                  ¡Hola! Soy el asistente virtual de la Lic. Nerina Bruno. Podés consultarme sobre servicios, sacar un turno, o preguntarme por recetas e información nutricional.
                </p>
              </div>
            )}
            
            {messages.map(m => (
              <div key={m.id} className={`${styles.messageWrapper} ${m.role === 'user' ? styles.user : styles.bot}`}>
                <div className={`${styles.messageBubble} ${m.role === 'user' ? styles.user : styles.bot}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.bot}`}>
                <div className={styles.loadingIndicator}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Escribí tu mensaje..."
              className={styles.inputField}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className={styles.sendButton}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
