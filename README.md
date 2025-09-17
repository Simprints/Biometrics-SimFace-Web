# Biometrics SimFace Web

This project provides a web UI for [SimFace](https://simprints.github.io/Biometrics-SimFace). It was developed as a Lego Days project in H2 2025.

---

## App Architecture

The application is built using a **Next.js** frontend. The core of the application lies in its ability to perform face detection and recognition directly in the browser, using a combination of **TensorFlow.js**, **ONNX Runtime Web**, and the **EdgeFace** biometric embedding model found in **SimFace**.

- **Frontend**: A **React**-based single-page application built with **Next.js**. The UI is styled with **Tailwind CSS**.
- **Face Detection**: The application uses the `@tensorflow-models/face-landmarks-detection` library to locate faces within an image.
- **Face Recognition**: Once a face is detected, the application uses a pre-trained **EdgeFace** model (the same model as used in SimFace), converted to the **ONNX** format, to generate a feature vector (embedding) for that face.
- **ONNX Runtime**: The **ONNX Runtime Web** library is used to run the EdgeFace model in the browser.
- **Image Processing**: The application uses the `@techstark/opencv-js` library for various image processing tasks, such as cropping and resizing images before feeding them to the face detection and recognition models.

---

## EdgeFace Model Conversion

The EdgeFace model used in this project was originally a PyTorch model. To use it in the browser with ONNX Runtime, it had to be converted to the ONNX format. Here are the steps that were taken to perform this conversion:

1.  **Load the PyTorch Model**: The first step is to load the pre-trained EdgeFace model using PyTorch. The model architecture is defined in the `hubconf.py` file of the [original repository](https://github.com/otroshi/edgeface).

2.  **Load Checkpoint Weights**: The pre-trained weights for the model are then loaded from a checkpoint file.

3.  **Set to Evaluation Mode**: The model is set to evaluation mode to ensure that layers like dropout and batch normalization behave correctly during inference.

4.  **Create a Dummy Input**: A dummy input tensor with the correct shape (1, 3, 112, 112) is created to be used during the ONNX export process.

5.  **Export to ONNX**: Finally, the model is exported to the ONNX format using the `torch.onnx.export` function. This function takes the model, the dummy input, and a number of other parameters to control the export process.

Here's the Python script that was used to perform the conversion:

```python
import torch
import hubconf

MODEL_NAME = "edgeface_s_gamma_05"
CHECKPOINT_PATH = "./checkpoints/edgeface_s_gamma_05.pt"
ONNX_OUTPUT_PATH = "./edgeface_s_gamma_05.onnx"

INPUT_HEIGHT = 112
INPUT_WIDTH = 112

# ---------------------

print(f"Loading PyTorch model '{MODEL_NAME}'...")

# 1. Load the model architecture using the function from hubconf.py
#    `pretrained=False` ensures it doesn't try to download anything.
model = getattr(hubconf, MODEL_NAME)(pretrained=False)

# 2. Load local checkpoint weights into the model
checkpoint = torch.load(CHECKPOINT_PATH, map_location=torch.device('cpu'))
model.load_state_dict(checkpoint)

# 3. Set the model to evaluation mode
model.eval()

print("Model loaded successfully.")

dummy_input = torch.randn(1, 3, INPUT_HEIGHT, INPUT_WIDTH)

print(f"Exporting model to ONNX at '{ONNX_OUTPUT_PATH}'...")

# 5. Export the model to ONNX format
torch.onnx.export(
    model,
    dummy_input,
    ONNX_OUTPUT_PATH,
    export_params=True,
    opset_version=12,  # Using opset 12 for better compatibility
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={  # Optional: Allows for variable batch sizes
        'input': {0: 'batch_size'},
        'output': {0: 'batch_size'}
    }
)

print("\nConversion complete! ✅")
print(f"ONNX model saved to: {ONNX_OUTPUT_PATH}")
```
