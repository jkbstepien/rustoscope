import React, { useState, useRef } from 'react';
import {
  ConversionAlgorithmType,
  ConversionAlgorithm,
  HotPixelRemoval,
  defaultAlgorithm,
  getAlgorithmName,
} from '@/models/algorithms';
import AlgorithmBlock from '@/components/algorithms/AlgorithmBlock';

type AlgorithmsContainerProps = {
  algorithms: ConversionAlgorithm[];
  setAlgorithms: React.Dispatch<React.SetStateAction<ConversionAlgorithm[]>>;
};

const AlgorithmsContainer = ({
  algorithms,
  setAlgorithms,
}: AlgorithmsContainerProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const addAlgorithm = (type: ConversionAlgorithmType) => {
    setAlgorithms((prev) => [...prev, defaultAlgorithm(type)]);
    setMenuOpen(false);
  };

  const removeAlgorithm = (idx: number) => {
    setAlgorithms((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateAlgorithm = (
    idx: number,
    updated: Partial<ConversionAlgorithm>
  ) => {
    setAlgorithms((prev) =>
      prev.map((alg, i) => {
        if (i !== idx) return alg;
        switch (alg.type) {
          case ConversionAlgorithmType.Invert:
          case ConversionAlgorithmType.Grayscale:
            return { ...alg, enabled: updated.enabled ?? alg.enabled };
          case ConversionAlgorithmType.HotPixelRemoval:
            return {
              ...alg,
              enabled: updated.enabled ?? alg.enabled,
              lowPercentile:
                (updated as HotPixelRemoval).lowPercentile !== undefined
                  ? (updated as HotPixelRemoval).lowPercentile
                  : alg.lowPercentile,
              highPercentile:
                (updated as HotPixelRemoval).highPercentile !== undefined
                  ? (updated as HotPixelRemoval).highPercentile
                  : alg.highPercentile,
            };
          default:
            return alg;
        }
      })
    );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const enabledAlgorithms = algorithms.filter((a) => a.enabled);
    console.log('Submitted algorithms:', enabledAlgorithms);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {algorithms.length === 0 && (
        <div className="text-gray-500 flex w-full justify-center">
          <span className="italic">No algorithms added yet.</span>
        </div>
      )}
      {algorithms.map((algorithm, idx) => (
        <AlgorithmBlock
          key={idx}
          algorithm={algorithm}
          idx={idx}
          setEnabled={(i, enabled) => updateAlgorithm(i, { enabled: enabled })}
          removeAlgorithm={removeAlgorithm}
          updateAlgorithm={updateAlgorithm}
        />
      ))}

      {/* Add algorithm section with hover menu */}
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          className="px-3 pt-1 bg-blue-500 text-white rounded text-lg w-full"
          onClick={() => setMenuOpen((v) => !v)}
          title="Add algorithm"
        >
          +
        </button>
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute left-0 top-10 z-10 bg-white border rounded shadow-md flex flex-col min-w-[180px]"
          >
            {Object.values(ConversionAlgorithmType).map((type) => (
              <button
                type="button"
                className="px-4 py-2 hover:bg-blue-100 text-left"
                onClick={() => addAlgorithm(type)}
              >
                {getAlgorithmName(type)}
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default AlgorithmsContainer;
