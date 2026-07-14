import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export const LaTeXRenderer = ({ content, className = '' }) => {
  return (
    <div
      className={`
        prose max-w-none text-slate-800 leading-relaxed
        [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden
        [&_.katex-display]:py-3 [&_.katex-display]:my-3
        [&_.katex-display]:max-w-full
        [&_.katex]:max-w-full
        [&_*]:max-w-full
        [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap
        [&_table]:w-full
        [&_img]:max-w-full [&_img]:h-auto
        ${className}
      `}
      style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Custom style for text paragraphs, headings, and lists
          p({ node, children, ...props }) {
            return (
              <p className="mb-4.5 last:mb-0 text-slate-700 text-[13.5px] font-medium leading-relaxed" {...props}>
                {children}
              </p>
            );
          },
          h1({ node, children, ...props }) {
            return (
              <h1 className="text-lg font-extrabold text-slate-900 mt-5 mb-2.5 first:mt-0" {...props}>
                {children}
              </h1>
            );
          },
          h2({ node, children, ...props }) {
            return (
              <h2 className="text-base font-extrabold text-slate-900 mt-4.5 mb-2 first:mt-0" {...props}>
                {children}
              </h2>
            );
          },
          h3({ node, children, ...props }) {
            return (
              <h3 className="text-sm font-extrabold text-slate-800 mt-4 mb-1.5 first:mt-0" {...props}>
                {children}
              </h3>
            );
          },
          ul({ node, children, ...props }) {
            return (
              <ul className="list-disc pl-5 mb-4.5 space-y-2 text-slate-700 text-[13.5px] font-medium leading-relaxed" {...props}>
                {children}
              </ul>
            );
          },
          ol({ node, children, ...props }) {
            return (
              <ol className="list-decimal pl-5 mb-4.5 space-y-2 text-slate-700 text-[13.5px] font-medium leading-relaxed" {...props}>
                {children}
              </ol>
            );
          },
          li({ node, children, ...props }) {
            return (
              <li className="pl-1 text-slate-700 text-[13.5px] font-medium leading-relaxed" {...props}>
                {children}
              </li>
            );
          },
          // Render links
          a({ node, children, href, ...props }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-medium" {...props}>
                {children}
              </a>
            );
          },
          // Custom style for code blocks
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            return isInline ? (
              <code
                className="bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 text-sm font-mono text-indigo-600 font-medium"
                style={{ wordBreak: 'break-all' }}
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-sm font-mono my-2 max-w-full">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          // Contain block-level math equations in a scrollable box
          span({ node, className, children, ...props }) {
            if (className?.includes('math-display')) {
              return (
                <span
                  className={`${className} block max-w-full overflow-x-auto overflow-y-hidden py-3 my-3 bg-indigo-50/30 border border-indigo-100/50 rounded-xl text-center`}
                  style={{ display: 'block' }}
                  {...props}
                >
                  {children}
                </span>
              );
            }
            return <span className={className} {...props}>{children}</span>;
          },
          // Tables: always fit width with premium design
          table({ node, children, ...props }) {
            return (
              <div className="overflow-x-auto max-w-full my-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] bg-white">
                <table className="min-w-full divide-y divide-slate-200 border-collapse text-left text-xs" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          thead({ node, children, ...props }) {
            return (
              <thead className="bg-slate-50/75 font-bold text-slate-800 border-b border-slate-200" {...props}>
                {children}
              </thead>
            );
          },
          tbody({ node, children, ...props }) {
            return (
              <tbody className="divide-y divide-slate-100 bg-white" {...props}>
                {children}
              </tbody>
            );
          },
          tr({ node, children, ...props }) {
            return (
              <tr className="hover:bg-slate-50/30 transition-colors" {...props}>
                {children}
              </tr>
            );
          },
          th({ node, children, ...props }) {
            return (
              <th className="px-4 py-3 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider" {...props}>
                {children}
              </th>
            );
          },
          td({ node, children, ...props }) {
            return (
              <td className="px-4 py-2.5 text-slate-600 font-medium leading-normal align-middle" {...props}>
                {children}
              </td>
            );
          },
          // Images: always constrained
          img({ node, src, alt, ...props }) {
            return (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg block mx-auto"
                {...props}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default LaTeXRenderer;
