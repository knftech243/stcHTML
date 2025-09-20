
import React, { useMemo } from 'react';

// Add a global declaration for the 'marked' library loaded from a CDN.
declare global {
  interface Window {
    marked: {
      parse(markdownString: string, options?: object): string;
    };
  }
}

interface FeedbackPanelProps {
  feedback: string;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback }) => {
  // Use useMemo to parse the feedback only when it changes.
  const parsedFeedback = useMemo(() => {
    if (typeof window.marked?.parse === 'function') {
      // Use marked to parse the Markdown string into HTML.
      // gfm: true enables GitHub Flavored Markdown.
      // breaks: true adds <br> on single line breaks.
      return window.marked.parse(feedback, { gfm: true, breaks: true });
    }
    // Fallback: If marked is not available, display the feedback as preformatted text.
    return `<pre class="whitespace-pre-wrap">${feedback}</pre>`;
  }, [feedback]);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h3 className="text-xl font-bold text-indigo-400 mb-4">Commentaires et suggestions de l'IA</h3>
      <div
        className="prose prose-invert prose-sm max-w-none text-gray-300"
        // Render the parsed HTML. This is safe because 'marked' sanitizes the output by default.
        dangerouslySetInnerHTML={{ __html: parsedFeedback }}
      />
    </div>
  );
};
