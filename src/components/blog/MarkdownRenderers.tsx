import { useEffect, useRef, type ReactNode } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import type { Components } from 'react-markdown';

function CodeBlock({ className, children }: { className?: string; children?: ReactNode }) {
  const codeRef = useRef<HTMLElement>(null);
  const language = className?.replace('language-', '') || '';

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children]);

  // Inline code (no language class)
  if (!className) {
    return <code>{children}</code>;
  }

  return (
    <div className="code-block-wrapper">
      {language && <span className="code-block-lang">{language}</span>}
      <pre className={className}>
        <code ref={codeRef} className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getTextContent(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getTextContent).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return getTextContent((children as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

function HeadingWithAnchor({
  level,
  children,
}: {
  level: 2 | 3;
  children?: ReactNode;
}) {
  const text = getTextContent(children);
  const id = slugify(text);
  const Tag = `h${level}` as const;

  return (
    <Tag id={id} className="group scroll-mt-24">
      {children}
      <a
        href={`#${id}`}
        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-sinai-cyan no-underline"
        aria-label={`Link to ${text}`}
      >
        #
      </a>
    </Tag>
  );
}

function TableWrapper({ children }: { children?: ReactNode }) {
  return (
    <div className="table-wrapper">
      <table>{children}</table>
    </div>
  );
}

export const markdownComponents: Components = {
  code({ className, children }) {
    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
  pre({ children }) {
    // The CodeBlock component renders its own <pre>, so we just pass through
    return <>{children}</>;
  },
  h2({ children }) {
    return <HeadingWithAnchor level={2}>{children}</HeadingWithAnchor>;
  },
  h3({ children }) {
    return <HeadingWithAnchor level={3}>{children}</HeadingWithAnchor>;
  },
  table({ children }) {
    return <TableWrapper>{children}</TableWrapper>;
  },
  blockquote({ children }) {
    return <blockquote>{children}</blockquote>;
  },
  img({ src, alt }) {
    return (
      <figure className="my-8">
        <img src={src} alt={alt || ''} loading="lazy" className="rounded-xl shadow-md" />
        {alt && alt !== '' && (
          <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },
};
