import React, { useState, useRef, useEffect } from "react";

/* ── Send icon ── */
const SendIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  /* Auto-resize */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "24px";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="flex-shrink-0 px-6 pb-6 pt-3 bg-arena-surface border-t border-arena-border-dim">
      {/* Hint text */}
      <p className="text-center text-[11px] text-arena-muted mb-2.5 select-none">
        Press{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-arena-card border border-arena-border-dim font-mono text-[10px] text-arena-dim">
          Enter
        </kbd>{" "}
        to send &nbsp;·&nbsp;{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-arena-card border border-arena-border-dim font-mono text-[10px] text-arena-dim">
          Shift + Enter
        </kbd>{" "}
        for new line
      </p>

      {/* Input wrapper */}
      <div
        className={`
          flex items-end gap-3 bg-arena-input rounded-2xl
          border transition-all duration-200 px-4 py-3
          ${
            disabled
              ? "border-arena-border-dim opacity-60 cursor-not-allowed"
              : "border-arena-border focus-within:border-model-a focus-within:ring-2 focus-within:ring-model-a-ring"
          }
        `}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent border-none outline-none resize-none
            text-sm text-arena-text placeholder:text-arena-muted
            font-sans leading-relaxed min-h-6 max-h-40 overflow-y-auto"
          placeholder="Ask both AIs a question…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className={`
            flex-shrink-0 flex items-center justify-center
            w-9 h-9 rounded-xl transition-all duration-150 font-medium
            ${
              canSend
                ? "bg-model-a text-white hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-500/20"
                : "bg-arena-card text-arena-muted cursor-not-allowed"
            }
          `}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
