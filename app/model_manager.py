import gc
from pathlib import Path
import onnxruntime as ort

class ModelManager:
    """
    This class is responsible for dynamically loading and unloading ONNX models for inference.
    It ensures that only ONE model is resident in memory at a time.
    """
    def __init__(self):
        self._session = None # stores the current model object
        self._current_model = None # stores the name of the current model\
        self._model_path = Path(__file__).parent / "models"
    
    def load(self, model_name: str) -> ort.InferenceSession:
        """
        Load an ONNX model for inference.
        Args:
            model_name (str): Name of the model to load.
        Returns:
            ort.InferenceSession: The loaded model session.
        """
        if self._current_model == model_name and self._session is not None:
            return self._session
        
        # unload the previous model
        self.unload()

        # load the new model
        model_path = self._model_path / f"{model_name}.onnx"
        if not model_path.exists():
            raise ValueError(f"Model {model_name} not found")
        
        # create an onnx session
        self._session = ort.InferenceSession(
            str(model_path), 
            providers=["CUDAExecutionProvider", "CPUExecutionProvider"]
        )
        self._current_model = model_name
        return self._session
    
    def get_current_model(self):
        """
        Get the name of the current model.
        Returns:
            str: The name of the current model.
        """
        return self._current_model
    
    def unload(self):
        """
        Unload the current model from memory.
        """
        if self._session is not None:
            del self._session
            self._session = None
            self._current_model = None
            gc.collect()


if __name__ == "__main__":
    model_manager = ModelManager()
    session = model_manager.load("resnet18")
    print(model_manager.get_current_model())

    model_manager.load("lenet64")
    print(model_manager.get_current_model())

    model_manager.load("tinyvgg")
    print(model_manager.get_current_model())

    model_manager.unload()
    print(model_manager.get_current_model())
