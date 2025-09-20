
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { PromptInput } from './components/PromptInput';
import { Button } from './components/Button';
import { Loader } from './components/Loader';
import { CodeDisplay } from './components/CodeDisplay';
import { FeedbackPanel } from './components/FeedbackPanel';
import { LivePreview } from './components/LivePreview';
import { convertStaticToDynamic } from './services/geminiService';
import { ConversionResult, ViewType } from './types';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [cssFile, setCssFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cssContent, setCssContent] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewType>(ViewType.PHP);

  const handleFileChange = (file: File, type: 'html' | 'css') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (type === 'html') {
        setHtmlFile(file);
        setHtmlContent(content);
      } else {
        setCssFile(file);
        setCssContent(content);
      }
    };
    reader.readAsText(file);
  };

  const handleConvert = useCallback(async () => {
    if (!htmlContent || !prompt) {
      setError('Un fichier HTML et un objectif de conversion sont requis.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const conversionResult = await convertStaticToDynamic(htmlContent, cssContent, prompt);
      setResult(conversionResult);
      setActiveView(ViewType.PHP);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue lors de la conversion.');
    } finally {
      setIsLoading(false);
    }
  }, [htmlContent, cssContent, prompt]);

  const renderResultView = () => {
    if (!result) return null;

    switch (activeView) {
      case ViewType.PHP:
        return <CodeDisplay title="PHP généré" code={result.phpCode} language="php" />;
      case ViewType.SQL:
        return <CodeDisplay title="SQL généré" code={result.sqlCode} language="sql" />;
      case ViewType.Feedback:
        return <FeedbackPanel feedback={result.feedback} />;
      case ViewType.Preview:
        return <LivePreview htmlContent={htmlContent} cssContent={cssContent} />;
      case ViewType.HTML:
        return <CodeDisplay title="HTML original" code={htmlContent} language="html" />;
      case ViewType.CSS:
        return cssContent ? <CodeDisplay title="CSS original" code={cssContent} language="css" /> : <div className="p-4 text-gray-400">Aucun fichier CSS n'a été fourni.</div>;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ view: ViewType, label: string, icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button
      onClick={() => setActiveView(view)}
      disabled={!result}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 ${
        activeView === view
          ? 'bg-gray-700 text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-400 border-b border-gray-700 pb-2">1. Télécharger les fichiers</h2>
              <FileUpload onFileChange={handleFileChange} htmlFile={htmlFile} cssFile={cssFile} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-400 border-b border-gray-700 pb-2">2. Décrire l'objectif</h2>
              <PromptInput value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleConvert} disabled={isLoading || !htmlFile || !prompt}>
                {isLoading ? 'Conversion en cours...' : 'Convertir en Dynamique'}
              </Button>
              {isLoading && <Loader />}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-8">
            <div className="bg-gray-800 rounded-lg shadow-lg min-h-[600px] flex flex-col">
              {error && <div className="m-4 p-4 bg-red-900 border border-red-700 text-red-200 rounded-md">{error}</div>}
              
              {!isLoading && !result && !error && (
                 <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                    <Icon name="code" className="w-16 h-16 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-400">Prêt à convertir</h3>
                    <p className="mt-2 max-w-md">Téléchargez votre HTML/CSS, décrivez vos fonctionnalités dynamiques et laissez l'IA construire votre backend PHP/SQL.</p>
                </div>
              )}
              
              {result && (
                <>
                  <div className="flex border-b border-gray-700 px-4 pt-2">
                    <TabButton view={ViewType.PHP} label="PHP" icon={<Icon name="php" className="w-5 h-5" />} />
                    <TabButton view={ViewType.SQL} label="SQL" icon={<Icon name="database" className="w-5 h-5" />} />
                    <TabButton view={ViewType.Feedback} label="Commentaires" icon={<Icon name="sparkles" className="w-5 h-5" />} />
                    <TabButton view={ViewType.Preview} label="Aperçu" icon={<Icon name="eye" className="w-5 h-5" />} />
                    <TabButton view={ViewType.HTML} label="HTML" icon={<Icon name="html" className="w-5 h-5" />} />
                    {cssFile && <TabButton view={ViewType.CSS} label="CSS" icon={<Icon name="css" className="w-5 h-5" />} />}
                  </div>
                  <div className="flex-grow overflow-auto">
                    {renderResultView()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
