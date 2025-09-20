
import React from 'react';
import { Icon } from './Icon';

interface FileUploadProps {
  onFileChange: (file: File, type: 'html' | 'css') => void;
  htmlFile: File | null;
  cssFile: File | null;
}

const FileInput: React.FC<{
  id: string;
  label: string;
  accept: string;
  file: File | null;
  iconName: 'html' | 'css';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, accept, file, iconName, onChange }) => (
  <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-indigo-400 transition-colors duration-200">
    <input
      type="file"
      id={id}
      accept={accept}
      onChange={onChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-4">
      <Icon name={iconName} className="w-8 h-8 text-gray-500" />
      <div className="flex-grow">
        <label htmlFor={id} className="font-medium text-gray-300 block">
          {label}
        </label>
        {file ? (
          <p className="text-sm text-green-400 truncate max-w-[200px]">{file.name}</p>
        ) : (
          <p className="text-sm text-gray-500">Cliquez pour télécharger ou glissez-déposez</p>
        )}
      </div>
    </div>
  </div>
);

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, htmlFile, cssFile }) => {
  const handleHtmlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0], 'html');
    }
  };

  const handleCssChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0], 'css');
    }
  };

  return (
    <div className="space-y-4">
      <FileInput 
        id="html-upload"
        label="Télécharger le fichier HTML (*)"
        accept=".html"
        file={htmlFile}
        iconName="html"
        onChange={handleHtmlChange}
      />
      <FileInput 
        id="css-upload"
        label="Télécharger le fichier CSS"
        accept=".css"
        file={cssFile}
        iconName="css"
        onChange={handleCssChange}
      />
    </div>
  );
};
