import React from 'react';

// A common threshold for face similarity. You can adjust this value.
const SIMILARITY_THRESHOLD = 0.6;

type ResultDisplayProps = {
  similarity: number | null;
};

export default function ResultDisplay({ similarity }: ResultDisplayProps) {
  if (similarity === null) return null;

  const decision = similarity >= SIMILARITY_THRESHOLD ? 'Match' : 'No-Match';
  const isMatch = decision === 'Match';
  const score = similarity;

  return (
    <div className="mt-12 w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg animate-fade-in">
      <h3 className="text-2xl font-bold text-gray-800">Result</h3>
      <div className="mt-4">
        <p className="text-lg text-gray-600">Similarity Score:</p>
        <p className="text-4xl font-mono font-bold text-gray-900">
          {score.toFixed(4)}
        </p>
      </div>
      <div className="mt-6">
        <p
          className={`rounded-full px-6 py-2 text-xl font-bold transition-colors duration-300 ${
            isMatch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {decision}
        </p>
      </div>
    </div>
  );
};