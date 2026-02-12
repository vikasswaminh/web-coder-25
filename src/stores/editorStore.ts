import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { EditorState } from '@/types';

interface EditorStoreState extends EditorState {
  isDirty: boolean;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  setDirty: (isDirty: boolean) => void;
  resetState: () => void;
}

const initialState: EditorState = {
  code: '',
  language: 'typescript',
  theme: 'vs-dark',
  fontSize: 14,
};

export const useEditorStore = create<EditorStoreState>()(
  immer((set) => ({
    ...initialState,
    isDirty: false,
    setCode: (code) =>
      set((state) => {
        state.code = code;
        state.isDirty = true;
      }),
    setLanguage: (language) =>
      set((state) => {
        state.language = language;
      }),
    setTheme: (theme) =>
      set((state) => {
        state.theme = theme;
      }),
    setFontSize: (fontSize) =>
      set((state) => {
        state.fontSize = fontSize;
      }),
    setDirty: (isDirty) =>
      set((state) => {
        state.isDirty = isDirty;
      }),
    resetState: () =>
      set((state) => {
        Object.assign(state, initialState, { isDirty: false });
      }),
  }))
);
