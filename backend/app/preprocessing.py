from PIL import Image
import numpy as np

def preprocess(image: Image.Image, model_name: str = "resnet18") -> np.ndarray:
    """
    Preprocess the image for the model.
    Resizes to 224x224 (or 64x64 for lenet64), normalizes, and creates batch dimension.
    """
    if model_name =="lenet64":
        image = image.resize((64, 64))
    else:
        image = image.resize((224, 224))
    
    # Convert to numpy array and normalize to [0, 1]
    img_array = np.array(image).astype(np.float32) / 255.0
    
    # Standard ImageNet normalization
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    
    img_array = (img_array - mean) / std
    
    # Transpose to (C, H, W)
    img_array = img_array.transpose(2, 0, 1)
    
    # Add batch dimension (B, C, H, W)
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array
