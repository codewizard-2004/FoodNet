"use client";

import { TopBar } from "@/components/TopBar";
import { GITHUB_REPO_URL, PYTORCH_MODEL_REPO_URL } from "@/lib/constants";
import { ArrowLeft, Brain, Code2, Database, Layers, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black relative selection:bg-emerald-500/30 selection:text-emerald-200">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/05 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/05 blur-[120px] rounded-full" />
            </div>

            <TopBar />

            <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Header */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                            About FoodVision
                        </h1>
                        <p className="text-xl text-zinc-400 leading-relaxed">
                            An educational project exploring the intersection of Computer Vision and modern Web Development.
                        </p>
                    </div>

                    {/* Educational Journey */}
                    <div className="glass-panel p-8 md:p-10 border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-3 mb-4">
                            <GraduationCap className="w-8 h-8 text-emerald-500" />
                            <h2 className="text-2xl font-bold text-white">Educational Journey</h2>
                        </div>
                        <div className="space-y-4 text-zinc-300 leading-relaxed">
                            <p>
                                This project was created for educational purposes to deeply understand the mechanics of Convolutional Neural Networks (CNNs).
                                Instead of relying solely on pre-trained models, I implemented these models from scratch using
                                <strong className="text-emerald-400"> PyTorch</strong> and <strong className="text-emerald-400">Torchvision</strong>.
                            </p>
                            <p>
                                The process involved reading original research papers, understanding the architecture, and implementing them line-by-line.
                                I utilized <strong className="text-emerald-400">Torch Transforms</strong> for data augmentation to improve model robustness.
                                This hands-on approach provided invaluable insights into:
                            </p>
                            <p>
                                After implementing these models in PyTorch, I converted them to Open Neural Network Exchange (ONNX) format.
                                This allowed me to deploy the models on the web using <strong className="text-emerald-400">ONNX Runtime</strong>.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
                                <li>Layer-wise feature extraction</li>
                                <li>Backpropagation and optimization dynamics</li>
                                <li>Overfitting mitigation strategies</li>
                                <li>Model deployment pipelines</li>
                            </ul>
                            <div className="pt-4">
                                <Link
                                    href={PYTORCH_MODEL_REPO_URL}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
                                >
                                    View Model Implementations <Brain className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Frontend */}
                        <div className="glass-panel p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Layers className="w-6 h-6 text-cyan-400" />
                                <h3 className="text-xl font-bold text-white">Frontend Architecture</h3>
                            </div>
                            <ul className="space-y-3 text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2" />
                                    <span><strong className="text-zinc-200">Next.js 15 (App Router)</strong> for robust server-side rendering and routing.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2" />
                                    <span><strong className="text-zinc-200">Tailwind CSS v4</strong> for modern, utility-first styling.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2" />
                                    <span><strong className="text-zinc-200">Framer Motion</strong> for fluid animations and micro-interactions.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2" />
                                    <span><strong className="text-zinc-200">Chart.js</strong> for visualizing prediction probabilities.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Backend */}
                        <div className="glass-panel p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="w-6 h-6 text-emerald-400" />
                                <h3 className="text-xl font-bold text-white">Backend Infrastructure</h3>
                            </div>
                            <ul className="space-y-3 text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                    <span><strong className="text-zinc-200">FastAPI</strong> for high-performance Python API endpoints.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                    <span><strong className="text-zinc-200">ONNX Runtime</strong> for optimized model inference.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                    <span><strong className="text-zinc-200">PyTorch</strong> for model training and export.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                    <span><strong className="text-zinc-200">Python</strong> for core logic and data processing.</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="text-center pt-8 border-t border-zinc-800">
                        <p className="text-zinc-500">
                            Built with ❤️ by <a href={GITHUB_REPO_URL} target="_blank" className="hover:text-white transition-colors">CodeWizard</a>
                        </p>
                    </div>

                </div>
            </div>
        </main>
    );
}
