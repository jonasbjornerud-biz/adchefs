import { useMemo } from 'react';

interface RichTextRendererProps {
  content: any;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  const html = useMemo(() => {
    if (typeof content === 'string') return content;
    if (content?.type === 'doc') return tiptapToHtml(content);
    if (typeof content === 'object') return JSON.stringify(content);
    return '';
  }, [content]);

  return (
    <div
      className="rich-text-content prose prose-sm max-w-none dark:prose-invert
        prose-headings:font-semibold prose-headings:text-foreground
        prose-p:text-foreground/80 prose-li:text-foreground/80
        prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
        prose-table:border-collapse prose-td:border prose-td:border-border prose-td:p-2 prose-td:text-sm
        prose-th:border prose-th:border-border prose-th:p-2 prose-th:text-sm prose-th:bg-muted/50 prose-th:font-semibold
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
        prose-img:rounded-lg prose-img:max-w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function tiptapToHtml(doc: any): string {
  if (!doc?.content) return '';
  return doc.content.map((node: any) => nodeToHtml(node)).join('');
}

function nodeToHtml(node: any): string {
  if (!node) return '';

  switch (node.type) {
    case 'paragraph':
      return `<p>${renderChildren(node)}</p>`;
    case 'heading':
      const level = node.attrs?.level || 3;
      return `<h${level}>${renderChildren(node)}</h${level}>`;
    case 'bulletList':
      return `<ul>${renderChildren(node)}</ul>`;
    case 'orderedList':
      return `<ol>${renderChildren(node)}</ol>`;
    case 'listItem':
      return `<li>${renderChildren(node)}</li>`;
    case 'table':
      return `<table>${renderChildren(node)}</table>`;
    case 'tableRow':
      return `<tr>${renderChildren(node)}</tr>`;
    case 'tableCell':
      return `<td>${renderChildren(node)}</td>`;
    case 'tableHeader':
      return `<th>${renderChildren(node)}</th>`;
    case 'image':
      return `<img src="${node.attrs?.src || ''}" alt="${node.attrs?.alt || ''}" />`;
    case 'hardBreak':
      return '<br />';
    case 'blockquote':
      return `<blockquote>${renderChildren(node)}</blockquote>`;
    case 'codeBlock':
      return `<pre><code>${renderChildren(node)}</code></pre>`;
    case 'horizontalRule':
      return '<hr />';
    case 'text':
      let text = node.text || '';
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (node.marks) {
        for (const mark of node.marks) {
          switch (mark.type) {
            case 'bold':
              text = `<strong>${text}</strong>`; break;
            case 'italic':
              text = `<em>${text}</em>`; break;
            case 'code':
              text = `<code>${text}</code>`; break;
            case 'link':
              text = `<a href="${mark.attrs?.href || '#'}" target="_blank" rel="noopener noreferrer">${text}</a>`; break;
          }
        }
      }
      return text;
    default:
      return renderChildren(node);
  }
}

function renderChildren(node: any): string {
  if (!node.content) return node.text || '';
  return node.content.map((child: any) => nodeToHtml(child)).join('');
}
