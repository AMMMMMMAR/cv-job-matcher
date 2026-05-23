import { Link, useNavigate } from "react-router-dom";
import { useMatchi } from "../context/MatchiContext";
import { mockCV, mockMatches } from "../data/mockData";
import FeatureCards from "../components/FeatureCards";
import FlowDiagram from "../components/FlowDiagram";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const { setAppState, setCvData, setMatches, setUploadedFile } = useMatchi();

  // Jump straight to the results view for demo purposes
  const handleDemoClick = () => {
    // Create a dummy File object so standard logic works
    const dummyFile = new File([""], "alex_rivera_cv.pdf", {
      type: "application/pdf"
    });
    setUploadedFile(dummyFile);
    setCvData(mockCV);
    setMatches(mockMatches);
    setAppState("results");
    navigate("/match");
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black font-sans flex flex-col selection:bg-black selection:text-white">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 md:px-12 py-16 md:py-24 flex-1 flex flex-col gap-24">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black leading-[1.05]">
              Find your perfect tech match instantly
            </h1>
            <p className="text-base md:text-lg text-zinc-500 max-w-xl leading-relaxed">
              Upload your CV to run semantic matching against top industry job postings. Completely private, secure, and instant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                to="/match"
                className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-bold text-center hover:opacity-90 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                Match My CV
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <button
                onClick={handleDemoClick}
                className="bg-zinc-150 hover:bg-zinc-200 text-black border border-zinc-300 px-8 py-3.5 rounded-full text-sm font-bold text-center transition-all active:scale-95 shadow-sm"
              >
                View Demo Workspace
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 w-full">
            <FlowDiagram />
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
              Designed for privacy and speed
            </h2>
            <p className="text-sm md:text-base text-zinc-500 max-w-lg">
              We leverage advanced semantic models to process your resume, highlighting exactly why you fit the role.
            </p>
          </div>
          <FeatureCards />
        </section>
      </main>

      <Footer />
    </div>
  );
}
