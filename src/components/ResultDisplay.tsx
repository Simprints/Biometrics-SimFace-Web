import React from "react";

// A common threshold for face similarity. You can adjust this value.
const SIMILARITY_THRESHOLD = 0.5;

type ResultDisplayProps = {
  similarity: number | null;
};

export default function ResultDisplay({ similarity }: ResultDisplayProps) {
  // If no comparison has been made, render the empty state.
  if (similarity === null) {
    return (
      <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg animate-fade-in">
        <p className="rounded-lg bg-gray-100 px-6 py-2 text-lg font-bold text-gray-500">
          Waiting
        </p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Select two images</p>
        </div>
      </div>
    );
  }

  // If a comparison result exists, render the result.
  const decision = similarity >= SIMILARITY_THRESHOLD ? "Match" : "No Match";
  const isMatch = decision === "Match";
  const score = similarity;

  return (
    <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg animate-fade-in">
      <p
        className={`rounded-lg px-6 py-2 text-xl font-bold transition-colors duration-300 ${
          isMatch ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {decision}
      </p>

      <div className="mt-4">
        <p className="text-sm text-gray-500">Match Score: {score.toFixed(4)}</p>
      </div>
    </div>
  );
}
