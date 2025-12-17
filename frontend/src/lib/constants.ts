export const API_URL = "http://127.0.0.1:8000";

export const MODELS = [
    { id: "resnet18", name: "ResNet 18" },
    { id: "lenet64", name: "LeNet 64" },
    { id: "tinyvgg", name: "Tiny VGG" },
] as const;

export type ModelId = (typeof MODELS)[number]["id"];

export const GITHUB_REPO_URL = "https://github.com/your-repo/foodvision"; // Placeholder
export const PYTORCH_MODEL_REPO_URL = "https://github.com/your-repo/foodvision-pytorch"; // Placeholder
