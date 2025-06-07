import React from 'react';
import { ConversionAlgorithm, GaussianBlur } from '@/models/algorithms';
import AlgorithmBlockHeader from './AlgorithmBlockHeader';

type GaussianBlurBlockProps = {
  idx: number;
  algorithm: GaussianBlur & { enabled: boolean };
  setEnabled: (idx: number, enabled: boolean) => void;
  updateAlgorithm: (
    index: number,
    updates: Partial<ConversionAlgorithm>
  ) => void;
  removeAlgorithm: (index: number) => void;
  moveUp: (idx: number) => void;
  moveDown: (idx: number) => void;
  isFirst: boolean;
  isLast: boolean;
};

const GaussianBlurBlock = ({
  idx,
  algorithm,
  setEnabled,
  removeAlgorithm,
  updateAlgorithm,
  moveUp,
  moveDown,
  isFirst,
  isLast,
}: GaussianBlurBlockProps) => (
  <div className="relative flex w-full flex-col border rounded p-3 mb-1">
    <AlgorithmBlockHeader
      idx={idx}
      algorithm={algorithm}
      setEnabled={setEnabled}
      removeAlgorithm={removeAlgorithm}
      moveUp={moveUp}
      moveDown={moveDown}
      isFirst={isFirst}
      isLast={isLast}
    />
    <div className="flex gap-4 mt-2">
      <label>
        Sigma:
        <input
          type="number"
          min={0.1}
          step={0.1}
          className="ml-2 border rounded px-1 w-20"
          value={algorithm.sigma}
          onChange={(e) => {
            const val = Number(e.currentTarget.value);
            updateAlgorithm(idx, { sigma: isNaN(val) ? 0.1 : val });
          }}
        />
      </label>
    </div>
  </div>
);

export default GaussianBlurBlock;
