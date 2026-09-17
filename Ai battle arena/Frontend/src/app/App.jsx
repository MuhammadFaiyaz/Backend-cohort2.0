import React, { useState, useRef, useEffect } from "react";
import AICard from "./AICard";
import JudgeCard from "./JudgeCard";
import ChatInput from "./ChatInput";
import { simulateBattleResponse } from "./api";

/* ────────────────────────────────────────
   Header — scoreboard strip
──────────────────────────────────────── */
const Header = () => (
  <header className="flex items-center justify-between h-14 px-6 flex-shrink-0 bg-arena-surface border-b border-arena-border-dim">
    {/* Logo */}
    <div className="flex items-center gap-2.5">
      <span className="text-xl leading-none select-none">⚡</span>
      <h1 className="font-display text-[16px] font-semibold tracking-tight text-arena-text">
        AI Battle Arena
      </h1>
      <span className="hidden sm:block text-[10px] font-medium px-2 py-0.5 rounded-full border border-arena-border text-arena-muted bg-arena-card ml-1">
        BETA
      </span>
    </div>

    {/* Center tagline */}
    <p className="absolute left-1/2 -translate-x-1/2 text-[11px] text-arena-muted tracking-wide select-none hidden md:block">
      Two AIs. One judge. You decide.
    </p>

    {/* Corner badges */}
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5 font-display text-[11px] font-medium px-2.5 py-1 rounded-full bg-model-a-bg border border-model-a-ring text-model-a">
        <span className="w-1.5 h-1.5 rounded-full bg-model-a shadow-[0_0_5px_currentColor]" />
        Corner A
      </span>
      <span className="flex items-center gap-1.5 font-display text-[11px] font-medium px-2.5 py-1 rounded-full bg-model-b-bg border border-model-b-ring text-model-b">
        <span className="w-1.5 h-1.5 rounded-full bg-model-b shadow-[0_0_5px_currentColor]" />
        Corner B
      </span>
    </div>
  </header>
);

/* ────────────────────────────────────────
   Empty / Welcome State
──────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center flex-1 gap-6 py-24 px-6 select-none">
    <div className="text-5xl opacity-40">⚔️</div>
    <div className="text-center space-y-2.5 max-w-md">
      <h2 className="font-display text-2xl font-semibold text-arena-text tracking-tight">
        Start the battle
      </h2>
      <p className="text-sm text-arena-dim leading-relaxed">
        Ask a question or drop in a coding challenge. Two models answer
        head-to-head, and a third model judges the winner.
      </p>
    </div>

    {/* Example prompts */}
    <div className="flex flex-wrap justify-center gap-2 mt-1 max-w-lg">
      {[
        "Write a binary search in Python",
        "Explain async/await",
        "Design a REST API for a todo app",
        "What is memoization?",
      ].map((prompt) => (
        <span
          key={prompt}
          className="text-[11px] text-arena-dim px-3 py-1.5 rounded-full border border-arena-border-dim bg-arena-card cursor-default hover:border-arena-border transition-colors"
        >
          {prompt}
        </span>
      ))}
    </div>
  </div>
);

/* ────────────────────────────────────────
   User Avatar — shows first capital letter
──────────────────────────────────────── */
const UserAvatar = ({ name }) => {
  const initial = name ? name.trim()[0].toUpperCase() : "U";
  return (
    <div
      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
        font-display text-[13px] font-semibold text-white select-none
        bg-gradient-to-br from-arena-card-hover to-arena-card border border-arena-border shadow-md"
      aria-label={`User: ${name || "User"}`}
    >
      {initial}
    </div>
  );
};

/* ────────────────────────────────────────
   Quiet section divider (no eyebrow-caps)
──────────────────────────────────────── */
const SectionLabel = ({ label }) => (
  <div className="flex items-center gap-2.5 mb-3">
    <span className="text-[12px] font-medium text-arena-dim">{label}</span>
    <div className="flex-1 h-px bg-arena-border-dim" />
  </div>
);

/* ────────────────────────────────────────
   Single conversation turn
──────────────────────────────────────── */
const MessageThread = ({ userMessage, battleData, loading, userName }) => (
  <div className="flex flex-col gap-7 animate-fade-up">
    {/* ── User Message ── */}
    <div className="flex items-start justify-end gap-3">
      <div
        className="max-w-2xl bg-arena-msg border border-arena-border-dim rounded-2xl
          rounded-tr-sm px-4 py-3 text-sm text-arena-text leading-relaxed
          shadow-sm"
      >
        {userMessage}
      </div>
      <UserAvatar name={userName} />
    </div>

    {/* ── Match-up: AI Responses with a VS badge between them ── */}
    <div>
      <SectionLabel label="Responses" />
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-3">
        <AICard
          model="a"
          content={battleData?.solution_1}
          score={battleData?.judge?.solution_1_score}
          loading={loading}
        />
        <AICard
          model="b"
          content={battleData?.solution_2}
          score={battleData?.judge?.solution_2_score}
          loading={loading}
        />

        {/* VS badge — centered over the seam on large screens only */}
        <div
          className="hidden lg:flex animate-vs-pop absolute left-1/2 top-1/2 z-10
            w-11 h-11 items-center justify-center rounded-full
            bg-arena-surface border border-arena-border shadow-lg"
          aria-hidden="true"
        >
          <span className="font-display text-[11px] font-bold tracking-wide text-arena-muted">
            VS
          </span>
        </div>
      </div>
    </div>

    {/* ── Judge Verdict ── */}
    <div>
      <SectionLabel label="Verdict" />
      <JudgeCard judgeData={battleData?.judge} loading={loading} />
    </div>
  </div>
);

/* ────────────────────────────────────────
   Thread separator
──────────────────────────────────────── */
const ThreadDivider = () => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1 h-px bg-arena-border-dim" />
    <span className="text-[10px] text-arena-muted select-none">New battle</span>
    <div className="flex-1 h-px bg-arena-border-dim" />
  </div>
);

/* ────────────────────────────────────────
   Main App
──────────────────────────────────────── */
const App = () => {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatAreaRef = useRef(null);

  // In a real app this would come from auth context; default = "User"
  const userName = "User";

  /* Auto-scroll to bottom */
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [threads, isLoading]);

  const handleSend = async (userMessage) => {
    const threadId = Date.now();
    setThreads((prev) => [
      ...prev,
      { id: threadId, userMessage, battleData: null, loading: true },
    ]);
    setIsLoading(true);

    try {
      const data = await simulateBattleResponse(userMessage);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId ? { ...t, battleData: data, loading: false } : t
        )
      );
    } catch (err) {
      console.error("Battle failed:", err);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                loading: false,
                battleData: {
                  solution_1: "⚠️ Failed to fetch response from Corner A.",
                  solution_2: "⚠️ Failed to fetch response from Corner B.",
                  judge: null,
                },
              }
            : t
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-arena-base font-sans antialiased">
      <Header />

      {/* Chat scroll area */}
      <main
        ref={chatAreaRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-10">
          {threads.length === 0 ? (
            <EmptyState />
          ) : (
            threads.map((thread, idx) => (
              <React.Fragment key={thread.id}>
                {idx > 0 && <ThreadDivider />}
                <MessageThread
                  userMessage={thread.userMessage}
                  battleData={thread.battleData}
                  loading={thread.loading}
                  userName={userName}
                />
              </React.Fragment>
            ))
          )}
        </div>
      </main>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
};

export default App;