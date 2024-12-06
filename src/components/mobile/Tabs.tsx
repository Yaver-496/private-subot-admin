import React from 'react';
import WebApp from '@twa-dev/sdk';

interface TabsProps {
  selectedTab: string;
  onChange: (tabId: string) => void;
  children: React.ReactElement[];
}

interface TabProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

export function Tabs({ selectedTab, onChange, children }: TabsProps) {
  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          const { id, label } = child.props;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedTab === id
                  ? 'text-telegram-blue border-b-2 border-telegram-blue'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return child.props.id === selectedTab ? child.props.children : null;
      })}
    </div>
  );
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}