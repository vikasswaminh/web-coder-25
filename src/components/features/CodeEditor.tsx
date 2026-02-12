import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  fileId?: number;
  onSave?: (content: string) => void;
}

export function CodeEditor({ fileId, onSave }: CodeEditorProps): JSX.Element {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { code, language, setCode, isDirty } = useEditorStore();

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [fileId]);

  const handleSave = (): void => {
    if (onSave) {
      onSave(code);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
          {isDirty && (
            <span className="text-xs text-primary">● unsaved</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCode('')}
            disabled={!code}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      <textarea
        ref={editorRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 w-full bg-background p-4 font-mono text-sm resize-none focus:outline-none"
        spellCheck={false}
        placeholder="Start coding here..."
      />
    </div>
  );
}
