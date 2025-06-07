export enum ConversionAlgorithmType {
  Invert = 'invert',
  Grayscale = 'grayscale',
  HotPixelRemoval = 'hot_pixel_removal',
}

export type Grayscale = { type: ConversionAlgorithmType.Grayscale };
export type Invert = { type: ConversionAlgorithmType.Invert };
export type HotPixelRemoval = {
  type: ConversionAlgorithmType.HotPixelRemoval;
  lowPercentile: number;
  highPercentile: number;
};

export type ConversionAlgorithm = (Grayscale | Invert | HotPixelRemoval) & {
  enabled: boolean;
};

export const getAlgorithmName = (type: ConversionAlgorithmType) => {
  switch (type) {
    case ConversionAlgorithmType.Invert:
      return 'Invert';
    case ConversionAlgorithmType.Grayscale:
      return 'Grayscale';
    case ConversionAlgorithmType.HotPixelRemoval:
      return 'Hot Pixel Removal';
    default:
      return 'Unknown Algorithm';
  }
};

export const defaultAlgorithm = (
  type: ConversionAlgorithmType
): ConversionAlgorithm => {
  switch (type) {
    case ConversionAlgorithmType.Invert:
      return { type, enabled: false };
    case ConversionAlgorithmType.Grayscale:
      return { type, enabled: false };
    case ConversionAlgorithmType.HotPixelRemoval:
      return {
        type,
        enabled: false,
        lowPercentile: 0.1,
        highPercentile: 99.9,
      };
    default:
      throw new Error('Unknown algorithm type');
  }
};
