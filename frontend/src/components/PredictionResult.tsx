"use client";

import { PredictionResponse } from "@/lib/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PredictionResultProps {
    result: PredictionResponse;
    onWrongPrediction: () => void;
    onGetInsights: () => void;
}

export function PredictionResult({ result, onWrongPrediction, onGetInsights }: PredictionResultProps) {
    const sortedProbs = Object.entries(result.probabilities)
        .sort(([, a], [, b]) => b - a);

    const chartData = {
        labels: Object.keys(result.probabilities),
        datasets: [
            {
                data: Object.values(result.probabilities),
                backgroundColor: [
                    'rgba(52, 211, 153, 0.8)', // Emerald 400
                    'rgba(251, 191, 36, 0.8)', // Amber 400
                    'rgba(248, 113, 113, 0.8)', // Red 400
                    'rgba(96, 165, 250, 0.8)', // Blue 400
                    'rgba(167, 139, 250, 0.8)', // Violet 400
                ],
                borderColor: [
                    'rgba(52, 211, 153, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(248, 113, 113, 1)',
                    'rgba(96, 165, 250, 1)',
                    'rgba(167, 139, 250, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#e4e4e7', // zinc-200
                    font: {
                        family: 'sans-serif',
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(24, 24, 27, 0.9)', // zinc-950
                titleColor: '#fff',
                bodyColor: '#e4e4e7',
            }
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">

            {/* Top Prediction */}
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-zinc-400 text-sm uppercase tracking-wider">Top Prediction</h3>
                    <span className="text-xs font-mono text-zinc-500">{(result.confidence * 100).toFixed(2)}% Confidence</span>
                </div>
                <div className="flex items-end gap-3 mb-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent capitalize">
                        {result.prediction}
                    </h2>
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
                </div>

                {/* Confidence Bar */}
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden mt-2">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 ease-out"
                        style={{ width: `${result.confidence * 100}%` }}
                    />
                </div>
            </div>

            {/* Pie Chart & Probabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
                    <h4 className="text-zinc-400 text-sm mb-4 w-full text-left">Distribution</h4>
                    <div className="w-48 h-48">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800 overflow-y-auto max-h-[300px]">
                    <h4 className="text-zinc-400 text-sm mb-4">Class Probabilities</h4>
                    <div className="space-y-3">
                        {sortedProbs.map(([label, prob]) => (
                            <div key={label} className="flex items-center justify-between text-sm">
                                <span className="text-zinc-300 capitalize">{label}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full",
                                                label === result.prediction ? "bg-emerald-500" : "bg-zinc-600"
                                            )}
                                            style={{ width: `${prob * 100}%` }}
                                        />
                                    </div>
                                    <span className="font-mono text-zinc-500 w-12 text-right">
                                        {(prob * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                <button
                    onClick={onWrongPrediction}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                >
                    <AlertTriangle className="w-4 h-4" />
                    Report Wrong Prediction
                </button>

                <button
                    onClick={onGetInsights}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-all border border-emerald-500/20 hover:border-emerald-500/40"
                >
                    Get Nutrition Insights
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
            </div>

        </div>
    );
}
