import backend.utils.inference as inf
from PIL import Image
import io

model = inf.load_model("model_0", "cpu")
#print(model.state_dict())


file = "backend/dummy/pizza.jpg"
image = Image.open(file).convert("RGB")  # Replace with actual image bytes

class_name, confidence_score = inf.predict(model, image)
print(f"Predicted class: {class_name}")
print(f"Confidence scores: {confidence_score}")
