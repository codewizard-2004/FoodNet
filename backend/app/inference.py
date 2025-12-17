import numpy as np
import onnxruntime as ort


def softmax(x: np.ndarray) -> np.ndarray:
    """
    Numerically stable softmax.
    """
    x = x - np.max(x, axis=1, keepdims=True)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x, axis=1, keepdims=True)


def run_inference(
    session: ort.InferenceSession,
    input_array: np.ndarray
):
    """
    Run inference and return:
      - predicted class index
      - probability vector for all classes
    """

    input_name = session.get_inputs()[0].name
    outputs = session.run(None, {input_name: input_array})

    logits = outputs[0]              # shape: (1, num_classes)
    probs = softmax(logits)          # shape: (1, num_classes)

    pred_index = int(np.argmax(probs, axis=1)[0])

    return pred_index, probs[0]       # return 1D array
