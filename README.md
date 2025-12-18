# FoodVision API Backend

This is the FastAPI backend for the FoodVision project, designed to classify food images (pizza, steak, sushi) using ONNX models.

## Features

- **FastAPI Framework**: High-performance, easy-to-use web framework.
- **ONNX Runtime**: Efficient inference for machine learning models.
- **Model Management**: Dynamic loading and unloading of models to optimize memory usage.
- **Image Preprocessing**: Automatic resizing (224x224 for standard models, 64x64 for LeNet) and normalization.
- **Memory Monitoring**: Endpoint to track RAM usage.

## Setup

1.  **Create Virtual Environment** (optional but recommended):
    ```bash
    python -m venv backvenv
    source backvenv/bin/activate  # Linux/Mac
    .\backvenv\Scripts\activate   # Windows
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

Run the server using `uvicorn`:

```bash
uvicorn app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

## API Endpoints

### 1. Health Check
*   **URL**: `/`
*   **Method**: `GET`
*   **Description**: Returns server status.
*   **Response**: `{"status": "ok"}`

### 2. Predict Image Class
*   **URL**: `/predict/{model_name}`
*   **Method**: `POST`
*   **Description**: Upload an image to get a classification prediction.
*   **Path Parameters**:
    *   `model_name`: Name of the model to use (e.g., `resnet18`, `lenet64`, `tinyvgg`).
*   **Body**: `form-data` with key `file` (image file).
*   **Response**:
    ```json
    {
        "model": "resnet18",
        "prediction": "pizza",
        "confidence": 0.98,
        "probabilities": {
            "pizza": 0.98,
            "steak": 0.01,
            "sushi": 0.01
        }
    }
    ```

## Directory Structure

*   `app/`: Main application source code.
    *   `main.py`: API routes and configuration.
    *   `model_manager.py`: Handles loading/unloading ONNX models.
    *   `preprocessing.py`: Image transformation logic.
    *   `inference.py`: ONNX Runtime execution logic.
    *   `models/`: Directory storing `.onnx` model files.

## Supported Models

Ensure these models are present in `app/models/`:
- `resnet18.onnx`
- `lenet64.onnx`
- `tinyvgg.onnx`

## Future Plans

- Add more models
- Add RAG system to provide nutrition facts, cooking

