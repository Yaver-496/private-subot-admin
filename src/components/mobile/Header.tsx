import React from 'react';
import { Send } from 'lucide-react';

interface HeaderProps {
  username: string;
}

export function Header({ username }: HeaderProps) {
  return (
    <header className="bg-[#0088cc] text-white p-4 shadow-lg dark:text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Send size={28} className="text-white" />
          <h1 className="text-2xl font-bold dark:text-white">Telegram Manager</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-90 dark:text-white">Welcome,</span>
          <span className="font-semibold dark:text-white">@{username}</span>
        </div>
      </div>
    </header>
  );
}