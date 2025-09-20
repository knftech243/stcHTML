
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
        Décrivez comment vous souhaitez rendre votre site dynamique. Par exemple, "Convertir la liste de produits pour qu'elle soit récupérée depuis une table de base de données 'produits'".
      </label>
      <textarea
        id="prompt"
        rows={5}
        className="block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-200 p-3 placeholder-gray-500"
        placeholder="ex., Créer un formulaire de contact qui enregistre les messages dans une base de données..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
