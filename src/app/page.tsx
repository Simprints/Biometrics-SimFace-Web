"use client";

import { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ResultDisplay from '@/components/ResultDisplay';
import { loadModel, getEmbedding, cosineSimilarity } from '../lib/faceApi';

export default function Home() {
  // State for the two images to be compared
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);

  // State to hold the similarity score
  const [similarity, setSimilarity] = useState<number | null>(null);
  
  // State for loading and error messages
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);

  // Load the ONNX model when the component mounts
  useEffect(() => {
    async function initModel() {
      try {
        await loadModel();
        setIsModelLoading(false);
      } catch (err) {
        setError('Failed to load the AI model. Please refresh the page.');
        setIsModelLoading(false);
      }
    }
    initModel();
  }, []);

  // Handler for the "Compare" button
  const handleCompare = async () => {
    if (!image1 || !image2) {
      setError('Please upload both images before comparing.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSimilarity(null);

    try {
      // Create HTMLImageElement objects from the base64 strings
      const img1Element = document.createElement('img');
      img1Element.src = image1;
      await new Promise((resolve) => { img1Element.onload = resolve; });
      
      const img2Element = document.createElement('img');
      img2Element.src = image2;
      await new Promise((resolve) => { img2Element.onload = resolve; });

      // Get embeddings for both images
      const embedding1 = await getEmbedding(img1Element);
      const embedding2 = await getEmbedding(img2Element);

      if (embedding1 && embedding2) {
        // Calculate the cosine similarity
        const sim = cosineSimilarity(embedding1, embedding2);
        setSimilarity(sim);
      } else {
        setError('Could not generate embeddings for the images.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during the comparison.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render a loading message while the model is being prepared
  if (isModelLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800">Loading AI Model...</h1>
        <p className="text-gray-600">This may take a moment.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">SimFace Demo</h1>
        <p className="text-lg text-gray-600 mb-8">
          Upload two images to calculate how similar the faces are.
        </p>

        <div className="mt-12 flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:justify-around">
          <ImageUploader onImageUpload={setImage1} />
          <ImageUploader onImageUpload={setImage2} />
        </div>

        <div className="mt-12" />
          <button
            onClick={handleCompare}
            disabled={!image1 || !image2 || isLoading}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isLoading ? 'Comparing...' : 'Compare Faces'}
          </button>
        </div>
        {/* Display Error Messages */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        
        {/* Display the Result */}
        {similarity !== null && <ResultDisplay similarity={similarity} />}
    </main>
  );
}