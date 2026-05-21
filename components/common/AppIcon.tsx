import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

export type AppIconName =
  | 'activity'
  | 'alert-triangle'
  | 'bar-chart-3'
  | 'calendar-clock'
  | 'check-circle-2'
  | 'chevron-right'
  | 'clipboard-list'
  | 'dna'
  | 'droplets'
  | 'filter'
  | 'heart-pulse'
  | 'home'
  | 'line-chart'
  | 'plus'
  | 'search'
  | 'shopping-cart'
  | 'sparkles'
  | 'store'
  | 'tag'
  | 'trending-up'
  | 'user'
  | 'users'
  | 'x';

interface AppIconProps {
  name: AppIconName;
  color: string;
  size?: number;
  strokeWidth?: number;
}

export function AppIcon({ name, color, size = 24, strokeWidth = 2 }: AppIconProps): JSX.Element {
  return (
    <Svg
      fill="none"
      height={size}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      {renderIcon(name)}
    </Svg>
  );
}

function renderIcon(name: AppIconName): JSX.Element {
  switch (name) {
    case 'activity':
      return <Polyline points="3,12 7,12 10,4 14,20 17,12 21,12" />;
    case 'alert-triangle':
      return (
        <>
          <Path d="M12 3 22 20H2L12 3Z" />
          <Line x1="12" x2="12" y1="9" y2="13" />
          <Line x1="12" x2="12.01" y1="17" y2="17" />
        </>
      );
    case 'bar-chart-3':
      return (
        <>
          <Line x1="4" x2="4" y1="20" y2="10" />
          <Line x1="12" x2="12" y1="20" y2="4" />
          <Line x1="20" x2="20" y1="20" y2="14" />
        </>
      );
    case 'calendar-clock':
      return (
        <>
          <Rect height="17" rx="3" width="18" x="3" y="4" />
          <Line x1="8" x2="8" y1="2" y2="6" />
          <Line x1="16" x2="16" y1="2" y2="6" />
          <Line x1="3" x2="21" y1="10" y2="10" />
          <Path d="M12 14v3l2 1" />
        </>
      );
    case 'check-circle-2':
      return (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Path d="m8 12 2.5 2.5L16 9" />
        </>
      );
    case 'chevron-right':
      return <Path d="m9 18 6-6-6-6" />;
    case 'clipboard-list':
      return (
        <>
          <Rect height="17" rx="3" width="16" x="4" y="5" />
          <Path d="M9 5a3 3 0 0 1 6 0" />
          <Line x1="9" x2="15" y1="12" y2="12" />
          <Line x1="9" x2="15" y1="16" y2="16" />
        </>
      );
    case 'dna':
      return (
        <>
          <Path d="M17 3c-3 3-7 5-10 5" />
          <Path d="M7 21c3-3 7-5 10-5" />
          <Path d="M7 3c3 3 7 5 10 5" />
          <Path d="M17 21c-3-3-7-5-10-5" />
          <Line x1="8" x2="16" y1="8" y2="8" />
          <Line x1="8" x2="16" y1="16" y2="16" />
          <Line x1="10" x2="14" y1="12" y2="12" />
        </>
      );
    case 'droplets':
      return (
        <>
          <Path d="M12 3C8.7 7.1 7 10.2 7 13a5 5 0 0 0 10 0c0-2.8-1.7-5.9-5-10Z" />
          <Path d="M5 14c-1.3 1.7-2 3-2 4.1a3 3 0 0 0 6 0" />
        </>
      );
    case 'heart-pulse':
      return (
        <>
          <Path d="M20.8 8.6a5.2 5.2 0 0 0-8.3-4.2L12 5l-.5-.6a5.2 5.2 0 0 0-8.3 6.2L12 20l3.2-3.4" />
          <Path d="M15 12h2l1-2 2 5 1-3h1" />
        </>
      );
    case 'filter':
      return (
        <>
          <Line x1="4" x2="20" y1="6" y2="6" />
          <Line x1="7" x2="17" y1="12" y2="12" />
          <Line x1="10" x2="14" y1="18" y2="18" />
        </>
      );
    case 'home':
      return (
        <>
          <Path d="m3 10 9-7 9 7" />
          <Path d="M5 10v10h14V10" />
          <Path d="M10 20v-6h4v6" />
        </>
      );
    case 'line-chart':
      return (
        <>
          <Path d="M4 19V5" />
          <Path d="M4 19h16" />
          <Polyline points="6,15 10,11 13,13 18,7" />
        </>
      );
    case 'plus':
      return (
        <>
          <Line x1="12" x2="12" y1="5" y2="19" />
          <Line x1="5" x2="19" y1="12" y2="12" />
        </>
      );
    case 'search':
      return (
        <>
          <Circle cx="11" cy="11" r="7" />
          <Path d="m20 20-3.5-3.5" />
        </>
      );
    case 'shopping-cart':
      return (
        <>
          <Path d="M3 4h2l2 11h10l2-7H7" />
          <Circle cx="9" cy="20" r="1.5" />
          <Circle cx="17" cy="20" r="1.5" />
        </>
      );
    case 'sparkles':
      return (
        <>
          <Path d="M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" />
          <Path d="M19 3v4" />
          <Path d="M21 5h-4" />
        </>
      );
    case 'store':
      return (
        <>
          <Path d="M4 10h16l-1.2-5H5.2L4 10Z" />
          <Path d="M5 10v10h14V10" />
          <Path d="M9 20v-6h6v6" />
        </>
      );
    case 'tag':
      return (
        <>
          <Path d="M20 13 13 20 4 11V4h7l9 9Z" />
          <Circle cx="8.5" cy="8.5" r="1.5" />
        </>
      );
    case 'trending-up':
      return (
        <>
          <Path d="M4 17 10 11l4 4 6-8" />
          <Path d="M15 7h5v5" />
        </>
      );
    case 'user':
      return (
        <>
          <Circle cx="12" cy="8" r="4" />
          <Path d="M4 21a8 8 0 0 1 16 0" />
        </>
      );
    case 'users':
      return (
        <>
          <Circle cx="9" cy="8" r="3" />
          <Path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <Path d="M16 11a3 3 0 0 0 0-6" />
          <Path d="M17 20a5 5 0 0 0-3-4.6" />
        </>
      );
    case 'x':
      return (
        <>
          <Line x1="18" x2="6" y1="6" y2="18" />
          <Line x1="6" x2="18" y1="6" y2="18" />
        </>
      );
  }
}
