
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Heading1, Heading2, Heading3, Image, Link, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageInsert?: (imageUrl: string, altText: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ 
  content, 
  onChange, 
  onImageInsert,
  placeholder = "Start writing your blog post...",
  className 
}: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState('');

  const insertMarkdown = (markdownSyntax: string, placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    let newContent: string;
    
    // Handle different markdown patterns
    if (markdownSyntax.includes('##')) {
      // For headings, add on new line
      const beforeCursor = content.substring(0, start);
      const afterCursor = content.substring(end);
      const needsNewlineBefore = beforeCursor && !beforeCursor.endsWith('\n');
      const needsNewlineAfter = afterCursor && !afterCursor.startsWith('\n');
      
      newContent = beforeCursor + 
        (needsNewlineBefore ? '\n' : '') + 
        markdownSyntax + textToInsert + 
        (needsNewlineAfter ? '\n' : '') + 
        afterCursor;
    } else {
      // For inline formatting
      newContent = content.substring(0, start) + 
        markdownSyntax.replace('{text}', textToInsert) + 
        content.substring(end);
    }
    
    onChange(newContent);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + markdownSyntax.length + (selectedText ? 0 : placeholder.length);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: 'Bold',
      action: () => insertMarkdown('**{text}**', 'bold text'),
    },
    {
      icon: Italic,
      label: 'Italic', 
      action: () => insertMarkdown('*{text}*', 'italic text'),
    },
    {
      icon: Heading1,
      label: 'Heading 1',
      action: () => insertMarkdown('# ', 'Main Heading'),
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      action: () => insertMarkdown('## ', 'Section Heading'),
    },
    {
      icon: Heading3,
      label: 'Heading 3', 
      action: () => insertMarkdown('### ', 'Subsection Heading'),
    },
    {
      icon: Link,
      label: 'Link',
      action: () => insertMarkdown('[{text}](https://example.com)', 'link text'),
    },
    {
      icon: List,
      label: 'Bullet List',
      action: () => insertMarkdown('- ', 'List item'),
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      action: () => insertMarkdown('1. ', 'List item'),
    },
  ];

  const handleImageInsert = () => {
    const imageUrl = prompt('Enter image URL:');
    const altText = prompt('Enter alt text for accessibility:');
    
    if (imageUrl && altText) {
      insertMarkdown(`![${altText}](${imageUrl})`, '');
      if (onImageInsert) {
        onImageInsert(imageUrl, altText);
      }
    }
  };

  return (
    <div className={cn("border rounded-lg", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.action}
            className="h-8 w-8 p-0"
            title={button.label}
            type="button"
          >
            <button.icon size={16} />
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleImageInsert}
          className="h-8 w-8 p-0"
          title="Insert Image"
          type="button"
        >
          <Image size={16} />
        </Button>
      </div>
      
      {/* Editor */}
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[400px] border-0 resize-none focus-visible:ring-0"
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement;
          const selected = content.substring(target.selectionStart, target.selectionEnd);
          setSelectedText(selected);
        }}
      />
      
      {/* Markdown Guide */}
      <div className="p-2 border-t bg-gray-50 text-xs text-gray-600">
        <p><strong>Markdown Guide:</strong> **bold**, *italic*, # H1, ## H2, ### H3, [link](url), ![alt](image-url)</p>
      </div>
    </div>
  );
};

export default RichTextEditor;
