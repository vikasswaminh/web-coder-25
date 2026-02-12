export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function getFileIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const iconMap: Record<string, string> = {
    ts: '📘',
    tsx: '⚛️',
    js: '📜',
    jsx: '⚛️',
    py: '🐍',
    html: '🌐',
    css: '🎨',
    json: '📋',
    md: '📝',
    sql: '🗄️',
    yml: '⚙️',
    yaml: '⚙️',
    dockerfile: '🐳',
  };
  return iconMap[ext] || '📄';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}
