import { useEffect, useState } from "react";
import { useMatchi } from "../context/MatchiContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UploadZone from "../components/UploadZone";
import CVSummaryCard from "../components/CVSummaryCard";
import MatchCard from "../components/MatchCard";
import MatchAnalysisModal from "../components/MatchAnalysisModal";

export default function WorkspacePage() {
  const {
    appState,
    uploadedFile,
    cvData,
    matches,
    selectedMatch,
    setSelectedMatch,
    resetApp,
    error,
    setError
  } = useMatchi();

  // Loading text cycler
  const [loadingText, setLoadingText] = useState("Parsing document structure...");
  
  useEffect(() => {
    if (appState !== "loading") return;

    const phrases = [
      "Parsing document structure...",
      "Extracting technical skills...",
      "Mapping employment history...",
      "Scanning 1,200+ active roles...",
      "Running semantic matches...",
      "Preparing recommendations..."
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % phrases.length;
      setLoadingText(phrases[currentIdx]);
    }, 550);

    return () => clearInterval(interval);
  }, [appState]);

  // Format file size nicely
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 1;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black font-sans flex flex-col selection:bg-black selection:text-white">
      <Header />

      {/* Error Alert Banner */}
      {error && (
        <div className="w-full bg-red-50 border-b border-red-200 py-3.5 px-4 md:px-12 animate-fade-in">
          <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-4">
            <div className="flex items-center gap-3 text-red-700">
              <span className="material-symbols-outlined text-[20px] select-none">
                error
              </span>
              <span className="text-sm font-semibold leading-normal">
                {error}
              </span>
            </div>
            
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-700 p-1 flex items-center justify-center transition-colors"
              aria-label="Dismiss error"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Mini Upload status bar (Only visible in results state) */}
      {appState === "results" && uploadedFile && (
        <div className="w-full bg-white border-b border-zinc-200 py-4 px-4 md:px-12 sticky top-20 z-40">
          <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-black">
              <span className="material-symbols-outlined text-emerald-500 font-bold select-none">
                check_circle
              </span>
              <span className="font-semibold text-sm truncate max-w-[200px] md:max-w-md">
                {uploadedFile.name}
              </span>
              <span className="text-zinc-400 text-xs">
                ({formatFileSize(uploadedFile.size)})
              </span>
            </div>
            
            <button
              onClick={resetApp}
              className="text-zinc-500 hover:text-black text-sm font-semibold transition-colors flex items-center gap-2 select-none"
            >
              <span className="material-symbols-outlined text-[18px]">upload</span>
              Upload different CV
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-4 md:px-12 py-8">
        
        {/* STATE A: Idle Upload */}
        {appState === "idle" && (
          <div className="flex-1 flex flex-col justify-center my-auto animate-fade-in">
            <UploadZone />
          </div>
        )}

        {/* STATE B: Loading Analysis */}
        {appState === "loading" && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 my-auto animate-fade-in">
            <div className="relative w-24 h-24 flex items-center justify-center mb-8">
              {/* Pulsing glow */}
              <div className="absolute inset-0 rounded-full bg-black/5 animate-ping"></div>
              {/* Spinning active ring */}
              <div className="absolute inset-0 rounded-full border-4 border-zinc-200 border-t-black animate-spin"></div>
              {/* Center icon */}
              <span className="material-symbols-outlined text-[36px] text-black animate-pulse">
                cognition
              </span>
            </div>
            
            <div className="text-center flex flex-col gap-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">
                Analyzing your CV
              </h2>
              <p className="text-sm text-zinc-500 font-medium min-h-[20px] transition-all duration-300">
                {loadingText}
              </p>
            </div>
          </div>
        )}

        {/* STATE C: Results Layout */}
        {appState === "results" && cvData && (
          <div className="flex-grow flex flex-col lg:flex-row gap-8 py-4 items-start animate-fade-in">
            {/* Profile Info Summary Column */}
            <CVSummaryCard cv={cvData} />

            {/* Job Match Cards Stack */}
            <section className="flex-1 flex flex-col gap-6 w-full">
              <div className="flex justify-between items-center pb-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">
                  Job Matches for You
                </h2>
                <p className="text-sm text-zinc-400 font-medium">
                  {matches.length} roles found
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {matches.map((match) => (
                  <MatchCard key={match.job.job_id} match={match} cv={cvData} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Modal display if a match is selected */}
      {selectedMatch && (
        <MatchAnalysisModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      <Footer />
    </div>
  );
}
