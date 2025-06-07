import React from 'react';
import { ConversionAlgorithm } from '@/models/algorithms';
import AlgorithmBlockHeader from './AlgorithmBlockHeader';

type SimpleAlgorithmBlockProps = {
  idx: number;
  algorithm: ConversionAlgorithm;
  setEnabled: (idx: number, enabled: boolean) => void;
  removeAlgorithm: (index: number) => void;
};

const SimpleAlgorithmBlock = ({
  idx,
  algorithm,
  setEnabled,
  removeAlgorithm,
}: SimpleAlgorithmBlockProps) => {
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
    </div>
  );
};

export default SimpleAlgorithmBlock;
