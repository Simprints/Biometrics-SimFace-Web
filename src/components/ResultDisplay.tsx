import React from 'react';

type Result = {
  score: number;
  decision: 'Match' | 'No-Match' | 'Error';
};

type ResultDisplayProps = {
  result: Result | null;
};

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  if (!result) return null;

  const isMatch = result.decision === 'Match';

  return (
    <div className="mt-12 w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800">Result</h3>
      <div className="mt-4">
        <p className="text-lg text-gray-600">Comparison Score:</p>
        <p className="text-4xl font-mono font-bold text-gray-900">
          {result.score.toFixed(4)}
        </p>
      </div>
      <div className="mt-6">
        <p
          className={`rounded-full px-6 py-2 text-xl font-bold ${
            isMatch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {result.decision}
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;