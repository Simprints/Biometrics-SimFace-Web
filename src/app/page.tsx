"use client"; // This is required for interactivity

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ResultDisplay from '@/components/ResultDisplay';

// Define a type for the result state
type Result = {
  score: number;
  decision: 'Match' | 'No-Match' | 'Error';
};

export default function Home() {
  const [comparisonResult, setComparisonResult] = useState<Result | null>(null);

  const handleCompare = () => {
    // TODO: Implement the full comparison logic here
    alert('Comparison logic goes here!');

    // For demonstration, we'll set a dummy result
    setComparisonResult({
      score: 0.92,
      decision: 'Match',
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">SimFace Demo</h1>
        <p className="mt-2 text-lg text-gray-600">
          Upload two facial images to compare them.
        </p>
      </div>

      <div className="mt-12 flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:justify-around">
        <ImageUploader title="Face 1" />
        <ImageUploader title="Face 2" />
      </div>

      <div className="mt-12">
        <button
          onClick={handleCompare}
          className="rounded-lg bg-blue-600 px-12 py-4 text-xl font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Compare Faces
        </button>
      </div>

      {comparisonResult && <ResultDisplay result={comparisonResult} />}
    </main>
  );
}