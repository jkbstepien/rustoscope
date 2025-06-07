import React from 'react';
import { ConversionAlgorithm, MedianBlur } from '@/models/algorithms';
import AlgorithmBlockHeader from './AlgorithmBlockHeader';

type MedianBlurBlockProps = {
  idx: number;
  algorithm: MedianBlur & { enabled: boolean };
  setEnabled: (idx: number, enabled: boolean) => void;
  updateAlgorithm: (
    index: number,
    updates: Partial<ConversionAlgorithm>
  ) => void;
  removeAlgorithm: (index: number) => void;
};

const MedianBlurBlock = ({
  idx,
  algorithm,
  setEnabled,
  removeAlgorithm,
  updateAlgorithm,
}: MedianBlurBlockProps) => (
  <div className="relative flex w-full flex-col border rounded p-3 mb-1">
    <AlgorithmBlockHeader
      idx={idx}
      algorithm={algorithm}
      setEnabled={setEnabled}
      removeAlgorithm={removeAlgorithm}
    />
    <div className="flex gap-4 mt-2">
      <label>
        Kernel radius:
        <input
          type="number"
          min={1}
          step={1}
          className="ml-2 border rounded px-1 w-20"
          value={algorithm.kernelRadius}
          onChange={(e) => {
            const val = Number(e.currentTarget.value);
            updateAlgorithm(idx, { kernelRadius: isNaN(val) ? 1 : val });
          }}
        />
      </label>
    </div>
  </div>
);

export default MedianBlurBlock;
