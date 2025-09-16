import * as tf from '@tensorflow/tfjs';
import { InferenceSession, Tensor } from 'onnxruntime-web';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import cvReadyPromise, { CV, Mat, Point } from '@techstark/opencv-js';

type ImageSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const MODEL_PATH = `${basePath}/models/edgeface_s_gamma_05.onnx`;
const MODEL_INPUT_SIZE = 112;

let onnxSession: InferenceSession | null = null;
let landmarkDetector: faceLandmarksDetection.FaceLandmarksDetector | null = null;
let cv: CV | null = null;

export async function loadModels() {

  if (onnxSession && landmarkDetector && cv) {
    console.log('Models are already loaded.');
    return;
  }
  
  try {
    console.log('Loading models...');
  
    [cv, onnxSession, landmarkDetector] = await Promise.all([
      cvReadyPromise,
      InferenceSession.create(MODEL_PATH, { executionProviders: ['wasm'] }),
      faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        { runtime: 'tfjs', refineLandmarks: false }
      )
    ]);
    console.log('All models loaded successfully.');
  } catch (error) {
    console.error('Failed to load models:', error);
  }
}

/**
 * Aligns a face from a source image to a standard 160x160 canvas.
 */
async function alignFace(imageSource: ImageSource): Promise<HTMLCanvasElement | null> {
  if (!landmarkDetector || !cv || !onnxSession) {
    throw new Error("Models not loaded.");
  }

  const predictions = await landmarkDetector.estimateFaces(imageSource);

  if (predictions.length === 0) {
    return null;
  }

  const keypoints = predictions[0].keypoints;
  
  const refPoints: Point[] = [
    new cv.Point(38.2946, 51.6963),
    new cv.Point(73.5318, 51.5014),
    new cv.Point(56.0252, 71.7366),
  ];
  
  const scale = MODEL_INPUT_SIZE / 112.0;
  const scaledRefPoints = refPoints.map(p => new cv!.Point(p.x * scale, p.y * scale));

  const srcPoints: Point[] = [
    new cv.Point(keypoints[33].x, keypoints[33].y),
    new cv.Point(keypoints[263].x, keypoints[263].y),
    new cv.Point(keypoints[1].x, keypoints[1].y),
  ];

  const srcMat = cv.matFromArray(3, 2, cv.CV_32F, srcPoints.flatMap(p => [p.x, p.y]));
  const refMat = cv.matFromArray(3, 2, cv.CV_32F, scaledRefPoints.flatMap(p => [p.x, p.y]));

  const transformMatrix: Mat = cv.getAffineTransform(srcMat, refMat);
  const srcImageMat: Mat = cv.imread(imageSource);
  const warpedImageMat = new cv.Mat();
  const outputSize = new cv.Size(MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);

  cv.warpAffine(
    srcImageMat, warpedImageMat, transformMatrix, outputSize,
    cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar()
  );

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = outputSize.width;
  outputCanvas.height = outputSize.height;
  cv.imshow(outputCanvas, warpedImageMat);

  // Clean up OpenCV memory
  srcImageMat.delete();
  warpedImageMat.delete();
  transformMatrix.delete();
  srcMat.delete();
  refMat.delete();

  return outputCanvas;
}

/**
 * Takes a raw image, aligns the face, and computes an embedding.
 */
export async function getEmbedding(image: ImageSource): Promise<tf.Tensor | null> {
  if (!onnxSession || !landmarkDetector) {
    console.error('Models not loaded. Call loadModels() first.');
    return null;
  }

  const alignedFaceCanvas = await alignFace(image);

  if (!alignedFaceCanvas) {
    console.warn("Could not align face, skipping embedding.");
    return null;
  }

  const tensor = tf.tidy(() => {
    return tf.browser.fromPixels(alignedFaceCanvas)
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims(0)
      .transpose([0, 3, 1, 2]);;
  });

  const onnxTensor = new Tensor('float32', tensor.dataSync(), tensor.shape);
  const feeds = { [onnxSession.inputNames[0]]: onnxTensor };
  
  const results = await onnxSession.run(feeds);
  const outputTensor = results[onnxSession.outputNames[0]];

  const embedding = tf.tensor(outputTensor.data as Float32Array, [...outputTensor.dims]);
  
  tensor.dispose();

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

  aNorm.dispose();
  bNorm.dispose();
  dotProduct.dispose();

  return similarity;
}