import * as tf from '@tensorflow/tfjs';
import { InferenceSession, Tensor } from 'onnxruntime-web';

// FIX #1: Update the model input size
const MODEL_PATH = '/models/facenet.onnx';
const MODEL_INPUT_SIZE = 160; // Corrected from 112 to 160

let session: InferenceSession | null = null;

/**
 * Loads the ONNX model using ONNX Runtime.
 */
export async function loadModel() {
  if (session) {
    console.log('Model is already loaded.');
    return;
  }
  try {
    console.log('Loading ONNX model...');
    session = await InferenceSession.create(MODEL_PATH, {
      executionProviders: ['wasm'],
    });
    console.log('ONNX model loaded successfully.');
  } catch (error) {
    console.error('Failed to load ONNX model:', error);
  }
}

/**
 * Pre-processes an image and runs inference to get an embedding.
 */
export async function getEmbedding(image: HTMLImageElement): Promise<tf.Tensor | null> {
  if (!session) {
    console.error('Model not loaded.');
    return null;
  }

  // 1. Pre-process the image with TensorFlow.js
  const tensor = tf.browser.fromPixels(image)
    .resizeBilinear([MODEL_INPUT_SIZE, MODEL_INPUT_SIZE]) // Now uses 160x160
    .toFloat()
    .div(tf.scalar(255.0))
    .expandDims(0);
    
  // FIX #2: Remove the transpose line. The shape is now [1, 160, 160, 3]
  // tensor = tensor.transpose([2, 0, 1]).expandDims(0); // This line is removed

  // 2. Convert to ONNX Tensor
  const onnxTensor = new Tensor('float32', tensor.dataSync(), tensor.shape);
  const feeds = { [session.inputNames[0]]: onnxTensor };

  // 3. Run Inference
  const results = await session.run(feeds);
  const outputTensor = results[session.outputNames[0]];

  // 4. Convert output back to a TensorFlow.js Tensor for similarity calculation
  const embedding = tf.tensor(outputTensor.data as Float32Array, [...outputTensor.dims]);
  
  tensor.dispose(); // Clean up the input tensor

  return embedding;
}

/**
 * Calculates the cosine similarity between two embeddings.
 */
export function cosineSimilarity(a: tf.Tensor, b: tf.Tensor): number {
  const aNorm = a.norm();
  const bNorm = b.norm();
  const dotProduct = a.dot(b.transpose());
  
  const similarity = dotProduct.div(aNorm.mul(bNorm)).dataSync()[0];
  
  // Dispose of tensors to free up memory
  a.dispose();
  b.dispose();
  aNorm.dispose();
  bNorm.dispose();
  dotProduct.dispose();

  return similarity;
}