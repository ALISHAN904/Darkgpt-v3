import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'darkgpt_chats_v1';

function loadChats() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveChats(chats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
}

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const scrollRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadChats();
    setChats(stored);
    if (stored.length > 0) setActiveChat(stored[0].id);
    setReady(true);
  }, []);

  const currentChat = chats.find((c) => c.id === activeChat);
  const messages = currentChat?.messages || [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  function persist(updatedChats) {
    setChats(updatedChats);
    saveChats(updatedChats);
  }

  function createNewChat() {
    const newChat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    const updated = [newChat, ...chats];
    persist(updated);
    setActiveChat(newChat.id);
    setSidebarOpen(false);
  }

  function selectChat(id) {
    setActiveChat(id);
    setSidebarOpen(false);
  }

  function deleteChat(id, e) {
    e.stopPropagation();
    if (!confirm('Ye chat delete karni hai?')) return;
    const updated = chats.filter((c) => c.id !== id);
    persist(updated);
    if (activeChat === id) {
      setActiveChat(updated.length > 0 ? updated[0].id : null);
    }
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    let chatId = activeChat;
    let workingChats = chats;

    if (!chatId) {
      const newChat = {
        id: crypto.randomUUID(),
        title: trimmed.slice(0, 40),
        messages: [],
        createdAt: Date.now(),
      };
      workingChats = [newChat, ...chats];
      chatId = newChat.id;
      setActiveChat(chatId);
    }

    const chat = workingChats.find((c) => c.id === chatId);
    const userMsg = { role: 'user', content: trimmed };
    const newMessages = [...chat.messages, userMsg];

    const isFirstMessage = chat.messages.length === 0;
    const updatedChat = {
      ...chat,
      messages: newMessages,
      title: isFirstMessage ? trimmed.slice(0, 40) : chat.title,
    };
    const updated = workingChats.map((c) => (c.id === chatId ? updatedChat : c));
    persist(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: newMessages.slice(0, -1).map((m) => ({ role: m.role, text: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

      const finalMessages = [...newMessages, { role: 'model', content: data.reply }];
      const finalChat = { ...updatedChat, messages: finalMessages };
      persist(updated.map((c) => (c.id === chatId ? finalChat : c)));
    } catch (err) {
      const finalMessages = [...newMessages, { role: 'model', content: `[error] ${err.message}` }];
      const finalChat = { ...updatedChat, messages: finalMessages };
      persist(updated.map((c) => (c.id === chatId ? finalChat : c)));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!ready) return null;

  return (
    <div style={styles.page}>
      <aside style={{ ...styles.sidebar, ...(sidebarOpen ? styles.sidebarOpen : {}) }}>
        <button style={styles.newChatBtn} onClick={createNewChat}>
          + new chat
        </button>
        <div style={styles.chatList}>
          {chats.map((c) => (
            <div
              key={c.id}
              onClick={() => selectChat(c.id)}
              style={{
                ...styles.chatItem,
                ...(activeChat === c.id ? styles.chatItemActive : {}),
              }}
            >
              <span style={styles.chatItemText}>{c.title || 'New Chat'}</span>
              <span style={styles.deleteBtn} onClick={(e) => deleteChat(c.id, e)}>
                ×
              </span>
            </div>
          ))}
          {chats.length === 0 && (
            <p style={styles.emptySidebar}>Koi chat nahi hai abhi</p>
          )}
        </div>
      </aside>

      <div style={styles.main}>
        <header style={styles.header}>
          <span style={styles.menuIcon} onClick={() => setSidebarOpen((v) => !v)}>
            ☰
          </span>
          <span style={styles.brand}>
            DARKGPT<span style={{ color: 'var(--amber)' }}>://</span>
          </span>
          <span style={styles.headerRight}>openrouter</span>
        </header>

        <main ref={scrollRef} style={styles.chatArea}>
          {messages.length === 0 && (
            <p style={styles.emptyState}>gpt &gt; DarkGPT online. Ask me anything.</p>
          )}
          {messages.map((m, i) => (
            <div key={i} style={styles.msgRow}>
              <span
                style={{
                  ...styles.prompt,
                  color: m.role === 'user' ? '#5ec8ff' : 'var(--amber)',
                }}
              >
                {m.role === 'user' ? 'you >' : 'gpt >'}
              </span>
              <span style={styles.msgText}>{m.content}</span>
            </div>
          ))}
          {loading && (
            <div style={styles.msgRow}>
              <span style={{ ...styles.prompt, color: 'var(--amber)' }}>gpt &gt;</span>
              <span style={styles.cursor}>▍</span>
            </div>
          )}
        </main>

        <footer style={styles.inputBar}>
          <span style={{ ...styles.prompt, color: '#5ec8ff' }}>you &gt;</span>
          <textarea
            style={styles.textarea}
            rows={1}
            value={input}
            placeholder="type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button style={styles.sendBtn} onClick={sendMessage} disabled={loading}>
            send
          </button>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', height: '100vh', overflow: 'hidden' },
  sidebar: {
    width: 240,
    background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: 14,
    flexShrink: 0,
  },
  sidebarOpen: {},
  newChatBtn: {
    background: 'transparent',
    border: '1px solid var(--amber)',
    color: 'var(--amber)',
    borderRadius: 4,
    padding: '9px',
    fontFamily: 'inherit',
    fontSize: 13,
    cursor: 'pointer',
    marginBottom: 14,
  },
  chatList: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 },
  emptySidebar: { color: 'var(--text-dim)', fontSize: 12, padding: '8px 4px' },
  chatItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '9px 10px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    color: 'var(--text-dim)',
  },
  chatItemActive: { background: 'var(--border)', color: 'var(--text)' },
  chatItemText: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  deleteBtn: { color: 'var(--text-dim)', fontSize: 16, paddingLeft: 8 },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 20px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-panel)',
  },
  menuIcon: { cursor: 'pointer', fontSize: 16 },
  brand: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, flex: 1 },
  headerRight: { fontSize: 11, color: 'var(--text-dim)' },
  chatArea: { flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 },
  emptyState: { color: 'var(--amber)', fontSize: 14 },
  msgRow: { display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.6, alignItems: 'flex-start' },
  prompt: { fontWeight: 600, flexShrink: 0 },
  msgText: { whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text)' },
  cursor: { color: 'var(--amber)', animation: 'blink 1s step-start infinite' },
  inputBar: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 10,
    padding: '14px 20px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-panel)',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: 'var(--text)',
    fontFamily: 'inherit',
    fontSize: 14,
    resize: 'none',
    maxHeight: 120,
  },
  sendBtn: {
    background: 'var(--amber)',
    color: '#0b0c0e',
    border: 'none',
    padding: '8px 16px',
    fontFamily: 'inherit',
    fontWeight: 600,
    fontSize: 13,
    borderRadius: 4,
    cursor: 'pointer',
  },
};
           
