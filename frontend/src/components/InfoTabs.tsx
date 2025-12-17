"use client";

import { cn } from "@/lib/utils";
import { Brain, Sparkles } from "lucide-react";

interface InfoTabsProps {
    activeTab: "info" | "result";
    onTabChange: (tab: "info" | "result") => void;
    disabledResult?: boolean;
}

export function InfoTabs({ activeTab, onTabChange, disabledResult }: InfoTabsProps) {
    return (
        <div className="flex p-1 bg-zinc-900 rounded-lg border border-zinc-800 mb-6 w-fit">
            <button
                onClick={() => onTabChange("info")}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all relative",
                    activeTab === "info"
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300"
                )}
            >
                <Brain className="w-4 h-4" />
                Model Info
            </button>
            <button
                onClick={() => onTabChange("result")}
                disabled={disabledResult}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all relative",
                    activeTab === "result"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300",
                    disabledResult && "opacity-50 cursor-not-allowed hover:text-zinc-500"
                )}
            >
                <Sparkles className="w-4 h-4" />
                Prediction Result
                {!disabledResult && activeTab !== "result" && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                )}
            </button>
        </div>
    );
}
