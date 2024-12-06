import { Send } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  username: string;
}

export function Header({ username }: HeaderProps) {
  return (
    <header className="bg-[#0088cc] text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Send size={28} className="text-white" />
          <h1 className="text-2xl font-bold">Private Subot Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-90">Welcome,</span>
          <span className="font-semibold">@{username}</span>
        </div>
      </div>
    </header>
  );
}