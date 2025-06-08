export enum ConversionAlgorithmType {
  Invert = 'invert',
  Grayscale = 'grayscale',
  HotPixelRemoval = 'hot_pixel_removal',
  GaussianBlur = 'gaussian_blur',
  MedianBlur = 'median_blur',
}

export type Grayscale = { type: ConversionAlgorithmType.Grayscale };
export type Invert = { type: ConversionAlgorithmType.Invert };
export type HotPixelRemoval = {
  type: ConversionAlgorithmType.HotPixelRemoval;
  lowPercentile: number;
  highPercentile: number;
};
export type GaussianBlur = {
  type: ConversionAlgorithmType.GaussianBlur;
  sigma: number;
};
export type MedianBlur = {
  type: ConversionAlgorithmType.MedianBlur;
  kernelRadius: number;
};

export type ConversionAlgorithm = (
  | Grayscale
  | Invert
  | HotPixelRemoval
  | GaussianBlur
  | MedianBlur
) & {
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
    case ConversionAlgorithmType.GaussianBlur:
      return 'Gaussian Blur';
    case ConversionAlgorithmType.MedianBlur:
      return 'Median Blur';
    default:
      return 'Unknown Algorithm';
  }
};

export const defaultAlgorithm = (
  type: ConversionAlgorithmType
): ConversionAlgorithm => {
  switch (type) {
    case ConversionAlgorithmType.Invert:
      return { type, enabled: true };
    case ConversionAlgorithmType.Grayscale:
      return { type, enabled: true };
    case ConversionAlgorithmType.HotPixelRemoval:
      return {
        type,
        enabled: true,
        lowPercentile: 5.0,
        highPercentile: 95.0,
      };
    case ConversionAlgorithmType.GaussianBlur:
      return {
        type,
        enabled: true,
        sigma: 2.0,
      };
    case ConversionAlgorithmType.MedianBlur:
      return {
        type,
        enabled: true,
        kernelRadius: 2,
      };
    default:
      throw new Error('Unknown algorithm type');
  }
};
