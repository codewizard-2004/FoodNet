"use client";

import { Utensils, Flame, Wheat, Droplets, Beef, Youtube } from "lucide-react";

interface NutritionInsightsProps {
    foodName: string;
}

// Dummy data generator
const getDummyData = (food: string) => {
    // Simple deterministic hash for "random" but consistent data
    const hash = food.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return {
        calories: 200 + (hash % 500),
        protein: 10 + (hash % 30),
        carbs: 20 + (hash % 60),
        fat: 5 + (hash % 20),
        description: `A delicious serving of ${food}. This dish is known for its rich flavors and nutritional balance. Perfect for a hearty meal.`,
        cookingTip: "For best results, consume fresh. Store in a cool, dry place if saving for later.",
        youtubeLink: `https://www.youtube.com/results?search_query=how+to+make+${food}`
    };
};

export function NutritionInsights({ foodName }: NutritionInsightsProps) {
    const data = getDummyData(foodName);

    return (
        <div className="glass-panel p-6 animate-in slide-in-from-bottom-8 duration-700 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Utensils className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white capitalize">Nutrition & Insights</h2>
                    <p className="text-zinc-400 text-sm">AI-powered breakdown for {foodName}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <NutritionCard icon={<Flame className="w-5 h-5 text-orange-500" />} label="Calories" value={`${data.calories} kcal`} />
                <NutritionCard icon={<Beef className="w-5 h-5 text-red-500" />} label="Protein" value={`${data.protein}g`} />
                <NutritionCard icon={<Wheat className="w-5 h-5 text-amber-500" />} label="Carbs" value={`${data.carbs}g`} />
                <NutritionCard icon={<Droplets className="w-5 h-5 text-yellow-500" />} label="Fats" value={`${data.fat}g`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-200">Analysis</h3>
                    <p className="text-zinc-400 leading-relaxed">{data.description}</p>

                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                        <h4 className="text-sm font-medium text-zinc-300 mb-2">Cooking Tip</h4>
                        <p className="text-zinc-500 text-sm italic">"{data.cookingTip}"</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-200">Recipe & Guide</h3>
                    <a
                        href={data.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 transition-all"
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <Youtube className="w-6 h-6 text-white fill-current" />
                            </div>
                        </div>
                        {/* Simulated Thumbnail Background (Gradient) */}
                        <div className="w-full h-48 bg-gradient-to-br from-zinc-800 to-zinc-900" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white font-medium group-hover:underline decoration-red-500">Watch how to make {foodName}</p>
                        </div>
                    </a>
                </div>
            </div>

        </div>
    );
}

function NutritionCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
            <div className="p-2 bg-zinc-800 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-xs text-zinc-500 uppercase font-medium">{label}</p>
                <p className="text-xl font-bold text-zinc-200">{value}</p>
            </div>
        </div>
    )
}
