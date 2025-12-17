import { ModelId } from "@/lib/constants";

interface ModelInfoProps {
    modelId: ModelId;
}

// Dummy data map
const MODEL_DATA = {
    resnet18: {
        description: "ResNet-18 is a convolutional neural network that is 18 layers deep. It is known for its residual learning framework to ease the training of networks that are substantially deeper than those used previously.",
        architecture: "ResNet-18",
        accuracy: "92.5%",
        inferenceTime: "~45ms",
        parameters: "11.7 M",
        size: "45 MB",
        trainingImages: "101,000",
        paperUrl: "https://arxiv.org/abs/1512.03385"
    },
    lenet64: {
        description: "LeNet is a simpler architecture, effective for smaller datasets and basic image recognition tasks. This variant uses 64 filters.",
        architecture: "LeNet-64 (Custom)",
        accuracy: "85.2%",
        inferenceTime: "~15ms",
        parameters: "0.5 M",
        size: "1.3 MB",
        trainingImages: "101,000",
        paperUrl: "http://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf"
    },
    tinyvgg: {
        description: "TinyVGG is a smaller, optimized version of the VGG network, designed for educational purposes and lightweight inference.",
        architecture: "TinyVGG",
        accuracy: "78.4%",
        inferenceTime: "~10ms",
        parameters: "0.2 M",
        size: "5.1 MB",
        trainingImages: "101,000",
        paperUrl: "https://poloclub.github.io/cnn-explainer/"
    }
};

export function ModelInfo({ modelId }: ModelInfoProps) {
    const info = MODEL_DATA[modelId];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{info.architecture}</h3>
                <p className="text-zinc-400 leading-relaxed">{info.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InfoCard label="Accuracy" value={info.accuracy} />
                <InfoCard label="Inf. Time" value={info.inferenceTime} />
                <InfoCard label="Parameters" value={info.parameters} />
                <InfoCard label="Model Size" value={info.size} />
                <InfoCard label="Training Set" value={info.trainingImages} />
            </div>

            <div className="pt-4 border-t border-zinc-800">
                <a
                    href={info.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium hover:underline inline-flex items-center gap-1"
                >
                    View Research Paper ↗
                </a>
            </div>
        </div>
    );
}

function InfoCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</div>
            <div className="text-lg font-semibold text-zinc-200">{value}</div>
        </div>
    );
}
