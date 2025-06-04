#The functions in this fi=le are used to load the model and make predictions

import torch
from torchvision import transforms
from PIL import Image
from typing import List, Tuple, Dict
from backend.models.architecture import TinyVGG

model_map = {
    "model_0": "backend/models/sample_model_0.pth",
    "model_1": "backend/models/sample_model_1.pth",
    "pizza_steak_sushi": "backend/models/pizza_steak_sushi.pth.pt"
}

test_transform = transforms.Compose([
    transforms.Resize(size=(64,64)),
    transforms.ToTensor(),
])

test_transform2 = transforms.Compose([
    transforms.Resize(size = (224 , 224)),
    transforms.ToTensor(),
    transforms.Normalize(                     # Normalize to ImageNet mean/std
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

classes = ["Pizza", "Steak" , "Sushi"]

def load_model(model_name: str, device: torch.device) -> torch.nn.Module:
    """
    Load a model from the specified path.
    
    Args:
        model_name (str): The name of the model to load.
        
    Returns:
        torch.nn.Module: The loaded model.
    """
    if model_name not in model_map:
        raise ValueError(f"Model {model_name} not found.")
    
    
    model_path = model_map[model_name]
    if model_name == "pizza_steak_sushi":
        checkpoint = torch.load(model_path, map_location=device)
        state_dict = checkpoint["model_state_dict"]
    else:
        state_dict = torch.load(model_path, map_location=torch.device(device), weights_only=True)
    model = TinyVGG(input_layer=3, hidden_layer=10, output_layer=len(classes)).to(device)
    model.load_state_dict(state_dict)
    return model




def predict(model: torch.nn.Module, image: Image.Image ) -> Tuple[str ,int , Dict[str, float]]:
    """
    Make a prediction using the loaded model and inputted data.

    Args:
        model (torch.nn.Module): The loaded model.
        input (torch.Tensor): The input data for prediction.
    Returns:
        Tuple(class_name , confidence_scores):
            class_name (str): The predicted class name.
            confidence_scores (Dict): A dictionary of class names and their corresponding confidence scores.
    """
    if not isinstance(image, Image.Image):
        raise ValueError("Input must be a PIL Image.")
    input_tensor = test_transform2(image)
    if not isinstance(input_tensor, torch.Tensor):
        raise ValueError("Transformed image is not a tensor.")
    input_tensor = input_tensor.unsqueeze(0)  # Add batch dimension


    model.eval()
    with torch.inference_mode():
        pred_logits = model(input_tensor)
        pred_probs = torch.softmax(pred_logits, dim=1)
    pred_class = int(torch.argmax(pred_probs, dim=1).item())
    pred_scores = {classes[i]: float(pred_probs[0, i]) for i in range(len(classes))}

    return classes[pred_class], pred_class,  pred_scores


