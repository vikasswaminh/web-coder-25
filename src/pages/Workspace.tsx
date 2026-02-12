import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { CodeEditor } from '@/components/features/CodeEditor';
import { AIAssistant } from '@/components/features/AIAssistant';
import { FileTree } from '@/components/features/FileTree';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { codeFilesApi, projectsApi } from '@/api/endpoints';
import { useProjectStore } from '@/stores/projectStore';
import { useEditorStore } from '@/stores/editorStore';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Bot, X } from 'lucide-react';
import type { CodeFile } from '@/types';

export default function Workspace(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { files, setFiles, activeFile, setActiveFile, setActiveProject, activeProject } = useProjectStore();
  const { code } = useEditorStore();
  const [isCreateFileOpen, setIsCreateFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async (): Promise<void> => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        const [projectRes, filesRes] = await Promise.all([
          projectsApi.getById(parseInt(projectId)),
          codeFilesApi.getByProject(parseInt(projectId)),
        ]);
        setActiveProject(projectRes.data);
        setFiles(filesRes.data.items);
        if (filesRes.data.items.length > 0) {
          setActiveFile(filesRes.data.items[0]);
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to load project',
          variant: 'destructive',
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, setActiveProject, setFiles, setActiveFile, navigate]);

  const handleCreateFile = async (): Promise<void> => {
    if (!newFileName.trim() || !projectId) return;

    setIsCreating(true);
    try {
      const response = await codeFilesApi.create({
        project_id: parseInt(projectId),
        file_path: newFileName,
        content: '',
        language: newFileName.split('.').pop() || 'txt',
      });
      setFiles([...files, response.data]);
      setActiveFile(response.data);
      setIsCreateFileOpen(false);
      setNewFileName('');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create file',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileSelect = (file: CodeFile): void => {
    setActiveFile(file);
  };

  const handleFileSave = async (content: string): Promise<void> => {
    if (!activeFile) return;

    try {
      await codeFilesApi.update(activeFile.id, { content });
      toast({
        title: 'Success',
        description: 'File saved successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save file',
        variant: 'destructive',
      });
    }
  };

  const handleFileDelete = async (fileId: number): Promise<void> => {
    try {
      await codeFilesApi.delete(fileId);
      setFiles(files.filter(f => f.id !== fileId));
      if (activeFile?.id === fileId) {
        setActiveFile(null);
      }
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-60px)]">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Toolbar */}
      <div className="border-b border-border bg-card px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="font-semibold">{activeProject?.name}</h1>
            <p className="text-xs text-muted-foreground">{activeFile?.file_path || 'No file selected'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowAI(!showAI)}>
            {showAI ? <X className="h-4 w-4 mr-1" /> : <Bot className="h-4 w-4 mr-1" />}
            {showAI ? 'Hide AI' : 'Show AI'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-64 border-r border-border p-4">
          <FileTree
            files={files}
            activeFileId={activeFile?.id}
            onFileSelect={handleFileSelect}
            onFileCreate={() => setIsCreateFileOpen(true)}
            onFileDelete={handleFileDelete}
          />
        </div>

        {/* Editor */}
        <div className={`flex-1 ${showAI ? 'w-1/2' : 'w-full'}`}>
          {activeFile ? (
            <CodeEditor fileId={activeFile.id} onSave={handleFileSave} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <p className="mb-4">Select a file or create a new one</p>
                <Button onClick={() => setIsCreateFileOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create File
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant */}
        {showAI && (
          <div className="w-96 border-l border-border p-4">
            <AIAssistant projectId={projectId ? parseInt(projectId) : undefined} context={code} />
          </div>
        )}
      </div>

      {/* Create File Dialog */}
      <Dialog open={isCreateFileOpen} onOpenChange={setIsCreateFileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              Enter the file path (e.g., src/components/App.tsx)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="filename">File Path</Label>
            <Input
              id="filename"
              placeholder="src/App.tsx"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFileOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFile} disabled={isCreating || !newFileName.trim()}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
