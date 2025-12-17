"use client";

import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { ModelSelector } from "@/components/ModelSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { InfoTabs } from "@/components/InfoTabs";
import { ModelInfo } from "@/components/ModelInfo";
import { PredictionResult } from "@/components/PredictionResult";
import { NutritionInsights } from "@/components/NutritionInsights";
import { api, PredictionResponse } from "@/lib/api";
import { ModelId } from "@/lib/constants";
import { Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<ModelId>("resnet18");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "result">("info");
  const [showInsights, setShowInsights] = useState(false);
  const insightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showInsights && insightsRef.current) {
      // Small timeout to ensure DOM is ready and layout is stable
      setTimeout(() => {
        insightsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showInsights]);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const result = await api.predict(selectedModel, selectedFile);
      setPredictionResult(result);
      setActiveTab("result");
      setShowInsights(false);
    } catch (error) {
      alert("Failed to analyze image. Please check backend connection.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWrongPrediction = () => {
    alert("Feedback received! This will help improve future models.");
  };

  return (
    <main className="min-h-screen bg-black relative selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <TopBar />

      <div className="max-w-6xl mx-auto p-6 md:p-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">

          {/* Left Column: Controls */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Model & Upload Section */}
            <div className="glass-panel p-6 space-y-6">
              <ModelSelector
                selectedModel={selectedModel}
                onSelect={setSelectedModel}
                disabled={isLoading}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-400">
                  Input Image
                </label>
                <ImageUploader
                  onFileSelect={(file) => {
                    setSelectedFile(file);
                    setPredictionResult(null); // Reset result on new file
                    setShowInsights(false);
                    if (activeTab === 'result') setActiveTab('info');
                  }}
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || isLoading}
                className={cn(
                  "w-full py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg",
                  !selectedFile || isLoading
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 hover:scale-[1.02] shadow-emerald-500/20 active:scale-[0.98]"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze Image
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Info & Results */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="glass-panel p-6 h-full min-h-[600px]">
              <InfoTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                disabledResult={!predictionResult}
              />

              <div className="mt-4">
                {activeTab === "info" ? (
                  <ModelInfo modelId={selectedModel} />
                ) : (
                  predictionResult && (
                    <PredictionResult
                      result={predictionResult}
                      onWrongPrediction={handleWrongPrediction}
                      onGetInsights={() => setShowInsights(true)}
                    />
                  )
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Nutrition Insights Section */}
        {showInsights && predictionResult && (
          <div ref={insightsRef}>
            <NutritionInsights foodName={predictionResult.prediction} />
          </div>
        )}

      </div>
    </main>
  );
}
