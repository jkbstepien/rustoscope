import React from 'react';
import { ConversionAlgorithm } from '@/models/algorithms';
import AlgorithmBlockHeader from './AlgorithmBlockHeader';
import { AlgorithmBlockProps } from '.';

const SimpleAlgorithmBlock = ({
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
    <div
      key={idx}
      className="relative flex w-full flex-col border rounded p-3 mb-1"
    >
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
    </div>
  );
};

export default SimpleAlgorithmBlock;
