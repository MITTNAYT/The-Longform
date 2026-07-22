import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';

/**
 * A reusable component to render safe Markdown as React elements.
 * Uses remark-gfm for tables, strikethrough, tasklists, and URLs.
 * Uses DOMPurify to sanitize the raw markdown before rendering (defense-in-depth, 
 * though react-markdown is relatively safe).
 */
export const MarkdownRenderer = ({ content, className = '' }) => {
  // Process visibility blocks before rendering
  // 1. Remove :::email-only ... ::: entirely (since this is web rendering)
  let processedContent = (content || '').replace(/:::email-only[\s\S]*?:::/g, '');
  // 2. Keep content of :::web-only ... ::: but remove the markers
  processedContent = processedContent.replace(/:::web-only\s*([\s\S]*?)\s*:::/g, '$1');

  // Sanitize the raw markdown just in case before parsing
  const cleanContent = DOMPurify.sanitize(processedContent);

  return (
    <div className={`prose prose-stone lg:prose-lg max-w-none font-lato ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // We can override specific HTML elements here if we want them styled
          h1: ({node, ...props}) => <h1 className="font-playfair font-bold text-3xl md:text-4xl mt-8 mb-4 text-stone-900" {...props} />,
          h2: ({node, ...props}) => <h2 className="font-playfair font-bold text-2xl md:text-3xl mt-6 mb-3 text-stone-900" {...props} />,
          h3: ({node, ...props}) => <h3 className="font-playfair font-bold text-xl md:text-2xl mt-5 mb-2 text-stone-900" {...props} />,
          p: ({node, ...props}) => <p className="text-stone-800 leading-relaxed mb-4 text-lg" {...props} />,
          a: ({node, ...props}) => <a className="text-stone-900 underline decoration-stone-300 hover:decoration-stone-900 transition-colors" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-stone-300 pl-4 py-1 italic text-stone-700 bg-stone-50 rounded-r-lg my-6" {...props} />
          ),
          ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-stone-800" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-stone-800" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          code: ({node, inline, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <pre className="bg-stone-100 rounded p-4 overflow-x-auto text-sm border border-stone-200 my-6 text-stone-800">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-stone-100 rounded px-1.5 py-0.5 text-sm font-mono text-stone-800 border border-stone-200" {...props}>
                {children}
              </code>
            );
          },
          img: ({node, ...props}) => (
            <img className="rounded-lg shadow-sm border border-stone-200 my-8 mx-auto max-w-full h-auto" loading="lazy" {...props} />
          ),
          hr: ({node, ...props}) => <hr className="border-stone-200 my-8" {...props} />
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
};
