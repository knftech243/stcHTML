
import React, { useState } from 'react';
import { Icon } from './Icon';

interface CodeDisplayProps {
  title: string;
  code: string;
  language: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ title, code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 h-full flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <h3 className="font-mono text-lg text-gray-300">{title}</h3>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-sm text-gray-200 px-3 py-1 rounded-md transition-colors"
        >
          <Icon name={copied ? "check" : "copy"} className="w-4 h-4" />
          <span>{copied ? 'Copié !' : 'Copier'}</span>
        </button>
      </div>
      <div className="p-4 overflow-auto flex-grow">
        <pre className="h-full">
            <code className={`language-${language} text-sm`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};
