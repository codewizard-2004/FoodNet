import axios from "axios";
import { API_URL } from "./constants";

export interface PredictionOption {
    label: string;
    probability: number;
}

export interface PredictionResponse {
    model: string;
    prediction: string;
    confidence: number;
    probabilities: Record<string, number>;
}

export const api = {
    predict: async (modelId: string, imageFile: File): Promise<PredictionResponse> => {
        const formData = new FormData();
        formData.append("file", imageFile);

        try {
            const response = await axios.post<PredictionResponse>(
                `${API_URL}/predict/${modelId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },
};
