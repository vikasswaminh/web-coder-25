import { useCallback } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { codeFilesApi } from '@/api/endpoints';
import { toast } from '@/hooks/use-toast';
import { getLanguageFromPath } from '@/lib/utils';

interface UseEditorReturn {
  code: string;
  language: string;
  theme: string;
  fontSize: number;
  isDirty: boolean;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (size: number) => void;
  loadFile: (fileId: number, filePath: string, content: string) => void;
  saveFile: (fileId: number) => Promise<void>;
}

export function useEditor(): UseEditorReturn {
  const {
    code,
    language,
    theme,
    fontSize,
    isDirty,
    setCode,
    setLanguage,
    setTheme,
    setFontSize,
    setDirty,
  } = useEditorStore();

  const loadFile = useCallback((_fileId: number, filePath: string, content: string): void => {
    const lang = getLanguageFromPath(filePath);
    useEditorStore.getState().setCode(content);
    useEditorStore.getState().setLanguage(lang);
    setDirty(false);
  }, [setDirty]);

  const saveFile = useCallback(async (fileId: number): Promise<void> => {
    try {
      await codeFilesApi.update(fileId, { content: code });
      setDirty(false);
      toast({
        title: 'Success',
        description: 'File saved successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save file';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  }, [code, setDirty]);

  return {
    code,
    language,
    theme,
    fontSize,
    isDirty,
    setCode,
    setLanguage,
    setTheme,
    setFontSize,
    loadFile,
    saveFile,
  };
}
