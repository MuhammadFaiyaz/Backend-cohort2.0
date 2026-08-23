import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { sendMessage } from "../service/chat.api";

const Dashboard = () => {
  const {
    chats,
    activeChat,
    messages,
    loading,
    error,
    isTyping,
    loadChatMessages,
  } = useChat();
  const [inputMessage, setInputMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [sending, setSending] = useState(false);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (selectedChatId) {
      loadChatMessages(selectedChatId);
    }
  }, [loadChatMessages, selectedChatId]);

  async function handleSendMessage(e) {
    e.preventDefault();

    if (sending || !inputMessage.trim() || !activeChat) return;
    setSending(true);

    try {
      await sendMessage({ message: inputMessage, chatId: activeChat._id });
      setInputMessage("")
    } catch (error) {
      console.error('Send error:', error);
    } finally{
      setSending(false)
    }
  }

  return (
    <div className="h-screen w-full flex bg-[#0A0A0F] text-neutral-200 overflow-hidden relative">
      {/* Ambient background glow — cyan/blue instead of red */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,180,255,0.08),transparent)]" />

      {/* ============ ICON RAIL ============ */}
      <nav className="hidden md:flex w-16 flex-col items-center py-4 gap-1 border-r border-white/5 bg-gradient-to-b from-[#0F0F1A] via-[#0A0A0F] to-[#0A0A0F] relative z-10 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D4FF] via-[#0088CC] to-[#004466] flex items-center justify-center shadow-[0_0_18px_rgba(0,180,255,0.4)] mb-4">
          <span className="text-white font-bold text-sm leading-none">O</span>
        </div>

        {[
          {
            label: "Home",
            active: true,
            d: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3h2v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z",
          },
          {
            label: "Discover",
            d: "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm3.536 4.464-1.415 4.243a1 1 0 0 1-.638.638l-4.243 1.415a.5.5 0 0 1-.633-.633l1.415-4.243a1 1 0 0 1 .638-.638l4.243-1.415a.5.5 0 0 1 .633.633Z",
          },
          {
            label: "Library",
            d: "M3 3.5A1.5 1.5 0 0 1 4.5 2h3A1.5 1.5 0 0 1 9 3.5v13A1.5 1.5 0 0 1 7.5 18h-3A1.5 1.5 0 0 1 3 16.5v-13Zm8 0A1.5 1.5 0 0 1 12.5 2h3A1.5 1.5 0 0 1 17 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-13Z",
          },
          {
            label: "Spaces",
            d: "M2 4.75A2.75 2.75 0 0 1 4.75 2h10.5A2.75 2.75 0 0 1 18 4.75v10.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25V4.75ZM6 6.5A1.5 1.5 0 0 1 7.5 5h5A1.5 1.5 0 0 1 14 6.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 6 13.5v-7Z",
          },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.label}
            className={`group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              item.active
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
              <path d={item.d} />
            </svg>
            {item.active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%+4px)] w-1 h-5 rounded-full bg-gradient-to-b from-[#00D4FF] to-[#0088CC]" />
            )}
          </button>
        ))}

        <div className="mt-auto">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D4FF] via-[#0088CC] to-[#004466] flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white/5">
            {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* ============ SIDEBAR ============ */}
      <aside className="hidden lg:flex lg:w-72 xl:w-80 flex-col border-r border-white/5 bg-gradient-to-b from-[#2E3D1A] via-[#0A0A14] to-[#08080F] relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5 shrink-0">
          <span className="text-neutral-100 font-semibold text-base tracking-tight bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Omni Chat
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#80D4FF] bg-gradient-to-r from-[#0D1A2A] to-[#0A1420] px-2 py-1 rounded-md ring-1 ring-[#004466]">
            Pro
          </span>
        </div>

        {/* New chat */}
        <div className="p-3">
          <button
            type="button"
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
              <button
                key={chat._id}
                onClick={() => setSelectedChatId(chat._id)}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  selectedChatId === chat._id
                    ? "bg-gradient-to-r from-[#0D1A2A] to-transparent ring-1 ring-[#004466] text-neutral-100"
                    : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
                }`}
              >
                {chat.title || "New Chat"}
              </button>
            ))
          )}
          <a
            href="#"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm bg-gradient-to-r from-[#0D1A2A] to-transparent ring-1 ring-[#004466] text-neutral-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-[#00D4FF] shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15H9.06l-2.573 2.573A.75.75 0 0 1 5.25 17v-2H4.25A2.25 2.25 0 0 1 2 12.75v-8.5Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate">Redis caching strategies</span>
          </a>

          {[
            "React state management tips",
            "Docker vs Podman comparison",
            "Weekly research summary",
            "SQL query optimization",
          ].map((title) => (
            <a
              key={title}
              href="#"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-neutral-600 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15H9.06l-2.573 2.573A.75.75 0 0 1 5.25 17v-2H4.25A2.25 2.25 0 0 1 2 12.75v-8.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">{title}</span>
            </a>
          ))}
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
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
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
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-8">
            {loading && activeChat ? (
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
            ) : messages.length === 0 ? (
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
                    className={`flex-1 min-w-0 ${msg.role === "user" ? "max-w-lg" : ""}`}
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
                      {msg.messageContent}
                      {msg.status === "sending" && (
                        <span className="inline-block ml-2 text-xs opacity-50">
                          <svg
                            className="animate-spin h-3 w-3 inline"
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
                        </span>
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

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#004466] flex items-center justify-center shrink-0 shadow-[0_2px_12px_rgba(0,180,255,0.35)]">
                <span className="text-white font-bold text-xs leading-none">
                  O
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-300 mb-1">
                  Omni
                </p>
                <div className="text-sm text-neutral-300 leading-relaxed rounded-2xl rounded-tl-sm bg-gradient-to-br from-white/[0.03] to-transparent ring-1 ring-white/5 px-4 py-3">
                  I can help you research, write, debug code, and reason through
                  problems. What are you working on today?
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="max-w-lg rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#00D4FF] via-[#0088CC] to-[#005588] px-4 py-2.5 text-sm text-white shadow-[0_4px_20px_rgba(0,180,255,0.25)]">
                Can you compare Redis and Memcached for session storage?
              </div>
            </div>
          </div>
        </main>

        {/* Composer */}
        <div className="shrink-0 border-t border-white/5 bg-gradient-to-t from-[#0F0A0A] to-[#0A0A0F] px-4 md:px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage}>
              <div className="rounded-2xl p-[1px] bg-gradient-to-r from-[#0D1A2A] via-[#1A2A3A] to-[#0D1A2A] focus-within:from-[#0088CC] focus-within:via-[#00D4FF] focus-within:to-[#0088CC] transition-all duration-300">
                <div className="flex items-end gap-2 rounded-2xl bg-[#0D0D14] px-3 py-2.5">
                  <button
                    type="button"
                    className="shrink-0 p-1.5 rounded-md text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.05] transition-colors"
                    aria-label="Attach file"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.243Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <textarea
                    rows={1}
                    value={inputMessage}
                    onClick={() => (e) => setInputMessage(e.target.value)}
                    placeholder={
                      activeChat
                        ? "Message Omni Chat…"
                        : "Select a chat to start messaging"
                    }
                    disabled={!activeChat || sending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    className="flex-1 resize-none bg-transparent text-sm text-neutral-100 placeholder-neutral-600 outline-none py-1.5 max-h-40"
                  />

                  <button
                    type="submit"
                    disabled={sending || !inputMessage.trim() || !activeChat}
                    className="shrink-0 rounded-xl bg-gradient-to-br from-[#00D4FF] via-[#0088CC] to-[#005588] hover:brightness-110 active:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2 transition-all shadow-[0_2px_16px_rgba(0,180,255,0.4)]"
                    aria-label="Send message"
                  >
                    {sending ? ( // ← ✅ sending হলে spinner দেখান
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
                        <path d="M3.105 3.105a.75.75 0 0 1 .814-.163l13.5 5.25a.75.75 0 0 1 0 1.396l-13.5 5.25a.75.75 0 0 1-.99-.943L4.885 10 2.93 4.05a.75.75 0 0 1 .176-.945Z" />
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
