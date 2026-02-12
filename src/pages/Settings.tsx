import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/authStore';
import { useEditorStore } from '@/stores/editorStore';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { User, Palette, Save } from 'lucide-react';
import type { User as UserType } from '@/types';

export default function Settings(): JSX.Element {
  const { user, setUser } = useAuthStore();
  const { fontSize, setFontSize, theme, setTheme } = useEditorStore();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (): Promise<void> => {
    setIsSaving(true);
    try {
      if (user) {
        const updatedUser: UserType = { ...user, name };
        setUser(updatedUser);
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (newTheme: string): void => {
    setTheme(newTheme);
    toast({
      title: 'Theme Updated',
      description: `Editor theme set to ${newTheme}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Manage your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Editor Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Editor Preferences</CardTitle>
            </div>
            <CardDescription>Customize your coding environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Font Size: {fontSize}px</Label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Editor Theme</Label>
              <div className="flex space-x-2">
                <Button
                  variant={theme === 'vs-dark' ? 'default' : 'outline'}
                  onClick={() => handleThemeChange('vs-dark')}
                >
                  Dark
                </Button>
                <Button
                  variant={theme === 'vs-light' ? 'default' : 'outline'}
                  onClick={() => handleThemeChange('vs-light')}
                >
                  Light
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
