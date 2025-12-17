import { Github, Info, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { GITHUB_REPO_URL, PYTORCH_MODEL_REPO_URL } from "@/lib/constants";

export function TopBar() {
    return (
        <header className="w-full h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <BrainCircuit className="w-8 h-8 text-emerald-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    FoodVision
                </span>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                    title="Project Repo"
                >
                    <Github className="w-5 h-5" />
                </Link>
                <Link
                    href={PYTORCH_MODEL_REPO_URL}
                    target="_blank"
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white relative"
                    title="PyTorch Models Repo"
                >
                    <Github className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 text-[10px] bg-emerald-600 text-white px-1 rounded-full">AI</span>
                </Link>
                <Link
                    href="/about"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all"
                >
                    <Info className="w-4 h-4" />
                    About
                </Link>
            </div>
        </header>
    );
}
