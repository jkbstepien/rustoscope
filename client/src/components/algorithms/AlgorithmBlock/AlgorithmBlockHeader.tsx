import React from 'react';
import { getAlgorithmName } from '@/models/algorithms';
import { AlgorithmBlockProps } from '.';

const AlgorithmBlockHeader = ({
  idx,
  algorithm,
  setEnabled,
  removeAlgorithm,
  moveUp,
  moveDown,
  isFirst,
  isLast,
}: Omit<AlgorithmBlockProps, 'updateAlgorithm'>) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={algorithm.enabled}
          onChange={(e) => setEnabled(idx, e.currentTarget.checked)}
          className="accent-green-600 w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-green-400 transition-colors duration-150"
        />
        <span className="font-semibold">
          {getAlgorithmName(algorithm.type)}
        </span>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => moveUp(idx)}
          disabled={isFirst}
          className={`px-2 py-1 rounded bg-gray-200 ${
            isFirst
              ? 'opacity-30 cursor-default'
              : 'hover:bg-gray-300 cursor-pointer'
          }`}
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => moveDown(idx)}
          disabled={isLast}
          className={`px-2 py-1 rounded bg-gray-200 ${
            isLast
              ? 'opacity-30 cursor-default'
              : 'hover:bg-gray-300 cursor-pointer'
          }`}
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-7 aspect-square rounded-md bg-red-100 hover:bg-red-500 hover:text-white text-red-500 transition-colors duration-150 shadow"
          onClick={() => removeAlgorithm(idx)}
          title="Remove"
          aria-label="Remove"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AlgorithmBlockHeader;
