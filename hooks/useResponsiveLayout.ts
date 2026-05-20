import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { layout, spacing } from '@/constants/theme';

export function useResponsiveLayout(): {
  width: number;
  height: number;
  isTiny: boolean;
  isNarrow: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isUltraWide: boolean;
  horizontalPadding: number;
  maxContentWidth: number;
  contentWidth: number;
  centered: {
    alignSelf: 'center';
    maxWidth: number;
    width: '100%';
  };
} {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isTiny = width < 360;
    const isNarrow = width < 390;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    const isDesktop = width >= 1024;
    const isWide = width >= 1280;
    const isUltraWide = width >= 1600;
    const horizontalPadding = isTiny ? spacing.md : isMobile ? spacing.lg : isTablet ? spacing.xl : spacing['2xl'];
    const maxContentWidth = isUltraWide
      ? layout.wideContentWidth
      : isWide
        ? layout.maxContentWidth
        : isDesktop
          ? 1080
          : isTablet
            ? 900
            : width;
    const contentWidth = Math.max(Math.min(width, maxContentWidth) - horizontalPadding * 2, 1);

    return {
      width,
      height,
      isTiny,
      isNarrow,
      isMobile,
      isTablet,
      isDesktop,
      isWide,
      isUltraWide,
      horizontalPadding,
      maxContentWidth,
      contentWidth,
      centered: {
        alignSelf: 'center' as const,
        maxWidth: maxContentWidth,
        width: '100%' as const,
      },
    };
  }, [height, width]);
}
