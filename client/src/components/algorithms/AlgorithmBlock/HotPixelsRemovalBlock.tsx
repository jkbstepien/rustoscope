import React from 'react';
import { ConversionAlgorithm, HotPixelRemoval } from '@/models/algorithms';
import AlgorithmBlockHeader from './AlgorithmBlockHeader';

type AlgorithmBlockProps = {
  idx: number;
  algorithm: HotPixelRemoval & { enabled: boolean };
  setEnabled: (idx: number, enabled: boolean) => void;
  updateAlgorithm: (
    index: number,
    updates: Partial<ConversionAlgorithm>
  ) => void;
  removeAlgorithm: (index: number) => void;
};

const HotPixelsRemovalBlock = ({
  idx,
  algorithm,
  setEnabled,
  removeAlgorithm,
  updateAlgorithm,
}: AlgorithmBlockProps) => {
  return (
    <div
      key={idx}
      className="relative flex w-full flex-col border rounded p-3 mb-1"
    >
      <AlgorithmBlockHeader
        idx={idx}
        algorithm={algorithm}
        setEnabled={setEnabled}
        removeAlgorithm={removeAlgorithm}
      />
      <div className="flex gap-4 mt-2">
        <label>
          Low Percentile:
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            className="ml-2 border rounded px-1 w-20"
            value={algorithm.lowPercentile}
            onChange={(e) =>
              updateAlgorithm(idx, {
                lowPercentile: Number(e.currentTarget.value),
              })
            }
          />
        </label>
        <label>
          High Percentile:
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            className="ml-2 border rounded px-1 w-20"
            value={algorithm.highPercentile}
            onChange={(e) =>
              updateAlgorithm(idx, {
                highPercentile: Number(e.currentTarget.value),
              })
            }
          />
        </label>
      </div>
    </div>
  );
};
export default HotPixelsRemovalBlock;
