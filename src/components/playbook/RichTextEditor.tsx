import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, Code, List, ListOrdered, Heading3, 
  Table as TableIcon, Link as LinkIcon, Image as ImageIcon,
  Quote, Minus, Undo, Redo
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRef } from 'react';

interface RichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
  clientId?: string;
}

export function RichTextEditor({ content, onChange, clientId }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3] },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Start writing module content...' }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `${clientId || 'general'}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('module-assets').upload(path, file);
    if (error) { console.error('Upload error:', error); return; }
    const { data: urlData } = supabase.storage.from('module-assets').getPublicUrl(data.path);
    editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const ToolbarBtn = ({ onClick, active, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-muted transition-colors ${active ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/30">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Code">
          <Code className="w-4 h-4" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading')} title="Heading">
          <Heading3 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <List className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Callout">
          <Quote className="w-4 h-4" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarBtn onClick={addTable} title="Insert Table">
          <TableIcon className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={addLink} title="Insert Link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => fileInputRef.current?.click()} title="Upload Image">
          <ImageIcon className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus className="w-4 h-4" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo className="w-4 h-4" />
        </ToolbarBtn>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-[200px] p-4 text-sm focus-within:outline-none
          [&_.tiptap]:outline-none [&_.tiptap]:min-h-[180px]
          [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:mb-2 [&_.tiptap_h3]:mt-4
          [&_.tiptap_p]:mb-2 [&_.tiptap_p]:leading-relaxed
          [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:mb-2
          [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:mb-2
          [&_.tiptap_table]:border-collapse [&_.tiptap_table]:w-full [&_.tiptap_table]:mb-3
          [&_.tiptap_td]:border [&_.tiptap_td]:border-border [&_.tiptap_td]:p-2 [&_.tiptap_td]:text-sm
          [&_.tiptap_th]:border [&_.tiptap_th]:border-border [&_.tiptap_th]:p-2 [&_.tiptap_th]:bg-muted/50 [&_.tiptap_th]:font-semibold
          [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-sky-400 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:bg-sky-50 [&_.tiptap_blockquote]:dark:bg-sky-950/20 [&_.tiptap_blockquote]:py-2 [&_.tiptap_blockquote]:rounded-r
          [&_.tiptap_img]:rounded-lg [&_.tiptap_img]:max-w-full [&_.tiptap_img]:my-3
          [&_.tiptap_a]:text-sky-600 [&_.tiptap_a]:underline
          [&_.tiptap_code]:bg-muted [&_.tiptap_code]:px-1 [&_.tiptap_code]:rounded [&_.tiptap_code]:text-xs [&_.tiptap_code]:font-mono
          [&_.tiptap_hr]:my-4 [&_.tiptap_hr]:border-border
          [&_.tiptap_.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:h-0 [&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none"
      />

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
    </div>
  );
}
