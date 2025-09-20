
import React from 'react';

interface LivePreviewProps {
  htmlContent: string;
  cssContent: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ htmlContent, cssContent }) => {
  const srcDoc = `
    <html>
      <head>
        <style>${cssContent}</style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  return (
    <div className="bg-gray-900 h-full flex flex-col">
       <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <h3 className="font-mono text-lg text-gray-300">Aperçu en direct</h3>
      </div>
      <div className="p-4 flex-grow">
        <iframe
          srcDoc={srcDoc}
          title="Aperçu en direct"
          sandbox=""
          className="w-full h-full bg-white border border-gray-700 rounded-md"
        />
      </div>
    </div>
  );
};
