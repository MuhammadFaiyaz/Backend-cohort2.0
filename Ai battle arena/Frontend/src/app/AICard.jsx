import React from "react";
import MarkdownContent from "./MarkdownContent";

/* ── Skeleton loading state ── */
const SkeletonCard = ({ isA }) => (
  <div
    className={`flex flex-col rounded-xl border bg-arena-card overflow-hidden
      ${isA ? "border-model-a-ring" : "border-model-b-ring"}`}
  >
    {/* header */}
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-arena-border-dim">
      <div className="flex items-center gap-2.5">
        <span
          className={`w-2 h-2 rounded-full ${isA ? "bg-model-a" : "bg-model-b"}`}
        />
        <div className="skeleton h-3.5 w-16" />
      </div>
      <div className="flex items-center gap-1.5">
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-arena-muted" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-arena-muted" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-arena-muted" />
      </div>
    </div>
    {/* skeleton lines */}
    <div className="p-5 flex flex-col gap-2.5">
      {[92, 78, 85, 55, 68, 80].map((w, i) => (
        <div key={i} className="skeleton h-3" style={{ width: `${w}%` }} />
      ))}
      <div className="mt-2 rounded-lg overflow-hidden border border-arena-border-dim">
        {[100, 100, 100, 100].map((_, i) => (
          <div key={i} className="skeleton h-3.5 mx-0" style={{ borderRadius: 0 }} />
        ))}
      </div>
      {[62, 48].map((w, i) => (
        <div key={i} className="skeleton h-3" style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

/* ── AI Response Card ── */
const AICard = ({ model, content, score, loading }) => {
  const isA = model === "a";
  const label = isA ? "Model A" : "Model B";
  const accentColor = isA ? "text-model-a" : "text-model-b";
  const dotColor = isA ? "bg-model-a" : "bg-model-b";
  const borderColor = isA ? "border-model-a-ring" : "border-model-b-ring";
  const bgColor = isA ? "bg-model-a-bg" : "bg-model-b-bg";
  const scoreBg = isA
    ? "bg-model-a-bg border-model-a-ring text-model-a"
    : "bg-model-b-bg border-model-b-ring text-model-b";
  const leftBorder = isA ? "border-l-model-a" : "border-l-model-b";

  if (loading) return <SkeletonCard isA={isA} />;

  return (
    <div
      className={`flex flex-col rounded-xl border border-arena-border-dim bg-arena-card
        overflow-hidden transition-all duration-200
        hover:border-arena-border hover:shadow-lg group
        border-l-2 ${leftBorder}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-arena-border-dim">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
          <span className={`text-xs font-semibold tracking-wide ${accentColor}`}>
            {label}
          </span>
        </div>
        {score !== undefined && (
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${scoreBg}`}
          >
            {score} / 10
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 max-h-[420px]">
        <MarkdownContent content={content} />
      </div>
    </div>
  );
};

export default AICard;
