import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Dashboard = () => {
  const {
    chats,
    activeChat,
    messages,
    loading,
    error,
    isTyping,
    sendMessage,
    loadChatMessages,
    createChat,
    removeChat,
  } = useChat();

  const textRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const iconItems = [
    {
      label: "Home",
      icon: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3h2v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z",
    },
    {
      label: "Discover",
      icon: "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm3.536 4.464-1.415 4.243a1 1 0 0 1-.638.638l-4.243 1.415a.5.5 0 0 1-.633-.633l1.415-4.243a1 1 0 0 1 .638-.638l4.243-1.415a.5.5 0 0 1 .633.633Z",
    },
    {
      label: "Library",
      icon: "M3 3.5A1.5 1.5 0 0 1 4.5 2h3A1.5 1.5 0 0 1 9 3.5v13A1.5 1.5 0 0 1 7.5 18h-3A1.5 1.5 0 0 1 3 16.5v-13Zm8 0A1.5 1.5 0 0 1 12.5 2h3A1.5 1.5 0 0 1 17 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-13Z",
    },
    {
      label: "Spaces",
      icon: "M2 4.75A2.75 2.75 0 0 1 4.75 2h10.5A2.75 2.75 0 0 1 18 4.75v10.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25V4.75ZM6 6.5A1.5 1.5 0 0 1 7.5 5h5A1.5 1.5 0 0 1 14 6.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 6 13.5v-7Z",
    },
  ];

  const [inputMessage, setInputMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [sending, setSending] = useState(false);
  const [activeIcon, setActiveIcon] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (selectedChatId && selectedChatId !== activeChat?._id) {
      loadChatMessages(selectedChatId);
    }
  }, [loadChatMessages, selectedChatId, activeChat]);

  async function handleSendMessage(e) {
    e.preventDefault();

    if (sending || !inputMessage.trim()) return;
    setSending(true);

    try {
      let chatId = activeChat?._id;
      if (!chatId) {
        const newChat = await createChat();
        if (!newChat) {
          console.log("Failed to create new chat");
          return;
        }
        chatId = newChat._id;
        setSelectedChatId(newChat._id);
      }

      setInputMessage("");
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
      await sendMessage({ message: inputMessage, chatId });

      if (textRef.current) {
        textRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Send error:", error);
    } finally {
      setSending(false);
    }
  }

  async function handleNewChat() {
    try {
      const newChat = await createChat();
      if (newChat) {
        setSelectedChatId(newChat._id);
      }
    } catch (error) {
      console.error("Create chat error:", error);
    }
  }

  async function handleInputChange(e) {
    setInputMessage(e.target.value);

    const textArea = textRef.current;
    textArea.style.height = "auto";
    textArea.style.height = `${Math.min(textArea.scrollHeight, 160)}px`;
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
    e.target.value = "";
  }

  async function handleAttachClick() {
    fileInputRef.current?.click();
  }

  async function removeAttachedFile() {
    setAttachedFile(null);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen w-full flex bg-[#0A0A0F] text-neutral-200 overflow-hidden relative">
      {/* Ambient background glow — cyan/blue instead of red */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,180,255,0.08),transparent)]" />

      {/* ============ ICON RAIL ============ */}
      <nav className="custom-scrollbar hidden md:flex w-16 flex-col items-center py-4 gap-1 border-r border-white/5 bg-gradient-to-b from-[#0F0F1A] via-[#0A0A0F] to-[#0A0A0F] relative z-10 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D4FF] via-[#0088CC] to-[#004466] flex items-center justify-center shadow-[0_0_18px_rgba(0,180,255,0.4)] mb-4">
          <span className="text-white font-bold text-sm leading-none">O</span>
        </div>

        {iconItems.map((item) => {
          const isActive = activeIcon === item.label;
          return (
            <button
              key={item.label}
              type="button"
              title={item.label}
              onClick={() => {
                setActiveIcon(item.label);
                if (item.label === "Home") {
                  setIsSidebarOpen(!isSidebarOpen);
                }
              }}
              className={`group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? "bg-gradient-to-br from-[#1A2A3A] to-[#0D1A2A] text-[#00D4FF] shadow-[inset_0_0_0_1px_rgba(0,180,255,0.3)]"
                  : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.04]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d={item.icon} />
              </svg>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%+4px)] w-1 h-5 rounded-full bg-gradient-to-b from-[#00D4FF] to-[#0088CC]" />
              )}
            </button>
          );
        })}

        <div className="mt-auto">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D4FF] via-[#0088CC] to-[#004466] flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white/5">
            {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* ============ SIDEBAR ============ */}
      <aside
        className={`
          flex flex-col border-r border-white/5 bg-gradient-to-b from-[#001433] via-[#0A0A14] to-[#08080F] relative z-10
          transition-all duration-300 ease-in-out shrink-0
          ${
            isSidebarOpen
              ? "w-72 xl:w-80 translate-x-0 opacity-100"
              : "w-0 -translate-x-full opacity-0 overflow-hidden p-0 m-0"
          }
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 h-16 border-b border-white/5 shrink-0 ${isSidebarOpen ? "hidden" : ""}`}
        >
          <span className="text-neutral-100 font-semibold text-base tracking-tight bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Omni Chat
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#80D4FF] bg-gradient-to-r from-[#0D1A2A] to-[#0A1420] px-2 py-1 rounded-md ring-1 ring-[#004466]">
            Pro
          </span>
        </div>

        {/* New chat */}
        <div className={`p-3 ${!isSidebarOpen ? "hidden" : ""}`}>
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#0088CC] to-[#005588] hover:brightness-110 active:brightness-95 text-white text-sm font-medium py-2.5 transition-all shadow-[0_4px_20px_rgba(0,180,255,0.35)] focus:outline-none focus:ring-2 focus:ring-[#0088CC]/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0F]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z" />
            </svg>
            New thread
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2 text-sm text-neutral-500 focus-within:border-[#0088CC] transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Search threads"
              className="flex-1 bg-transparent outline-none placeholder-neutral-600 text-neutral-200"
            />
          </div>
        </div>

        {/* Conversation history */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          <p className="px-2 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-neutral-600">
            Recent
          </p>

          {/* Loading state for chat list */}
          {loading ? (
            <div className="px-2 py-4 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2.5">
                  <div className="w-4 h-4 rounded bg-neutral-800 animate-pulse"></div>
                  <div className="flex-1 h-4 rounded bg-neutral-800 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : chats.length === 0 ? (
            <p className="text-sm text-neutral-500 px-2 py-4 text-center">
              No chats yet. Start a new conversation!
            </p>
          ) : (
            chats.map((chat) => (
              <div
              key={chat._id}
                className={`group w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all ${
                  activeChat?._id === chat._id
                    ? "bg-gradient-to-r from-[#0D1A2A] to-transparent ring-1 ring-[#004466] text-neutral-100"
                    : "text-neutral-400 hover:bg-white/[0.07] hover:text-neutral-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedChatId(chat._id)}
                >
                  {chat.title || "New Chat"}
                </button>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChat(chat._id);
                    if (activeChat?._id === chat._id) {
                      setSelectedChatId(null);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-all shrink-0"
                  aria-label="Delete chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.808a2.75 2.75 0 0 0 2.741-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/5 p-3">
          <button
            type="button"
            className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] via-[#0088CC] to-[#004466] flex items-center justify-center text-white text-xs font-semibold shrink-0 ring-2 ring-white/5">
              {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm text-neutral-100 truncate">
                {user?.username || "Guest"}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {user?.email || "Not signed in"}
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-neutral-500 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 custom-scrollbar">
        {/* Top bar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-white/5 bg-[#112030]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden text-neutral-400 hover:text-neutral-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-200 bg-gradient-to-r from-white/[0.05] to-transparent hover:from-white/[0.08] transition-all ring-1 ring-white/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#80D4FF] to-[#0088CC]" />
              Omni · Pro
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-neutral-500"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#0F1A2A] to-transparent ring-1 ring-white/5 px-2.5 py-1 text-xs text-neutral-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0088CC] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-br from-[#80D4FF] to-[#0088CC]"></span>
              </span>
              Connected
            </div>

            <button
              type="button"
              className="text-neutral-500 hover:text-neutral-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.9 32.9 0 0 0 13.484 0 .75.75 0 0 0 .515-1.076A11.45 11.45 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a.75.75 0 0 0-1.1 1.02 3.5 3.5 0 0 0 6.1 0 .75.75 0 0 0-1.1-1.02 2 2 0 0 1-3.9 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] via-[#0088CC] to-[#004466] flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white/5">
              {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Message thread */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
            {loading && activeChat && messages.length === 0 ? (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-20 bg-neutral-800 rounded animate-pulse mb-2"></div>
                    <div className="h-16 w-full bg-neutral-800 rounded-2xl animate-pulse"></div>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="max-w-lg">
                    <div className="h-12 w-48 bg-neutral-800 rounded-2xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : !activeChat ? (
              <div className="flex flex-col items-center justify-center text-center pt-16 pb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D4FF] via-[#0088CC] to-[#004466] flex items-center justify-center shadow-[0_8px_32px_rgba(0,180,255,0.4)] mb-5">
                  <span className="text-white font-bold text-2xl leading-none">
                    O
                  </span>
                </div>
                <h1 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                  {user?.username
                    ? `Welcome back, ${user.username}`
                    : "Welcome to Omni Chat"}
                </h1>
                <p className="text-neutral-500 text-sm max-w-sm">
                  Ask a question, paste a document, or pick up a past
                  conversation from the sidebar.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                  {[
                    "Summarize a document",
                    "Compare technologies",
                    "Debug my code",
                    "Draft an email",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="text-xs text-neutral-300 rounded-full px-3.5 py-1.5 bg-gradient-to-r from-white/[0.04] to-white/[0.01] ring-1 ring-white/5 hover:ring-[#0088CC] hover:text-[#80D4FF] transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (messages?.length ?? 0) === 0 ? (
              // No messages in this chat
              <div className="flex flex-col items-center justify-center text-center py-16">
                <p className="text-neutral-400">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id || msg.tempId}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#004466] flex items-center justify-center shrink-0 shadow-[0_2px_12px_rgba(0,180,255,0.35)]">
                      <span className="text-white font-bold text-xs leading-none">
                        O
                      </span>
                    </div>
                  )}
                  <div
                    className={`min-w-0 ${msg.role === "user" ? "max-w-lg flex flex-col items-end" : "flex-1"}`}
                  >
                    {msg.role === "ai" && (
                      <p className="text-sm font-medium text-neutral-300 mb-1">
                        Omni
                      </p>
                    )}
                    <div
                      className={`text-sm text-neutral-300 leading-relaxed ${
                        msg.role === "ai"
                          ? "rounded-2xl rounded-tl-sm bg-gradient-to-br from-white/[0.03] to-transparent ring-1 ring-white/5 px-4 py-3"
                          : "rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#00D4FF] via-[#0088CC] to-[#005588] px-4 py-2.5 text-white shadow-[0_4px_20px_rgba(0,180,255,0.25)]"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.messageContent}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.messageContent
                      )}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#004466] flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Composer */}
        <div className="shrink-0 bg-[#0A0A0F] px-4 pb-4 pt-2">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSendMessage}>
              <div className="rounded-3xl border border-white/10 bg-[#141419] focus-within:border-white/20 transition-colors shadow-lg">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.txt,.doc,.docx"
                />
                {attachedFile && (
                  <div className="flex items-center gap-2 px-4 pt-3">
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3.5 h-3.5 text-neutral-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.243Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="max-w-[160px] truncate">
                        {attachedFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={removeAttachedFile}
                        className="text-neutral-500 hover:text-neutral-200"
                        aria-label="Remove attachment"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
             
              <textarea
                ref={textRef}
                rows={1}
                value={inputMessage}
                onChange={handleInputChange}
                placeholder={
                  activeChat
                    ? "Message Omni Chat…"
                    : "Select a chat to start messaging"
                }
                disabled={sending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                className="w-full resize-none bg-transparent text-[15px] text-neutral-100 placeholder-neutral-500 outline-none px-4 pt-3.5 pb-1 max-h-40"
              />
              <div className="flex items-center justify-between px-2.5 pb-2.5 pt-1">
                {/* ✅ Attach বাটন — এখন ক্লিক করলে ফাইল পিকার খুলবে */}
                <button
                  type="button"
                  onClick={handleAttachClick}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.06] transition-colors"
                  aria-label="Attach file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-[18px] h-[18px]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.243Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  type="submit"
                  disabled={sending || !inputMessage.trim()}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black disabled:bg-white/10 disabled:text-neutral-600 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
                  aria-label="Send message"
                >
                  {sending ? (
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
               </div>
            </form>
            <p className="text-center text-[11px] text-neutral-600 mt-2">
              Omni Chat can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
