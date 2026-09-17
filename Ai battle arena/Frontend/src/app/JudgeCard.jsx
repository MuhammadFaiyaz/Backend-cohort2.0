import React from "react";

/* ── Trophy icon ── */
const TrophyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 3H3a1 1 0 0 0-1 1v3c0 2.97 2.16 5.43 5 5.91V14H6a1 1 0 0 0-1 1v1H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2h-1v-1a1 1 0 0 0-1-1h-1v-1.09c2.84-.48 5-2.94 5-5.91V4a1 1 0 0 0-1-1h-2V2a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5zm0 2V5h2v7.83A4.003 4.003 0 0 1 4 9V6h1V5zm14 0h1v3a4.003 4.003 0 0 1-3 3.83V5h2V5z" />
  </svg>
);

/* ── Skeleton for judge card ── */
const JudgeSkeleton = () => (
  <div className="rounded-xl border border-judge-ring bg-arena-card animate-judge-glow">
    {/* top shimmer line */}
    <div className="h-px bg-gradient-to-r from-transparent via-judge to-transparent" />
    <div className="flex items-center justify-between px-5 py-4 border-b border-arena-border-dim">
      <div className="flex items-center gap-2 text-judge">
        <span>⚖️</span>
        <span className="text-sm font-semibold tracking-wide">Judge Verdict</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-judge" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-judge" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-judge" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-5 p-5">
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="skeleton h-3.5 w-20" />
            <div className="skeleton h-5 w-14 rounded-full" />
          </div>
          {[90, 75, 82, 60].map((w, j) => (
            <div key={j} className="skeleton h-2.5" style={{ width: `${w}%` }} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* ── Judge Verdict Card ── */
const JudgeCard = ({ judgeData, loading }) => {
  if (loading) return <JudgeSkeleton />;
  if (!judgeData) return null;

  const { solution_1_score, solution_2_score, solution_1_reasoning, solution_2_reasoning } =
    judgeData;

  const winner =
    solution_1_score > solution_2_score
      ? "Model A"
      : solution_2_score > solution_1_score
      ? "Model B"
      : "Tie";

  const winnerColorClass =
    winner === "Model A"
      ? "text-model-a"
      : winner === "Model B"
      ? "text-model-b"
      : "text-judge";

  return (
    <div className="rounded-xl border border-judge-ring bg-arena-card overflow-hidden animate-judge-glow">
      {/* Gradient shimmer top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-judge to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-arena-border-dim">
        <div className="flex items-center gap-2 text-judge">
          <span className="text-base">⚖️</span>
          <span className="text-sm font-semibold tracking-wide">Judge Verdict</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-judge-ring bg-judge-bg">
          <TrophyIcon />
          <span className="text-[11px] font-bold text-judge tracking-wide">Winner:</span>
          <span className={`text-[11px] font-bold tracking-wide ${winnerColorClass}`}>
            {winner}
          </span>
        </div>
      </div>

      {/* Body — two-column reasoning */}
      <div className="grid grid-cols-2 divide-x divide-arena-border-dim p-0">
        {/* Model A */}
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-model-a flex-shrink-0" />
              <span className="text-xs font-semibold text-model-a tracking-wide">Model A</span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-model-a-bg border-model-a-ring text-model-a">
              {solution_1_score} / 10
            </span>
          </div>
          <p className="text-xs leading-relaxed text-arena-dim">{solution_1_reasoning}</p>
        </div>

        {/* Model B */}
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-model-b flex-shrink-0" />
              <span className="text-xs font-semibold text-model-b tracking-wide">Model B</span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-model-b-bg border-model-b-ring text-model-b">
              {solution_2_score} / 10
            </span>
          </div>
          <p className="text-xs leading-relaxed text-arena-dim">{solution_2_reasoning}</p>
        </div>
      </div>
    </div>
  );
};

export default JudgeCard;
