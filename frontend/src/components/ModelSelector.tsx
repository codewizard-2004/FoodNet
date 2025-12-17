import { MODELS, ModelId } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

interface ModelSelectorProps {
    selectedModel: ModelId;
    onSelect: (id: ModelId) => void;
    disabled?: boolean;
}

export function ModelSelector({ selectedModel, onSelect, disabled }: ModelSelectorProps) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-zinc-400 mb-2">
                Select Model
            </label>
            <div className="relative">
                <select
                    value={selectedModel}
                    onChange={(e) => onSelect(e.target.value as ModelId)}
                    disabled={disabled}
                    className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-all hover:border-zinc-600 cursor-pointer"
                >
                    {MODELS.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.name}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
            </div>
        </div>
    );
}
