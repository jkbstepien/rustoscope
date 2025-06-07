import React from 'react';
import {
  ConversionAlgorithm,
  ConversionAlgorithmType,
} from '@/models/algorithms';
import SimpleAlgorithmBlock from './SimpleAlgorithmBlock';
import HotPixelsRemovalBlock from './HotPixelsRemovalBlock';

type AlgorithmBlockProps = {
  idx: number;
  algorithm: ConversionAlgorithm;
  setEnabled: (idx: number, enabled: boolean) => void;
  updateAlgorithm: (
    index: number,
    updates: Partial<ConversionAlgorithm>
  ) => void;
  removeAlgorithm: (index: number) => void;
};

const AlgorithmBlock = ({
  idx,
  algorithm,
  setEnabled,
  removeAlgorithm,
  updateAlgorithm,
}: AlgorithmBlockProps) => {
  switch (algorithm.type) {
    case ConversionAlgorithmType.Invert:
    case ConversionAlgorithmType.Grayscale:
      return (
        <SimpleAlgorithmBlock
          idx={idx}
          algorithm={algorithm}
          setEnabled={setEnabled}
          removeAlgorithm={removeAlgorithm}
        />
      );
    case ConversionAlgorithmType.HotPixelRemoval:
      return (
        <HotPixelsRemovalBlock
          idx={idx}
          algorithm={algorithm}
          setEnabled={setEnabled}
          removeAlgorithm={removeAlgorithm}
          updateAlgorithm={(index, updates) =>
            updateAlgorithm(index, updates as Partial<ConversionAlgorithm>)
          }
        />
      );
  }
};

export default AlgorithmBlock;
