import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { snippetsApi } from '@/api/endpoints';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Copy, Trash2, Code } from 'lucide-react';
import type { CodeSnippet } from '@/types';

export default function CodeSnippets(): JSX.Element {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSnippet, setNewSnippet] = useState({
    title: '',
    description: '',
    code: '',
    language: '',
    tags: '',
  });

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await snippetsApi.getAll({ limit: 100 });
      setSnippets(response.data.items);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load snippets',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSnippet = async (): Promise<void> => {
    try {
      await snippetsApi.create({
        title: newSnippet.title,
        description: newSnippet.description,
        code: newSnippet.code,
        language: newSnippet.language,
        tags: newSnippet.tags.split(',').map(t => t.trim()).filter(Boolean),
        is_public: true,
      });
      toast({
        title: 'Success',
        description: 'Snippet created successfully',
      });
      setIsCreateOpen(false);
      setNewSnippet({ title: '', description: '', code: '', language: '', tags: '' });
      loadSnippets();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create snippet',
        variant: 'destructive',
      });
    }
  };

  const handleCopyCode = (code: string): void => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied',
      description: 'Code copied to clipboard',
    });
  };

  const handleDeleteSnippet = async (id: number): Promise<void> => {
    try {
      await snippetsApi.delete(id);
      setSnippets(snippets.filter(s => s.id !== id));
      toast({
        title: 'Success',
        description: 'Snippet deleted successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete snippet',
        variant: 'destructive',
      });
    }
  };

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Code Snippets</h1>
            <p className="text-muted-foreground mt-1">
              Save and share your reusable code
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Snippet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Snippet</DialogTitle>
                <DialogDescription>
                  Save a reusable piece of code
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newSnippet.title}
                      onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
                      placeholder="e.g., React Hook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      value={newSnippet.language}
                      onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
                      placeholder="e.g., typescript"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newSnippet.description}
                    onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
                    placeholder="Brief description of the snippet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newSnippet.tags}
                    onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
                    placeholder="react, hooks, state"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Textarea
                    id="code"
                    value={newSnippet.code}
                    onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                    placeholder="Paste your code here..."
                    className="font-mono min-h-[200px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSnippet}>Create Snippet</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets by title or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Snippets Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 w-1/2 bg-muted rounded" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredSnippets.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No snippets yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first code snippet
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Snippet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSnippets.map((snippet) => (
              <Card key={snippet.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{snippet.title}</CardTitle>
                      <CardDescription>{snippet.description}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopyCode(snippet.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteSnippet(snippet.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-md p-3 mb-3">
                    <pre className="text-xs overflow-x-auto">
                      <code>{snippet.code.slice(0, 150)}{snippet.code.length > 150 ? '...' : ''}</code>
                    </pre>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {snippet.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {snippet.language}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
