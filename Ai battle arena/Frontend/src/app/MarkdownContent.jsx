import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";

  if (!inline && match) {
    return (
      <div className="relative">
        {lang && (
          <span className="code-lang-badge absolute top-2.5 right-3 z-10">
            {lang}
          </span>
        )}
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={lang}
          PreTag="div"
          customStyle={{
            background: "#0e0e12",
            borderRadius: "8px",
            fontSize: "12.5px",
            padding: "14px 16px",
            margin: 0,
            border: "1px solid #1e1e28",
            fontFamily: "'JetBrains Mono', monospace",
          }}
          codeTagProps={{ style: { fontFamily: "'JetBrains Mono', monospace" } }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const MarkdownContent = ({ content }) => (
  <div className="prose-arena">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
      {content}
    </ReactMarkdown>
  </div>
);

export default MarkdownContent;
