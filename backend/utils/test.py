import backend.utils.inference as inf
from PIL import Image
import io
from torch import cuda , device

dev = "cuda" if cuda.is_available() else "cpu"
model = inf.load_model("model_0", device(dev))
#print(model.state_dict())


file = "backend/dummy/pizza.jpg"
image = Image.open(file).convert("RGB")  # Replace with actual image bytes

class_name, confidence_score, p = inf.predict(model, image)

print(f"Predicted class: {class_name}")
print(f"Confidence scores: {confidence_score}")
