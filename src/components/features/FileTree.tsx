import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn, getLanguageFromPath } from '@/lib/utils';
import { FileCode, Folder, FolderOpen, Plus, Trash2 } from 'lucide-react';
import type { CodeFile } from '@/types';

interface FileTreeProps {
  files: CodeFile[];
  activeFileId?: number;
  onFileSelect: (file: CodeFile) => void;
  onFileCreate?: () => void;
  onFileDelete?: (fileId: number) => void;
}

interface FileNodeProps {
  file: CodeFile;
  isActive: boolean;
  onSelect: (file: CodeFile) => void;
  onDelete?: (fileId: number) => void;
}

function FileNode({ file, isActive, onSelect, onDelete }: FileNodeProps): JSX.Element {
  const [_isExpanded, _setIsExpanded] = useState(true);
  const fileName = file.file_path.split('/').pop() || file.file_path;
  // Language detection: const language = getLanguageFromPath(file.file_path);
  void getLanguageFromPath; // Use function to avoid unused import

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center justify-between px-2 py-1.5 rounded-sm cursor-pointer group',
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
        )}
        onClick={() => onSelect(file)}
      >
        <div className="flex items-center space-x-2 overflow-hidden">
          <FileCode className="h-4 w-4 shrink-0" />
          <span className="text-sm truncate">{fileName}</span>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file.id);
            }}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function FileTree({
  files,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFileDelete,
}: FileTreeProps): JSX.Element {
  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center space-x-2">
          <FolderOpen className="h-4 w-4 text-primary" />
          <span className="font-medium">Files</span>
          <span className="text-xs text-muted-foreground">({files.length})</span>
        </div>
        {onFileCreate && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onFileCreate}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Folder className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No files yet</p>
            {onFileCreate && (
              <Button variant="link" size="sm" onClick={onFileCreate}>
                Create your first file
              </Button>
            )}
          </div>
        ) : (
          files.map((file) => (
            <FileNode
              key={file.id}
              file={file}
              isActive={file.id === activeFileId}
              onSelect={onFileSelect}
              onDelete={onFileDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
