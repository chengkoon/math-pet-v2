'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
      {themes.map(({ name, icon: Icon, label }) => (
        <Button
          key={name}
          type="button"
          onClick={() => setTheme(name)}
          variant={theme === name ? "secondary" : "ghost"}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
            theme === name
              ? 'shadow-sm'
              : ''
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
