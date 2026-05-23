import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AppState, CV, Match } from "../types";
import { uploadCV } from "../api/client";

type MatchiContextType = {
  appState: AppState;
  setAppState: (state: AppState) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  cvData: CV | null;
  setCvData: (data: CV | null) => void;
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  selectedMatch: Match | null;
  setSelectedMatch: (match: Match | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  findMatches: (file?: File) => void;
  resetApp: () => void;
};

const MatchiContext = createContext<MatchiContextType | undefined>(undefined);

export function MatchiProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<AppState>("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvData, setCvData] = useState<CV | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);

  const findMatches = async (file?: File) => {
    const fileToUse = file || uploadedFile;
    if (!fileToUse) return;
    
    setAppState("loading");
    setError(null);
    
    try {
      const data = await uploadCV(fileToUse);
      setCvData(data.cv);
      setMatches(data.matches);
      setAppState("results");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setAppState("idle");
    }
  };

  const resetApp = () => {
    setAppState("idle");
    setUploadedFile(null);
    setCvData(null);
    setMatches([]);
    setSelectedMatch(null);
    setError(null);
  };

  return (
    <MatchiContext.Provider
      value={{
        appState,
        setAppState,
        uploadedFile,
        setUploadedFile,
        cvData,
        setCvData,
        matches,
        setMatches,
        selectedMatch,
        setSelectedMatch,
        error,
        setError,
        findMatches,
        resetApp
      }}
    >
      {children}
    </MatchiContext.Provider>
  );
}

export function useMatchi() {
  const context = useContext(MatchiContext);
  if (context === undefined) {
    throw new Error("useMatchi must be used within a MatchiProvider");
  }
  return context;
}
