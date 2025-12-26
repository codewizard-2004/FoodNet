
"use client";

import { Utensils, Flame, Wheat, Droplets, Beef, Youtube, Leaf, Candy, PlayCircle, ChefHat } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import axios from "axios";

interface NutritionInsightsProps {
    foodName: string;
}

interface NutrientData {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
}

interface VideoResponse {
    title: string;
    url: string;
    thumbnail: string;
    duration: string;
}

interface RecipeResponse {
    food: string;
    background: string;
    ingredients: string[];
}

// Fallback/Dummy data generator for missing fields or errors
const getFallbackData = (food: string) => {
    const hash = food.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
        description: `A delicious serving of ${food}. This dish is known for its rich flavors and nutritional balance.Perfect for a hearty meal.`,
        cookingTip: "For best results, consume fresh. Store in a cool, dry place if saving for later.",
        youtubeLink: `https://www.youtube.com/results?search_query=how+to+make+${food}`
    };
};

export function NutritionInsights({ foodName }: NutritionInsightsProps) {
    const [data, setData] = useState<NutrientData | null>(null);
    const [videoData, setVideoData] = useState<VideoResponse | null>(null);
    const [recipeData, setRecipeData] = useState<RecipeResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [videoLoading, setVideoLoading] = useState(true);
    const [recipeLoading, setRecipeLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const fallbackInfo = getFallbackData(foodName);

    // Fetch Nutrition Data from Supabase
    useEffect(() => {
        async function fetchNutrients() {
            setLoading(true);
            setError(null);
            try {
                if (!supabase) {
                    setError("Database connection missing. Check .env configuration.");
                    setLoading(false);
                    return;
                }

                // Determine the label to search for (handling case sensitivity if needed)
                // Assuming the database labels are lowercased or standardized. 
                // We'll try exact match first.
                // The 'label' column in DB matches the foodName (prediction).

                const { data: nutrients, error: fetchError } = await supabase
                    .from('nutrients')
                    .select('*')
                    .eq('label', foodName) // Assuming exact match for now
                    .single();

                if (fetchError) {
                    if (fetchError.code === 'PGRST116') { // JSON code for no rows found
                        setError("No nutrition data found for this food.");
                    } else {
                        throw fetchError;
                    }
                } else if (nutrients) {
                    setData({
                        calories: nutrients.calories,
                        protein: nutrients.protein,
                        carbs: nutrients.carbs,
                        fat: nutrients.fat,
                        fiber: nutrients.fiber,
                        sugar: nutrients.sugar
                    });
                }
            } catch (err) {
                console.error("Error fetching nutrients:", err);
                setError("Failed to load nutrition insights.");
            } finally {
                setLoading(false);
            }
        }

        if (foodName) {
            fetchNutrients();
        }
    }, [foodName]);

    // Fetch Video from RAG Server (via local Proxy to avoid CORS)
    useEffect(() => {
        async function fetchVideo() {
            setVideoLoading(true);
            try {
                // Call our own Next.js API route which proxies to the RAG server
                const response = await axios.post<VideoResponse>('/api/video', {
                    food_name: foodName
                });

                if (response.data) {
                    setVideoData(response.data);
                }
            } catch (err) {
                console.error("Error fetching video:", err);
                // Fail silently for video, falling back to generic link
            } finally {
                setVideoLoading(false);
            }
        }

        if (foodName) {
            fetchVideo();
        }
    }, [foodName]);

    // Fetch Recipe Info (Background/Ingredients) from RAG Server (via local Proxy)
    useEffect(() => {
        async function fetchRecipe() {
            setRecipeLoading(true);
            try {
                const response = await axios.post<RecipeResponse>('/api/recipe', {
                    food_name: foodName
                });
                if (response.data) {
                    setRecipeData(response.data);
                }
            } catch (err) {
                console.error("Error fetching recipe:", err);
            } finally {
                setRecipeLoading(false);
            }
        }

        if (foodName) {
            fetchRecipe();
        }
    }, [foodName]);

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

            {loading ? (
                <div className="text-center py-12 text-zinc-500 animate-pulse">
                    Loading nutrition data...
                </div>
            ) : error ? (
                <div className="text-center py-8 text-zinc-400 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                    <p>{error}</p>
                    <p className="text-xs mt-2 text-zinc-600">Showing generic info below</p>
                </div>
            ) : data ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <NutritionCard icon={<Flame className="w-5 h-5 text-orange-500" />} label="Calories" value={`${data.calories} kcal`} />
                    <NutritionCard icon={<Beef className="w-5 h-5 text-red-500" />} label="Protein" value={`${data.protein}g`} />
                    <NutritionCard icon={<Wheat className="w-5 h-5 text-amber-500" />} label="Carbs" value={`${data.carbs}g`} />
                    <NutritionCard icon={<Droplets className="w-5 h-5 text-yellow-500" />} label="Fats" value={`${data.fat}g`} />
                    <NutritionCard icon={<Leaf className="w-5 h-5 text-green-500" />} label="Fiber" value={`${data.fiber}g`} />
                    <NutritionCard icon={<Candy className="w-5 h-5 text-pink-500" />} label="Sugar" value={`${data.sugar}g`} />
                </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-200">Analysis</h3>

                    {recipeLoading ? (
                        <div className="space-y-3">
                            <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-zinc-800 rounded w-full animate-pulse" />
                            <div className="h-4 bg-zinc-800 rounded w-5/6 animate-pulse" />
                        </div>
                    ) : (
                        <p className="text-zinc-400 leading-relaxed">
                            {recipeData?.background || fallbackInfo.description}
                        </p>
                    )}

                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                        <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                            <ChefHat className="w-4 h-4 text-emerald-500" />
                            {recipeData ? "Main Ingredients" : "Cooking Tip"}
                        </h4>

                        {recipeLoading ? (
                            <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse" />
                        ) : recipeData?.ingredients ? (
                            <div className="flex flex-wrap gap-2">
                                {recipeData.ingredients.slice(0, 8).map((ing, i) => (
                                    <span key={i} className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700 capitalize">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm italic">"{fallbackInfo.cookingTip}"</p>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-200">Recipe & Guide</h3>
                    {videoLoading ? (
                        <div className="h-48 rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse flex items-center justify-center">
                            <p className="text-zinc-600 text-sm">Finding best recipe...</p>
                        </div>
                    ) : (
                        <a
                            href={videoData?.url || fallbackInfo.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 transition-all"
                        >
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors z-20">
                                <div className="w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                    <Youtube className="w-6 h-6 text-white fill-current" />
                                </div>
                            </div>

                            {/* Thumbnail */}
                            {videoData?.thumbnail ? (
                                <div className="w-full h-48 relative">
                                    <img
                                        src={videoData.thumbnail}
                                        alt={videoData.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                <p className="text-white font-medium group-hover:underline decoration-red-500 line-clamp-1">
                                    {videoData?.title || `Watch how to make ${foodName}`}
                                </p>
                                {videoData?.duration && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <PlayCircle className="w-3 h-3 text-zinc-400" />
                                        <span className="text-xs text-zinc-400">{videoData.duration}</span>
                                    </div>
                                )}
                            </div>
                        </a>
                    )}
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
