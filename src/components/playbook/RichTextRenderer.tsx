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
      className="rich-text-content"
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
