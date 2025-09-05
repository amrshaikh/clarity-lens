import { useState, useEffect } from 'react';

// A component for the info cards
const InfoCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center animate-fade-in">
    <div className="bg-slate-200 dark:bg-slate-800 p-8 rounded-lg transition-colors">
      <h3 className="font-bold text-xl mb-2">About</h3>
      <p className="text-base text-slate-600 dark:text-slate-400">
        ClarityLens uses AI to summarize web articles, making content accessible and easy to digest for a focused reading experience.
      </p>
    </div>
    <div className="bg-slate-200 dark:bg-slate-800 p-8 rounded-lg transition-colors">
      <h3 className="font-bold text-xl mb-2">How It Works</h3>
      <p className="text-base text-slate-600 dark:text-slate-400">
        Paste any article URL. Our server cleans the content and uses Google's Gemini AI to generate a structured summary for you.
      </p>
    </div>
    <div className="bg-slate-200 dark:bg-slate-800 p-8 rounded-lg transition-colors">
      <h3 className="font-bold text-xl mb-2">Key Features</h3>
      <p className="text-base text-slate-600 dark:text-slate-400">
        Enjoy AI-powered summaries, customizable themes (light, dark, sepia), and a text-to-speech feature to listen on the go.
      </p>
    </div>
  </div>
);

function App() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (summary) {
      const textToSpeak = [
        summary.heading,
        summary.descriptive_paragraph,
        ...summary.bullet_points,
        summary.neutral_opinion
      ].join('. ');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSummary(null);
    setError(null);
    setLoading(true);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    try {
      const response = await fetch('https://clarity-lens-server.onrender.com/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleUrl: url }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch and parse the article.');
      }
      const summaryData = await response.json();
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const articleClasses = {
    dark: 'bg-slate-800 text-slate-200',
    light: 'bg-white text-gray-800',
    sepia: 'bg-[#f4e8d8] text-[#5b4636]'
  };

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #e2e8f0 inset !important;
          -webkit-text-fill-color: #1f2937 !important;
        }
        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover,
        .dark input:-webkit-autofill:focus,
        .dark input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #1f2937 inset !important;
          -webkit-text-fill-color: #f1f5f9 !important;
        }
      `}</style>
      <main className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-900 text-white' : (theme === 'light' ? 'bg-white text-gray-800' : 'bg-[#f4e8d8] text-[#5b4636]')}`}>
        <div className="flex flex-col min-h-screen items-center p-4">
          <div className="w-full max-w-2xl">
            <header className="text-center pt-10 md:pt-16">
              <h1 className="text-5xl md:text-6xl font-bold">
                ClarityLens
              </h1>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
                Your focused, clutter-free reading experience.
              </p>
            </header>
            <form className="mt-12" onSubmit={handleSubmit}>
              <div className="group flex items-center bg-slate-200 dark:bg-slate-800 rounded-full transition-all focus-within:ring-2 focus-within:ring-sky-500">
                <input
                  type="url"
                  className="flex-grow p-3 bg-transparent focus:outline-none text-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="Paste an article URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-full transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Clarifying...' : 'Clarify'}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col justify-center mt-8">
            <div className="my-auto">
              {!summary && !loading && !error && <InfoCards />}
            </div>
            {summary && (
              <div className={`mt-8 p-6 md:p-8 rounded-lg transition-colors duration-300 ${articleClasses[theme]}`}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{summary.heading}</h2>
                <p className="text-lg md:text-xl mb-6">{summary.descriptive_paragraph}</p>
                <ul className="space-y-3 list-disc list-inside mb-6">
                  {summary.bullet_points.map((point, index) => (
                    <li key={index} className="text-lg">{point}</li>
                  ))}
                </ul>
                <p className="text-lg italic text-slate-500 dark:text-slate-400 border-t border-slate-300 dark:border-slate-700 pt-4 mt-6">
                  {summary.neutral_opinion}
                </p>
              </div>
            )}
            
            {loading && <p className="text-center text-slate-400">Fetching summary from AI...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
          </div>

          <footer className="w-full text-center py-6 text-slate-500 dark:text-slate-600 mt-auto">
            <a href="https://github.com/amrshaikh/clarity-lens" target="_blank" rel="noopener noreferrer" className="no-underline hover:text-sky-500">
              Created by Amr
            </a>.
          </footer>
        </div>
      </main>
    </>
  );
}

export default App;

